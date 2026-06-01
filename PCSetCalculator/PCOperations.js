
import { PCset,Serialism,DisplayTypes,mouseTracking, MyDropdown, IntervalLookup, findIntervals, MySynth} from "../pcMethods.js";

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
     * @param {boolean} gcd
     */
    const coprime = (a,b,gcd = false) => {
        let aFact = new Set(factor(a));
        let bFact = new Set(factor(b));
        let temp = Math.max(...Array.from(aFact.intersection(bFact)));
        return gcd? temp: temp == 1;
    }

/**
 * Creates an instance of the drawing manager object. Maintains important information and methods for the SVG drawing.
 * @param {string} parent 
 */
function DrawingManager (parent = document.querySelector(`#drawing`)) {
    let sizeX = 500;
    let sizeY = 500;
    /**
     * Chromatic universe (modulus) for the drawing.
     */
    this.universe = null;
    /**
     * Property controlling the interval between adjacent clockface positions.
     */
    this.factor = 1;
    this.draw = SVG().addTo(parent).size(sizeX,sizeY);
    this.center = [sizeX/2,sizeY/2];
    /**
     * Attribute determining if multiple transformations can be selected at a time.
     */
    this.multitransform = true;
    /**
     * Object indexed by clockface position. Stores many important params.
     * @property {array} inner [x,y] 
     * @property {array} outer [x,y]
     * @property {svg.group element} svgGrp
     * @property {HTML Element} node
     * @property {int} status 0 = unselected; 1 = in superset; 2 = in subset; 
     * @property {int} val associated value of node. (scales with multiplicaiton)
     */
    this.referent = undefined;
    /**
     * Object storing the user entry.
     * @property {Object} subset 
     * @property {Object} superset 
     */
    this.sets = {
        'subset': null,
        'superset': null,
    }
    // this.synthManager = new MySynth();
    /**
     * Controls the display type, the visual format of the drawing.
     */
    this.display = 0;
    /**
    * Populates the relevant object references and draws the main polygon.
    * @param {array} center [x,y] 
    * @param {int} numPoints number of equidistant points
    * @param {float} length diameter length
    * @param {object} pass whether to preserve previous data or not.
    */
    this.populate = (center = this.center,numPoints = 12,length = 160,pass) => {
        this.universe = numPoints;
        this.referent = pass == undefined? {} : this.referent;
        let preserve = pass !== undefined;
        console.log(this.referent);
        let rel = document.querySelectorAll('#supersetSymm, #subsetSymm, #supersetCents, #subsetCents');
        console.log(rel)
        if (this.factor !== 1) {
            rel.forEach(item => item.classList.add('void'));
        }
        else {
            rel.forEach(item => item.classList.remove('void'));
        }
        document.querySelector('svg').innerHTML = '';
        document.querySelector('#results').innerHTML = '';
        //
        this.superPoly = this.draw.polygon();
        this.superPoly.stroke({width: '1px',color: 'black'}).fill('none');
        this.superPoly.center(this.center);
        this.superPoly.addClass('superPoly');
        this.subPoly = this.draw.polygon();
        this.subPoly.stroke({width: '1px',color: 'black'}).fill('none');
        this.subPoly.center(this.center);
        this.subPoly.addClass('subPoly');
        //
        let small = numPoints > 24;
        let outerScale = 1.34;
        let allAngles = 360/(numPoints)/2;      //(180*(numPoints-2))/numPoints is really interesting!
        for (let a = 0; a < numPoints*2; a++) {
            let fail = (a/2) >= this.universe/coprime(this.universe,this.factor,true);
            let angle = ((allAngles*coprime(this.universe,this.factor,true)*a) -90) * Math.PI/180  //-90 sets top element to 0; ADD MOD????
            let wideX = center[0] + length * outerScale * Math.cos(angle);
            let x = center[0] + length * Math.cos(angle);
            let wideY = center[1] + length * outerScale * Math.sin(angle);
            let y = center[1] + length * Math.sin(angle);
            let preStatus = preserve? this.referent[a/2]['status'] : 0;
            (a/2)%1 == 0? console.log(`${a/2}: ${fail? 'INVALID': 'DRAW'}`) : null;
            if (fail == false) {
                this.referent[a/2] = {
                'inner': [x,y],
                'outer': [wideX,wideY],
                'svgGrp': null,
                'node': null,
                'status': preStatus,
                'val': (this.factor*(a/2))%this.universe,
            }
            if (a % 2 == 0) {
                let text = null;
                /**
                 * Select the correct display type.
                 */
                switch (this.display) {
                    case 0:
                        text = this.referent[a/2]['val'];
                        break;
                    case 1:
                        text = (this.referent[a/2]['val']).toString(this.universe);
                        break;
                    case 2:
                        text = DisplayTypes['pitch'][this.universe][this.referent[a/2]['val']];
                        break;
                    case 3:
                        text = DisplayTypes['rhythm'][this.universe][this.referent[a/2]['val']];
                        break;
                }
                let gr = this.draw.group();
                this.referent[a/2]['svgGrp'] = gr;
                let cr = this.draw.circle(40,40).fill('white').stroke({color: 'black', width: '1px'}).center(0,0);
                let inText = this.draw.text(`${text}`).center(0,0);
                let outText = this.draw.text(`${text}`).center(...[wideX,wideY]);
                outText.addClass('outText');
                gr.add(cr);
                gr.add(inText);
                gr.center(...[x,y]);
                gr.add(outText);
                this.referent[a/2]['node'] = gr['node'];
                gr['node'].classList.add('myNode');
                gr['node'].id = `node${(a/2*this.factor)%this.universe}`;
                gr['node']['data-index'] = `${a/2}`;
                gr['node']['data-display'] = (a/2*this.factor)%this.universe;
                gr['node'].dataset.tooltip = `Click to select/deselect ${text}.`;//SET TOOLTIP
                if (small) {
                    inText['node'].classList.add('void');
                    gr['node'].classList.add('small');
                }
                else {
                    outText['node'].classList.add('void');
                }
            }
            }
        }
        preserve? this.update() : null;
    }
    /**
     * Updates the drawing based on this.referent data.
     */
    this.update = () => {
        Object.keys(this.sets).forEach(key => {
            this.sets[key] = {
                'elems': [],
                'MySet': null
            };
        });
        /**
         * Remove options upon update. Repopulate later.
         */
        D1? D1.removeOptions() : null;
        D2? D2.removeOptions() : null;
        D3? D3.removeOptions() : null;
        let rel = document.querySelectorAll('#supersetSymm, #subsetSymm, #supersetCents, #subsetCents');
        console.log(rel)
        if (this.factor !== 1) {
            rel.forEach(item => item.classList.add('void'));
        }
        else {
            rel.forEach(item => item.classList.remove('void'));
        }
        document.querySelectorAll('.subset, .superset, .transPoly, .centCircle, line').forEach(item => {
            /**
             * If item is a transformation polygon, remove it, else remove the class for subset or superset.
             */
            item.classList.contains('transPoly') || item.classList.contains('centCircle') || item.tagName == 'line'? item.remove() : item.classList.remove('subset','superset');
        })
        let superCoords = [];
        let subCoords = [];
        Object.keys(this.referent).forEach(key => {
            /**
             * Check if integer. (Main node.)
             */
            if (parseFloat(key)%1 == 0) {
                let rel = this.referent[key];
                // /**
                //  * Item in none.
                //  */
                if (rel.status == 0) {
                    rel['node'].classList.remove('subset','superset');
                }
                /**
                 * Item in superset
                 */
                if (rel.status == 1) {
                    rel['node'].classList.add('superset');
                    this.sets['superset']['elems'].push(rel.val);
                    superCoords.push(rel.inner);
                }
                /**
                 * Item in susbset
                 */
                else if (rel.status == 2) {
                    rel['node'].classList.add('subset');
                    this.sets['superset']['elems'].push(rel.val);
                    this.sets['subset']['elems'].push(rel.val);
                    superCoords.push(rel.inner);
                    subCoords.push(rel.inner);
                }
            }
        })
        this.sets['subset']['MySet'] = new PCset(this.universe,...this.sets['subset']['elems']);
        this.sets['superset']['MySet'] = new PCset(this.universe,...this.sets['superset']['elems']);
        this.superPoly.plot(superCoords);
        this.superPoly['node']['data-pcs'] = this.sets['superset']['elems'].join(',');
        this.subPoly.plot(subCoords);
        this.subPoly['node']['data-pcs'] = this.sets['subset']['elems'].join(',');
        //Populate Drops.
        let setClassRep = this.sets['subset']['MySet'].contained(this.sets['superset']['elems']);
        if (setClassRep) {
            D1 = new MyDropdown('transpose','TRANSPOSITION',this.transformation);
            D2 = new MyDropdown('invert','INVERSION',this.transformation);
            D3 = new MyDropdown('multiply','MULTIPLICATION',this.transformation);
            console.log('VALID');
            /**
             * Repopulate Dropdown Tn/TnI menus.
             */
            Object.entries(setClassRep).forEach(([key,value]) => {
                console.log(`${key} = ${JSON.stringify(key.match(/[I]+/ig))}`);
                let reconstruct = [key.match(/[T]+/ig)[0],`<sub>${key.match(/[0-9]+/ig)[0]}</sub>`,/[I]+/ig.test(key)? 'I' : ''];
                if (reconstruct[reconstruct.length-1] == 'I') {
                    D2.addOption(reconstruct.join(''),key,`Draw ${key} on the diagram.`);
                }
                else {
                    D1.addOption(reconstruct.join(''),key,`Draw ${key} on the diagram.`);
                }
            })
            /**
             * Repopulate M.
             */
            for (let a = 0; a < this.universe; a++) {
                D3.addOption(`M<sub>${a}</sub>`,`M${a}`);
            }
            D1.construct();
            D2.construct();
            D3.construct();
        }
        this.information();
    }
    /**
     * Returns an array of innerHTML for cents display.
     * @param {string} set 
     * @returns 
     */
    this.showCents = (set) => {
        let period = 2;
        let addRemove = null;
        let par = document.querySelector(`#${set}Cents`);
        if (par.classList.contains('selButton')) {
            par.classList.remove('selButton');
            addRemove = 0; 
        }
        else {
            this.sets[set]['elems'].length > 0? par.classList.add('selButton') : null;
            addRemove = 1;
        }
        let els = this.sets[set]['elems'].sort((a,b) => a-b);
        document.querySelectorAll('.centCircle').forEach(item => {
            item.remove();
        })
        /**
         * If only remove, break here.
         */
        if (addRemove == 0) {
            return;
        }
        //Close circle if larger than dyad.
        els.length > 2? els.push(els[0] == 0? this.universe : els[0]*this.universe) : null;
        let res = [];
        for (let a = 1; a < els.length; a++) {
            let x = Math.log2((100*period**(els[a]/this.universe))/(100*period**(els[a-1]/this.universe)))*1200;
            let coords = [this.referent[els[a-1]].inner,this.referent[els[a]%this.universe].inner];
            let midpoint = [([coords[0][0],coords[1][0]]).reduce((i,j) => i+=j)/2,([coords[0][1],coords[1][1]]).reduce((i,j) => i+=j)/2];
            let c = this.draw.circle(5);
            c.fill('none').stroke({color: 'black', width: '.1em'}).center(...midpoint);
            c['node'].dataset.tooltip = `${x.toFixed(4)}\&cent<br>${findIntervals(parseFloat(x.toFixed(4)))}`;
            c.addClass('centCircle');
            res.push(findIntervals(parseFloat(x.toFixed(4))));
        }
        return res;
    }
    /**
     * Create a polygon illustrating a PC transformation of the chosen set.
     * @param {string} transform Tn, TnI or Mn
     * @param {string} set  
     * @param {boolean} clear true = remove transformations false = keep.
     */
    this.transformation = (transform,set = 'subset',clear = !this.multitransform) => {
        console.log(`Transformation called for ${transform}...`);
        let degenerateMult = true;
        if (clear == true) {
            this.removeAllTransformations();
        }
        /**
         * If polygon does not exist, build it.
         */
        if (document.querySelector(`#${transform}poly`) == null) {
            console.log(`NO ${transform} in document: Draw #${transform}poly`);
            let transPoly = this.draw.polygon();
            transPoly.stroke({width: '.1em',color: 'rgba(152, 152, 152, 0.556)'}).fill('none');
            transPoly.center(this.center);
            transPoly.addClass('transPoly');
            transPoly['node'].id = `${transform}poly`;
            let rel = this.sets[set]['MySet'];
            let modified = `${transform.match(/[TM]+/ig)}<sub>${transform.match(/[0-9]+/ig)[0]}</sub>${/[I]+/ig.test(transform)? 'I' : ''}`;
            let obj = Object.values(this.referent);
            let mod = null;
            if (set == 'subset' || set == 'superset') {
                let tr = [];
                if (transform.match(/[T]+/ig)) {
                    mod = rel.setClass()[transform];
                    tr = obj.filter(x => mod.indexOf(x.val) !== -1 && x.node !== null);
                }
                else {
                    mod = rel.multiply(parseInt(transform.match(/[0-9]+/ig)[0]),degenerateMult);
                    tr = obj.filter(x => mod.indexOf(x.val) !== -1 && x.node !== null);
                }
                // console.log(tr)
                let sorted = tr.map(x => x.inner);
                transPoly['node'].dataset.tooltip = `{${this.sets[set]['MySet'].pcs}} under ${modified} = {${rel.setClass()[transform]? rel.setClass()[transform] : rel.multiply(parseInt(transform.match(/[0-9]+/ig)[0]),true)}}`;
                transPoly['node']['data-pcs'] = mod.join(',');
                transPoly.plot(sorted);
            }
            else {
                console.error(`${set} is not valid! Please select superset or subset.`);
            }
        }
        /**
         * If polygon already exists, remove it!
         */
        else {
            console.log(`Instance of #${transform}poly found! Remove from drawing.`);
            document.querySelector(`#${transform}poly`).remove();
        }
    }
    /**
     * Changes the display type of the clock.
     * @param {int} type 
     */
    this.changeDisplay = (type) => {
        this.display = type;
        this.populate(this.center,this.universe,160,this.referent);
    }
    /**
     * Draws a set based on direct input.
     * @param {int} universe 
     * @param {array} superset 
     * @param {array} subset 
     */
    this.specialDraw = (universe = this.universe,superset,subset = []) => {
        this.populate(this.center,universe);
        Object.values(this.referent).forEach(obj => {
            superset.forEach(index => {
                if (obj['val'] == index) {
                    obj['status'] = 1;
                }
            })
            subset.forEach(index => {
                if (obj['val'] == index) {
                    obj['status'] = 2;
                }
            })
        })
        this.update();
    }
    /**
     * Draws a combination cycle on the clock.
     * @param {int} modulus
     * @param  {...any} ints 
     */
    this.combinationCycle = (modulus = 12,...ints) => {
        let res = [0];
        let it = 1;
        while (res[res.length-1] < modulus) {
            ints.forEach(item => {
                res.push(res[res.length-1]+item);
            })
            it++;
        }
        this.specialDraw(modulus,res.slice(0,-1));
    }
    /**
     * Clears the drawing of all transformations and resets dropdowns selection status.
     */
    this.removeAllTransformations = () => {
        document.querySelectorAll('.transPoly, .ddownSelect, .inTrans').forEach(item => {
            if (item.classList.contains('ddownSelect') || item.classList.contains('inTrans')) {
                item.classList.remove('ddownSelect','inTrans');
            }
            else {
                item.remove();
            }
        })
    }
    /**
     * Illustrates the symmetry of the input set.
     * @param {string} set superset || subset
     */
    this.drawSymmetry = (set) => {
        let par = document.querySelector(`#${set}Symm`);
        let addRemove = null;
        if (par.classList.contains('selButton')) {
            par.classList.remove('selButton');
            addRemove = 0;
        }
        else {
            this.sets[set]['elems'].length > 0? par.classList.add('selButton') : null;
            addRemove = 1;
        }
        document.querySelectorAll('line').forEach(item => {
            item.remove();
        })
        if (addRemove == 0) {
            return;
        }
        let rel = null;
        if (set == 'superset' || set == 'subset') {
            rel = this.sets[set]['MySet'];
        }
        else {
            console.error('NOT VALID!');
        }
        let coords = rel.symmetry();
            coords.forEach(pair => {
                let l = this.draw.line().stroke({color: set == 'subset'? 'blue' : 'red', width: '.1em',dasharray:'4 4'});
                console.log(`${pair[0]}-${pair[1]}`)
                l.plot(...this.referent[pair[0]].outer,...this.referent[pair[1]].outer);
            })
    }
    /**
     * Clears the selcted elements and drawn polygons from the drawing.
     */
    this.clear = () => {
        document.querySelectorAll('.transPoly').forEach(item => {
            item.remove();
        })
        Object.keys(this.referent).forEach(node => {
            if (parseFloat(node)%1 == 0) {
                this.referent[node].status = 0;
            }
        })
        this.update();
    }
    /**
     * Draws the opposite of the specified set.
     * @param {string} set 
     */
    this.drawComplement = (set) => {
        Object.entries(this.referent).forEach(([key,value]) => {
            if (parseFloat(key)%1 == 0) {
                let val = value.status;
                if (set == 'superset') {
                    value.status = val > 0? 0 : 1;
                }
                else if (set == 'subset') {
                    if (val == 1) {
                        value.status = 2;
                    }
                    else if (val == 2) {
                        value.status = 1;
                    }
                }
            }
        })
        this.removeAllTransformations();
        this.update();
    }
    /**
     * Populates the information section including normal form, prime form, etc.
     */
    this.information = () => {
        let par = document.querySelector('#results');
        par.innerHTML = '';
        let included = ['Normal','Prime','ICV','IV','DoS','DF','ME'];
        (Object.entries(this.sets).reverse()).forEach(([key,value]) => {
            let main = document.createElement('div');
            let h = document.createElement('h4');
            h.textContent = `${key.toLocaleUpperCase()}`;
            main.appendChild(h);
            let setRep = value['MySet'];
            included.forEach(spec => {
                let big = document.createElement('div');
                big.classList.add('semi');
                let c = document.createElement('p');
                let d = document.createElement('div');
                d.classList.add('row');
                switch (true) {
                    case (spec == 'Normal'):
                        c.textContent = 'Normal Form';
                        d.textContent = `[${setRep.normalOrder()}]`;
                        c.dataset.tooltip = 'Normal Order is the tightest rotation of the numerical ordered PCs.';
                        break;
                    case (spec == 'Prime'):
                        c.textContent = 'Prime Form';
                        c.dataset.tooltip = `Prime Form is the leftwise 'tightest packing' between the Normal Form or its inversion. The result is then transposed to 0.`;
                        d.textContent = `(${setRep.primeForm()})`;
                        break;
                    case (spec == 'ICV' || spec == 'IV'):
                        let small = spec == 'ICV'? setRep.intervalClassVector() : setRep.indexVector();
                        c.textContent = spec == 'ICV'? 'Interval Class Vector' : 'Index Vector';
                        if (spec == 'ICV') {
                            c.dataset.tooltip = 'The interval-class vector is the total interval content for a set. It can be used to determine the number of invariant tones under a given transpositional index.';
                        }
                        else {
                            c.dataset.tooltip = 'The index vector shows invariant tones under a given inversional index.';
                        }
                        for (let a = 0; a < small.length; a++) {
                            let z = document.createElement('div');
                            z.classList.add('hov');
                            if (small.length == 1) {
                                z.textContent = `${String.fromCharCode(0x2329)}${small[a]}${String.fromCharCode(0x232a)}`;
                            }
                            else {
                                if (a == 0) {
                                    z.textContent = `${String.fromCharCode(0x2329)}${small[a]},`
                                }
                                else if (a == small.length-1) {
                                    z.textContent = `${small[a]}${String.fromCharCode(0x232a)}`;
                                }
                                else {
                                    z.textContent = `${small[a]},`;
                                }
                            }
                            z.dataset.tooltip = spec == 'ICV'? `${small[a]} instance${small[a] == 1? '' : 's'} of OPCI ${a+1}:${this.universe-(a+1)}.` : `${small[a]} instance${small[a] == 1? '' : 's'} of OPCI ${a}. `;
                            d.appendChild(z);
                        }
                        break;
                    case (spec == 'DoS'):
                        c.textContent = 'Degree of Symmetry';
                        c.dataset.tooltip = `A tuple [a,b] where a is the number of self-mapping T<sub><em>n</em></sub> operators and b is the number of self-mapping T<sub><em>n</em></sub>I operators.`;
                        let temp = setRep.degreeOfSymmetry();
                        for (let a = 0; a < temp.length; a++) {
                            let z = document.createElement('div');
                            z.classList.add('hov');
                            if (a == 0) {
                                z.textContent = `[${temp[a]},`;
                                z.dataset.tooltip = `${temp[a]} self-mapping T<sub><em>n</em></sub> operands.`;
                            }
                            else {
                                z.textContent = `${temp[a]}]`;
                                z.dataset.tooltip = `${temp[a]} self-mapping T<sub><em>n</em></sub>I operands.`;
                            }
                            d.appendChild(z);
                        }
                        break;
                    case (spec == 'DF'):
                        c.textContent = `Distinct Forms`;
                        c.dataset.tooltip = `The number of unique members of this set-class.`;
                        d.textContent = `${setRep.distinctForms()}`;
                        break;
                    case (spec == 'ME'):
                        let bigSmall = [];
                        c.textContent = `Maximal Even Distribution of ${setRep.pcs.length} into ${key == 'subset'? this.sets['superset']['elems'].length : this.universe}`;;
                        c.dataset.tooltip = `Determines if the input is 'as spread out as possible' within the parent modulus. In other words, as close to an equilateral polygon as possible.`;
                        let duh = null;
                        if (key == 'subset') {
                            duh = setRep.modulusConvert(this.sets['superset']['elems'].length).maximallyEven();
                            d.dataset.tooltip = `Determines if {${setRep.pcs} is the ME distribution of ${setRep.pcs.length} into ${this.sets['superset']['elems'].length}`
                        }
                        else {
                            duh = setRep.maximallyEven();
                        }
                        d.textContent = duh;
                        break;
                }
                big.appendChild(c);
                big.appendChild(d);
                main.appendChild(big);
            })
            par.appendChild(main); 
        }) 
    }
}

