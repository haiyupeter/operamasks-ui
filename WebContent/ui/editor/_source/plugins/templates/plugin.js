/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function()
{
	OMEDITOR.plugins.add( 'templates',
		{
			requires : [ 'dialog' ],

			init : function( editor )
			{
				OMEDITOR.dialog.add( 'templates', OMEDITOR.getUrl( this.path + 'dialogs/templates.js' ) );

				editor.addCommand( 'templates', new OMEDITOR.dialogCommand( 'templates' ) );

				editor.ui.addButton( 'Templates',
					{
						label : editor.lang.templates.button,
						command : 'templates'
					});
			}
		});

	var templates = {},
		loadedTemplatesFiles = {};

	OMEDITOR.addTemplates = function( name, definition )
	{
		templates[ name ] = definition;
	};

	OMEDITOR.getTemplates = function( name )
	{
		return templates[ name ];
	};

	OMEDITOR.loadTemplates = function( templateFiles, callback )
	{
		// Holds the templates files to be loaded.
		var toLoad = [];

		// Look for pending template files to get loaded.
		for ( var i = 0, count = templateFiles.length ; i < count ; i++ )
		{
			if ( !loadedTemplatesFiles[ templateFiles[ i ] ] )
			{
				toLoad.push( templateFiles[ i ] );
				loadedTemplatesFiles[ templateFiles[ i ] ] = 1;
			}
		}

		if ( toLoad.length )
			OMEDITOR.scriptLoader.load( toLoad, callback );
		else
			setTimeout( callback, 0 );
	};
})();



/**
 * The templates definition set to use. It accepts a list of names separated by
 * comma. It must match definitions loaded with the templates_files setting.
 * @type String
 * @default 'default'
 * @example
 * config.templates = 'my_templates';
 */

/**
 * The list of templates definition files to load.
 * @type (String) Array
 * @default [ 'plugins/templates/templates/default.js' ]
 * @example
 * config.templates_files =
 *     [
 *         '/editor_templates/site_default.js',
 *         'http://www.example.com/user_templates.js
 *     ];
 *
 */
OMEDITOR.config.templates_files =
	[
		OMEDITOR.getUrl(
			'_source/' + // @Packager.RemoveLine
			'plugins/templates/templates/default.js' )
	];

/**
 * Whether the "Replace actual contents" checkbox is checked by default in the
 * Templates dialog.
 * @type Boolean
 * @default true
 * @example
 * config.templates_replaceContent = false;
 */
OMEDITOR.config.templates_replaceContent = true;
