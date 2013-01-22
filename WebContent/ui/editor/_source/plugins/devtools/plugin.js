/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'devtools',
{
	lang : [ 'en' ],

	init : function( editor )
	{
		editor._.showDialogDefinitionTooltips = 1;
	},
	onLoad : function()
	{
		OMEDITOR.document.appendStyleText( OMEDITOR.config.devtools_styles ||
							'#cke_tooltip { padding: 5px; border: 2px solid #333; background: #ffffff }' +
							'#cke_tooltip h2 { font-size: 1.1em; border-bottom: 1px solid; margin: 0; padding: 1px; }' +
							'#cke_tooltip ul { padding: 0pt; list-style-type: none; }' );
	}
});

(function()
{
	function defaultCallback( editor, dialog, element, tabName )
	{
		var lang = editor.lang.devTools,
			link = '<a href="http://docs.cksource.com/omeditor_api/symbols/OMEDITOR.dialog.definition.' +
					( element ? ( element.type == 'text' ? 'textInput' : element.type ) : 'content' ) +
					'.html" target="_blank">' + ( element ? element.type : 'content' ) + '</a>',
			str =
				'<h2>' + lang.title + '</h2>' +
				'<ul>' +
					'<li><strong>' + lang.dialogName + '</strong> : ' + dialog.getName() + '</li>' +
					'<li><strong>' + lang.tabName + '</strong> : ' + tabName + '</li>';

		if ( element )
			str += '<li><strong>' + lang.elementId + '</strong> : ' + element.id + '</li>';

		str += '<li><strong>' + lang.elementType + '</strong> : ' + link + '</li>';

		return str + '</ul>';
	}

	function showTooltip( callback, el, editor, dialog, obj, tabName )
	{
		var pos = el.getDocumentPosition(),
			styles = { 'z-index' : OMEDITOR.dialog._.currentZIndex + 10, top : ( pos.y + el.getSize( 'height' ) ) + 'px' };

		tooltip.setHtml( callback( editor, dialog, obj, tabName ) );
		tooltip.show();

		// Translate coordinate for RTL.
		if ( editor.lang.dir == 'rtl' )
		{
			var viewPaneSize = OMEDITOR.document.getWindow().getViewPaneSize();
			styles.right = ( viewPaneSize.width - pos.x - el.getSize( 'width' ) ) + 'px';
		}
		else
			styles.left = pos.x + 'px';

		tooltip.setStyles( styles );
	}

	var tooltip;
	OMEDITOR.on( 'reset', function()
	{
		tooltip && tooltip.remove();
		tooltip = null;
	});

	OMEDITOR.on( 'dialogDefinition', function( evt )
	{
		var editor = evt.editor;
		if ( editor._.showDialogDefinitionTooltips )
		{
			if ( !tooltip )
			{
				tooltip = OMEDITOR.dom.element.createFromHtml( '<div id="cke_tooltip" tabindex="-1" style="position: absolute"></div>', OMEDITOR.document );
				tooltip.hide();
				tooltip.on( 'mouseover', function(){ this.show(); } );
				tooltip.on( 'mouseout', function(){ this.hide(); } );
				tooltip.appendTo( OMEDITOR.document.getBody() );
			}

			var dialog = evt.data.definition.dialog,
				callback = editor.config.devtools_textCallback || defaultCallback;

			dialog.on( 'load', function()
			{
				var tabs = dialog.parts.tabs.getChildren(), tab;
				for ( var i = 0, len = tabs.count(); i < len; i++ )
				{
					tab = tabs.getItem( i );
					tab.on( 'mouseover', function()
					{
						var id = this.$.id;
						showTooltip( callback, this, editor, dialog, null, id.substring( 4, id.lastIndexOf( '_' ) ) );
					});
					tab.on( 'mouseout', function()
					{
						tooltip.hide();
					});
				}

				dialog.foreach( function( obj )
				{
					if ( obj.type in { hbox : 1, vbox : 1 } )
						return;

					var el = obj.getElement();
					if ( el )
					{
						el.on( 'mouseover', function()
						{
							showTooltip( callback, this, editor, dialog, obj, dialog._.currentTabId );
						});
						el.on( 'mouseout', function()
						{
							tooltip.hide();
						});
					}
				});
			});
		}
	});
})();

/**
 * A function that returns the text to be displayed inside the developer tooltip when hovering over a dialog UI element.
 * There are 4 parameters that are being passed into the function: editor, dialog, element, tab name.
 * @name editor.config.devtools_textCallback
 * @since 3.6
 * @type Function
 * @default (see example)
 * @example
 * // This is actually the default value.
 * // Show dialog name, tab id and element id.
 * config.devtools_textCallback = function( editor, dialog, element, tabName )
 * {
 * 	var lang = editor.lang.devTools,
 * 		link = '<a href="http://docs.cksource.com/omeditor_api/symbols/OMEDITOR.dialog.definition.' +
 * 				( element ? ( element.type == 'text' ? 'textInput' : element.type ) : 'content' ) +
 * 				'.html" target="_blank">' + ( element ? element.type : 'content' ) + '</a>',
 * 		str =
 * 			'<h2>' + lang.title + '</h2>' +
 * 			'<ul>' +
 * 				'<li><strong>' + lang.dialogName + '</strong> : ' + dialog.getName() + '</li>' +
 * 				'<li><strong>' + lang.tabName + '</strong> : ' + tabName + '</li>';
 *
 * 	if ( element )
 * 		str += '<li><strong>' + lang.elementId + '</strong> : ' + element.id + '</li>';
 *
 * 	str += '<li><strong>' + lang.elementType + '</strong> : ' + link + '</li>';
 *
 * 	return str + '</ul>';
 * }
 */

/**
 * A setting that holds CSS rules to be injected do page and contain styles to be applied to the tooltip element.
 * @name OMEDITOR.config.devtools_styles
 * @since 3.6
 * @type String
 * @default (see example)
 * @example
 * // This is actually the default value.
 * OMEDITOR.config.devtools_styles = &quot;
 *  #cke_tooltip { padding: 5px; border: 2px solid #333; background: #ffffff }
 *  #cke_tooltip h2 { font-size: 1.1em; border-bottom: 1px solid; margin: 0; padding: 1px; }
 *  #cke_tooltip ul { padding: 0pt; list-style-type: none; }
 * &quot;;
 */
