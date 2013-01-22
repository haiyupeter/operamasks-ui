/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @file Spell checker
 */

// Register a plugin named "wsc".
OMEDITOR.plugins.add( 'wsc',
{
	requires : [ 'dialog' ],
	init : function( editor )
	{
		var commandName = 'checkspell';

		var command = editor.addCommand( commandName, new OMEDITOR.dialogCommand( commandName ) );

		// SpellChecker doesn't work in Opera and with custom domain
		command.modes = { wysiwyg : ( !OMEDITOR.env.opera && !OMEDITOR.env.air && document.domain == window.location.hostname ) };

		editor.ui.addButton( 'SpellChecker',
			{
				label : editor.lang.spellCheck.toolbar,
				command : commandName
			});
		OMEDITOR.dialog.add( commandName, this.path + 'dialogs/wsc.js' );
	}
});

OMEDITOR.config.wsc_customerId			= OMEDITOR.config.wsc_customerId || '1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk' ;
OMEDITOR.config.wsc_customLoaderScript	= OMEDITOR.config.wsc_customLoaderScript || null;
