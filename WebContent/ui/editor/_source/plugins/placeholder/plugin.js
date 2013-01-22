/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview The "placeholder" plugin.
 *
 */

(function()
{
	var placeholderReplaceRegex = /\[\[[^\]]+\]\]/g;
	OMEDITOR.plugins.add( 'placeholder',
	{
		requires : [ 'dialog' ],
		lang : [ 'en', 'he' ],
		init : function( editor )
		{
			var lang = editor.lang.placeholder;

			editor.addCommand( 'createplaceholder', new OMEDITOR.dialogCommand( 'createplaceholder' ) );
			editor.addCommand( 'editplaceholder', new OMEDITOR.dialogCommand( 'editplaceholder' ) );

			editor.ui.addButton( 'CreatePlaceholder',
			{
				label : lang.toolbar,
				command :'createplaceholder',
				icon : this.path + 'placeholder.gif'
			});

			if ( editor.addMenuItems )
			{
				editor.addMenuGroup( 'placeholder', 20 );
				editor.addMenuItems(
					{
						editplaceholder :
						{
							label : lang.edit,
							command : 'editplaceholder',
							group : 'placeholder',
							order : 1,
							icon : this.path + 'placeholder.gif'
						}
					} );

				if ( editor.contextMenu )
				{
					editor.contextMenu.addListener( function( element, selection )
						{
							if ( !element || !element.data( 'cke-placeholder' ) )
								return null;

							return { editplaceholder : OMEDITOR.TRISTATE_OFF };
						} );
				}
			}

			editor.on( 'doubleclick', function( evt )
				{
					if ( OMEDITOR.plugins.placeholder.getSelectedPlaceHoder( editor ) )
						evt.data.dialog = 'editplaceholder';
				});

			editor.addCss(
				'.cke_placeholder' +
				'{' +
					'background-color: #ffff00;' +
					( OMEDITOR.env.gecko ? 'cursor: default;' : '' ) +
				'}'
			);

			editor.on( 'contentDom', function()
				{
					editor.document.getBody().on( 'resizestart', function( evt )
						{
							if ( editor.getSelection().getSelectedElement().data( 'cke-placeholder' ) )
								evt.data.preventDefault();
						});
				});

			OMEDITOR.dialog.add( 'createplaceholder', this.path + 'dialogs/placeholder.js' );
			OMEDITOR.dialog.add( 'editplaceholder', this.path + 'dialogs/placeholder.js' );
		},
		afterInit : function( editor )
		{
			var dataProcessor = editor.dataProcessor,
				dataFilter = dataProcessor && dataProcessor.dataFilter,
				htmlFilter = dataProcessor && dataProcessor.htmlFilter;

			if ( dataFilter )
			{
				dataFilter.addRules(
				{
					text : function( text )
					{
						return text.replace( placeholderReplaceRegex, function( match )
							{
								return OMEDITOR.plugins.placeholder.createPlaceholder( editor, null, match, 1 );
							});
					}
				});
			}

			if ( htmlFilter )
			{
				htmlFilter.addRules(
				{
					elements :
					{
						'span' : function( element )
						{
							if ( element.attributes && element.attributes[ 'data-cke-placeholder' ] )
								delete element.name;
						}
					}
				});
			}
		}
	});
})();

OMEDITOR.plugins.placeholder =
{
	createPlaceholder : function( editor, oldElement, text, isGet )
	{
		var element = new OMEDITOR.dom.element( 'span', editor.document );
		element.setAttributes(
			{
				contentEditable		: 'false',
				'data-cke-placeholder'	: 1,
				'class'			: 'cke_placeholder'
			}
		);

		text && element.setText( text );

		if ( isGet )
			return element.getOuterHtml();

		if ( oldElement )
		{
			if ( OMEDITOR.env.ie )
			{
				element.insertAfter( oldElement );
				// Some time is required for IE before the element is removed.
				setTimeout( function()
					{
						oldElement.remove();
						element.focus();
					}, 10 );
			}
			else
				element.replace( oldElement );
		}
		else
			editor.insertElement( element );

		return null;
	},

	getSelectedPlaceHoder : function( editor )
	{
		var range = editor.getSelection().getRanges()[ 0 ];
		range.shrink( OMEDITOR.SHRINK_TEXT );
		var node = range.startContainer;
		while( node && !( node.type == OMEDITOR.NODE_ELEMENT && node.data( 'cke-placeholder' ) ) )
			node = node.getParent();
		return node;
	}
};
