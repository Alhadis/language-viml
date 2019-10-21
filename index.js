"use strict";

const VIM_MODELINE = /(?:(?:\s|^)vi(?:m[<=>]?\d+|m)?|[\t ]ex)(?=:(?=\s*set?\s[^\n:]+:)|:(?!\s*set?\s))(?:(?:\s|\s*:\s*)\w*(?:\s*=(?:[^\n\\\s]|\\.)*)?)*[\s:](?:filetype|ft|syntax)\s*=(\w+)(?=\s|:|$)/i;
const {CompositeDisposable, Disposable, TextEditor} = require("atom");

module.exports = {
	disposables: null,
	
	activate(){
		this.disposables && this.disposables.dispose();
		this.disposables = new CompositeDisposable(
			new Disposable(() => this.disposables = null),
			atom.packages.onDidActivateInitialPackages(() => {
				atom.workspace.observeTextEditors(this.isEditorVimHelp.bind(this));
			})
		);
	},
	
	deactivate(){
		if(this.disposables){
			this.disposables.dispose();
		}
	},
	
	isEditorVimHelp(editor){
		if(!atom.workspace.isTextEditor(editor))
			return false; // Not even a real editor
		
		const path = editor.getPath();
		if(/\.txt$/i.test(path) && VIM_MODELINE.test(editor.getText()) && "help" === RegExp.lastParen)
			editor.setGrammar(atom.grammars.grammarForScopeName("text.vim-help"));
	},
};
