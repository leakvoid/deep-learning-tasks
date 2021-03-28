import math

def basic_sigmoid(x):
    """
    Compute sigmoid of x.

    Arguments:
    x -- A scalar

    Return:
    s -- sigmoid(x)
    """

    s = 1 / ( 1 + math.exp(-x) )
    
    return s

print( "sigmoid(x): " + str(basic_sigmoid(3)) )
