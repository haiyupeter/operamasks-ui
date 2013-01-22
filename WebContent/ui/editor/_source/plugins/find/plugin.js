/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'find',
{
	init : function( editor )
	{
		var forms = OMEDITOR.plugins.find;
		editor.ui.addButton( 'Find',
			{
				label : editor.lang.findAndReplace.find,
				command : 'find'
			});
		var findCommand = editor.addCommand( 'find', new OMEDITOR.dialogCommand( 'find' ) );
		findCommand.canUndo = false;
		findCommand.readOnly = 1;

		editor.ui.addButton( 'Replace',
			{
				label : editor.lang.findAndReplace.replace,
				command : 'replace'
			});
		var replaceCommand = editor.addCommand( 'replace', new OMEDITOR.dialogCommand( 'replace' ) );
		replaceCommand.canUndo = false;

		OMEDITOR.dialog.add( 'find',	this.path + 'dialogs/find.js' );
		OMEDITOR.dialog.add( 'replace',	this.path + 'dialogs/find.js' );
	},

	requires : [ 'styles' ]
} );

/**
 * Defines the style to be used to highlight results with the find dialog.
 * @type Object
 * @default { element : 'span', styles : { 'background-color' : '#004', 'color' : '#fff' } }
 * @example
 * // Highlight search results with blue on yellow.
 * config.find_highlight =
 *     {
 *         element : 'span',
 *         styles : { 'background-color' : '#ff0', 'color' : '#00f' }
 *     };
 */
OMEDITOR.config.find_highlight = { element : 'span', styles : { 'background-color' : '#004', 'color' : '#fff' } };
