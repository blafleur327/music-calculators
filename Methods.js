
/**
 * Module containing array methods.
 */
AdvancedArray = {
    /**
     * Rotates a 1D array.
     * @param {array} array 1D array
     * @param {int} index index of rotation || if undefined, return object of all rotations.
     * @returns 
     */
    rotation: (array,index = undefined) => {
        let res = {};
        for (let a = 0; a < array.length; a++) {
            res[a] = [...array.slice(a),...array.slice(0,a)];
        }
        if (index !== undefined && index <= array.length-1) {
            return res[index];
        }
        else if (index !== undefined && index > array.length-1) {
            console.error(`Index ${index} is out of bounds, array is only ${array.length} long!`);
        }
        else {
            return res;
        }
    },
    /**
     * Returns the unique subarrays contained within a 2D array. Considers ordering.
     * @param {array} array 2D array
     * @param {boolean} ordered true? order matters || false? order doesn't matter
     * @param {boolean} showIndices true? return 1D array of unique indices || false? return 2D array of actual unique subarrays
     * @returns 2D array || 1D array
     */
    uniques: (array,ordered = true,showIndices = false) => {
        let conc = [];
        array.forEach(sub => {
            let temp = ordered? sub : sub.sort((a,b) => a-b);
            conc.push(temp.join('.'));
        })
        let uns = Array.from(new Set(conc));
        let indexes = uns.map(x => x = conc.indexOf(x));
        return showIndices? indexes : indexes.map(y => y = array[y]);
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
     * Partitions a 1D array into subarrays of size n.
     * @param {array} array 1D array
     * @param {int} size partition cardianlity
     * @returns 2D array
     */
    partition: (array,size) => {
        let res = [];
        for (let a = 0; a < array.length; a+=size) {
            res.push(array.slice(a,a+size));
        }
        return res;
    }
}

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
    switchRepresentation: (pitch,mod = false) => {
        if (typeof pitch == 'string') {
            let note = pitch.match(/[a-z#]+/ig);
            let oct = pitch.match(/[0-9]+/ig);
            let temp = null;
            for (let [key,value] of Object.entries(PCSetTheory.pitches)) {
                console.log(Array.isArray(value))
            }
            return mod? temp : temp;
        }
        else if (typeof pitch == 'number') {

        }
        else {
            console.error(`${typeof pitch} is invalid data type, must be string: 'Bb6' or integer: '7'!`);
        }
    },
    intervals: (array,modulus = 12,type = 'OPCI') => {
        let adjacent = [];
        for (let a = 1; a < array.length; a++) {
            adjacent.push(array[a]-array[a-1]);
        }
        if (type == 'OPI') {

        }
        else if (type == 'UPI') {

        }
        else if (type == 'UPCI') {

        }
        else if (type == 'OPCI') {

        }
    }
}

console.log(PCSetTheory.switchRepresentation('C4'))









