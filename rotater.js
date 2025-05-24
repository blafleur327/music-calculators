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
            return ArrayMethods.allIndexesOf(array.slice(find+1),item,result,offset+find+1)
        }
    },
    /**
     * Invert dimensionality of 2D array.
     * @param {array} array 
     * @returns 2D array.
     */
    flipDimensions: (array) => {
        return array[0].map((_, i) => array.map(row => row[i]));
    },
    /**
     * 
     * @param {array} array1 
     * @param {array} query 
     * @param {boolean} ordered 
     * @returns Boolean
     */
    allHere: (array1,query,ordered = true) => {
        if (ordered) {
            return array1.join('.') == query.join('.');
        }
        else {
            return ArrayMethods.sameArray(array1,query);
        }
    },
    /**
     * Checks array1 for if it contains query.
     * @param {array} array1 
     * @param {array} query 
     * @param {bool} ordered 
     */
    containsWithin: (array1,query,ordered = true) => {
        if (ordered) {
            return array1.join('.').match(query.join('.')) !== null
        }
        else {
            let sum = 0;
            query.forEach(ind => {
                array1.indexOf(ind) !== -1? sum+=1 : null;
            })
            return sum == query.length;
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
 * Shuffles an array in place.
 * @param {array} array 
 * @param {array} res 
 * @returns Reordered Array
 */
const shuffle = (array,res = []) => {
    if (array.length == 0) {
        return res;
    }
    else {
        let pick = Math.floor(Math.random()*array.length);
        res.push(array[pick]);
        return shuffle(array.filter(x => x !== array[pick]),res);
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

//Clears the highlighted elements.
const clear = () => {
    document.querySelectorAll('td').forEach(item => {
        item.classList.contains('find')? item.classList.remove('find') : null;
        item.classList.contains('vertFind')? item.classList.remove('vertFind') : null;
    })
}

/**
 * A collection of Rows
 */
const RowLibrary = {
    VienneseTrichord: [0,3,4,6,9,10,1,2,5,7,8,11],
    Webern: [10,9,1,11,2,0,6,5,4,8,7,3], //Figure out what row!
    SchliesseMeineAugenBieden: [5,4,0,9,7,2,8,1,3,6,10,11],
    ContrapunctusSecundus: [7,8,0,3,5,11,10,2,4,9,6,1],
    RequiemCanticles1: [5,7,3,4,6,1,11,0,2,9,8,10],
    RequiemCanticles2: [5,0,11,9,10,2,1,3,8,6,4,7],
    RequiemCanticlesLacrimosa: [5,9,8,6,11,7]
}

/**
 * Builds an object that creates all rotational arrays of all row forms.
 * @param {array} row 
 * @param {int} universe 
 */
function RA(row,universe = 12) {
    let rns = ['P','I','II','III','IV','V'];    //['I','II','III','IV','V','VI'];
    let verts = [' ','1','2','3','4','5','6'];
    this.row = row;
    let h1 = this.row.slice(0,(Math.floor(universe/2)));
    let h2 = this.row.slice(Math.floor(universe/2));
    this.rowForms = Serialism.rowDictionary(this.row,universe);
    this.rotationalArray1 = Serialism.rotationalArray(h1,universe);
    this.rotationalArray2 = Serialism.rotationalArray(h2,universe);
    this.graph1 = null;
    this.graph2 = null;
    /**
     * Updates the properties of RA object.
     * @param {array} row 
     */
    this.update = (row) => {
        this.row = row;
        h1 = this.row.slice(0,(Math.floor(universe/2)));
        h2 = this.row.slice(Math.floor(universe/2));
        this.rowForms = Serialism.rowDictionary(this.row,universe);
        this.rotationalArray1 = Serialism.rotationalArray(h1,universe);
        this.rotationalArray2 = Serialism.rotationalArray(h2,universe);
    }
    /**
     * Searches the arrays for adjacent elements.
     * @param {boolean} ordered 
     * @param  {...any} elements 
     */
    this.findSubstring = (ordered = true,...elements) => {
        document.querySelectorAll('td').forEach(item => {
            item.classList.remove('find');
            item.classList.remove('vertFind');
        })
        let hex1 = Serialism.rotationalArray(h1,universe);  
        let h1Trans = hex1[0].map((col, i) => hex1.map(row => row[i]));
        let hex2 = Serialism.rotationalArray(h2,universe);
        let h2Trans = hex2[0].map((col, i) => hex2.map(row => row[i]));
        for (let a = 0; a < hex1.length; a++) {
            if (ordered == true) {
                let arr1 = ArrayMethods.adjacentIndices(hex1[a],elements);
                let arr2 = ArrayMethods.adjacentIndices(hex2[a],elements);
                if (arr1.length == 0 && arr2.length == 0) {
                    null;
                }
                else {
                    if (arr1.length > 0) {
                        for (let b = arr1[0][0]; b <= arr1[0][1]; b++) {
                            this.graph1.facsimile[a][b].classList.add('find');
                        }
                    }
                    else {
                        for (let b = arr2[0][0]; b <= arr2[0][1]; b++) {
                            this.graph2.facsimile[a][b].classList.add('find');
                        }
                    }
                }
            }
            else {
                let v1 = ArrayMethods.get_many(h1Trans[a],...elements);
                let v2 = ArrayMethods.get_many(h2Trans[a],...elements);
                if (v1.length >= elements.length) {
                    for (let b = 0; b < v1.length; b++) {
                        this.graph1.facsimile[v1[b]][a].classList.add('vertFind');
                    }
                }
                else if (v2.length >= elements.length) {
                    for (let b = 0; b < v2.length; b++) {
                        this.graph2.facsimile[v2[b]][a].classList.add('vertFind');
                    }
                }
            }
        }
    }
    /**
     * Builds the Rotational Arrays of an input row.
     * @param {array} row 
     */
    this.build = () => {
        let c1 = Serialism.rotationalArray(h1,universe);
        let c2 = Serialism.rotationalArray(h2,universe);
        for (let a = 0; a < c1.length; a++) {
            c1[a].unshift(rns[a]);
            c2[a].unshift(rns[a]);
        }
        c1.unshift(verts);
        c2.unshift(verts);
        let par1 = 'hex1';
        let par2 = 'hex2';
        document.getElementById(par1).innerHTML = '';
        document.getElementById(par2).innerHTML = '';
        this.graph1 = new BetterTable(par1,c1);
        this.graph1.draw();
        this.graph2 = new BetterTable(par2,c2);
        this.graph2.draw();
    }
}

/**
 * An object supporting a variety of methods for manipulation.
 * @param {string} parent 
 * @param {array} data 
 */
function BetterTable (parent,data) {
    this.parent = document.getElementById(parent);
    this.instance = document.querySelectorAll(`#${parent} > table`).length;
    this.combined = data;
    this.dataCells = this.combined[0][0] == ' '? this.combined.slice(1).map(z => z.slice(1)) : this.combined;
    this.labels = this.combined[0][0] == ' '? [this.combined[0],[...this.combined.map(x => x[0])]] : null;
    this.facsimile = [];
    /**
     * Create the table based on input or current data.
     * @param {array} data 2D array || optional
     */
    this.draw = (data = this.combined) => {
        document.querySelector(`#${parent} > #myTable${this.instance}`) == null? null : document.querySelector(`#${parent} > #myTable${this.instance}`).remove();
        this.combined= data;
        let tab = document.createElement('table');
        for (let a = 0; a < this.combined.length; a++) {
            let r = document.createElement('tr');
            let temp = [];
            for (let b = 0; b < this.combined[a].length; b++) {
                let cell = document.createElement('td');
                cell.textContent = `${this.combined[a][b]}`;
                if (this.combined[0][0] == ' ') {   //Check if initial cell is a space. This suggests the first row and column are labels.
                    if (a == 0 || b == 0) {
                        a == 0 && b == 0? cell.classList.add('void') : cell.classList.add('label');
                    }
                }
                cell.classList.contains('void') || cell.classList.contains('label')? null : temp.push(cell); 
                r.appendChild(cell);
            }
            temp.length > 0? this.facsimile.push(temp) : null;
            tab.appendChild(r);
        }
        this.parent.appendChild(tab);
        tab.id = `myTable${this.instance}`;
    }
    /**
     * Change the content of a single cell.
     * @param {int} row 
     * @param {int} column 
     * @param {any} data 
     */
    this.changeCell = (row,column,data) => {
        this.data[row][column] = data;
        this.draw();
    }
}

/**
 * Converts an object into a 2D array, where it's keys are element 0 of each row.
 * @param {object} object 
 * @returns 2D array
 */
const fixObject = (object) => {
    let res = [];
    for (let [key,values] of Object.entries(object)) {
        res.push([key,...values]);
    }
    return res;
}

//const hexLibrary = new RA(RowLibrary.RequiemCanticles1);

function MyDrop (parent) {
    this.parent = document.querySelector(`#${parent}`);
    this.row = RowLibrary.RequiemCanticles1;
    let drop = document.createElement('select');
    for (let a = 0; a < 48; a++) {
        let poss = ['P','RP','I','RI'];
        let opt = document.createElement('option');
        opt.textContent = `${poss[Math.floor(a/12)]}${a%12}`;
        drop.appendChild(opt);
    }
    this.parent.appendChild(drop);
    drop.addEventListener('change',() => {
        this.selection = drop.value;
        console.log(this.selection);
        this.selectedRow = Serialism.rowDictionary(this.row,12)[this.selection];
        document.getElementById('tr').innerHTML = `<${this.selectedRow}>`;
        RAK.update(this.selectedRow);
        RAK.build();
    })
}

const mouseTracking = () => {
        let offset = 15;//Offset for the tooltip.
        let tt = document.querySelector(`#tooltips`);
        document.addEventListener('mouseover',(element) => {    //Whole document allows tooltips!
            let message = undefined;
            let position = [element.clientX+window.scrollX,element.clientY+window.scrollY];
            tt.style.left = `${position[0]+offset}px`;
            tt.style.top = `${position[1]+offset}px`;
            if (element.target.parentNode.tagName !== 'g' && element.target.tagName == `tspan`) {    //Catch text
                message = element.target.parentNode.parentNode['data-tooltip'];
            }
            else if (element.target.parentNode.tagName == 'g') {    
                message = element.target.parentNode['data-tooltip'];
            }
            else {
                message = element.target['data-tooltip'];
            }
            tt.style.visibility = message? 'visible' : 'hidden';
            /**
             * Node condition, determines the index of message to be displayed.
             */
            if (typeof message == 'object') {
                let nodeNumber = parseInt(element.target.parentNode.childNodes[1].textContent);//Should work if noteNames are visible
                let nodeState = Object.values(allNodes)[nodeNumber].state;
                tt.innerHTML = `${message[nodeState]}`;
            }
            else if (message !== undefined) {
                tt.innerHTML = `${message}`;
            }
        })
    }

let currentData;
let RAK;
let Drop;

document.addEventListener('DOMContentLoaded',() => {
    let inp = document.querySelector('#trow');
    inp.addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            Drop.row = inp.value.match(/[0-9]+/g);
            Drop.row = Drop.row.map(x => parseInt(x));
        }
    })
    Drop = new MyDrop('d');
    RAK = new RA(RowLibrary.RequiemCanticles1);
    document.querySelector(`#tr`).innerHTML = `<${Drop.row}>`;
    let hor = document.getElementById('horiz');
    hor['data-tooltip'] = 'Search both arrays for a melodic statement.';
    hor.addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            let conv = hor.value.match(/[0-9]+/g).map(x => parseInt(x));
            RAK.findSubstring(true,...conv);
        }
    })
    let ver = document.getElementById('vertic');
    ver['data-tooltip'] = 'Search both arrays for a given vertical.';
    ver.addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            let conv = ver.value.match(/[0-9]+/g).map(x => parseInt(x));
            RAK.findSubstring(false,...conv);
        }
    })
})

