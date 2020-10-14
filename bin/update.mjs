#!/usr/bin/env node

import fs   from "fs";
import path from "path";
import url  from "url";

// Resolve resource locations
const dirname     = path.dirname(url.fileURLToPath(import.meta.url));
const vimSource   = "https://raw.githubusercontent.com/vim/vim/master/runtime/syntax/vim.vim";
const vimPath     = path.resolve(dirname, "..", "tests/vim-syntax.vim");
const atomPath    = path.resolve(dirname, "..", "grammars/viml.cson");


load(vimSource).then(vimSyn => {
	fs.writeFileSync(vimPath, vimSyn);

	// Update Atom's grammar
	let atomSyn   = fs.readFileSync(atomPath).toString();
	const groups  = compile(vimSyn);
	const prevSyn = atomSyn;
	atomSyn       = addMissingGroups(atomSyn, groups);
	atomSyn       = updateLists(atomSyn, groups);

	// Nothing changed
	if(atomSyn === prevSyn){
		process.stderr.write("Already up-to-date.\n");
		return;
	}

	fs.writeFileSync(atomPath, atomSyn);
});



/**
 * Assemble a dictionary of keyword-groups from Vim's source.
 *
 * @param {String} input - Contents of loaded syntax file
 * @return {Object}
 */
function compile(input){
	let match;
	const groups  = {};
	const pattern = /^\s*syn\s+keyword\s+(\w+)\s+contained\s+([^\n]+)$/gm;
	const synOpts = /(?<=\s)(conceal|cchar|contained|containedin|nextgroup|transparent|skipwhite|skipnl|skipempty)(?:[\x20\t]*=(?:[^\s|\\]|\\.)*)?(?=\s|$|:|\\|)/g;
	while(match = pattern.exec(input)){
		let [, name, keywords] = match;
		if(undefined === groups[name])
			groups[name] = [];

		// Strip :syntax options from each keyword line
		keywords = keywords.replace(synOpts, "");
		groups[name].push(keywords);
	}

	// Sanitise, filter, and parse each keyword list
	for(const name in groups){
		const indent = "\t".repeat(3);
		groups[name] = "( " + (
			sortForRegExp(Array.from(new Set(groups[name].join(" ").split(/\s+/g)).keys()))
			.join("\n")
			.trim()
			.replace(/\n(.+)\n\1\n/g, "\n$1\n")
			.replace(/\[(\w)\]/g, "$1?")
			.replace(/^(\w+)\[(\w+)\]$/gm, "$1\n$1$2")
			.replace(/\n+/g, `\n${indent}| `)
			+ `\n${indent})`);
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
function addMissingGroups(input, groups){
	const table = /^((\t+)keywordLists\s*:\s*(?:#.*)?(?:\n\2\t+\S.*$|\n\s*$)*$\n\2\t+patterns\s*:\s*\[(?:\s*{)?\s*)((?:\n\2\t{2,}{[^}]+})+)(\n\2\t])/m;
	const tableMatch = input.match(table);

	if(tableMatch){
		let [match, start, tab, rows, end] = tableMatch;
		const before  = input.substring(0, tableMatch.index);
		let after     = input.substring(tableMatch.index + match.length, input.length);

		const missing = {...groups};
		const row = /[{\s:,[]include\s*:\s*(?:(["'])#((?:(?!\1\\).|\\.)+)\1)\s*/g;
		while(match = row.exec(rows))
			delete missing[match[2]];

		for(const key of Object.keys(missing).sort()){
			rows += `\n${tab}\t\t{include: "#${key}"}`;

			// Quote this key if we need to
			const keySafe = !/^[$\w]+$/.test(key)
				? '"' + key.replace(/"/g, "\\\"") + '"'
				: key;

			if(new RegExp(`^${tab}${keySafe}\\s*:`, "gm").test(before + "\n\n" + after))
				console.warn(`Warning: Group "${key}" defined but not listed in #keywordLists`);

			else after += "\n\t" + keySafe + ":\n"
				+ tab + `\tname: "support.function.${key}.viml"\n`
				+ tab + '\tmatch: """(?x) \\\\b\n'
				+ tab + "\t\t( _\n"
				+ tab + "\t\t) \\\\b\n"
				+ tab + '\t"""\n';
		}

		input = before + start + rows + end + after;
	}

	else console.warn("Warning: `#keywordLists` not found in grammar! Returning input unmodified.");
	return input;
}


/**
 * Update the actual capturing groups in the VimL grammar's expressions.
 *
 * @internal
 * @param {String}   atomSyn - Atom grammar source
 * @param {Object} vimGroups - Sanitised dictionary of Vim keyword-groups
 * @return {String}
 */
function updateLists(atomSyn, vimGroups){
	const patternFile   = path.resolve(dirname, "./match-field.regexp");
	const patternSource = fs.readFileSync(patternFile, "utf8");
	
	for(const name in vimGroups){
		atomSyn = atomSyn.replace(
			buildRegExp(patternSource, {name}),
			(_, prologue, quote, before, body, after, ...args) => {
				if(!quote) [quote, before,, after] = args;
				return prologue + quote + before + `${vimGroups[name]}` + after;
			}
		);
	}
	return atomSyn;
}



/**
 * Asynchronously load a resource.
 *
 * @param {String} url - URL or filesystem path
 * @param {String} encoding - Defaults to "utf8"
 * @return {Promise}
 * @public
 */
function load(url, encoding = "utf8"){
	return new Promise(async (resolve, reject) => {
		const protocol = url.match(/^https?/);

		// Remote resource: HTTPS or HTTP
		if(protocol){
			let result = "";
			const {get} = await import(protocol[0].toLowerCase());
			const request = get(url, response => {
				if(response.statusMessage !== "OK")
					return reject(response);
				encoding && response.setEncoding(encoding);
				response.on("data", s => result += s);
				response.on("end", () => resolve(result));
			});
			request.on("error", e => reject(e));
		}

		// Assume parameter to be a filesystem path
		else fs.readFile(url, {encoding}, (error, data) => {
			if(error) return reject(error);
			return resolve(data.toString());
		});
	});
}



/**
 * "Compile" expanded regular expression source into a new RegExp object.
 * @param {String} source
 * @param {Object} [variables={}]
 * @return {RegExp}
 */
function buildRegExp(source, variables = {}){
	let match = null;
	let flags = "";

	// Strip surrounding delimiters from beginning and end of file
	if("/" === source[0] && (match = source.match(/\/([a-z]*)\s*$/))){
		flags = match[1];
		source = source.substring(1, match.index);
	}
	
	// Strip comments and whitespace
	source = source.replace(/\(\?#[^)]*\)/g, "").replace(/\s+/g, "");
	
	// Interpolate "variables"
	for(const key in variables)
		source = source.replace(
			new RegExp(`\\$(?:{${key}}|${key})`, "g"),
			variables[key]
		);
	
	return new RegExp(source, flags);
}



/**
 * Order a list of strings for a RegExp capturing group.
 *
 * @version Alhadis/Utils@0f56a9a
 * @param {String|Array} input
 * @param {Boolean} [caseInsensitive=false]
 * @return {Array}
 */
function sortForRegExp(input, caseInsensitive = false){
	if(!Array.isArray(input))
		input = String(input).split("\n").filter(Boolean);
	return input.sort((a, b) => {
		if(caseInsensitive){
			a = a.toLowerCase();
			b = b.toLowerCase();
		}
		if(0 === b.indexOf(a)) return  1;
		if(0 === a.indexOf(b)) return -1;
		return a < b ? -1 : a > b;
	});
}
