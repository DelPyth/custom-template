const fs = require('fs');

/**
 * Use a template and return the result of text replaced by the `custom_vars` parameter.
 * @name createFromTemplate
 * @requires fs
 * @throws Will throw an error if `template` or `vars` is blank or if the template could not be read.
*/
function create_from_template(options)
{
	let template		= 'template' in options		? options.template		: null;
	let custom_vars		= 'vars' in options			? options.vars			: null;
	let replacer		= 'replacer' in options		? options.replacer		: null;
	let ignore_blank	= 'ignoreBlank' in options	? options.ignoreBlank	: true;
	let output			= 'output' in options		? options.output		: false;

	if (template === null || (!fs.existsSync(template)))
	{
		throw new Error("Missing or invalid file name or path.");
	}

	let result = "";

	try
	{
		let file_text = fs.readFileSync(template, 'utf-8')
		let split_lines = file_text.toString().split('\n');

		for (let line_num = 0; line_num < split_lines.length; line_num++)
		{
			let line_text = split_lines[line_num];

			// Blank line
			if (ignore_blank && ((!line_text) || (line_text.length == 0)))
			{
				continue;
			}

			if (replacer instanceof Function)
			{
				line_text = replacer(line_num, line_text, custom_vars);
			}
			else if (replacer instanceof RegExp)
			{
				line_text = line_text.replace(replacer, function(match, value)
				{
					return value in custom_vars ? custom_vars[value].valueOf() : match;
				});
			}

			result += line_text + "\n";
		}
	}
	catch (err)
	{
		console.error(err);
		return false;
	}

	if (output)
	{
		fs.writeFileSync(output, result);
		return true;
	}

	return result;
}

module.exports = create_from_template;
