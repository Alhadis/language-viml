altwerase
	" vi only. Select an alternate word erase algorithm.
autoindent, ai
	" Automatically indent new lines.
autoprint, ap
	" ex only. Display the current line automatically.
autowrite, aw
	" Write modified files automatically when changing files or suspending the editor session.
backup
	" Back up files before they are overwritten.
beautify, bf
	" Discard control characters.
cdpath
	" The directory paths used as path prefixes for the cd command.
cedit
	" Set the character to edit the colon command-line history.
columns, co
	" Set the number of columns in the screen.
comment
	" vi only. Skip leading comments in shell, C and C++ language files.
edcompatible, ed
	" Remember the values of the ‘c’ and ‘g’ suffixes to the s, & and ~ commands, instead of initializing them as unset for each new command.
escapetime
	" The tenths of a second ex/vi waits for a subsequent key to complete an ⟨escape⟩ key mapping.
errorbells, eb
	" ex only. Announce error messages with a bell.
expandtab, et
	" Expand ⟨tab⟩ characters to ⟨space⟩ when inserting, replacing or shifting text, autoindenting, indenting with ⟨control-T⟩, or outdenting with ⟨control-D⟩.
exrc, ex
	" Read the startup files in the local directory.
extended
	" Use extended regular expressions (EREs) rather than basic regular expressions (BREs).
	" See re_format(7) for more information on regular expressions.
filec
	" Set the character to perform file path completion on the colon command line.
flash
	" Flash the screen instead of beeping the keyboard on error.
hardtabs, ht
	" Set the spacing between hardware tab settings. This option currently has no effect.
iclower
	" Makes all regular expressions case-insensitive, as long as an upper-case letter does not appear in the search string.
ignorecase, ic
	" Ignore case differences in regular expressions.
keytime
	" The tenths of a second ex/vi waits for a subsequent key to complete a key mapping.
leftright
	" vi only. Do left-right scrolling.
lines, li
	" vi only. Set the number of lines in the screen.
list
	" Display lines in an unambiguous fashion.
lock
	" Attempt to get an exclusive lock on any file being edited, read or written.
magic
	" When turned off, all regular expression characters except for ‘^’ and ‘$’ are treated as ordinary characters. Preceding individual characters by ‘\’ re-enables them.
matchtime
	" vi only. The tenths of a second ex/vi pauses on the matching character when the showmatch option is set.
mesg
	" Permit messages from other users.
noprint
	" Characters that are never handled as printable characters.
number, nu
	" Precede each line displayed with its current line number.
octal
	" Display unknown characters as octal numbers, instead of the default hexadecimal.
open
	" ex only. If this option is not set, the open and visual commands are disallowed.
paragraphs, para
	" vi only. Define additional paragraph boundaries for the { and } commands.
path
	" Define additional directories to search for files being edited.
print
	" Characters that are always handled as printable characters.
prompt
	" ex only. Display a command prompt.
readonly, ro
	" Mark the file and session as read-only.
recdir
	" The directory where recovery files are stored.
remap
	" Remap keys until resolved.
report
	" Set the number of lines about which the editor reports changes or yanks.
ruler
	" vi only. Display a row/column ruler on the colon command line.
scroll, scr
	" Set the number of lines scrolled.
searchincr
	" Makes the / and ? commands incremental.
sections, sect
	" vi only. Define additional section boundaries for the [[ and ]] commands.
secure
	" Turns off all access to external programs. Once set this option can't be disabled.
shell, sh
	" Select the shell used by the editor.
shellmeta
	" Set the meta characters checked to determine if file name expansion is necessary.
shiftwidth, sw
	" Set the autoindent and shift command indentation width.
showmatch, sm
	" vi only. Note matching ‘{’ and ‘(’ for ‘}’ and ‘)’ characters.
showmode, smd
	" vi only. Display the current editor mode and a “modified” flag.
sidescroll
	" vi only. Set the amount a left-right scroll will shift.
tabstop, ts
	" This option sets tab widths for the editor display.
taglength, tl
	" Set the number of significant characters in tag names.
tags, tag
	" Set the list of tags files.
term, ttytype, tty
	" Set the terminal type.
terse
	" This option has historically made editor messages less verbose. It has no effect in this implementation.
tildeop
	" Modify the ~ command to take an associated motion.
timeout, to
	" Time out on keys which may be mapped.
ttywerase
	" vi only. Select an alternate erase algorithm.
verbose
	" vi only. Display an error message for every error.
w300
	" vi only. Set the window size if the baud rate is less than 1200 baud.
w1200
	" vi only. Set the window size if the baud rate is equal to 1200 baud.
w9600
	" vi only. Set the window size if the baud rate is greater than 1200 baud.
warn
	" ex only. This option causes a warning message to be printed on the terminal if the file has been modified since it was last written, before a ! command.
window, w, wi
	" Set the window size for the screen.
windowname
	" Change the icon/window name to the current file name even if it can't be restored on editor exit.
wraplen, wl
	" vi only. Break lines automatically, the specified number of columns from the left-hand margin. If both the wraplen and wrapmargin edit options are set, the wrapmargin value is used.
wrapmargin, wm
	" vi only. Break lines automatically, the specified number of columns from the right-hand margin. If both the wraplen and wrapmargin edit options are set, the wrapmargin value is used.
wrapscan, ws
	" Set searches to wrap around the end or beginning of the file.
writeany, wa
	" Turn off file-overwriting checks.
