/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview The "div" plugin. It wraps the selected block level elements with a 'div' element with specified styles and attributes.
 *
 */

(function()
{
	OMEDITOR.plugins.add( 'div',
	{
		requires : [ 'editingblock', 'domiterator', 'styles' ],

		init : function( editor )
		{
			var lang = editor.lang.div;

			editor.addCommand( 'creatediv', new OMEDITOR.dialogCommand( 'creatediv' ) );
			editor.addCommand( 'editdiv', new OMEDITOR.dialogCommand( 'editdiv' ) );
			editor.addCommand( 'removediv',
				{
					exec : function( editor )
					{
						var selection = editor.getSelection(),
							ranges = selection && selection.getRanges(),
							range,
							bookmarks = selection.createBookmarks(),
							walker,
							toRemove = [];

						function findDiv( node )
						{
							var path = new OMEDITOR.dom.elementPath( node ),
								blockLimit = path.blockLimit,
								div = blockLimit.is( 'div' ) && blockLimit;

							if ( div && !div.data( 'cke-div-added' ) )
							{
								toRemove.push( div );
								div.data( 'cke-div-added' );
							}
						}

						for ( var i = 0 ; i < ranges.length ; i++ )
						{
							range = ranges[ i ];
							if ( range.collapsed )
								findDiv( selection.getStartElement() );
							else
							{
								walker = new OMEDITOR.dom.walker( range );
								walker.evaluator = findDiv;
								walker.lastForward();
							}
						}

						for ( i = 0 ; i < toRemove.length ; i++ )
							toRemove[ i ].remove( true );

						selection.selectBookmarks( bookmarks );
					}
				} );

			editor.ui.addButton( 'CreateDiv',
			{
				label : lang.toolbar,
				command :'creatediv'
			} );

			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
					{
						editdiv :
						{
							label : lang.edit,
							command : 'editdiv',
							group : 'div',
							order : 1
						},

						removediv:
						{
							label : lang.remove,
							command : 'removediv',
							group : 'div',
							order : 5
						}
					} );

				if ( editor.contextMenu )
				{
					editor.contextMenu.addListener( function( element, selection )
						{
							if ( !element || element.isReadOnly() )
								return null;

							var elementPath = new OMEDITOR.dom.elementPath( element ),
								blockLimit = elementPath.blockLimit;

							if ( blockLimit && blockLimit.getAscendant( 'div', true ) )
							{
								return {
									editdiv : OMEDITOR.TRISTATE_OFF,
									removediv : OMEDITOR.TRISTATE_OFF
								};
							}

							return null;
						} );
				}
			}

			OMEDITOR.dialog.add( 'creatediv', this.path + 'dialogs/div.js' );
			OMEDITOR.dialog.add( 'editdiv', this.path + 'dialogs/div.js' );
		}
	} );
})();
