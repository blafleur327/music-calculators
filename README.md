My Music Theory Calculators:
=====================

This project is a component of my PhD (LSU 2026) dissertation on post-tonal music theory pedagogy and how visualization other than the score might increase understanding. 

My primary motivation for this project is to provide learners and experienced analysts access to a more intuition forward way of approaching post-tonal music theory.
Since my musical insterests often lie outside of the twelve-tone chromatic universe, all of these calculators except for the Neo-Riemannian one (for now!) permit larger and smaller universes.
This is to encourage G-SPACE analysis, beat-class, and microtonal exploration using the tools and terminology from pitch-class set theory and mathematical music theories. (But with a more pedagogical spin).

The aim of this program is to encourage learning and intuition about pitch/rhythmic structures that are perhaps not as easily understood by looking at the score itself.

This program is fully web based. The files are: JS, CSS, and HTML. I have included the Bravura.woff2 files to render certain music glyphs. The only library dependency is SVG.js, used to build some of the visualizations.

Included:
------
<ul>
  <li>A pitch-class/beat-class calculator centered around a clockface diagram. It includes results such as: Normal and Prime Form, Interval Class and Index Vector, and a Maximal Evenness check. It also permits superset and subset selection, with the subset allowing T<sub><em>n</em></sub>, T<sub><em>n</em></sub>I, and M<sub><em>n</em></sub> operations if the result is included in the prevailing superset.
  </li>
  <li>A serialism/matrix calculator that is searchable for adjacent elements or a specific set-class. It returns results for generalized n-chordal combinatoriality, derivation, and all-interval status. Row-form selection will highlight ordinal invariance between each of the selected forms. 
  </li>
  A glossary of terminology. Many of these definitions are my own, but often include examples and/or links to papers/webpages with additional information.
  <li>
  A rotational array calculator that permits alpha/beta and gamma/delta arrays from an input tonerow. 
  </li>
  <li>A Neo-Riemannian Flip-Flop Circle calculator that draws cycles of any length. It permits standard Schritt and Wechsel names {P,L,R,S,N,H,...} or Uniform Triad Transformations (UTT)s. It also compiles the associated pitch-class content, helping to connect the synthetic scales to the symmetrical harmonic progressions.
  </li>
</ul>

To you who have much more programming experience, these might look a bit lackluster. But I am constantly learning and revising them to increase functionality and improve design features.

If you find these tools useful, please share them with others!

