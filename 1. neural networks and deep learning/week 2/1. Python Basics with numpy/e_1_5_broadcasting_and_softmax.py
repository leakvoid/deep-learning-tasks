import numpy as np

def softmax(x):
    """
    Calculates the softmax for each row of the input x.

    Your code should work for a row vector and also for matrices of shape (m,n).

    Argument:
    x -- A numpy matrix of shape (m,n)

    Returns:
    s -- A numpy matrix equal to the softmax of x, of shape (m,n)
    """

    x_exp = np.exp(x)

    x_sum = np.sum(x_exp, axis = 1, keepdims = True)
    print("x_sum: " + str(x_sum))

    s = x_exp / x_sum

    return s

x = np.array([[9, 2, 5, 0, 0],
              [7, 5, 0, 0 ,0]])
print("softmax(x): " + str(softmax(x)))
