Change Log
==========

This project adheres to [Semantic Versioning](http://semver.org/).


[v1.1.3]
------------------------------------------------------------------------
**December 28th, 2016**  
* __Added:__ Keywords for Vim 8.0-01


[v1.1.2]
------------------------------------------------------------------------
**September 18th, 2016**  
* __Fixed:__ Broken link to readme's banner image
* __Fixed:__ Small bug with handling modelines


[v1.1.1]
------------------------------------------------------------------------
**September 16th, 2016**  
* __Added:__ Missing keywords not picked up by updater script
* __Fixed:__ Options incorrectly highlighted in syntax definitions


[v1.1.0]
------------------------------------------------------------------------
**September 16th, 2016**  
Substantial improvements made to language highlighting.

__Added:__
*   All keywords as of Vim 8.0
*   Editor settings for adjusting indent/outdent
*   First-line support for hashbangs/modelines
*   Highlighting for:
	- Exponential notation
	- Fold markers: `{{{`
	- Function headers
	- Hexadecimal numbers
	- Syntax definitions
	- Scope indicators: `g:name`
	- Vim modelines
	- Way too many other things
*   Support for `nvimrc` and `_vimrc` files

__Bugs fixed:__
*   Trailing comments no longer highlighted as strings occasionally
*   `#` is now matched in function names


[v1.0.0]
------------------------------------------------------------------------
**May 13th, 2016**  
Package transferred to a [new maintainer](https://github.com/Alhadis).
Highlighting for additional function names added, and minor errors fixed.

* __Added:__ Matching for all recognised Vim commands (as of v7.4-50)
* __Added:__ This changelog
* __Fixed:__ Looping-rule error for variable patterns
* __Fixed:__ Hex sequences now match case-insensitively
* __Fixed:__ Numerals in identifiers no longer highlighted
* __Fixed:__ Strings like `~/.vim/` no longer marked as regex



[v0.3.0]
------------------------------------------------------------------------
**December 22nd, 2015**  
Added support for toggling comment-lines.



[v0.2.0]
------------------------------------------------------------------------
**July 24th, 2014**  
Minor improvements made to pattern-matching and filename recognition.

* __Fixed:__ Incorrectly-highlighted sequences in literal strings
* __Added:__ Support for `.vimrc` and `.gvimrc` extensions



[v0.1.0]
------------------------------------------------------------------------
**February 28th, 2014**  
Initial release, converted from skammer's [TextMate bundle][1].
[1]: https://github.com/skammer/textmate-viml


[Referenced links]:_____________________________________________________
[Unpublished]: ../../compare/v1.1.3...HEAD
[v1.1.3]: https://github.com/Alhadis/language-viml/releases/tag/v1.1.3
[v1.1.2]: https://github.com/Alhadis/language-viml/releases/tag/v1.1.2
[v1.1.1]: https://github.com/Alhadis/language-viml/releases/tag/v1.1.1
[v1.1.0]: https://github.com/Alhadis/language-viml/releases/tag/v1.1.0
[v1.0.0]: https://github.com/Alhadis/language-viml/releases/tag/v1.0.0
[v0.3.0]: https://github.com/Alhadis/language-viml/releases/tag/v0.3.0
[v0.2.0]: https://github.com/Alhadis/language-viml/releases/tag/v0.2.0
[v0.1.0]: https://github.com/Alhadis/language-viml/releases/tag/v0.1.0
