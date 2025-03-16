// import * as methods from './pc_bc_methodsCopy.js';

// const { Scale } = require("tone");

let urls = {
    'Pareidolia': 'C:/Users/blafl/OneDrive/Desktop/updated/pcbcCalculatorV4.html?defaultState=%7B%22superset%22%3A%5B0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%5D%2C%22subset%22%3A%5B0%2C3%2C8%5D%2C%22setRepSuper%22%3A%7B%22universe%22%3A12%2C%22set%22%3A%5B0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%5D%7D%2C%22setRepSub%22%3A%7B%22universe%22%3A12%2C%22set%22%3A%5B0%2C3%2C8%5D%7D%2C%22transformations%22%3A%5B%5D%2C%22names%22%3Atrue%2C%22Superset+Complement%22%3Afalse%2C%22Subset+Complement%22%3Afalse%2C%22Clear+Superset%22%3Afalse%2C%22Clear+Subset%22%3Afalse%2C%22Play+Option%22%3Afalse%2C%22Modulus%22%3A12%7D',
}

/**
 * Load a page in a new window.
 * @param {url} destination 
 */
const myLoad = (destination) => {
    window.open(destination);
    //urlOperations('load');
}

let hf = `\uE284`;
let hs = `\uE282`; //??

/**
 * Contains the HTML escape characters for various accidentals.
 */
const Accidentals = {
    sharp: '♯',
    flat: '♭',
    halfSharp: '𝄲',
    halfFlat: '𝄳',
    natural: '♮',
};

const Notes = {
    //Might work with Bravura font
    seven: [
        `\uEF00`,
        `\uEF01`,
        `\uEF02`,
        `\uEF03`,
        `\uEF04`,
        `\uEF05`,
        `\uEF06`
    ],
    twelve: [
        'C',`C${Accidentals.sharp}/D${Accidentals.flat}`,
        `D`,`D${Accidentals.sharp}/E${Accidentals.flat}`,
        'E','F',
        `F${Accidentals.sharp}/G${Accidentals.flat}`,'G',
        `G${Accidentals.sharp}/A${Accidentals.flat}`,
        'A',`A${Accidentals.sharp}/B${Accidentals.flat}`,
        'B'],
    thirtyOne: [
        'C',`C${Accidentals.halfSharp}`,`C${Accidentals.sharp}`,
        `D${Accidentals.flat}`,`D${Accidentals.halfFlat}`,'D',`D${Accidentals.halfSharp}`,`D${Accidentals.sharp}`,
        `E${Accidentals.flat}`,`E${Accidentals.halfFlat}`,`E`,`E${Accidentals.halfSharp}`,`E${Accidentals.sharp}`,
        `F`,`F${Accidentals.halfSharp}`,`F${Accidentals.sharp}`,
        `G${Accidentals.flat}`,`G${Accidentals.halfFlat}`,`G`,`G${Accidentals.halfSharp}`,`G${Accidentals.sharp}`,
        `A${Accidentals.flat}`,`A${Accidentals.halfFlat}`,'A',`A${Accidentals.halfSharp}`,`A${Accidentals.sharp}`,
        `B${Accidentals.flat}`,`B${Accidentals.halfFlat}`,`B`,`C${Accidentals.flat}`,`C${Accidentals.halfFlat}`
    ]
}

/**
 * Series of methods useful for manipulating and dealing with arrays.
 */
const ArrayMethods = {
    /**
     * Pushes element into array provided it is not already present. (Prevents duplication);
     * @param {any} element 
     * @param {array} array 
     */
    conditionalPush: function (element,array) {
        array.indexOf(element) == -1? array.push(element) : array;
        return array;
    },
    /**
     * Returns array indexes that are included in indexes array.
     * @param {array} array Input to be filtered.
     * @param {array} indexes Indexes to keep.
     * @returns Filtered Array.
     */
    indexer: function (array,indexes) {
        let res = [];
        for (let a = 0; a < indexes.length; a++) {
            res.push(array[a]);
        }
        return res;
    },
    /**
     * Returns an indexed rotation of an input array. Optionally concatenate.
     * @param {array} array 
     * @param {int} index 
     * @param {boolean} concat 
     * @returns array || string
     */
    singleRotate: function (array,index,concat = false) {
        let res = [...array.slice(index),...array.slice(0,index)];
        return concat? res.join('|') : res;
    },
    unpack: (array) => {
        let res = [];
        for (let a = 0; a < array.length; a++) {
            res.push(...array[a]);
        }
        return res;
    },
/**
 * Returns all rotations of a given array. Optionally concatenate subarrays.
 * @param {array} array 
 * @param {boolean} concat 
 * @returns 2d array || 1d array ['str'];
 */
    rotations: function (array,concat = false) {
    let res = [];
    for (let a = 0; a < array.length; a++) {
        res.push(ArrayMethods.singleRotate(array,a,concat));
    }
    return res;
},

/**
 * Checks the two arrays to determine if one is an ordered rotation of the other. Can return the rotation index or a boolean.
 * @param {array} array1 
 * @param {array} array2 
 * @param {boolean} showIndex 
 * @returns int || boolean
 */
    isRotation: function (array1,array2,showIndex = false) {
        let opts = ArrayMethods.rotations(array2,true);
        let result = opts.indexOf(ArrayMethods.singleRotate(array1,0,true));
        return showIndex? result : result !== -1;
    },
    /**
     * Iterative algorithm for finding all indexes of a given element.
     * @param {array} array 
     * @param {any} element 
     * @returns Indexes
     */
    array_find: function (array,element) {  //O(n)
        let res = [];
        for (let a = 0; a < array.length; a++) {
            if (array[a] == element) {
                res.push(a);
            }
        }
        return res;
    },
    /**
     * Returns the all indexes of elements in the input array.
     * @param {array} array 
     * @param  {...any} elements 
     * @returns Array
     */
    get_many: function (array,...elements) {
        let res = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = 0; b < elements.length; b++) {
                if (array[a] == elements[b]) {
                    res.push(a);
                }
            }
        }
        return res;
    },
    /**
     * Concatenates an array, if array is 2d, concatenates each subarray.
     * @param {array} array 
     * @returns 1d array
     */
    array_concat: function (array) {
        if (typeof array[0] === 'object') {
            return array.map(x => x.join('|')); //Use the pipe to prevent confusion with decimal points.
        }
        else {
            return array.join('|');
        }
    },
    /**
     * Creates an array of size (elements) with pseudo-random numbers between min-max (inclusive).
     * @param {int} elements 
     * @param {int} min 
     * @param {int} max 
     * @returns array
     */
    random_array: function (elements,min,max) {
        let res = [];
        for (let a = 0; a < elements; a++) {
        res.push(Math.floor(Math.random()*(max-min+1))+min);
        }
        return res;
    },
    /**
     * Reverses an input array.
     * @param {array} array 
     * @returns reversed array
     */
    reverse: function (array) {
        return array.reverse();
    },
    /**
     * Search a 2d array for a subarray. Returns indexes.
     * @param {array} query 
     * @param {array} array 
     * @returns Indexes
     */
    search_subarrays: function (query,array) {
        let conc = ArrayMethods.array_concat(array);
        return ArrayMethods.array_find(conc,ArrayMethods.array_concat(query));
    },

    /**
     * Returns either the unique subarrays or the number of instances of each unique subarray. 
     * @param {array} array 
     * @param {boolean} ordered true: [a,b] != [b,a] false: [a,b] == [b,a]; 
     * @param {boolean} return_count Output shows unique elements and their count.
     * @param {boolean} return_indexes Outputs the indexes of unique transformations.
     * @returns Unique Subs || Counts.
     */
    unique_subarray: function (array,ordered = false,return_count = false,return_indexes = false) { //O(n * log(m))
        let step1 = ordered? array.map(sub => sub.join('|')) : array.map(sub => sub.sort((a,b) => a-b).join('|'));
        let elim = Array.from(new Set(step1));
        let inds = elim.map(x => step1.indexOf(x));
        if (return_indexes == true) {
            return inds;
        }
        else {
            if (return_count == false) {
                return inds.map(index => array[index]);
            }
            else {
                return inds.map(index => [array[index],this.get_many(step1,step1[index]).length]);
            }
        }
    },
    /**
     * Gets the same indexes from unique entries of array 1 in array 2.
     * @param {array} array1 
     * @param {array} array2 
     */
    symmetrical_removal: function (array1,array2) {
        let start = ArrayMethods.unique_subarray(array1,undefined,undefined,true);
        return ArrayMethods.indexer(array2,start);
    }
}

