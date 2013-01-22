/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function()
{
	OMEDITOR.plugins.add( 'iframe',
	{
		requires : [ 'dialog', 'fakeobjects' ],
		init : function( editor )
		{
			var pluginName = 'iframe',
				lang = editor.lang.iframe;

			OMEDITOR.dialog.add( pluginName, this.path + 'dialogs/iframe.js' );
			editor.addCommand( pluginName, new OMEDITOR.dialogCommand( pluginName ) );

			editor.addCss(
				'img.cke_iframe' +
				'{' +
					'background-image: url(' + OMEDITOR.getUrl( this.path + 'images/placeholder.png' ) + ');' +
					'background-position: center center;' +
					'background-repeat: no-repeat;' +
					'border: 1px solid #a9a9a9;' +
					'width: 80px;' +
					'height: 80px;' +
				'}'
			);

			editor.ui.addButton( 'Iframe',
				{
					label : lang.toolbar,
					command : pluginName
				});

			editor.on( 'doubleclick', function( evt )
				{
					var element = evt.data.element;
					if ( element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'iframe' )
						evt.data.dialog = 'iframe';
				});

			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
				{
					iframe :
					{
						label : lang.title,
						command : 'iframe',
						group : 'image'
					}
				});
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						if ( element && element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'iframe' )
							return { iframe : OMEDITOR.TRISTATE_OFF };
					});
			}
		},
		afterInit : function( editor )
		{
			var dataProcessor = editor.dataProcessor,
				dataFilter = dataProcessor && dataProcessor.dataFilter;

			if ( dataFilter )
			{
				dataFilter.addRules(
				{
					elements :
					{
						iframe : function( element )
						{
							return editor.createFakeParserElement( element, 'cke_iframe', 'iframe', true );
						}
					}
				});
			}
		}
	});
})();
