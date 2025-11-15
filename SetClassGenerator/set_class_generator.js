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
     * Straus' Degree of Symmetry tuple, and distinct forms. (See Bain)
     */
    this.dos = (array = this.set,modulus = this.universe) => {
        let vect = [0,0];
        let test = array.sort((a,b) => a-b).join('.');
        for (let a = 0; a < modulus; a++) {
            this.transpose(undefined,undefined,a).sort((a,b) => a-b).join('.') == test? vect[0]++ : null;
            this.invert(undefined,undefined,a).sort((a,b) => a-b).join('.') == test? vect[1]++ : null;
        }
        return {
            'DOS': vect,
            'DF': (modulus*2)/vect.reduce((a,b) => a+=b)
        }
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
            'Degree of Symmetry': this.dos()['DOS'],
            'Distinct Forms': this.dos()['DF'],
            'Maximally Even': `${this.set.length} into ${this.universe}: ${this.maximallyEven()}`
        };
        return json? JSON.stringify(obj) : obj;
    } 
};

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
     * Determines if an input array has the property of cardinality equals variety. This does not work...
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
 * A module containing methods for PC set theory.
 */
const PCSetTheory = {
    /**
     * Object of pitches in the 12 tone universe.
     */
    pitches: {
        0: ['C','B#'],
        1: ['C#','Db'],
        2: ['D'],
        3: ['D#','Eb'],
        4: ['E','Fb'],
        5: ['F','E#'],
        6: ['F#','Gb'],
        7: ['G'],
        8: ['G#','Ab'],
        9: ['A'],
        10: ['A#','Bb'],
        11: ['B','Cb']
    },
    /**
     * Returns a value mod n.
     * @param {int} value 
     * @param {int} mod 
     */
    modulo: (value,modulus = 12) => {
        return value < 0? (value%modulus)+modulus : value%modulus;
    },
    /**
     * Converts the input into it's opposite representation. Can modularize or not.
     * @param {any} pitch 'C#6' || 9  
     * @param {*} mod reduce output if numerical to mod 12.
     * @returns Opposte representation.
     */
    switchRepresentation: (pitch,mod = false) => {
        if (typeof pitch == 'string') {
            let note = pitch.match(/[a-z#]+/ig);
            let oct = pitch.match(/[0-9]+/ig);
            let temp = null;
            for (let [key,value] of Object.entries(PCSetTheory.pitches)) {
                if (value.indexOf(...note) !== -1) {
                    temp = parseInt(key);
                }
            }
            return mod? temp : temp+(oct-4)*12;
        }
        else if (typeof pitch == 'number') {
            pitch = PCSetTheory.modulo(pitch,12);
            if (pitch == 1 || pitch == 3 || pitch == 6 || pitch == 8 || pitch == 10) {
                return PCSetTheory.pitches[pitch].join('/');
            }
            else {
                return PCSetTheory.pitches[pitch][0];
            }
        }
        else {
            console.error(`${typeof pitch} is invalid data type, must be string: 'Bb6' or integer: '7'!`);
        }
    },
    /**
     * Get the adjacent intervals between elements in an array. Can ouput 4 interval types.
     * @param {array} array 1D array
     * @param {int} modulus = 12
     * @param {string} type OPI || UPI || OPCI || UPCI (IC);
     * @returns 1D array
     */
    intervals: (array,modulus = 12,type = 'OPCI') => {
        let adjacent = [];
        for (let a = 1; a < array.length; a++) {
            adjacent.push(array[a]-array[a-1]);
        }
        if (type == 'OPI') {
            return adjacent;
        }
        else if (type == 'UPI') {
            return adjacent.map(x => Math.abs(x));
        }
        else if (type == 'UPCI') {
            return adjacent.map(x => 
            Math.min(PCSetTheory.modulo(x),Math.abs(PCSetTheory.modulo(modulus-x))));
        }
        else if (type == 'OPCI') {
            return adjacent.map(x => PCSetTheory.modulo(x,modulus));
        }
    },
    /**
     * Generate the Interval Class Vector (ICV) of a set within the given modulus. Describes invariance under T(n) and T(12-n).
     * @param {array} array 1D array
     * @param {int} modulus = 12
     * @param {boolean} object = false
     * @returns Object || Array
     */
    intervalClassVector: (array,modulus = 12,object = false) => {
        let vector = {};
        let ints = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = a+1; b < array.length; b++) {
                //Automatically select the smaller option (IC) to add to array.
                ints.push(Math.min(PCSetTheory.modulo(array[b]-array[a],modulus),PCSetTheory.modulo(array[a]-array[b],modulus)));
            }
        }
        for (let i = 1; i <= Math.floor(modulus/2); i++) {
            vector[`IC${i}`] = AdvancedArray.allIndexesOf(ints,i).length;
        }
        return object? vector: Object.values(vector);
    },
    /**
     * Generate the Index Vector (IV) of a set within the given modulus. Describes invariance under T(n)I.
     * @param {array} array 1D array
     * @param {int} modulus = 12
     * @param {boolean} object = false
     * @returns Object || Array
     */
    indexVector: (array,modulus = 12,object = false) => {
        let vector = {};
        let ints = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = 0; b < array.length; b++) {
                ints.push(PCSetTheory.modulo(array[a]+array[b],modulus));
            }
        }
        for (let i = 0; i < modulus; i++) {
            vector[`T${i}I`] = AdvancedArray.allIndexesOf(ints,i).length;
        }
        return object? vector : Object.values(vector);
    },
    /**
     * Performs transposition, Tn, (rotation) by a given index upon the input set.
     * @param {array} array 1D array
     * @param {int} modulus = 12
     * @param {int} index = 0 The level to transpose by.
     * @returns 1D array
     */
    transpose: (array,modulus = 12, index = 0) => {
        return array.map(x => PCSetTheory.modulo(x+index,modulus));
    },
    /**
     * Performs inversion, TnI, (reflection) by a given index upon the input set.
     * @param {array} array 1D array
     * @param {int} modulus = 12
     * @param {int} index = 0 The index to invert by. (Axis of symmetry will be this number * 2 reduced mod n)
     * @returns 1D array
     */
    invert: (array,modulus = 12, index = 0) => {
        return array.map(x => PCSetTheory.modulo(index-x,modulus)).sort((a,b) => a-b);
    },
    /**
     * Returns the normal order of the input set.
     * @param {array} array 
     * @param {int} modulus 
     * @returns 1D array
     */
    normalOrder: (array,modulus = 12) => {
        array.sort((a,b) => a-b);   //Step 1 numerical order.
        let possible = Object.values(AdvancedArray.rotation(array));
        let round = 1;
        while (possible.length > 1) {
            let ints = [];
            if (round == array.length) {
                break;
            }
            possible.forEach(rotation => {
                //Measure the boundary interval for each rotation
                ints.push(PCSetTheory.modulo(rotation[rotation.length-round]-rotation[0],modulus));
            })
            //Find the indices of the smallest interval, they go on to the next round.
            let mins = AdvancedArray.allIndexesOf(ints,Math.min(...ints));
            possible = mins.map(x => possible[x]);
            round++;
        } 
        return possible[0];
    },
    /**
     * Returns the prime form of the input set.
     * @param {array} array 
     * @param {int} modulus 
     * @returns 1D array
     */
    primeForm: (array,modulus = 12) => {
        let start = performance.now();
        let no = PCSetTheory.normalOrder(array,modulus); //Start with the normal order.
        let opts = [no,PCSetTheory.invert(no,modulus)];
        opts[0] = opts[0].map(x => PCSetTheory.modulo(x-opts[0][0]));//Set no to 0.
        opts[1] = PCSetTheory.normalOrder(opts[1],modulus);
        opts[1] = opts[1].map(x => PCSetTheory.modulo(x-opts[1][0],modulus));//Set inv to 0.
        let round = 1;
        while (opts.length == 2) {
            let ints = [];
            if (round == array.length) {
                break;
            }
            opts.forEach(poss => {
                ints.push(PCSetTheory.modulo(poss[round]-poss[round-1],modulus));
            })
            let roundWinners = AdvancedArray.allIndexesOf(ints,Math.min(...ints));
            opts = roundWinners.map(x => opts[x]);
            round++;
        }
        let end = performance.now();
        //console.log(`Initial: ${end-start}`);
        return opts[0];
    },
    /**
     * Returns the powerset of the input array using bitwise operands.
     * @param {array} array
     * @param {int} cardinality 
     * @returns Powerset as 2D array
     */
    literalSubsets: (array,cardinality = undefined) => {
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
    },
    /**
     * Directly generate subsets of size n given an input array.
     * @param {array} array 
     * @param {int} cardinality 
     */
    cardinal_specific_subsets: function* (array,cardinality) {
        let n = array.length;
        let k = cardinality;
        if (k <= 0 || k > n) return;
        let v = (1 << k) - 1; // first mask with k ones
        let limit = 1 << n;
        while (v < limit) {
            let subset = [];
            for (let i = 0; i < n; i++) {
                if (v & (1 << i)) {
                    subset.push(array[i]);
                }
            }
            yield subset; // yield instead of push
            // Gosper’s hack step
            let c = v & -v;
            let r = v + c;
            v = (((r ^ v) >>> 2) / c) | r;
        }
    },
    /**
     * Returns all members of the T/I group of the input set.
     * @param {array} array 
     * @param {int} modulus 
     * @returns Object
     */
    setClass: (array,modulus = 12) => {
        let result = {};
        for (let a = 0; a < modulus; a++) {
            result[`T${a}`] = PCSetTheory.transpose(array,modulus,a);
            result[`I${a}`] = PCSetTheory.invert(array,modulus,a);
        }
        return result;
    },
    /**
     * Returns the strongest relationship between two sets.
     * @param {array} array1 
     * @param {array} array2 
     * @param {int} modulus 
     * @returns String
     */
    setRelation: (array1,array2,modulus = 12) => {
        let initial = AdvancedArray.commonElements(array1,array2,true);
        /**
         * Are two inputs of the same cardinality?
         */
        if (initial !== 1 && array1.length == array2.length) {
            let sc = PCSetTheory.setClass(array1,modulus);
            let res = [];
            /**
             * Check for T or I
             */
            for (let [key,value] of Object.entries(sc)) {
                if (AdvancedArray.commonElements(value,array2,true) == 1) {
                    res.push(key);
                }
            }
            if (res.length !== 0) {
                return `{${array1}} and {${array2}} are related by: ${res}`;
            }
            /**
             * Check for Z relation
             */
            else {
                let icv1 = PCSetTheory.intervalClassVector(array1,modulus);
                let icv2 = PCSetTheory.intervalClassVector(array2,modulus);
                return AdvancedArray.uniques([icv1,icv2]).length == 1? `{${array1}} and {${array2}} are Z related.` : `No Relation.`
            }
        }
        else if (initial == 1 && array1.length == array2.length) {
            return 'Two inputs are identical.'
        }
        else {
            /**
             * Literal Inclusion
             */
            let lens = [array1,array2].sort((a,b) => a.length - b.length);
            if (AdvancedArray.isSubsetOrEqual(array1,array2)) {
                return `{${lens[0]}} is a literal subset of {${lens[1]}}`;
            }
            /**
             * Abstract Inclusion
             */
            else {
                let smallSC = PCSetTheory.setClass(lens[0]);
                let res = [];
                for (let [key,value] of Object.entries(smallSC)) {
                    AdvancedArray.isSubsetOrEqual(value,lens[1]) == true? res.push(key) : null;
                }
                console.log(res);
                return res.length > 0? `{${lens[0]}} is an abstract subset of {${lens[1]}}. Contained ${res.length} times.` : 'No Relation';
            }
        }
    },
    /**
     * Returns all set classes of a given universe. 
     * @param {int} universe 
     * @param {int} cardinality 
     * @returns Object || 2D array
     */
    listSetClasses: (universe = 12,cardinality = undefined) => {
        let start = performance.now();
        if (cardinality > universe) {
            console.error(`${cardinality} is larger than the total universe!`)
        }
        let res = {};
        let conc = [];
        let univ = [...Array(universe).keys()];
        let allSubs = PCSetTheory.literalSubsets(univ,cardinality);//Not sure if card param will work here.
        allSubs.forEach(subset => {
            if (subset.length > 1) {
                let temp = PCSetTheory.primeForm(subset,universe);
                if (!conc.includes(temp.join('.'))) {   //Check if item is in the list. 
                    conc.push(temp.join('.'));
                    res[temp.length] == undefined? res[temp.length] = [temp] : res[temp.length].push(temp);//Must instantiate and populate if object[card] is undefined.
                }
            }
        })
        return res;
    }
}