/**
 * Class filled with methods for combinatorics calculation.
 */
const Combinatorics = {
    /**
     * Recursively calculate n!
     * @param {int} n 
     * @param {int} res 
     * @returns n!
     */
    factorial: function (n,res = 1) {
        if (n == 1) {
            return res;
        }
        else {
            return this.factorial(n-1,res*n);
        }
    },
    /**
     * 
     * @param {int} universe m
     * @param {int} cardinality n
     */
    binomial_coefficient: function (universe,cardinality) {     //n = cardinality | m = universe
        return this.factorial(universe)/(this.factorial(cardinality)*this.factorial(universe-cardinality));
    },

    /**
     * Gets the Elements of size n within a given universe.
     * @param {int} universe 
     * @param {int} card 
     * @returns Powerset in Binary Representation.
     */
    binary_representation: function (universe,card) {
        let res = [];
        let count = 0;
        let max = parseInt(''.padStart(card,'1').padEnd(universe,'0'),2);   //Get value that starts with k 1s.
        for (let a = 2**card-1; a <= max; a++) {   
            let option = a.toString(2).padStart(universe,'0');
            let check = Array.from(option.match(/1/g)).length; //Does this modify the og string?
            if (check === card) {
                res.push(option);
            }
            count++;
        }
        return res;
    },

    /**
     * Returns elements from array that are 1 (True) in binary representation.
     * @param {array} array 
     * @param {string} bin 
     * @returns Array
     */
    picker: function (array, bin) {
        return array.filter((item, index) => bin[index] === '1');
    },

    /**
     * Returns all subsets of a given cardinality.
     * @param {array} superset 
     * @param {int} cardinality 
     * @returns Array
     */
    subsets: function (superset,cardinality) {
        let first = this.binary_representation(superset.length,cardinality);
        return first.map(z => this.picker(superset,z));
    }
}

/**
 * Constructor of the MySet class. Contains methods for set theoretical computation.
 * @param {int} modulus 
 * @param  {...any} elements 
 */
