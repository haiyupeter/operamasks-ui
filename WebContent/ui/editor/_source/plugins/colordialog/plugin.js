/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.colordialog =
{
	init : function( editor )
	{
		editor.addCommand( 'colordialog', new OMEDITOR.dialogCommand( 'colordialog' ) );
		OMEDITOR.dialog.add( 'colordialog', this.path + 'dialogs/colordialog.js' );
	}
};

OMEDITOR.plugins.add( 'colordialog', OMEDITOR.plugins.colordialog );
