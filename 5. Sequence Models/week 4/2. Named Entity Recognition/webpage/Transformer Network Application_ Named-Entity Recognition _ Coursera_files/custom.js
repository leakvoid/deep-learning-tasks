
let element = document.getElementById('save-close-notebook-button-group');
if (!element) {
    window._save_and_close = function(){
        IPython.notebook.save_checkpoint();
        IPython.notebook.session.delete();
        window.onbeforeunload = null
        setTimeout(function() {window.close();}, 1000)
    }
    let header = document.getElementById('maintoolbar-container');
    element = document.createElement("div");
    element.setAttribute("class", "btn-group");
    element.setAttribute("id", "save-close-notebook-button-group");
    element.setAttribute("align", "right");
    element.setAttribute("style", "float:right")
    element.innerHTML = '<button class="btn btn-default" title="Save and close this notebook." style="background-color:rgb(44, 115, 204); color:white; padding:4px 8px" onclick=window._save_and_close()>Save and close</button>'
    header.appendChild(element);
}
