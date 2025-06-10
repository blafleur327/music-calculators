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
        console.table({
            'set': `{${array}}`,
            'modulus': modulus,
            'index': index
        })
        let valid = factors(modulus).indexOf(index) == -1;
        if (valid) {
            return array.map(x => this.modulo(x*index,modulus));
        }
        else {
            console.error(`${index} is not a valid value of n! Values of n must be coprime to ${modulus}.`);
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
 * Contains the HTML escape characters for various accidentals.
 */
const Accidentals = {
    sharp: '♯',
    flat: '♭',
    halfSharp: '𝄲',
    halfFlat: '𝄳',
    natural: '♮',
};

/**
 * Object that stores a variety of accidental settings.
 */
const PitchSystems = {
    7: [
        `\uEF00`,
        `\uEF01`,
        `\uEF02`,
        `\uEF03`,
        `\uEF04`,
        `\uEF05`,
        `\uEF06`
    ],
    12: [
        'C',`C${Accidentals.sharp}/D${Accidentals.flat}`,
        `D`,`D${Accidentals.sharp}/E${Accidentals.flat}`,
        'E','F',
        `F${Accidentals.sharp}/G${Accidentals.flat}`,'G',
        `G${Accidentals.sharp}/A${Accidentals.flat}`,
        'A',`A${Accidentals.sharp}/B${Accidentals.flat}`,
        'B'],
    31: [
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
 * A method that keeps track of all of the data to be displayed.
 * @param {string} name 
 * @param {string} set superset || subset
 * @returns Object
 */
function SetInformation(name,set) {
    let info = D.setTracker[`${set}`];
    let setRep = new MySet(Object.keys(allNodes).length,...info);
    let subRef = new MySet(Object.values(allNodes).filter(x => x.state >= 1).length,...info);
    // console.table(subRef.exportable())
    D.setTracker[`${name}`] = {
        'Normal Order': new DataEntry('Normal Order',`: [${setRep.normal_order()}]`,'Normal Order is the tightest rotation of the numerical ordered PCs.'), //
        'Prime Form': new DataEntry('Prime Form',`: (${setRep.prime_form()})`,"Prime Form is the leftwise 'tightest packing' between the Normal Form or its inversion. The result is then transposed to 0."),
        'Interval Class Vector': new DataEntry('Prime Form',`: <${setRep.interval_class_vector()}>`,'The interval-class vector is the sum of interval content for a set.'),
        'Index Vector': new DataEntry('Index Vector',`: <${setRep.index_vector()}>`,'The index vector shows invariant tones under a given inversional index.'),
        // 'Maximally Even': new DataEntry('Maximally Even',`: ${set == 'superset'? setRep.exportable()['Maximally Even'] : subRef.exportable()['Maximally Even']}`),//Something's weird in the second part
        }
        return D.setTracker[`${name}`];
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
    /**
     * Contains the selected elements in both super and subsets.
     */
    this.setTracker = {
        'superset': [],
        'subset': []
    }
    this.paritalClear = () => {
        this.setTracker['superset'] = [];
        this.setTracker['subset'] = [];
        this.updateNodeStates();
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
     * Manages lines of symmetry in the drawing.  
     */
    this.symmetry = () => {
        //Remove all previous lines of symmetry.
        document.querySelectorAll('.superSymmetryLine, .subSymmetryLine').forEach(item => {
            item.remove();
        })
        //Place nodes at 2x modular universe positions.
        numPoints = (Object.keys(allNodes).length)*2;
        let allAngles = 360/numPoints;      //(180*(numPoints-2))/numPoints is really interesting!
        let vertices = [];
        for (let a = 0; a < numPoints; a++) {
            let angle = ((a*allAngles) -90) * Math.PI/180;  //-90 sets top element to 0;
            let x = this.center[0] + 200 * Math.cos(angle);
            let y = this.center[1] + 200 * Math.sin(angle);
            vertices.push([x, y]);
        }
        //Get set representations of both sets and their symmetry.
        let supers = new MySet(numPoints/2,...this.setTracker['superset']).symmetry();
        let subs = new MySet(numPoints/2,...this.setTracker['subset']).symmetry();
        //Points from symmetry x2, to align with double mod points.
        supers.forEach(line => {
            let s = this.draw.line();
            s.addClass('superSymmetryLine');
            let modified = line.map(x => x*2);
            s.plot(...vertices[modified[0]],...vertices[modified[1]]);
            s['node']['data-tooltip'] = `Superset symmetrical about the ${line[0]}-${line[1]} axis.`;
        })
        subs.forEach(line => {
            let s = this.draw.line();
            s.addClass('subSymmetryLine');
            let modified = line.map(x => x*2);
            s.plot(...vertices[modified[0]],...vertices[modified[1]]);
            s['node']['data-tooltip'] = `Subset symmetrical about the ${line[0]}-${line[1]} axis.`;
        })
    }
    /**
    * Computes positions of verticies for an equilateral shape with n points. 
    * @param {array} center [x,y] 
    * @param {int} numPoints number of equidistant points
    * @param {float} length diameter length
    */
    this.mainPolygon = (center = this.center,numPoints = 12,length = 50) => {
        let allAngles = 360/numPoints;      //(180*(numPoints-2))/numPoints is really interesting!
        let vertices = [];
        for (let a = 0; a < numPoints; a++) {
            let angle = ((a*allAngles) -90) * Math.PI/180;  //-90 sets top element to 0;
            let x = center[0] + length * Math.cos(angle);
            let y = center[1] + length * Math.sin(angle);
            vertices.push([x,y]);
            let temp = new MyNode(D,a,x,y);
            temp.clockwisePosition = a;
        }
    }
    /**
     * Manages the visibility of symmetry lines.
     * @param {int} state % 4
     */
    this.symmetryVisibility = (state = 0) => {
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
                BIG[a].forEach(item => { //Loop over each subComponent
                    let t = document.createElement('div');
                    t.classList.add('highlight');
                    t.id = `${a == 0? 'super' : 'sub'}${item[0].match(/[A-Z]+/g).join('')}`;
                    /**
                    * Special case for IV and ICV
                    */
                    if (item[0] == 'Interval Class Vector' || item[0] == 'Index Vector') {
                        let cont = document.createElement('div');
                        cont.classList.add('row')//Something new;
                        let temp = item[1]['info'].match(/[0-9]+/ig);
                        let term = document.createElement('p');
                        term['data-tooltip'] = `${item[1]['definition']}`;
                        term.innerHTML = `${item[0]} :`;
                        cont.append(term);
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
                                mini['data-tooltip'] = item[0] == 'Interval Class Vector'? `Invariant tones under T${i}/${Object.keys(allNodes).length-(i)}` : `Invariant tones under I${i-1}`;
                            }
                            cont.append(mini);
                        }
                        t.append(cont);
                    }
                    /**
                     * Any other type of information
                     */
                    else {
                        t.innerHTML = `${item[0]} ${item[1]['info']}`;
                        t['data-tooltip'] = `${item[1]['definition']}`;//How does this work??
                    }
                    a == 0? sup.appendChild(t) : sub.appendChild(t);
                })
            }
            context.appendChild(sup);
            context.appendChild(sub);
    }
    /**
     * Manages and draws the superset/subset polygons
     */
    this.miniPolygons = () => {
        let superCoords = [];
        let subCoords = [];
        //use clockwisePosition to get the order of the points.
        this.setTracker.superset.forEach(element => {
            superCoords.push(allNodes[element].coordinates);
        })
        this.setTracker.subset.forEach(element => {
            subCoords.push(allNodes[element].coordinates);
        })
        this.polygonA.plot(superCoords);
        this.polygonA['node']['data-tooltip'] = `Superset: [${new MySet(Object.keys(allNodes).length,...this.setTracker['superset']).normal_order()}]`;
        this.polygonB.plot(subCoords);
        this.polygonB['node']['data-tooltip'] = `Subset: [${new MySet(Object.keys(allNodes).length,...this.setTracker['subset']).normal_order()}]`;
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
        console.log(`Complement ${setType} triggered!`)
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
        this.updateNodeStates();//Does this update allNodes?
    }
    /**
     * Restructures the order of nodes via the input interval.
     * @param {int} interval OPCI 
     */
    this.restructure = (interval = 7) => {
        let coords = Object.values(allNodes).map(x => x.coordinates);
        let wf = ScaleTheory.generate(0,interval,coords.length,coords.length);
        for (let a = 0; a < coords.length; a++) {
            allNodes[wf[a]].move(...coords[a]);
            allNodes[wf[a]].clockwisePosition = a;
        }
    }
    /**
     * Draw a transformation Polygon
     * @param {string} transform T/I(n)
     */
    this.transformation = (transform) => {
        console.log(D.setTracker);
        let setRep = new MySet(Object.keys(allNodes).length,...this.setTracker['subset']);
        let selection = setRep.set_class()[transform];
        let test = ArrayMethods.allContained(this.setTracker['superset'],selection);
        console.log(`[${this.setTracker['superset']}] contains [${selection}]?? : ${test}`);
        if (test) {
            let tr = this.draw.polygon();
            tr.addClass('transform');
            let selCoords = [];
            Object.values(allNodes).forEach(point => {
                selection.indexOf(point.number) !== -1? selCoords.push(point.coordinates) : null;
                // console.log(point.coordinates);
            })
            tr.plot(selCoords);
            tr['node'].id = `${transform}`;
            tr['node']['data-tooltip'] = `[${setRep.normal_order()}] under ${transform} = [${selection}]`;
            this.transforms[transform] = tr;
        }
        else {
            console.error(`{${selection}} is not contained within the prevailing superset!`);
        }
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
     */
    this.manualSelection = (modulus = 12,superset,subset,clear = true) => {
        if (clear == true) {
            this.clearDrawing();
            this.mainPolygon(this.center,modulus,160);
        }
        this.setTracker['superset'] = superset;
        this.setTracker['subset'] = subset;
        let combin = [...superset,...subset];
        combin.forEach(item => {
            let filt = combin.filter(x => x == item);
            allNodes[item].state = filt.length;//Check the length of instances, will be state
            console.log(`Element ${item} status? ${allNodes[item].state}`);
        })
        this.updateNodeStates();
    }
    /**
     * Checks the state of each node in allNodes object and updates their visual accordingly.
     */
    this.updateNodeStates = () => {
        this.setTracker['superset'] = [];
        this.setTracker['subset'] = [];
        this.removeTransformation();
        const Notes = PitchSystems[Object.keys(allNodes).length];
        for (let [key,value] of Object.entries(allNodes)) {
            if (Notes !== undefined) {
                document.querySelector(`#noteToggle`).classList.remove('void');
                let k = this.draw.text(`${Notes[value.number]}`);
                k.addClass('void');
                k.center(...value.coordinates);
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
                        this.setTracker['superset'].push(value.name);
                    break;
                case 2: value.self['node'].classList.add('inSub');
                        value.self['node'].classList.contains('inSuper')? null : value.self['node'].classList.add('inSuper');//Special case for autoSelection 
                        this.setTracker['subset'].push(value.name);
                        this.setTracker['superset'].push(value.name);
                    break;
            }
            /**
             * If large modulus, add .small to all nodes.
             */
            if (Object.keys(allNodes).length > 24) {
                console.log('BIG MOD');
                value.self['node'].classList.add('small');
            }
            /**
             * Else, remove .small from all nodes.
             */
            else {
                value.self['node'].classList.contains('small')? value.self['node'].classList.remove('small') : null;
            }
        }
        this.displayUpdate();
        this.miniPolygons();
        this.symmetry();//So far so good here!
        populateDrops();
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
     * One Event listener for the entire drawing. Maybe strange, but it prevents the need for adding and destroying listeners!
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
            inst = allNodes[index];
            console.log(`Condition 1 Triggered //Line 1105`);
            this.setTracker['subset'] = [];
            this.setTracker['superset'] = [];
        }
        else if (event.target.parentNode.parentNode.tagName == 'g') {//Gets TSpan
            currNode = event.target.parentNode.parentNode;
            index = currNode.childNodes[1].textContent  //Only works for number node names
            inst = allNodes[index];
            console.log(`Condition 2 Triggered //Line 1111`);
            this.setTracker['subset'] = [];
            this.setTracker['superset'] = [];
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
 * @param {float} xPosition X coordinate
 * @param {float} yPosition Y coordinate
 */
function MyNode (parent = D,textLabel,xPosition,yPosition) {
    parent instanceof DrawingManager? null : console.error('Parent of MyNode must be instance of DrawingManager!');
    /**
     * Keeps track of the number of clicks, determines selection status.
     */
    this.state = 0;
    this.self = parent.draw.group();
    this.name = textLabel;
    this.clockwisePosition = null;
    /**
     * PC number
     */
    this.number = Object.keys(allNodes).length;
    /**
     * Stored [x,y] coordinates for later use
     */
    this.coordinates = [xPosition,yPosition];
    let text = parent.draw.text(`${textLabel}`);
    let circ = parent.draw.circle(40,40).fill('white').stroke({width: '1px', color: 'black'});
    text.center(20,20);
    circ.addClass(`myCircle`);
    this.self.add(circ);
    this.self.add(text);
    this.self.center(xPosition,yPosition);
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
    allNodes[textLabel] = this;
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
        }
        elem['data-tooltip'] = message; //Currently adds to the container. Add to all children?
        elem.childNodes.forEach(item => {
            item['data-tooltip'] = message;
        })//Lol this is terrible.
    })
}

let D;

/**
 * Populates the two drop down menus on the input.
 */
const populateDrops = () => {
    console.log('Populate Drops Triggered!');
    let big = D.setTracker['superset'];
    let setClass = new MySet(Object.keys(allNodes).length,...D.setTracker['subset']).set_class();
    console.log(D.setTracker);
    let contained = {
        'T': [],
        'I': []
    };
    let cont = 0;
    if (setClass['T0'] == undefined) {
        clearDrops();
        document.querySelector(`tContain`).innerHTML = 0;
        document.querySelector('iContain').innerHTML = 0;
    }
    else {
        for (let [key, value] of Object.entries(setClass)) {
            if (ArrayMethods.allContained(big,value)) {
                key[0] == 'T'? contained['T'].push(key) : contained['I'].push(key);
            }
        }
        clearDrops();
        for (let [key,value] of Object.entries(contained)) {
            cont++;
            let elem = null;
            document.querySelector(`#tContain`).style.visibility = 'visible';
            document.querySelector(`#iContain`).style.visibility = 'visible';
            if (key == 'T') {
                elem = document.querySelector('#ts');
            }
            else if (key == 'I') {
                elem = document.querySelector('#is');
            }
            /**
             * Add null case
             */
            for (let a = 0; a < value.length+1; a++) {
                let opt = document.createElement('option');
                a == 0? opt.innerHTML = 'NONE' : opt.innerHTML = `${value[a-1]}`;
                elem.appendChild(opt);
                opt.classList.add('trans');
            }
            document.querySelector(`#tContain`).innerHTML = `${document.querySelector('#ts').length-1}`;
            document.querySelector(`#iContain`).innerHTML = `${document.querySelector('#is').length-1}`;
            elem.addEventListener('change',() => {
                console.log(`Selected: ${elem.value}`);
                D.removeTransformation();
                if (elem.value && elem.value !== 'NONE') {
                    D.transforms = {};
                    D.transformation(elem.value);
                }
            })
        }
    }
    return cont;//Total number of elements contained.
} 

/**
 * Clears each dropdown element.
 */
const clearDrops = () => {
    let ds = document.querySelectorAll('.drop');
    ds.forEach(sel => {
        for (let a = sel.options.length-1; a >= 0; a--) {
            sel.remove(a);
        }
        console.log(`Cleared ${sel.id}: ${sel.childNodes.length == 0}`);
    })
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
            // D.manualSelection(parseInt(field.value));
            D.clearDrawing();
            D.mainPolygon(D.center,parseInt(field.value),160);
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
                    let state = null;
                    if (item.innerHTML == 'NONE') {
                        state = 1;
                    }
                    else if (item.innerHTML == 'Superset') {
                        state = 2;
                    }
                    else if (item.innerHTML == 'Subset') {
                        state = 3;
                    }
                    else {
                        state = 0;
                    }
                    D.symmetryVisibility(state);
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
    getLabelClass();
    attachListeners();
    D.updateNodeStates();
})


//TODO: Electron //Make this a real app!