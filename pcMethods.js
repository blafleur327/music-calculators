// import * as Tone from "tone";

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

        let v = (1n << BigInt(k)) - 1n;
        let limit = 1n << BigInt(n);

        while (v < limit) {
            let subset = [];
            for (let i = 0; i < n; i++) {
                if (v & (1n << BigInt(i))) {
                    subset.push(array[i]);
                }
            }
            yield subset;

            // Gosper's hack with BigInt
            let c = v & -v;
            let r = v + c;
            v = (((r ^ v) / c) >> 2n) | r;
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
 * Create an instance of a PCset object. Includes various PCset theoretical and scale theoretical methods.
 * @param {int} modulus 
 * @param  {...int} pcs 
 */
export function PCset(modulus,...pcs) {
    this.pcs = Array.from(new Set(pcs));
    this.cardinality = this.pcs.length;
    this.universe = modulus;
    /**
     * Returns the factors/divisors of an input.
     * @param {int} a 
     * @returns 
     */
    const factor = (a) => {
        let res = [];
        for (let i = 0; i <= Math.sqrt(a); i++) {
            if (a%i == 0) {
                res.push(a/i,i);
            }
        }
        return Array.from(new Set(res));
    }
    /**
     * 
     * @param {int} a 
     * @param {int} b 
     */
    const coprime = (a,b) => {
        let aFact = new Set(factor(a));
        let bFact = new Set(factor(b));
        return Math.max(...Array.from(aFact.intersection(bFact))) == 1;
    }
    /**
     * Correctly return the result of a number mod n.
     * @param {int} value 
     * @param {int} modulus 
     */
    const modulo = (value,modulus = 12) => {
        return value >= 0? value%modulus : ((value%modulus)+modulus)%modulus;
    }
    /**
     * Transpose this.pcs by a given index. (Tn)
     * @param {int} index 
     * @returns 
     */
    this.transpose = (index = 1) => {
        return this.pcs.map(x => (x+=index)%this.universe);
    }
    /**
     * Invert this.pcs about the 0-1/2k axis then transpose by the provided index. (TnI)
     * @param {int} index 
     * @returns 
     */
    this.invert = (index = 0) => {
        return this.pcs.map(x => ((x*=this.universe-1)+index)%this.universe);
    }
    /**
     * Returns the simple multiplication product of this.pcs.
     * @param {int} index 
     * @param {boolean} allowInjection
     * @returns 
     */
    this.multiply = (index,allowInjection = false) => {
        // let valid = coprime(this.universe,index);
        let option = Array.from(new Set(this.pcs.map(x => (x*=index)%this.universe)));
        if (allowInjection) {
            return this.pcs.map(x => (x*=index)%this.universe)
        }
        else {
            return this.pcs.length == option.length? option : 'Injection!'
        }
    }
    /**
     * Generate the set class of this.pcs. That is the entire Tn/TnI group.
     * @returns Object
     */
    this.setClass = () => {
        let result = {};
        for (let a = 0; a < this.universe; a++) {
            result[`T${a}`] = this.transpose(a);
            result[`T${a}I`] = this.invert(a);
        }
        return result;
    }
    /**
     * Returns the interval class vector of the input. That is the number of invariant tones under a given Tn operation.
     * @param {boolean} object 
     * @returns Object || Array
     */
    this.intervalClassVector = (object = false) => {
        let result = {};
        let comp = [];
        for (let a = 0; a < this.pcs.length; a++) {
            for (let b = a+1; b < this.pcs.length; b++) {
                let poss = modulo(this.pcs[b]-this.pcs[a],this.universe);
                //Choose the smaller option.
                comp.push(poss <= Math.floor(this.universe/2)? poss : this.universe-poss);
            }
        }
        for (let c = 1; c <= Math.floor(this.universe/2); c++) {
            result[c] = 0;
        }
        comp.forEach(entry => {
            result[entry]++;
        })
        return object? result : Object.values(result);
    }
    /**
     * Returns the index vector of this.pcs. That is the number of invariant tones under a given TnI operation.
     * @param {boolean} object 
     * @returns Object || Array
     */
    this.indexVector = (object = false) => {
        let res = {};
        let comp = [];
        this.pcs.forEach(elem => {
            this.pcs.forEach(sub => {
                comp.push(modulo(elem+sub,this.universe));
            })
        })
        for (let a = 0; a < this.universe; a++) {
            res[a] = 0;
        }
        comp.forEach(entry => {
            res[entry]+=1;
        })
        return object? res : Object.values(res);
    }
    /**
     * Returns the normal order of this.pcs. That is the most compact rotation of the ascending numerical order.
     */
    this.normalOrder = () => {
        let sor = this.pcs.sort((a,b) => a-b);
        let rots = [];
        //Get rotations of sorted set.
        for (let a = 0; a < this.pcs.length; a++) {
            rots.push([...sor.slice(a),...sor.slice(0,a)]);
        }
        let i = sor.length-1;
        let check = [];
        while (rots.length > 1 && i >= 0) {
            rots.forEach(rot => {
                check.push(modulo(rot[i]-rot[0],this.universe));
            })
            let small = Math.min(...check);
            rots = rots.filter(x => modulo(x[i]-x[0],this.universe) == small);
            check = [];
            i--;
        }
        return rots[0];
    }
    /**
     * Returns the prime form of this.pcs. That is the most compact from left to right (Straus-Rahn) between the normal form and its inversion then transposed to start on 0.
     * @returns Array
     */
    this.primeForm = () => {
        //Normal form of original and the inversion.
        let opts = [this.normalOrder(),new PCset(this.universe,...this.invert()).normalOrder()];
        let i = 1;
        while (i < this.pcs.length && opts.length == 2) {
            let win = Math.min(modulo(opts[0][i]-opts[0][i-1],this.universe),modulo(opts[1][i]-opts[1][i-1],this.universe));
            opts = opts.filter(x => modulo(x[i]-x[i-1],this.universe) == win);
            i++;
        }
        return opts[0].map(x => (modulo(x-opts[0][0],this.universe)));
    }
    /**
     * Returns an ordered tuple [a,b] where a is the number of self-mapping Tn operations and b is the number of self-mapping TnI operations.
     * @returns 
     */
    this.degreeOfSymmetry = () => {
        let res = [0,0];
        let comp = this.pcs.sort((a,b) => a-b).join(',');
        let sc = Object.entries(this.setClass());
        sc.forEach(([key,value]) => {
            if (comp == value.sort((a,b) => a-b).join(',')) {
                /[I]+/ig.test(key)? res[1]++ : res[0]++;
            }
        })
        return res;
    }
    /**
     * The number of unique members of the Tn/TnI group in this set class.
     * @returns 
     */
    this.distinctForms = () => {
        let temp = this.degreeOfSymmetry();
        return (this.universe*2)/temp.reduce((a,b) => a+=b);
    }
    /**
     * Determines if this.pcs is maximally even. That is that the elements are as dispersed as possible within the given modulus. (As close to an equilateral polygon as possible.)
     * @returns 
     */
    this.maximallyEven = () => {
        let check = new Array(this.pcs.length).fill(0,0,this.pcs.length).map((a,b) => a+=b).map(x => Math.floor((x*this.universe)/this.pcs.length)%this.universe);
        let checkPf = new PCset(this.universe,...check).primeForm().join(',');
        let meStatus = checkPf == this.primeForm().join(',');
        return meStatus;
    }
    /**
     * Determines the well-formedness status of this.pcs in accordance with Scale Theory (Carey, Clampitt)
     * @returns Object
     */
    this.wellFormed = () => {
        let result = {
            'Well-Formed': false,
            'Generators': undefined,
            'Degenerate': undefined,
        };
        let fill = new Array(this.pcs.length).fill(1,0,this.pcs.length).map((a,b) => a+=b);
        let sc = Object.values(this.setClass());
        for (let a = 1; a < this.universe; a++) {
            let res = Array.from(new Set(fill.map(x => modulo(x*a,this.universe))));
            if (res.length == this.pcs.length) {
                sc.forEach(entry => {
                    if (Array.from(new Set(res).intersection(new Set(entry))).length == this.pcs.length) {
                        result['Well-Formed'] = true;
                        result['Generators'] = [this.universe-a,a];
                        result['Degenerate'] = coprime(a,this.universe) == false;
                    }
                })
            }
        }
        return result;
    }
    /**
     * Returns the opposing elements of the input set.
     */
    this.complement = () => {
        let opts = new Array(this.universe).fill(0,0,this.universe).map((i,j) => i+=j);
        return opts.filter(x => this.pcs.indexOf(x) == -1);
    }
    /**
     * Returns the axes of symmetry for this set.
     */
    this.symmetry = () => {
        let res = [];
        let init = this.pcs.sort((r,s) => r-s).reduce((f,k) => f+'|'+k);
        console.log(init);
        for (let a = 0; a < this.universe; a++) {
            let opt = this.invert(a).sort((i,j) => i-j).reduce((l,m) => l+'|'+m);
            console.log(opt);
            opt == init? res.push([a/2,(a/2)+(this.universe/2)]): null;
        }
        return res;
    }
    /**
     * Returns the members of this.setClass that are contained within the given superset.
     * @param {array} superset 
     * @returns 
     */
    this.contained = (superset) => {
        //console.log(`[${this.pcs.join(',')}] instances in {${superset.join(',')}}`)
        let result = {};
        let bigRef = new Set(superset);
        let ct = 0;
        Object.entries(this.setClass()).forEach(([key,value]) => {
            if (bigRef.isSupersetOf(new Set(value)) == true && value.length > 0) {
                //console.log(`${value.join(',')} is conatined within ${superset.join(',')}`)
                result[key] = value;
                ct++;
            }
        });
        return ct > 0? result : undefined;
    }
    /**
     * Converts the pcs to a different modulus.
     * @param {int} universeOut 
     * @returns 
     */
    this.modulusConvert = (universeOut) => {
        return new PCset(universeOut,...this.pcs.map(element => Math.round((element*universeOut)/this.universe)));
    }
}
/**
 * Create an object instance with methods useful for serialism.
 * @param {int} modulus 
 * @param  {...int} elements 
 */
export function Serialism(modulus,...elements) {
    this.series = elements;
    this.universe = modulus;
     /**
     * Directly generate subsets of size n given an input array.
     * @param {array} array 
     * @param {int} cardinality 
     */
    function* cardinal_specific_subsets(array,cardinality) {
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
    }
    /**
     * Correctly return the result of a number mod n.
     * @param {int} value 
     * @param {int} modulus 
     */
    this.modulo = (value,modulus = 12) => {
        return value >= 0? value%modulus : ((value%modulus)+modulus)%modulus;
    }
    /**
     * Returns the factors/divisors of an input.
     * @param {int} a 
     * @returns 
     */
    this.factor = (a) => {
        let res = [];
        for (let i = 0; i <= Math.sqrt(a); i++) {
            if (a%i == 0) {
                res.push(a/i,i);
            }
        }
        return Array.from(new Set(res));
    }
    /**
     * Partition an array into n-sizes.
     * @param {array} array 
     * @param {int} size 
     */
    this.partition = (array,size) => {
        let res = [];
        if (this.factor(array.length).indexOf(size) > -1) {
            for (let a = 0; a < array.length/size; a++) {
                let start = a*size;
                res.push(array.slice(start,start+size));
            }
            return res;
        }
        else {
            console.error(`Array is of length ${array.length}, cannot partition into subarrays of size ${size}!`);
        }
    }
    /**
     * All row forms using the four primary serial operators {P,I,R,RI}.
     */
    this.rowClass = {};
    for (let a = 0; a < this.universe; a++) {
        let off = this.series[0];
        this.rowClass[`P${a}`] = this.series.map(x => this.modulo((x-off)+a,this.universe));
        this.rowClass[`R${a}`] = this.series.map(x => this.modulo((x-off)+a,this.universe)).reverse();
        this.rowClass[`I${a}`] = this.series.map(x => this.modulo(a+(this.universe-(x-off)),this.universe));//?
        this.rowClass[`RI${a}`] = this.series.map(x => this.modulo(a+(this.universe-(x-off)),this.universe)).reverse();
    }
    /**
     * Builds a standard matrix of the input series. Optionally start on 0.
     * @param {boolean} zeroCentered 
     * @returns 
     */
    this.tMatrix = (zeroCentered = false) => {
        /**
         * The inverted row for the P-indices.
         */
        let init = this.rowClass[zeroCentered? 'I0' : `I${this.series[0]}`];
        let mat = init.map(x => this.rowClass[`P${x}`]);//FAILS FOR DUPLICATES!
        // console.table(mat);
        return mat;
    }
    /**
     * Determines if the series is derived. That is that the series is comprised of discrete n-chords that are all members of the same set class.
     * @returns Object || false
     */
    this.derivation = () => {
        let facts = this.factor(this.series.length).sort((a,b) => a-b).filter(x => x > 1 && x !== this.series.length);
        let res = {};
        facts.forEach(divisor => {
            let slices = this.partition(this.series,divisor);
            let init = null;
            let pfs = [];
            //Check the prime form of each partition.
            slices.forEach(partition => {
                let pf = new PCset(this.universe,...partition).primeForm();
                init = pf;
                pfs.push(pf.join(','));
            })
            //If all partitions are same.
            if (Array.from(new Set(pfs)).length == 1) {
                res[init.length] = init;
            }
        })
        return Object.keys(res).length? res : false;
    }
    /**
     * Determines if this.series is all interval (OPCI) or not.
     * @returns 
     */
    this.allInterval = () => {
        let ints = [];
        for (let a = 1; a < this.series.length; a++) {
            ints.push(this.modulo(this.series[a]-this.series[a-1],this.universe));
        }
        return Array.from(new Set(ints)).length == this.universe-1? ints : false
    }
    /**
     * Returns the combinatorial levels of a given series and row form. That is the first n-chords of a multiple row forms combine to form an aggregate.
     * @param {string} form {Pn, In, Rn, RIn}
     * @returns Object
     */
    this.combinatoriality = (form = 'P0') => {
        let facts = this.factor(this.series.length).filter(x => x !== 1 && x !== this.series.length).sort((a,b) => a-b);
        console.log(`factors: ${facts}`);
        let row = this.rowClass[form];
        let res = {};
        //Check unorded n-chords in this.rowClass
        facts.forEach(divisor => {
            console.log(`FACTOR: ${divisor}`);
            //All but the first n-chord.
            let test = this.partition(row,divisor).map(x => x.sort((a,b) => a-b).join(','));
            let validPairs = {};
            //Check all entries in rowClass.
            Object.entries(this.rowClass).forEach(([key,value]) => {
                let opt = this.partition(value,divisor).map(x => x.sort((a,b) => a-b).join(','));
                if (Array.from(new Set(test).intersection(new Set(opt))).length == test.length && test.indexOf(opt[0]) > 0) {
                    validPairs[key] = opt[0];
                }
            })
            // console.table(validPairs)
            /**
             * Validate that the entire aggregate can be constructed from viable forms.
             */

            // console.log(Array.from(new Set([...Object.values(validPairs),test[0]].join(',').match(/[0-9]+/ig))));
            if (Array.from(new Set([...Object.values(validPairs),test[0]].join(',').match(/[0-9]+/ig))).length == this.series.length) {
                // console.log(`GROUPS OF SIZE ${divisor} CAN FORM AGGREGATES`)
                res[divisor] = [];
                let requiredSize = (this.series.length/divisor);
                //Pair up keys. Exploits Gosper's Hack.
                let test2 = [...Combinatorics.cardinal_specific_subsets([form,...Object.keys(validPairs)],requiredSize)].filter(x => x.indexOf(form) > -1);
                test2.forEach(group => {
                    let pass = [];
                    group.forEach(key => {
                        pass.push(key == form? test[0] : validPairs[key]);
                    })
                    if (Array.from(new Set(pass)).length == requiredSize) {
                        // console.log(`Size${divisor}- keys: ${group} : ${JSON.stringify(Array.from(new Set(pass)))}`)
                        res[divisor].push(group);
                    }
                })
            }
            else {
                console.log(`NO GROUPS OF SIZE ${divisor} CREATE AN AGGREGATE!`)
            }
        })
        return res;
    }
    /**
     * Determines if the given row forms share elements in specific order positions.
     * @param  {...string} forms {Pn,Rn,In,RIn}
     * @returns Array of ordinal positions
     */
    this.ordinalInvariance = (...forms) => {
        let res = [];
        for (let a = 0; a < this.rowClass[forms[0]].length; a++) {
            let tru = [];
            forms.forEach(rowform => {
                // console.log(`${rowform}: <${this.rowClass[rowform]}>`);
                tru.push(this.rowClass[rowform][a]);
            })
            console.log(`${tru} all same? : ${Array.from(new Set(tru)).length == 1}`);
            Array.from(new Set(tru)).length == 1? res.push(a) : null;
        }
        return res;
    }
}

/**
 * Equivalent to Python's print method.
 * @param {any} method 
 */
const print = (method) => {
    console.log(method);
}

/**
 * Shuffles the elements in the input array.
 * @param {array} array 
 * @param {array} result 
 * @returns 
 */
const shuffle = (array,result = []) => {
    if (array.length > 0) {
        let index = Math.floor(Math.random()*array.length);
        result.push(array[index]);
        array = [...array.slice(0,index),...array.slice(index+1)];
        return shuffle(array,result);
    }
    else {
        return result;
    }
}

//Flat = String.fromCharCode(0xed32);
//Sharp = String.fromCharCode(0xed36);
//Semiflat = String.fromCharCode(0xe443); -1
//Semisharp = String.fromCharCode(0xe444); +1
//Quasi Slur = String.fromCodePoint(0x1d1a4);
//Doublesharp = String.fromCodePoint(0xe263);
//Doubleflat = String.fromCodePoint(0xe264);
//3/4 flat = String.fromCodePoint(0xe281);
//3/4 sharp = String.fromCodePoint(0xe283);

//32nd = String.fromCodePoint(0x1d162);
//16th = String.fromCodePoint(0x1d161);
//8th = String.fromCodePoint(0x1d160);
//Quarter = String.fromCodePoint(0x1d15f)
//Half = String.fromCodePoint(0x1d15e);
//Whole = String.fromCodePoint(0x1d15d);


/**
 * Object storing vairous optional display elements.
 */
export const DisplayTypes = {
    /**
     * Defined Pitch Systems. Only viable options for showing note names.
     */
    'pitch': {
        '7': [
                'Do','Re','Mi','Fa','Sol','La','Ti'
        ],
        '12': [
                'C',`C${String.fromCodePoint(0xed36)}/D${String.fromCodePoint(0xed32)}`,'D',`D${String.fromCodePoint(0xed36)}/E${String.fromCodePoint(0xed32)}`,'E','F',
                `F${String.fromCodePoint(0xed36)}/G${String.fromCodePoint(0xed32)}`,`G`,`G${String.fromCodePoint(0xed36)}/A${String.fromCodePoint(0xed32)}`,`A`,
                `A${String.fromCodePoint(0xed36)}/B${String.fromCodePoint(0xed32)}`,'B'
            ],
        '19': [
                `C`,`C${String.fromCodePoint(0xed36)}`,`D${String.fromCodePoint(0xed32)}`,`D`,`D${String.fromCodePoint(0xed36)}`,`E${String.fromCodePoint(0xed32)}`,
            `E`,`E${String.fromCodePoint(0xed36)}`,`F`,`F${String.fromCodePoint(0xed36)}`,`G${String.fromCodePoint(0xed32)}`,`G`,`G${String.fromCodePoint(0xed36)}`,`A${String.fromCodePoint(0xed32)}`,`A`,`A${String.fromCharCode(0xed36)}`,
            `B${String.fromCodePoint(0xed32)}`,`B`,`B${String.fromCodePoint(0xed36)}`
            ],
        '24': [
                `C`,`C${String.fromCodePoint(0xe444)}`,`C${String.fromCodePoint(0xed36)}/D${String.fromCodePoint(0xed32)}`,`D${String.fromCharCode(0xe443)}`,`D`,`D${String.fromCharCode(0xe444)}`,`D${String.fromCharCode(0xed36)}/E${String.fromCharCode(0xed32)}`,`E${String.fromCharCode(0xe443)}`,
                `E`,`E${String.fromCodePoint(0xe444)}`,`F`,`F${String.fromCodePoint(0xe444)}`,`F${String.fromCodePoint(0xed36)}/G${String.fromCharCode(0xed32)}`,`G${String.fromCharCode(0xe443)}`,`G`,`G${String.fromCharCode(0xe444)}`,`G${String.fromCharCode(0xed36)}/A${String.fromCharCode(0xed32)}`,
                `A${String.fromCodePoint(0xe443)}`,`A`,`A${String.fromCodePoint(0xe444)}`,`A${String.fromCodePoint(0xed36)}/B${String.fromCharCode(0xed32)}`,`B${String.fromCharCode(0xe443)}`,`B`,`B${String.fromCharCode(0xe444)}`
            ],
        // '31': [
        //         `C`,`C${String.fromCodePoint(0xe444)}`,`C${String.fromCharCode(0xed36)}`,`D${String.fromCodePoint(0xed32)}`,`D${String.fromCharCode(0xe443)}`,'D',
        //         `D${String.fromCodePoint(0xe444)}`,`D${String.fromCodePoint(0xed36)}`,
        //         `E${String.fromCodePoint(0xed32)}`,`E${String.fromCodePoint(0xe443)}`,`E`,`E${String.fromCharCode(0xe444)}`,`E${String.fromCharCode(0xed36)}`,
        //         `F`,`F${String.fromCharCode(0xe444)}`,`F${String.fromCharCode(0xed36)}`,
        //         `G${String.fromCodePoint(0xed32)}`,`G${String.fromCharCode(0xe443)}`,`G`,`G${String.fromCharCode(0xe444)}`,`G${String.fromCharCode(0xed36)}`,
        //         `A${String.fromCodePoint(0xed32)}`,`A${String.fromCharCode(0xe443)}`,'A',`A${String.fromCharCode(0xe444)}`,`A${String.fromCharCode(0xed36)}`,
        //         `B${String.fromCodePoint(0xed32)}`,`B${String.fromCharCode(0xe443)}`,`B`,`C${String.fromCodePoint(0xed32)}`,`C${String.fromCharCode(0xe443)}`
        // ],
        '31': [
                `C`,`D${String.fromCodePoint(0xe264)}/C${String.fromCodePoint(0xe444)}`,`C${String.fromCharCode(0xed36)}/D${String.fromCodePoint(0xe281)}`,`D${String.fromCodePoint(0xed32)}/C${String.fromCodePoint(0xe283)}`,`C${String.fromCodePoint(0xe263)}/D${String.fromCharCode(0xe443)}`,'D',
                `E${String.fromCodePoint(0xe264)}/D${String.fromCodePoint(0xe444)}`,`D${String.fromCodePoint(0xed36)}/E${String.fromCodePoint(0xe281)}`,
                `E${String.fromCodePoint(0xed32)}/D${String.fromCodePoint(0xe283)}`,`D${String.fromCodePoint(0xe263)}/E${String.fromCodePoint(0xe443)}`,`E`,`F${String.fromCharCode(0xed32)}/E${String.fromCharCode(0xe444)}`,`E${String.fromCharCode(0xed36)}/F${String.fromCharCode(0xe443)}`,
                `F`,`G${String.fromCodePoint(0xe264)}/F${String.fromCharCode(0xe444)}`,`F${String.fromCharCode(0xed36)}/G${String.fromCodePoint(0xe281)}`,
                `G${String.fromCodePoint(0xed32)}/F${String.fromCodePoint(0xe283)}`,`F${String.fromCodePoint(0xe263)}/G${String.fromCharCode(0xe443)}`,`G`,`A${String.fromCodePoint(0xe264)}/G${String.fromCharCode(0xe444)}`,`G${String.fromCharCode(0xed36)}/A${String.fromCodePoint(0xe281)}`,
                `A${String.fromCodePoint(0xed32)}/G${String.fromCodePoint(0xe283)}`,`G${String.fromCodePoint(0xe263)}/A${String.fromCharCode(0xe443)}`,'A',`B${String.fromCodePoint(0xe264)}/A${String.fromCharCode(0xe444)}`,`A${String.fromCharCode(0xed36)}/B${String.fromCodePoint(0xe281)}`,
                `B${String.fromCodePoint(0xed32)}/A${String.fromCodePoint(0xe283)}`,`A${String.fromCodePoint(0xe263)}/B${String.fromCharCode(0xe443)}`,`B`,`C${String.fromCodePoint(0xed32)}/B${String.fromCharCode(0xe444)}`,`B${String.fromCharCode(0xed36)}/C${String.fromCharCode(0xe443)}`
        ]
    },
    /**
     * Defined rhythm/durational values. Primarily used for Boulez/Messiaen.
     */
    'rhythm': {
        '8': [
            '1','&','2','&','3','&','4','&'
        ],
        '12': [
            `${String.fromCodePoint(0x1d162)}`,String.fromCodePoint(0x1d161),`${String.fromCodePoint(0x1d161)}.`,
            `${String.fromCodePoint(0x1d160)}`,`${String.fromCodePoint(0x1d161)}.${String.fromCodePoint(0x1d1a4)}${String.fromCodePoint(0x1d161)}`,
            `${String.fromCodePoint(0x1d161)}.${String.fromCodePoint(0x1d1a4)}${String.fromCodePoint(0x1d161)}.`,`${String.fromCodePoint(0x1d160)}${String.fromCodePoint(0x1d1a4)}${String.fromCodePoint(0x1d161)}.`,
            `${String.fromCodePoint(0x1d15f)}`,`${String.fromCodePoint(0x1d15f)}${String.fromCodePoint(0x1d1a4)}${String.fromCodePoint(0x1d162)}`,`${String.fromCodePoint(0x1d15f)}${String.fromCodePoint(0x1d1a4)}${String.fromCodePoint(0x1d161)}`,
            `${String.fromCodePoint(0x1d15f)}${String.fromCodePoint(0x1d1a4)}${String.fromCodePoint(0x1d161)}.`,`${String.fromCodePoint(0x1d15f)}.`
        ],
        '16': [
            '1','e','&','u','2','e','&','u','3','e','&','u','4','e','&','u'
        ]
    }
}

/**
 * Stores cET of various intervals.
 * @type {Object.<string,number>}
 */
export const IntervalLookup = {
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
        'Quarter-Tone': 50,
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
        'Wolf 5th': 737.6372868717053,
    }
}

