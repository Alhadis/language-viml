#!/usr/local/bin/node --es_staging
"use strict";

const path   = require("path");
const fs     = require("fs");

const target = "grammars/viml.cson";

readStdin().then(input => {
	fs.writeFileSync(target, fs.readFileSync(target)
		.toString()
		.replace(
			/(^[\x20\t]*commands:\n(?:.+\n)*?\s+match:\s*"[^(]*\().+?(\).+$)/im,
			`$1${ compileKeywords(input) }$2`
		));
});


function compileKeywords(input){
	let matches = [];
	input.replace(
		/^\s*syn\s+keyword\s+vimCommand\s+contained\s+(.+)$/gm,
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
