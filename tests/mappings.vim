map! nac something " This is not a comment
echo nac something " This *is* a comment

map    lhs " rhs
	\ right-hand side
	\ extended across
	\ multiple
	\ lines.

nm     lhs " rhs
nmap   lhs " rhs
vm     lhs " rhs
vmap   lhs " rhs
xm     lhs " rhs
xmap   lhs " rhs
smap   lhs " rhs
om     lhs " rhs
omap   lhs " rhs
map!   lhs " rhs
im     lhs " rhs
imap   lhs " rhs
lm     lhs " rhs
lmap   lhs " rhs
cm     lhs " rhs
cmap   lhs " rhs
tma    lhs " rhs
tmap   lhs " rhs

cunmap lhs
iunmap lhs
nunmap lhs
ounmap lhs
unmap  lhs
vunmap lhs


" Angle-bracket notation
inoremap <CR> x<BS><CR>x<BS>
inoremap <up> x<BS><up>
inoremap <down> x<BS><down>
nnoremap o ox<BS>
nnoremap O Ox<BS>


" Remaining examples copied from Vim's “:help map” page
imap aa foo
imap aaa bar
map @@ foo
unmap @@ | print

unmap @@ 
" unmap @@  # Vim9 script comment (Not currently implemented)
unmap @@    " Legacy script comment
map <buffer>  ,w  /[.,;]<CR>
map <buffer>  ,w  /[#&!]<CR>
unmap <buffer> ,w
mapclear <buffer>
map <silent> ,h /Header<CR>
map <silent> ,h :exe ":silent normal /Header\r"<CR>
map <special> <F12> /Header<CR>
map <unique> ,w  /[#&!]<CR>
map ,w  /[#&!]<CR>
map <buffer> <unique> ,w  /[.,;]<CR>
inoremap <expr> . <SID>InsertDot()
func s:OpenPopup()
	call popup_create(... arguments ...)
	return "\<Ignore>"
endfunc
nnoremap <expr> <F3> <SID>OpenPopup()

func StoreColumn()
	let g:column = col('.')
	return 'x'
endfunc
nnoremap <expr> x StoreColumn()
nmap ! f!x
nmap ! f!<Ignore>x
inoremap <expr> <C-L> nr2char(getchar())
inoremap <expr> <C-L>x "foo"

let counter = 0
inoremap <expr> <C-L> ListItem()
inoremap <expr> <C-R> ListReset()

func ListItem()
	let g:counter += 1
	return g:counter .. '. '
endfunc

func ListReset()
	let g:counter = 0
	return ''
endfunc

noremap x <Cmd>echo mode(1)<CR>
nnoremap <F3> aText <Cmd>echo mode(1)<CR> Added<Esc>
