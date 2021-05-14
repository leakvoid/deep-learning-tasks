import numpy as np

def normalizeRows(x):
    """
    Implement a function that normalizes each row of the matrix x (to have unit length).
    
    Argument:
    x -- A numpy matrix of shape (n, m)
    
    Returns:
    x -- The normalized (by row) numpy matrix. You are allowed to modify x.
    """

    print("shape x: " + str(np.shape(x)))
    x_norm = np.linalg.norm(x, ord = 2, axis = 1, keepdims = True) # norm: sqrt(x1 + ... + xn) by row
    print("x_norm: " + str(x_norm))
    print("shape x_norm: " + str(np.shape(x_norm)))

    x = x / x_norm

    return x

x = np.array([
    [0, 3, 4],
    [1, 6, 4]])

print("normalizeRows(x) = " + str(normalizeRows(x)))
