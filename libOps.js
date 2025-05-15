
/**
 * Builds a library entry
 * @param {} term 
 * @param {*} definition 
 * @param {*} example
 * @param {} furtherReading 
 */
function LibraryItem (term,definition,example,furtherReading) {
    this.term = term;
    this.definition = definition;
    this.example = example?  example : 'N/A';
    this.external = furtherReading? furtherReading : 'N/A';
    library[this.term] = {
        'definition': this.definition,
        'example': this.example,
        'link': this.external
    }
}

let library = {}

const build = (obj = library) => {
    let termList = document.getElementById('terms');
    let defs = document.getElementById('display');
    defs.classList.add('void');
    for (let [key,value] of Object.entries(obj)) {
        console.log(`${key}?`);
        let term = document.createElement('li');
        term.innerHTML = `${key}:`;
        termList.append(term);
        term.addEventListener('mousedown',() => {
            /**
             * Clear display if not empty.
             */
            defs.innerHTML = '';
            defs.classList.remove('void');
            let title = document.createElement('h4');
            title.classList.add('emphasis');
            title.innerHTML = `${key}:`;
            defs.append(title);
            for (let [k,v] of Object.entries(value)) {
                let div = document.createElement('div');
                let head = document.createElement('h4');
                head.innerHTML = `${k.toUpperCase()}:`;
                div.appendChild(head);
                div.classList.add('mini');
                if (k == 'link') {
                    let lin;
                    if (v == 'N/A') {
                        lin = document.createElement('p');
                        lin.innerHTML = 'N/A';
                    }
                    else {
                        lin = document.createElement('a');
                        lin.setAttribute('href',`${v}`);
                        lin.setAttribute('id',`${k}`);
                        lin.innerHTML = `Further Reading`;
                    }
                    div.append(lin);
                }
                else {
                    let small = document.createElement('p');
                    div.setAttribute('id',`${k}`);
                    if (k == 'example') {
                        small.innerHTML = `${v}`; 
                    }
                    else {
                        small.innerHTML = `${v}`;
                    }  
                    div.appendChild(small);
                }
                defs.append(div);             
            }
        })
    }
}

