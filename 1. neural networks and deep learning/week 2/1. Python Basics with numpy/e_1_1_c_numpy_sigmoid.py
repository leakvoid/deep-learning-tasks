import numpy as np

def sigmoid(x):
    """
    Compute the sigmoid of x

    Arguments:
    x -- A scalar or numpy array of any size

    Return:
    s -- sigmoid(x)
    """

    s = 1 / ( 1 + np.exp(-x) )

    return s

x = np.array([1, 2, 3])
print( "sigmoid(x): " + str(sigmoid(x)) )
