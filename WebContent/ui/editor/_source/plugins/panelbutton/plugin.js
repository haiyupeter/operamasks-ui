/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'panelbutton',
{
	requires : [ 'button' ],
	onLoad : function()
	{
		function clickFn( editor )
		{
			var _ = this._;

			if ( _.state == OMEDITOR.TRISTATE_DISABLED )
				return;

			this.createPanel( editor );

			if ( _.on )
			{
				_.panel.hide();
				return;
			}

			_.panel.showBlock( this._.id, this.document.getById( this._.id ), 4 );
		}

		OMEDITOR.ui.panelButton = OMEDITOR.tools.createClass(
		{
			base : OMEDITOR.ui.button,

			$ : function( definition )
			{
				// We don't want the panel definition in this object.
				var panelDefinition = definition.panel;
				delete definition.panel;

				this.base( definition );

				this.document = ( panelDefinition
									&& panelDefinition.parent
									&& panelDefinition.parent.getDocument() )
								|| OMEDITOR.document;

				panelDefinition.block =
				{
					attributes : panelDefinition.attributes
				};

				this.hasArrow = true;

				this.click = clickFn;

				this._ =
				{
					panelDefinition : panelDefinition
				};
			},

			statics :
			{
				handler :
				{
					create : function( definition )
					{
						return new OMEDITOR.ui.panelButton( definition );
					}
				}
			},

			proto :
			{
				createPanel : function( editor )
				{
					var _ = this._;

					if ( _.panel )
						return;

					var panelDefinition = this._.panelDefinition || {},
						panelBlockDefinition = this._.panelDefinition.block,
						panelParentElement = panelDefinition.parent || OMEDITOR.document.getBody(),
						panel = this._.panel = new OMEDITOR.ui.floatPanel( editor, panelParentElement, panelDefinition ),
						block = panel.addBlock( _.id, panelBlockDefinition ),
						me = this;

					panel.onShow = function()
						{
							if ( me.className )
								this.element.getFirst().addClass( me.className + '_panel' );

							me.setState( OMEDITOR.TRISTATE_ON );

							_.on = 1;

							if ( me.onOpen )
								me.onOpen();
						};

					panel.onHide = function( preventOnClose )
						{
							if ( me.className )
								this.element.getFirst().removeClass( me.className + '_panel' );

							me.setState( me.modes && me.modes[ editor.mode ] ? OMEDITOR.TRISTATE_OFF : OMEDITOR.TRISTATE_DISABLED );

							_.on = 0;

							if ( !preventOnClose && me.onClose )
								me.onClose();
						};

					panel.onEscape = function()
						{
							panel.hide();
							me.document.getById( _.id ).focus();
						};

					if ( this.onBlock )
						this.onBlock( panel, block );

					block.onHide = function()
						{
							_.on = 0;
							me.setState( OMEDITOR.TRISTATE_OFF );
						};
				}
			}
		});

	},
	beforeInit : function( editor )
	{
		editor.ui.addHandler( OMEDITOR.UI_PANELBUTTON, OMEDITOR.ui.panelButton.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
OMEDITOR.UI_PANELBUTTON = 'panelbutton';