LibraryItem('Pitch Class','The set of all pitches under octave and enharmonic equivalence.','PC 0 = {C1,C2,C3...B#3,B#4...Dbb4,Dbb5...}','https://viva.pressbooks.pub/openmusictheory/chapter/pitch-and-pitch-class/');
LibraryItem('Set','A collection of distinct or unique items to be considered as a single entity. Items in the collection are known as elements. Usually denoted with curly braces {}.','{1,2,3,...} or {a,b,c,...} or {red,yellow,green,...}','https://www.cuemath.com/algebra/sets/');
LibraryItem('Maximal Evenness',"Generally, the closest a number of elements can get to an equilateral geometric distribution within the parent universe. More specifically, a musical collection is said to be maximally even if it contains intervals of only two sizes and is 'as spread out as possible'.",'Diatonic Collection ME dist of 7 into 12. Whole tone colelction ME dist of 6 into 12.',"https://microtonal.miraheze.org/wiki/Maximal_evenness");
LibraryItem('Normal Order','The rotation of the numerically ordered set within the tightest or smallest span. Usually denoted with hard brackets []. Some partial and all fully symmetrical sets have multiple valid Normal forms, conventionally the one starting on the lowest integer is chosen.','{0,3,7,11} => [11,0,3,7]','https://viva.pressbooks.pub/openmusictheory/chapter/pc-sets-normal-order-and-transformations/');
LibraryItem('Well-Formedness','In scale theory, a collection is well formed if it can be generated using a single specific interval.','Pentatonic generator = 5 or 7, cardinality 5 and the Diatonic generator = 5 or 7, cardinality 7.','https://www.jstor.org/stable/745935?seq=1');
LibraryItem('Subset','A set whose elements are all contained within a parent collection or superset.','{D,F,A} ⊆ {C,D,E,F,G,A,B}: in English, {D,F,A} is a subset or is equal to {C,D,E,F,G,A,B}');
LibraryItem('Superset','A set that contains another set and possibly more elements.','{C,D,E,F,G,A,B} ⊇ {D,F,A}: in English, {C,D,E,F,G,A,B} is a superset or equal to {D,F,A}');
LibraryItem('Complement',`The opposite collection of elements of a set with relation to it's superset.`,'In the 12 tone chromatic universe, the complement of the augmented triad {0,4,8} is {1,2,3,5,6,7,9,10,11} where the union (∪) of {0,4,8} and {1,2,3,5,6,7,9,10,11} completes the aggregate {0,1,2,3,4,5,6,7,8,9,10,11}');
LibraryItem('Literal Inclusion','See Subset.');
LibraryItem('Abstract Inclusion','A special inclusionary relationship, where not all or none of the literal elements are present, but the set-class or prime form is. One could read the example below as, "The B♭ major scale includes one or more instances of the prime form (0,3,7), but not necessarily {2,6,9}."','The D major triad is an Abstract Subset of the B♭ Major scale.');
LibraryItem('Cardinality Equals Variety',`A collection exhibits cardinality equals variety (cv) if any generic subset has n specific varieties.`,'In the diatonic collection generic set comprised of two thirds (triads) come in three varieties, major, minor, diminished. The entire collection of size 7, has 7 varieties, the 7 modes.','https://www.jstor.org/stable/843615?searchText=Variety+and+multiplicity+in+diatonic+systems&searchUri=%2Faction%2FdoBasicSearch%3FQuery%3DVariety%2Band%2Bmultiplicity%2Bin%2Bdiatonic%2Bsystems%26so%3Drel&ab_segments=0%2Fbasic_search_gsv2%2Fcontrol&refreqid=fastly-default%3A0d156298457903ea736ecf97b7fd5b69&seq=1');
LibraryItem('Cardinality','The size of a set, or the number of elements in a set. In mathematical contexts, usually denoted by a lowercase k.','{C,E,G} = cardinality of 3','')
LibraryItem('Invariance','The number of elements that map onto other elements contained within the set. Sets exhibiting symmetry will have complete invariance under some transformations.','{C,E,G#} => {T0,T4,T8,I0,I4,I8} => {C,E,G#}');
LibraryItem('Uniform Triadic Transformation','A Uniform Triadic Transformation or UTT is a generalization of the Schritt/Wechsel model in Neo-Riemannian Theory. It is expressed as an ordered triple <+/-,a,b> where the + indicates maintaining input quality and - inverts; a references the OPCI to transpose the root IF input is major, and b is the OPCI to transpose the root IF input is minor. A UTT is a Schritt if <+,a,b> where a+b = 12; and is a Wechsel if <-,a,b> where a+b = 12.','R = <-,9,3><br>L = <-,4,8><br>P = <-,0,0>','https://www.jstor.org/stable/4147678');
LibraryItem('Interval','In post-tonal music theory a variety of interval types can be considered. <em>Unordered</em> intervals indicate that the directionality is not considered. [F to G OR G to F] is the same. By contrast an <em>ordered</em> interval requires directionality [F to G does not equal G to F]. Intervals can be <em>pitch intervals</em> in which the octave is considered or <em>pitch class intervals</em> where the octave is reduced out. This yeilds 4 combinations of intervals. {Ordered Pitch Intervals: OPI, Ordered Pitch Class Intervals: OPCI, Unordered Pitch Intervals: UPI, Unordered Pitch Class Intervals: UPCI (Also known as Interval Class)}','See Individual Entries for Each listed above.','https://viva.pressbooks.pub/openmusictheory/chapter/intervals-in-integer-notation/');
LibraryItem('Ordered Pitch Interval','OPI is the distance between two notes where the direction and octave are considered.','F5 to C4 = -17 and C5 to F4 = -7');
LibraryItem('Unordered Pitch Interval','UPI is the distance between two notes where the direction is not considered and the octave is. In short the absolute value of the OPI.','F5 to C4 = 17 and C5 to F4 = 7');
LibraryItem('Ordered Pitch Class Interval','OPCI is the distance between two notes where the direction is considered and the octave is not.','F5 to C4 = 5 and C5 to F4 = 7');//Check this one....
LibraryItem('Unordered Pitch Class Interval','UPCI is the distance between two notes where the direction and octave are not considered.','F5 to C4 = 5 and C5 to F4 = 5');

//Sort into alphabetical order
let temp = Object.entries(library).sort((a,b) => a[0].localeCompare(b[0]));
library = Object.fromEntries(temp);

document.addEventListener('DOMContentLoaded',() => {
    console.log('Loaded!');
    build();
})

//https://docs.cycling74.com/learn/series/max-tutorials/