function MySet(modulus,...elements) {
    this.modulo = (value,modulus) => { //(2 operations per call);
        if (value >= 0) {
            return value%modulus;
        }
        else {
            return (value%modulus)+modulus;
        }
    }
    this.universe = modulus,
    this.set = Array.from(new Set(elements.map(x => this.modulo(x,this.universe)))).sort((a,b) => a-b), //3 operations
    this.interval_class = (value,modulus = this.universe) => {
        let opts = [this.modulo(value,modulus),this.modulo(modulus-value,modulus)];
            return Math.min(...opts);
        },
    /**
    * Returns the Adjacency Interval Series, or the intervals between consecutive elements in a given modular universe.
    * @param {array} array 
    * @param {int} modulus 
    * @returns array. 
    */
    this.ais = (array = this.set,modulus = this.universe) => {  //O(n) (Linear)
        let res = [];
        for (let a = 1; a < array.length; a++) {
            res.push(this.modulo(array[a]-array[a-1],modulus));
            }
        return res;
        },
    /**
     * 
     * @param {int} index 
     * @returns this.set -> t(n) mod this.universe.
     */
    this.transpose = function (array = this.set, modulus = this.universe, index = 0) {
        return array.map(x => this.modulo(x+index,modulus)); //O(n);
    },
    /**
     * 
     * @param {int} index 
     * @returns this.set -> t(n)I mod this.universe. 
     */
    this.invert = function (array = this.set,modulus = this.universe,index = 0) {
        return array.map(x => this.modulo(index-x,modulus)); //O(n);
        },
    /**
    * Generates the powerset of an input using bitwise operands. Faster than array manipulation method. Useful for large sets. 
    * @param {array} array 
    * @returns powerset
    */
    this.literal_subsets = (cardinality = null,array = this.set) => {   // O(2^n) //4+(2^n) operations. 
        let result = [];
        if (cardinality === null) {
            for (let a = 1; a <= array.length; a++) {
                result.push(...Combinatorics.subsets(array,a));
            }
        }
        else {
            result = Combinatorics.subsets(array,cardinality);
        }
        return result;
    },
    /**
     * There's a recursion depth issue here.
     * @param {array} array 
     * @param {int} mod 
     * @returns Literal Subsets in Prime Form.
     */
    this.abstract_subsets = (cardinality = null,uniques = false,array = this.set, mod = this.universe) => {    //2 additional operations.
        let start = this.literal_subsets(cardinality,array).filter(x => x.length > 2);
        let res = start.map(y => this.prime_form(y,mod)).sort((a,b) => a.length < b.length);
        return uniques? ArrayMethods.unique_subarray(res) : res;
    },
    /**
     * Normal order function using the Straus-Rahn Algorithm. Iterative implementation.
     * @param {array} array this.set
     * @param {*} mod this.universe
     * @returns Normal Order
     */
    this.normal_order = (array = this.set,mod = this.universe) => { // Total = O(n^2)
        let index = array.length-1; 
        let rotations = [...ArrayMethods.rotations(array.sort((a,b) => a-b))]; //n ops
        while (index > 0) {     //n
            let curr = [];
            for (let a = 0; a < rotations.length; a++) {    //n
                curr.push(this.modulo(rotations[a][index]-rotations[a][0],mod)); //1
            }
            let small = ArrayMethods.array_find(curr,Math.min(...curr)); //2 opers  Break upon finding single winner. Or If symmetrical return index 0.
            if (small.length == 1 || index == 0) {
                return rotations[small[0]];
            }
            else {      //Remove rotations not in small;
                rotations = small.map(x => rotations[x]); //n
            }
            index--;//1
        }
        return rotations[0];    //if rotations.length > 1 all are acceptabe Normal Orders.
    }
    /**
    * Returns the Prime Form of a set (Straus-Rahn)
    * @param {array} array 
    * @param {int} mod 
    * @returns Prime Form
    */
    this.prime_form = (array = this.set,mod = this.universe) => { // O(n);
        let norm = this.normal_order(array,mod);
        let options = [norm,this.normal_order(this.invert(norm))];  //1
        let intervals = options.map(x => this.ais(x,mod)); //n
        let round = 0;
        while (round < intervals[0].length) { //n-1;
            if (intervals[0][round] < intervals[1][round]) {
                return options[0].map(x => this.modulo(x-options[0][0],mod));
            }
            else if (intervals[0][round] > intervals[1][round]) {
                return options[1].map(x => this.modulo(x-options[1][0],mod));
            }
            else if (round == array.length-2) {
                return options[0].map(x => this.modulo(x-options[0][0],mod));
            }
            else {
                round++;
            }
        }
    },
    /**
     * Generates the ICV of an input set. The sum of all intervals between constituent members. Essentially a summary of invariant tones under transposition. Holds true for all members of set class.
     * @param {array} array 
     * @param {int} mod 
     * @returns Interval Class Vector 
     */
    this.interval_class_vector = (array = this.set,mod = this.universe) => {    //n^2)/2
        let collect = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = a+1; b < array.length; b++) {
                collect.push(this.modulo(array[b]-array[a],mod));//2
            }
        }
        let vector = [];
        for (let a = 1; a <= Math.floor(mod/2); a++) {
            if (a == Math.ceil(mod/2)) {
                vector.push(ArrayMethods.array_find(collect,a).length);
            }
            else {
                vector.push(ArrayMethods.array_find(collect,a).length+ArrayMethods.array_find(collect,mod-a).length)
            }
        }
        return vector;
    },
    /**
     * Returns the IV of an input set. This is a summary of the number of invariant tones under inversion. As such it is unique to each T or I in a set class.
     * @param {array} array 
     * @param {int} mod 
     * @returns Index Vector
     */
    this.index_vector = (array = this.set,mod = this.universe) => { // n^2+n+2
        let collect = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = 0; b < array.length; b++) {
                collect.push(this.modulo(array[b]+array[a],mod));
            }
        }
        let vector = [];
        for (let a = 0; a < mod; a++) {
            vector.push(ArrayMethods.array_find(collect,a).length);
        }
        return vector;
    }
    /**
     * Returns all transpositions and inversions of a given set as an object literal.
     * @param {array} array 
     * @param {int} modulus 
     * @returns Set Class
     */
    this.set_class = (array = this.set,modulus = this.universe,eliminateDuplicates = false) => {
        let result = {};
        for (let a = 0; a < modulus; a++) {
            result['T'+a] = this.normal_order(array.map(x => this.modulo(x+a,modulus)),modulus);
            result['I'+a] = this.normal_order(array.map(y => this.modulo(a-y,modulus)),modulus);
        }
        if (eliminateDuplicates == true) {
            result = ArrayMethods.unique_subarray(result);
        }
        return result;
    },
    /**
     * Determines if two input arrays have any meaningful PC relationship. It the sets are the same cardinality, test
     *  for T/I and Z relation. If the two sets are not the same cardinality, tests for literal and abstract (Prime Form) inclusionary relationship.
     * @param {array} array1 
     * @param {array} array2 
     * @param {int} modulus 
     * @returns Relationship
     */
    this.compare_set = (array1, array2 = this.set,modulus = this.universe) => {
        let no1 = this.normal_order(array1,modulus); 
        let no2 = this.normal_order(); 
        if (array1.length == array2.length) {   //Transposition or Inversional Equivalence.
            let sc = this.set_class(no2,modulus);
            let res = null;
            for (value in sc) { 
                if (ArrayMethods.array_concat(sc[value]) == ArrayMethods.array_concat(no1)) {
                    res = value;
                }
            }
            if (res === null) { //Z relation
                if (ArrayMethods.array_concat(this.interval_class_vector(array2,modulus)) == ArrayMethods.array_concat(this.interval_class_vector(array1,modulus)) == true) {
                    res = `[${array1}] and [${array2}] are Z related.`;
                }
                else {
                    res = 'No Relationship.';
                }
            }
            return res;
        }
        else {      //Not same cardinality. Maybe Move this up?
            let sizes = [no1,no2].sort((a,b) => a.length - b.length); //sizes[0] = short sizes[1] = long;
            let subs = {
                'Literal': this.literal_subsets(null,sizes[1]).map(x => this.normal_order(x,modulus)),
                'Abstract': this.abstract_subsets(sizes[1],modulus)
                };
            let checkLits = ArrayMethods.search_subarrays(sizes[0],subs['Literal']).length;
            let checkAbs = ArrayMethods.search_subarrays(this.prime_form(sizes[0]),subs['Abstract']).length;
            if (checkLits > 0) {
                return `[${sizes[0]}] is a literal subset of [${sizes[1]}].`;
            }
            else if (checkLits == 0 && checkAbs > 0) {
                return `[${sizes[0]}] is an abstract subset of [${sizes[1]}]. Contained ${checkAbs} times.`;
            }
            else {
                return 'No inclusionary relationship.'
            }
        }
    },
    /**
     * Determines if the input set is or is not maximally even within the parent modulus. May change modulus.
     * @returns Boolean
     */
    this.maximallyEven = (modifiedUniverse = this.universe) => {
        let uni = modifiedUniverse == this.universe? this.universe : ScaleTheory.proportionalModuloConversion(this.set,this.universe,modifiedUniverse);
        let is = ScaleTheory.maximallyEven(this.set,uni,false);
        return is;
    }
    this.displayProperties = (...info) => {
        let result = {};
        let options = {
            'Normal Form': this.normal_order(),
            'Prime Form': this.prime_form(),
            'Interval Class Vector': this.interval_class_vector(),
            'Index Vector': this.index_vector(),
            'Maximally Even': `${this.set.length} into ${this.universe}: ${this.maximallyEven()}`,
            'Literal Subsets': this.literal_subsets(),
            'Abstract Subsets': this.abstract_subsets()
        }
        info.forEach(item => {
            let regex = new RegExp(item,'ig');
            for (key in options) {
                if (key.match(regex)) {
                    result[key] = options[key];
                }
            }
        })
        return result;
    },
    /**
     * Find axes of symmetry within a set.
     * @param {array} array 
     * @param {int} modulus 
     * @returns Axes of Symmetry
     */
    this.symmetry = (array = this.set,modulus = this.universe) => {
        let res = [];
        let test = array.length > 0? array.sort((r,s) => r-s).reduce((f,k) => f+'|'+k) : null;
        for (let a = 0; a < modulus; a++) {
            if (array.length !== 0) {
                let opt = this.invert(array,modulus,a).sort((i,j) => i-j).reduce((l,m) => l+'|'+m);
                opt == test? res.push([a/2,(a/2)+(modulus/2)]): null;
            }
        }
        return res;
    }
    /**
     * Creates a stringified object with specific values.
     */
    this.exportable = (json = false) => {
        let obj = {
            'Set': this.set,
            'Normal Order': this.normal_order(),
            'Prime Form': this.prime_form(),
            'Interval Class Vector': this.interval_class_vector(),
            'Index Vector': this.index_vector(),
            'Maximally Even': `${this.set.length} into ${this.universe}: ${this.maximallyEven()}`
        };
        return json? JSON.stringify(obj) : obj;
    } 
};

