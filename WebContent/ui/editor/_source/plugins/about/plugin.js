/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'about',
{
	requires : [ 'dialog' ],
	init : function( editor )
	{
		var command = editor.addCommand( 'about', new OMEDITOR.dialogCommand( 'about' ) );
		command.modes = { wysiwyg:1, source:1 };
		command.canUndo = false;
		command.readOnly = 1;

		editor.ui.addButton( 'About',
			{
				label : editor.lang.about.title,
				command : 'about'
			});

		OMEDITOR.dialog.add( 'about', this.path + 'dialogs/about.js' );
	}
});
