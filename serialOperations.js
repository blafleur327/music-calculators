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
     * Checks if two arrays are the same.
     * @param {array} array1 
     * @param {array} array2 
     * @returns boolean
     */
    sameArray: function (array1,array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        else {
            let s1 = array1.sort((a,b) => a-b);
            let s2 = array2.sort((a,b) => a-b);
            return s1.join('|') == s2.join('|');
        }
    },
    /**
     * Returns all indices of a query found within the parent array.
     * @param {array} array 1D array
     * @param {any} item item to find
     * @returns 1D array
     */
    allIndexesOf: (array,item,result = [],offset = 0) => {
        if (array.length == 0 || array.indexOf(item) == -1) {
            return result;
        }
        else {
            let find = array.indexOf(item);
            result.push(find+(offset));
            return AdvancedArray.allIndexesOf(array.slice(find+1),item,result,offset+find+1)
        }
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
 * Searches an array for an adjacency pattern. Order doesn't matter.
 * @param {array} array Array to search for pattern
 * @param {array} search Pattern to match
 * @param {array} res 2D array of [start,stop] indices
 * @param {int} offset Keeps track of the displaced indices through slicing
 * @returns 2D array (res)
 */
 adjacentIndices: function (array,search,res = [],offset = 0) {
    /**
     * Base case.
     */
    if (array.length == 0 || array.indexOf(search[0]) == -1) {
      return res;
    }
    else if (search.length == 1) {
        return [array.indexOf(search[0])];
    }
    else {
        let inds = [];
        search.forEach(item => {
            if (array.indexOf(item) > -1) {
                inds.push(array.indexOf(item));
            }
        })
        let valid = search.length == inds.length;
        let big = Math.max(...inds);
        let small = Math.min(...inds);
        let adj = big-small == search.length-1;
        adj == true && valid == true? res.push([small+offset,big+offset]): null;
        /**
        * This needs to not start from the max if the adjacency check fails...
        */
        let stor = adj == true? array.slice(big) : array.slice(small+1);
        /**
        * Offset adjusts by where you start!
        */
        let offVal = adj == true? big : small+1;
        return ArrayMethods.adjacentIndices(stor,search,res,offset+offVal);
        }
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
     * @returns Unique Subs || Counts.
     */
    unique_subarray: function (array,ordered = false,return_count = false) { //O(n * log(m))
        let step1 = ordered? array.map(sub => sub.join('|')) : array.map(sub => sub.sort((a,b) => a-b).join('|'));
        let elim = Array.from(new Set(step1));
        let inds = elim.map(x => step1.indexOf(x));
        if (return_count == false) {
            return inds.map(index => array[index]);
        }
        else {
            return inds.map(index => [array[index],this.get_many(step1,step1[index]).length]);
        }
    }
}

/**
 * Equivalent to the Python print operation, since I am lazy.
 * @param {function} operation 
 */
const print = (operation) => {
    console.log(operation);
}

const factors = (n) => {
    let res = [];
    let test = 1;
    while (test <= n/test) {
        if (n%test == 0) {
            res.push(test,n/test);
        }
        test++;
    }
    return Array.from(new Set(res.sort((a,b) => a-b)));
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
        let i = parseInt(index,10);
        return array.map(x => this.modulo(x+i,modulus)); //O(n);
    },
    /**
     * 
     * @param {int} index 
     * @returns this.set -> t(n)I mod this.universe. 
     */
    this.invert = function (array = this.set,modulus = this.universe,index = 0) {
        let i = parseInt(index,10);
        return array.map(x => this.modulo(i-x,modulus)); //O(n);
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
    this.abstract_subsets = (array = this.set, mod = this.universe) => {    //2 additional operations.
        let start = this.literal_subsets(null,array).filter(x => x.length > 2);
        return start.map(y => this.prime_form(y,mod)).sort((a,b) => a.length < b.length);
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
    this.set_class = (array = this.set,modulus = this.universe) => {
        let result = {};
        for (let a = 0; a < modulus; a++) {
            result['T'+a] = this.normal_order(array.map(x => this.modulo(x+a,modulus)),modulus);
            result['I'+a] = this.normal_order(array.map(y => this.modulo(a-y,modulus)),modulus);
        }
        return result;
    },
    /**
     * 
     * @param {array} array 
     * @param {int} modulus 
     * @returns Axes of Symmetry
     */
    this.symmetry = (array = this.set,modulus = this.universe) => {
        let res = [];
        let test = array.sort((r,s) => r-s).reduce((f,k) => f+'|'+k);
        for (let a = 0; a < modulus; a++) {
            let opt = this.invert(array,modulus,a).sort((i,j) => i-j).reduce((l,m) => l+'|'+m);
            opt == test? res.push([a/2,(a/2)+(modulus/2)]): null;
        }
        return res;
    },    

    /**
     * Determines if two input arrays have any meaningful PC relationship. It the sets are the same cardinality, test
     *  for T/I and Z relation. If the two sets are not the same cardinality, tests for literal and abstract (Prime Form) inclusionary relationship.
     * @param {array} array1 
     * @param {array} array2 
     * @param {int} modulus 
     * @returns Relationship;
     */
    this.compare_set = (array1, array2 = this.set,modulus = this.universe,showLevels = false) => {
        let no1 = this.normal_order(array1,modulus); 
        let no2 = this.normal_order(); 
        if (array1.length == array2.length) {   //Transposition or Inversional Equivalence.
            let sc = this.set_class(no2,modulus); //All t & i transformations.
            let res = [];
            let indexes = [];
            for (value in sc) { 
                if (ArrayMethods.array_concat(sc[value]) == ArrayMethods.array_concat(no1)) {
                    res.push(value);    //Right now this will only return the last indexes that worked.
                    indexes.push(value);
                }
            }
            if (res === null) { //Z relation
                if (ArrayMethods.array_concat(this.interval_class_vector(array2,modulus)) == ArrayMethods.array_concat(this.interval_class_vector(array1,modulus)) == true) {
                    res = `[${array1}] and [${array2}] are Z related.`;
                }
                else if (Array.from(new Set(...array1,...array2)).length == modulus) {
                    res = `[${array1}] and [${array2}] are complementary.`
                }
                else {
                    res = 'No Relationship.';
                }
            }
            return showLevels? indexes: res;
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
    }
}

/**
 * Methods used for Scale Theoretical calculations. Dependent upon the updated ArrayMethods class.
 */
const ScaleTheory = {
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
        array = array.sort((a,b) => a-b);    //Put in ascending order
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
        return ScaleTheory.degenerate(array,universe)? false: array.length <= Math.floor(universe/2)+1;
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
        let bin = ScaleTheory.maxEvenInts(array.length,universe,generate);  //Variable output depending on next steps.
        if (generate == false) {    //Test input for ME property. -> Boolean
            return ArrayMethods.isRotation(ScaleTheory.ais(array,universe,true),bin);
        }
        else {  //Generate options -> Array.
            let result = ArrayMethods.rotations(bin);
            result.map(x => {
                let first = x[0];   
                for (let i = 0; i < x.length; i++) {
                    x[i] = ScaleTheory.modulo(x[i]-first,universe); //Transpose each rotation to zero.
                }
                x.sort((a,b) => a-b);
            })
            return ArrayMethods.unique_subarray(result);    //Eliminate duplicates if present.
        }
    },
    myhillsProperty: function (array,universe) { //Still not 100% sure how this is different from CV...
        return ScaleTheory.maximallyEven(array,universe)? ArrayFrom(new Set(ScaleTheory.ais(array,modulus,true))).length == 2: false;
    }
}


/**
 * Set of Methods useful for working with tone-rows and matrixes.
 */
const Serialism = {
    /**
     * Returns a value mod n.
     * @param {int} value 
     * @param {int} modulus 
     * @returns value mod modulus; 
     */
    modulo: function (value,modulus) {
        return value >= 0? value%modulus : (value%modulus)+modulus; 
    },
    toPitch: function (array,universe) {
        if (universe == 12) {
            pitches = ['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B'];
            return array.map(x => pitches[x]);
        }
        else {
            console.error(`Pitch class conversion not available in modulo ${universe}.`);
        }
    },
    /**
     * Returns even partitions of an input array of size n. Omits arbitrary (Dependant on factors)
     * @param {array} array 
     * @returns 2d Array
     */
    partition: function (array) {
        let facts = factors(array.length);
        let result = [];
        for (let a = 0; a < facts.length; a++) {
            let temp = [];
            let len = array.length/facts[a];
            for (let b = 0; b < array.length; b+=len) {
                temp.push(array.slice(b,b+len));
            }
            result.push(temp);
        }
        return result.slice(1,result.length-1);
    },
    /**
     * Function for dividing a 2d matrix into bubbles of size n.
     * @param {array} array 
     * @param {int} size factor of array.length
     * @returns bubbles
     */
    matrixBubble: function (array,size) {
        let n = array.length;
        let final = [];
        for (let a = 0; a < n; a+=size) {
            for (let b = 0; b < n; b+=size) {
                let submatrix = [];
                for (let i = a; i < a+size; i++) {
                    for (let j = b; j < b+size; j++) {
                        submatrix.push(array[i][j])
                    }
                }
                final.push(submatrix);
            }
        }
        return final;
    },
    /**
     * Create a matrix of input array. 
     * @param {array} row 
     * @param {int} universe 
     * @param {boolean} pitches Make output pitch names?
     * @returns n*n matrix
     */
    buildMatrix: function (row,universe = 12,pitches = false,labels = false) {
        let result = [[...row]];
        for (let a = 1; a < row.length; a++) {
            let tLevel = Serialism.modulo(row[0]-row[a],universe);
            //result.push(tLevel);
            result.push(row.map(elem => Serialism.modulo(elem+tLevel,universe)));
        }
        result = pitches? result.map(x => Serialism.toPitch(x,universe)) : result;  //Is this the issue?
        if (labels == true) {
            result.forEach(x => {
                x.unshift(`P${x[0]}`);
                x.push(`R${x[0]}`)
            })
            result.unshift(result[0].map(z => `I${z}`));
            result.push(result[0].map(z => `R${z}`));
            result[0][0] = ' ';
            result[0][result[0].length-1] = ' ';
            result[result.length-1][0] = ' ';
            result[result.length-1][result.length-1] = ' ';
        }        
        return result;
    },
    /**
     * Returns a single row-form of a tone row.
     * @param {array} row
     * @param {string} form 
     * @param {int} universe = 12 
     * @returns Row Form.
     */
    singleRowForm: function (row,form,universe = 12,pitches = false) {
        let regex = [...form.match(/[a-z]+/ig),parseInt(form.match(/[0-9]+/g))];
        let offset = universe-row[0]; //Move index 0 to 0.
        let store; 
        if (regex[0] === 'P' || regex[0] === 'R') {
            let temp = row.map(elem => Serialism.modulo(elem+offset+regex[1],universe));
            store = regex[0] === 'P'? temp : temp.reverse();
        }
        else if (regex[0] === 'I' || regex[0] === 'RI') {
            let temp = row.map(elem => Serialism.modulo((regex[1]-elem)+row[0],universe));
            store = regex[0] === 'I'? temp : temp.reverse();
        }
        return pitches? Serialism.toPitch(store,universe) : store;
    },
    /**
     * Takes a tonerow in a given universe and determines non-trivial derivation levels.
     * @param {array} row 
     * @param {int} universe 
     * @param {boolean} showLevels 
     * @returns 2d array.
     */
    derivation: function (row,universe = 12) {
        let opts = Serialism.partition(row);
        let data = {};
        opts.forEach(part => {
            let current = data[`${universe/part.length}`] = {'set' : [],'levels' : {}}; 
            for (let a = 1; a < part.length; a++) {
                let setRep = new MySet(universe,...part[a-1]);
                current['set'].push(setRep.prime_form());
                current['levels'][`${a}-${a+1}`] = setRep.compare_set(part[a]);//TODO this line needs to change.
            }
           current['set'] = ArrayMethods.unique_subarray(current['set']);
           if (current['set'].length !== 1) {
                current['set'] = null;
                current['levels'] = null;
           }
        })
        return data;
    },
    /**
     * Creates Stravinsky's Rotational Array out of an input.
     * @param {array} row 
     * @param {int} universe
     * @returns 2D array 
     */
    rotationalArray: function (row,universe = 12) {
        let rots = [];
        let startPitch = row[0];
        for (let a = 0; a < row.length; a++) {
            let temp = ArrayMethods.singleRotate(row,a);
            rots.push(temp.map(x => Serialism.modulo(x-(temp[0]-startPitch),universe)));
        }
        return rots;
    },
    /**
     * Checks a row for combinatoriality levels. Returns a String if not combinatorial.
     * @param {array} row 
     * @param {int} universe 
     * @returns Combinatorial Levels.
     */
    combinatoriality: function (row,universe = 12) {
        let partition = [row.slice(0,universe/2),row.slice(universe/2)];
        let storage = [new MySet(universe,...partition[0]),new MySet(universe,...partition[1])];
        let Combin = ArrayMethods.unique_subarray([storage[0].prime_form(),storage[1].prime_form()]).length == 1;
        let result = [];
        if (Combin == true && universe%2 == 0) {
            let vects = [storage[0].interval_class_vector(),storage[0].index_vector()];
            vects[0][vects[0].length-1]*=2;     //Double the value of the tritone
            for (let a = 0; a < vects.length; a++) {
                for (let b = 0; b < vects[a].length; b++) {
                    if (vects[a][b] == 0 && a == 0) {
                        result.push(`P${b+1}/${universe-(b+1)}`);
                    }
                    else if (vects[a][b] == 6 && a == 0) {
                        result.push(`R${b}/${universe-(b+1)}`);
                    }
                    else if (vects[a][b] == 0 && a == 1) {
                        result.push(`I${b}`);
                    }
                    else if (vects[a][b] == 6 && a == 1) {
                        result.push(`RI${b}`);
                    }
                }
            }
        }
        else {
            result = 'Not Combinatorial.';
        }
        return result;
    },
    /**
     * Determines whether the input series is or is not all interval.
     * @param {array} row 
     * @param {int} universe 
     * @returns Boolean
     */
    allInterval: function(row,universe = 12) {
        let tally = [];
        for (let a = 1; a < row.length; a++) {
            tally.push(Serialism.modulo(row[a]-row[a-1],universe));
        }
        return Array.from(new Set(tally)).length == universe-1;
    },
    /**
     * Creates an object of row forms.
     * @param {array} row 
     * @param {int} universe 
     */
    rowDictionary: function(row,universe = 12) {
        let dict = {};
        for (let a = 0; a < universe; a++) {
            dict[`P${a}`] = Serialism.singleRowForm(row,`P${a}`);
            dict[`RP${a}`] = Serialism.singleRowForm(row,`R${a}`);
            dict[`I${a}`] = Serialism.singleRowForm(row,`I${a}`);
            dict[`RI${a}`] = Serialism.singleRowForm(row,`RI${a}`);
        }
        return dict;
    },
    /**
     * Searches the row dictionary for adjacent elements.
     * @param {array} row
     * @param {array} query
     * @param {int} universe 
     */
    dictionaryQuery: function(row,query,universe = 12) {
        let result = {};
        let start = Serialism.rowDictionary(row,universe);
        let arrForm = Object.entries(start);
        for (let [key,value] of arrForm) {
            if (ArrayMethods.adjacentIndices(value,query).length > 0) {
                result[key] = value;
            }
        }
        return result;
    }
}

/**
 * A method for paritioning an array into n parts. 
 * @param {array} array 
 * @param {int} parts number of partitions
 * @returns 2D array
 */
const partition = (array,parts) => {
    let res = [];
    let divs = array.length/parts;
    for (let a = 0; a < array.length/divs; a++) {
        let el1 = a*divs;
        res.push((array.slice(el1,el1+divs)));
    }
    return res;
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
        K = new myMatrix();
        K.createMatrix();
        K.updateMatrix();
    }
    else {
        console.error("Operation must be 'change' or 'load'");
    }
}

/**
 * Builds a 2d table of values.
 * @param {array} array
 * @param {string} parent 
 */
const makeTable = (array,parent = 'matrix') => {
    let par = document.getElementById(parent);
    let tab = document.createElement('table');
    for (let a = 0; a < array.length; a++) {
        let row = document.createElement('tr');
        for (let b = 0; b < array[a].length; b++) {
            let isLabel = false;
            /**
             * Improved check for label, should help with note name operations.
             */
            if (array[a][b][0] == 'P' || array[a][b][0] == 'R' || array[a][b][0] == 'I') {
                isLabel = true;
            }
            /**
             * Placeholder cells to offset labels.
             */
            let invis = typeof array[a][b] == 'string' && array[a][b] == ' '; 
            let cell = document.createElement('td');
            cell.classList.add(`r${a}`);
            cell.classList.add(`c${b}`);
            invis? cell.classList.add('class','void') : null;
            if (isLabel && invis == false) {
                cell.classList.add('class','label');
                cell.id = `${array[a][b]}`;
            }
            cell.innerHTML = `${array[a][b]}`;
            row.appendChild(cell);
        }
        tab.appendChild(row);
    }
    par.appendChild(tab);
    labelListeners();
}

/**
 * Adds event listeners to all elements of the .label class.
 */
const labelListeners = () => {
    document.querySelectorAll('.label').forEach(cell => {
        let row = cell.classList[0];
        let col = cell.classList[1];
        //This needs to be modified...
        cell.addEventListener('mousedown',() => {  
            /**
             * Toggle selected status.
             */
            currentData['selected'].indexOf(cell.textContent) == -1? currentData['selected'].push(cell.textContent) : currentData['selected'] = currentData['selected'].filter(x => x !== cell.textContent);
            
            K.updateMatrix();
        });
    });
}

/**
 * Creates a single input element.
 * @param {string} name 
 * @param {string} type 'number' || 'button' || 'text'
 * @param {string} parent element id 
 */
const buildInput = (name,type,parent = 'upper') => {
    let par = document.getElementById(parent);
    let cont = document.createElement('div');
    cont.setAttribute('class','single');
    cont.setAttribute('id',`${name}`);
    let lab = document.createElement('h4');
    let inp;
    if (type == 'number') {
        let mini = document.createElement('div');
        mini.setAttribute('class','buttonCont');
        inp = document.createElement('input');
        inp.setAttribute('type','number');
        inp.setAttribute('placeholder','Enter to Submit');
        inp.addEventListener('keydown',(event) => {
            /**
             * If enter, submit data to collection object.
             */
            if (event.key == 'Enter') {
                document.querySelectorAll('.buttonCont > button').forEach(child => {
                    child.remove();
                })
                let regex = /[0-9]+/g;
                let data = parseInt(inp.value.match(regex));
                currentData[`${name}`] = data;
                val.innerHTML = data;
                let facts = factors(data);
                facts = facts.slice(0,facts.length-1);
                currentData['partition'] = null;
                for (let a = 0; a < facts.length; a++) {
                    let b = document.createElement('button');
                    b.addEventListener('mousedown',() => {
                        currentData['partition'] = facts[a];
                        K.checkerboard(currentData['partition']);
                        console.log(currentData['partition']);
                    })
                    b.innerHTML = `${facts[a]}`;
                    mini.append(b);
                }
            }
            par.append(mini);
        })  
    }
    else if (type == 'button') {
        inp = document.createElement('button');
        currentData[`${name}`] = false;
    }
    else if (type == 'text') {
        inp = document.createElement('input');
        inp.setAttribute('type','text');
        inp.setAttribute('placeholder','Enter to Submit');
        inp.addEventListener('keydown',(event) => {
            /**
             * If enter, submit data to collection object.
             */
            if (event.key == 'Enter') {
                let regex = /[0-9]+/g;
                let data = inp.value.match(regex);
                if (name == 'Series') {
                    let series = data.map(x => parseInt(x));
                    currentData[`${name}`] = series;
                    val.innerHTML = currentData[`${name}`];
                    document.querySelector('#matrix').innerHTML = '';
                    K = new myMatrix();
                    K.createMatrix();
                }
                else if (name == 'Search') {
                    currentData['search'] = data.map(x => parseInt(x));
                    K.findAdjacent(currentData['search']);
                }
            }
        }) 
    }
    let val = document.createElement('p');
    lab.innerHTML = `${name}:`;
    cont.appendChild(lab);
    cont.appendChild(inp);
    cont.appendChild(val);
    par.appendChild(cont);  
}

function myMatrix () {
    this.arrayForm = Serialism.buildMatrix(currentData['Series'],currentData['Universe'],false,true);
    /**
     * Converts the arrayForm property into note names.
     */
    this.noteNames = (state = true) => {
        document.getElementById('matrix').innerHTML = '';
        this.arrayForm = Serialism.buildMatrix(currentData['Series'],currentData['Universe'],state,true);
        this.createMatrix();
    }
    this.createMatrix = () => {
        currentData['matrix'] = this.arrayForm;
        makeTable(currentData['matrix']);
        document.getElementById('lower').innerHTML = '';
        //document.getElementById('matrix').innerHTML = '';
        let results = {
            'Derivation': Serialism.derivation(currentData['Series'],currentData['Universe']),
            'AllInterval': Serialism.allInterval(currentData['Series'],currentData['Universe'])
        }
        for (let [key,value] of Object.entries(results['Derivation'])) {
            //Check if entry is null.
            if (value['set'] !== null) {
                let item = document.createElement('div');
                item.classList.add('inline');
                let i = document.createElement('div')
                i.innerHTML = `${key}: (${value['set']})`;
                let conc = '';
                /**
                 * Consider changing. These are adjacent n-chords, it might be better to not do this?
                 */
                for (let [k, v] of Object.entries(value['levels'])) {
                    console.log(v);
                    conc += conc == ''? `${v}` : `, ${v}`;
                }
                let ts = document.createElement('div')
                ts.innerHTML = `Level(s): ${conc}`;
                item.append(i);
                item.append(ts);
                document.getElementById('lower').append(item);
            }
        }
        let ints = document.createElement('div'); 
        ints.innerHTML = `All Interval: ${results['AllInterval']}`;  
        document.getElementById('lower').append(ints);
        urlOperations('change');
    }
    /**
     * Partitions the matrix into even n*n squares.
     * @param {int} size 
     */
    this.checkerboard = (size = currentData['partition']) => {
        let cells = document.querySelectorAll('td:not(.label):not(.void)');
        for (let a = 0; a < cells.length; a++) {
            cells[a].classList.remove('dark');
            let col = parseInt(cells[a].classList[1].match(/[0-9]+/ig))-1;
            let row = parseInt(cells[a].classList[0].match(/[0-9]+/ig))-1;
            let sect = Math.floor(col/size)+Math.floor(row/size);
            if (sect % 2 == 0) {
                cells[a].classList.add('dark');
            }
        }
    }
    /**
     * Updates the matrix according to currentData.
     */
    this.updateMatrix = () => {
        document.querySelectorAll('td').forEach(item => {
            item.classList.remove('select');
            item.classList.remove('labelSelect');
        })
        currentData['selected'].forEach(key => {
            let form = key.match(/[a-z]+/ig);
            let all = document.querySelectorAll(`#${key}`);//Accommodate for multiple.
            let toFind = null;
            all.forEach(cell => {
                cell.classList.add('labelSelect');
                if (form == 'P') {
                    toFind = cell.classList[0];
                }
                else if (form == 'RP') {
                    toFind = cell.classList[0];
                }
                else if (form == 'I') {
                    toFind = cell.classList[1];
                }
                else if (form == 'RI') {
                    toFind = cell.classList[1];
                }
                document.querySelectorAll(`.${toFind}`).forEach(item => {
                    item.classList.contains('label')? null : item.classList.add('select');
                });
            })
        })
        urlOperations('change');
    }
    /**
     * Search the matrix for adjacent elements. Currently only works for subsets of size > 1.
     * @param {array} search 
     */
    this.findAdjacent = (search = currentData['search'],primeForms = currentData['pfSrch']) => {
        let found = {};
        let all = [];
        document.querySelectorAll('.find, .columnFind, .rowFind, .both').forEach(elem => {
            elem.classList.contains('find')? elem.classList.remove('find') : null;
            elem.classList.contains('rowFind')? elem.classList.remove('rowFind') : null;
            elem.classList.contains('columnFind')? elem.classList.remove('columnFind') : null;
            elem.classList.contains('both')? elem.classList.remove('both') : null;
        })
        let forms = Serialism.rowDictionary(currentData['Series'],currentData['Universe']);
        for (let [key,value] of Object.entries(forms)) {
            if (key[0] == 'P' || key[0] == 'I') {
                if (primeForms == false) {
                    let inds = ArrayMethods.adjacentIndices(value,search);
                    console.log(`inds?: ${inds}`)           
                    inds.length !== 0? found[key] = inds : null;
                }
                else {//Issue in here for matrix find...
                    let src = new MySet(currentData['Universe'],...search).prime_form();
                    let full = [];
                    for (let a = 0; a < value.length; a++) {   //This loop condition might be an issue.
                        let pair = [a,a+(src.length)];
                        if (a+src.length <= currentData['Universe']) {
                            let slice = new MySet(currentData['Universe'],...value.slice(pair[0],pair[1])).prime_form();//Remove -1
                            console.log(`${key}: {${pair[0]}-${pair[1]}} = (${slice})`);
                            all.push(slice);
                            src.join('.') == slice.join('.')? full.push([pair[0],pair[1]-1]) : null;
                        }
                    }
                    full.length !== 0? found[key] = full : null;
                }
            }
        }
        console.log(found);
        /**
         * Loop over each entry in the found object.
         */
        for (let [key,value] of Object.entries(found)) {
            //Whether the result needs a column or a row.
            let cr = [];
            //Stores the opposite of the cr value per entry.
            let oppo = [];
            //If P, get the r(n) value from class list, oppo = c.
            if (key[0] == 'P') { //Highlight row
                document.querySelectorAll(`#${key}`).forEach(item => {
                    let cur = item.classList[0];
                    cr.push(cur);
                    oppo.push(cur[0] == 'r'? 'c' : 'r');
                });
            }
            //If I, get the c(n) value from class list, oppo = r.
            else if (key[0] == 'I') { //Highlight column
                document.querySelectorAll(`#${key}`).forEach(item => {
                    let cur = item.classList[1];
                    cr.push(cur);
                    oppo.push(cur[0] == 'r'? 'c' : 'r');
                });
            }
            console.log(`CR: ${cr}`);
            console.log(`OPPO: ${oppo}`);
            for (let a = 0; a < cr.length; a++) {
                console.log(`search: ${search.length}`);
                if (search.length == 1) { //Why is this search.length?
                    if (primeForms == false) {
                        document.querySelector(`.${cr}.${oppo}${parseInt(value)+1}`).classList.add('find');
                    }
                    else {
                        let check = document.querySelector(`.${cr}.${oppo}${parseInt(value)+1}`);
                        check.classList.add(cr[0] == 'r'? 'rowFind' : 'columnFind');
                    }
                }
                else {
                    value.forEach(sub => {
                        for (let b = sub[0]; b <= sub[1]; b++) {
                            if (primeForms == false) {
                                document.querySelector(`.${cr[a]}.${oppo[a]}${b+1}`).classList.add('find');
                            }
                            else {
                                console.log(cr[a][0]);
                                let check = document.querySelector(`.${cr[a]}.${oppo[a]}${b+1}`);
                                check.classList.add(cr[a][0] == 'r'? 'rowFind' : 'columnFind');
                            }
                        }
                    })
                }
                document.querySelectorAll('.rowFind.columnFind').forEach(item => {
                    item.classList.remove('rowFindcolumnFind');
                    item.classList.add('both');
                })
            }
        }
        let allSet = ArrayMethods.unique_subarray(all);
        urlOperations('change');
        return allSet;//Returns all prime forms in the matrix of size n.
    }
}

/**
 * A collection of Rows
 */
const RowLibrary = {
    Filipe: [0,3,4,6,9,10,1,2,5,7,8,11],
    Webern: [10,9,1,11,2,0,6,5,4,8,7,3], //Figure out what row!
    SchliesseMeineAugenBieden: [5,4,0,9,7,2,8,1,3,6,10,11],
    ContrapunctusSecundus: [7,8,0,3,5,11,10,2,4,9,6,1],
    RequiemCanticles1: [5,7,3,4,6,1,11,0,2,9,8,10],
    RequiemCanticles2: [5,0,11,9,10,2,1,3,8,6,4,7],
}

let currentData;
let K;

document.addEventListener('DOMContentLoaded',() => {
    console.log('Loaded!');
    currentData = {
        'matrix': null,
        'selected': []
    }
    buildInput('Universe','number');
    buildInput('Series','text');
    buildInput('Search','text');
    //Include in build input if Name == Search?
    let tiny = document.createElement('p');
    tiny.innerHTML = `Set-Class:`;
    let check = document.createElement('select');
    let a = document.createElement('option');
    a.innerHTML = 'true';
    let b = document.createElement('option');
    b.innerHTML = 'false';
    check.appendChild(b);
    check.appendChild(a);
    currentData['pfSrch'] = false;
    check.addEventListener('change',() => {
        let res = check.value === 'true'? true : false;
        currentData['pfSrch'] = res;
    })
    let box = document.getElementById('Search');
    box.appendChild(tiny);
    box.appendChild(check);
    //
})



//Viennese trichord row!
//[0,3,4,6,9,10,1,2,5,7,8,11]; 

//Webern Row: 
// [10,9,1,11,2,0,6,5,4,8,7,3];

//  Little Fugue in G minor mod 12 
// [7,2,10,9,7,10,9,7,6,9,2,7,2,9,2,10,9,10,9,7,9,2,7,2,9,2,10,9,7,9];

//Little Fugue mod7 
// [0, 4, 2, 1, 0, 2, 1, 0, 6, 1, 4, 0, 4, 1, 4, 2, 1, 0, 1, 4, 0, 4, 1, 4, 2, 1, 0, 1];

// Berg Schliesse Meine
// [5,4,0,9,7,2,8,1,3,6,10,11]

//Dallapicolla treble row 
// [7,8,0,3,5,11,10,2,4,9,6,1] No. 19 in anthology
//Reach out to people about math/music


//Angular or View for JS framework

//felipe-tovar-henao Bach Puzzles

// let r1 = Serialism.rowDictionary(RowLibrary.RequiemCanticles1,12);

// console.log(r1)