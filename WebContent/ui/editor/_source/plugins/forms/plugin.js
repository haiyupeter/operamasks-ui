/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @file Forms Plugin
 */

OMEDITOR.plugins.add( 'forms',
{
	init : function( editor )
	{
		var lang = editor.lang;

		editor.addCss(
			'form' +
			'{' +
				'border: 1px dotted #FF0000;' +
				'padding: 2px;' +
			'}\n' );

		editor.addCss(
			'img.cke_hidden' +
			'{' +
				'background-image: url(' + OMEDITOR.getUrl( this.path + 'images/hiddenfield.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 16px !important;' +
				'height: 16px !important;' +
			'}' );

		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, commandName, dialogFile )
		{
			editor.addCommand( commandName, new OMEDITOR.dialogCommand( commandName ) );

			editor.ui.addButton( buttonName,
				{
					label : lang.common[ buttonName.charAt(0).toLowerCase() + buttonName.slice(1) ],
					command : commandName
				});
			OMEDITOR.dialog.add( commandName, dialogFile );
		};

		var dialogPath = this.path + 'dialogs/';
		addButtonCommand( 'Form',			'form',			dialogPath + 'form.js' );
		addButtonCommand( 'Checkbox',		'checkbox',		dialogPath + 'checkbox.js' );
		addButtonCommand( 'Radio',			'radio',		dialogPath + 'radio.js' );
		addButtonCommand( 'TextField',		'textfield',	dialogPath + 'textfield.js' );
		addButtonCommand( 'Textarea',		'textarea',		dialogPath + 'textarea.js' );
		addButtonCommand( 'Select',			'select',		dialogPath + 'select.js' );
		addButtonCommand( 'Button',			'button',		dialogPath + 'button.js' );
		addButtonCommand( 'ImageButton',	'imagebutton',	OMEDITOR.plugins.getPath('image') + 'dialogs/image.js' );
		addButtonCommand( 'HiddenField',	'hiddenfield',	dialogPath + 'hiddenfield.js' );

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems )
		{
			editor.addMenuItems(
				{
					form :
					{
						label : lang.form.menu,
						command : 'form',
						group : 'form'
					},

					checkbox :
					{
						label : lang.checkboxAndRadio.checkboxTitle,
						command : 'checkbox',
						group : 'checkbox'
					},

					radio :
					{
						label : lang.checkboxAndRadio.radioTitle,
						command : 'radio',
						group : 'radio'
					},

					textfield :
					{
						label : lang.textfield.title,
						command : 'textfield',
						group : 'textfield'
					},

					hiddenfield :
					{
						label : lang.hidden.title,
						command : 'hiddenfield',
						group : 'hiddenfield'
					},

					imagebutton :
					{
						label : lang.image.titleButton,
						command : 'imagebutton',
						group : 'imagebutton'
					},

					button :
					{
						label : lang.button.title,
						command : 'button',
						group : 'button'
					},

					select :
					{
						label : lang.select.title,
						command : 'select',
						group : 'select'
					},

					textarea :
					{
						label : lang.textarea.title,
						command : 'textarea',
						group : 'textarea'
					}
				});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu )
		{
			editor.contextMenu.addListener( function( element )
				{
					if ( element && element.hasAscendant( 'form', true ) && !element.isReadOnly() )
						return { form : OMEDITOR.TRISTATE_OFF };
				});

			editor.contextMenu.addListener( function( element )
				{
					if ( element && !element.isReadOnly() )
					{
						var name = element.getName();

						if ( name == 'select' )
							return { select : OMEDITOR.TRISTATE_OFF };

						if ( name == 'textarea' )
							return { textarea : OMEDITOR.TRISTATE_OFF };

						if ( name == 'input' )
						{
							switch( element.getAttribute( 'type' ) )
							{
								case 'button' :
								case 'submit' :
								case 'reset' :
									return { button : OMEDITOR.TRISTATE_OFF };

								case 'checkbox' :
									return { checkbox : OMEDITOR.TRISTATE_OFF };

								case 'radio' :
									return { radio : OMEDITOR.TRISTATE_OFF };

								case 'image' :
									return { imagebutton : OMEDITOR.TRISTATE_OFF };

								default :
									return { textfield : OMEDITOR.TRISTATE_OFF };
							}
						}

						if ( name == 'img' && element.data( 'cke-real-element-type' ) == 'hiddenfield' )
							return { hiddenfield : OMEDITOR.TRISTATE_OFF };
					}
				});
		}

		editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'form' ) )
					evt.data.dialog = 'form';
				else if ( element.is( 'select' ) )
					evt.data.dialog = 'select';
				else if ( element.is( 'textarea' ) )
					evt.data.dialog = 'textarea';
				else if ( element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'hiddenfield' )
					evt.data.dialog = 'hiddenfield';
				else if ( element.is( 'input' ) )
				{
					switch ( element.getAttribute( 'type' ) )
					{
						case 'button' :
						case 'submit' :
						case 'reset' :
							evt.data.dialog = 'button';
							break;
						case 'checkbox' :
							evt.data.dialog = 'checkbox';
							break;
						case 'radio' :
							evt.data.dialog = 'radio';
							break;
						case 'image' :
							evt.data.dialog = 'imagebutton';
							break;
						default :
							evt.data.dialog = 'textfield';
							break;
					}
				}
			});
	},

	afterInit : function( editor )
	{
		var dataProcessor = editor.dataProcessor,
			htmlFilter = dataProcessor && dataProcessor.htmlFilter,
			dataFilter = dataProcessor && dataProcessor.dataFilter;

		// Cleanup certain IE form elements default values.
		if ( OMEDITOR.env.ie )
		{
			htmlFilter && htmlFilter.addRules(
			{
				elements :
				{
					input : function( input )
					{
						var attrs = input.attributes,
							type = attrs.type;
						// Old IEs don't provide type for Text inputs #5522
						if ( !type )
							attrs.type = 'text';
						if ( type == 'checkbox' || type == 'radio' )
							attrs.value == 'on' && delete attrs.value;
					}
				}
			} );
		}

		if ( dataFilter )
		{
			dataFilter.addRules(
			{
				elements :
				{
					input : function( element )
					{
						if ( element.attributes.type == 'hidden' )
							return editor.createFakeParserElement( element, 'cke_hidden', 'hiddenfield' );
					}
				}
			} );
		}
	},
	requires : [ 'image', 'fakeobjects' ]
} );

if ( OMEDITOR.env.ie )
{
	OMEDITOR.dom.element.prototype.hasAttribute = OMEDITOR.tools.override( OMEDITOR.dom.element.prototype.hasAttribute,
		function( original )
		{
			return function( name )
				{
					var $attr = this.$.attributes.getNamedItem( name );

					if ( this.getName() == 'input' )
					{
						switch ( name )
						{
							case 'class' :
								return this.$.className.length > 0;
							case 'checked' :
								return !!this.$.checked;
							case 'value' :
								var type = this.getAttribute( 'type' );
								return type == 'checkbox' || type == 'radio' ? this.$.value != 'on' : this.$.value;
						}
					}

					return original.apply( this, arguments );
				};
		});
}