/**
 * Calculates the centroid of an irregular polygon.
 * @param {array} array [x,y]; 
 */
const centroid = (array) => {
    let area = 0;
    let Cx = 0, Cy = 0;
    for (let a = 0; a < array.length; a++) {
        let xa = array[a][0];
        let ya = array[a][1];
        let xnext = array[(a+1)%array.length][0];
        let ynext = array[(a+1)%array.length][1];
        let factor = (xa*ynext)-(ya*xnext);
        area+=factor;
        Cx += (xa+xnext) *factor;
        Cy += (ya+ynext) *factor;
    }
    area = Math.abs(area)/2;
    Cx/=(6*area);
    Cy/=(6*area);
    return [Cx*2,Cy*2];
}

/**
 * Methods used for Scale Theoretical calculations. Dependent upon the updated ArrayMethods class.
 */
const ScaleTheory = {
    /**
     * Returns a boolean of if the input is prime.
     * @param {int} value 
     * @returns Boolean
     */
    prime: function (value) {
        let res = [];
        let i = 1;
        while (i <= value/i) {
            value%i == 0? res.push(i,value/i) : null;
            i++;
        }
        return res.length == 2;
    },
    /**
     * Returns a value mod n.
     * @param {int} value 
     * @param {int} modulus 
     * @returns value mod modulus; 
     */
    modulo: function (value,modulus) {
        return value >=0? value%modulus : (value%modulus)+modulus; 
    },
    /**
     * Gets adjacency interval series of an input set. 
     * @param {array} array 
     * @param {int} modulus 
     * @param {boolean} octave
     * @returns array -> AIS. 
     */
    ais: function (array,modulus,octave = false) {
        let res = [];
        octave? array.push(array[0]) : undefined;   //Double octave depending on bool.
        for (let a = 1; a < array.length; a++) {
            res.push(ScaleTheory.modulo(array[a]-array[a-1],modulus));
        }
        return res;
    },
    /**
     * Generates a well formed collection from various parameters.
     * @param {int} start Integer that collection starts on.
     * @param {int} interval Interval to be applied recursively.
     * @param {int} cardinality Limit to number of elements.
     * @param {int} universe Modulus.
     * @returns Array -> Well Formed Collection (Numerical, not scale order.)
     */
    generate: function (start = 0, interval,cardinality,universe = 12) {
        let result = [];
        for (let a = 0; a < cardinality; a++) {
            result.push((start+(interval*a)));
        }
        return result.map(element => element%universe).sort((a,b) => a-b);  //Sorted numerically.
    },
    /**
     * Determines if an input set is or is not well-formed. Can produce the generator.
     * @param {array} array 
     * @param {int} universe 
     * @param {boolean} returnGenerator
     * @returns Boolean || Generator
     */
    isWellFormed: function (array,universe,returnGenerator = false) {
        array = array.slice().sort((a,b) => a-b);    //Put in ascending order
        let ints = ScaleTheory.ais(array,universe,true);
        let generator = 1; 
        let allWF = [];
        while (generator <= universe/2) {   //Only need to test half of the universe.
            let wf = [];
            for (let a = 0; a < array.length-1; a++) {
                wf.push(ScaleTheory.modulo(a*generator,universe));
            }
            wf.sort((a,b) => a-b);
            allWF.push(ScaleTheory.ais(wf,universe,true));
            generator++;
        } 
        let temp = allWF.map(elem => ArrayMethods.isRotation(elem,ints));   //Check if any subarrays are a rotation of the original ais.
        return returnGenerator? temp.indexOf(true)+1 : temp.indexOf(true) !== -1; 
    },
    /**
     * Determines if an input set is or is not degenerate. (That is that its generating interval is a factor of the universe)
     * @param {array} array 
     * @param {int} universe 
     * @returns boolean
     */
    degenerate: function (array,universe) {
        let step1 = ScaleTheory.isWellFormed(array,universe)? ScaleTheory.isWellFormed(array,universe,true) : false;
        if (typeof(step1) == 'number') {
            return factors(universe).indexOf(step1) !== -1;
        }
        else {
            return step1;
        } 
    },
    /**
     * Determines if an input array has the property of cardinality equals variety.
     * @param {array} array 
     * @param {int} universe 
     * @returns boolean
     */
    cv: function (array,universe) {
        let d = array.length;
        let c = universe;
        if (ScaleTheory.prime(d) == true) {
            return d <= (Math.floor(c/2)+1);    //Formula by Clough and Meyerson;
        }
        else {
            return false;
        }
    },
    /**
     * Generates the AIS or indexes of true values of a maximally even distribution of size n within a given universe.
     * @param {int} sub 
     * @param {int} universe 
     * @param {boolean} setOut 
     * @returns Array [Indexes of True values] || Array [AIS];
     */
    maxEvenInts: function (sub,universe,setOut = true) {
        let bin = [0];
        let temp = [];
        for (let a = 1; a < universe+1; a++) {
            temp.push(Math.floor((a*sub)/universe));
        }
        for (let b = 1; b < temp.length; b++) {
            temp[b] != temp[b-1]? bin.push(1) : bin.push(0);
        }
        return setOut? ArrayMethods.array_find(bin,1).map(x => x-1) :ScaleTheory.ais(ArrayMethods.array_find(bin,1),universe,true);
    },

    /**
     * Can either test if an array is maximally even or generate a maximally even set the size of the input array starting on 0.
     * @param {array} array 
     * @param {int} universe 
     * @param {boolean} generate 
     * @returns boolean || array
     */
    maximallyEven: function (array,universe,generate = false) {
        let copy = [...new Set(array.sort((a,b) => a-b))];
        if (copy.length == universe) {
            return generate? copy : true;
        }
        let bin = ScaleTheory.maxEvenInts(copy.length,universe,generate);  //Variable output depending on next steps.
        if (generate == false) {    //Test input for ME property. -> Boolean
            return ArrayMethods.isRotation(ScaleTheory.ais(copy,universe,true),bin);   
        }
        else {  //Generate options -> Array.
            let result = ArrayMethods.rotations(bin);
            result.map(x => {
                let first = x[0];   
                for (let i = 0; i < x.length; i++) {
                    x[i] = ScaleTheory.modulo(x[i]-first,universe); //Transpose each rotation to zero.
                }
                x.slice().sort((a,b) => a-b);
            })
            return ArrayMethods.unique_subarray(result);    //Eliminate duplicates if present.
        }
    },
    /**
     * Converts elements from one modulus to another proportionally.
     * @param {array} array 
     * @param {int} universeIn 
     * @param {int} universeOut 
     * @returns elements converted proportionally
     */
    proportionalModuloConversion: function (array,universeIn,universeOut) {
        return array.map(element => Math.round((element*universeOut)/universeIn));
    },
    myhillsProperty: function (array,universe) { //Still not 100% sure how this is different from CV...
        return ScaleTheory.maximallyEven(array,universe)? ArrayFrom(new Set(ScaleTheory.ais(array,modulus,true))).length == 2: false;
    }
}