/**
 * 
 * @param {array} array1 
 * @param {array} array2 
 * @param {int} modulus 
 */
const fuzzy = (array1,array2,modulus = 12) => {
    let sc1 = PCSetTheory.setClass(array1,modulus);
    let scores = {};
    let hiScore = 0;
    for (let [key,value] of Object.entries(sc1)) {
        let temp = AdvancedArray.commonElements(value,array2).length;//CTs
        
    }
    //Filter
}


/**
 * Gets the prime form of an input binary number.
 * @param {int} number 
 * @returns Array
 */
const binaryFun = (number) => {
    let st = performance.now();
    let og = number;
    let ogInds = AdvancedArray.allIndexesOf(og,'1');
    let inv = [...number].reverse();
    let invInds = AdvancedArray.allIndexesOf(inv,'1');
    let all = [];
    let sizes = [];
    for (let a = 0; a < ogInds.length; a++) {
        let tOG = AdvancedArray.rotation(og,ogInds[a],false);
        let jOG = tOG.slice(0,tOG.lastIndexOf('1')+1).join('');
        let tINV = AdvancedArray.rotation(inv,invInds[a],false);
        let jINV = tINV.slice(0,tINV.lastIndexOf('1')+1).join('');
        all.push(jOG);
        sizes.push(jOG.length);
        all.push(jINV); 
        sizes.push(jINV.length);    
    }
    let res = Math.max(...all.filter(x => x.length == Math.min(...sizes)));
    let end = performance.now();
    //console.log(`NEW: ${end-st}`);
    return AdvancedArray.allIndexesOf(`${res}`,'1');
}

