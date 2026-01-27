<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="context.css">
    <!-- <script type="text/javascript" src="silly.js"></script> -->
</head>
<body>
    <h1>Music Theory Calculators:</h1>
    <div id="main">
        <div class="sub">
            <h3>Purpose:</h3>
            <p>This project is a component of my PhD (LSU 2026) dissertation on post-tonal music theory pedagogy and how visualization other than the score might increase understanding.</p>
            <p>My primary motivation for this project is to provide learners and experienced analysts access to a more intuition forward way of approaching post-tonal music theory.
                Since my musical insterests often lie outside of the twelve-tone chromatic universe, all of these calculators except for the Neo-Riemannian one (for now!) permit larger and smaller universes.
                This is to encourage G-SPACE analysis, beat-class, and microtonal exploration using the tools and terminology from pitch-class set theory and mathematical music theories. (But with a more pedagogical spin).</p>
            <p>The aim of this program is to encourage an intuition forward approach to learning about pitch/rhythmic structures that are perhaps not as easily understood by looking at the score itself.</p>
            <p>This program is fully web based implementation is entirely JS, CSS, and HTML. I have included the Bravura.woff2 files to render certain music glyphs. The only library dependency is SVG.js, used to build some of the visualizations. To minimize any potential compatiblity issues, my repository hosts a stable copy of SVG.js3.2.5.</p>
        </div>
        <div class="sub">
            <h3>Calculator Descriptions:</h3>
        </div>
        <div class="sub">
            <h3>Current Features:</h3>
            <p></p>
            <ul>
                <li><a href="../PCSetCalculator/pc_set_calculator_v6.html">PC/BC Calculator:</a>
                    <ul>
                        <li>Support for two sets, superset and a contained subset. Includes T<sub><em>n</em></sub>,T<sub><em>n</em></sub>I, and M<sub><em>n</em></sub> transformations that are included within parent superset.</li>
                        <li>Complement of superset or subset.</li>
                        <li>Note Names (Stein-Zimmerman Accidentals) for {12, 24, 31}-EDO temperaments.</li>
                        <li>Results for:
                            <ul>
                                <li>Normal Form</li>
                                <li>Prime Form (Straus-Rahn Algorithm)</li>
                                <li>Interval Class Vector (Invariant Tones under T<sub><em>n</em></sub>)</li>
                                <li>Index Vector (Invariant Tones under T<sub><em>n</em></sub>I)</li>
                                <li>Maximal Evenness (Superset into Chromatic Universe and Subset into parent superset)</li>
                            </ul>
                        </li>
                        <li>Lines of Symmetry for superset and/or subset.</li>
                        <li>Cents Equal Temperament (cET) between selected elements of superset and/or subset.</li>
                    </ul>
                </li>
                <li><a href="../Matrix Calculator/serial_calculator_v3.html">Serialism Calculator:</a></li>
                    <ul>
                        <li>Supports any <em>n</em> x <em>n</em> matrix.</li>
                        <li>Literal and Abstract adjacency search.</li>
                        <li>Combinatoriality illustration.</li>
                        <li>Results for:
                            <ul>
                                <li>Derivation</li>
                                <li><em>n</em>-Chordal Combinatoriality (All divisors of universe)</li>
                                <li>All Interval Status</li>
                            </ul>
                        </li>
                    </ul>
                <li><a href="../Glossary/glossary.html">Glossary:</a></li>
                    <ul>
                        <li>Various music-theoretical terminology ranging from:
                            <ul>
                                <li>Pitch Class and Beat Class Set Theory</li>
                                <li>Transformational Music Theories</li>
                                <li>Tuning Theory</li>
                                <li>Scale Theory</li>
                            </ul>
                        </li>
                        <li>Links to external sources.</li>
                    </ul>
                <li><a href="../Rotational Arrays/rotational_arrays.html">Rotational Arrays:</a></li>
                    <ul>
                        <li>Partition a Tonerow into 2 distinct 1/2<em>k</em> rotational arrays.</li>
                        <li>Supports α/β (literal rotation) and γ/δ (transposed rotation).</li>
                        <li>Search rotations and verticals for adjacent elements.</li>
                    </ul>
                <li><a href="../UTT/utt.html">Flip-Flop Circles:</a></li>
                    <ul>
                        <li>Calculate Flip-Flop circles, Neo-Riemannian cycles using standard NRT transformations or UTTs.</li>
                    </ul>
                <li><a href="../Tonnetz/tonnetz.html">Isomorphic Keyboard/Generalized Tonnetz:</a></li>
                <ul>
                    <li>Visualizes a variety of Tonnetze layouts for 12- and 31-EDO including:
                        <ul>
                            <li>Triadic/Harmonic Table</li>
                            <li>Jankó</li>
                            <li>Wicki-Hayden</li>
                            <li>B- and C-System Accordion Layouts</li>
                            <li>Bosanquet-Wilson</li>
                        </ul>
                    </li>
                    <li>12-EDO and 31-EDO Triadic Tonnetze UTT or NRT chain support.</li>
                </ul>
            </ul>
        </div>
        <div class="sub">
            <h3>Future Plans:</h3>
            <p>Here are a few ideas I hope to implement in the future:</p>
            <ul>
                <li>PC/BC Calculator:
                    <ul>
                        <li>Note Names for more tuning systems including 13-EDT, 72-EDO, etc.</li>
                        <li>Helmholtz-Ellis Accidentals.</li>
                        <li>Audio playback using Tone.js.</li>
                        <li>SVG image download.</li>
                    </ul>
                </li>
                <li>Glossary:
                    <ul>
                        <li>More definitions and links.</li>
                    </ul>
                </li>
                <li>Flip-Flop Circles:
                    <ul>
                        <li>Support for non-tertian structures.</li>
                    </ul>
                </li>
                <li>Generalized Tonnetz:
                    <ul>
                        <li>Additional Tuning Systems.</li>
                        <li>Audio playback using Tone.js.</li>
                        <li>Multi-Color Schemes.</li>
                        <li>Chain Capabilities for layouts other than the Triadic/Harmonic Table.</li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="sub">
            <h3>Last Thoughts:</h3>
            <p>To you who have much more programming experience, you will notice minimal UX design. But I am constantly learning and revising them to increase functionality and improve design features.</p>
            <p>If you find these tools useful, please share them with others!</p>
        </div>
    </div>
    <footer></footer>
</body>
</html>
