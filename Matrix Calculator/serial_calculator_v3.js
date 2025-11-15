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
     * 
     * @param {array} array 
     * @param {int} card 
     * @returns 
     */
    binary_subsets: function (array,card) {
        let res = [];
        let min = parseInt(''.padEnd(card,'1'),2);
        let max = parseInt(''.padStart(card,'1').padEnd(array.length,'0'),2);
        console.log(`${min}-${max}`)
        for (let a = min; a <= max; a++) {
            console.log(`${a} => ${a.toString(2).padStart(array.length,'0')}`);
            let bin = a.toString(2).padStart(array.length,'0');
            let test = bin.match(/1/g).length;
            if (test === card) {
                res.push(array.filter((item, index) => bin[index] === '1'));
            }
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
 * Randomly reorders an arrays elements without changing them.
 * @param {array} array 
 * @param {array} result 
 * @returns Shuffled array
 */
const shuffle = (array,result = []) => {
    if (array.length == 0) {
        return result;
    }
    else {
        let ind = Math.floor(Math.random()*array.length);
        result.push(array[ind]);
        return shuffle([...array.slice(0,ind),...array.slice(ind+1)],result);
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
     * Partitions an array into units of a given size.
     * @param {array} array 
     * @param {int} size 
     */
    simplePartition: function (array,size) {
        if (array.length % size == 0) {
            let res = [];
            for (let a = 0; a < array.length; a+=size) {
                res.push(array.slice(a,a+size));
            }
            return res;
        }
        else {
            console.error(`${array.length} is not divisible by ${size}!`);
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
        adj == true && valid == true? res.push([small+offset,big+offset]) : null;//Array.from({length: (big+offset)-(small+offset)+1},(_,i) => small+offset+i)): null;
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
     * Transposes an input array by a given index.
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
        // console.table({
        //     'row': row,
        //     'form': form,
        //     'universe': universe
        // })
        let regex = [...form.match(/[RIP]+/ig),parseInt(form.match(/[0-9]+/g))];
        // console.log(`Row Type: ${regex}`);
        let offset = universe-row[0]; //Move index 0 to 0.
        let store; 
        if (regex[0] === 'P' || regex[0] === 'RP') {
            let temp = row.map(elem => Serialism.modulo(elem+offset+regex[1],universe));
            // console.log(temp);
            store = regex[0] === 'P'? temp : temp.reverse();
        }
        else if (regex[0] === 'I' || regex[0] === 'RI') {
            let temp = row.map(elem => Serialism.modulo((regex[1]-elem)+row[0],universe));
            // console.log(temp);
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
        let obj = {};//For Debugging.
        opts.forEach(part => {
            console.log(`Partition size: ${part.length}`);
            let current = data[`${row.length/part.length}`] = {'set' : [],'levels' : {}}; 
            for (let a = 1; a <= part.length; a++) { //Irritating
                let setRepA = new MySet(universe,...part[a-1]);
                // obj[`${universe/part.length}-chord ${a-1}`] = `(${setRepA.prime_form()})`;  //This is the OG
                obj[`${part.length}-chord ${a-1}`] = `(${setRepA.prime_form()})`;//I think this works.
                current['set'].push(setRepA.prime_form());
                a == part.length? null : current['levels'][`${a}-${a+1}`] = setRepA.compare_set(part[a]);
            }
           current['set'] = ArrayMethods.unique_subarray(current['set']);
           if (current['set'].length !== 1) {
                current['set'] = null;
                current['levels'] = null;
           }
        })
        // return obj;
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
     * Method that better computes combinatorial status. Not limited to the 1/2k chord.
     * @param {array} row Initial row (first row of matrix.)
     * @param {int} universe 
     * @param {string} selected the currently selected row.
     */
    generalizedCombinatoriality: function (row,universe,selected) {
        let fullResult = {};
        let dump = null;
        universe = universe? universe : row.length;
        let facts = factors(universe);
        facts = facts.slice(1,facts.length-1);//Remove arbitrary.
        let obRep = Serialism.rowDictionary(row,universe);//Based on first row initial P form.
        let tempS = selected? selected : `P${row[0]}`;
        let dict = Object.entries(obRep);
        let sel = obRep[tempS];//If none selected, automatically select initial P form.
        console.log(sel)
        if (facts.length) {
            facts.forEach(fact => {
                let nChords = universe/fact;
                fullResult[fact] = {
                    'Indexed': {},
                    'Levels': null,
                    'Groups': [],
                    'Partitions': []
                }
                let cur = [...sel.slice(0,fact).sort((a,b) => a-b)];
                let tot = [];
                let aggCheck = [...cur];
                let vis = {
                    'PASS': 0,
                    'FAIL': 0,
                }
                dict.forEach(([key,value]) => {
                    let joined = ArrayMethods.simplePartition(value,fact).map(x => x.sort((a,b) => a-b));
                    let jn = joined.map(x => x.join('.'));
                    let og = ArrayMethods.simplePartition(sel,fact).map(x => x.sort((a,b) => a-b).join('.'));
                    console.table([key,og,jn,nChords,Array.from(new Set([...jn,...og])).length == nChords])
                    console.log(new Set([...og,...jn]))
                    if (jn.indexOf(cur.join('.')) > 0 && Array.from(new Set([...jn,...og])).length == nChords) {
                        tot.push(key);
                        aggCheck.push(...joined[0]);
                        vis['PASS']++
                    }
                    else {
                        vis['FAIL']++;
                    }
                });
                let t = new Set(aggCheck);
                if (tot.length >= nChords-1 && t.size == universe) {
                    fullResult[fact]['Levels'] = tot;
                    dump = Array.from(Combinatorics.cardinal_specific_subsets(fullResult[fact]['Levels'],nChords-1));
                    dump.forEach(group => {
                        let agg = [...cur];
                        let ob = {};
                        ob[`${tempS}-${fact}.1`] = cur;
                        group.forEach(index => {
                            let part = Serialism.singleRowForm(row,index,universe).slice(0,fact);
                            ob[`${index}-${fact}.1`] = part;
                            agg.push(part);
                        })
                        let test = new Set(agg.flat());
                        if (universe == test.size) {
                            console.log(`GROUP WINS: ${group}`)
                            fullResult[fact]['Groups'].push(group);
                            fullResult[fact]['Partitions'].push(ob);
                        }
                    })
                }
            });
            console.log(fullResult);
            return fullResult;
        }
        else {
            console.error(`k = ${universe} is prime, therefore not a candidate for standard combinatorial procedures!`);
        }
    },
    /**
    * Convert row forms.
    * @param {string} initialForm 
    * @param {string} secondaryForm 
    */
    convertForm: function (initialForm = 'P',secondaryForm = 'P') {
        let mat = {
            'P': ['P','RP','I','RI'],
            'RP': ['RP','P','RI','I'],
            'I': ['I','RI','P','RP'],
            'RI': ['RI','I','RP','P'],
            }
        console.log(`INIT: ${initialForm} ---- SECOND: ${secondaryForm} => ${mat[initialForm][mat['P'].indexOf(secondaryForm)]}`);
        return mat[initialForm][mat['P'].indexOf(secondaryForm)];
    },
    /**
     * Determines whether the input series is or is not all interval.
     * @param {array} row 
     * @param {int} universe 
     * @param {boolean} series Wether to return the OPCI between consecutive row elements or just a boolean.
     * @returns Boolean
     */
    allInterval: function(row,universe = 12,series = false) {
        let tally = [];
        for (let a = 1; a < row.length; a++) {
            tally.push(Serialism.modulo(row[a]-row[a-1],universe));
        }
        return series? tally: Array.from(new Set(tally)).length == universe-1;
    },
    /**
     * Creates an object of row forms.
     * @param {array} row 
     * @param {int} universe 
     */
    rowDictionary: function(row,universe = 12) {
        let dict = {};
        for (let a = 0; a < universe; a++) {
            dict[`P${a}`] = Serialism.singleRowForm(row,`P${a}`,universe);
            dict[`RP${a}`] = Serialism.singleRowForm(row,`RP${a}`,universe);
            dict[`I${a}`] = Serialism.singleRowForm(row,`I${a}`,universe);
            dict[`RI${a}`] = Serialism.singleRowForm(row,`RI${a}`,universe);
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
            if (ArrayMethods.adjacentIndices(value,query).length > 0) {//Make sure this still works!
                result[key] = value;
            }
        }
        return result;
    },
    /**
     * Returns the Adjacency Interval Series of a row.
     * @param {array} row 
     * @param {int} universe 
     */
    ais: function (row,universe = 12) {
        let res = [];
        for (let a = 1; a < row.length; a++) {
            res.push(Serialism.modulo(row[a]-row[a-1],universe));
        }
        return res;
    },
    /**
     * Creates the T-matrix as described by Robert Morris. 
     * @param {array} horizontal 
     * @param {array} vertical 
     * @param {int} universe 
     * @param {boolean} transpose wether or not to re-transpose the matrix to the starting integer or leave it on 0.
     * @returns 
     */
    tMatrix: function (horizontal,vertical = horizontal,universe = 12,transpose = false) {
        let result = [];
        let inverse = vertical.map(x => Serialism.modulo(x*-1,universe));
        inverse.forEach(index => {
            if (transpose == true) {
                result.push(horizontal.map(y => Serialism.modulo(y+index+horizontal[0],universe)));
            }
            else {
                result.push(horizontal.map(y => Serialism.modulo(y+index,universe)));
            }
            // result.push(horizontal.map(y => SetTheory.modulo(y+index,universe)));
        })
        console.table(result);
        return result;
    },
    /**
     * Creates an I-matrix as described by Robert Morris
     * @param {array} horizontal 
     * @param {array} vertical 
     * @param {int} universe 
     * @param {boolean} transpose wether or not to re-transpose the matrix to the starting integer or leave it on 0.
     * @returns 
     */
    iMatrix: function (horizontal,vertical = horizontal,universe = 12,transpose = false) {
        let result = [];
        vertical.forEach(index => {
            if (transpose == true) {
                result.push(horizontal.map(y => Serialism.modulo(y+index-horizontal[0],universe)));
            }
            else {
                result.push(horizontal.map(y => Serialism.modulo(y+index,universe)));
            }
            // result.push(horizontal.map(y => SetTheory.modulo(y+index,universe)));
        })
        console.table(result);
        return result;
    },
    /**
     * Sums the instances of invariant tones under the specified matrix.
     * @param {array} horizontal 
     * @param {array} vertical 
     * @param {int} universe 
     * @param {string} type T or I
     * @returns Vector
     */
    IFunc: function (horizontal,vertical,universe = 12,type = 'T') {
        let result = {};
        let mat = null;
        if (type == 'T') {
            mat = Serialism.TMatrix(horizontal,vertical,universe);
        }
        else if (type == 'I') {
            mat = Serialism.IMatrix(horizontal,vertical,universe);
        }
        else {
            console.error('Type must be T or I.');
        }
        let str = mat.flat();
        for (let a = 0; a < universe; a++) {
            result[a] = ArrayMethods.allIndexesOf(str,a).length;
        }
        return result;
    },
    /**
     * Multiplies the row elements by the given index. Technique of Boulez.
     * @param {array} series 
     * @param {int} index 
     * @param {int} modulus 
     * @returns 
     */
    multiply: function (series,index = 5, modulus = 12) {
        return series.map(x => (x*index)%modulus);
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
    // if (!currentData) {
    //     console.log(`currentData is empty!`);
    // }
    if (operation == 'change') {
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
                //collection[array[a][b]] = [];   //Check this indexing.
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
                cell['data-tooltip'] = [`Click to select ${cell.id}`,`Click to deselect ${cell.id}`];
            }
            cell.innerHTML = `${array[a][b]}`;
            row.appendChild(cell);
            //collection[array[a][0]].push(cell);
        }
        tab.appendChild(row);
    }
    par.appendChild(tab);
    labelListeners();
}

/**
 * Builds a faux table using CSS flexboxes
 * @param {array} data
 * @param {string} parent id of parent element  
 */
const populate = (data,parent = 'matrix') => {
    document.querySelector(`#${parent}`).innerHTML = '';
    for (let a = 0; a < data.length; a++) {
        let row = document.createElement('div');
        row.classList.add('row');
        for (let b = 0; b < data[a].length; b++) {
            let isLabel = false;
            let cell = document.createElement('div');
            if (data[a][b][0] == 'R' || data[a][b][0] == 'I' || data[a][b][0] == 'P') {
                isLabel = true;
            }
            else if (data[a][b] === ' ') {
                cell.classList.add('void');
            }
            cell.classList.add(isLabel? 'label' : 'cell');
            cell.id = `r${a}c${b}`;//Maybe needs new id for labels...
            cell.innerHTML = `${data[a][b]}`;
            cell['data-tooltip'] = isLabel? [`Select ${data[a][b]}`,`Deselect ${data[a][b]}`] : null;
            cell.setAttribute('data-row',a); 
            cell.setAttribute('data-column',b);
            row.append(cell);
        }
        document.querySelector(`#${parent}`).append(row);
    }
    labelListeners();
}


/**
 * Adds event listeners to all elements of the .label class.
 */
const labelListeners = () => {
    document.querySelectorAll('.label').forEach(cell => {
        cell['data-status'] = 0;//Default state
        cell.addEventListener('mousedown',() => {  
            /**
             * Toggle selected status.
             */
            currentData['selected'].indexOf(cell.textContent) == -1? currentData['selected'].push(cell.textContent) : currentData['selected'] = currentData['selected'].filter(x => x !== cell.textContent);
            cell['data-status'] = currentData['selected'].indexOf(cell.textContent) == -1? 0 : 1;
            K.updateMatrix();
        });
        // document.querySelector(`#tooltips`).innerHTML = cell['data-tooltip'][0]
    });
}

/**
 * Creates segmentation dropdown that draws partitions onto the matrix.
 * @param {int} size 
 */
const segmentationButtons = (size = currentData['Series'].length) => {
    console.log(`SIZE OF ROW = ${size}`)
    let contain = document.createElement('div');
    contain.id = 'partition';
    contain.classList.add('dropContainer');
    contain.classList.add('single');
    document.querySelectorAll('.dropContainer').forEach(item => item.remove());
    const selectPartition = (ref = f) => {
        currentData['partition'] = ref;
        let size = ref;
        K.checkerboard(size);
        if (size !== null && size > 1) {
            K.row_illustrator();
        }
        else {
            document.querySelector('#collector').innerHTML = '';
        }
    }
    let f = new MyDropdown('partition','Partition Select',selectPartition)
    document.querySelector('#upper').append(contain);
    // mini['data-tooltip'] = 'Partition the matrix into discrete <em>n</em>-chords.';
    let facts = factors(size);
    facts = facts.slice(0,facts.length-1);
    currentData['partition'] = null;
    // let def = document.createElement('option')
    // def.innerHTML = 'NONE';
    // mini.append(def);
    f.addOption('NONE',null);
    for (let a = 0; a < facts.length; a++) {
        // let b = document.createElement('option');
        f.addOption(facts[a],facts[a],`Partition the matrix into discrete ${facts[a]}-chords.`);
    }
    f.construct();
    // mini.addEventListener('change',() => {
    //     let val = currentData['partition'] = parseInt(mini.value);
    //     K.checkerboard(val);
    //     // K.spacer();
    //     K.row_illustrator();
    // })
}

/**
 * Creates a single input element.
 * @param {string} name 
 * @param {string} type 'number' || 'button' || 'text'
 * @param {string} parent element id
 * @param {string} tooltip Information to be displayed on hover. 
 */
const buildInput = (name,type,parent = 'upper',tooltip) => {
    let par = document.getElementById(parent);
    let cont = document.createElement('div');
    cont.setAttribute('class','single');
    cont.setAttribute('id',`${name}`);
    // par['data-tooltip'] = tooltip;
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
                currentData[`${name}`] = data;//This should populate currentData['Series'] in time for the segmentationButtons to run.
                val.innerHTML = data;
            }
        });
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
                    currentData['selected'] = [];
                    document.querySelector('#matrix').innerHTML = '';
                    document.querySelectorAll('#collector > *').forEach(elem => {
                        elem.innerHTML = '';
                    })
                    segmentationButtons(series.length);
                    buildKey();
                    K = new myMatrix();
                    K.createMatrix();
                }
                else if (name == 'Search') {
                    if (data == null) {
                        currentData['search'] = [];
                        K.updateMatrix();
                    }
                    else {
                        currentData['search'] = data.map(x => parseInt(x));
                        K.findAdjacent(currentData['search']);
                    }
                }
            }
        }) 
    }
    let val = document.createElement('p');
    lab.innerHTML = `${name}:`;
    cont.appendChild(lab);
    cont.appendChild(inp);
    if (name == 'Search') {
        let sub = document.createElement('div');
        sub.id = 'subComponent';
        cont.appendChild(sub);
    }
    cont.appendChild(val);
    par.appendChild(cont); 
    document.querySelector(`#${name}`)['data-tooltip'] = tooltip; 
    document.querySelector(`#${name}`).childNodes.forEach(child => {
        child['data-tooltip'] = tooltip;
    })
}