const palindrome = (array) => {
    let res = 0;
    for (let a = 0; a < array.length; a++) {
        if (array[a] == array[array.length-(a+1)]) {
            res++;
        }
    }
    return res==array.length;
}

/**
 * Checks the sup array for all elements of sub.
 * @param {array} sub 
 * @param {array} sup 
 * @returns boolean
 */
const isLiteral = (sub,sup) => {
    let res = sub.map(x => sup.indexOf(x) !== -1);
    return res.every(x => x);
}

/**
 * Simplified way to determine at what T/I levels a superset contains a subset at. Optionally plot individual sets. 
 * @param {array} sub 
 * @param {array} sup 
 * @param {int} modulus 
 * @returns Array
 */
const isAbstract = (sub,sup,modulus,showUniques = false) => {
    let res = [];
    let sc = new MySet(modulus,...sub).set_class();
    for (let key in sc) {
        isLiteral(sc[key],sup)? res.push(key) : null;
    }
    return [res,res.map(x => sc[x])];   //[0] = transformations [1] == actual sets.
}

function MyPlay () {
    this.synth = new Tone.Synth().toDestination();
    this.startPitch = 220*(2**(3/12));  //Start on C4!;
    this.tempo = 120;
    let ioi = 1/(this.tempo/60);
    this.partitions = currentData.Modulus;
    let playData = [];
    urlOperations('change');
    /**
     * An EDO tuning with of modulus size.
     */
    let tuning = {};
    for (let a = 0; a < this.partitions; a++) {
        tuning[a] = this.startPitch*2**(a/this.partitions);
    } 
    document.querySelectorAll('.playable').forEach(elem => {  //This needs to be modified to account for the new group elements
        elem.addEventListener('mousedown',() => {
            if (elem.id == 'subsetPoly') {
                playData = currentData.subset
            }
            /**
             * Polygon is the superset
             */
            else if (elem.id == 'supersetPoly') {
                playData = currentData.superset
            }
            /**
             * Polygon is a transformation
             */
            else {
                playData = currentData.setRepSub.set_class()[elem.id.match(/[IT0-9]+/g)];
            }
            this.play();
        })
    })
    /**
     * Trigger synth according to set parameters.
     */
    this.play = () => {
        let now = Tone.now();
        Tone.start(now);
        let multiple = null;
        /**
         * If Pitch selected.
         */
        if (currentData['Play Option'] == false) {
            multiple = playData.length;
            for (let a = 0; a < playData.length; a++) {
                let currentNode = nodes[playData[a]].self;
                
                setTimeout(() => {
                    currentNode.classList.add('playing');
                }, ioi * a * 1000); // Delay to match the note onset
    
                this.synth.triggerAttackRelease(tuning[playData[a]],ioi,now+(ioi*a));
    
                setTimeout(() => {
                    currentNode.classList.remove('playing');
                }, (ioi * 1000) + (ioi * a * 1000)); // Convert ioi to milliseconds and add delay
            }
        }
        /**
         * If a rhythm selected.
         */
        else {
            let reps = 4;
            let faster = ioi/4;//????
            for (let a = 0; a < currentData['Modulus']*reps; a++) {
                let metPitch = a%currentData['Modulus'] == 0 ? this.startPitch*2 : this.startPitch;
                multiple = currentData['Modulus'];
                let currentNode = nodes[a%currentData['Modulus']].self;

                setTimeout(() => {
                    currentNode.classList.add('playing');
                }, faster * a * 1000); // Delay to match the note onset

                playData.indexOf(a%currentData['Modulus']) == -1? null: this.synth.triggerAttackRelease(metPitch,faster,now+(faster*a));

                setTimeout(() => {
                    currentNode.classList.remove('playing');
                }, (faster * 1000) + (faster * a * 1000)); // Convert ioi to milliseconds and add delay
            }
        }
    }
    /**
     * Ensure no synths remain on page!
     */
    if (synths.length !== 0) {
        synths.forEach(elem => {
            elem.synth.dispose();
        })
        synths = [];
    }
    synths.push(this);
}

/**
 * Modifies the current url or loads a page from the given url.
 * @param {string} operation 'change' || 'load' 
 */
const urlOperations = (operation = 'change') => {
    let stateName = 'defaultState';
    if (!currentData) {
        console.log(`currentData is empty!`);
    }
    else if (operation == 'change') {
        let params = new URLSearchParams(window.location.search);
        params.set(stateName,JSON.stringify(currentData));
        window.history.replaceState({},'',`${window.location.pathname}?${params}`);
    }
    else if (operation == 'load') {
        let params = new URLSearchParams(window.location.search);
        let state = params.get(stateName)? JSON.parse(params.get(stateName)) : null;
        currentData = state;
        /**
         * Recreate Page;
         */
        K.redraw();
    }
    else {
        console.error("Operation must be 'change' or 'load'");
    }
}

/**
 * Creates a single input element.
 * @param {string} name 
 * @param {string} type 'number' || 'button'
 * @param {string} message 
 * @param {string} parent element id 
 */