////////////////////////////////////////////////////////////////////

let F;
let D1;
let D2;
let D3;

document.addEventListener('DOMContentLoaded',() => {
    /**
    * An object storing the vairous chords used in Pareidolia
    */
    let Pareidolia = window.Pareidolia = {
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
    console.log('LOADED');
    alert('Use left and right arrow keys to change display type.');
    F = window.F = new DrawingManager();
    F.populate(undefined,undefined);
    let targ = document.querySelector('#universe');
    targ.addEventListener('keydown',(event) => {
        if (event.key == 'Enter') {
            let spl = targ.value.match(/[0-9]+/ig);
            console.log(`SUBMITTED: ${spl}`)
            F.universe = parseInt(spl[0]);
            let change = F.universe == parseInt(spl[0]);
            if (spl.length > 1 && change == false) {
                F.factor = parseInt(spl[1]);
                F.populate(undefined,parseInt(spl[0]),160,F.referent);
            }
            else if (change && spl.length > 1) {
                F.factor = parseInt(spl[1]);
                F.populate(undefined,parseInt(spl[0]),160,undefined);
            }
            else if (spl.length == 1) {
                F.factor = 1;
                F.populate(undefined,parseInt(spl[0]),160);
            }
        }
    })
    document.querySelector('#drawing').addEventListener('mousedown',(event) => {
        /**
         * If a node is clicked, perform the associated operation.
         */
        if (event.target.classList.contains('myNode') || event.target.parentNode.classList.contains('myNode') || event.target.parentNode.parentNode.classList.contains('myNode')) {
            let ref = null;
            if (event.target.classList.contains('myNode')) {
                ref = event.target;
            }
            else if (event.target.parentNode.classList.contains('myNode')) {
                ref = event.target.parentNode
            }
            else if (event.target.parentNode.parentNode.classList.contains('myNode')) {
                ref = event.target.parentNode.parentNode;
            }
            let relevant = F.referent[ref['data-index']];
            if (event.button == 0) {
                relevant['status'] = (relevant['status']+1)%3;
            }
            else if (event.button == 2) {
                relevant['status'] = (relevant['status']+2)%3;
            }
            F.update();
        }
        /**
         * If a polygon is clicked, play the related PCs successively.
         */
        else if (event.target.tagName == 'polygon') {
            let clean = event.target['data-pcs'].match(/[0-9]+/ig).map(x => parseInt(x));
            if (F.display < 3) {
                F.synthManager.playSuccessive(...clean.map(x => F.synthManager.middleC*2**(x/F.universe)));
            }
            else {
                F.synthManager.playDuration(...clean);
            }
        }
    })
    /**
     * Shortcut Button Commands.
     */
    document.addEventListener('keydown',(event) => {
        if (event.key == 'Backspace') {
            F.removeAllTransformations();
        }
        else if (event.key == 'ArrowRight') {
            F.changeDisplay(F.display = (F.display+1)%4);
        }
        else if (event.key == 'ArrowLeft') {
            F.changeDisplay(F.display = (F.display+3)%4);
        }
    })
    mouseTracking();
})

