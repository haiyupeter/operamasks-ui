/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'contextmenu',
{
	requires : [ 'menu' ],

	// Make sure the base class (OMEDITOR.menu) is loaded before it (#3318).
	onLoad : function()
	{
		OMEDITOR.plugins.contextMenu = OMEDITOR.tools.createClass(
		{
			base : OMEDITOR.menu,

			$ : function( editor )
			{
				this.base.call( this, editor,
				{
					panel:
					{
						className : editor.skinClass + ' cke_contextmenu',
						attributes :
						{
							'aria-label' : editor.lang.contextmenu.options
						}
					}
				});
			},

			proto :
			{
				addTarget : function( element, nativeContextMenuOnCtrl )
				{
					// Opera doesn't support 'contextmenu' event, we have duo approaches employed here:
					// 1. Inherit the 'button override' hack we introduced in v2 (#4530), while this require the Opera browser
					//  option 'Allow script to detect context menu/right click events' to be always turned on.
					// 2. Considering the fact that ctrl/meta key is not been occupied
					//  for multiple range selecting (like Gecko), we use this key
					//  combination as a fallback for triggering context-menu. (#4530)
					if ( OMEDITOR.env.opera && !( 'oncontextmenu' in document.body ))
					{
						var contextMenuOverrideButton;
						element.on( 'mousedown', function( evt )
						{
							evt = evt.data;
							if ( evt.$.button != 2 )
							{
								if ( evt.getKeystroke() == OMEDITOR.CTRL + 1 )
									element.fire( 'contextmenu', evt );
								return;
							}

							if ( nativeContextMenuOnCtrl
								 && ( OMEDITOR.env.mac ? evt.$.metaKey : evt.$.ctrlKey ) )
								return;

							var target = evt.getTarget();

							if ( !contextMenuOverrideButton )
							{
								var ownerDoc =  target.getDocument();
								contextMenuOverrideButton = ownerDoc.createElement( 'input' ) ;
								contextMenuOverrideButton.$.type = 'button' ;
								ownerDoc.getBody().append( contextMenuOverrideButton ) ;
							}

							contextMenuOverrideButton.setAttribute( 'style', 'position:absolute;top:' + ( evt.$.clientY - 2 ) +
								'px;left:' + ( evt.$.clientX - 2 ) +
								'px;width:5px;height:5px;opacity:0.01' );

						} );

						element.on( 'mouseup', function ( evt )
						{
							if ( contextMenuOverrideButton )
							{
								contextMenuOverrideButton.remove();
								contextMenuOverrideButton = undefined;
								// Simulate 'contextmenu' event.
								element.fire( 'contextmenu', evt.data );
							}
						} );
					}

					element.on( 'contextmenu', function( event )
						{
							var domEvent = event.data;

							if ( nativeContextMenuOnCtrl &&
								 // Safari on Windows always show 'ctrlKey' as true in 'contextmenu' event,
								// which make this property unreliable. (#4826)
								 ( OMEDITOR.env.webkit ? holdCtrlKey : ( OMEDITOR.env.mac ? domEvent.$.metaKey : domEvent.$.ctrlKey ) ) )
								return;


							// Cancel the browser context menu.
							domEvent.preventDefault();

							var offsetParent = domEvent.getTarget().getDocument().getDocumentElement(),
								offsetX = domEvent.$.clientX,
								offsetY = domEvent.$.clientY;

							OMEDITOR.tools.setTimeout( function()
								{
									this.open( offsetParent, null, offsetX, offsetY );
								},
								0, this );
						},
						this );

					if ( OMEDITOR.env.opera )
					{
						// 'contextmenu' event triggered by Windows menu key is unpreventable,
						// cancel the key event itself. (#6534)
						element.on( 'keypress' , function ( evt )
						{
							var domEvent = evt.data;

							if ( domEvent.$.keyCode === 0 )
								domEvent.preventDefault();
						});
					}

					if ( OMEDITOR.env.webkit )
					{
						var holdCtrlKey,
							onKeyDown = function( event )
							{
								holdCtrlKey = OMEDITOR.env.mac ? event.data.$.metaKey : event.data.$.ctrlKey ;
							},
							resetOnKeyUp = function()
							{
								holdCtrlKey = 0;
							};

						element.on( 'keydown', onKeyDown );
						element.on( 'keyup', resetOnKeyUp );
						element.on( 'contextmenu', resetOnKeyUp );
					}
				},

				open : function( offsetParent, corner, offsetX, offsetY )
				{
					this.editor.focus();
					offsetParent = offsetParent || OMEDITOR.document.getDocumentElement();
					this.show( offsetParent, corner, offsetX, offsetY );
				}
			}
		});
	},

	beforeInit : function( editor )
	{
		editor.contextMenu = new OMEDITOR.plugins.contextMenu( editor );

		editor.addCommand( 'contextMenu',
			{
				exec : function()
					{
						editor.contextMenu.open( editor.document.getBody() );
					}
			});
	}
});

/**
 * Whether to show the browser native context menu when the CTRL or the
 * META (Mac) key is pressed while opening the context menu.
 * @name OMEDITOR.config.browserContextMenuOnCtrl
 * @since 3.0.2
 * @type Boolean
 * @default true
 * @example
 * config.browserContextMenuOnCtrl = false;
 */
