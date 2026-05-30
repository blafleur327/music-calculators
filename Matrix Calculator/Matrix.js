import { PCset,Serialism,DisplayTypes,mouseTracking } from "../pcMethods.js";

import { Library } from "../ExternalRowLibrary.js";

/**
 * Builds a matrix object.
 * @param {string} parent HTML element id.
 * @param {int} universe 
 * @param  {...int} elements 
 */
function Matrix(parent = 'matrix') {
    /**
     * HTML representative of the parent.
     */
    this.parent = document.querySelector(`#${parent}`);
    this.display = null;
    /**
     * Serialism object instance only available after this.build() called.
     */
    this.referent = null;
    /**
     * Stores the names of rows clicked and selected.
     */
    this.selectedRows = [];
    /**
     * Stores the associated HTML elements of the .labelSelects.
     */
    this.selectedLabels = [];
    /**
     * Modular universe of this Matrix.
     */
    this.universe = null;
    this.series = null;
    /**
     * Changes the appearance of the matrix to a few preset types.
     * @param {int} type 
     */
    this.changeDisplay = (type) => {
        this.display = type;
        vis = type;
        document.querySelectorAll(`#${parent} > * > * .cell:not(.void)`).forEach(cell => {
            let text = cell.textContent;
            let refer = cell['data-primary'];
            let changed = null;
            let normal = cell.classList.contains('label') == false;
            switch (this.display) {
                /**
                 * Base 10 Integers
                 */
                case 0: 
                    changed = refer;
                    break;
                /**
                * Base n Integers (up to 36 [0-z]);
                */
                case 1:
                    changed = normal? parseInt(refer).toString(this.universe) : `${refer.match(/[RIP]+/ig)[0]}${parseInt(refer.match(/[0-9]+/ig)[0]).toString(this.universe)}`;
                    break;
                /**
                 * Note Names. (Stein-Zimmermann);
                 */
                case 2:
                    if (Object.keys(DisplayTypes['pitch']).indexOf(`${this.universe}`) > -1) {
                        let notes = DisplayTypes['pitch'][this.universe];
                        changed = normal? notes[refer] : `${refer.match(/[RIP]+/ig)[0]}${notes[parseInt((refer.match(/[0-9]+/ig)[0]))]}`
                    }
                    else {
                        console.error(`No Tuning System defined for universe = ${this.universe}!`);
                    }
                    break;
                /**
                 * Durations (Messiaen-Boulez)
                 */
                case 3:
                    if (cell.classList.contains('label')) {
                        changed = refer;
                    }
                    else {
                        changed = DisplayTypes['rhythm'][this.universe][parseInt(refer)];
                    }
                    break;
                /**
                * Durations as multiples of n-beat unit.
                */
                case 4:
                    if (cell.classList.contains('label')) {
                        changed = refer;
                    }
                    else {
                        changed = `${DisplayTypes['rhythm'][this.universe][0]}${String.fromCodePoint(0xd7)}${parseInt(refer)+1}`;
                    }
                    break;
            }
            cell.textContent = changed;
        })
    }
    /**
     * Builds a matrix based on the input parameters.
     * @param {boolean} labels 
     */
    this.build = (universe,...series) => {
        this.universe = universe;
        this.series = series;
        this.selectedRows = [];
        this.selectedLabels = [];
        this.parent.childNodes.length > 0? this.parent.innerHTML = '' : null;  
        let div = document.createElement('div');
        this.parent.appendChild(div);  
        this.referent = new Serialism(universe,...series);
        /**
         * Once built, show the search input.
         */
        document.querySelectorAll('#inputs > .void').forEach(elem => {
            elem.classList.remove('void');
        })
        let tMat = this.referent.tMatrix();
        let size = series.length+2;
        for (let a = 0; a < size; a++) {
            let row = document.createElement('div');
            let acorn = a == 0 || a == size-1;
            row.classList.add('row');
            for (let b = 0; b < size; b++) {
                let bcorn = b == 0 || b == size-1;
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell['data-row'] = `${a-1}`;
                cell['data-column'] = `${b-1}`;
                /**
                 * Is void corner
                 */
                if (acorn && bcorn) {
                    cell.classList.add('void');
                }
                /**
                 * Label row.
                 */
                else if (acorn || bcorn) {
                    cell.classList.add('label');
                    /**
                     * I row.
                     */
                    if (a == 0) {
                        cell.textContent = `I${tMat[0][b-1]}`;
                        cell['data-primary'] = `I${tMat[0][b-1]}`;
                        cell['data-select'] = `column${b-1}`;
                    }
                    /**
                     * RI row
                     */
                    else if (a == size-1) {
                        cell.textContent = `RI${tMat[0][b-1]}`;
                        cell['data-primary'] = `RI${tMat[0][b-1]}`;
                        cell['data-select'] = `column${b-1}`;
                    }
                    /**
                     * P row
                     */
                    else if (b == 0) {
                        cell.textContent = `P${tMat[a-1][0]}`;
                        cell['data-primary'] = `P${tMat[a-1][0]}`;
                        cell['data-select'] = `row${a-1}`;
                    }
                    /**
                     * RP row
                     */
                    else if (b == size-1) {
                        cell.textContent = `R${tMat[a-1][0]}`;
                        cell['data-primary'] = `R${tMat[a-1][0]}`;
                        cell['data-select'] = `row${a-1}`;
                    }
                }
                /**
                 * Regular Cell.
                 */
                else {
                    cell.textContent = tMat[a-1][b-1];
                    // cell.id = `${(b-1)+((a-1)*this.series.length)}`;
                    cell.id = `${a-1}:${b-1}`;
                    cell.classList.add(`row${a-1}`);
                    cell.classList.add(`column${b-1}`);
                    cell['data-primary'] = tMat[a-1][b-1];
                }
                row.appendChild(cell);
            }
            div.append(row);
        }
        /**
         * 
         * @param {} event 
         */
        this._clickFunction = (event) => {
            if (event.target.classList.contains('label')) {
                let name = event.target['data-primary'];
                /**
                 * If not currently selected...
                 */
                if (this.selectedRows.indexOf(name) == -1) {
                    this.selectedRows.push(name);
                    this.selectedLabels.push(event.target);
                    console.log(`SELECT: ${name}`);
                }
                /**
                 * If already selected...
                 */
                else {
                    this.selectedRows = this.selectedRows.filter(x => x !== name);
                    this.selectedLabels = this.selectedLabels.filter(x => x['data-primary'] !== name);
                    console.log(`DESELECT: ${name}`);
                }
                console.log(`CURRENT: { ${this.selectedRows} }`);
            }
            this.update();
        }
        this.update();
        /**
         * add Event Listener.
         */
        div.removeEventListener('mousedown',this._clickFunction);
        div.addEventListener('mousedown',this._clickFunction);
        document.querySelector('#extra').classList.remove('void');
        this.changeDisplay(vis);
        this.display = vis;
        this.makeKey();
    }
    /**
     * Grab the matrix cells for a given row form in the order in which they occur.
     * @param {string} form
     * @param {boolean} flatten 
     * @returns Array of HTML elements
     */
    this.getCells = (form,flatten = true) => {
        let result = [];
        let rowCol = undefined;
        let temp = [];
        document.querySelectorAll(`#${parent} > * > * .label`).forEach(label => {
            if (label['data-primary'] == form) {
                rowCol = label['data-select'].match(/[a-z]+/ig);
                temp.push(...label['data-select'].match(/[0-9]+/ig));
            }
        })
        console.log(`${rowCol} - {${temp}}`);
        if (rowCol !== undefined) {
            temp.forEach(index => {
                let grab = document.querySelectorAll(`.${rowCol}${index}`);
                result.push(form[0] == 'R'? [...grab].reverse() : [...grab]);
            })
            return flatten? result.flat() : result;
        }
        else {
            console.log(`${form} is not in the matrix!`);
        }
    }
    /**
     * Search the matrix for adjacent unordered elements. Optionally, search for a set class.
     * @param {boolean} literal actual elements || SC of elements.
     * @param {...int} elems
     */
    this.search = (literal = true,...elems) => {
        /**
         * Clear previous finds.
         */
        document.querySelectorAll(`#${parent} > * > * .cell:not(.label,.void`).forEach(elem => {
            elem.classList.remove('literalFind','bothSC','verticalSC','horizontalSC');
        })
        let rfs = [];//??
        /**
         * If elems includes letters.
         */
        if (elems.join(',').match(/[a-z]/ig)) {
            elems = elems.map(x => parseInt(x,this.universe));
        }
        let src = elems.sort((a,b) => a-b).join(',');
        /**
         * Prime form.
         */
        let pf = new PCset(this.universe,...elems).primeForm().join(',');
        console.log(`Searching for ${literal? src : `(${pf})`}`);
            /**
            * Get cells for each rowform.
            */
            Object.keys(this.referent.rowClass).forEach(rowform => {
                let cells = this.getCells(rowform,false);//Too long...
                let slic = [];
                /**
                * Slice the cells array into segments of the size, overlapping!
                */
                if (cells) {
                    for (let a = 0; a < this.series.length; a++) {
                        cells.forEach(sub => {
                            let t = sub.slice(a,a+elems.length).sort((i,j) => parseInt(i['data-primary'])-parseInt(j['data-primary']));
                            slic.push(t);
                        })
                        //slic.push(t);
                        // console.log(`${rowform}[${a}-${a+elems.length <= this.series.length? a+elems.length : this.series.length}]: {${t.map(x => x.textContent).join(',')} is the same as: {${src}}? ${t.map(x => x.textContent).join(',') == src}`);
                    }
                    /**
                    * Loop over relevant segments, join text content and check if this is the same as src.
                    */
                    slic.forEach(segment => {
                        console.log(segment);
                        /**
                        * Literal passing condition.
                        */
                        if (literal) {
                            let str = segment.map(x => x['data-primary']).join(',');
                            // console.log(`${str} == ${src}? ${str == src}`);
                            if (str == src) {
                                rfs.push(rowform);
                                segment.forEach(cell => {
                                cell.classList.add('literalFind');
                                })
                        }
                    }
                    /**
                    * Abstract passing condition.
                    */
                    else {
                        let pfs = new PCset(this.universe,...segment.map(x => parseInt(x['data-primary']))).primeForm().join(',');
                        if (pfs == pf) {
                            segment.forEach(cell => {
                                if (rowform.match(/[I]/ig)) {
                                    if (cell.classList.contains('horizontalSC')) {
                                        cell.classList.remove('horizontalSC');
                                        cell.classList.add('bothSC');
                                    }
                                    else {
                                        cell.classList.add('verticalSC');
                                    }   
                                }
                                else {
                                    if (cell.classList.contains('verticalSC')) {
                                        cell.classList.remove('verticalSC');
                                        cell.classList.add('bothSC');
                                    }
                                    else {
                                        cell.classList.add('horizontalSC');
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
        console.log(rfs)
    }
    /**
     * Select a slice from [0-size-1] from the various rowforms listed.
     * @param {int} size 
     * @param  {...string} rowforms {Pn,Rn,In,RIn} 
     */
    this.multiSelect = (size,...rowforms) => {
        document.querySelectorAll(`#${parent} > * > * .subGrp`).forEach(item => {
            item.classList.remove('subGrp');
        })
        /**
         * Slice the first 0-size elements from each rowform.
         */
        rowforms.forEach(entry => {
            this.getCells(entry).slice(0,size).forEach(cell => {
                cell.classList.add('subGrp');
            });
        })
    }
    /**
    * Updates the matrix.
    */
    this.update = () => {
        /**
         * Clear modified cells.
         */
        document.querySelectorAll(`#${parent} > * > * .select, .labelSelect, .invar`).forEach(elem => {
            elem.classList.remove('select','labelSelect','invar');
        })
        document.querySelectorAll(`#${parent} > * > * .label`).forEach(lab => {
            if (this.selectedRows.indexOf(lab['data-primary']) > -1) {
                lab.classList.add('labelSelect');
            }
        })
        this.makeKey();
        let unflat = this.selectedRows.map(x => this.getCells(x,false));
        let filtered = this.selectedRows.map(x => this.getCells(x)).flat();
        filtered.forEach(cell => {
            cell.classList.add('select');
        })
        // let lastSelected = this.selectedRows[this.selectedRows.length-1];
        /**
         * If multiple rows are available, check for invariance. 
         */
        if (this.selectedRows.length > 1) {
            let ordin = this.referent.ordinalInvariance(...this.selectedRows);
            ordin.forEach(index => {
                unflat.forEach(group => {
                    group.forEach(subgroup => {
                        subgroup[index].classList.add('invar');
                    })
                })
            })
        }
        /**
        * Remove all children to get rid of event listeners.
        */
        let box = document.querySelector('#extra');
            document.querySelector('#extra').innerHTML = '';
            let a = document.createElement('div');
            a.id = 'combinatoriality';
            let b = document.createElement('div');
            b.id = 'derivation';
            let c = document.createElement('div');
            c.id = 'allInterval';
            box.appendChild(a);
            box.appendChild(b);
            box.appendChild(c);
            let sel = this.selectedRows.length > 0? Z.selectedRows[Z.selectedRows.length-1] : `P${Z.referent.series[0]}`;
            document.querySelectorAll('#extra > *').forEach(component => {
                /**
                    * Builds the combinatoriality boxes.
                 */
                if (component.id == 'combinatoriality') {
                    let comb = this.referent.combinatoriality(sel);
                    let h = document.createElement('h4');
                    h.textContent = `Combinatoriality:`;
                    component.appendChild(h);
                    Object.entries(comb).forEach(([key,value]) => {
                        let levelBox = document.createElement('div');
                        let lab = document.createElement('h4');
                        lab.textContent = `${key}-chord`;
                        levelBox.appendChild(lab);
                        let mini = document.createElement('div');
                        mini.classList.add('mini');
                        levelBox.appendChild(mini);
                        /**
                        * Append rowform groups.
                        */
                        value.forEach(group => {
                            let grp = document.createElement('div');
                            grp.classList.add('combin');
                            grp.textContent = group;
                            grp.dataset.tooltip = `Draw ${key}-chordally combinatorial group {${group}}.`
                            mini.appendChild(grp);
                            })
                        component.appendChild(levelBox);
                        });
                    /**
                    * Method to be used for event listener.
                    * @param {*} event 
                    */
                    const _combinClick = (event) => {
                        document.querySelectorAll(`.selectCombinGroup`).forEach(item => {
                            item.classList.remove('selectCombinGroup');
                        })
                        let card = event.target.parentElement.parentElement.childNodes[0].textContent.match(/[0-9]+/ig)[0];
                        this.multiSelect(parseInt(card),...event.target.textContent.match(/[RIP0-9]+/ig));
                        event.target.classList.add('selectCombinGroup');
                        }
                    /**
                    * Add click functionality for combinatorial groups.
                    */
                    component.addEventListener('mousedown',_combinClick);
                }
                /**
                * Adds the relevant boxes for showing derivation levels.
                */
                else if (component.id == 'derivation') {
                    let der = this.referent.derivation();
                    let h = document.createElement('h4');
                    h.textContent = `Derivation:`;
                    component.appendChild(h);
                    Object.entries(der).forEach(([key,value]) => {
                        let d = document.createElement('div');
                        d.textContent = `${key}-chord: (${value})`;
                        d.dataset.tooltip = `${sel} is derived at the ${key}-chord, ${sel}: {${this.referent.partition(this.referent.rowClass[sel],parseInt(key)).join('},{')}} are members of SC: (${value}).`;
                        component.appendChild(d);
                    })
                }
                /**
                * Adds the relevant boxes for 
                */
                else if (component.id == 'allInterval') {
                    let h = document.createElement('h4');
                    h.textContent = `All Interval:`;
                    h.dataset.tooltip = `Determines if the tonerow contains one instance of all possible OPCIs in the given universe.`
                    component.appendChild(h);
                    let sub = document.createElement('p');
                    sub.textContent = this.referent.allInterval() == false? false : true;
                    component.appendChild(sub);
                }
            })
    }
    /**
     * Partitions the matrix into smaller sub matrices.
     * @param {int} groupSize must be a divisor of this.series.length
     */
    this.subMatrix = (groupSize) => {
        document.querySelectorAll(`#${parent} > * > * .dark`).forEach(item => {
            item.classList.remove('dark');
        })
        let res = {};
        if (this.series.length%groupSize == 0) {
            document.querySelectorAll(`#${parent} > * > * .cell:not(.label,.void)`).forEach(cell => {
                let val = cell.id.split(':').map(x => parseInt(x));
                let quad = Math.floor(val[0]/groupSize)+Math.floor(val[1]/groupSize);
                quad%2 == 0? cell.classList.add('dark') : null; 
                res[quad]? res[quad].push(cell) : res[quad] = [];
            })
            return res;
        }
        else {
            console.error(`${groupSize} is not a divisor of ${this.series.length}, invalid!`);
            return undefined;
        }
    }
    /**
     * Create a key, illustrating the various colors used in the document. Uses the actual classes, so any changes to CSS are reflected in the key.
     * @param {string} parent 
     */
    this.makeKey = (parent = 'key') => {
        let par = document.querySelector(`#${parent}`);
        par.innerHTML = '';
        /**
         * Object to be made into a key.
         * key = Text
         * value = [className, tooltip]
         */
        let classes = {
            'Ordinal Invariance': ['invar',`Elements that are in the same position in the selected rows.`],
            'Literal Find': ['literalFind','Elements that are adjacent within a rowform.'],
            'Combinatorial Group': ['subGrp','Elements from the first <em>n</em>-chord of various rowforms that combine to form an aggregate.'],
            'Abstract Row': ['horizontalSC','Elements that are members of the same SC as the search query found L-R or R-L.'],
            'Abstract Column': ['verticalSC','Elements that are members of the same SC as the search query found U-D or D-U.'],
            'Abstract Bidirectional': ['bothSC','Elements that are members of the same SC as the search query in all directions.'],
            'Selected Form(s)': ['select','The cells that belong to the selected rowforms.'],
        };
        Object.entries(classes).forEach(([key,value]) => {
            let c = document.createElement('div');
            c.classList.add('cell');
            c.dataset.tooltip = `${value[1]}`;
            c.textContent = key;
            c.classList.add(value[0]);
            par.appendChild(c);
        })
    }
}

//Change querySelectorAll(`#${parent} > * > .cell....`)

////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Instance of the Matrix object, created upon DOM Content Loaded.
 */
let Z;
let F;

/**
 * Button Toggle
 * @param {} btn 
 */
function toggle (btn) {
    btn.classList.remove('abs','lit');
    if (btn.textContent == 'Literal') {
        btn.textContent = 'Abstract';
        btn.classList.add('abs');
    }
    else {
        btn.textContent = 'Literal';
        btn.classList.add('lit')
    }
}

document.addEventListener('DOMContentLoaded',(event) => {
    vis = window.vis = 0;
    console.log('LOAD');
    Z = window.Z = new Matrix();
    window.toggle = toggle;
    window.DisplayTypes = DisplayTypes;
    let Stravinsky = window.Stravinsky = [4,0,2,4,5,3,2,4,0,2,11];
    /**
     * Add single event listener to input div.
     */
    document.querySelector('#inputs').addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            /**
             * If the matrix needs to be redrawn or not.
             */
            let redrawMatrix = true;
            document.querySelectorAll('input').forEach(element => {
                if (element.id == 'universe' && element.value !== '') {
                    Z.universe = parseInt(element.value);
                }
                else if (element.id == 'series' && element.value !== '') {
                    Z.series = element.value.match(/[0-9]+/ig).map(x => parseInt(x));
                }   
                else if (element.id == 'search') {
                    if (element.value !== '') {
                        // console.log(`Search for [${element.value.match(/[0-9]+/ig).map(x => parseInt(x))}]`);
                        let literalSearch = document.querySelector('#searchType').textContent == 'Literal'? true : false;
                        Z.search(literalSearch,...element.value.match(/[a-z0-9]+/ig));
                        // console.log(`Search for ${literalSearch? 'literal' : 'set-class'} [${element.value.match(/[0-9]+/ig).map(x => parseInt(x))}]`)
                        redrawMatrix = false;
                        console.log('PRESERVE MATRIX');
                    }
                }
            })
            /**
             * Determine if the matrix must be redrawn or not.
             */
            if (redrawMatrix == true) {
                console.log(`REBUILD MATRIX`);
                Z.selectedLabels = [];
                Z.selectedRows = [];
                console.log(Z.series)
                Z.build(Z.universe,...Z.series);
            }
            else {
                console.log('LEAVE MATRIX')
                Z.update();
            }
        }
    })
    document.addEventListener('keydown',(event) => {
        if (event.key == 'c') {
            Z.universe = parseInt(document.querySelector('#universe').value);
            let arr = new Array(Z.universe).fill(0,0,Z.universe).map((i,j) => i+=j);
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
            Z.build(Z.universe,...shuffle(arr));
        }
        else if (event.key == 'ArrowRight') {
            Z.display = (Z.display+=1)%5;
            Z.changeDisplay(Z.display);
        }
        else if (event.key == 'ArrowLeft') {
            Z.display = (Z.display+=4)%5;
            Z.changeDisplay(Z.display);
        }
        /**
         * Populate the matrix with a random row from OpenMusicTheory's row library.
         */
        else if (event.key == 'r') {
            let rando = Library[Math.floor(Math.random()*(Library.length-1))];
            Z.build(12,...rando.Row);
            let par = document.querySelector('#cool');
            par.innerHTML = '';
            Object.entries(rando).forEach(([key,value]) => {
                let b = document.createElement('div');
                //b.classList.add();
                let lab = document.createElement('label');
                lab.textContent = `${key}:`;
                let info = document.createElement('div');
                info.textContent = value;
                b.appendChild(lab);
                b.appendChild(info);
                par.appendChild(b);
            })
        }
    })
    mouseTracking();
}) 

//[4,1,3,2,8,5,7,6,9,0,10,11];

/**
 * Chrome Devtools check for event listeners.
 */
// Array.from(document.querySelectorAll('*'))
//   .reduce(function(pre, dom){
//     var evtObj = getEventListeners(dom)
//     Object.keys(evtObj).forEach(function (evt) {
//       if (typeof pre[evt] === 'undefined') {
//         pre[evt] = 0
//       }
//       pre[evt] += evtObj[evt].length
//     })
//     return pre
//   }, {})


