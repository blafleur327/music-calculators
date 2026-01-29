/**
 * Relevant Globals
 */
let D;  //Lattice Manager
let Y; //Universe Dropdown
let Z; //Structure Dropdown

/**
 * Set the Tuning System for the tonnetz.
 */
// let tuning = '12-EDO';

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
 * Nested object literal storing the informatino for various tuning systems.
 */
const TuningSystems = {
    '12-EDO': {
        'universe': 12,
        'unwound': ['F♭♭','C♭♭','G♭♭','D♭♭','A♭♭','E♭♭','B♭♭','F♭','C♭','G♭','D♭','A♭','E♭','B♭','F','C','G','D','A','E','B','F♯','C♯','G♯','D♯','A♯','E♯','B♯','Fx','Cx','Gx','Dx','Ax','Ex','Bx'],
        'pcs': [['C','B♯','D♭♭'],['D♭','C♯','Bx'],['D','E♭♭','Cx'],['E♭','D♯','F♭♭'],['E','F♭','Dx'],['F','E♯','G♭♭'],['G♭','F♯','Ex'],['G','A♭♭','Fx'],['A♭','G♯'],['A','B♭♭','Gx'],['B♭','A♯','C♭♭'],['B','C♭','Ax']],
        'enharm': ['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B'],
    },
    '31-EDO' : {
        'universe': 31,
        'unwound': [`C`,`C${Accidentals.semiSharp}`,`C${Accidentals.sharp}`,
            `D${Accidentals.flat}`,`D${Accidentals.semiFlat}`,'D',`D${Accidentals.semiSharp}`,`D${Accidentals.sharp}`,
            `E${Accidentals.flat}`,`E${Accidentals.semiFlat}`,`E`,`E${Accidentals.semiSharp}`,`E${Accidentals.sharp}`,
            `F`,`F${Accidentals.semiSharp}`,`F${Accidentals.sharp}`,
            `G${Accidentals.flat}`,`G${Accidentals.semiFlat}`,`G`,`G${Accidentals.semiSharp}`,`G${Accidentals.sharp}`,
            `A${Accidentals.flat}`,`A${Accidentals.semiFlat}`,'A',`A${Accidentals.semiSharp}`,`A${Accidentals.sharp}`,
            `B${Accidentals.flat}`,`B${Accidentals.semiFlat}`,`B`,`C${Accidentals.flat}`,`C${Accidentals.semiFlat}`],
        'pcs': [[`C`],[`C${Accidentals.semiSharp}`],[`C${Accidentals.sharp}`],
            [`D${Accidentals.flat}`,`C${Accidentals.sharpAndHalf}`],[`D${Accidentals.semiFlat}`],['D'],[`D${Accidentals.semiSharp}`],[`D${Accidentals.sharp}`],
            [`E${Accidentals.flat}`],[`E${Accidentals.semiFlat}`],[`E`],[`E${Accidentals.semiSharp}`],[`E${Accidentals.sharp}`],
            [`F`],[`F${Accidentals.semiSharp}`],[`F${Accidentals.sharp}`],
            [`G${Accidentals.flat}`],[`G${Accidentals.semiFlat}`],[`G`],[`G${Accidentals.semiSharp}`],[`G${Accidentals.sharp}`],
            [`A${Accidentals.flat}`],[`A${Accidentals.semiFlat}`],['A'],[`A${Accidentals.semiSharp}`],[`A${Accidentals.sharp}`],
            [`B${Accidentals.flat}`],[`B${Accidentals.semiFlat}`],[`B`],[`C${Accidentals.flat}`,`B${Accidentals.semiSharp}`],[`C${Accidentals.semiFlat}`,`B${Accidentals.sharp}`]],
        'enharm': [`C`,`C${Accidentals.semiSharp}`,`C${Accidentals.sharp}`,
            `D${Accidentals.flat}`,`D${Accidentals.semiFlat}`,'D',`D${Accidentals.semiSharp}`,`D${Accidentals.sharp}`,
            `E${Accidentals.flat}`,`E${Accidentals.semiFlat}`,`E`,`E${Accidentals.semiSharp}`,`E${Accidentals.sharp}`,
            `F`,`F${Accidentals.semiSharp}`,`F${Accidentals.sharp}`,
            `G${Accidentals.flat}`,`G${Accidentals.semiFlat}`,`G`,`G${Accidentals.semiSharp}`,`G${Accidentals.sharp}`,
            `A${Accidentals.flat}`,`A${Accidentals.semiFlat}`,'A',`A${Accidentals.semiSharp}`,`A${Accidentals.sharp}`,
            `B${Accidentals.flat}`,`B${Accidentals.semiFlat}`,`B`,`C${Accidentals.flat}`,`C${Accidentals.semiFlat}`]
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
     * Returns the number of overlapping elements between two arrays;
     * @param {array} arr1 
     * @param {array} arr2 
     */
    intersection: function (arr1,arr2) {
        return [...arr1,...arr2].length-Array.from(new Set([...arr1,...arr2])).length;
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
 * @returns 2D array (res)
 */
 adjacentIndices: function (array,search) {
    let res = [];
    let sor = search.sort((a,b) => a-b).join('.');
    for (let a = 0; a < array.length; a++) {
        if (array.slice(a,a+search.length).sort((x,y) => x-y).join('.') == sor) {
            res.push([a,a+search.length-1]);
        }
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

const IntsByTuning = {
    '12-EDO': {
        'PU': new Interval(0,0),
        'P5': new Interval(1,7),
        'P4': new Interval(-1,5),
        'M3': new Interval(4,4),
        'M6': new Interval(3,9),
        'm3': new Interval(-3,3),
        'M2': new Interval(2,2),
        'm2': new Interval(-5,1),
        'm7': new Interval(-2,10),
        'M7': new Interval(5,11),
        'm6': new Interval(-4,8),
        'A4': new Interval(6,6),
        'D5': new Interval(-6,6),
        'A5': new Interval(8,8),
        'A2': new Interval(9,3),
    },
    '31-EDO': {
        'PU': new Interval(0,0),
        'Lesser Diesis': new Interval(1,1),
        'Chromatic m2': new Interval(2,2),
        'Diatonic m2': new Interval(3,3),
        'Semiflat M2': new Interval(4,4),
        'M2': new Interval(5,5),
        'Semisharp M2': new Interval(6,6),
        'Septimal m3': new Interval(7,7),
        'm3': new Interval(8,8),
        'Neutral 3': new Interval(9,9),
        'M3': new Interval(10,10),
        'Septimal M3': new Interval(11,11),
        'Wolf 4': new Interval(12,12),
        'P4': new Interval(13,13),
        'Semisharp 4': new Interval(14,14),
        'Sharp Tritone': new Interval(15,15),
        'Flat Tritone': new Interval(16,16),
        'Semiflat 5': new Interval(17,17),
        'P5': new Interval(18,18),
        'Wolf 5': new Interval(19,19),
        'Septimal m6': new Interval(20,20),
        'm6': new Interval(21,21),
        'Neutral 6': new Interval(22,22),
        'M6': new Interval(23,23),
        'Septimal M6': new Interval(24,24),
        'Septimal m7': new Interval(25,25),//Harmonic 7th
        'm7': new Interval(26,26),
        'Neutral 7': new Interval(27,27),
        'M7': new Interval(28,28),
        'Flat 8': new Interval(29,29),
        'Semiflat 8': new Interval(30,30),
        'P8': new Interval(31,31),
    }
}

/**
 * 
 * @param {int} opci 
 * @param {string} tuning 12-EDO
 * @returns 
 */
const findOPCI = (opci,tuning = '12-EDO') => {
    for (let [key,value] of Object.entries(IntsByTuning[tuning])) {
        if (value.opci == opci) {
            return key;
        }
    }
}

/**
 * Determines if the input PC or pitch is a black key or not.
 * @param {any} name Pitch Name || PC
 * @param {string} tuning 12-EDO
 * @returns Boolean
 */
const isBlackKey = (name,tuning = '12-EDO') => {
    let black = tuning == '12-EDO'? [1,3,6,8,10] : [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26, 27, 29, 30];
    let result = null;
    if (typeof name == 'string' && isNaN(parseInt(name))) {
        let spl = name.indexOf('/') > -1? name.split('/')[0] : name;
        for (let a = 0; a < TuningSystems[tuning]['pcs'].length; a++) {
            if (TuningSystems[tuning]['pcs'][a].indexOf(spl) !== -1) {
                result = black.indexOf(a) !== -1;
            }
        }
    }
    else {
        result = black.indexOf(parseInt(name)) !== -1;
    }
    return result;
}

/**
 * 
 * @param {*} name 
 */
const multiColor = (name) => {
    let colorCode = {
        'color1': Accidentals['flatAndHalf'],
        'color2': Accidentals['flat'],
        'color3': Accidentals['semiFlat'],
        'color4': null,
        'color5': Accidentals['semiSharp'],
        'color6': Accidentals['sharp'],
        'color7': Accidentals['sharpAndHalf'],
    };
    let secondChar = name.length > 1? name[1] : null;
    Object.entries(colorCode).forEach(([key,value]) => {
        if (secondChar == value) {
            return key;
        }
    })
}

/**
 * Constructor for new interval object.
 * @param {int} unwound
 * @param {int} opci 
 */
function Interval (unwound,opci) {
    this.unwound = unwound;
    this.opci = opci;
}

/**
 * Gets the PC of input note.
 * @param {string} note 
 * @param {string} tuning
 * @returns 
 */
const getPC = (note,tuning = '12-EDO') => {
    let res = null;
    let i = 0; 
    while (res == null && i < TuningSystems[tuning]['pcs'].length) {
        res = TuningSystems[tuning]['pcs'][i].indexOf(note) !== -1? i : null;
        i++;
    }
    return res;
}

/**
 * Object storing various tonnetz structure objects.
 */
let TonnetzStructure = {};

/**
 * Define a new tonnetz structure.
 * @param {string} name 
 * @param {string} tuning 12-EDO
 * @param {string} start starting pitch.
 * @param {string} a east-west
 * @param {string} b south-east
 * @param {string} c south-west
 */
function Structure (name,tuning = '12-EDO',start = 'B♯',a,b,c) {
    let width = 15;
    this.enharmonicWrap = true;
    this.name = name;
    this.intNames = [a,b,c];
    /**
     * a = east-west
     * b = south-east
     * c = south-west
     */
    this.axes = [IntsByTuning[tuning][a],IntsByTuning[tuning][b],IntsByTuning[tuning][c]];
    this.startingPitch = start;
    this.noteArray = [];
    this.pcArray = [];

    /**
     * Populates this.noteArray and this.pcArray. Needed to buildLattice.
     */
    const populate = () => {
        let start = this.enharmonicWrap? TuningSystems[tuning]['enharm'][getPC(this.startingPitch)] : TuningSystems[tuning].unwound.indexOf(this.startingPitch);
        this.noteArray.push(start);
        this.pcArray.push(getPC(start));
        let row = 0;
        for (let a = 1; a < width**2; a++) {
            /**
             * New Row
             */
            if (row < Math.floor(a/width)) {
                let pc = (this.pcArray[row*width]+(this.axes[2].opci))%TuningSystems[tuning].universe;
                this.noteArray.push(this.enharmonicWrap? TuningSystems[tuning]['enharm'][pc] : this.noteArray[row*width]+(this.axes[2].unwound));
                this.pcArray.push(pc);
                row+=1;
            }
            else {
                let pc = (this.pcArray[row*width]+((a%width)*this.axes[0].opci))%TuningSystems[tuning].universe;
                this.noteArray.push(this.enharmonicWrap? TuningSystems[tuning]['enharm'][pc] : this.noteArray[row*width]+((a%width)*this.axes[0].unwound));
                this.pcArray.push(pc);
            }
        }
    }
    populate();
    if (TonnetzStructure[tuning] == undefined) {
        TonnetzStructure[tuning] = {};
        TonnetzStructure[tuning][name] = this;
    }
    else {
        TonnetzStructure[tuning][name] = this;
    }
}

/**
 * 12-EDO Layouts
 */
new Structure('Triadic',undefined,undefined,...['P5','M3','m3']);
new Structure('Jankó',undefined,undefined,...['M2','M7','m2']);
new Structure('Wicki-Hayden',undefined,undefined,...['M2','P4','P5']);
new Structure('B-System',undefined,undefined,...['m3','m3','m2']);
new Structure('C-System',undefined,undefined,...['m3','M7','M2']);

/**
 * 31-EDO Layouts
 */
new Structure('Triadic','31-EDO','C',...['P5','M3','m3']);
new Structure('Jankó','31-EDO','C',...['M2','M7','Chromatic m2']);
new Structure('Wicki-Hayden','31-EDO','C',...['M2','P4','P5']);
new Structure('B-System','31-EDO','C',...['m3','m3','Chromatic m2']);
new Structure('C-System','31-EDO','C',...['m3','M7','M2']);
new Structure('Bosanquet-Wilson','31-EDO','C',...['M2','Chromatic m2','Diatonic m2']);


/**
 * Corrects b or # in an input.
 * @param {string} string 
 */
const fixAccidentals = (string) => {
    let res = '';
    [...string].forEach(item => {
        let temp = item;
        if (item == 'b') {
            temp = `♭`;
        }
        else if (item == '#') {
            temp = `♯`;
        }
        res+=temp;
    });
    return res;
}

/**
 * Contains the unwound vectors for the 4 triad types.
 */
const triads = {
    '+': [IntsByTuning['12-EDO'].M3,IntsByTuning['12-EDO'].P5],
    '-': [IntsByTuning['12-EDO'].m3,IntsByTuning['12-EDO'].P5],
    'aug': [IntsByTuning['12-EDO'].M3,IntsByTuning['12-EDO'].A5],
    'dim': [IntsByTuning['12-EDO'].m3,IntsByTuning['12-EDO'].D5]
}

const PC = {
    /**
     * Returns the input value in mod n.
     * @param {int} value 
     * @param {int} modulus 
     * @returns Integer modn
     */
    modulo: (value,modulus = 12) => {
        return value >=0? value%modulus : (value%modulus)+modulus;
    },
    /**
     * Transpose the input collection by n units in modulo m.
     * @param {array} collection 
     * @param {int} index 
     * @param {int} modulus
     * @returns  
     */
    transpose: (collection,index,modulus = 12) => {
        return collection.map(x => PC.modulo(x+=index,modulus));
    },
    /**
     * Invert the input collection then transpose it n units in modulo m.
     * @param {array} collection 
     * @param {int} index 
     * @param {int} modulus 
     * @returns 
     */
    invert: (collection,index,modulus = 12) => {
        return collection.map(x => PC.modulo((modulus-x)+index,modulus));
    },
    /**
     * Build a triad based on input.
     * @param {string} chord 
     * @param {boolean} numbers
     */
    buildTriad: (chord,numbers = false) => {
        console.log(`buildTriad called on params:...chord ${chord}, numbers: ${numbers}`);
        let init = chord.match(/[A-G♭♯b#]+/g)[0];
        let root = fixAccidentals(init);
        let qual = chord.match(/[+-]/g)[0];
        let result = [TuningSystems['12-EDO']['unwound'].indexOf(root)];
        let start = result[0];
        triads[qual].forEach(int => {
            result.push(start + int.unwound);
          });
        return numbers? result : result.map(x => TuningSystems[tuning]['unwound'][x]);
    },
    /**
     * Turns a chord in array form into its chord symbol.
     * @param {array} chord 
     * @returns string
     */
    reduceTriad: (chord) => {
        let ints = [];
        let result = null;
        if (typeof chord[0] == 'string') {
            chord = chord.map(x => TuningSystems['12-EDO']['unwound'].indexOf(x));
        }
        result = TuningSystems['12-EDO']['unwound'][chord[0]];
        for (let a = 1; a < chord.length; a++) {
            ints.push(chord[a]-chord[0]);
        }
        console.table(triads)
        for (let [key,value] of Object.entries(triads)) {
            let temp = value.map(x => x.unwound);
            if (temp.join('.') == ints.join('.')) {
                return `${result}${key}`;
            }
        }
    },
    /**
     * Enharmonically reinterpret a chord based on a threshold.
     * @param {any} chord 
     * @param {*} upper 
     * @param {*} lower 
     */
    enharmonicRespell: (chord,upper = 'B♯',lower = 'F♭') => {
        console.log(`ENHARMONIC RESPELL CALLED! on params...chord: ${chord}`)
        let ints = [TuningSystems['12-EDO']['unwound'].indexOf(upper),TuningSystems['12-EDO']['unwound'].indexOf(lower)];
        let resp = typeof chord == 'string'? PC.buildTriad(chord,true) : chord.map(x => TuningSystems['12-EDO']['unwound'].indexOf(x));
        if (Math.min(...resp) <= ints[1]) {
            resp = resp.map(x => x+=12);
        }
        else if (Math.max(...resp) >= ints[0]) {
            resp = resp.map(x => x-=12);
        }
        else {
            resp = resp;
        }
        return typeof chord == 'string'? PC.reduceTriad(resp.map(x => TuningSystems['12-EDO']['unwound'][x])) : resp.map(x => TuningSystems['12-EDO']['unwound'][x]);
    },
    /**
     * Converts an array of pitches into their respective PCs
     * @param {array} chord 
     * @returns 
     */
    toPC: (chord) => {
        let res = [];
        chord.forEach(member => {
            for (let a = 0; a < TuningSystems['12-EDO']['pcs'].length; a++) {
                TuningSystems['12-EDO']['pcs'][a].indexOf(member) !== -1? res.push(a) : null;
            }
        })
        return res;
    },
    /**
     * Test if two pitches are enharmonically equivalent.
     * @param {string} a 
     * @param {string} b 
     * @returns Boolean
     */
    isEnharmonicEquiv: (a,b) => {
        let modA = fixAccidentals(a);
        let modB = fixAccidentals(b);
        let res = false;
        TuningSystems['12-EDO']['pcs'].forEach(item => {
            item.indexOf(modA) !== -1 && item.indexOf(modB) !== -1? res = true : null;
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
 * Create a Neo Riemannian cycle using UTTs or the standard 6 Neo Riemannian Operands.
 * @param {any} start String || Array 
 * @param  {...any} utts Instance of UTT class or string: <-,5,7>
 */
function Cycle (start,...utts) {
    this.start = start; 
    this.utts = utts.map(x => x instanceof UTT? x.stringFormat : x);  //Hopefully
    this.cycle_length;
    this.result;
    /**
     * 
     * @param {any} start String || Array
     * @param  {...any} utts Instance of UTT class or string: <-,5,7>
     * @returns 
     */
    this.perform = (start,...utts) => {
        let st = typeof start == 'string'? fixAccidentals(start) : start.map(x => fixAccidentals(x)); //Should fix the data type issue.
        let total = [st];
        let its = 100;
        let transformations = [];
        /**
         * Convert string rep of utt into actual UTT instance.
         */
        utts.forEach(transformation => {
            if (typeof transformation == 'string' && transformation[0] == '<') {
                let split = transformation.match(/[0-9-+]+/g);
                console.log(split)
                split[1] = parseInt(split[1]);
                split[2] = parseInt(split[2]);
                transformations.push(new UTT(...split));
            }
            else if (typeof transformation == 'string') {
                transformations.push(NRTs[`${transformation}`]);
            }
            else if (transformation instanceof UTT) {
                transformations.push(transformation);
            }
        })
        let ind = 0;
        let t1 = typeof total[0] == 'object'? PC.reduceTriad(total[0]) : total[0];
        let splitUp = [t1.match(/[a-z♯♭]+/ig)[0],t1.match(/[+-]/g)[0]];
        while (ind < its) {//(ind < its*transformations.length) {  //(total[ind] !== total[0] || ind % transformations.length == 0)
            let current = transformations[ind%transformations.length].execute(total[ind]);
            total.push(current);
            let cond = typeof current == 'object'? PC.reduceTriad(current) : current;
            let condSplit = [cond.match(/[a-z♯♭]+/ig)[0],cond.match(/[+-]/g)[0]];
            let completionTest = PC.isEnharmonicEquiv(condSplit[0],splitUp[0]) && condSplit[1] == splitUp[1];
            if (ind % transformations.length == transformations.length-1 && completionTest == true) {
                break;
            }
            ind+=1;
        }
        return total;
    }
    this.result = this.perform(start,...utts);
    this.cycle_length = this.result.length-1;
}


/**
 * Create a Uniform Triadic Transformation or UTT object.
 * @param {string} parody +/-
 * @param {int} majorInt 
 * @param {int} minorInt
 * @param {string} tooltip to display upon hover
 */
function UTT (parody,majorInt,minorInt,tooltip) {
    this.quality = parody;
    this.majorInt = findOPCI(majorInt);
    this.minorInt = findOPCI(minorInt);
    /**
     * Shows the string format of a UTT.
     */
    this.stringFormat = `<${this.quality},${majorInt},${minorInt}>`;
    /**
     * Boolean, if the UTT is a Schritt. That is, it is a contextual transposition that transposes a major triad in one direction and a minor triad in an equal and opposite direction.
     */
    this.isSchritt = parody == '+' && (majorInt+minorInt)%12 == 0;
    /**
     * Boolean, if the UTT is a Wechsel. That is, it is a contextual inversion that transposes a major triad in one direction and a minor triad in an equal and opposite direction.
    */
    this.isWechsel = parody == '-' && (majorInt+minorInt)%12 == 0;
    /**
     * Perform this transformation on an input triad.
     * @param {any} triad 
     */
    this.tooltip = tooltip? tooltip : this.stringFormat;
    this.execute = (triad) => {
        let temp = triad;
        if (typeof triad == 'object') {
            temp = PC.reduceTriad(triad);
        }
        let init = temp.match(/[A-G♭♯b#]+/g)[0];
        let qual = temp.match(/[+-]/g)[0];
        root = fixAccidentals(init);
        let index = TuningSystems['12-EDO']['unwound'].indexOf(root);
        if (qual == '+') {
            index+=IntsByTuning['12-EDO'][this.majorInt].unwound;
        }
        else {
            index+=IntsByTuning['12-EDO'][this.minorInt].unwound;
        }
        if (parody == '-') {
            if (qual == '-') {
                qual = '+';
            }
            else if (qual == '+') {
                qual = '-';
            }
        }
        console.table(index);
        return typeof triad == 'object'? PC.buildTriad(PC.enharmonicRespell(`${TuningSystems['12-EDO']['unwound'][index]}${qual}`)) : PC.enharmonicRespell(`${TuningSystems['12-EDO']['unwound'][index]}${qual}`);
    }
    let grp = ['C+'];
    for (let a = 0; a < 24; a++) {
        grp.push(this.execute(grp[a]));
    }
    /**
     * Boolean, if the input UTT creates a simply transitive, closed group. That is, with recursive application, this transformation can produce the complete consonant triad group.
     */
    this.kGroup = Array.from(new Set(grp)).length == 24;
}

/**
 * An object containing a variety of the standard Neo Riemannian Transformations already instances of UTT object.
 */
//These cause errors in 31-EDO
const NRTs = {
    L: new UTT('-',4,8,'Leittonwechsel or Leading-Tone.'),
    R: new UTT('-',9,3,'Relative.'),
    P: new UTT('-',0,0,'Parallel.'),
    N: new UTT('-',5,7,'Nebenverwandt or Neighbor-Related.'),
    H: new UTT('-',8,4,'Hexatonic Pole.'),
    S: new UTT('-',1,11,'Slide.')
}

/**
 * Creates a hexagonal node. 
 * @param {LatticeManager} parent 
 * @param {String} name 
 * @param {Array} center 
 * @param {Int} numPoints 
 * @param {Float} length 
 */
function HexNode (parent,name,center,numPoints = 6,length = 30) {
    this.size = length;
    this.centroid;
    this.name = name;
    // this.color = 'white';
    this.index = null;
    this.points = {};
    this.pc = undefined;//typeof name == 'string' && isNaN(parseInt(name))? getPC(name) : name;
    /**
     * Build the HexNode according to input params.
     */
    this.build = () => {
        /**
         * If exists, remove from parent.nodes and document.
         */
        if (this.centroid) {
            this.index = this.removeSelf();

        }
        if (parent instanceof LatticeManager) {
            this.self = parent.draw.group();
            let points = [];
            let allAngles = 360/numPoints;      //(180*(numPoints-2))/numPoints is really interesting!
            for (let a = 0; a < numPoints; a++) {
                let angle = ((a*allAngles) -90) * Math.PI/180;  //-90 sets top element to 0;
                let x = center[0] + length * Math.cos(angle);
                let y = center[1] + length * Math.sin(angle);
                this.points[`${a*2}`] = [x,y];
                points.push(x,y);
            }
            let s = parent.draw.polygon(points).center(0,0);
            let t = parent.draw.text(this.name);
            s.plot();
            let curr = Object.keys(parent.nodes).length;
            this.self.add(s);
            this.self.add(t);
            this.self.addClass('hexNode');
            this.self.id(`n${curr}`);
            if (parent.tuning == '12-EDO') {
                isBlackKey(this.name)? this.self.addClass('dark') : null;
            }
            else {
                // console.log(this.name)
                this.self.addClass(`${multiColor(this.name)}`);//FAILS
            } 
            /**
             * Index nodes in parent.nodes by row:column
             */
            this.index = this.index? this.index : curr;
            parent.nodes[this.index] = this;
            this.self.translate(...center);
            // s.center(...center);
            // t.center(...center);
            
            /**
             * Stores the center of each hexagon.
             */
            this.centroid = [...center];
            
            /**
             * If no name, void.
             */
            this.name == undefined || this.name == 'undefined'? this.self.addClass('void') : null;
        }
    }
    /**
     * Move the node.
     * @param {float} x 
     * @param {float} y 
     */
    this.move = (x,y) => {
        this.self.center(x,y);
        this.centroid = [x,y];
    }
    /**
     * Removes grouped elements from the drawing and from parent.nodes object.
     * @returns id of removed element
     */
    this.removeSelf = () => {
        let id = this.self['node'].id.match(/[0-9]+/ig)[0];
        this.self['node'].remove();
        parent.nodes[id] = null;
        parent.nodes = Object.fromEntries(Object.entries(parent.nodes).filter(([k,v]) => v !== null));
        return id;
    }
    /**
     * Changes nodes name.
     * @param {string} name 
     */
    this.rename = (name) => {
        this.name = name;
        this.build();
    }
    this.build();
}

/**
 * Creates a circle vertex on the tonnetz that can be clicked.
 * @param {LatticeManager} parent 
 * @param {array} coordinate [x,y]
 * @param {string} name
 */
function Vertex (parent = D,coordinate,name) {
    this.constituents = [];
    this.selected = false;
    this.name = name;
    this.id = null
    this.self = null;
    this.coordinate = coordinate;
    /**
     * Builds the node based on the specified params.
     */
    this.build = () => {
        Object.values(parent.chords).forEach(el => {
            if (el.coordinate.join('|') == this.coordinate.join('|')) {
                el.removeSelf();
            }
        })
        this.self = parent.draw.group();
        this.self.id = `${this.id}`;
        this.self.addClass('chord');
        let cir = parent.draw.circle(15).center(0,0);
        let tex = parent.draw.text(`${this.name}`);
        tex.addClass('void');
        this.self.add(cir);
        this.self.add(tex);
        this.self.translate(...coordinate);
        parent.chords[this.id] = this;
        this.name == 'undefined+' || this.name == 'undefined-'? this.self.addClass('void') : null;
    }
    /**
     * Move the node.
     * @param {float} x 
     * @param {float} y 
     */
    this.move = (x,y) => {
        this.self.center(x,y);
        this.centroid = [x,y];
    }
    /**
     * Removes grouped elements from the drawing and from parent.nodes object.
     * @returns id of removed element
     */
    this.removeSelf = () => {
        this.self['node'].remove();
        parent.chords[this.id] = null;
        parent.chords = Object.fromEntries(Object.entries(parent.chords).filter(([k,v]) => v !== null));
        return this.id;
    }
    /**
     * Changes nodes name.
     * @param {string} name 
     */
    this.rename = (name) => {
        this.name = name;
        this.build();
    }
}

/**
 * Confirms if two x,y points lie within a specified proximity from one another.
 * @param {float} x1 
 * @param {float} y1 
 * @param {float} x2 
 * @param {float} y2 
 * @param {int} deviation 
 * @returns boolean
 */
const proximity = (x1,y1,x2,y2,deviation = 10) => {
    let xDist = Math.abs(x1-x2) <= deviation;
    let yDist = Math.abs(y1-y2) <= deviation;
    return xDist == true && yDist == true;
}

/**
 * Manages the drawing of a hexagonal lattice. 
 * @param {string} parent HTML element ID
 * @param {string} structure Key in tonnetzStructure object
 */
function LatticeManager (parent,structure = 'Triadic') {
    let drawSize = {'x': 1200,'y': 750};
    this.tuning = '12-EDO';
    this.selectedTriad = null;
    this.selectedTriadNode = null;
    this.depth = 15;
    /**
     * Stores hexagonal nodes.
     */
    this.nodes = {};
    this.structure = TonnetzStructure[structure];
    this.draw = null;
    this.center = [drawSize['x']/2,drawSize['y']/2];
    this.previous = null;
    let parity = 0;
    /**
     * Stores vertex instances.
     */
    this.chords = {};
    /**
     * Toggle integer display.
     */
    this.integers = false;
    /**
     * Constructs a lattice of hexagonal nodes and circular selectors.
     * @param {Array} start [x,y]
     */
    this.buildLattice = (start = [35,35]) => {
        document.querySelector(`#${parent}`).innerHTML = '';
        this.draw = SVG().addTo(document.querySelector(`#${parent}`)).size(drawSize['x'],drawSize['y']);//Who knows...
        this.nodes = {};
        this.chords = {};
        let xChange = 52;   //52
        let diag = [26,45]; //[26,45]
        let first = 12;
        for (let a = 0; a < this.depth; a++) {
            first = (first*a)%TuningSystems[this.tuning]['unwound'].length;//???
            let init = [start[0]+(diag[0]*a),start[1]+(diag[1]*a)];
            for (let b = 0; b < this.depth; b++) {
                let hex = new HexNode(this,this.integers? `${this.structure.pcArray[a*this.depth+b]}` : `${this.structure.enharmonicWrap? this.structure.noteArray[a*this.depth+b] : TuningSystems[tuning]['unwound'][this.structure.noteArray[a*this.depth+b]]}`,[init[0]+(xChange*b),init[1]]);
                hex.pc = this.structure.pcArray[a*this.depth+b];
                hex.build();
            }        
        }
        /**
         * Name and build circular vertices
         */
        let tem = Object.values(this.nodes);
        for (let i = 0; i < tem.length; i++) {
            let root = null;
            if (this.integers) {
                root = this.structure.pcArray[i];
            }
            else if (this.integers == false && this.structure.name == 'Triadic') {
                root = this.structure.noteArray[i];
            }
            else {
                root = '';
            }
            let a = new Vertex(D,tem[i].points['4'],`${root !== 'undefined'? root+'-' : ''}`); //as work.
            a.id = `chordA${tem[i].self['node'].id}`;
            let b = new Vertex(D,tem[i].points['2'],`${root !== 'undefined'? root+'+' : ''}`);//Major
            b.id = `chordB${tem[i].self['node'].id}`;
            a.build();
            b.build();
        }
        /**
         * Leftmost (lowest x) node is always the root for triadic tonnetze
         */
        this.chordGrouper();
        /**
         * Wether or not all similar items on the tonnetz can be selected in tandem.
         */
        this.cluster = false;
        /**
         * Event Listener to select a hexagon.
         */
        document.querySelector('svg').addEventListener('mousedown',(event) => {
            /**
             * Select nearest .chord
             */
            if (event.target.parentNode.classList.contains('chord') || event.target.parentNode.parentNode.classList.contains('chord')) {
                this.resetTonnetz(true);
                let active = event.target.closest('.chord');
                active.classList.add('sel');
                // active.childNodes[0].setAttribute('r',22)
                console.log(`Chord Selected: ${active.childNodes[1].textContent}`);
                this.selectedTriad = active.childNodes[1].textContent;
                this.selectedTriadNode = active;
                this.previous = [parseFloat(...active.getAttribute('transform').match(/[0-9.]+/g).slice(-2,-1)),parseFloat(...active.getAttribute('transform').match(/[0-9.]+/g).slice(-1))];
                /**
                 * Select only single instance.
                 */
                if (this.cluster == false) {
                    let grp = active['data-cluster'].split('.');
                    grp.forEach(el => {
                        document.querySelector(`#${el}`).classList.add('active');
                    });
                }
                /**
                 * Select all instances.
                 */
                else {
                    this.selectAll(this.selectedTriad,true);
                }
            }
        });
        let ints = [...this.structure.pcArray.slice(0,2),this.structure.pcArray[this.depth]];
        console.log(ints);
        document.querySelector('#type').textContent = `${this.structure.name} ... <${this.structure.intNames}>`;
        document.querySelector('#setClass').textContent = `SC: (${new MySet(TuningSystems[this.tuning]['universe'],...ints).prime_form()})`;
    }
    /**
     * Select all of a single traid on the tonnetz.
     * @param {string} chord 'C+' 
     * @param {boolean} primary
     * @param {array} coordinate [x,y]
     */
    this.selectAll = (chord,primary = true,coordinate = undefined) => {
        //clear some things?
        let en = PC.enharmonicRespell(chord,'B♯','C♭');
        let annoying = en.match(/[^+\/-]+/ig);
        let spl = [...annoying,en.slice(-1)];
        let classes = {
            'circle': primary? 'sel' : ['sel1','sel2','sel3','sel4','sel5'], 
            'hex': primary? 'active' : ['active1','active2','active3','sel4','sel5']
        }
        if (this.cluster == true) {
            document.querySelectorAll('.chord').forEach(el => {
                let tSplit = [...el.textContent.match(/[^+\/-]+/ig)];
                if (ArrayMethods.intersection(annoying,tSplit) > 0 && el.textContent.slice(-1) == spl.slice(-1)[0]) {//CHANGE THIS LINE
                    el.classList.add(primary? classes['circle'] : classes['circle'][parity]);
                    let grp = el['data-cluster'].split('.');
                    grp.forEach(sub => {
                        document.querySelector(`#${sub}`).classList.add(primary? classes['hex'] : classes[hex][parity]);
                    })
                }
            })
        }
        else {
            let init = document.querySelector('.sel > circle');
            /**
             * If coordinate is defined, use it, else use the origin.
             */
            let coord = coordinate? coordinate : [parseFloat(...init.getAttribute('transform').match(/[0-9.]+/g).slice(-2,-1)),parseFloat(...init.getAttribute('transform').match(/[0-9.]+/g).slice(-1))];
            /**
             * Filter chords such that only the correct names are present.
             */
            let temp = Object.values(this.chords).filter(v => ArrayMethods.intersection(annoying,v.name.match(/[^+\/-]+/ig)) > 0 && v.name.slice(-1) == spl.slice(-1)[0]);
            /**
             * Filter again by proximity;
             */
            let fin = temp.filter(value => proximity(...value.coordinate,...coord,65) == true);//Consider expanding radius/deviation...
            console.log(`FIND NEAREST ${en}? ${fin[0].self['node'] !== undefined}`);
            fin[0].self['node'].classList.add(primary? classes['circle'] : classes['circle'][parity]);
            let grp = fin[0].self['node']['data-cluster'].split('.');
            this.previous = fin[0].coordinate;
            grp.forEach(sub => {
                document.querySelector(`#${sub}`).classList.add(primary? classes['hex'] : classes['hex'][parity]);
            })
        }
    }
    /**
     * Groups hex nodes.
     */
    this.chordGrouper = () => {
        // console.log(`${Object.values(this.chords).length}`);
        Object.values(this.chords).forEach(circ => {
            let cent = circ.coordinate;
            let temp = [];
            let ids = [];
            Object.values(this.nodes).forEach(node => {
                if (proximity(...node.centroid,...cent,50)) {
                    temp.push(node);
                    ids.push(node.self['node'].id);
                }
            })
            // console.log(`${circ.name}...[${temp.map(x => x.name)}]`);
            circ.constituents = temp;
            temp.length == 3? null : circ.self['node'].classList.add('void');
            circ.self['node']['data-cluster'] = ids.join('.');
        })
    }
    /**
     * Returns the nodes within a selected row.
     * @param {int} number
     */
    this.selectRow = (number) => {
        let result = [];
        Object.entries(this.nodes).forEach(([key,value]) => {
            // console.log(value);
            if (number == parseInt(key.split(':')[0])) {
                result.push(value);
            }
        })
        return result;//.map(x => x.self['node']);
    };
    /**
     * Returns a slice of this.nodes as an array.
     * @param {int} start
     * @param {int} end 
     * @returns 
     */
    this.grabber = (start,end) => {
        if (start < 0 || end >= this.depth**2) {
            console.error(`OUT OF BOUNDS! Valid indices are [${0}:${(this.depth**2)-1}].`);
        }
        else {
            return Object.values(this.nodes).slice(start,end);   
        }   
    }
    /**
     * Highlights elements on the lattice.
     * @param {array} array 1D array.
     * @param {int} color 0 || 1
     */
    this.highlightPCs = (array,color = 0) => {
        let spec = color == 0? `wham` : `wham2`;
        let oppo = color == 0? 'wham2' : 'wham';
        document.querySelectorAll(`.${spec}, .both`).forEach(item => {
            item.classList.contains('both')? item.classList.remove('both') : item.classList.remove(`${spec}`);

        });
        Object.values(this.nodes).forEach(hex => {
            for (let a = 0; a < array.length; a++) {
                if (hex.pc == array[a]) {
                    console.log(hex.self['node'].classList)
                    if (hex.self['node'].classList.contains(`${oppo}`)) {
                        hex.self['node'].classList.remove(`${oppo}`);
                        hex.self.addClass('both');
                    }
                    else {
                        hex.self.addClass(`${spec}`);
                    }
                }
            }
        })
    }
    /**
     * Draws an interval cycle on the Tonnetz.
     * @param {int} terms number of elements to highlight
     * @param {int} start PC within universe
     * @param  {...int} ints OPCIs within universe
     */
    this.intervalCycle = (terms = 12,start = 0,...ints) => {
        let inds = [start];
        for (let a = 0; a < terms; a++) {
            let curr = ints[a%ints.length];
            inds.push((inds[a]+curr)%TuningSystems[this.tuning].universe);
        }
        console.log(inds)
        this.highlightPCs(inds);
    }
    /**
     * Resets the tonnetz to default.
     */
    this.resetTonnetz = (initial = false) => {
        document.querySelectorAll('.sel,.active,.sel1,.active1,.sel2,.active2,.sel3,.active3,.sel4,.active4').forEach(node => {
            if (initial == true) {
                node.classList.remove('sel','active');
            }
            node.classList.remove('sel1','active1','sel2','active2','sel3','active3','sel4','active4');
        })
    }
    /**
     * 
     * @param {string} start C+
     * @param  {...any} operations instance of UTT, 'L','R',...etc. or <-,4,8>;
     * @returns 
     */
    this.highlightCycle = (start = this.selectedTriad,...operations) => {
        /**
         * Remove previous applied classes.
         */
        this.resetTonnetz();
        let cyc = new Cycle(start,...operations);
        cyc['result'].forEach(entry => {
            this.selectAll(entry,false,this.previous);
            parity = (parity+1)%operations.length;
            console.log(`PARITY: ${parity}`);
        })
        console.table(cyc['result']);
        this.previous = null;
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
 * 
 * @param {} str 
 * @returns 
 */
const uttJoiner = (str) => {
    str = str.split(',');
    let fix = [];
    let i = 0;
    while (i < str.length) {
        if (str[i][0] == '<') {
            fix.push([str[i],str[i+1],str[i+2]].join(','));
            i+=3;
        }
        else {
            fix.push(str[i].toUpperCase());
            i++;
        }
    }
    return fix;
}

/**
 * Chords found in Pareidolia...requires 31-EDO layout.
 */
const PareidoliaA = {
    'chords': [[0,5,18,23],[10,14,22,27],[0,5,14,18],[18,22,0,6],[10,18,22,0],[22,27,5,10],[6,10,18,22],[5,10,18,23],[18,27,5,6],[18,22,27,6]],
    'superset': Array.from(new Set([[0,5,18,23],[10,14,22,27],[0,5,14,18],[18,22,0,6],[10,18,22,0],[22,27,5,10],[6,10,18,22],[5,10,18,23],[18,27,5,6],[18,22,27,6]].flat()))    
}
const PareidoliaB = {
    'chords': [[22,27,4,9],[14,18,27,0],[4,9,18,22],[10,14,22,26],[10,18,27],[10,18,22,0],[26,0,10,14],[14,22,27,0],[14,18,27,4],[14,27,0],[22,27,4,10]],
    'superset': Array.from(new Set([[22,27,4,9],[14,18,27,0],[4,9,18,22],[10,14,22,26],[10,18,27],[10,18,22,0],[26,0,10,14],[14,22,27,0],[14,18,27,4],[14,27,0],[22,27,4,10]].flat()))
}
document.addEventListener('DOMContentLoaded',() => {
    D = new LatticeManager('drawing','Triadic');
    // D.buildLattice();
    /**
     * Nested Dropdown...
     */
    Y = new MyDropdown('universe','Tuning System',() => {
        D.tuning = Y.value;
        document.querySelector('#tuning').textContent = `${Y.value}`;
        document.querySelector('#structure').innerHTML = '';
            Z = new MyDropdown('structure','Layout',() => {
                if (D.tuning == '12-EDO' && Z.value.name == 'Triadic') {
                    document.querySelector('#tBox').classList.remove('void');
                }
                D.structure = Z.value;
                D.buildLattice();
            });
        Object.entries(TonnetzStructure[D.tuning]).forEach(([key,value]) => {
            Z.addOption(key,value,`<${value.axes}>`);
        })
        Z.construct();
    });
    Object.keys(TuningSystems).forEach(entry => {
        Y.addOption(entry,entry);
    });
    Y.construct();
    /**
     * Allows selecting of hex nodes. Useful if isomorphic keyboard functionality fleshed out.
     */
    document.querySelector('#drawing').addEventListener('mousedown',(event) => {
        let sel = event.target.closest('.hexNode');
        console.log(sel);
        if (sel.classList.contains('wham')) {
            sel.classList.remove('wham');
        }
        else {
            sel.classList.add('wham');
        }
    })
    /**
     * Event listener for transform input.
     */
    let inp = document.querySelector('#tBox > input')
    inp.addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            if (D.selectedTriad !== null) {
                console.log(`Cycle Start: ${D.selectedTriad}`);
                D.highlightCycle(D.selectedTriad,...uttJoiner(inp.value));
            }
            else {
                alert(`Select a starting triad on the tonnetz!`);
            }
        }
    })
})