const buildInput = (name,type,message,parent = 'inputs') => {
    let par = document.getElementById(parent);
    let cont = document.createElement('div');
    cont.setAttribute('class','single');
    cont.setAttribute('id',`${name}`);
    let lab = document.createElement('h4');
    let inp;
    if (type == 'number') {
        inp = document.createElement('input');
        inp.setAttribute('type','number');
        inp.setAttribute('placeholder','Enter to Submit');
        inp.addEventListener('keydown',(event) => {
            /**
             * If enter, submit data to collection object.
             */
            if (event.key == 'Enter') {
                let regex = /[0-9]+/g;
                let data = parseInt(inp.value.match(regex));
                document.querySelectorAll('.transform').forEach(item => {
                    item.remove();
                })
                currentData[`${name}`] = data;
                currentData.subset = [];
                currentData.superset = [];
                currentData.transformations = [];
                val.innerHTML = data;
                K.redraw();
            }
        })
        lab.innerHTML = `${name}:`;  
    }
    else {
        inp = document.createElement('button');
        if (name == 'Superset Complement' || name == 'Subset Complement') {
            lab.innerHTML = name == 'Superset Complement'? 'Superset:' : 'Subset:';
        }
        else if (name == 'Clear Subset' || name == 'Clear Superset') {
            null;
        }
        else if (name == 'Note Names') {
            cont.classList.add('void');
        }
        else {
            lab.innerHTML = `${name}:`;
        }
        inp = document.createElement('button');
        inp.innerHTML = name == 'Play Option'? 'Pitch' : `${name}`;
        currentData[`${name}`] = false;
    }
    let val = document.createElement('p');
    inp.id = `inp${document.querySelectorAll('input, button').length}`;
    lab.textContent == ''? null : cont.appendChild(lab);
    cont.appendChild(inp);
    type == 'number'? cont.appendChild(val) : null;
    par.appendChild(cont);
    nodeMessage(`${inp.id}`,message);
}

/**
 * Attaches relevant event listeners to each input item.
 */
const attachEventListeners = () => {
    document.querySelector('#Superset\\ Complement > button').addEventListener('mousedown',() => {
        currentData.superset = [];
        currentData.subset = [];
        currentData.transformations = [];
        nodes.forEach(item => {
            item.superset = !item.superset;
            item.superset == false? item.subset = false : null;
            console.log(`${item.data}? => ${item.superset}`);
            item.superset == true? currentData.superset.push(item.value) : null;
            item.subset == true? currentData.subset.push(item.value) : null;
        });
        K.redraw();
    })
    document.querySelector('#Subset\\ Complement > button').addEventListener('mousedown',() => {
        currentData.subset = [];
        currentData.transformations = [];
        nodes.forEach(item => {
            if (item.superset == true) {
                item.subset = !item.subset;
                item.subset == true? currentData.subset.push(item.value) : null;
            }
        })
        K.redraw();
    })
    document.querySelector('#Clear\\ Superset > button').addEventListener('mousedown',() => {
        currentData.superset = [];
        currentData.subset = [];
        currentData.transformations = [];
        nodes.forEach(item => {
            item.superset = false;
            item.subset = false;
        })
        document.querySelectorAll('.transform').forEach(item => {
            item.remove();
        })
        K.redraw();
    })
    document.querySelector('#Clear\\ Subset > button').addEventListener('mousedown',() => {
        currentData.subset = [];
        currentData.transformations = [];
        nodes.forEach(item => {
            item.subset = false;
        })
        document.querySelectorAll('.transform').forEach(item => {
            item.remove();
        })
        K.redraw();
    })
    document.querySelector('#Play\\ Option > button').addEventListener('mousedown',() => {
        currentData['Play Option'] = !currentData['Play Option'];
        document.querySelector('#Play\\ Option > button').innerHTML = currentData['Play Option']? 'Rhythm' : 'Pitch';
    })
    // document.querySelector('#Note\\ Names > button').addEventListener('mousedown',() => {
    //     let self = document.querySelector('#Note\\ Names');
    //     if (currentData['Modulus'] == 12 || currentData['Modulus'] == 31) {
    //         self.classList.remove('void');
    //         K.noteNames();
    //     }
    //     else {
    //         self.classList.add('void');
    //     }
    // })
}

/**
 * Fills a selected HTML element with the content of the object.
 * @param {object} obj
 * @param {string} parent Element ID
 */
const fromObject = (obj,parent) => {
    let par = document.getElementById(parent);
    par.innerHTML = '';
    for (let [key,value] of Object.entries(obj)) {
        let row = document.createElement('div');
        row.setAttribute('class','myRow');
        let k = document.createElement('div');
        k.innerHTML = `${key}: `;
        let v = document.createElement('div');
        if (key == 'Set') {
            v.innerHTML = ` {${value}}`;
        }
        else if (key == 'Normal Order') {
            v.innerHTML = ` [${value}]`;
        }
        else if (key == 'Prime Form') {
            v.innerHTML = ` (${value})`;
        }
        else if (key == 'Interval Class Vector' || key == 'Index Vector') {
            v.innerHTML = ` <${value}>`;
        }
        else if (key == 'Maximally Even') {
            v.innerHTML = value;
        }
        row.appendChild(k);
        row.appendChild(v);
        par.appendChild(row);
    }
}

/**
 * Computes positions of verticies for an equilateral shape with n points. 
 * @param {array} center [x,y] 
 * @param {int} numPoints number of equidistant points
 * @param {float} length diameter length
 * @returns 
 */
const getPoints = (center,numPoints,length = 50) => {
    let allAngles = 360/numPoints;      //(180*(numPoints-2))/numPoints is really interesting!
    let vertices = [];
    for (let a = 0; a < numPoints; a++) {
        let angle = ((a*allAngles) -90) * Math.PI/180;  //-90 sets top element to 0;
        let x = center[0] + length * Math.cos(angle);
        let y = center[1] + length * Math.sin(angle);
        vertices.push([x, y]);
    }
    return vertices;
}
/**
 * Select elements in the polygon manually, optionally choose superset or subset.
 * @param {boolean} subset 
 * @param  {...any} elements 
 */
const manualSelector = (subset = false,...elements) => {
    elements.forEach(item => {
        if (subset == true) {
            currentData.subset.push(...elements);
        }
        else {
            currentData.superset.push(...elements);
        }
    })
    K.redraw();
}

/**
 * An object that controls various aspects of the dynamic drawing.
 * @param {string} parent HTML Element id 
 * @param {float} sizeX Width of drawframe
 * @param {float} sizeY Height of drawframe
 */
