/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'menubutton',
{
	requires : [ 'button', 'menu' ],
	beforeInit : function( editor )
	{
		editor.ui.addHandler( OMEDITOR.UI_MENUBUTTON, OMEDITOR.ui.menuButton.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
OMEDITOR.UI_MENUBUTTON = 'menubutton';

(function()
{
	var clickFn = function( editor )
	{
		var _ = this._;

		// Do nothing if this button is disabled.
		if ( _.state === OMEDITOR.TRISTATE_DISABLED )
			return;

		_.previousState = _.state;

		// Check if we already have a menu for it, otherwise just create it.
		var menu = _.menu;
		if ( !menu )
		{
			menu = _.menu = new OMEDITOR.menu( editor,
			{
				panel:
				{
					className : editor.skinClass + ' cke_contextmenu',
					attributes : { 'aria-label' : editor.lang.common.options }
				}
			});

			menu.onHide = OMEDITOR.tools.bind( function()
				{
					this.setState( this.modes && this.modes[ editor.mode ] ? _.previousState : OMEDITOR.TRISTATE_DISABLED );
				},
				this );

			// Initialize the menu items at this point.
			if ( this.onMenu )
				menu.addListener( this.onMenu );
		}

		if ( _.on )
		{
			menu.hide();
			return;
		}

		this.setState( OMEDITOR.TRISTATE_ON );

		menu.show( OMEDITOR.document.getById( this._.id ), 4 );
	};


	OMEDITOR.ui.menuButton = OMEDITOR.tools.createClass(
	{
		base : OMEDITOR.ui.button,

		$ : function( definition )
		{
			// We don't want the panel definition in this object.
			var panelDefinition = definition.panel;
			delete definition.panel;

			this.base( definition );

			this.hasArrow = true;

			this.click = clickFn;
		},

		statics :
		{
			handler :
			{
				create : function( definition )
				{
					return new OMEDITOR.ui.menuButton( definition );
				}
			}
		}
	});
})();
