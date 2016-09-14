#!/usr/local/bin/node --es_staging
"use strict";

const fs    = require("fs");
const path  = require("path");


class VimSyntax{
	
	/**
	 * Begin a new keyword update.
	 *
	 * @param {Object} opts - Object holding filesystem paths
	 * @param {String} opts.atomSyntax - Local path to grammar file
	 * @param {String} opts.vimSyntax - Absolute path to Vim syntax
	 * @constructor
	 */
	constructor(opts = {}){
		const cwd     = process.cwd();
		let vimPath   = path.resolve(__dirname, opts.vimSyntax);
		let atomPath  = path.resolve(__dirname, opts.atomSyntax);
		
		let vimSyn    = fs.readFileSync(vimPath).toString();
		let atomSyn   = fs.readFileSync(atomPath).toString();
		let vimGroups = this.compile(vimSyn);
		atomSyn       = this.addMissingGroups(atomSyn, vimGroups);
		atomSyn       = this.updateLists(atomSyn, vimGroups);
		fs.writeFileSync(atomPath, atomSyn);
	}
	
	
	/**
	 * Assemble a dictionary of keyword-groups from Vim's source.
	 *
	 * @param {String} input - Contents of loaded syntax file
	 * @return {Object}
	 */
	compile(input){
		let match;
		let groups = {};
		const pattern = /^\s*syn\s+keyword\s+(\w+)\s+contained\s+([^\n]+)$/gm;
		const synOpts = /(?<=\s)(conceal|cchar|contained|containedin|nextgroup|transparent|skipwhite|skipnl|skipempty)(?:[\x20\t]*=(?:[^\s|\\]|\\.)*)?(?=\s|$|:|\\|)/g;
		while(match = pattern.exec(input)){
			let [, name, keywords] = match;
			if(undefined === groups[name])
				groups[name] = [];
			
			/** Strip :syntax options from each keyword line */
			keywords = keywords.replace(synOpts, "");
			groups[name].push(keywords);
		}
		
		/** Sanitise, filter, and parse each keyword list */
		for(let name in groups){
			groups[name] = Array.from(
				
				/* Filter duplicates */
				new Set(
					groups[name]
						.join(" ")
						.split(/\s+/g)
					).keys()
				
				/* Then sort and join with pipes */
				).sort(new Intl.Collator().compare)
				.join("\n")
				.trim()
				.replace(/\n(.+)\n\1\n/g, "\n$1\n")
				.replace(/\[(\w)\]/g, "$1?")
				.replace(/^(\w+)\[(\w+)\]$/gm, "$1\n$1$2")
				.replace(/\n+/g, "|");
		}
		return groups;
	}
	
	
	/**
	 * Append any missing groups to a block of grammar source.
	 *
	 * @param {String}  input - Loaded grammar source
	 * @param {Object} groups - Vim keyword-groups
	 * @return {String}
	 */
	addMissingGroups(input, groups){
		const table = /^((\t+)keywordLists\s*:\s*(?:#.*)?(?:\n\2\t+\S.*$|\n\s*$)*$\n\2\t+patterns\s*:\s*\[(?:\s*{)?\s*)((?:\n\2\t{2,}{[^}]+})+)(\n\2\t])/m;
		const tableMatch = input.match(table);
		
		if(tableMatch){
			let [match, start, tab, rows, end] = tableMatch;
			let {index} = tableMatch;
			let before  = input.substring(0, tableMatch.index);
			let after   = input.substring(tableMatch.index + match.length, input.length);
			
			let missing = Object.assign({}, groups);
			const row = /[{\s:,[]include\s*:\s*(?:(["'])#((?:(?!\1\\).|\\.)+)\1)\s*/g;
			while(match = row.exec(rows))
				delete missing[match[2]];
			
			for(let key of Object.keys(missing).sort()){
				rows += `\n${tab}\t\t{include: "#${key}"}`;
				
				/** Quote this key if we need to */
				let keySafe = !/^[$\w]+$/.test(key)
					? '"' + key.replace(/"/g, "\\\"") + '"'
					: key;
				
				if(new RegExp(`^${tab}${keySafe}\\s*:`, "gm").test(before + "\n\n" + after))
					console.warn(`Warning: Group "${key}" defined but not listed in #keywordLists`);
				
				else after += "\n\t" + keySafe + ":\n"
					+ tab + `\tname: "support.function.${key}.viml"\n`
					+ tab + `\tmatch: "\\\\b(_)\\\\b"\n`
			}
			
			input = before + start + rows + end + after;
		}
		
		else console.warn("Warning: `#keywordLists` not found in grammar! Returning input unmodified.");
		return input;
	}
	
	
	/**
	 * Update the actual capturing groups in the VimL grammar's expressions.
	 *
	 * @private
	 * @param {String}   atomSyn - Atom grammar source
	 * @param {Object} vimGroups - Sanitised dictionary of Vim keyword-groups
	 * @return {String}
	 */
	updateLists(atomSyn, vimGroups){
		for(const name in vimGroups){
			let list = "(^\\t(?:" + name + ")\\s*:\\s*(?:#.*$)?(?:\\n\\t{2}\\s*\\S+.*$|\\n\\s*$)*?\\n\\t{2}\\s*match\\s*:\\s*(['\"])(?:(?!\\2|[(\\\\]).|\\\\.)*)\\([^)]*\\)((?:(?!\\2|[(\\\\]).|\\\\.)*\\2)";
			atomSyn  = atomSyn.replace(
				new RegExp(list, "m"),
				(match, before, quote, after) => before + "(" + vimGroups[name] + ")" + after
			);
		}
		return atomSyn;
	}
}


/** Abort if the user hasn't specified a file */
const vimSyntax = process.argv[2];
if(!vimSyntax){
	const exe = path.join(path.basename(__dirname), path.basename(__filename));
	console.error(`Usage: ${exe} /path/to/vim.syntax`);
	process.exit(2);
}

new VimSyntax({atomSyntax: "../grammars/viml.cson", vimSyntax});
