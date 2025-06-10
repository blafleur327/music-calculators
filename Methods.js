
/**
 * Module containing array methods.
 */
AdvancedArray = {
    /**
     * Rotates a 1D array.
     * @param {array} array 1D array
     * @param {int} index index of rotation || if undefined, return object of all rotations.
     * @param {boolean} object
     * @returns Object || Array
     */
    rotation: (array,index = undefined,object = true) => {
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
            return object? res : Object.values(res);
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
    },
    /**
     * Returns the common elements in two arrays.
     * @param {array} array1 
     * @param {array} array2 
     * @param {bool} percent
     * @returns array || float
     */
    commonElements: (array1,array2,percent = false) => {
        let result = [];
        let lenSort = [array1,array2].sort((a,b) => a.length - b.length);
        lenSort[1].forEach(item => {
            lenSort[0].indexOf(item) !== -1? result.push(item) : null;
        }) 
        return percent? result.length/lenSort[1].length : result;
    },
    /**
     * Determines if the two input arrays have a subset/superset relation or are equal.
     * @param {array} array1 
     * @param {array} array2 
     * @returns Boolean
     */
    isSubsetOrEqual: (array1,array2) => {
        let lenSort = [array1,array2].sort((a,b) => a.length - b.length);
        return Array.from(new Set(lenSort.flat())).length == lenSort[1].length;
    }
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

document.addEventListener('DOMContentLoaded',() => {
    console.log('LOADED');
    // document.querySelector('h1')['data-tooltip'] = 'AHAHAH';
    document.getElementById('card').addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            console.time(`Size ${parseInt(document.getElementById('card').value)}:`);
            document.getElementById('result').innerHTML = '';
            let start = performance.now();
            let X = PCSetTheory.listSetClasses(parseInt(document.getElementById('card').value));
            for(let [key,value] of Object.entries(X)) {
                let uhOh = document.createElement('div');
                let info = document.createElement('div');
                info.classList.add('labels');
                uhOh.classList.add('semiCont');
                uhOh.id = `${key}-chords`;
                let card = document.createElement('h3');
                card.innerHTML = `Size: ${key}`;
                let extra = document.createElement('p');
                extra.innerHTML = `Entries: ${value.length}`;
                info.append(card);
                info.append(extra);
                uhOh.append(info);
                let list = document.createElement('ol');
                value.forEach(sub => {
                    let duh = document.createElement('li');
                    let val = list.childNodes.length+1;
                    duh.innerHTML = `(${sub})`;
                    duh.classList.add('hoverable');
                    duh['data-tooltip'] = `BE Number: ${key}-${val}<br>ICV: <${PCSetTheory.intervalClassVector(sub,parseInt(document.getElementById('card').value))}><br></$>`;
                    list.appendChild(duh);
                })
                uhOh.append(list);
                document.getElementById('result').append(uhOh);
            }
            let end = performance.now();
            document.getElementById('time').innerHTML = `Completed in ${(end-start).toFixed(2)} ms.`;
        }
    })
    // document.addEventListener('mousedown',(event) => {
    //     if (event.target.classList[0] == 'hoverable') {
    //         let converted = event.target.innerHTML.match(/[0-9]+/ig).map(x => parseInt(x));
    //         alert(`Prime Form: (${converted})\rICV: <${PCSetTheory.intervalClassVector(converted,parseInt(document.getElementById('card').value))}>`);
    //     }
    // })
    let st = document.getElementsByTagName('strong')[0]
    st['data-tooltip'] = 'This process requires at least O(2^n) to generate the possible combinations, these are then all put into prime form, then filtered for uniqueness. These numbers get extremely big very quickly. ie 2^12 = 4096,...2^20 = 1,048,576. These do not represent the total calculations, but rather the total combinations to be placed into prime form, then filtered. For reference the list for 12 can be generated in under .2s, 20 takes about one minute, the process scales exponentionally, not linearly!';
    mouseTracking();
})

//Modern Mandolin Quartet Album



