/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function()
{
	OMEDITOR.plugins.liststyle =
	{
		requires : [ 'dialog' ],
		init : function( editor )
		{
			editor.addCommand( 'numberedListStyle', new OMEDITOR.dialogCommand( 'numberedListStyle' ) );
			OMEDITOR.dialog.add( 'numberedListStyle', this.path + 'dialogs/liststyle.js' );
			editor.addCommand( 'bulletedListStyle', new OMEDITOR.dialogCommand( 'bulletedListStyle' ) );
			OMEDITOR.dialog.add( 'bulletedListStyle', this.path + 'dialogs/liststyle.js' );

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				//Register map group;
				editor.addMenuGroup("list", 108);

				editor.addMenuItems(
					{
						numberedlist :
						{
							label : editor.lang.list.numberedTitle,
							group : 'list',
							command: 'numberedListStyle'
						},
						bulletedlist :
						{
							label : editor.lang.list.bulletedTitle,
							group : 'list',
							command: 'bulletedListStyle'
						}
					});
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						if ( !element || element.isReadOnly() )
							return null;

						while ( element )
						{
							var name = element.getName();
							if ( name == 'ol' )
								return { numberedlist: OMEDITOR.TRISTATE_OFF };
							else if ( name == 'ul' )
								return { bulletedlist: OMEDITOR.TRISTATE_OFF };

							element = element.getParent();
						}
						return null;
					});
			}
		}
	};

	OMEDITOR.plugins.add( 'liststyle', OMEDITOR.plugins.liststyle );
})();