/**
 * Collects the elements actually present in the matrix rather than a theoretical list.
 */
const special = () => {
    let validForms = currentData['matrix'].flat().filter(x => typeof x == 'string' && x !== ' ');
    let res = {};
    validForms.forEach(form => {
        console.log(`${form} => <${Serialism.singleRowForm(currentData['Series'],form,currentData['Universe'])}>`);
        res[form] = Serialism.singleRowForm(currentData['Series'],form,currentData['Universe']);
    })
    return res;
}

/**
 * Create an instance of a matrix object, complete with methods for manipulating the matrix. Information taken from the currentData object.
 */
function myMatrix () {
    this.arrayForm = Serialism.buildMatrix(currentData['Series'],currentData['Universe'],false,true);
    this.seriesLength = currentData['Series'].length; //Use this for derivation purposes.
    this.dictionaryForm = null;
    /**
     * 
     */
    this.noteNames = () => {
        //Need to work this out.
    }
    /**
     * Removes all selected rows.
     */
    this.clearSelections = () => {
        currentData['selected'] = [];
        this.updateMatrix();
    }
    this.counts = {
        'Search Finds': 0,
    }
    /**
     * Method recreates the combinatorial boxes per each update. Issue is with the arbitrary RP case. The first element stays, the rest are correct.
     */
    this.combinatorialRewrite = () => {
        let extant = false;
        if (document.querySelectorAll('#lower > .inline')[0]) {
            extant = true;
            document.querySelectorAll('#lower > .inline')[0].innerHTML = '';
        }
        console.log(`BOX EXISTS? ${extant}`);
        let currSelect = currentData['selected'][currentData['selected'].length-1]? currentData['selected'][currentData['selected'].length-1] : `P${currentData['Series'][0]}`;
        let results = {
            'Combinatoriality': Serialism.generalizedCombinatoriality(currentData['Series'],currentData['Universe'],currSelect),
        }
        let cont = document.createElement('div');
        cont.classList.add('inline');
        let par = extant? document.querySelectorAll('#lower > .inline')[0] : cont;
        let lab = document.createElement('div');
        lab.classList.add('hoverable');
        lab.innerHTML = `Combinatoriality:`;//Change
        lab['data-tooltip'] = `<em>n</em>-chordal Combinatoriality refers to a row form whose first <em>n</em>-chord can be completed by the first <em>n</em>-chord(s) from other row form(s).`;
        cont.appendChild(lab);
        let row = document.createElement('div');
        row.classList.add('fakeRow');
        let BD = Object.entries(results['Combinatoriality']);
        // let horiz = document.createElement('div');
        // horiz.classList.add('fakeRow');
        BD.forEach(([key,value]) => {
            let contBox = document.createElement('div');
            contBox.classList.add('fullDetails');
            let subBox = document.createElement('div');
            let labBox = document.createElement('div');
            let lab = document.createElement('h4');
            let greek = [null,'Singleton','Dyadically','Tri','Tetra','Penta','Hexa','Hepta','Octa','Nona','Deca','Undeca','Dodeca'];//Add to this.
            lab.textContent = `${greek[key]}${key == 2? '' : 'chordally'} Combinatorial:`;
            labBox.append(lab);
            subBox.classList.add('combinatorialBox');
            if (value['Groups'].length > 0) {
                value['Groups'].forEach(entry => {
                    let l = document.createElement('p');
                    l.classList.add('wow');
                    l.textContent = entry;
                    subBox.append(l); 
                    })
                contBox.append(labBox);
                contBox.append(subBox);
                row.append(contBox);
            }
            subBox.addEventListener('mousedown',(event) => {
                if (event.target.classList.contains('wow')) {
                    document.querySelectorAll('.find,.phantom').forEach(item => {
                        item.classList.remove(item.classList.contains('find')? 'find' : 'phantom');
                    })
                    //Make sure original
                    let original = this.rowFormAsCells(`${currentData['selected'].length > 0? currentData['selected'][currentData['selected'].length-1] : `P${currentData['Series'][0]}`}`).flat().slice(0,key);
                    let rowForm = event.target.textContent.split(' ')[0];
                    let sliced = [];
                    if (rowForm.indexOf(',') !== -1) {
                        rowForm.split(',').forEach(fm => {
                            sliced.push(this.rowFormAsCells(fm).flat().slice(0,key));
                        })
                        sliced = sliced.flat();
                    }
                    else {
                        sliced = this.rowFormAsCells(rowForm).flat().slice(0,key);
                    }
                    /**
                     * Create an if/else statement clause for sub 1/2k. If sub-1/2k, highlight all elements within the box, else only highlight the clicked one.
                     */
                    original.forEach(cell => {
                        cell.classList.add('find');
                    })
                    sliced.forEach(cell => {
                        cell.classList.add('phantom');
                    });
                }
            })
        })
        cont.appendChild(row);
        extant? par.appendChild(cont) : document.querySelector('#lower').appendChild(cont);
    }
    /**
     * Creates a matrix from the currentData object.
     */
    this.createMatrix = () => {
        currentData['matrix'] = this.arrayForm;
        populate(currentData['matrix']);// 
        document.getElementById('lower').innerHTML = '';
        let results = {
            'Combinatoriality': Serialism.generalizedCombinatoriality(currentData['Series'],currentData['Universe']),//Serialism.combinatoriality(currentData['Series'],currentData['Universe']),//Keys ['RI3']
            'Derivation': Serialism.derivation(currentData['Series'],currentData['Universe']),//This might need to change to currentData['Series'].length
            'AllInterval': Serialism.allInterval(currentData['Series'],currentData['Universe'])
        }
        console.table(results);
        this.dictionaryForm = special();
        this.combinatorialRewrite();
        for (let [key,value] of Object.entries(results['Derivation'])) {
            //Check if entry is null.
            if (value['set'] !== null) {
                let item = document.createElement('div');
                item.classList.add('inline');
                let i = document.createElement('div');
                i['data-tooltip'] = `Row derived from ${key}-chord (${value['set']})`;
                i.classList.add('hoverable');
                i.innerHTML = `${key}-chord: (${value['set']})`;
                let conc = '';
                /**
                 * Consider changing. These are adjacent n-chords, it might be better to not do this?
                 */
                let ts = document.createElement('div');
                ts.classList.add('hoverable');
                ts['data-tooltip'] = `The transformations that map the discrete ${key}-chords of P${currentData['Series'][0]} onto one another.`;
                ts.innerHTML = `Relationship(s):`;
                let r = document.createElement('div');
                r.classList.add('fakeRow');
                for (let [k, v] of Object.entries(value['levels'])) {
                    let mini = document.createElement('p');
                    mini.classList.add('wow');
                    mini.innerHTML = conc == ''? `${v}` : `, ${v}`;
                    let m = k.match(/[0-9]+/g);
                    // console.log(m);
                    mini['data-tooltip'] = `${key}.${m[0]} = {${currentData['Series'].slice(parseInt((m[0])-1)*key,parseInt((m[1])-1)*key)}}<br> Under ${v}<br>${key}.${m[1]} = {${currentData['Series'].slice(parseInt((m[0]))*key,parseInt((m[1]))*key)}}<br>`;
                    r.appendChild(mini);
                }
                item.append(i);//Derived at ...
                item.append(ts);//Relationship(s):...
                item.append(r);// Levels...
                document.getElementById('lower').append(item);
            }
        }
        segmentationButtons();
        let ints = document.createElement('div'); 
        ints.classList.add('hoverable');
        ints['data-tooltip'] = `Tone row is ${results['AllInterval']? '' : 'not'} all-interval. Adjacency Inverval Series is <${Serialism.allInterval(currentData['Series'],currentData['Universe'],true)}>`;
        ints.innerHTML = `All Interval: ${results['AllInterval']}`;  
        document.getElementById('lower').append(ints);
        urlOperations('change');
    }
    /**
     * Partitions the matrix into even n*n squares.
     * @param {int} size 
     */
    this.checkerboard = (size = null) => { //currentData['partition']
        let cells = document.querySelectorAll('#matrix > .row > .cell:not(.void)');
        let uni = Math.sqrt(cells.length);//Based on matrix len, not universe.
        for (let a = 0; a < cells.length; a++) {
            cells[a].classList.remove('dark');
            cells[a].classList.forEach(cls => {
                if (cls.startsWith('quadrant')) {
                    cells[a].classList.remove(cls);
                }
            })
            let row = Math.floor(a/uni);
            let col = a%uni;
            let sect = Math.floor(row/size)+(Math.floor(col/size)*(uni/size));//Vertical adjacency
            // console.log(`ROW${row}.COL${col}--Default Sector: ${sect}--Offset: ${off} * ${size} = ModSect: ${sect+off*size}`);
            // sect+=off;
            if (cells.length/(size**2)%2 == 0) {
                if (Math.floor(col/size) % 2 == 0) {
                    if (sect % 2 == 0) {
                        cells[a].classList.add('dark');
                    }
                }
                else {
                    if (sect % 2 == 1) {
                        cells[a].classList.add('dark');
                    }
                }
            }
            else {
                if (sect % 2 == 0) {
                    cells[a].classList.add('dark');
                }
            }
        cells[a].classList.add(`quadrant${sect}`);
        }
    }
    /**
     * A node list of individual cells that belong to a single row form.
     * @param {string} row 
     * @returns 2D array
     */
    this.rowFormAsCells = (row) => {
        let result = [];
        let form = row.match(/[IRP]+/g)[0];
        let labelButtons = document.querySelectorAll(`.label`);
        labelButtons = Array.from(labelButtons).filter(x => x.textContent == row);
        /**
         * Loop over all label elements.
         */
        labelButtons.forEach(button => {
            let atts = button.attributes;
            if (form == 'RP' || form == 'P') {
                // console.log('Found as P or RP');
                let pinult = Array.from(document.querySelectorAll(`.cell[data-row="${atts['data-row'].value}"]`));
                result.push(form == 'P'? pinult : pinult.reverse());
            }
            else {
                // console.log('Found as I or RI');
                let pinult = Array.from(document.querySelectorAll(`.cell[data-column="${atts['data-column'].value}"]`));
                result.push(form == 'I'? pinult : pinult.reverse());
            }
        })
        return result;
    }
    /**
     * Tests each row form to find order invariance. Fails if cells have duplicates.
     * @param  {array} forms 
     * @returns 
     */
    this.orderPosition = (forms = currentData['selected']) => {//????
        console.log(`ORDER POSITION CALLED!`)
        document.querySelectorAll('.positInvar').forEach(elem => {
            elem.classList.remove('positInvar');
        })
        let multiList = [];
        if (forms.length > 1) {
            for (let a = 0; a < currentData['Series'].length; a++) {
                let test = [];
                forms.forEach(form => {
                    test.push(this.dictionaryForm[form][a]);
                    multiList.push(this.rowFormAsCells(`${form}`));
                })
                console.log(`Order Position ${a}: [${test}]`);
                // If the elements are the same, condition passes.
                let pass = Array.from(new Set(test)).length == 1;//
                console.log(`element ${a} is invariant? ${pass}`);//test is same element as others
                if (pass) {
                    multiList.forEach(row => {
                        row.forEach(list => {
                            list[a].classList.add('positInvar');
                        })
                    })
                }
            }
        }
    }
    /**
     * Rebuilds the matrix from an input rowform as the top row.
     * @param {string} form 
     */
    this.reconstruct = (form) => {
        currentData['Series'] = this.dictionaryForm[form];
        this.arrayForm = Serialism.buildMatrix(currentData['Series'],currentData['Universe'],false,true);
        document.querySelector('table').remove();
        this.createMatrix();
        this.updateMatrix();
    }
    /**
     * woah.
     */
    this.spacer = () => {
        let divs = (currentData['Universe']**2)/(currentData['partition']**2);
        let par = document.querySelector('#collector');
        par.innerHTML = '';
        let curr = `column0`;
        for (let i = 0; i < Math.sqrt(divs); i++) {
            let r = document.createElement('div');
            r.classList.add('col');
            r.id = `column${i}`;
            par.append(r);
        }
        for (let a = 0; a < divs; a++) {
            let d = document.createElement('div');
            d.id = `sect${a}`;
            let og = document.querySelectorAll(`.quadrant${a}`);
            let conv = [...og];
            let subMatrix = [];
            let rSize = Math.sqrt(conv.length);
            document.querySelector(`#column${Math.floor(a/Math.sqrt(divs))}`).append(d);
            for (let b = 1; b <= rSize; b++) {
                subMatrix.push(conv.slice((b-1)*rSize,b*rSize).map(x => x.textContent));
            }
            populate(subMatrix,`sect${a}`);
            if (og[0].classList.contains('dark')) {
                document.querySelectorAll(`#sect${a} > *`).forEach(entry => {
                    entry.classList.add('dark');
                })
            }
        }
    }
    /**
     * Breaks the original Pn row into pieces.
     * @param {string} parent 
     */
    this.row_illustrator = (parent = document.querySelector(`#collector`)) => {
        let divs = currentData['Series'].length/currentData['partition'];
        /**
         * Object of row partitioned index as 6.0 = hexachord 0. Results are MySet objects
         */
        let ob = {};
        Serialism.partition(currentData['Series']).forEach(part => {
            for (let a = 0; a < part.length; a++) {
                ob[`${part[0].length}.${a+1}`] = new MySet(currentData['Universe'],...part[a]);
            }
        })
        console.log(ob);
        parent.innerHTML = '';
        let colors = ['red','blue','green','purple','yellow'];//??
        if (currentData['partition'] > 1 && currentData['partition'] !== null) {
            for (let a = 0; a < divs; a++) {
                let box = document.createElement('div');
                box.id = `LBox${a}`;
                box.classList.add('col');
                let lab = document.createElement('h4');
                lab.id = `labelPart${a}`;
                lab.textContent = `${currentData['partition']}.${a+1}`;
                let u = document.createElement('div');
                u.id = `upperPart${a}`;
                u.classList.add('repr');
                box.append(lab);
                box.append(u);
                parent.append(box);
                let ref = ob[`${currentData['partition']}.${a+1}`];
                let silly = {
                    'Prime Form': `(${ref.prime_form()})`,
                    'ICV': `<${ref.interval_class_vector()}>`,
                    'Interval Vector': `<${ref.index_vector()}>`,
                }
                Object.entries(silly).forEach(([key,value]) => {
                    let lol = document.createElement('p');
                    lol.classList.add('oneEntry');
                    lol.id = `${key}|${a}`;
                    lol.textContent = `${key}: ${value}`;
                    box.append(lol);
                })
            }
            for (let b = 0; b < currentData['Series'].length; b++) {
                let part = Math.floor(b/currentData['partition']);
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.textContent = currentData['Series'][b];
                document.querySelector(`#upperPart${part}`).append(cell);
                }
            }
    }
    /**
     * Updates the matrix according to currentData.
     */
    this.updateMatrix = () => {
        console.log(`UPDATE MATRIX CALLED!?`)
        this.dictionaryForm = special();
        document.querySelectorAll('div').forEach(item => {
            item.classList.remove('select');
            item.classList.remove('labelSelect');
        })
        if (currentData['selected'].length > 0) {
            currentData['selected'].forEach(key => {
            let correct = document.querySelectorAll(`.label`);
            correct = Array.from(correct).filter(x => x.textContent == key);
            console.log(correct);
            correct.forEach(elem => {
                elem.classList.add('labelSelect');
            })
            // document.querySelector(`#${key}`).classList.add('labelSelect');//This querySelector probably needs to change to get textContent
            /**
             * for each entry in selected, call rowFormAsCells and add .find to each.
             */
            this.rowFormAsCells(key).forEach(sel => {
                sel.forEach(cell => {
                    cell.classList.add('select');
                    })
                })
            })
        }
        else {
            console.log('No Search!')
        }
        this.orderPosition();//This should be correct now!
        this.combinatorialRewrite();
        // this.orderPosition();
        this.findAdjacent();//Search if update called.
        segmentationButtons();
        urlOperations('change');
    }
    /**
     * Search the matrix for adjacent elements. Currently only works for subsets of size > 1.
     * @param {array} search 
     */
    this.findAdjacent = (search = currentData['search'],primeForms = currentData['pfSrch']) => {
        //Remove previous results.
        document.querySelectorAll('div').forEach(elem => {
            elem.classList.contains('find')? elem.classList.remove('find') : null;
            elem.classList.contains('rowFind')? elem.classList.remove('rowFind') : null;
            elem.classList.contains('columnFind')? elem.classList.remove('columnFind') : null;
            elem.classList.contains('both')? elem.classList.remove('both') : null;
            // elem.classList.contains('phantom')? elem.classList.remove('phantom') : null;
            elem.classList.contains('color3')? elem.classList.remove('color3') : null;
        })
        this.dictionaryForm = special();
        Object.keys(this.dictionaryForm).forEach(form => {//If row doesn't exist creates problems!
            // console.log(`LINE 1629: Row Form: ${form}`);
            let individual = this.rowFormAsCells(form);//Now a 2D array
            individual.forEach(cell => {
                let pcs = [...cell.map(x => parseInt(x.textContent))];
                if (primeForms == false) {
                    let fs = ArrayMethods.adjacentIndices(pcs,search);//Returns slicing indices.
                    // console.log(`[${search}] in ${form}? ${fs.length > 0}...${fs.length} times`);
                    this.counts['Search Finds']+=(fs.length);
                    /**
                    * Searching for more than one element
                    */
                    if (search.length > 0) {
                        if (search.length >= 1) {
                            /**
                             * Use this to turn on phantom.
                             */
                            let showPhantom = false;
                            fs.forEach(pair => {
                                /**
                                 * Search for multiple elements
                                 */
                                if (pair.length > 1) {
                                    for (let a = pair[0]; a <= pair[1]; a++) {//Take slices and add find
                                        cell[a].classList.add('find');
                                    }
                                    let oppo = cell.filter(x => x.classList.contains('find') == false);
                                    oppo.forEach(el => {
                                        showPhantom? el.classList.add('phantom') : null;
                                    })
                                }
                                /**
                                 * Single Element clause
                                 */
                                else {
                                    cell[pair].classList.add('find');
                                }
                            })
                        } 
                    }
                }
                /**
                * Prime form search is true.
                */
                else {
                    //prime form of search set.
                    let srcPF = new MySet(currentData['Universe'],...search).prime_form();
                    for (let a = 0; a < pcs.length-search.length; a++) {//This may need to be +1 for middle condition
                        let test = new MySet(currentData['Universe'],...pcs.slice(a,a+search.length)).prime_form();
                        let dup = pcs.slice(a,a+search.length);
                        console.log(`SRC: ${srcPF} - TEST: ${test}`);
                        if (srcPF.join('.') == test.join('.')) {
                            // console.log(`${form} elems ${a+1}-${a+search.length}.... SRC: (${srcPF}) : current: {${dup}} => PF: (${test})? ${true}`);
                            let regex = /[PRI]+/g;
                            cell.slice(a,a+search.length).forEach(item => {
                                if (form.match(regex) == 'P' || form.match(regex) == 'RP') {
                                item.classList.add('rowFind');  
                                }
                                else if (form.match(regex) == 'I' || form.match(regex) == 'RI') {
                                    item.classList.add('columnFind');
                                }
                            })
                        }
                        else {
                            //  console.log(`${form} elems ${a+1}-${a+search.length}....SRC: (${srcPF}) current: {${dup}} => PF: (${test})? ${false}`);
                        }
                    }
                    /**
                     * Check if cells are both, then change class.
                     */
                    document.querySelectorAll('.cell').forEach(cell => {
                        if (cell.classList.contains('rowFind') && cell.classList.contains('columnFind')) {
                            cell.classList.remove('rowFind');
                            cell.classList.remove('columnFind');
                            cell.classList.add('both');
                        }
                    })
                }
            })
        })
        urlOperations('change');
    }
}
/**
 * Creates a new library item object to be added to RowLibrary.
 * @param {string} name 
 * @param {int} modulus 
 * @param {array} row 
 * @param {array} search 
 * @param {boolean} primeForm 
 */
