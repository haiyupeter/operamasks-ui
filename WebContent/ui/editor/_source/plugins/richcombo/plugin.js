/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'richcombo',
{
	requires : [ 'floatpanel', 'listblock', 'button' ],

	beforeInit : function( editor )
	{
		editor.ui.addHandler( OMEDITOR.UI_RICHCOMBO, OMEDITOR.ui.richCombo.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
OMEDITOR.UI_RICHCOMBO = 'richcombo';

OMEDITOR.ui.richCombo = OMEDITOR.tools.createClass(
{
	$ : function( definition )
	{
		// Copy all definition properties to this object.
		OMEDITOR.tools.extend( this, definition,
			// Set defaults.
			{
				title : definition.label,
				modes : { wysiwyg : 1 }
			});

		// We don't want the panel definition in this object.
		var panelDefinition = this.panel || {};
		delete this.panel;

		this.id = OMEDITOR.tools.getNextNumber();

		this.document = ( panelDefinition
							&& panelDefinition.parent
							&& panelDefinition.parent.getDocument() )
						|| OMEDITOR.document;

		panelDefinition.className = ( panelDefinition.className || '' ) + ' cke_rcombopanel';
		panelDefinition.block =
		{
			multiSelect : panelDefinition.multiSelect,
			attributes : panelDefinition.attributes
		};

		this._ =
		{
			panelDefinition : panelDefinition,
			items : {},
			state : OMEDITOR.TRISTATE_OFF
		};
	},

	statics :
	{
		handler :
		{
			create : function( definition )
			{
				return new OMEDITOR.ui.richCombo( definition );
			}
		}
	},

	proto :
	{
		renderHtml : function( editor )
		{
			var output = [];
			this.render( editor, output );
			return output.join( '' );
		},

		/**
		 * Renders the combo.
		 * @param {OMEDITOR.editor} editor The editor instance which this button is
		 *		to be used by.
		 * @param {Array} output The output array to which append the HTML relative
		 *		to this button.
		 * @example
		 */
		render : function( editor, output )
		{
			var env = OMEDITOR.env;

			var id = 'cke_' + this.id;
			var clickFn = OMEDITOR.tools.addFunction( function( $element )
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

					this.commit();
					var value = this.getValue();
					if ( value )
						_.list.mark( value );
					else
						_.list.unmarkAll();

					_.panel.showBlock( this.id, new OMEDITOR.dom.element( $element ), 4 );
				},
				this );

			var instance = {
				id : id,
				combo : this,
				focus : function()
				{
					var element = OMEDITOR.document.getById( id ).getChild( 1 );
					element.focus();
				},
				clickFn : clickFn
			};

			function updateState()
			{
				var state = this.modes[ editor.mode ] ? OMEDITOR.TRISTATE_OFF : OMEDITOR.TRISTATE_DISABLED;
				this.setState( editor.readOnly && !this.readOnly ? OMEDITOR.TRISTATE_DISABLED : state );
				this.setValue( '' );
			}

			editor.on( 'mode', updateState, this );
			// If this combo is sensitive to readOnly state, update it accordingly.
			!this.readOnly && editor.on( 'readOnly', updateState, this);

			var keyDownFn = OMEDITOR.tools.addFunction( function( ev, element )
				{
					ev = new OMEDITOR.dom.event( ev );

					var keystroke = ev.getKeystroke();
					switch ( keystroke )
					{
						case 13 :	// ENTER
						case 32 :	// SPACE
						case 40 :	// ARROW-DOWN
							// Show panel
							OMEDITOR.tools.callFunction( clickFn, element );
							break;
						default :
							// Delegate the default behavior to toolbar button key handling.
							instance.onkey( instance,  keystroke );
					}

					// Avoid subsequent focus grab on editor document.
					ev.preventDefault();
				});

			var focusFn = OMEDITOR.tools.addFunction( function() { instance.onfocus && instance.onfocus(); } );

			// For clean up
			instance.keyDownFn = keyDownFn;

			output.push(
				'<span class="cke_rcombo" role="presentation">',
				'<span id=', id );

			if ( this.className )
				output.push( ' class="', this.className, ' cke_off"');

			output.push(
				' role="presentation">',
					'<span id="' + id+ '_label" class=cke_label>', this.label, '</span>',
					'<a hidefocus=true title="', this.title, '" tabindex="-1"',
						env.gecko && env.version >= 10900 && !env.hc ? '' : ' href="javascript:void(\'' + this.label + '\')"',
						' role="button" aria-labelledby="', id , '_label" aria-describedby="', id, '_text" aria-haspopup="true"' );

			// Some browsers don't cancel key events in the keydown but in the
			// keypress.
			// TODO: Check if really needed for Gecko+Mac.
			if ( OMEDITOR.env.opera || ( OMEDITOR.env.gecko && OMEDITOR.env.mac ) )
			{
				output.push(
					' onkeypress="return false;"' );
			}

			// With Firefox, we need to force it to redraw, otherwise it
			// will remain in the focus state.
			if ( OMEDITOR.env.gecko )
			{
				output.push(
					' onblur="this.style.cssText = this.style.cssText;"' );
			}

			output.push(
					' onkeydown="OMEDITOR.tools.callFunction( ', keyDownFn, ', event, this );"' +
					' onfocus="return OMEDITOR.tools.callFunction(', focusFn, ', event);" ' +
					( OMEDITOR.env.ie ? 'onclick="return false;" onmouseup' : 'onclick' ) +		// #188
						'="OMEDITOR.tools.callFunction(', clickFn, ', this); return false;">' +
						'<span>' +
							'<span id="' + id + '_text" class="cke_text cke_inline_label">' + this.label + '</span>' +
						'</span>' +
						'<span class=cke_openbutton><span class=cke_icon>' + ( OMEDITOR.env.hc ? '&#9660;' : OMEDITOR.env.air ?  '&nbsp;' : '' ) + '</span></span>' +	// BLACK DOWN-POINTING TRIANGLE
					'</a>' +
				'</span>' +
				'</span>' );

			if ( this.onRender )
				this.onRender();

			return instance;
		},

		createPanel : function( editor )
		{
			if ( this._.panel )
				return;

			var panelDefinition = this._.panelDefinition,
				panelBlockDefinition = this._.panelDefinition.block,
				panelParentElement = panelDefinition.parent || OMEDITOR.document.getBody(),
				panel = new OMEDITOR.ui.floatPanel( editor, panelParentElement, panelDefinition ),
				list = panel.addListBlock( this.id, panelBlockDefinition ),
				me = this;

			panel.onShow = function()
				{
					if ( me.className )
						this.element.getFirst().addClass( me.className + '_panel' );

					me.setState( OMEDITOR.TRISTATE_ON );

					list.focus( !me.multiSelect && me.getValue() );

					me._.on = 1;

					if ( me.onOpen )
						me.onOpen();
				};

			panel.onHide = function( preventOnClose )
				{
					if ( me.className )
						this.element.getFirst().removeClass( me.className + '_panel' );

					me.setState( me.modes && me.modes[ editor.mode ] ? OMEDITOR.TRISTATE_OFF : OMEDITOR.TRISTATE_DISABLED );

					me._.on = 0;

					if ( !preventOnClose && me.onClose )
						me.onClose();
				};

			panel.onEscape = function()
				{
					panel.hide();
				};

			list.onClick = function( value, marked )
				{
					// Move the focus to the main windows, otherwise it will stay
					// into the floating panel, even if invisible, and Safari and
					// Opera will go a bit crazy.
					me.document.getWindow().focus();

					if ( me.onClick )
						me.onClick.call( me, value, marked );

					if ( marked )
						me.setValue( value, me._.items[ value ] );
					else
						me.setValue( '' );

					panel.hide( false );
				};

			this._.panel = panel;
			this._.list = list;

			panel.getBlock( this.id ).onHide = function()
				{
					me._.on = 0;
					me.setState( OMEDITOR.TRISTATE_OFF );
				};

			if ( this.init )
				this.init();
		},

		setValue : function( value, text )
		{
			this._.value = value;

			var textElement = this.document.getById( 'cke_' + this.id + '_text' );
			if ( textElement )
			{
				if ( !( value || text ) )
				{
					text = this.label;
					textElement.addClass( 'cke_inline_label' );
				}
				else
					textElement.removeClass( 'cke_inline_label' );

				textElement.setHtml( typeof text != 'undefined' ? text : value );
			}
		},

		getValue : function()
		{
			return this._.value || '';
		},

		unmarkAll : function()
		{
			this._.list.unmarkAll();
		},

		mark : function( value )
		{
			this._.list.mark( value );
		},

		hideItem : function( value )
		{
			this._.list.hideItem( value );
		},

		hideGroup : function( groupTitle )
		{
			this._.list.hideGroup( groupTitle );
		},

		showAll : function()
		{
			this._.list.showAll();
		},

		add : function( value, html, text )
		{
			this._.items[ value ] = text || value;
			this._.list.add( value, html, text );
		},

		startGroup : function( title )
		{
			this._.list.startGroup( title );
		},

		commit : function()
		{
			if ( !this._.committed )
			{
				this._.list.commit();
				this._.committed = 1;
				OMEDITOR.ui.fire( 'ready', this );
			}
			this._.committed = 1;
		},

		setState : function( state )
		{
			if ( this._.state == state )
				return;

			this.document.getById( 'cke_' + this.id ).setState( state );

			this._.state = state;
		}
	}
});

OMEDITOR.ui.prototype.addRichCombo = function( name, definition )
{
	this.add( name, OMEDITOR.UI_RICHCOMBO, definition );
};