/**
 * Uses IntervalLookup to find the nearest interval in cET.
 * @param {float} cents 
 */
export const findIntervals = (cents = 100) => {
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
 * Method for automatically building mousefollowing tooltips.
 */
export const mouseTracking = () => {
    console.log('Mouse Tracking Started.');
    let par = document.createElement('div');
    par.id = `toolbox`;
    par.classList.add('void');
    par.style.position = 'absolute';
    par.style.backgroundColor = 'lightgrey';
    par.style.border = '.1em solid grey';
    par.style.maxWidth = '15em';
    document.body.appendChild(par);
    let bound = [window.scrollX+window.innerWidth,window.scrollY+window.innerHeight];
    document.addEventListener('mousemove',(event) => {
        let offset = [10,10];
        let location = [event.pageX+offset[0],event.pageY+offset[1]];
        par.style.left = `${location[0]}px`;
        par.style.top = `${location[1]}px`;
        if (event.target.dataset.tooltip !== undefined || event.target.parentElement.dataset.tooltip !== undefined) {
            par.innerHTML = `${event.target.dataset.tooltip? event.target.dataset.tooltip : event.target.parentElement.dataset.tooltip}`;
            par.classList.remove('void');
        }
        else {
            par.classList.add('void');
            par.innerHTML = '';
        }
    })
}

/**
 * Builds a custrom dropdown menu. Be sure to include CSS.
 * @param {string} parent id of parent element
 * @param {string} name Dropdown name to be displayed
 * @param {function} method functon to call upon selection
 * @param {...any} args arguments for callback function
 */
export function MyDropdown(parent,name,method) {
    this.parent = parent;
    this.name = name;
    this.options = {};
    this.value = null;
    this.entangled = [];
    this.method = method;
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
        let styleReferent = document.styleSheets[0];
        /**
         * Manually set the style elements needed for dropdown. 
         */
        styleReferent.insertRule('.primary {background-color:rgb(144, 144, 208); position:relative; min-width:15%; border: 1px solid grey;}');
        styleReferent.insertRule('.parent {display:flex; flex-direction:row;}');
        styleReferent.insertRule('.stor {visibility:hidden; display:flex; flex-direction:column; position:absolute; width:99%; max-height:20em; overflow-y:auto; overflow-x:hidden; border:1px solid black;}');
        styleReferent.insertRule('.primary:hover {background-color:rgb(100, 100, 208); cursor:pointer;}');
        styleReferent.insertRule('.primary:hover > .stor {visibility: visible;}');
        styleReferent.insertRule('.myOption {background-color:rgb(198, 198, 198); text-align:center; width: 100%; height:2em; line-height:2em; box-sizing:border-box;border: 1px solid grey;}');
        styleReferent.insertRule('.myOption:hover {background-color:rgb(59, 59, 59); color:white; transform: scale(1.1); overflow:visible;}'); 
        styleReferent.insertRule('.ddownSelect {background-color:rgb(63, 63, 63) !important; color:white;}');       
        ////
        let pad;
        /**
         * Check if parent already has a div present.
         */
        if (document.querySelector(`#${this.name}`)) {
            pad = document.querySelector(`#${this.name}`);
            console.log('DIV PRESENT!');
        }
        else {
            pad = document.createElement('div');
            console.log('DIV NOT HERE!');
        }
        pad.id = `${this.name}`;
        pad.classList.add('primary');
        pad.innerHTML = `${name}`;
        let drawer = document.createElement('div');
        drawer.classList.add('stor');
        let decon = Object.entries(this.options);
        if (decon.length !== 0) {
            // console.table(decon)
            for (let [key,value] of decon) {
                let single = document.createElement('div');
                single.classList.add('myOption');
                single.innerHTML = key;
                single['data-tooltip'] = value.tooltip;
                drawer.appendChild(single);
                value.self = single;
            }
            /**
             * Click functionality.
             */
            drawer.addEventListener('mousedown',(event) => {
                let find = event.target.closest('.myOption');
                let sel = this.options[find.innerHTML];
                if (find.classList.contains('ddownSelect')) {
                    find.classList.remove('ddownSelect');
                    sel.selected = false;
                }
                else {
                    find.classList.add('ddownSelect');
                    sel.selected = true;
                    this.value = sel.value;
                    sel.self.classList.add('ddownSelect');
                }             
                this.method? this.method(sel.value) : null;
                /**
                 * If entangled elements exist, set their value to the newly selected value.
                 */
                if (this.entangled.length > 0) {
                    this.entangled.forEach(twin => {
                        twin.deselect();
                        twin.value = sel.value;
                    })
                }
                console.log(`SELECTED: ${this.value}`);
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
 * An object storing the vairous chords used in Pareidolia
 */
let Pareidolia = {
    'A0': [0, 5, 18, 23],
    'A1': [10, 14, 22, 27],
    'A2': [0, 5, 14, 18],
    'A3': [18, 22, 0, 6 ],
    'A4': [10, 18, 22, 0],
    'A5': [22, 27, 5, 10],
    'A6': [6, 10, 18, 22],
    'A7': [5, 10, 18, 23],
    'A8': [18, 27, 5, 6 ],
    'A9': [18, 22, 27, 6],
    'B0': [4, 9, 22, 27],
    'B1': [14, 18, 26, 0],
    'B2': [4, 9, 18, 22],
    'B3': [22, 26, 4, 10],
    'B4': [14, 22, 26, 4],
    'B5': [26, 0, 9, 14],
    'B6': [10, 14, 22, 26],
    'B7': [9, 14, 22, 27],
    'B8': [22, 0, 9, 10],
    'B9': [22, 26, 0, 10],
    'SupersetA': [0,5,6,10,14,18,22,23,27],
    'SupersetB': [4, 9, 10, 14, 18, 22, 26, 27, 0],
}

/**
 * Build a synth.
 */
export function MySynth() {
    this.aVal = 440;
    this.middleC = this.aVal*2**(-9/12);
    this.monoSynth = new Tone.Synth().toDestination();
    this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.tempo = 120;
    /**
     * Plays the input frequencies successively.
     * @param  {...float} pitches
     */
    this.playSuccessive = (...pitches) => {
        let duration = 1;
        let now = Tone.now();
        for (let a = 0; a < pitches.length; a++) {
            let pc = Math.round(Math.log2(pitches[a]/this.middleC)*(F.universe));
            this.monoSynth.triggerAttack(pitches[a],now+(a*duration));
            setTimeout(() => document.querySelector(`#node${pc}`).classList.add('play'),now+a*duration*1000);
            this.monoSynth.triggerRelease(now+(a*duration)+duration+.1);
            setTimeout(() => document.querySelector(`#node${pc}`).classList.remove('play'),now+((a*duration)+duration+.1)*1000);
        }
    }
    this.playDuration = (...onsets) => {
        let bcDuration = (60/this.tempo)/2;//In Seconds.
        let long = [];
        let reps = 4;
        for (let i = 0; i < reps; i++) {
            long.push(...onsets.map(x => x+(i*F.universe)));
        }
        let now = Tone.now();
        for (let a = 0; a < long.length; a++) {
            let onTime = now+long[a]*bcDuration;
            this.monoSynth.triggerAttack(long[a]%F.universe == 0? this.middleC*2 : this.middleC,onTime);
            // setTimeout(() => document.querySelector(`#node${long[a]%F.universe}`).classList.add('play'),onTime*1000);
            this.monoSynth.triggerRelease(onTime+.05);
            // setTimeout(() => document.querySelector(`#node${long[a]%F.universe}`).classList.remove('play'),(onTime+.05)*1000);
        }
    }
    /**
     * Plays the structure as a stack.
     * @param  {...float} pitches 
     */
    this.playSimultaneous = (...pitches) => {
        let stack = true;
        let duration = 1;
        let now = Tone.now();
        for (let a = 0; a < pitches.length; a++) {
            this.polySynth.triggerAttack(pitches[a],now+(duration*a));
        }
        this.polySynth.triggerRelease([...pitches],now+(duration*1.5)*pitches.length);
    }
}

export default { PCset, Serialism, Combinatorics, DisplayTypes, mouseTracking , MyDropdown, MySynth}

/**
 * Pair up the entries of an object for ICVSim.
 */
const comparison = (mod = 31) => {
    let result = {};
    let fix = Object.keys(Pareidolia).filter(x => x !== 'SupersetA');
    let keyPair = Combinatorics.cardinal_specific_subsets(fix,2);
    keyPair.forEach(pair => {
        let a = new PCset(mod,...Pareidolia[pair[0]]).intervalClassVector();
        let b = new PCset(mod,...Pareidolia[pair[1]]).intervalClassVector();
        let temp = {'individual': [],'sum': 0};
        for (let i = 0; i < a.length; i++) {
            temp['individual'].push((a[i] - b[i]));
        }
        temp['sum'] = temp['individual'].reduce((y,u) => Math.abs(y)+Math.abs(u));
        result[pair.join('-')] = temp;
    })
    return result;
}

/**
 * Search the row class for a given input.
 * @param  {...int} query 
 * @returns 
 */
const searchRowClass = (...query) => {
    //Stravinsky's Row for Cantata
    let rc = new Serialism(12,4,0,2,4,5,3,2,4,0,2,11).rowClass;
    //Ritornello
    // let rc = new Serialism(12,11,11,10,11,2,11,7,7,4,9,7,6,4,2).rowClass;
    let res = [];
    Object.entries(rc).forEach(([key,value]) => {
        if (value.slice(0,query.length).join(',') == query.join(',')) {
            res.push(`${key}: <${value}>`);
        }
    })
    return res;
}

const rowInclusion = (...elems) => {
    let rc = new Serialism(12,4,0,2,4,5,3,2,4,0,2,11).rowClass;
    let init = new PCset(12,...rc['P0']);
    let src = new Set(elems);
    let sec = elems.length > 0? new PCset(12,...Array.from(src)) : null;
    let modified = {};
    let max = 0;
    Object.entries(rc).forEach(([key,value]) => {
        let setRep = new Set(value);
        let intLen = Array.from(setRep.intersection(src)).length;
        modified[key] = {
            'unique': Array.from(setRep),
            'lenInput': Array.from(src).length,
            'intersecton': setRep.intersection(src),
            'intersectSize': intLen,
            'ratio': `${intLen}:${Array.from(src).length}`,
            'SCs': `(${sec.primeForm()}) | (${init.primeForm()})`,
        }
        max = intLen > max? intLen : max;
    })
    return Object.fromEntries(Object.entries(modified).filter(([key,value]) => value['intersectSize'] == max));
}

/**
 * Returns the discrepancy between the input and one of the input.
 * @param  {...int} elements 
 */
const nearestRowForm = (...elements) => {
    let rc = new Serialism(12,4,0,2,4,5,3,2,4,0,2,11).rowClass;
    let pcs = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];
    let res = {};
    let min = 10000;
    Object.entries(rc).forEach(([key,value]) => {
        let temp = [];
        for (let a = 0; a < value.length; a++) {
            temp.push(elements[a]-value[a]);
        }
        let small = temp.map(x => Math.abs(x)).reduce((a,b) => a+=b);
        min = small < min? small : min;
        res[key] = {
            'in_score': elements,
            'note_names': elements.map(x => pcs[x]),
            'true_row_form': value,
            'pairwise': temp,
            'first_last': `${elements[0]}...${elements[elements.length-1]}`, 
            'discrepancy': small
        }
    })
    return Object.fromEntries(Object.entries(res).filter(x => x[1]['discrepancy'] == min));
}

/**
 * An Object storing the literal seria from Stravinsky's Ricercar II.
 */
const RicercarII = {
    //Page 1
    'm2': [4,0,2,4,5,3,2,4,0,2,11],
    'm3': [11,2,0,4,2,3,5,4,2,0,4],
    'm4': [0,4,2,0,11,1,2,0,4,2,5],
    'm6': [5,2,4,0,2,1,11,0,2,4,0],
    //Page 2
    'm13': [4,0,2,4,5,3,2,4,0,2,11],
    'm16': [11,2,0,4,2,3,5,4,2,0,4],
    'm19': [4,0,2,4,5,3,2,4,0,2,11],
    'm21': [11,2,0,4,2,3,5,4,2,0,4],
    'm22': [0,4,2,0,11,1,2,0,4,2,5],
    'm24': [5,2,4,0,2,1,11,0,2,4,0],
    //Page 3
    'm31': [4,0,2,4,5,3,2,4,0,2,11],
    'm34': [11,2,0,4,2,3,5,4,2,0,4],
    'm37': [0,4,2,0,11,1,2,0,4,2,5],
    'm39ob2': [4,0,2,4,5,3,2,4,0,2,11],
    'm41ob1': [7,3,5,7,8,6,5,7,3,5,2],
    'm42': [9,0,10,2,0,1,3,2,0,10,2],
    //Page 4
    'm46': [4,0,2,4,5,3,2,4,0,2,11],
    'm46cell.ob1': [4,0,2,4,5,3,2,4,0,2,11],
    'm52': [9,0,10,2,0,1,3,2,0,10,2],
    'm52cell': [9,5,7,9,10,8,7,9,5,7,4],
    'm53ob1': [6,9,7,11,9,10,0,11,9,7,11],
    'm55': [2,10,0,2,3,1,0,2,10,0,9],
    'm58ob2': [8,5,7,3,5,4,2,3,5,7,3],
    //Page 5
    'm59': [9,0,10,8,7,9,10,8,0,10,1],
    'm67': [0,4,2,0,11,1,2,0,4,2,5],
    'm69ob2': [4,0,2,4,5,3,2,4,0,2,11],
    'm71ob1': [7,3,5,7,8,6,5,7,3,5,2],
    //Page 6
    'm76': [4,0,2,4,5,3,2,4,0,2,11],
    'm76cell.ob1': [4,0,2,4,5,3,2,4,0,2,11],
    'm82': [9,1,11,9,8,10,11,9,1,11,2],
    'm82ob2': [0,4,2,0,11,1,2,0,4,2,5],
    'm82ob1': [2,6,4,2,1,3,4,2,6,4,7],
    'm85': [5,2,4,0,2,1,11,0,2,4,0],
    //Page 7
    'm88': [1,9,11,1,2,0,11,1,9,11,8],
    'm88cell' : [9,5,7,9,10,8,7,9,5,7,4],
    'm88ob1': [1,9,11,1,2,0,11,1,9,11,8],
    'm94': [0,4,2,0,11,1,2,0,4,2,5],
    'm96ob2': [4,0,2,4,5,3,2,4,0,2,11],
    'm98ob1': [7,3,5,7,8,6,5,7,3,5,2],
    'm99': [9,0,10,2,0,1,3,2,0,10,2],
    //Page 8
    'm103': [4,0,2,4,5,3,2,4,0,2,11],
    'm103cell.ob': [4,0,2,4,5,3,2,4,0,2,11],
    'm109': [4,0,2,4,5,3,2,4,0,2,11],
    'm109cell': [0,4,2,0,11,1,2,0,4,2,5],//Octaves broken
    'm109ob1': [4,0,2,4,5,3,2,4,0,2,11],//Octaves broken
    'm112ob2': [2,6,4,2,1,3,4,2,6,4,7],
    'm112cell': [4,0,2,4,5,3,2,4,0,2,11],
    //Page 9
    'm114': [2,11,1,3,4,2,1,3,11,1,10],
    'm114ob2': [5,2,4,6,7,5,4,6,3,5,2],
    'm114ob1': [2,11,1,3,4,2,1,3,11,1,10],
    'm121': [0,4,2,0,11,1,2,0,4,2,5],
    'm123ob2': [4,0,2,4,5,3,2,4,0,2,11],
    'm125ob1': [7,3,5,7,8,6,5,7,3,5,2],
    'm126': [9,0,10,2,0,1,3,2,0,10,2],
    'm130': [4,0,2,4,5,3,2,4,0,2,11],
    'm130cell.ob1': [4,0,2,4,5,3,2,4,0,2,11],
    'm136': [11,2,0,4,2,3,5,4,2,0,4],
    'm136ob1': [5,2,4,0,2,1,11,0,2,4,0],
    'm138cell': [5,2,4,0,2,1,11,0,2,4,0],
    'm139ob2': [11,2,0,4,2,3,5,4,2,0,4],
    'm139': [4,0,2,4,5,3,2,4,0,2,11],
    //Page 10
    'm142': [1,5,3,1,0,2,3,1,5,3,6],
    'm142ob2': [5,8,6,10,8,9,11,10,8,6,10],
    'm142cell': [5,1,3,5,6,4,3,5,1,3,0],
    'm151': [0,4,2,0,11,1,2,0,4,2,5],
    'm153ob2': [4,0,2,4,5,3,2,4,0,2,11],
    'm155ob1': [7,3,5,7,8,6,5,7,3,5,2],
    'm160': [4,0,2,4,5,3,2,4,0,2,11],
    'm160cell.ob1': [4,0,2,4,5,3,2,4,0,2,11],
}

const fastOverview = () => {
    let res = {};
    Object.entries(RicercarII).forEach(([key,value]) => {
        let nums = key.match(/[0-9]+/ig);
        let letts = key.match(/[a-z]+/ig);
        let step1 = nearestRowForm(...value);
        let temp = Object.values(step1)[0];
        res[key] = [Object.keys(step1)[0],...Object.entries(temp).flat().map(x => typeof x == 'object'? x.join(',') : x)];
    })
    // console.table(res);
    return res;
}

/**
 * 
 * @param {int} universe 
 * @param  {...int} elements 
 */
function SpecialRowMethods(universe = 12,...elements) {
    this.referent = new Serialism(12,...elements);
    this.row_class = this.referent.rowClass;
    this.unique_elements = Array.from(new Set(this.referent.series));
    /**
     * Search the row class for ordered subset.
     * @param  {...int} elems 
     * @returns 
     */
    this.ordered_search = (...elems) => {
        let res = {};
        let joined = elems.join(',');
        Object.entries(this.row_class).forEach(([key,value]) => {
            for (let a = 0; a < value.length; a++) {
                let test = value.slice(a,a+elems.length).join(',');
                if (test == joined) {
                    res[key] = value;
                }
            }
        })
        return res;
    }
    /**
     * Search the row class for adjacent, but not necessarily ordered elements.
     * @param  {...int} elems 
     * @returns 
     */
    this.unordered_search = (...elems) => {
        let res = {};
        let joined = Array.from(new Set(elems)).sort((a,b) => a-b).join(',');
        Object.entries(this.row_class).forEach(([key,value]) => {
            for (let a = 0; a < value.length; a++) {
                let test = Array.from(new Set(value.slice(a,a+elems.length))).sort((i,j) => i-j);
                test = test.join(',');
                if (test == joined) {
                    res[key] = value;
                }
            }
        })
        return res;
    }
    /**
     * console.table view of as many row forms as desired.
     * @param  {...string} forms 
     */
    this.show_forms = (...forms) => {
        let result = {};
        forms.forEach(item => {
            result[item] = this.row_class[item];
        })
        console.table(result);
    }
}

/**
     * Returns the factors/divisors of an input.
     * @param {int} a 
     * @returns 
     */
    const factor = (a) => {
        let res = [];
        for (let i = 0; i <= Math.sqrt(a); i++) {
            if (a%i == 0) {
                res.push(a/i,i);
            }
        }
        return Array.from(new Set(res));
    }
    /**
     * 
     * @param {int} a 
     * @param {int} b 
     */
    const coprime = (a,b) => {
        let aFact = new Set(factor(a));
        let bFact = new Set(factor(b));
        return Math.max(...Array.from(aFact.intersection(bFact))) == 1;
    }

let ricer = new SpecialRowMethods(12,4,0,2,4,5,3,2,4,0,2,11);


// print(ricer.show_forms('P4','I0'))

//P4-I0 = T4I/ preserves the first 4 elements. Primary relationship.
//P4 and I0 also have only one variable element. This variable element is not a repeated element and is found in order position 5, the exact center of the series. 
//This means the pitch class content before and after this partition is invariant in the affiliated row forms.

//P7-R2 = R7 shares last pc.

/**
 * Tests an object for if there are pivot chords.
 * @param {string} superset 
 * @returns 
 */
const PivotChords = (superset = 'A') => {
    let sup = new Set(Pareidolia[`Superset${superset}`]);
    let oppo = superset == 'A'? 'B' : 'A';
    let res = {};
    let filt = Object.entries(Pareidolia).filter(([key,value]) => key[0] == oppo && key.match('Superset') == null);
    filt.forEach(([key,value]) => {
        if (Array.from(sup.intersection(new Set(value))).length == value.length) {
            res[key] = value;
        }
    })
    console.log(`Superset: [${Array.from(sup)}]`);
    return res;
}

/**
 * Returns the number of partitions (accidentals) required for a M2 and m2 in a given chromatic universe.
 * @param {int} universe 
 * @returns 
 */
const divisionsPer = (universe = 12) => {
    /**
     * An array of objects
     * @property {int} M2
     * @property {int} m2
     * @property {float} proximity
     */
    let result = [];
    let i = 1;
    while (i < universe) {
        if ((universe-i)%5 == 0 && i%2 == 0 && ((universe-i)/5) > i/2) {
            // result['W'].push((universe-i)/5);
            // result['H'].push(i/2);
            result.push({
                'M2': (universe-i)/5,
                'm2': i/2,
                'proximity': Math.abs(2-((universe-i)/5)/(i/2))
            })
        }
        i++;
    }
    let min = 100;
    result.forEach(entry => {
        min = entry.proximity < min? entry.proximity : min;
    })
    return result.filter(x => x.proximity == min);
}

console.log(divisionsPer(19));

