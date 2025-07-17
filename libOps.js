
/**
 * Builds a library entry to be added to the library.
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

LibraryItem('Pitch Class','The set of all pitches under octave and enharmonic equivalence.','PC 0 = {C1,C2,C3...B#3,B#4...D♭♭4,D♭♭5...}','https://viva.pressbooks.pub/openmusictheory/chapter/pitch-and-pitch-class/');
LibraryItem('Set','A collection of distinct or unique items to be considered as a single entity. Items in the collection are known as elements. Usually denoted with curly braces {}.','{1,2,3,...} or {a,b,c,...} or {red,yellow,green,...}','https://www.cuemath.com/algebra/sets/');
LibraryItem('Maximal Evenness',`Generally, the closest a number of elements can get to an equilateral geometric distribution within the parent universe. More specifically, a musical collection is said to be maximally even if it contains intervals of only two sizes and is "as spread out as possible".`,'Diatonic Collection is the ME dist of 7 into 12.<br>Whole tone collection is the ME dist of 6 into 12.',"https://microtonal.miraheze.org/wiki/Maximal_evenness");
LibraryItem('Normal Order/Form','The rotation of the numerically ordered set within the tightest or smallest span. Usually denoted with hard brackets []. Some partial and all fully symmetrical sets have multiple valid Normal forms, conventionally the one starting on the lowest integer is chosen.','{0,3,7,11} => [11,0,3,7]','https://viva.pressbooks.pub/openmusictheory/chapter/pc-sets-normal-order-and-transformations/');
LibraryItem('Well-Formedness','In scale theory, a collection is well formed if it can be generated using a single specific interval.','Pentatonic generator = 5 or 7, cardinality 5 and the Diatonic generator = 5 or 7, cardinality 7.','https://www.jstor.org/stable/745935?seq=1');
LibraryItem('Subset','A set whose elements are all contained within a parent collection or superset.','{D,F,A} ⊆ {C,D,E,F,G,A,B}: in English, {D,F,A} is a subset or is equal to {C,D,E,F,G,A,B}');
LibraryItem('Superset','A set that contains another set and possibly more elements.','{C,D,E,F,G,A,B} ⊇ {D,F,A}: in English, {C,D,E,F,G,A,B} is a superset or equal to {D,F,A}');
LibraryItem('Complement',`The opposite collection of elements of a set with relation to it's superset.`,'In the 12 tone chromatic universe, the complement of the augmented triad {0,4,8} is {1,2,3,5,6,7,9,10,11} where the union (∪) of {0,4,8} and {1,2,3,5,6,7,9,10,11} completes the aggregate {0,1,2,3,4,5,6,7,8,9,10,11}');
LibraryItem('Literal Inclusion','See Subset.');
LibraryItem('Abstract Inclusion','A special inclusionary relationship, where not all or none of the literal elements are present, but the set-class or prime form is. One could read the example below as, "The B♭ major scale includes one or more instances of the prime form (0,3,7), but not necessarily {2,6,9}."','The D major triad is an Abstract Subset of the B♭ Major scale.');
LibraryItem('Cardinality Equals Variety',`A collection exhibits cardinality equals variety (cv) if any generic subset has <em>n</em> specific varieties.`,'In the diatonic collection, a generic set comprised of two thirds (triads) come in three varieties, major, minor, diminished. The entire collection of size 7, has 7 varieties, the 7 modes.','https://www.jstor.org/stable/843615?searchText=Variety+and+multiplicity+in+diatonic+systems&searchUri=%2Faction%2FdoBasicSearch%3FQuery%3DVariety%2Band%2Bmultiplicity%2Bin%2Bdiatonic%2Bsystems%26so%3Drel&ab_segments=0%2Fbasic_search_gsv2%2Fcontrol&refreqid=fastly-default%3A0d156298457903ea736ecf97b7fd5b69&seq=1');
LibraryItem('Cardinality','The size of a set, or the number of elements in a set. In mathematical contexts, usually denoted by a lowercase <em>k</em>.','{C,E,G} = cardinality of 3 or <em>k</em> = 3','')
LibraryItem('Invariance','The number of elements that map onto other elements contained within the set. Sets exhibiting symmetry will have complete invariance under some transformations.','{C,E,G#} => {T0,T4,T8,I0,I4,I8} => {C,E,G#}');
LibraryItem('Uniform Triadic Transformation','A Uniform Triadic Transformation or UTT is a generalization and expansion of the Schritt/Wechsel model in Neo-Riemannian Theory. It is expressed as an ordered triple <+/-,<em>a</em>,<em>b</em>> where the + indicates maintaining input quality and - inverts; <em>a</em> references the OPCI to transpose the root IF input is major, and <em>b</em> is the OPCI to transpose the root IF input is minor. A UTT is a Schritt if <+,<em>a</em>,b> where <em>a</em>+<em>b</em> = 12; and is a Wechsel if <-,<em>a</em>,<em>b</em>> where <em>a</em>+<em>b</em> = 12.','R = <-,9,3><br>L = <-,4,8><br>P = <-,0,0><br>S = <-,1,11><br>H = <-,8,4><br>N = <-,5,7>','https://www.jstor.org/stable/4147678');
LibraryItem('Interval','In post-tonal music theory a variety of interval types can be considered. <em>Unordered</em> intervals indicate that the directionality is not considered. [F to G AND G to F] is the same. By contrast an <em>ordered</em> interval requires directionality [F to G does not equal G to F]. Intervals can be <em>pitch intervals</em> in which the octave is considered or <em>pitch class intervals</em> where the octave is reduced out. This yeilds 4 combinations of intervals. {Ordered Pitch Intervals: OPI, Ordered Pitch Class Intervals: OPCI, Unordered Pitch Intervals: UPI, Unordered Pitch Class Intervals: UPCI (Also known as Interval Class)}','See Individual Entries for Each listed above.','https://viva.pressbooks.pub/openmusictheory/chapter/intervals-in-integer-notation/');
LibraryItem('Ordered Pitch Interval','OPI is the distance between two notes where the direction and octave are considered.','F5 to C4 = -17 and C5 to F4 = -7');
LibraryItem('Unordered Pitch Interval','UPI is the distance between two notes where the direction is not considered and the octave is. In short the absolute value of the OPI.','F5 to C4 = 17 and C5 to F4 = 7');
LibraryItem('Ordered Pitch Class Interval','OPCI is the distance between two notes where the direction is considered and the octave is not.','F5 to C4 = 5 and C5 to F4 = 7');//Check this one....
LibraryItem('Unordered Pitch Class Interval','UPCI is the distance between two notes where the direction and octave are not considered. Also known as Interval Class.','F5 to C4 = 5 and C5 to F4 = 5');
LibraryItem('Class','A collection of objects that share some characteristics, and are to be considered as one entity or equivalent in some way.','Set-Class, Pitch-Class, Interval-Class');
LibraryItem('Transposition',"Moving a collection of elements by a fixed distance. Typical notation is Tn where <em>n</em> is the OPCI to move all elements upward in pitch-class space. In tonal contexts, transposition maintains the collection's quality. Mathematically, this operation is equivalent to translation. In modular space, this appears visually as rotation.",'{C,E,G} under T<sub>4</sub> = {E,G#,B}');
LibraryItem('Inversion',"Moving a collection of elements across a fixed axis. Typical notation can either be I<em>n</em> or T<em>n</em>I where: In the I<em>n</em> notation <em>n</em> refers to the value to subtract from each pc in the given modular universe. (0-<em>n</em> = pc) and in T<em>n</em>I the set is first inverted about the vertical axis, then transposed by <em>n</em> units upward. The axis of inversion will lie at <em>n</em>(1/2). In tonal contexts, this operation does NOT maintain quality [Not the same as triadic inversion in tonal music]. Mathematically, this operation is equivalent to reflection.","{C,E,G} under I<sub>0</sub>/T<sub>0</sub>I = {C,A♭,F}");
LibraryItem('Prime Form',`The tightest packed to the left between the normal order or its inversion transposed to 0. The prime form is highly abstract, and as such is typically notated with parenthesis (). The prime form is often used to reference or confirm membership within an entire set-class.`,'{3,5,9} => (0,2,6)');
LibraryItem('Set-Class',`A group of sets that are equivalent under transposition and inversion. Since the prime form is a singular representation of sets equivalent under transposition and inversion, the prime form is often used to reference the set-class. The "Forte List" or more generally the "List of Set-Classes" is a comprehensive list of all unique set-classes within a given universe.`)
LibraryItem('Powerset',`The set of all subsets of a given collection. Mathematically, the powerset of a set P(<em>S</em>) is of the size 2<sup><em>n</em></sup>, which becomes a generation issue for larger supersets. Musically, the "List of Set-Classes" or the "Forte List" is the powerset of the 12-tone chromatic universe where every entry is reduced to prime form and duplicates are eliminated.`,'P(a,b,c) = {∅,{a},{b},{c},{a,b},{a,c},{b,c},{a,b,c}}');
LibraryItem('Z-relation',`Z-related sets (Zygonic relation) share the same intervallic structure (Interval Class Vector), but are not transpositionally or inversionally equivalent, that is they are NOT members of the same set-class and consequently have different prime forms.`,undefined,'https://www.proquest.com/docview/1175312582?fromopenview=true&parentSessionId=z%2FNUPAeEICP0GGzDBa19e6XNE7Z0CGaWuTJbP7AHTcE%3D&pq-origsite=gscholar&accountid=12154&sourcetype=Dissertations%20&%20Theses');
LibraryItem('Collection','Sometimes used interchangably with set. Generally theorists reserve this word for larger sets or synthetic scales.','OCT<sub>0,1</sub> = {0,1,3,4,6,7,9,10}<br>WT<sub>1</sub> = {1,3,5,7,9,11}');
LibraryItem('BE Number','A term of my own creation referring to the position of each entry through the process of binary enumeration (BE) of the powerset. After the powerset is constructed, each element is put in prime form, rendering an ordered list that is similar in structure to the more standard List of Set-Classes, or the Forte List. The two integers in the number correspond to cardinality and order within the powerset.','3-1 is the first three element set constructed in the powerset...{1,1,1,0,0,0,0,0,...}');
LibraryItem('Derivation','A tone row that is constructed of discrete smaller sets of the same set class, that is each consecutive <em>n</em>-chord has the same prime form. In standard contexts, the <em>n</em> value must be a divisor of the parent universe. All rows derived at the 1/2<em>k</em>-chord are also combinatorial under some serial operand.','<0, 3, 4, 6, 9, 10, 1, 2, 5, 7, 8, 11><br>Derived at 3-chord: (0,1,4).<br>Derived at 6-chord: (0,1,3,6,7,9).');
LibraryItem('Combinatoriality',"A row whose first <em>n</em>-chord can complete the aggregate with another <em>n</em>-chord from a different row form. In other words, the first half of a row is complemented by another set of adjacent elements from a different row form. One may determine the status of an <em>n</em>-chord's combinatoriality by checking the Interval Class and Index Vectors for values of 0 or universe/2. When looking at the ICV, 0 indicates P combinatoriality, universe/2 is R combinatoriality. When looking at the IV, 0 indicates I combinatoriality, universe/2 is RI combinatoriality.","Given the row <7, 0, 2, 6, 5, 10, 8, 11, 4, 9, 3, 1>:<br>P7.1 = [7,0,2,6,5,10] ∪ RI5.1 = [11,9,3,8,1,4] = 12-tone aggregate.<br>In english, The union of the first hexachord of P7 and the first hexachord of RI5 creates the complete 12-tone aggregate.");
LibraryItem('Just Intonation','A Just Intonation system is a relative system of tuning in which the only viable intervals are intervals within a set limit of partials within the harmonic series. The most common systems include Pythagorean (3-limit JI) where the 3rd partial (P5) is the highest permitted interval, the 5-Limit System where Intervals up to the 5th partial (M3) are permitted, and the 7-Limit System of which many Barber Shop quartets perform in (Permits the harmonic 7th). Notably, in JI systems, the octave cannot be closed by recursive application of any single interval. This means there are an infinite number of pitch variants that can result from using such a system.',undefined,'https://www.ethanhein.com/wp/2021/the-problem-with-just-intonation-a-visual-guide/')
LibraryItem('Cents','The term used in tuning to determine a percentage of deviation from a given 12-tET (12 tone equal-tempered) pitch. There are 1200 cents per octave, therefore the equal-tempered semitone is precicely 100\&cent. This term is often used when discussing microtonal deviations, but can easily cause misconceptions, as it is conceptually dependant upon a 12tET norm.');
LibraryItem('EDO (Equal Division of Octave)','A subset of equal-tempered systems that divide the octave (In mathematical terms the distances between elements can be expressed as some integer root of 2). Although EDO systems make up the majority of modern tempered tuning systems, notable exceptions exist including Bohlen-Pierce, which divides the 3rd partial sometimes referred to as the tritave (13th root of 3), or the Perfect 14th. Systems that divide the tritave into an equal number of parts are sometimes referred to as EDT temperaments.');

//Sort into alphabetical order
let temp = Object.entries(library).sort((a,b) => a[0].localeCompare(b[0]));
library = Object.fromEntries(temp);

document.addEventListener('DOMContentLoaded',() => {
    console.log('Loaded!');
    build();
})

//https://docs.cycling74.com/learn/series/max-tutorials/