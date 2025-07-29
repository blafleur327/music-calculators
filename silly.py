import numpy

def cents(frequency1: float, frequency2: float) -> float:
    '''Returns the cents Equal Temperament difference between two frequencies.'''
    return numpy.log2((frequency2/frequency1))*1200;

def harmonics(fundamental: float,limit: int = 32) -> dict: 
    '''Returns a set number of harmonics above a given fundamental frequency.'''
    res = {};
    for i in range(1, limit+1):
        res[i] = fundamental * i;
    return res;

def equal_temperament(foundation: float = 27.5,tones: int = 12,partial: int = 2) -> dict:
    '''Returns a dictionary of frequencies in an equal tempered scale.'''
    res = {};
    for i in range(tones+1):
        res[i] = foundation * partial**(i/tones);
    return res;

Bohlen_Pierce = equal_temperament(55, 13, 3);

