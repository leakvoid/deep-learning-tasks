define(['require', 'base/js/events'], function(require, events) {

  var submit_notebook_button_click = function() {
    var config = read_submission_schemas_config_localStorage();
    var schema_names = read_submission_schema_names_for_current_notebook(config);
    // TODO: consider using environment variable to get the assignment link
    var submission_page_url = "https://www.coursera.org";

    require(['jquery', 'base/js/dialog'], function($, dialog) {
      var body = $('<div/>')
        .append($('<span>Go to the assignment page in your course to see your submissions.</span>'))
        .append($('</br>'))
        .append($('</br>'))
        .append($('<span>Please note that submitting work that isn’t your own may result in permanent failure of this course or deactivation of your Coursera account.</span>'))
        .append($('</br>'))
        .append($('</br>'))
        .append($('<span> Submitting ... </span>'));

      dialog.modal({
        title: 'Submission Status',
        body: body,
        buttons: {
          'Ok': {}
        }
      });
      IPython.notebook.save_notebook().then(function() {
        execute_submission(function(out) {
          if ((out.content.name === "stdout" && out.content.text.trim() !== "")) {
            body.children().last().text(out.content.text);
          }
        }, '', schema_names);
      });
    });
  };

  var read_submission_schema_names_for_current_notebook = function(config) {
    var notebookPath = parse_notebook_path_from_URL();
    return config && config.hasOwnProperty(notebookPath) ? config[notebookPath] : [];
  }

  var parse_notebook_path_from_URL = function() {
    var encodedPath = window.location.pathname.split("/").slice(2).join("/");
    return decodeURIComponent(encodedPath);
  }

  var read_submission_schemas_config_localStorage = function() {
    var submission_token = read_submission_token_from_cookie();
    var rawObject = localStorage.getItem(submission_token + ".submissionSchemasConfig");
    return JSON.parse(rawObject);
  };

  var set_submission_schemas_config_localStorage = function(schemaConfig) {
    var submission_token = read_submission_token_from_cookie();
    var data = JSON.stringify(schemaConfig);
    localStorage.setItem(submission_token + ".submissionSchemasConfig", data);
  };

  var read_submission_token_from_cookie = function() {
    var value = document.cookie.replace(/(?:(?:^|.*;\s*)COURSERA_SUBMISSION_TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return value ? value : '';
  };

  var execute_submission = function(handle_result, schema_name, schema_names) {
    var callbacks = { 'iopub' : {'output' : handle_result}};
    var submission_token = read_submission_token_from_cookie();
    // convert schema names into string and escape quotes
    var schema_names_string = schema_names ? JSON.stringify(schema_names).replace(/[\""]/g, '\\"'): "[]";
    var expression =
      '%%python \n' +
      'from coursera.grading import submit \n' +
      'print(submit("' + submission_token + '", "' + schema_name + '", "' + schema_names_string + '"))';
    IPython.notebook.kernel.execute(expression, callbacks, {silent: false});
  };

  var fetch_latest_config = function(handle_result) {
    var callbacks = { 'iopub' : {'output' : handle_result}};
    var submission_token = read_submission_token_from_cookie();
    var expression =
      '%%python \n' +
      'from coursera.submissionSchemas import get \n' +
      'print(get("' + submission_token + '"))';
    IPython.notebook.kernel.execute(expression, callbacks, {silent: false});
  };

  var add_submit_button = function() {
    require(['jquery'], function ($) {
      var group_id = 'submit-notebook-button-group';
      var button_id = 'submit-notebook-button';
      IPython.toolbar.add_buttons_group([
        {
          'id'      : button_id,
          'label'   : 'Submit this notebook for grading.',
          'icon'    : 'fa-inbox', // overridden below
          'callback': submit_notebook_button_click
        }
      ],
      group_id);
      // Add text and set alignment for button
      $('#' + group_id).attr('style', 'float:right');
      $('#' + button_id)
        .attr('style', 'background-color:rgb(42, 115, 204); color:white; padding:4px 8px')
        .text('Submit Assignment');
    });
  };

  var remove_submit_button = function() {
    require(['jquery'], function ($) {
      var group_id = 'submit-notebook-button-group';
      var button_id = 'submit-notebook-button';
      // Add text and set alignment for button
      $('#' + group_id).attr('style', 'display: none');
    });
  };

  var process_latest_config = function(latest_config) {
    var stored_config = read_submission_schemas_config_localStorage();
    if (JSON.stringify(stored_config) !== JSON.stringify(latest_config)) {
      var stored_schema_names = read_submission_schema_names_for_current_notebook(stored_config);
      var latest_schema_names = read_submission_schema_names_for_current_notebook(latest_config);
      var has_stored_schema = Array.isArray(stored_schema_names) && stored_schema_names.length !== 0;
      var has_latest_schema = Array.isArray(latest_schema_names) && latest_schema_names.length !== 0;
      if (has_stored_schema && !has_latest_schema) {
        // Previously submission was enabled for notebook but now notebook is not configured for submission
        // so remove the submission button
        console.log('Notebook is no longer configured for submission. Removing submit button')
        remove_submit_button();
      }
      if (!has_stored_schema && has_latest_schema) {
        // Latest config has schemas for notebook so show show submit button
        add_submit_button();
      }
      set_submission_schemas_config_localStorage(latest_config);
    } 
  }

  var main = function() {
    console.log("Kernel is ready. Executing Nbgrader extension code");
    var stored_config = read_submission_schemas_config_localStorage();
    var schema_names = read_submission_schema_names_for_current_notebook(stored_config);
    if (Array.isArray(schema_names) && schema_names.length !== 0) {
      // Schema names exist
      add_submit_button();
    }
    fetch_latest_config(function(out) {
      var response = JSON.parse(out.content.text.trim());
      var data = response.elements;
      if (data) {
         var latest_config = data[0].submissionFilePathsToSchemaNames;
         process_latest_config(latest_config);
      } else {
        console.log("Error while fetching latest submission schema config:", response.message);
      }
    });
  }

  var load_ipython_extension = function() {
    console.log("Loading Nbgrader extension");
    require(['jquery'], function ($) {
      // Wait for kernel to load
      events.on("kernel_ready.Kernel", function () {
        main();
      });
    });
  };

  return {
    load_ipython_extension : load_ipython_extension,
  };
});