function RowLibraryItem (name,modulus,row,search,primeForm = false) {
    this.name = name;
    this.row = row;
    /**
     * Builds a matrix based on arguments.
     * @param {boolean} pf Change prime form search param.
     */
    this.render = (pf = primeForm) => {
        document.querySelector('#matrix').childNodes.forEach(elem => {
            elem.remove();
        })
        currentData['Universe'] = modulus;
        currentData['Series'] = this.row; 
        currentData['search'] = search;
        currentData['pfSrch'] = pf;
        currentData['selected'] = [];
        //console.table(currentData);
        K = new myMatrix();
        K.createMatrix();//This fails...
        buildKey();
        K.findAdjacent(search,pf);
    }
    RowLibrary[this.name] = this;
    /**
     * Multiplies the row by a given index.
     * @param {int} index 
     */
    this.multiply = (index = 7) => {
        let og = this.row;
        this.row = row.map(x => Serialism.modulo(x*index,modulus));
        this.render();
        return `<${og}> = M${index} => <${this.row}>`;
    }
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
    this.method = method;
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
     * Add a function to the dropdown after construction.
     * @param {function} ref 
     */
    this.addMethod = (ref) => {
        console.log('Method added!');
        this.method = ref;
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
        /**
         * If drop exists, remove it.
         */
        if (document.querySelector(`#${this.name}`)) {
            console.error(`ERROR: #${this.name} already exists in DOM!`);
            document.querySelector(`#${this.name}`).remove();
        }
        let pad = document.createElement('div');
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
                if (this.method) {
                    this.method(this.value);//add 2 undefineds before.
                    // console.log(`Dropdown Method ${this.method} called with parameter(s): ${this.value}`)
                }
            })
            pad.appendChild(drawer);
            par.appendChild(pad);
            console.log(`Dropdown ${this.name} constructed!`);
        }
        else {
            console.warn('No options!');
        }
    }
}

