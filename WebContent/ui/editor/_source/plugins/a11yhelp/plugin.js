/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Plugin definition for the a11yhelp, which provides a dialog
 * with accessibility related help.
 */

(function()
{
	var pluginName = 'a11yhelp',
		commandName = 'a11yHelp';

	OMEDITOR.plugins.add( pluginName,
	{
		// List of available localizations.
		availableLangs : { en:1, he:1 },

		init : function( editor )
		{
			var plugin = this;
			editor.addCommand( commandName,
				{
					exec : function()
					{
						var langCode = editor.langCode;
						langCode = plugin.availableLangs[ langCode ] ? langCode : 'en';

						OMEDITOR.scriptLoader.load(
								OMEDITOR.getUrl( plugin.path + 'lang/' + langCode + '.js' ),
								function()
								{
									OMEDITOR.tools.extend( editor.lang, plugin.langEntries[ langCode ] );
									editor.openDialog( commandName );
								});
					},
					modes : { wysiwyg:1, source:1 },
					readOnly : 1,
					canUndo : false
				});

			OMEDITOR.dialog.add( commandName, this.path + 'dialogs/a11yhelp.js' );
		}
	});
})();
