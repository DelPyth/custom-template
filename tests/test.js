// This file should NOT be run manually. Use npm test in the console in the same directory as 'package.json'.


// Import the function.
const template = require("..\\index.js");
const fs = require('fs');

// Use the current work directory.
const cwd = process.cwd() + "\\tests";

// Delete previous tests.
try {fs.unlinkSync(cwd + '\\results\\test01.txt');} catch (err) {}
try {fs.unlinkSync(cwd + '\\results\\test02.txt');} catch (err) {}

// Expected:
//	Create new file at "results\test01.txt"
//	Replace the line with `<current_file>` with `test_template.txt`
template({
	template: cwd + '\\test_template.txt',
	output: cwd + '\\results\\test01.txt',
	vars:
	{
		current_file: 'test_template.txt',
	},
	replacer: function(index, text, vars)
	{
		// Remove any trailing whitespace.
		text = text.trimEnd();

		// Replace `<current_file>` with 'test_template.txt'.
		return text == "<current_file>" && index == 1 ? vars['current_file'] : text;
	}
});

// Expected:
//	Create new file at "results\test02.txt"
//	Replace any text on any line with the corrosponding variable that has this format: {var_name}
template({
	template: cwd + '\\test_control_pos.txt',
	output: cwd + '\\results\\test02.txt',
	vars:
	{
		xpos: 10,
		ypos: 10,
		wide: 800,
		tall: 600
	},
	replacer: /\{([a-z_]+)\}/ig
});

// Close script as SUCCESS.
process.exit(0);