/**
 * Simple constructor for storage objects.
 * @param {any} value 
 * @param {string} tooltip 
 */
function DataPoints (value,tooltip) {
    this.value = value;
    this.tooltip = tooltip;
}

/**
* Monitors the hovering of the cursor. Updates tooltip box.
*/
const mouseTracking = () => {
    let offset = 15;//Offset for tooltip box.
    let tt = document.querySelector(`#tooltips`);//
    document.addEventListener('mouseover',(element) => {    //Whole document allows tooltips!
        let message = undefined;
        let position = [element.clientX+window.scrollX,element.clientY+window.scrollY];
        tt.style.left = `${position[0]+offset}px`;
        tt.style.top = `${position[1]+offset}px`;
        if (element.target.parentNode.tagName !== 'g' && element.target.tagName == `tspan`) {    //Catch text
            // console.log(element.target.parentNode.parentNode.tagName);
            message = element.target.parentNode.parentNode['data-tooltip'];
        }
        else if (element.target.parentNode.tagName == 'g') {   
            // console.log(element.target.parentNode.tagName); 
            message = element.target.parentNode['data-tooltip'];
        }
        else {
            // console.log(element.target.tagName);
            message = element.target['data-tooltip'];
        }
        tt.style.visibility = message? 'visible' : 'hidden';
        if (typeof message == 'object' && Array.isArray(message)) {
            tt.innerHTML = `${message[element.target['data-status']]}`;
        }
        else if (typeof message !== 'object') {
            tt.innerHTML = message;
        }
    })
}

