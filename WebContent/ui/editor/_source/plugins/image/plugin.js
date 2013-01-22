/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @file Image plugin
 */

OMEDITOR.plugins.add( 'image',
{
	init : function( editor )
	{
		var pluginName = 'image';

		// Register the dialog.
		OMEDITOR.dialog.add( pluginName, this.path + 'dialogs/image.js' );

		// Register the command.
		editor.addCommand( pluginName, new OMEDITOR.dialogCommand( pluginName ) );

		// Register the toolbar button.
		editor.ui.addButton( 'Image',
			{
				label : editor.lang.common.image,
				command : pluginName
			});

		editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'img' ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() )
					evt.data.dialog = 'image';
			});

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems )
		{
			editor.addMenuItems(
				{
					image :
					{
						label : editor.lang.image.menu,
						command : 'image',
						group : 'image'
					}
				});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu )
		{
			editor.contextMenu.addListener( function( element, selection )
				{
					if ( !element || !element.is( 'img' ) || element.data( 'cke-realelement' ) || element.isReadOnly() )
						return null;

					return { image : OMEDITOR.TRISTATE_OFF };
				});
		}
	}
} );

/**
 * Whether to remove links when emptying the link URL field in the image dialog.
 * @type Boolean
 * @default true
 * @example
 * config.image_removeLinkByEmptyURL = false;
 */
OMEDITOR.config.image_removeLinkByEmptyURL = true;

/**
 *  Padding text to set off the image in preview area.
 * @name OMEDITOR.config.image_previewText
 * @type String
 * @default "Lorem ipsum dolor..." placehoder text.
 * @example
 * config.image_previewText = OMEDITOR.tools.repeat( '___ ', 100 );
 */