/**
* Creates a random matrix within the given universe.
* @param {int} universe 
*/
const randomRow = (universe = currentData['Universe']? currentData['Universe'] : 12) => {
    let uni = Array(universe).fill(0).map((a,b) => b+a);
    currentData['Series'] = shuffle(uni);
    currentData['Universe'] = universe;
    currentData['Search'] = [];
    currentData['selected'] = [];
    currentData['partition'] = null;
    document.querySelector(`#collector`).textContent = '';
    K = new myMatrix();
    K.createMatrix();
    buildKey();
}

/**
 * Clears the currentData Object.
 */
const clearCurrentData = () => {
    currentData['Series'] = [];
    currentData['Search'] = [];
    currentData['Universe'] = null;
    currentData['selected'] = [];
    currentData['partition'] = null;
}

/**
 * A collection of Row Items.
 */
let RowLibrary = {};

let currentData = {'search': []};
let K;

//

new RowLibraryItem('WebernVariationsOp27',12,[4,5,1,3,0,2,8,9,10,6,7,11],[0,1,4],true);
new RowLibraryItem('BergSchliesseMeineAugenBiedenForm1',12,[5,4,0,9,7,2,8,1,3,6,10,11],[8,1,3,6,10,11],false);
new RowLibraryItem('BergSchliesseMeineAugenBiedenForm2',12,[5,0,10,7,3,2,8,9,1,4,6,11],[],false);
new RowLibraryItem('StravinskyRequiemCanticles1',12,[5,7,3,4,6,1,11,0,2,9,8,10],[],false);
new RowLibraryItem('StravinskyRequiemCanticles2',12,[5,0,11,9,10,2,1,3,8,6,4,7],[],false);
new RowLibraryItem('DallapicollaContrapunctusSecundus',12,[7,8,0,3,5,11,10,2,4,9,6,1],[],false);
new RowLibraryItem('DeMatosRochaDerivedRow',12,[0,3,4,6,9,10,1,2,5,7,8,11],[0,1,4],false);
new RowLibraryItem('LaFleurHeptatonicRow',7,[4,1,6,0,2,3,5],[0,2,3],true);
new RowLibraryItem('BachLittleFugueInGm7',7,[0, 4, 2, 1, 0, 2, 1, 0, 6, 1, 4, 0, 4, 1, 4, 2, 1, 0, 1, 4, 0, 4, 1, 4, 2, 1, 0, 1],[0,4,2],false);
new RowLibraryItem('BachLittleFugueInGm12',12,[7,2,10,9,7,10,9,7,6,9,2,7,2,9,2,10,9,10,9,7,9,2,7,2,9,2,10,9,7,9],[0,3,7],true);
new RowLibraryItem('FigureHumainePoulenc',12,[1,4,9,0,11,3,8,10,9,2,7,4,6,5,2,4,3,0,2,6,9,10]);
new RowLibraryItem('WebernConcertoOp24',12,[0, 11, 3, 4, 8, 7, 9, 5, 6, 1, 2, 10],[0,11,3,4,8,7],false);
new RowLibraryItem('CiurlionisFugue',12,[10,0,1,5,4,9,8,0,11,2,5,4,2,0,6,10,8,4,0,3,2,0]);
new RowLibraryItem('Anomaly1',12,[5, 3, 0, 1, 11, 4, 9, 6, 2, 7, 8, 10],[5,3,0,1,11,4],false);
new RowLibraryItem('Anomaly2',12,[4, 10, 0, 1, 5, 7, 8, 9, 2, 6, 11, 3],[4, 10, 0, 1, 5, 7],false);
new RowLibraryItem('WT',12,[0,2,4,6,8,10,11,9,7,5,3,1],[],false);
new RowLibraryItem('BabbittPedagogy',12,[0,4,5,2,7,9,3,1,8,11,10,6],[],false);//h1 = voice...h2 = bells
new RowLibraryItem('WebernConcertoOp24',12,[11,10,2,3,7,6,8,4,5,0,1,9],[],false);
new RowLibraryItem('BerioNones',12,[11,2,10,7,4,3,8,1,0,9,6,2,5],[0,1,4],true);//13 tone row, still derived at the trichord (ish)
new RowLibraryItem('ZTetrachords',12,[0,1,4,6,2,3,5,9,7,8,10,11],[0,1,4,6],true);
new RowLibraryItem('EpicRow',12,[1, 10, 2, 6, 9, 5, 7, 4, 3, 8, 0, 11],[],false);
new RowLibraryItem('BabbittCompositionfor12Instruments',12,[0,1,4,9,5,8,3,10,2,11,6,7],[],false);
new RowLibraryItem('SchoenbergOp33a',12,[10,5,0,11,9,6,1,3,7,8,2,4],[],false);
new RowLibraryItem('CombinatorialAnomaly',12,[5,11,3,8,2,0,1,9,7,4,10,6],[],false);
new RowLibraryItem('CiurlionisGeneric',7,[0,1,2,5,4,1,0,5,4,1,4,2,0,3,5,4,1,1,0],[],false);