let STORE = {
    'universe': null,
    'cardinality': null,
    'complement': null,
};

/**
 * Perform upon load.
 */
document.addEventListener('DOMContentLoaded',() => {
    console.log('LOADED');
    mouseTracking();
    let setStorage = [];
    document.querySelectorAll('#inputs > *').forEach(item => {
        item.addEventListener('keydown',(event) => {
            if (event.key == 'Enter') {
                /**
                * Populate universe with value of input.
                */
                if (item.id == 'univ') {
                    STORE['universe'] = parseInt(item.value);
                }
                /**
                * Populate cardinality with value of input.
                */
                else if (item.id == 'card') {
                    STORE['cardinality'] = parseInt(item.value);
                    STORE['complement'] = STORE['universe']-parseInt(item.value)
                }
                else {
                    console.error('Invalid input ID!');
                }
                /**
                * If both values are populated, proceed with SC calculation.
                */
                if (STORE['universe'] !== null && STORE['cardinality'] !== null) {
                    /**
                     * If both are defined, clear set storage and result box.
                     */
                    setStorage = [];
                    document.querySelector('#info').innerHTML = '';
                    document.querySelector('#list').innerHTML = '';
                    console.log(`Proceed with UNIV: ${STORE['universe']} & CARD: ${STORE['cardinality']}`);
                    let ints = [];
                    for (let a = 0; a < STORE['universe']; a++) {
                        ints.push(a);
                    }
                    /**
                     * This isn't working correctly. Doesn't return anything.
                     */
                    let initList = Array.from(PCSetTheory.cardinal_specific_subsets(ints,STORE['cardinality']));
                    let pfs = [];
                    initList.forEach(item => {
                        let s = new MySet(STORE['universe'],...item);
                        setStorage.push(s);
                        pfs.push(s.prime_form());
                    })
                    let filt = ArrayMethods.unique_subarray(pfs);
                    /**
                     * Attempt to sort into Reverse Lexicographical order...fails for Z-related sets.
                     */
                    let sor = filt.map(x => [x,new MySet(STORE['universe'],...x).interval_class_vector().join('')]).sort((a,b) => a[1] + b[1]).map(z => z[0]);
                    console.table(sor);
                    let info = document.querySelector('#info');
                    let list = document.querySelector('#list');
                    let h1 = document.createElement('h3');
                    let head = document.createElement('h3');
                    h1.innerHTML = `<em>k</em> = ${STORE['universe']}`;
                    head.textContent = `${STORE['cardinality']}-Chords:`;
                    let mini = document.createElement('ol');
                    filt.forEach(entry => {
                        let item = document.createElement('li');
                        item.classList.add('hoverable');
                        item.textContent = `(${entry})`;
                        mini.appendChild(item);
                    });
                    info.append(h1,head);
                    list.appendChild(mini);
                }
                /**
                 * If missing value, console.error the required input.
                 */
                else {
                    if (STORE['universe'] == null) {
                        console.error('Universe cardinality undefined!');
                    }
                    else {
                        console.error('Set cardinality undefined!');
                    }
                }
            }
        })
    })  
    document.querySelector(`#result`).addEventListener('mousedown',(event) => {
            document.querySelectorAll('.selected').forEach(item => {
                item.classList.remove('selected');
            })
            if (event.target.classList.contains('hoverable')) {
                event.target.classList.add('selected');
                let num = new MySet(STORE['universe'],...event.target.textContent.match(/[0-9]+/ig).map(x => parseInt(x)));
                let comp = [];
                for (let a = 0; a < STORE['universe']; a++) {
                    num.prime_form().indexOf(a) == -1? comp.push(a) : null;
                }
                let c = new MySet(STORE['universe'],...comp);
                let bigDisplay = document.querySelector(`#data`);
                bigDisplay.innerHTML = '';
                let sel = document.createElement('h3');
                sel.textContent = `SC: ${event.target.textContent}`;
                bigDisplay.append(sel);
                let ob = {
                    'Interval Class Vector': new DataPoints(`<${num.interval_class_vector()}>`,'The number of tones held invariant under a T<sub><em>n</em></sub> operation.'),
                    'Index Vector': new DataPoints(`<${num.index_vector()}>`,'The number of tones held invariant under a T<sub><em>n</em></sub>I operation.'),
                    'Complement': new DataPoints(`(${c.prime_form()})`,'The opposite elements to the original, placed in prime form.'),
                    'Distinct Forms': new DataPoints(`${num.dos()['DF']}`,'The number of unique instances of this SC.'),
                    'Degree of Symmetry': new DataPoints(`${num.dos()['DOS']}`,'An ordered tuple [x,y] indicating the number of self-mapping transposition (x) and self-mapping inversioin (y) operations.'),
                    'Z-Partner': undefined,
                    'Maximally Even': undefined
                }
                /**
                 * Check for Z-partner
                 */
                ob['Maximally Even'] = num.maximallyEven()? new DataPoints(String(num.maximallyEven()).toUpperCase(),`A set that is "as spread out as possible" with respect to the elements in the parent universe.`) : undefined;
                setStorage.forEach(item => {
                    num.interval_class_vector().join('.') == item.interval_class_vector().join('.') && num.prime_form().join('.') !== item.prime_form().join('.')? ob['Z-Partner'] = new DataPoints(`(${item.prime_form()})`,"Two sets are Z-Related if they have the same interval content (same interval-class vector), but are not members of the same set-class.") : null; 
                })
                console.log(ob);
                Object.entries(ob).forEach(item => {
                    let miniRow = document.createElement('div');
                    miniRow.classList.add('fakeRow');
                    let lab = document.createElement('p');
                    lab.textContent = `${item[0]}:`;
                    let data = document.createElement('p');
                    data.textContent = item[1] instanceof DataPoints? item[1]['value'] : '';
                    lab['data-tooltip'] = item[1] instanceof DataPoints? item[1]['tooltip'] : '';
                    miniRow.append(lab,data);
                    /**
                     * If item is undefined, don't add to the box.
                     */
                    item[1] == undefined? null : bigDisplay.appendChild(miniRow);
                })
            }
        })  
})

