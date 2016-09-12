#!/usr/local/bin/node --es_staging
"use strict";

const path   = require("path");
const fs     = require("fs");

const target = path.resolve(__dirname, "../grammars/viml.cson");

readStdin().then(vimSyntax => {
	const types = {
		commands:        "vimCommand",
		stdPlugins:      "vimStdPlugin",
		options:         "vimOption",
		autoCmd:         "vimAutoEvent",
		todo:            "vimTodo",
		groupName:       "vimGroup",
		highlightGroup:  "vimHLGroup",
		functions:       "vimFuncName",
		attribNames:     "vimHiAttrib|vimFgBgAttrib",
		colourNames:     "vimHiCtermColor"
	};
	
	const fileData = updateKeywords(types, vimSyntax, fs.readFileSync(target).toString());
	fs.writeFileSync(target, fileData);
});


/**
 * Parse Vim's syntax file for defined keywords and update Atom's syntax accordingly.
 *
 * @param {Object} types - A dictionary of named keyword-types
 * @param {String} vimSyntax - Contents of Vim's syntax file
 * @param {String} atomSyntax - Contents of Atom's grammar file
 * @return {String} Atom's syntax file, updated with the parsed keywords
 */
function updateKeywords(types, vimSyntax, atomSyntax){
	for(let i in types){
		let vimName  = types[i];
		let pattern  = new RegExp(`(^[\\x20\\t]*${i}:\\n(?:.+\\n)*?\\s+match:\\s*"(?:\\(\\?\\w+\\))?[^(]*\\().+?(\\).+$)`, "im");
		let keywords = compileKeywords(vimName, vimSyntax);
		atomSyntax   = atomSyntax.replace(pattern, `$1${keywords}$2`);
	}
	
	return atomSyntax;
}


/**
 * Construct a pipe-separated list of keywords found in Vim's syntax file.
 *
 * @param {String} type - The second argument of the "syn" call to match in Vim's syntax file
 * @param {String} input - Contents of Vim syntax
 * @return {String}
 */
function compileKeywords(type, input){
	let matches = [];
	input.replace(
		new RegExp("^\\s*syn\\s+keyword\\s+" + type + "\\s+contained\\s+(.+)$", "gm"),
		(line, match) => matches.push(match)
	);
	
	return matches
		.join(" ")
		.split(/\s+/g)
		.sort(new Intl.Collator().compare)
		.join("\n")
		.trim()
		.replace(/\n(.+)\n\1\n/g, "\n$1\n")
		.replace(/\[(\w)\]/g, "$1?")
		.replace(/^(\w+)\[(\w+)\]$/gm, "$1\n$1$2")
		.replace(/\n+/g, "|")
}


/**
 * Helper function to return the entirety of standard input.
 *
 * @return {Promise}
 */
function readStdin(){
	return new Promise(resolve => {
		let input = "";
		process.stdin.setEncoding("UTF8");
		process.stdin.on("readable", () => {
			const chunk = process.stdin.read();
			null !== chunk ? input += chunk : resolve(input);
		})
	});
}