function Drawing (parent = undefined,sizeX = 500,sizeY = 500) { //CHANGE TO 500!
    /**
     * If no SVG object exists in parent.
     */
    this.draw = null;
    this.center = [sizeX/2,sizeY/2];
    let parentElem = document.getElementById(parent);
    if (parentElem !== undefined && parentElem.textContent == '') {
        console.log(`#${parent} exists but is empty!`);
    }
    else if (parentElem !== undefined && parentElem.textContent !== '') {
        console.log(`#${parent} exists and is filled!`);
    }
    else {
        let div = document.createElement('div');
        div.id = `drawing`;
        console.log(`#${parent} does not exist!`);
    }
    this.draw = SVG().addTo(`#${parent}`).size(sizeX,sizeY);
    this.bigOuter;
    this.clear = () => {
        /**
         * Remove nodes, but not polygons!;
         */
        document.querySelectorAll('.myNode, .symmline').forEach(elem => {
            elem.remove();
        })
        /**
         * Clear nodes array.
         */
        nodes = [];
    }
    this.supersetPolygon = this.draw.polygon();
    this.supersetPolygon.node.id = 'supersetPoly';
    this.supersetPolygon.addClass('playable');
    this.subsetPolygon = this.draw.polygon();
    this.subsetPolygon.node.id = 'subsetPoly';
    this.subsetPolygon.addClass('playable');
    /**
     * Manages the transformations drawn and the button containers!
     */
    this.manageTransformations = () => {
        //Make a clause to count the unique transformations of each.
        document.querySelectorAll('.trans').forEach(elem => {
            elem.remove();
        })
        let superElements = currentData.setRepSuper.set;
        let options = currentData.setRepSub.set_class(); //Retrieve from currentData object!
        let ts = document.createElement('div');
        ts.setAttribute('class','trans');
        ts.id = 'transposition';
        let thead = document.createElement('h3');
        ts.appendChild(thead);
        let is = document.createElement('div');
        is.setAttribute('class','trans');
        is.id = 'inversion';
        let ihead = document.createElement('h3');
        is.appendChild(ihead);
        let allTs = [];
        let allIs = [];
        /**
         * Contains all transformations of the subset that are contained within the superset.
         */
        let filt = {};
        for (let [key,value] of Object.entries(options)) {
            let check = 0;
            value.forEach(elem => {
                superElements.indexOf(elem) !== -1? check++ : null;
            })
            let valid = check == value.length;
            if (valid == true) {
                filt[key] = value;
                let but = document.createElement('button');
                but.id = `${key}`;
                but.innerHTML = `${key}: [${value}]`;
                but.classList.add('transButton');
                /**
                 * Add event listeners to handle generation and plotting of new polygons
                 */
                but.addEventListener('mousedown',() => {
                    console.log(`${key} clicked!`);
                    /**
                     * Remove all current .transform polygons on click!
                     */
                    document.querySelectorAll('.transform').forEach(item => {
                        item.remove();
                    })
                    /**
                     * Update classes and update items in currentData.
                     */
                    if (currentData['transformations'].indexOf(key) !== -1) {
                        currentData['transformations'] = currentData['transformations'].filter(x => x !== key);
                    }
                    else {
                        currentData['transformations'].push(key);
                    }
                    K.redraw();
                    })
                if (key[0] == 'T') {
                    ts.appendChild(but);
                    allTs.push(value);
                }
                else {
                    is.appendChild(but);
                    allIs.push(value);
                }
            }
        }
        let tUnique = ArrayMethods.unique_subarray(allTs).length;
        let iUnique = ArrayMethods.unique_subarray(allIs).length;
        thead.innerHTML = `Tn: ${tUnique}`;
        ihead.innerHTML = `TnI: ${iUnique}`;
        document.getElementById('inputs').appendChild(ts);
        document.getElementById('inputs').appendChild(is);
        document.querySelectorAll('.transButton').forEach(button => {
            nodeMessage(`${button.id}`,`[${currentData['subset']}] => ${button.id}.`)
        })
    }
    /**
     * Updates the drawing.
     */
    this.redraw = () => {
        this.clear();
        //Node Locations
        let locations = getPoints([...K.center],currentData.Modulus,200);    //Remover ternary clauses
        //Possible Symmetry points;
        this.bigOuter = getPoints([...K.center],currentData.Modulus*2,230);  //Same as prev
        /**
         * Remove drawing children
         */
        for (let a = 0; a < locations.length; a++) {
            /**
            * Create Nodes.
            */
            if (currentData['names'] == false) {
                new MyNode(locations[a][0],locations[a][1],a,K);
            }
            /**
             * If note names selected.
             */
            else {
                let key
                if (locations.length == 12) {
                    key = 'twelve';
                }
                else if (locations.length == 31) {
                    key = 'thirtyOne';
                }
                else if (locations.length == 7) {
                    key = 'seven';
                }
                new MyNode(locations[a][0],locations[a][1],Notes[key][a],K,45);
            }
        }
        currentData.superset.sort((a,b) => a-b);
        currentData.subset.sort((a,b) => a-b);
        let superCoords = [];
        let subCoords = [];
        currentData.superset.forEach(index => {
            nodes[index].superset = true;
            superCoords.push([nodes[index].x,nodes[index].y]);
        })
        currentData.subset.forEach(index => {
            nodes[index].subset = true;
            subCoords.push([nodes[index].x,nodes[index].y]);
        })
        /**
         * Check node elements for changes. ForEach loop ensures clockwise iteration.
         */
        nodes.forEach(element => {
            element.superset == true? element.self.classList.add('inSuper') : element.self.classList.remove('inSuper');
            element.subset == true? element.self.classList.add('inSub') : element.self.classList.remove('inSub');
        })
        this.supersetPolygon.plot(superCoords);
        this.subsetPolygon.plot(subCoords);
        currentData.setRepSuper = new MySet(currentData.Modulus,...currentData.superset);
        currentData.setRepSub = new MySet(currentData.Modulus,...currentData.subset);
        let subSymm = currentData.setRepSub.symmetry();//?
        if (subSymm.length !== 0) {
            subSymm.forEach(axis => {
                let lin = this.draw.line(...this.bigOuter[axis[0]*2],...this.bigOuter[axis[1]*2]).id(`line${axis[0]*2}-${axis[1]*2}`);
                lin.stroke({color: 'black', width: '1px',dasharray: '3'});
                lin.addClass('symmline');
                nodeMessage(`line${axis[0]*2}-${axis[1]*2}`,`Inversionally symmetrical/invariant under I${axis[0]*2}.`);
            })
        }
        nodeMessage('supersetPoly',`Click to play [${currentData.setRepSuper.normal_order()}]`);
        nodeMessage('subsetPoly',`Click to play [${currentData.setRepSub.normal_order()}]`);
        fromObject(currentData.setRepSuper.exportable(),'displaySuper');
        fromObject(currentData.setRepSub.exportable(),'displaySub');
        K.manageTransformations();//K.manageTransformations(subsetChange);
        //Draw polygons for transformations here!
        currentData.transformations.forEach(entry => {
            console.log(`Found ${entry} under selected!`)
            /**
             * If a polygon exists, remove it from the drawing.
             */
            if (document.querySelector(`#${entry}polygon`)) {
                document.querySelector(`#${entry}`).classList.remove('sel');
                document.querySelector(`#${entry}polygon`).remove();
            }
            else {
                let newShape = this.draw.group().id(`${entry}polygon`).center(0,0);
                newShape.addClass('playable');
                let poly = this.draw.polygon();
                let label = this.draw.text(`${entry}`).center(...this.center);//Change to centroid?
                newShape.add(poly);
                newShape.add(label);
                document.querySelector(`#${entry}`).classList.add('sel');
                newShape.addClass('transform');
                //Add symmetry functionality to the selected T/I
                let coords = [];
                //Member is for each t or i available in the superset.
                currentData.setRepSub.set_class()[entry].forEach(member => {
                    coords.push([nodes[member].x,nodes[member].y]);
                })
                poly.plot(coords);
            }
            console.log(currentData['transformations'],document.querySelectorAll('.transform'));
        });
        new MyPlay();
        urlOperations('change');
    }
    /**
     * Toggle note names on nodes.
     */
    this.noteNames = () => {
        let universe = currentData['Modulus'];
        if (universe == 12 || universe == 31 || universe == 7) {
            currentData['names'] = !currentData['names'];
            this.redraw();
        }
        else {
            console.error(`${currentData['Modulus']} is not valid for note names!`);
        }
    }
}

