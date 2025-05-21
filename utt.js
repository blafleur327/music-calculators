
/**
 * Constructor for new interval object.
 * @param {int} unwound
 * @param {int} opci 
 */
function Interval (unwound,opci) {
    this.unwound = unwound;
    this.opci = opci;
}

const unwound = ['F♭♭','C♭♭','G♭♭','D♭♭','A♭♭','E♭♭','B♭♭','F♭','C♭','G♭','D♭','A♭','E♭','B♭','F','C','G','D','A','E','B','F♯','C♯','G♯','D♯','A♯','E♯','B♯','Fx','Cx','Gx','Dx','Ax','Ex','Bx'];
const pcs = [['C','B♯','D♭♭'],['D♭','C♯','Bx'],['D','E♭♭','Cx'],['E♭','D♯','F♭♭'],['E','F♭','Dx'],['F','E♯','G♭♭'],['G♭','F♯','Ex'],['G','A♭♭','Fx'],['A♭','G♯'],['A','B♭♭','Gx'],['B♭','A♯','C♭♭'],['B','C♭','Ax']];
const intLibrary = {
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
}

const findOPCI = (opci) => {
    for (let [key,value] of Object.entries(intLibrary)) {
        if (value.opci == opci) {
            return key;
        }
    }
}

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
    '+': [intLibrary.M3,intLibrary.P5],
    '-': [intLibrary.m3,intLibrary.P5],
    'aug': [intLibrary.M3,intLibrary.A5],
    'dim': [intLibrary.m3,intLibrary.D5]
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
        let init = chord.match(/[A-G♭♯b#]+/g)[0];
        let root = fixAccidentals(init);
        let qual = chord.match(/[+-]/g)[0];
        let result = [unwound.indexOf(root)];
        let start = result[0];
        triads[qual].forEach(int => {
            result.push(start + int.unwound);
          });
        return numbers? result : result.map(x => unwound[x]);
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
            chord = chord.map(x => unwound.indexOf(x));
        }
        result = unwound[chord[0]];
        for (let a = 1; a < chord.length; a++) {
            ints.push(chord[a]-chord[0]);
        }
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
        let ints = [unwound.indexOf(upper),unwound.indexOf(lower)];
        let resp = typeof chord == 'string'? PC.buildTriad(chord,true) : chord.map(x => unwound.indexOf(x));
        if (Math.min(...resp) <= ints[1]) {
            resp = resp.map(x => x+=12);
        }
        else if (Math.max(...resp) >= ints[0]) {
            resp = resp.map(x => x-=12);
        }
        else {
            resp = resp;
        }
        return typeof chord == 'string'? PC.reduceTriad(resp.map(x => unwound[x])) : resp.map(x => unwound[x]);
    },
    /**
     * Converts an array of pitches into their respective PCs
     * @param {array} chord 
     * @returns 
     */
    toPC: (chord) => {
        let res = [];
        chord.forEach(member => {
            for (let a = 0; a < pcs.length; a++) {
                pcs[a].indexOf(member) !== -1? res.push(a) : null;
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
        pcs.forEach(item => {
            item.indexOf(modA) !== -1 && item.indexOf(modB) !== -1? res = true : null;
        })
        return res;
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
            if (typeof transformation == 'string') {
                let split = transformation.match(/[0-9-+]+/g);
                split[1] = parseInt(split[1]);
                split[2] = parseInt(split[2]);
                transformations.push(new UTT(...split));
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
 */
function UTT (parody,majorInt,minorInt) {
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
    this.execute = (triad) => {
        let temp = triad;
        if (typeof triad == 'object') {
            temp = PC.reduceTriad(triad);
        }
        let init = temp.match(/[A-G♭♯b#]+/g)[0];
        let qual = temp.match(/[+-]/g)[0];
        root = fixAccidentals(init);
        let index = unwound.indexOf(root);
        if (qual == '+') {
            index+=intLibrary[this.majorInt].unwound;
        }
        else {
            index+=intLibrary[this.minorInt].unwound;
        }
        if (parody == '-') {
            if (qual == '-') {
                qual = '+';
            }
            else if (qual == '+') {
                qual = '-';
            }
        }
        return typeof triad == 'object'? PC.buildTriad(PC.enharmonicRespell(`${unwound[index]}${qual}`)) : PC.enharmonicRespell(`${unwound[index]}${qual}`);
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
const NRTs = {
    L: new UTT('-',4,8),
    R: new UTT('-',9,3),
    P: new UTT('-',0,0),
    N: new UTT('-',5,7),
    H: new UTT('-',8,4),
    S: new UTT('-',1,11)
}

/**
 * It's alot.
 * @param {int} numOcts 
 * @param {int} semitones 
 * @returns String of Data 
 */
const MIDIrange = (numOcts = 10,semitones = 0) => {
    let divisions = 2000;
    let maxBits = 2**16;
    let thresh = [20,20000];
    let hz = thresh[0]*2**((semitones/divisions)+numOcts);
    return `Range: ${thresh[0]} - ${hz} | Audible: ${hz <= thresh[1]} | Number of Discrete Pitches: ${((divisions*numOcts)+semitones)} | Fits in MIDI 2.0 Bit Range: ${((divisions*numOcts)+semitones) < maxBits}`
    //Range = approximately 9 octaves and a M7 (119 Semitones);
}

let STORE = {
    'start': null,
    'chain': [],
    'nodes': [],
    'sumNotes': [],
    'roots': []
}

/**
 * Returns an array containing all UTTS.
 * @returns Array
 */
const createAllUTTs = () => {
    let res = [];
    for (let i = 0; i < 12; i ++) {
        for (let j = 0; j < 12; j++) {
            res.push(new UTT(i+j % 2 == 0? '+' : '-',i,j));
        }
    }
    return res;
}

/**
 * Computes positions of verticies for an equilateral shape with n points. 
 * @param {array} center [x,y] 
 * @param {int} numPoints number of equidistant points
 * @param {float} length diameter length
 * @returns 
 */
const getPoints = (center,numPoints,length = 50,offset = 0) => {
    let allAngles = 360/numPoints;      //(180*(numPoints-2))/numPoints is really interesting!
    let vertices = [];
    for (let a = 0; a < numPoints; a++) {
        let angle = ((a*allAngles)-(90+offset)) * Math.PI/180;  //-90 sets top element to 0;
        let x = center[0] + length * Math.cos(angle);
        let y = center[1] + length * Math.sin(angle);
        vertices.push([x, y]);
    }
    return vertices;
}

/**
 * Manages the SVG drawing.
 * @param {string} parent id of HTML element.
 */
function Drawing (parent) {
    let sizeX = 600;
    let sizeY = 600;
    this.parent = document.querySelector(`#${parent}`);
    this.draw = SVG().addTo(`#drawing`).size(sizeX,sizeY);
    this.clear = () => {
        STORE.nodes.forEach(elem => {
            elem.remove();
        })
        STORE.nodes = [];
        this.parent.querySelectorAll('text').forEach(elem => {
            elem.remove();
        })
    }
    document.querySelector('#start')['data-tooltip'] = `Enter a starting triad in the format C+ or F- then press enter.`;
    document.querySelector('#utts')['data-tooltip'] = `Enter a series of transformations in UTT format ie. <-,5,7> or in standard NRT format ie. L,R,P, etc.`
    this.drawCycle = (start,...utts) => {
        this.clear();
        let segmentLength = 200;
        STORE.sumNotes = [];
        STORE.roots = [];
        let T = new Cycle(start,...utts);
        let points = getPoints([sizeX/2,sizeY/2],T.cycle_length,segmentLength);
        let offPoints = getPoints([sizeX/2,sizeY/2],(T.cycle_length)*2,segmentLength+50);
        for (let a = 0; a < points.length; a++) {
            let b = new MyNode(this,T.result[a],...points[a]);//Add data-tooltip?
            let disp = T.utts[a%T.utts.length];
            for ([key,value] of Object.entries(NRTs)) {
                if (disp == value.stringFormat) {
                    disp = `${key}`;
                }
            }
            this.draw.text(disp).center(...offPoints[(a*2)+1]);
            let spelled = PC.toPC(PC.buildTriad(T.result[a]));//
            (/[+]/g).test(b.info)? b.self.addClass('major') : b.self.addClass('minor');
            STORE.sumNotes.push(...spelled);
            STORE.roots.push(spelled[0]);
        }
        STORE.sumNotes = Array.from(new Set(STORE.sumNotes)).sort((a,b) => a-b);
        STORE.roots = Array.from(new Set(STORE.roots)).sort((a,b) => a-b);
        document.querySelector('#sum').innerHTML = `{${STORE.sumNotes}}`;
        document.querySelector('#roots').innerHTML = `{${STORE.roots}}`;
        document.querySelector('#cycleLength').innerHTML = `${T.cycle_length}`;
    }
}

/**
* Monitors the hovering of the cursor. Updates tooltip box.
*/
mouseTracking = () => {
    let tt = document.querySelector(`#tooltips`);//
    document.addEventListener('mouseover',(element) => {    //Whole document allows tooltips!
        let message = undefined;
        let position = [element.clientX,element.clientY];
        tt.style.left = `${position[0]+10}px`;
        tt.style.top = `${position[1]+10}px`;
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

/**
 * Build a circular node.
 * @param {string} info 
 * @param {int} x 
 * @param {int} y 
 */
function MyNode (parent,info,x,y) {
    this.x = x;
    this.y = y;
    this.info = info;
    if (parent instanceof Drawing) {
        this.self = parent.draw.group();
        parent.draw.circle(35,35).fill('white').stroke({width: 1, color: 'black'}).center(0,0).addTo(this.self);
        parent.draw.text(this.info).center(0,0).addTo(this.self);
        this.self.center(this.x,this.y);
    }
    else {
        console.error("'parent' must be an instance of Drawing Class!");
    }
    STORE.nodes.push(this.self);
}

/**
 * Convert a float to a ratio.
 * @param {float} value 
 * @returns Ratio
 */
const ratio = (value) => {
    let current = value;
    let numer = 0;
    let denom = 0;
    /**
     * Find the denominator.
     */
    for (let a = 1; a < 100000; a++) {
        let test = ((a*value).toFixed(8)) % 1;
        if (test == 0) {
            denom = a;
            break;
        }
    }
    /**
     * Incrementally subtract 1/denominator until remainder == 0.
     */
    while (current > .00000001) {
        current-= (1/denom);
        numer++;
    }
    return `${numer} : ${denom}`;
}

/**
 * Returns an object with Hz values in an equal tempered system.
 * @param {float} start 
 * @param {int} units 
 * @param {int} partial 
 */
const equalTemperament = (start = 220, units = 12, partial = 2) => {
    let result = {};
    for (let a = 0; a <= units; a++) {
        result[a] = start*partial**(a/units);
    }
    result['increment'] = `${(Math.log2(result[1]/result[0])*1200).toFixed(2)} cET`;
    return result;
}

let F

document.addEventListener('DOMContentLoaded',() => {
    F = new Drawing('drawing');
    console.log('YAY!');
    let dis = document.querySelector('#chain');
    let ins = document.querySelectorAll('input').forEach(elem => {
        if (elem.id == 'start') {
            elem.addEventListener('keydown',(event) => {
                if (event.key == 'Enter') {
                    STORE.start = elem.value;
                }
            })
        }
        else if (elem.id == 'utts') {
            elem.addEventListener('keydown',(event) => {
                if (event.key == 'Enter') {
                    STORE.chain = [];//Clear
                    let str = elem.value;
                    let spl = [];
                    let i = 0;
                    while (i < str.length) {//Regex was too hard, and wouldn't maintain indices. 
                        if (str[i] == '<') {
                            temp = '';
                            while (str[i] !== '>') {    
                                temp+=str[i];
                                i++
                            }
                            temp+='>';
                            spl.push(temp);
                        }
                        else if ((/[A-Z]/ig).test(str[i])) {
                            spl.push(str[i]);
                        }
                        i++;
                    }
                    spl.forEach(item => {
                        let find = null;
                        for (let [key,value] of Object.entries(NRTs)) {
                            if (item == key) {
                                find = value;
                            }
                        }
                        if (find == null) {
                            find = item;
                        }
                        console.log(find)
                        STORE.chain.push(find);
                    })
                    F.drawCycle(STORE.start,...STORE.chain);
                }
            })
        }
    });
    mouseTracking();
})

// N,L = <-,5,8>