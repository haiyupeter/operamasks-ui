/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'uicolor',
{
	requires : [ 'dialog' ],
	lang : [ 'en', 'he' ],

	init : function( editor )
	{
		if ( OMEDITOR.env.ie6Compat )
			return;

		editor.addCommand( 'uicolor', new OMEDITOR.dialogCommand( 'uicolor' ) );
		editor.ui.addButton( 'UIColor',
			{
				label : editor.lang.uicolor.title,
				command : 'uicolor',
				icon : this.path + 'uicolor.gif'
			});
		OMEDITOR.dialog.add( 'uicolor', this.path + 'dialogs/uicolor.js' );

		// Load YUI js files.
		OMEDITOR.scriptLoader.load( OMEDITOR.getUrl(
			'_source/' + // @Packager.RemoveLine
			'plugins/uicolor/yui/yui.js'
		));

		// Load YUI css files.
		editor.element.getDocument().appendStyleSheet( OMEDITOR.getUrl(
				'_source/' + // @Packager.RemoveLine
				'plugins/uicolor/yui/assets/yui.css'
		));
	}
} );