//Check all T and I transformations, loop and confirm which are included in superset, then create the subset dropdown...

/**
 * Creates an instance of MyNode.
 * @param {float} x x position in svg drawing
 * @param {float} y y position in svg drawing
 * @param {string} data 
 * @param {string} parent Instance of Drawing
 */
function MyNode (x,y,data,parent,diameter = 30) {
    parent instanceof Drawing? null : console.error('Parent must be an instance of Drawing object!');
    this.x = x;
    this.y = y;
    this.small = currentData['Modulus'] >= 32? true : false;
    this.data = data;
    this.value = document.querySelectorAll('.myNode').length;
    this.superset = false;
    this.subset = false;
    let circ = parent.draw.circle(diameter,diameter).fill('white').stroke({width: 1, color: 'black'}).center(0,0).node;
    let text = parent.draw.text(`${this.data}`).center(0,0).font({family: 'BravuraText'}).node;
    let grp = parent.draw.group().translate(this.x,this.y);
    this.self = grp.node;
    this.small? this.self.classList.add('small') : null;
    grp.add(circ);
    grp.add(text);
    grp.addClass('myNode');
    this.instance = document.querySelectorAll('.myNode').length;
    this.self.id = `node${this.instance}`;
    nodeMessage(this.self.id,`Left click to add ${this.data} to superset.<br>Right click to add ${this.data} to subset.`);
    /**
     * Handle left and right clicks to add elements or remove them from currentData.
     * @param {function} callback 
     * @param {any} args
     */
    this.operation = () => {
        /**
         * Disable context menu.
         */
        this.self.addEventListener('contextmenu',(event) => {
            event.preventDefault();
        })
        this.self.addEventListener('mousedown',(event) => {
            /**
             * List of classes for node.
             */
            if (event.button === 0) {
                this.superset = !this.superset;
                /**
                 * If superset deselected, force deselect in subset automatically.
                 */
                if (this.superset == false && this.subset == true) {
                    this.subset = false;
                    this.self.classList.contains('inSub')? this.self.classList.remove('inSub') : console.log('Not in classList!');
                }
            }
            else if (event.button === 2) {
                this.superset? this.subset = !this.subset: console.error(`Element ${value} cannot be part of subset if it is not a member of the superset!`);
            }
            console.log(document.querySelectorAll('.void').length);
            currentData.superset = [];
            currentData.subset = [];
            nodes.forEach(element => {
                if (element.superset == true) {
                    currentData.superset.push(element.value);
                    if (element.subset == true) {
                        currentData.subset.push(element.value);
                    }
                }
            })
            console.log(`Superset: ${currentData.superset}`);
            console.log(`Subset: ${currentData.subset}`);
            parent.redraw();
        });
    }
    this.operation();
    nodes.push(this);
}

/**
 * Keeps track of the mouse position and places a div on it. 
 */
const trackMouse = () => {
    let floater =  document.createElement('div');
    floater.classList.add('floating');
    document.body.append(floater);
    floater.classList.add('void');
    document.addEventListener('mousemove',(event) => {
        floater.style.left = `${event.clientX+25}px`;
        floater.style.top = `${event.clientY+60}px`;
    })
    document.body.append(floater);
}

/**
 * Allows for an object to have a message appear when hovered over.
 * @param {string} id 
 * @param {string} message 
 */
const nodeMessage = (id,message) => {
    let mod = null
    if (id.indexOf(' ') !== -1) {
        let spl = id.split(' ');
        mod = spl.join('\\ ');
    }
    /**
     * Fix if id has spaces.
     */
    mod = mod == null? id : mod;
    let item = document.querySelector(`#${mod}`);
    item.addEventListener('mouseover',() => {
        let fl = document.querySelector('.floating');
        fl.classList.remove('void')
        fl.innerHTML = message;
    })
    item.addEventListener('mouseout',() => {
        let fl = document.querySelector('.floating');
        fl.classList.add('void');
    });
}

/**
 * SVG drawing with my control object.
 */
let K;
/**
 * Stores information for drawing. Page is rendered from this!;
 */
let currentData;
/**
 * Array storing all instances of .myNode.
 */
let nodes;

/**
 * Keeps hold of any synths.
 */
let synths = [];

document.addEventListener('DOMContentLoaded',() => {
    //Clause to automatically call urlOperations('load') if window.location (URL) isn't default.
    console.log('DOM Loaded');
    nodes = [];
    currentData = {
        'superset': [],
        'subset': [],
        'setRepSuper': null,
        'setRepSub': null,
        'transformations': [],
        'names': false
    };
    K = new Drawing('drawing');
    buildInput('Modulus','number','Submit the modular universe cardinality.','modulus');
    buildInput('Superset Complement','button','Click here to toggle all elements in the superset','superset');
    buildInput('Subset Complement','button','Of subset elements contained within the superset, toggle subset elements.','subset');
    buildInput('Clear Superset','button','Deselect all elements from superset.','superset');
    buildInput('Clear Subset','button','Deselect all elements from subset.','subset');
    buildInput('Play Option','button','Toggle playback between pitch and rhythm.','play');
    buildInput('Note Names','button','Toggle note names and PCs if applicable.');
    attachEventListeners();
    trackMouse();
})

//manualSelector(false,0,11,22,33,48,48+11,48+22,48+33,97,97+11,97+22,97+33,144,144+12,4);
//manualSelector(true,0,48,97,144)