/**
 * Corresponds to the violin part mm 3-5. Line spacing too!
 */
new RowLibraryItem('Carrillo1',96,[32,36,32,28,24,28,32,36,32,28,24,28,32,36,32,28,24,28,/*br*/32,36,32,28,32,28,24,28,24,20,24,20,16,20,16,12,16,12,8,12,8,4,8,4,0,4,0,92,0,92,88,/*br*/92,88,84,88,84,80,84,80,76,80,76,72,76,72,68,72,68,64,68,64,60,64,60,56,60,56,52,56,52,48,52,48,44,48,44,40,44,40,36,40,36,32],[],false);
/**
 * Guitarra & Octavina mm 33
 */
new RowLibraryItem('Carrillo2',96,[32,44,56,68,80,92,8,20,32,30,8,92,80,68,56,44],[],false);
//
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
 * Builds a key to display color codes for the matrix.
 */
const buildKey = () => {
    let parent = document.querySelector('#key');
    console.log(`Found #key element? ${parent !== undefined}`);
    parent.textContent = '';
    /**
     * @key {string} - The text to be displayed.
     * @value {string} - The color badge.
     */
    let items = {
        'Selected Row': 'lightblue',
        'Literal Search Result': 'darkcyan', 
        'Literal Search Complement': 'rgba(191, 208, 255, 0.7)',
        'Row Positional Invariant': 'aqua',
        'Prime Form Vertical': 'rgb(155, 184, 238)',
        'Prime Form Horizontal': 'rgb(255, 170, 139)',
        'Prime Form Omnidirectional': 'rgb(168, 255, 185)',
    }
    let title = document.createElement('h4');
    title.innerHTML = 'Key:';
    title.classList.add('keyTitle');
    parent.appendChild(title);
    for (let [key,value] of Object.entries(items)) {
        let mini = document.createElement('div');
        mini.classList.add('keyBox');
        let box = document.createElement('div');
        let text = document.createElement('p');
        text.innerHTML = key;
        box.classList.add('keyElement');
        box.style.backgroundColor = value;
        mini.appendChild(box);
        mini.appendChild(text);
        parent.appendChild(mini);
    }
}

