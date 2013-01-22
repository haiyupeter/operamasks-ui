/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @file Print Plugin
 */

OMEDITOR.plugins.add( 'print',
{
	init : function( editor )
	{
		var pluginName = 'print';

		// Register the command.
		var command = editor.addCommand( pluginName, OMEDITOR.plugins.print );

		// Register the toolbar button.
		editor.ui.addButton( 'Print',
			{
				label : editor.lang.print,
				command : pluginName
			});
	}
} );

OMEDITOR.plugins.print =
{
	exec : function( editor )
	{
		if ( OMEDITOR.env.opera )
			return;
		else if ( OMEDITOR.env.gecko )
			editor.window.$.print();
		else
			editor.document.$.execCommand( "Print" );
	},
	canUndo : false,
	readOnly : 1,
	modes : { wysiwyg : !( OMEDITOR.env.opera ) }		// It is imposible to print the inner document in Opera.
};
