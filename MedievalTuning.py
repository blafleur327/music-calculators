import numpy
import scamp

syntonic_comma = numpy.log2((81/80))*1200;
'''The distance between the 5-Limit Just M3 (5:4) and the Pythagorean M3 (81:64). In cET.'''

pythagorean_comma = numpy.log2(((3/2)**12)*2**-7)*1200;
'''The distance between 12 perfect 5ths (3:2)^12*(2^-7) minus 7 octaves and a true octave (2:1). In cET.'''

diesis = numpy.log2((128/125))*1200;
'''The modern Pythagorean Diesis. In cET.'''

pythagorean_intervals = {
    'P4': (2/3)*2**(2**1),
    'P5': 3/2,
    'M2': (3/2)**2/(2**1),
    'M6': (3/2)**3/(2**1),
    'M3': (3/2)**4/(2**2),
    'M7': (3/2)**5/(2**2),
    'A4': (3/2)**6/(2**3),
    'AU': (3/2)**7/(2**4),
    'A5': (3/2)**8/(2**4),
    'A2': (3/2)**9/(2**5),
    'A6': (3/2)**10/(2**5),
}



def temperament_factor(interval:float = 4/3,pieces: int = 30,cents:bool = False) -> float:
    '''Returns the unit of change required for a specific tuning. Default to a 4th into 30 parts.'''
    if cents == False:
        return interval**(1/pieces);
    else:
        return numpy.log2(interval**(1/pieces))*1200;

aristoxenus_tone = numpy.log2(((3/2)/(4/3)))*1200;
'''Equivalent to 9:8'''

dieses = {
    'enharmonic_diesis': float(numpy.log2(128/125)*1200),
    'chromatic_diesis': float(numpy.log2((256/243)**(1/2)**1.5)*1200),
    '31EDO_diesis': float(temperament_factor(2,31,True)),
    'semitone_a': float(numpy.log2(256/243)*1200),
    'minor_semitone': float(numpy.log2(18/17)*1200),
    'major_semitone': float(numpy.log2(17/16)*1200),
}
'''A dictionary containing the various small intervals described in various treatises.'''

def playJND(freq: float,cET: float = 100):
    '''Play an interval in cET above the supplied freq.'''

summed4th = numpy.log2(((9/8)**2)*(256/243))*1200;


def equal_temperament(start:float = 220,units:int = 12,partial: int = 2) -> dict:
    '''Returns a dictionary containing values of each step in a given equal temperament system.'''
    res = {};
    for x in range(0,units+1):
        res[x] = start*partial**(x/units);
    res['increment'] = f'{round(numpy.log2(res[1]/res[0])*1200,2)} cET';
    return res['increment'];

def ratio(input: float) -> str:
    '''Returns the ratio of an input float in simplest terms''';
    rem = input;
    denom = None;
    numer = 0;
    for x in range(1,10000):
        temp = round((input*x),6) % 1 == 0;
        if temp == True:
            denom = x;
            break;
    while rem > .000001:
        rem-=1/denom;
        numer+=1;
    return f'{numer}:{denom}';

def ratio_to_cents(value: float) -> dict:
    '''Returns an object containing a ratio and the number of cET it comprises.''';
    res = {};
    res['ratio'] = ratio(value);
    res['cents'] = f'{round(numpy.log2(value)*1200,2)} cET';
    return res;

print(ratio_to_cents(128/125));