/**
 * Upon Load
 */
document.addEventListener('DOMContentLoaded',() => {
    console.log('Loaded!');
    currentData['matrix'] = null;
    currentData['selected'] = [];
    buildInput('Universe','number',undefined,'Enter an integer value for the chromatic universe then press enter.');
    buildInput('Series','text',undefined,'Enter the elements of the series separated by commas. Ex: 0,4,5,7,... then press enter.');
    buildInput('Search','text',undefined,'Enter elements to search for in the matrix separated by commas. Ex: 0,3,5,9,... then press enter.');
    const searchType = (ref = check) => {
        console.log(`PF search? ${ref}`);
        currentData['pfSrch'] = ref;
    }
    let check = new MyDropdown('subComponent','Search Type',searchType);
    check.addOption('Literal',false,'Search the matrix for unordered adjacent elements.');
    check.addOption('Abstract',true,'Search the matrix for the prime-form of the input.');
    check.construct();
    
    currentData['pfSrch'] = false;
    check['data-tooltip'] = 'Determine wheter the search is for literal elements or the prime form of the input.';
    let defaultURL = new URL(`file:///C:/Users/blafl/OneDrive/Desktop/Calculators%20v4/serialism.html`) == new URL(window.location);
    // if (defaultURL == false) {
    //     urlOperations('load');
    // }
    console.log(defaultURL)
    mouseTracking();
    let sm = document.createElement('div');
    sm.classList.add('single');
    let la = document.createElement('h4');
    la.innerHTML = ('Random');
    let mess = `Generate a matrix from a random tonerow in the ${currentData['Universe']? currentData['Universe'] : 12}-tone universe.`;
    let but = document.createElement('button');
    sm['data-tooltip'] = mess;
    la['data-tooltip'] = mess;
    but['data-tooltip'] = mess;
    but.innerHTML = '...';
    but.setAttribute('onclick',`randomRow()`)//??
    sm.appendChild(la);
    sm.appendChild(but);
    document.querySelector('#upper').appendChild(sm);
})

//Reach out to people about math/music

//Angular or View for JS framework

//felipe-tovar-henao Bach Puzzles

// console.log(r1)
