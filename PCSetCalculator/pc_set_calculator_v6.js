/**
 * Determines if the input values are coprime with one another.
 * @param  {...any} nums 
 * @returns Boolean
 */
const coprime = (...nums) => {
    let res = [];
    nums.forEach(elem => {
        res.push(...factors(elem).slice(1));
    })
    return res.length == Array.from(new Set(res)).length;
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
 * Checks the superset to confirm if all elements of query are contained.
 * @param {array} superset 
 * @param {array} query 
 */
allContained: function (superset,query) {
    let result = 0;
    query.forEach(element => {
        superset.indexOf(element) > -1? result++ : null;
    })
    return result == query.length;
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
    },
    /**
     * Returns coinciding elements of the input array.
     * @param  {...array} arrays
     */
    intersection: function (...arrays) {
        let comp = [...arrays].flat().sort((a,b) => a-b);
        let uns = Array.from(new Set(comp));
        let res = [];
        uns.forEach(entry => {
            let temp = ArrayMethods.array_find(comp,entry).length;
            temp == arrays.length? res.push(entry) : null;
        })
        return res;
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
     * @param {array} array 
     * @param {int} cardinality 
     * @returns Array
     */
    subsets: function (array,cardinality = undefined) {
        let result = [];
        for (let a = 0; a < (1 << array.length); a++) {
            let sub = [];
            for (let b = 0; b < array.length; b++) {
                if (a & (1 << b)) {
                    sub.push(array[b]);
                }
            }
            if (cardinality == undefined) {
                result.push(sub);
            }
            else if (sub.length == cardinality) {
                result.push(sub);
            }
        }
        return result;
    }
}

/**
 * Get the factors of n.
 * @param {int} n
 * @returns array 
 */
const factors = (n) => {
    let result = [];
    for (let a = 1; a <= Math.sqrt(n); a++) {
        if (n%a == 0) {
            result.push(a,n/a);
        }
    }
    return Array.from(new Set(result)).sort((a,b) => a-b);
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
    }
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
    }
      /**
     * Transposes the input set by a given index.
     * @param {array} array
     * @param {int} modulus
     * @param {int} index 
     * @returns this.set -> t(n) mod this.universe.
     */
    this.transpose = function (array = this.set, modulus = this.universe, index = 0) {
        return array.map(x => this.modulo(x+index,modulus)); //O(n);
    }
    /**
     * Inverts the input set around a given index.
     * @param {array} array
     * @param {int} modulus
     * @param {int} index 
     * @returns this.set -> t(n)I mod this.universe. 
     */
    this.invert = function (array = this.set,modulus = this.universe,index = 0) {
        return array.map(x => this.modulo(index-x,modulus)); //O(n);
    }
    /**
     * Multiplies members of the input set by a given index. Traditionally defined as 5.
     * @param {array} array 
     * @param {int} modulus 
     * @param {int} index 
     * @returns this.set -> * index
     */
    this.multiply = function (array = this.set,modulus = this.universe,index = 5) {
        // console.table({
        //     'set': `{${array}}`,
        //     'modulus': modulus,
        //     'index': index
        // })
        let valid = coprime(index,modulus);
        if (valid) {
            return array.map(x => this.modulo(x*index,modulus));
        }
        else {
            console.error(`${index} is not a valid value of n! Values of n must be coprime to ${modulus}.`);
            return false;
        }
    }
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
    }
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
    }
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
     * Returns what I refer to as the m-vector of a set. This vector shows the number of invariant tones under a given multiplication operand.
     * @param {array} array 
     * @param {int} mod
     * @returns Object 
     */
    this.m_vector = (array = this.set,mod = this.universe) => {
        let atM = {};
        for (let a = 0; a < mod; a++) {
            let temp = array.map(x => this.modulo(x*a,mod))
            atM[`M${a}`] = {
                'Cardinality': Array.from(new Set(temp)).length,
                'Invariant Tones': ArrayMethods.intersection(temp,array).length,
                'Result': Array.from(new Set(temp))
            };
        }
        return atM;        
    }
    /**
     * Returns all transpositions and inversions and optionally the M operation of a given set as an object literal.
     * @param {array} array 
     * @param {int} modulus 
     * @param {boolean} eliminateDuplicates 
     * @param {boolean} includeMOperand
     * @returns Set Class
     */
    this.set_class = (array = this.set,modulus = this.universe,eliminateDuplicates = false,includeMOperand = false) => {
        let result = {};
        for (let a = 0; a < modulus; a++) {
            result['T'+a] = this.normal_order(array.map(x => this.modulo(x+a,modulus)),modulus);
            result['I'+a] = this.normal_order(array.map(y => this.modulo(a-y,modulus)),modulus);
            let attempt = a > 0? this.multiply(array,modulus,a) : null;
            attempt? result['M'+a] = this.normal_order(attempt,modulus) : null;
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
            return res =='M1' || res == `M${modulus-1}`? 'SAME SET' : res;
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
    /**
     * A method that returns a variety of relevant parameters.
     */
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
    this.symmetryPoints = (array = this.set,modulus = this.universe) => {
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
        return result.map(element => element%universe);//.sort((a,b) => a-b);  //Sorted numerically.
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let allNodes = {};

/**
 * Stein-Zimmerman accidentals for various tunings/temperaments.
 */
const Accidentals = {
    sharp: '♯',
    flat: '♭',
    natural: '♮',
    semiSharp: String.fromCharCode(0xe282),
    semiFlat: String.fromCharCode(0xe284),
    flatAndHalf: String.fromCharCode(0xe489),
    sharpAndHalf: String.fromCharCode(0xe428),
};

/**
 * Object that stores a variety of accidental settings.
 */
const PitchSystems = {
    7: ['Do','Re','Mi','Fa','Sol','La','Ti'],
    12: [
        'C',`C${Accidentals.sharp}/D${Accidentals.flat}`,
        `D`,`D${Accidentals.sharp}/E${Accidentals.flat}`,
        'E','F',
        `F${Accidentals.sharp}/G${Accidentals.flat}`,'G',
        `G${Accidentals.sharp}/A${Accidentals.flat}`,
        'A',`A${Accidentals.sharp}/B${Accidentals.flat}`,
        'B'],
    24: [`C`,`C${Accidentals.semiSharp}`,`C${Accidentals.sharp}/D${Accidentals.flat}`,`D${Accidentals.semiFlat}`,`D`,`D${Accidentals.semiSharp}`,`D${Accidentals.sharp}/E${Accidentals.flat}`,`E${Accidentals.semiFlat}`,
        `E`,`E${Accidentals.semiSharp}`,`F`,`F${Accidentals.semiSharp}`,`F${Accidentals.sharp}/G${Accidentals.flat}`,`G${Accidentals.semiFlat}`,`G`,`G${Accidentals.semiSharp}`,`G${Accidentals.sharp}/A${Accidentals.flat}`,
        `A${Accidentals.semiFlat}`,`A`,`A${Accidentals.semiSharp}`,`A${Accidentals.sharp}/B${Accidentals.flat}`,`B${Accidentals.semiFlat}`,`B`,`B${Accidentals.semiSharp}`
    ],
    31: [
        `C`,`C${Accidentals.semiSharp}`,`C${Accidentals.sharp}`,
        `D${Accidentals.flat}`,`D${Accidentals.semiFlat}`,'D',`D${Accidentals.semiSharp}`,`D${Accidentals.sharp}`,
        `E${Accidentals.flat}`,`E${Accidentals.semiFlat}`,`E`,`E${Accidentals.semiSharp}`,`E${Accidentals.sharp}`,
        `F`,`F${Accidentals.semiSharp}`,`F${Accidentals.sharp}`,
        `G${Accidentals.flat}`,`G${Accidentals.semiFlat}`,`G`,`G${Accidentals.semiSharp}`,`G${Accidentals.sharp}`,
        `A${Accidentals.flat}`,`A${Accidentals.semiFlat}`,'A',`A${Accidentals.semiSharp}`,`A${Accidentals.sharp}`,
        `B${Accidentals.flat}`,`B${Accidentals.semiFlat}`,`B`,`C${Accidentals.flat}`,`C${Accidentals.semiFlat}`
    ],
} 

/**
 * Stores cET of various intervals.
 * @type {Object.<string,number>}
 */
const IntervalLookup = {
    '12-tET': {
        'P1': 0,
        'm2': 100,
        'M2': 200,
        'm3': 300,
        'M3': 400,
        'P4': 500,
        'A4/d5': 600,
        'P5': 700,
        'm6': 800,
        'M6': 900,
        'm7': 1000,
        'M7': 1100,
        'P8': 1200,
    },
    'Pythagorean (3-Limit JI)': {
        'Pythagorean Comma': Math.log2(((9/8)**6)/2)*1200,
        'Pythagorean Limma': Math.log2(256/243)*1200,
        'm2': Math.log2(256/243)*1200,
        'm3': Math.log2(32/27)*1200,
        'M3': Math.log2(81/64)*1200,
        'M6': Math.log2(27/16)*1200,
        'm7': Math.log2(16/9)*1200,
        'M7': Math.log2(243/128)*1200,
    },
    '5-Limit JI': {
        'Syntonic Comma': Math.log2(81/80)*1200,
        'Lesser Diesis': Math.log2(128/125)*1200,
        'minor semitone': Math.log2(25/24)*1200,
        'major semitone': Math.log2(16/15)*1200,
        'Acute m2': Math.log2(27/25)*1200,
        'Greater M2': Math.log2(9/8)*1200,
        'Lesser M2': Math.log2(10/9)*1200,
        'A2': Math.log2(75/64)*1200,
        'm3': Math.log2(6/5)*1200,
        'M3': Math.log2(5/4)*1200,
        'P4': Math.log2(4/3)*1200,
        'Acute 4th': Math.log2(27/20)*1200,
        'A4': Math.log2(45/32)*1200,
        'd5': Math.log2(64/45)*1200,
        'P5': Math.log2(3/2)*1200,
        'm6': Math.log2(8/5)*1200,
        'M6': Math.log2(5/3)*1200,
        'A6': Math.log2(225/128)*1200,
        'D7': Math.log2(128/75)*1200,
        'm7': Math.log2(9/5)*1200,
        'M7': Math.log2(15/8)*1200,
        'D8': Math.log2(48/25)*1200,
        'A7': Math.log2(125/64)*1200,
    },
    '7-Limit JI': {
        'Diesis': Math.log2(49/48)*1200,
        'Diatonic Semitone': Math.log2(15/14)*1200,
        'Supermajor 3rd': Math.log2(9/7)*1200,
        'Chromatic Semitone': Math.log2(21/20)*1200,
        'Harmonic m7': Math.log2(7/4)*1200,
    },
    '24-tET': {
        '1/4th Tone': 50,
        'Neutral 2nd': 150,
        'Supermajor 2nd': 250,
        'Neutral 3rd': 350,
        'Supermajor 3rd': 450,
        'Major 4th': 550,
        'Minor 5th': 650,
        'Subminor 6th': 750,
        'Neutral 6th': 850,
        'Subminor 7th': 950,
        'Neutral 7th': 1050,
        'Supermajor 7th': 1150,
    },
    /**
     * Incomplete...
     */
    '11-Limit JI': {
        'Undecimal Diesis': Math.log2(45/44)*1200,
    },
    'Quarter-Comma Meantone': {
        'P5': Math.log2((3/2)/((81/80)**(1/4)))*1200,//
        'Wolf 5th': null,//Not quite able to calculate
    }
}

/**
 * Uses IntervalLookup to find the nearest interval in cET.
 * @param {float} cents 
 */
const findIntervals = (cents = 100) => {
    let total = [];
    let obj = Object.entries(IntervalLookup);
    let win = [null,null,1300]; //0 = Tuning System, 1 = Interval, 2 = Difference in cents.
    for (let [key,value] of obj) {
        let t = Object.entries(value);
        for (let [k,v] of t) {
            let diff = Math.abs(v-cents);
            if (diff < Math.abs(win[2])) {
                win[0] = key;
                win[1] = k;
                win[2] = (cents-v).toFixed(2);
                Math.abs(win[2]) < 70? total.unshift(`${win[2]}\&cent from ${win[0]} ${win[1]} (${v.toFixed(2)}\&cent)<br>`) : null;
            }
        }
    }
    return total.slice(0,3);
}

/**
 * Builds a custrom dropdown menu. Be sure to include CSS.
 * @param {string} parent id of parent element
 * @param {string} name Dropdown name to be displayed
 * @param {function} method functon to call upon selection
 * @param {...any} args arguments for callback function
 */
function MyDropdown(parent,name,method) {
    this.parent = parent;
    this.name = name;
    this.options = {};
    this.value = null;
    this.entangled = [];
    // this.arguments = [...args];
    /**
     * Adds option to the dropdown menu. Options are stored in this.options object.
     * @param {string} text 
     * @param {any} value 
     * @param {string} tooltip 
     */
    this.addOption = (text,value,tooltip) => {
        this.options[`${text}`] = {
            'value': value,
            'tooltip':tooltip,
            'selected': false,
            'self': null
        };
    }
    /**
     * Clears the dropdown element and removes options.
     */
    this.removeOptions = () => {
        this.options = {};
        this.value = null;
        this.construct();
    }
    /**
     * Deselects options, does not remove options from dropdown.
     */
    this.deselect = () => {
        this.value = null;
        Object.entries(this.options).forEach(([key,value]) => {
            if (value.self.classList.contains('ddownSelect')) {
                value.self.classList.remove('ddownSelect');
                value.selected = false;
            }
        })
    }
    /**
     * Builds the dropdown menu based on the current options.
     * @param {...Object} twins Instance(s) of MyDropdown to entangle.
     */
    this.construct = (...twins) => {
        this.entangled = twins;
        let par = document.querySelector(`#${this.parent}`);
        par.classList.add('parent');
        // if (document.querySelector(`#${this.name}`)) {
        //     document.querySelector(`#${this.name}`).remove();
        // }
        let pad;
        /**
         * Check if parent already has a div present.
         */
        if (document.querySelector(`#${this.name}`)) {
            pad = document.querySelector(`#${this.name}`);
            console.log('DIV PRESENT!')
        }
        else {
            pad = document.createElement('div');
            console.log('DIV NOT HERE!')
        }
        pad.id = `${this.name}`;
        pad.classList.add('primary');
        pad.innerHTML = `${name}`;
        let drawer = document.createElement('div');
        drawer.classList.add('stor');
        let decon = Object.entries(this.options);
        if (decon.length !== 0) {
            for (let [key,value] of decon) {
                let single = document.createElement('div');
                single.classList.add('myOption');
                single.innerHTML = key;
                // single.setAttribute('data-tooltip',value.tooltip);
                single['data-tooltip'] = value.tooltip;
                drawer.appendChild(single);
                value.self = single;
            }
            let disp = null;    //???
            if (name == 'TRANSPOSITION') {
                disp = document.querySelector('#tContain');
            }
            else if (name == 'INVERSION') {
                disp = document.querySelector('#iContain');
            }
            else if (name == 'MULTIPLICATION') {
                disp = document.querySelector('#mContain');
            }
            // disp.innerHTML = `${decon.length}`; Works but is slow. 
            // disp.style.visibility = 'visible';
            drawer.addEventListener('mousedown',(event) => {
                /**
                 * Deselect previously selected option
                 */
                let find = event.target.closest('.myOption');   
                this.deselect();  
                let sel = this.options[find.innerHTML];
                /**
                 * If entangled elements exist, set their value to the newly selected value.
                 */
                if (this.entangled.length > 0) {
                    this.entangled.forEach(twin => {
                        twin.deselect();
                        twin.value = sel.value;
                    })
                }
                sel.selected = true;
                this.value = sel.value;
                sel.self.classList.add('ddownSelect');
                method? method(this.value) : null;
            })
            pad.appendChild(drawer);
            par.appendChild(pad);
            console.log(`Dropdown ${this.name} constructed!`);
        }
        else {
            console.warn('No options!');
        }
        this.showSize();
    }
    /**
     * Displays the number of options in the dropdown.
     */
    this.showSize = () => {
        let arr = [];
        Object.values(this.options).forEach(el => {
            arr.push(el.tooltip.match(/\[(.*?)\]/ig)[1]);
        })
        let len = new Set(arr).size;
        let dis = null;
        switch (this.name) {
            case 'TRANSPOSITION': 
            dis = document.querySelector(`#tContain`);
            break;
            case 'INVERSION':
            dis = document.querySelector(`#iContain`);
            break;
            case 'MULTIPLICATION':
            dis = document.querySelector(`#mContain`);
            break;
        }
        dis.innerHTML = `${len} Unique`;
        if (len == 0) {
            dis.style.visibility = 'hidden';
            document.querySelector(`#${this.name}`).style.visibility = 'hidden';
        }
        else {
            dis.style.visibility = 'visible';
            document.querySelector(`#${this.name}`).style.visibility = 'visible';
        }
    }   
}

/**
 * Prototype for data displayed by calculator, can be modified, to change all children.
 * @param {string} name 
 * @param {any} information
 * @param {string} definition 
 */
function DataEntry (name,information,definition) {
    this.name = name;
    this.information = information,
    this.definition = definition;
    console.log(this.data)
    return {
        'name': this.name,
        'info': this.information,
        'definition': this.definition,
    }
}

/**
 * Modifies the current url or loads a page from the given url.
 * @param {string} operation 'change' || 'load' 
 */
const urlOperations = (operation = 'change') => {
    let stateName = 'defaultState';
    if (operation == 'change') {
        let params = new URLSearchParams(window.location.search);
        params.set(stateName,JSON.stringify(currentData));
        window.history.replaceState({},'',`${window.location.pathname}?${params}`);
    }
    else if (operation == 'load') {
        let params = new URLSearchParams(window.location.search);
        let state = params.get(stateName)? JSON.parse(params.get(stateName)) : null;
        currentData = state;
        console.table(currentData)
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
 * Returns the midpoint of two coordinates.
 * @param {array} arr1 [x,y]
 * @param {array} arr2 [x,y]
 */
const midpoint = (arr1,arr2) => {
    return [arr1[0]+arr2[0],arr1[1]+arr2[1]].map(x => x/2);
}

/**
 * A method that keeps track of all of the data to be displayed.
 * @param {string} name 
 * @param {string} set superset || subset
 * @returns Object
 */
function SetInformation(name,set) {
    let info = D.drawingData[`${set}`];
    let setRep = new MySet(Object.keys(allNodes).length,...info);
    let subRef = new MySet(D.drawingData['superset'].length,...info.map(x => D.drawingData['superset'].indexOf(x)));//This works correctly!
    D.drawingData[`${name}`] = {
        'Normal Order': new DataEntry('Normal Order',`: [${setRep.normal_order()}]`,'Normal Order is the tightest rotation of the numerical ordered PCs.'), //
        'Prime Form': new DataEntry('Prime Form',`: (${setRep.prime_form()})`,"Prime Form is the leftwise 'tightest packing' between the Normal Form or its inversion. The result is then transposed to 0."),
        'Interval Class Vector': new DataEntry('Prime Form',`: <${setRep.interval_class_vector()}>`,'The interval-class vector is the total interval content for a set. It can be used to determine the number of invariant tones under a given transpositional index.'),
        'Index Vector': new DataEntry('Index Vector',`: <${setRep.index_vector()}>`,'The index vector shows invariant tones under a given inversional index.'),
        'Maximally Even': new DataEntry('Maximally Even',`: ${set == 'superset'? setRep.exportable()['Maximally Even'] : subRef.exportable()['Maximally Even']}`,`Determines if the set is 'as spread out as possible', or as close to an equilateral polygon as it could be while being contained within the parent.`),
        }
        return D.drawingData[`${name}`];
    }

/**
 * Manage the SVG drawings.
 * @param {string} parent id of <div>
 */
function DrawingManager (parent = 'drawing') {
    let sizeX = 440;
    let sizeY = 440;
    /**
     * Array containing the x/y coordinate of the center of the drawing. Needed to calculate the position of nodes.
     */
    this.center = [sizeX/2,sizeY/2];
    this.parentNode = document.querySelector(`#${parent}`);
    this.draw = SVG().addTo(this.parentNode).size(sizeX,sizeY);
    this.drawingSubNodeList = this.parentNode.childNodes[0].childNodes;
    /**
     * Stores transformation instances
     */
    this.transforms = {};
    /**
     * Superset Polygon
     */
    this.polygonA = this.draw.polygon();
    this.polygonA.center(this.center);
    this.polygonA.stroke({width: '1px',color: 'black'}).fill('none');
    this.polygonA.addClass(`supersetPolygon`);
    /**
     * Subset Polygon
     */
    this.polygonB = this.draw.polygon();
    this.polygonB.center(this.center);
    this.polygonB.stroke({width: '1px',color: 'black'}).fill('none');
    this.polygonB.addClass('subsetPolygon');
    this.tDrop = null;
    this.iDrop = null;
    /**
     * Contains various attributes of the current drawing/set information.
     */
    this.drawingData = {
        'superset': [],
        'subset': [],
        'interval': 1,
        'tempered-int': 2,
    }
    /**
     * Monitors the hovering of the cursor. Updates tooltip box.
     */
    this.mouseTracking = () => {
        let offset = 15;//Offset for the tooltip.
        let tt = document.querySelector(`#tooltips`);
        document.addEventListener('mouseover',(element) => {    //Whole document allows tooltips!
            let message = undefined;
            let position = [element.clientX+window.scrollX,element.clientY+window.scrollY];
            tt.style.left = `${position[0]+offset}px`;
            tt.style.top = `${position[1]+offset}px`;
            if (element.target.parentNode.tagName !== 'g' && element.target.tagName == `tspan`) {    //Catch text
                message = element.target.parentNode.parentNode['data-tooltip'];
                console.log('Trigger Option 1');
            }
            else if (element.target.parentNode.tagName == 'g') {    
                message = element.target.parentNode['data-tooltip'];
                console.log('Trigger Option 2');
            }
            else if (element.target.tagName == 'select') {//Will need to change this.
                console.log('Trigger Option 3');
                console.log(element.target.options[element.target.selectedIndex]);
            }
            else {
                message = element.target['data-tooltip'];
                console.log('Trigger Option 4');
            }
            tt.style.visibility = message? 'visible' : 'hidden';
            /**
             * Node condition, determines the index of message to be displayed.
             */
            if (typeof message == 'object') {
                let nodeNumber = parseInt(element.target.parentNode.childNodes[1].textContent);//Works regardless of note name display.
                let nodeState = Object.values(allNodes)[nodeNumber].state;
                tt.innerHTML = `${message[nodeState]}`;
            }
            else if (message !== undefined) {
                tt.innerHTML = `${message}`;
            }
            let rect = tt.getBoundingClientRect();
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            if (rect.right > winWidth) {
                tt.style.left = `${winWidth}px`;
            }
            if (rect.bottom > winHeight) {
                tt.style.top = `${winHeight}px`;
            }
        })
    }
    /**
     * Modulus*2 points outer circle. Used for symmetry.
     */
    this.outerCircle = [];
    /**
     * Manages lines of symmetry in the drawing.  
     */
    this.symmetry = () => {
        console.log(`SYMMETRY CALLED!`)
        //Remove all previous lines of symmetry.
        document.querySelectorAll('.superSymmetryLine, .subSymmetryLine').forEach(item => {
            item.remove();
        })
        //Get set representations of both sets and their symmetry. Stored in object to facilitate looping.
        let obj = {
            'supers': new MySet(this.drawingData['Universe'],...this.drawingData.superset).symmetryPoints(),
            'subs': new MySet(this.drawingData['Universe'],...this.drawingData.subset).symmetryPoints(),
        }
        //Points from symmetry x2, to align with double mod points.
        for (let [key,value] of Object.entries(obj)) {//Iterate over two obj items.
            value.forEach(line => {
                let s = this.draw.line();
                s.addClass(key == 'supers'? 'superSymmetryLine' : 'subSymmetryLine');
                let modified = line.map(x => x*2);
                s.plot(...this.outerCircle[modified[0]],...this.outerCircle[modified[1]]);
                // console.log(`${line[0]}-${line[1]} plotted!`);
                s['node']['data-tooltip'] = `${key == 'supers'? 'Superset' : 'Subset'} symmetrical about the ${line[0]}-${line[1]} axis.`;
            })
        }
    }
    /**
     * A method to show the number of cET between selected nodes.
     */
    this.showCents = (state = this.drawingData['cent-state']) => {
        let arrRep = Object.values(allNodes);
        let three60 = Math.log2(this.drawingData['tempered-int'])*1200;//Size of full rotation.
        let centStep = three60/arrRep.length;//Size of adjacent elements
        // console.log(centStep);
        let par = document.querySelector('#cents');
        let selection = null;
        switch (state) {
            /**
             * Show None
             */
            case 0:
                par.innerHTML = 'Superset';
                selection = this.drawingData['superset'];
                break;
            /**
             * Show Superset
             */
            case 1:
                par.innerHTML = 'Subset';
                selection = this.drawingData['subset'];
                break;
            /**
             * Show Subset
             */
            case 2:
                par.innerHTML = 'NONE';
                selection = null;
                break;
        }
        document.querySelectorAll('.centDis').forEach(elem => {
            elem.remove();
        });
        let pairs = {};
        for (let a = 0; a < selection.length; a++) {
            /**
             * Element 0 has special case to fix negative distance and show full modulus upon unison element 0.
             */
            if (a == 0) {
                pairs[`${arrRep[selection[selection.length-1]].name}-${arrRep[selection[a]].name}`] = {
                    'cents': ((arrRep[selection[a]].name)-arrRep[selection[selection.length-1]].name*centStep+three60).toFixed(2),
                    'coords': midpoint(arrRep[selection[a]].coordinates,arrRep[selection[selection.length-1]].coordinates)
                }
            }
            else {
                pairs[`${arrRep[selection[a-1]].name}-${arrRep[selection[a]].name}`] = {
                'cents': ((arrRep[selection[a]].name-arrRep[selection[a-1]].name)*centStep).toFixed(2),
                'coords': midpoint(arrRep[selection[a-1]].coordinates,arrRep[selection[a]].coordinates)
                }
            }
        }
        for (let [key,value] of Object.entries(pairs)) {
            let t = this.draw.circle(7);
            t.addClass('centDis');
            t.center(...value['coords']);
            t['node']['data-tooltip'] = `Distance between ${key} = ${value['cents']}cET<br>${findIntervals(value['cents'])}`;
        }
    }
    /**
    * Computes positions of verticies for an equilateral shape with n points. New and Improved!
    * @param {array} center [x,y] 
    * @param {int} numPoints number of equidistant points
    * @param {float} length diameter length
    */
    this.mainPolygon = (center = this.center,numPoints = 12,length = 50) => {
        this.outerCircle = [];
        let outerScale = 1.2;
        let allAngles = 360/numPoints/2;      //(180*(numPoints-2))/numPoints is really interesting!
        for (let a = 0; a < numPoints*2; a++) {
            let angle = ((a*allAngles) -90) * Math.PI/180;  //-90 sets top element to 0;
            let wideX = center[0] + length * outerScale * Math.cos(angle);
            let x = center[0] + length * Math.cos(angle);
            let wideY = center[1] + length * outerScale * Math.sin(angle);
            let y = center[1] + length * Math.sin(angle);
            let outCoord = [wideX,wideY];
            /**
             * If even, place node.
             */
            if (a%2 == 0) {
                let temp = new MyNode(D,a/2,[x,y],outCoord,numPoints > 24);
                temp.outerCoordinate = outCoord;
                temp.clockwisePosition = a;
            }
            this.outerCircle.push(outCoord);
        }
    }
    /**
     * Manages the visibility of symmetry lines.
     * @param {int} state % 4
     */
    this.symmetryVisibility = (state = this.drawingData['symmetry-state']) => {
        switch (state) {
            /**
             * Hide all symmetry lines.
             */
            case 0:
                console.log('Hide all lines!')
                document.querySelectorAll('line').forEach(elem => {
                    elem.style.visibility = 'hidden';
                })
                // document.querySelector('#symm')['node']['data-tooltip'] = 'Click to show superset symmetry lines.';
                document.querySelector('#symm').innerHTML = 'NONE';
                break;
            /**
             * Show superset symmetry lines only.
             */
            case 1:
                console.log('Show Only Superset Lines!');
                document.querySelectorAll('.superSymmetryLine').forEach(elem => {
                    elem.style.visibility = 'visible';
                })
                document.querySelectorAll('.subSymmetryLine').forEach(elem => {
                    elem.style.visibility = 'hidden';
                })
                // document.querySelector('#symm')['node']['data-tooltip'] = 'Click to show subset symmetry lines.';
                document.querySelector('#symm').innerHTML = 'Superset';
                break;
            /**
             * Show subset symmetry lines only.
             */
            case 2:
                console.log('Show Only Subset Lines!');
                document.querySelectorAll('.superSymmetryLine').forEach(elem => {
                    elem.style.visibility = 'hidden';
                })
                document.querySelectorAll('.subSymmetryLine').forEach(elem => {
                    elem.style.visibility = 'visible';
                })
                // document.querySelector('#symm')['node']['data-tooltip'] = 'Click to show all symmetry lines.';
                document.querySelector('#symm').innerHTML = 'Subset';
                break;
            /**
             * Show all symmetry lines.
             */
            case 3:
                console.log('Show All Lines!');
                document.querySelectorAll('line').forEach(elem => {
                    elem.style.visibility = 'visible';
                })
                // document.querySelector('#symm')['node']['data-tooltip'] = 'Click to hide all symmetry lines.';
                document.querySelector('#symm').innerHTML = 'ALL';
        }
    }
     /**
     * Updates the collections information on the page.
     */
    this.displayUpdate = () => {
        let context = document.querySelector(`#moreInfo`);
        let BIG = [Object.entries(SetInformation('superInfo','superset')),Object.entries(SetInformation('subInfo','subset'))]//Formerly [A,B];
        /**
         * Clear
         */
        document.querySelectorAll('#moreInfo').forEach(entry => {
            entry.innerHTML = '';
        })
        //Make clauses for individual parentheses/brackets/etc
            let sup = document.createElement('div');
            let sub = document.createElement('div');
            sup.setAttribute('id',`superInfo`);
            sub.setAttribute('id','subInfo');
            for (let a = 0; a < BIG.length; a++) {
                let col1 = document.createElement('div');
                col1.classList.add('col');
                let col2 = document.createElement('div');
                col2.classList.add('col');
                let disp = document.createElement('h4');
                disp.classList.add('frozen');
                if (a == 0) {
                    disp.textContent = `Superset:`;
                    sup.append(col1);
                    col1.id = 'SupCol1';
                    sup.append(col2);
                    col2.id = 'SupCol2';
                }
                else {
                    disp.textContent = 'Subset:'
                    sub.append(col1);
                    col1.id = 'SubCol1';
                    sub.append(col2);
                    col2.id = 'SubCol2';
                }
                // col1.append(disp);
                BIG[a].forEach(item => { //Loop over each subComponent
                    let t = document.createElement('div');
                    t.classList.add('row'); //previously highlight...
                    t.id = `${a == 0? 'super' : 'sub'}${item[0].match(/[A-Z]+/g).join('')}`;
                    /**
                    * Special case for IV and ICV
                    */
                    if (item[0] == 'Interval Class Vector' || item[0] == 'Index Vector') {
                        let cont = document.createElement('div');
                        cont.classList.add('row')//Something new;
                        let temp = item[1]['info'].match(/[0-9]+/ig);
                        let term = document.createElement('p');
                        term.classList.add('frozen');
                        term['data-tooltip'] = `${item[1]['definition']}`;
                        term.innerHTML = `${item[0]}:`;
                        col1.append(term);
                        for (let i = 0; i < temp.length+2; i++) {
                            let mini = document.createElement('p');
                            if (i == 0) {
                                mini.innerHTML = ' <';
                            }
                            else if (i == temp.length+1) {
                                mini.innerHTML = '>';
                            }
                            else {
                                mini.classList.add('wow');
                                mini.innerHTML = i == temp.length? `${temp[i-1]}` : `${temp[i-1]},`;
                                /**
                                 * Differentiate tooltip depending on if ICV or IV
                                 */
                                mini['data-tooltip'] = item[0] == 'Interval Class Vector'? `Invariant tones under T<sub>${i}/${Object.keys(allNodes).length-(i)}</sub>` : `Invariant tones under T<sub>${i-1}</sub>I`;
                            }
                            cont.append(mini);
                        }
                        col2.append(cont);
                    }
                    /**
                     * Any other type of information
                     */
                    else {
                        let box = document.createElement('p');
                        box.classList.add('frozen');
                        box.innerHTML = `${item[0]}:`;
                        let dis = document.createElement('p');
                        dis.classList.add('highlight');
                        dis.innerHTML = `${item[1]['info'].slice(1)}`;
                        box['data-tooltip'] = `${item[1]['definition']}`;
                        dis['data-tooltip'] = `${item[1]['definition']}`;
                        col1.append(box);
                        col2.append(dis);
                    }
                })
            }
            context.appendChild(sup);
            context.appendChild(sub);
    }
    /**
     * Manages and draws the superset/subset polygons
     * @param {int} interval 
     */
    this.miniPolygons = () => {
        let superCoords = [];
        let subCoords = [];
        this.drawingData['superset'].forEach(element => {
            superCoords.push(allNodes[`n${element}`].coordinates);
            // console.log(`EL: ${element} POS: ${cPos}`);
        })
        this.drawingData['subset'].forEach(element => {
            subCoords.push(allNodes[`n${element}`].coordinates);
        })
        this.polygonA.plot(superCoords);
        this.polygonA['node']['data-tooltip'] = `Superset: [${new MySet(Object.keys(allNodes).length,...this.drawingData['superset']).normal_order()}]`;
        this.polygonB.plot(subCoords);
        this.polygonB['node']['data-tooltip'] = `Subset: [${new MySet(Object.keys(allNodes).length,...this.drawingData['subset']).normal_order()}]`;
    } 
    /**
     * Clear the parent's drawing element, leaves SVGElement in tact.
     */
    this.clearDrawing = () => {
        allNodes = {};
        document.querySelectorAll('g, circle, text, line').forEach(item => {//Special querySelector to leave polygons intact.
            item.remove();
        })
        this.polygonA.plot(0,0);//Replots the polygons to a single point.
        this.polygonB.plot(0,0);
        Object.values(this.transforms).forEach(elem => {
            elem.remove();
        })
        console.log(`Clear successful? ${this.drawingSubNodeList.length == 2}`);//Check if only polygons are left
    }
    /**
     * Get the complement of the argument set.
     * @param {string} setType 
     */
    this.complement = (setType = 'superset') => {
        console.log(`Complement ${setType} triggered!`);
        let asArray = Object.values(allNodes);
        if (setType == 'superset') {
            asArray.forEach(item => {
                if (item.state == 0) {
                    item.state = 1;
                }
                else if (item.state >= 1) {
                    item.state = 0;
                }
            })
        }
        else if (setType == 'subset') {
            asArray.forEach(item => {
                if (item.state == 1) {
                    item.state = 2;
                }
                else if (item.state == 2) {
                    item.state = 1;
                }
            })
        }
        else {
            console.error(`'${setType}' is not a valid argument!`);
        }
        this.updateNodeStates();
    }
    /**
     * Restructures the order of nodes via the input interval. Can be used to illustrate well-formedness.
     * @param {int} interval OPCI 
     */
    this.restructure = (interval = 7) => {
        let coords = Object.values(allNodes).map(x => x.coordinates);
        this.drawingData['interval'] = interval;
        let wf = ScaleTheory.generate(0,interval,coords.length,coords.length);
        for (let a = 0; a < coords.length; a++) {
            allNodes[`n${wf[a]}`].move(...coords[a]);
            allNodes[`n${wf[a]}`].clockwisePosition = a;
        }
        let s = Object.entries(allNodes).sort((a,b) => a[1].clockwisePosition - b[1].clockwisePosition);
        allNodes = Object.fromEntries(s);
        this.updateNodeStates();//!!
    }
    /**
     * Draw a transformation Polygon
     * @param {string} transform T/I(n)
     */
    this.transformation = (transform) => {
        console.log(D.drawingData);
        this.removeTransformation();
        let setRep = new MySet(Object.keys(allNodes).length,...this.drawingData['subset']);
        let selection = setRep.set_class()[transform];
        let test = ArrayMethods.allContained(this.drawingData['superset'],selection);
        console.log(`[${this.drawingData['superset']}] contains [${selection}]?? : ${test}`);
        if (test) {
            let tr = this.draw.polygon();
            tr.addClass('transform');
            let selCoords = [];
            Object.values(allNodes).forEach(point => {
                point.borderChange = false;//Change by default.
                if (selection.indexOf(point.number) !== -1) {
                    selCoords.push(point.coordinates);
                    point.borderChange = true;//Consider adding additional classes
                    point.self['node'].classList.add('bord');
                }
                else {
                    point.borderChange = false;
                    point.self['node'].classList.remove('bord');
                }
                console.log(`LINE 1570 --- ${point.self['node'].classList}`);
            })
            tr.plot(selCoords);
            tr['node'].id = `${transform}`;
            tr['node']['data-tooltip'] = `[${setRep.normal_order()}] under ${transform[0]}<sub>${transform.slice(1)}</sub> = [${selection}]`;
            this.transforms[transform] = tr;
        }
        else {
            console.error(`{${selection}} is not contained within the prevailing superset!`);
        }
        // this.updateNodeStates();//TODO...
    }
    /**
     * Removes elements of the specified type from the display. Updates information also.
     * @param {string} type superset || subset || transformations 
     */
    this.clearElements = (type = 'superset') => {
        let ref = Object.values(allNodes);
        if (type == 'transformations') {
            document.querySelectorAll('.drop').forEach(item => {
            item.value == 'NONE';
            })
        }
        else if (type == 'superset' || type == 'subset') {
            ref.forEach(node => {
                console.log(`${node.name} : ${node.state}`);
                if (type == 'superset') {
                    node.state = 0;
                }
                else {
                    node.state = node.state == 2? 1 : node.state;
                }
            })
        }
        else {
            console.error("ERROR: type must be 'superset', 'subset' or 'transformations'!");
        }
        this.updateNodeStates();
    }
    /**
     * Removes the specified transformation polygon if present in this.transforms object.
     * @param {string} transform T/I(n)
     */
    this.removeTransformation = (transform) => {
        /**
         * Remove one.
         */
        if (transform !== undefined) {
            if (Object.keys(this.transforms).includes(transform)) {
                this.transforms[transform].remove();
                delete this.transforms[transform];
            }
            else {
                console.error(`${transform} is not present in drawing.`);
            }
        }
        /**
         * Remove all
         */
        else {
            this.transforms = {};
            document.querySelectorAll('.transform').forEach(item => {
                item.remove();
            })
        }
    }
    /**
     * Manually generate a diagram from arguments.
     * @param {int} modulus
     * @param {array} superset 
     * @param {array} subset
     * @param {bool} clear
     */
    this.manualSelection = (modulus = 12,superset,subset,clear = true) => {
        if (clear == true) {
            this.clearDrawing();
            this.mainPolygon(this.center,modulus,160);
        }
        this.drawingData['superset'] = superset;
        this.drawingData['subset'] = subset;
        let combin = [...superset,...subset];
        combin.forEach(item => {
            // let filt = combin.filter(x => x == item);
            allNodes[`n${item}`]['state']++;//Check the length of instances, will be state CONFUSING
        })
        this.updateNodeStates();
    }
    /**
     * Checks the state of each node in allNodes object and updates their visual accordingly.
     */
    this.updateNodeStates = () => {
        this.drawingData['superset'] = [];
        this.drawingData['subset'] = [];
        this.removeTransformation();
        document.querySelectorAll('.centDis, .subSymmetryLine, .superSymmetryLine').forEach(elem => {
            elem.remove();
        });
        const Notes = PitchSystems[Object.keys(allNodes).length];
        for (let [key,value] of Object.entries(allNodes)) {
            if (Notes !== undefined) {
                document.querySelector(`#noteToggle`).classList.remove('void');
                let k = this.draw.text(`${Notes[value.number]}`);
                k.addClass('void');
                value.largeMod? k.center(...value.outerCoordinate) : k.center(...value.coordinates);
                value.self.add(k);
            }
            else {
                document.querySelector(`#noteToggle`).classList.add('void');
            }
            switch (value.state) {
                case 0: value.self['node'].classList.remove('inSuper');
                        value.self['node'].classList.remove('inSub');
                    break;
                case 1: value.self['node'].classList.add('inSuper');
                        value.self['node'].classList.contains('inSub')? value.self['node'].classList.remove('inSub') : null;
                        this.drawingData['superset'].push(value.name);
                    break;
                case 2: value.self['node'].classList.add('inSub');
                        value.self['node'].classList.contains('inSuper')? null : value.self['node'].classList.add('inSuper');//Special case for autoSelection 
                        this.drawingData['subset'].push(value.name);
                        this.drawingData['superset'].push(value.name);
                    break;
            }
            /**
             * If large modulus, add .small to all nodes.
             */
            if (Object.keys(allNodes).length > 24) {
                value.self['node'].classList.add('small');
            }
            /**
             * Else, remove .small from all nodes.
             */
            else {
                value.self['node'].classList.contains('small')? value.self['node'].classList.remove('small') : null;
            }
            value.self['node'].classList.remove('bord');//TODO
        }
        this.displayUpdate();
        this.miniPolygons();
        populateDrops();
        this.symmetry();//Is it an issue with timing? Move this line?
        this.showCents(this.drawingData['cent-state']);//Issues with method calls...Timing, elements not clearing etc.
    }
    /**
     * Changes visibility of note names.
     */
    this.noteNames = () => {
        document.querySelectorAll('.MyNode').forEach(item => {
            let textLabel = null;
            if (item.childNodes[2] !== undefined) {
                /**
                 * Switch to PCs
                 */
                if (item.childNodes[1].classList.contains('void')) {
                    item.childNodes[1].classList.remove('void');
                    item.childNodes[2].classList.add('void');
                    textLabel = item.childNodes[1].textContent;
                }
                /**
                 * Switch to Note names
                 */
                else if (item.childNodes[2].classList.contains('void')) {
                    item.childNodes[2].classList.remove('void');
                    item.childNodes[1].classList.add('void');
                    item.childNodes[2].classList.add('textNoteName');
                    textLabel = item.childNodes[2].textContent;
                }
                /**
                 * Update tooltip with correct format.
                 */
                item['data-tooltip'] = [`Click to add ${textLabel} to superset.`,`Click to add ${textLabel} to subset.`,`Click to remove ${textLabel} from all sets.`];
            }
            else {
                console.error('Notes not available!');
            }
        })
    }
    /**
     * Primary Event Listener for the entire drawing. Maybe strange, but it prevents the need for re-adding and destroying listeners!
     */
    this.parentNode.addEventListener('mousedown',(event) => {
        /**
         * Group Node that contains circle and text element
         */
        let currNode = null;
        /**
         * The text content of the node and the index within allNodes object
         */
        let index = null;
        /**
         * The object reference to be stored within allNodes object
         */
        let inst = null;
        /**
         * Clear the set tracker object for each click.
         */
        if (event.target.parentNode.tagName == 'g') {//Gets circle
            currNode = event.target.parentNode;
            index = currNode.childNodes[1].textContent;
            inst = allNodes[`n${index}`];
            // console.log(`Condition 1 Triggered //Line 1105`);
            this.drawingData['subset'] = [];
            this.drawingData['superset'] = [];
            console.log(`Clicked Node: ${index}!`);
        }
        else if (event.target.parentNode.parentNode.tagName == 'g') {//Gets TSpan
            currNode = event.target.parentNode.parentNode;
            index = currNode.childNodes[1].textContent  //Only works for number node names
            inst = allNodes[`n${index}`];
            // console.log(`Condition 2 Triggered //Line 1111`);
            this.drawingData['subset'] = [];
            this.drawingData['superset'] = [];
            console.log(`Clicked Node: ${index}!`);
        }
        else {
            console.log('No Node clicked!');
        };

        /**
         * If a node is clicked, add 1 (mod3) to object reference state. Ints range from 0-2 where...
         * 0 = Deselect
         * 1 = Superset Selection
         * 2 = Subset Selection
         */
        if (currNode !== null) {
            console.log(currNode.childNodes[1]);
            inst.state = (inst.state+1)%3;
            let nodeNumber = index;//Fails when click text?????
            let nodeState = Object.values(allNodes)[nodeNumber].state;
            document.querySelector(`#tooltips`).innerHTML = `${currNode['data-tooltip'][nodeState]}`;//THIS LINE IS THE PROBLEM
            this.updateNodeStates();
        }
    })
    this.mouseTracking();
}

/**
 * Creates a functional Node within the parent element.
 * @param {string} parent Instance of DrawingManager
 * @param {any} textLabel Text visible in Node
 * @param {array} primary [X coordinate,Y coordinate] main node location
 * @param {array} secondary [X coordinate, Y coordinate] outer location
 * @param {bool} largeMod special case.
 */
function MyNode (parent = D,textLabel,primary,secondary,largeMod = false) {
    console.log(`NODE ${textLabel} CREATED!`)
    parent instanceof DrawingManager? null : console.error('Parent of MyNode must be instance of DrawingManager!');
    /**
     * Keeps track of the number of clicks, determines selection status.
     */
    this.state = 0;
    this.largeMod = largeMod;
    this.self = parent.draw.group();
    this.name = textLabel;
    this.borderChange = false;
    this.clockwisePosition = null;
    /**
     * PC number
     */
    this.number = Object.keys(allNodes).length;
    /**
     * Stored [x,y] coordinates for later use
     */
    this.coordinates = primary;
    this.outerCoordinate = secondary;
    let text = parent.draw.text(`${textLabel}`);
    let circ = parent.draw.circle(40,40).fill('white').stroke({width: '1px', color: 'black'});
    this.largeMod? text.center(...this.outerCoordinate) : text.center(...this.coordinates);
    circ.addClass(`myCircle`);
    circ.center(...this.coordinates);
    this.self.add(circ);
    this.self.add(text);
    this.self.addClass('MyNode');
    this.self['node']['data-note'] = null;//Added by noteName() later
    /**
     * Find a way to show which of the texts are visible.
     */
    this.self['node']['data-tooltip'] = [`Click to add ${textLabel} to superset.`,`Click to add ${textLabel} to subset.`,`Click to remove ${textLabel} from all sets.`];
    this.self['node'].id = `myNode${textLabel}`;//Set ID.
    /**
     * Move the node to a new position.
     * @param {float} x
     * @param {float} y
     */
    this.move = (x,y) => {
        this.self.center(x,y);
        this.coordinates = [x,y];
    }
    /**
     * Store object reference in allNodes object.
     */
    allNodes[`n${textLabel}`] = this;
}

/**
 * Gets all instances of .label class and gives them tooltips based on data.
 */
const getLabelClass = () => {
    let finds = document.querySelectorAll('.container');
    finds.forEach(elem => {
        let text = elem.childNodes[1].textContent;//
        let message = null;
        switch (text) {
            case 'Modular Universe': 
                // console.log('Trigger case 1');
                message = `Change this number to change the number of modular nodes.`;
                break;
            case 'Transposition': 
                // console.log('Trigger case 2')
                message = `Select transpositions of the subset that fit within the superset.`
                break;
            case 'Inversion':
                // console.log('Trigger case 3')
                message = `Select inversions of the subset that fit within the superset.`
                break;
            case 'Superset Complement':
                message = `Get the opposing collection of elements from the current superset.`;
                break;
            case 'Subset Complement':
                message = `Get the opposite collection of elements contained within the superset.`
                break;
            case 'Note Names':
                message = `Toggle the visibility of note names.`;
                break;
            case 'Toggle Symmetry':
                message = `Toggle the visibility of symmetry lines.`;
                break; 
            case 'Show Cents':
                message = `Show cents (cET) between select nodes.`;
                break;
            case 'M-Operation':
                message = `Multiply elements of the set by an index coprime to the universe cardinality if the result is contained within the prevailing superset.`
                break;
        }
        elem['data-tooltip'] = message; //Currently adds to the container. Add to all children?
        elem.childNodes.forEach(item => {
            item['data-tooltip'] = message;
        })//Lol this is terrible.
    })
}

let D;

let A;
let B;
let C;

/**
 * Populates the two drop down menus on the input.
 */
const populateDrops = () => {
    A = new MyDropdown('ts','TRANSPOSITION',D.transformation);
    B = new MyDropdown('is','INVERSION',D.transformation);
    C = new MyDropdown('moperation','MULTIPLICATION',D.transformation);
    A.removeOptions();
    B.removeOptions();
    C.removeOptions();
    console.log('Populate Drops Triggered!');
    let big = D.drawingData['superset'];
    let setRep = new MySet(Object.keys(allNodes).length,...D.drawingData['subset'],) 
    let setClass = setRep.set_class(undefined,undefined,undefined,true);
    console.table(setClass);
    // console.log(setClass);
    let ti = [0,0,0];
    Object.entries(setClass).forEach(([key,value]) => {
        if (ArrayMethods.allContained(big,value) == true) {
            let current = null;
            if (key[0] == 'T') {
                current = A;
                ti[0]++;
            }
            else if (key[0] == 'I') {
                current = B;
                ti[1]++;
            }
            else {
                current = C;
                ti[2]++;
            }
            current.addOption(key,key,`[${setClass['T0']}] under ${key} => [${value}] ${key[0] == 'M'? `SC: (${new MySet(Object.keys(allNodes).length,...value).prime_form()})` : ''}`);
        }
    });
    A.construct(B,C);
    B.construct(A,C);
    C.construct(A,B); 
} 

/**
 * Adds pertinent event listeners.
 */
const attachListeners = () => {
    /**
     * Universe field submission
     */
    let field = document.querySelector('#universe');
    field.addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            console.log('Enter was registered!');
            D.clearDrawing();
            D.drawingData['Universe'] = parseInt(field.value);
            D.mainPolygon(this.center,D.drawingData['Universe'],160);   //MAYBE?
            D.updateNodeStates();
        }
    })
    /**
     * Add listeners to buttons
     */
    document.querySelectorAll('.but').forEach(item => {
        item.addEventListener('mousedown',() => {
            switch (item.id) {
                case 'superComp':
                    D.complement('superset');
                    break;
                case 'subComp':
                    D.complement('subset');
                    break;
                case 'noteNames':
                    D.noteNames();
                    break;
                case 'symm':
                    D.drawingData['symmetry-state'];
                    if (item.innerHTML == 'NONE') {
                        D.drawingData['symmetry-state'] = 1;
                    }
                    else if (item.innerHTML == 'Superset') {
                        D.drawingData['symmetry-state'] = 2;
                    }
                    else if (item.innerHTML == 'Subset') {
                        D.drawingData['symmetry-state'] = 3;
                    }
                    else {
                        D.drawingData['symmetry-state'] = 0;
                    }
                    D.symmetryVisibility(D.drawingData['symmetry-state']);
                    break;
                case 'cents':
                    D.drawingData['cent-state'] = 0;
                    if (item.innerHTML == 'NONE') {
                        D.drawingData['cent-state'] = 0;
                    }
                    else if (item.innerHTML == 'Superset') {
                        D.drawingData['cent-state'] = 1;
                    }
                    else if (item.innerHTML == 'Subset') {
                        D.drawingData['cent-state'] = 2;
                    }
                    // item['data-state'] = state;
                    D.showCents(D.drawingData['cent-state']);
                    break;
                }
            })
    });
}

document.addEventListener('DOMContentLoaded',() => {
    console.log('DOM Loaded!');
    D = new DrawingManager('drawing');
    /**
     * Default drawing.
     */
    D.mainPolygon(undefined,undefined,160);
    D.drawingData['Universe'] = 12;
    getLabelClass();
    attachListeners();
    D.updateNodeStates();
})


//TODO: Electron //Make this a real app!

/**
 * Creates a preset set with the given parameters.
 * @param {int} modulus 
 * @param {array} superset 
 * @param {array} subset 
 */
function Preset(modulus,superset,subset) {
    this.universe = modulus;
    this.superset = superset;
    this.subset = subset;
    /**
     * Renders the preset selection.
     */
    this.render = () => {
        D.manualSelection(this.universe,this.superset,this.subset,true);
    }
}

/**
 * Combines the arrays in an object into a single array.
 * @param {object} obj 
 * @returns set of all elements.
 */
const combine = (obj = Carrillo) => {
    let tot = [];
    Object.values(obj).forEach(arr => {
        tot.push(...arr);
    })
    return Array.from(new Set(tot));
}

/**
 * Contains the pitch class content within the Prelude a Colon mm 1-
 */
const Carrillo = {
    'Flauta': [32,88,32,36,28,24,40,8,0,4],
    'Violin': [32,36,28,24,20,16,12,8,4,0,92,88,84,80,76,72,68,64,60,56,52,48,44,40],
    'Octavina': [32,34,36,38,32,52,72,92,72],//M3
    'Soprano': [32,36,28,24,20,16,12,8,4,0,92,88,84,80,84,76,72,68,64,60,56,52,48,44,40,36,32],
    'Guitarra': [32,52,72,92,72,32,64,36,68,40,72],
    'Arpa': [32,48,72,16,36,40]
}

/**
 * A collection of presets that can be easily drawn.
 * @type {Object}
 */
const Library = {
    'DiatonicTriad': new Preset(12,[0,2,4,5,7,9,11],[0,4,7]),
    'Carrillo96': new Preset(96,combine(),[32,64]),
    'Carrillo48': new Preset(48,combine().map(x => x/2),[32,64].map(x => x/2)),
    'OctatonicPR': new Preset(12,[0,1,3,4,6,7,9,10],[0,4,7]),
    // 'PareidoliaA': new Preset(31,[0, 5, 6, 10, 14, 18, 22, 23, 27],[0, 5, 18, 23]),
}

/**
 * The combinatorial Hexachords outlined by Babbitt.
 */
const Hexachords = {
    '0': new Preset(12,[0,1,2,3,4,5,6,7,8,9,10,11],[0,1,2,3,4,5]), 
    '1': new Preset(12,[0,1,2,3,4,5,6,7,8,9,10,11],[0,2,3,4,5,7]),
    '2': new Preset(12,[0,1,2,3,4,5,6,7,8,9,10,11],[0,2,4,5,7,9]),
    '3': new Preset(12,[0,1,2,3,4,5,6,7,8,9,10,11],[0,1,2,6,7,8]),
    '4': new Preset(12,[0,1,2,3,4,5,6,7,8,9,10,11],[0,1,4,5,8,9]),
    '5': new Preset(12,[0,1,2,3,4,5,6,7,8,9,10,11],[0,2,4,6,8,10]),
}

//To page 4....2nd of score


/**
 * Define a chord group. Useful for analysis.
 * @param {int} modulus 
 * @param  {...Array} chords 
 */
function ChordGroup (modulus = 12,...chords) {
    this.modulus = modulus;
    this.chords = [...chords];
    this.full_data = {};
    this.generic_data = {}
    for (let a = 0; a < this.chords.length; a++) {
        let z = new MySet(this.modulus,...this.chords[a]);
        let t = z.normal_order();
        this.full_data[a] = {
            'Set Rep': z,
            'Normal Form': t,
            'Prime Form': z.prime_form(),
            'Interval Class Vector': z.interval_class_vector(),
            'Index Vector': z.index_vector(),
            'Note Names': null,
            'Transforms': [],
        }
        let curr = this.full_data[a];
        if (`${this.modulus}` in PitchSystems) {
            let sys = PitchSystems[`${this.modulus}`];
            curr['Note Names'] = t.map(x => sys[x]);
        }
        else {
            curr['Note Names'] = 'UNAVAILABLE';
        }
    }
    /**
     * Who TF knows.
     * @param {int} OPCI 
     * @returns 
     */
    this.transposeGroup = (OPCI) => {
        let modified = []
        let z = [...this.chords].forEach(elem => {
            modified.push(elem.map(x => (x+OPCI)%this.modulus));
        })
        return new ChordGroup(this.modulus,...modified);
    }
    /**
     * Determines if there is a relationship between two chords.
     * @param {int} chord1 
     * @param {int} chord2 
     * @returns 
     */
    this.relationship = (chord1,chord2) => {
        if (this.chords[chord1] && this.chords[chord2]) {
            let s1 = new MySet(this.modulus,...this.chords[chord1]).compare_set(this.chords[chord2]);
            return s1;
        }
        else {
            console.error(`Valid indices include 0-${this.chords.length}!`);
        }
    }
    /**
     * Returns a specific request from the organized property.
     * @param {string} type 'specific' or 'generic'
     * @param {...string} keys {Normal Form, Prime Form, Interval Class Vector, Index Vector}
     * @returns 
     */
    this.query = (type,...keys) => {
        let result = {};
        let disp = {};
        let arr = null;
        if (type == 'specific') {
            arr = Object.entries(this.full_data);
        }
        else if (type == 'generic') {
            arr = Object.entries(this.generic_data);
        }        
        else {
            console.error(`ERROR: Type must be 'specific' or 'generic'!`);
            return;
        }
        for (let a = 0; a < arr.length; a++) {
            let temp = {};
            let conc = {};
            if (keys.length > 1) {
                keys.forEach(k => {
                temp[k] = arr[a][1][k];
                conc[k] = `[${arr[a][1][k]}]`;
                })
                result[a] = temp;
                disp[a] = conc;
            }
            else {
                result[a] = arr[a][1][keys];
                disp[a] = `[${arr[a][1][keys]}]`;
            }
        }
        console.table(disp);
        return result;
    }
    /**
     * The number of unique transformations contained within the prevailing superset.
     * @param {int} chord 
     */
    this.unique_chords_contained = (chord = 0) => {
        if (chord >= 0 && chord < this.chords.length) {
            let tot = [];
            let z = new MySet(this.modulus,...this.chords[chord]);
            let sc = z.set_class();
            for (let [key,value] of Object.entries(sc)) {
                let test = ArrayMethods.allContained(this.superset,value);
                test? tot.push(value) : null;
            }
            tot = ArrayMethods.unique_subarray(tot);
            return tot.length;
        }
        else {
            return `ERROR: ${this.chords.length} Chords in group, index ${chord} is out of bounds!`;
        }
    }
    /**
     * Returns an object with the number of unique chords contained within the superset for each chord in the group.
     */
    this.all_chord_instances = () => {
        let tab = {};
        for (let a = 0; a < this.chords.length; a++) {
            tab[a] = this.unique_chords_contained(a);
        }
        console.table(tab);
        return tab;
    }
    /**
     * The complete pitch content from the input chords.
     */
    this.superset = Array.from(new Set(Object.values(this.query('specific','Normal Form')).flat())).sort((a,b) => a-b);
    let gen = Array.from({length: this.superset.length}, (e, i)=> i)
    /**
     * Draws a given chord within the parent Superset.
     * @param {string} type 'specific' or 'generic'
     * @param {int} chord 
     */
    this.specialRender = (type,chord = 0) => {
        let wow;
        if (chord >= 0 && chord < this.chords.length) {
            if (type == 'specific') {
                wow = new Preset(this.modulus,this.superset,this.chords[chord]);
            }
            else if (type == 'generic') {
                wow = new Preset(this.superset.length,gen,this.generic_data[chord]['Normal Form']);
            }
            else {
                console.error(`ERROR: Type must be 'specific' or 'generic'!`);
                return;
            }
            console.log(wow)
            wow.render();
        }
        else {
            return `ERROR: ${this.chords.length} Chords in group, index ${chord} is out of bounds!`;
        }
    }
    /**
     * Generate chords by a given interval and cardinality.
     * @param {int} interval 
     * @param {int} cardinality 
     */
    this.chordsByInterval = (interval = 3,cardinality) => {
        let manualOffset = null;
        let sup = this.superset;
        let disp = {};
        console.log(sup);
        let res = {};
        for (let a = 0; a < sup.length; a++) {
            let t = res[a] = {};
            let d = disp[a] = {};
            let int = [];
            let pitch = [];
            let find = false;
            for (let b = 0; b < cardinality; b++) {
                let i = sup[(a+(b*interval))%sup.length];
                int.push(i);
                pitch.push(PitchSystems[`${this.modulus}`]? PitchSystems[`${this.modulus}`][i] : 'N/A');
            }
            for (let c = 0; c < this.chords.length; c++) {
                if (this.chords[c].sort((a,b) => a-b).toString() == int.sort((a,b) => a-b).toString()) {
                    find = c;
                }
            }
            d['Integer'] = `[${int}]`;
            d['Notes'] = `[${pitch}]`;
            d['Contained'] = find;
            t['integer'] = int;
            t['notes'] = pitch;
        }
        console.table(disp);
        return res;
    }
    /**
     * Populates generic_data property.
     */
    for (let a = 0; a < this.chords.length; a++) {
        let z = new MySet(this.superset.length,...this.chords[a].map(x => this.superset.indexOf(x)));
        let t = z.normal_order();
        this.generic_data[a] = {
            'Set Rep': z,
            'Normal Form': t,
            'Prime Form': z.prime_form(),
            'Interval Class Vector': z.interval_class_vector(),
            'Index Vector': z.index_vector(),
            'Note Names': null,
            'Transforms': [],
        }
        let curr = this.generic_data[a];
        if (`${this.superset.length}` in PitchSystems) {
            let sys = PitchSystems[`${this.superset.length}`];
            curr['Note Names'] = t.map(x => sys[x]);
        }
        else {
            curr['Note Names'] = 'UNAVAILABLE';
        }
    }
    /**
     * Finds the intersecting elements between supersets of two ChordGroups.
     * @param {ChordGroup} group 
     * @returns 
     */
    this.intersection = (group) => {
        let res = {};
        if (group instanceof ChordGroup) {
            res['Elements'] = ArrayMethods.intersection(this.superset,group.superset).join(',');
            res['Fracton'] = `${ArrayMethods.intersection(this.superset,group.superset).length}/${this.superset.length}`;
            res['Percent'] = (ArrayMethods.intersection(this.superset,group.superset).length/this.superset.length * 100).toFixed(2) + '%';
            console.table(res);
            return res;
        }
        else {
            console.error('Argument must be instance of ChordGroup!');
        }
    }
}


const PareidoliaA = new ChordGroup(31,[0,5,18,23],[10,14,22,27],[0,5,14,18],[18,22,0,6],[10,18,22,0],[22,27,5,10],[6,10,18,22],[5,10,18,23],[18,27,5,6],[18,22,27,6]);

const PareidoliaB = new ChordGroup(31,[22,27,4,9],[14,18,27,0],[4,9,18,22],[10,14,22,26],[10,18,27],[10,18,22,0],[26,0,10,14],[14,22,27,0],[14,18,27,4],[14,27,0],[22,27,4,10]);

/**
 * A sections of Pareidolia.
 */
const PareidoliaA2 = new ChordGroup(31,[18,23,0,5],[10,14,22,27],[0,5,14,18],[18,22,0,6],[10,18,22,0],[22,27,5,10],[6,10,18,22],[23,27,5,10],[5,10,18,23],[0,5,10,18]);


const PareidoliaB2 = PareidoliaA2.transposeGroup(4);

// const ofVA = PareidoliaA2.transposeGroup(4);


//A = T4 => B Centered on A then B-half flat 

const DiatonicA = new ChordGroup(12,[0,4,7],[2,5,9],[4,7,11],[5,9,0],[7,11,2],[9,0,4],[11,2,5]);

// (0,4,13,17) and (0,5,13,18) are primary

//GROUP A SC of Chord 1 (0,4,12,17) maps onto SC Chord 3 (0,4,13,19) under M10 or M21. 

//Contune at Chord index 5 checking for M operations.

/**
 * Define a transformation of an input set within a given modulus.
 * @param {int} modulus 
 * @param {array} input 
 * @param  {...array} modification [element value, increment]
 */
function Transformation (modulus = 12,input,...modification) {
    let init = input;
    let modifications = [...modification];
    let start = new MySet(modulus,...init);
    this.chain = {'0': {
        'Initial': init,
        'Normal Form': start.normal_order(),
        'Prime Form': start.prime_form(),
        'Interval Class Vector': start.interval_class_vector(),
    }};
    this.modulus = modulus;
    /**
     * Applies the given transformation a specified number of times.
     * @param {int} iterations = 1
     * @returns 
     */
    this.apply = (iterations = 1) => {
        for (let i = 0; i < iterations; i++) {
            let cur = this.chain[Object.keys(this.chain).length-1]['Initial'];
            let index = Object.keys(this.chain).length;
            for (let a = 0; a < modifications.length; a++) {
                let t = cur.indexOf(modifications[a][0]); 
                console.log(`Add ${modifications[a][1]} to ${modifications[a][0]}...index ${t} = ${cur[t]+modifications[a][1]}`)
                cur[t] = ScaleTheory.modulo(cur[t]+modifications[a][1],this.modulus);
                modifications[a][0] = cur[t];
            }
            let z = new MySet(this.modulus,...cur);
            this.chain[index] = {
                'Initial': cur,
                'Normal Form': z.normal_order(),
                'Prime Form': z.prime_form(),   
                'Interval Class Vector': z.interval_class_vector(),
            }
        }
        let disp = {};
        Object.entries(this.chain).forEach(([key,value]) => {
            disp[key] = {
                'Normal Form': `[${value['Normal Form']}]`,
                'Prime Form': `(${value['Prime Form']})`,
                'Interval Class Vector': `<${value['Interval Class Vector']}>`,
            }
        });
        console.table(disp);
        return;
    }
}


/**
 * Chord 0 in MOD 31 Where lowest pitch is moved up incrementally.
 */
let Mod31 = new Transformation(31,[0,5,18,23],[0,16]);//
/**
 * Chord 0 in MOD 9 Where lowest pitch is moved up incrementally.
 */
let Mod9 = new Transformation(9,[5,7,0,1],[5,4]);//
