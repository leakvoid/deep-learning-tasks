import e_1_1_c_numpy_sigmoid as sgm
import numpy as np

def sigmoid_derivative(x):
    """
    Compute the gradient (also called the slope or derivative) of the sigmoid function with respect to its input x.
    You can store the output of the sigmoid function into variables and then use it to calculate the gradient.
    
    Arguments:
    x -- A scalar or numpy array

    Return:
    ds -- Your computed gradient.
    """

    s = sgm.sigmoid(x)
    ds = s * (1 - s)
    return ds

x = np.array([1, 2, 3])
print( "sigmoid_derivative(x): " + str(sigmoid_derivative(x)) )
