/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add( 'basicstyles',
{
	requires : [ 'styles', 'button' ],

	init : function( editor )
	{
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, buttonLabel, commandName, styleDefiniton )
		{
			var style = new OMEDITOR.style( styleDefiniton );

			editor.attachStyleStateChange( style, function( state )
				{
					!editor.readOnly && editor.getCommand( commandName ).setState( state );
				});

			editor.addCommand( commandName, new OMEDITOR.styleCommand( style ) );

			editor.ui.addButton( buttonName,
				{
					label : buttonLabel,
					command : commandName
				});
		};

		var config = editor.config,
			lang = editor.lang;

		addButtonCommand( 'Bold'		, lang.bold		, 'bold'		, config.coreStyles_bold );
		addButtonCommand( 'Italic'		, lang.italic		, 'italic'		, config.coreStyles_italic );
		addButtonCommand( 'Underline'	, lang.underline		, 'underline'	, config.coreStyles_underline );
		addButtonCommand( 'Strike'		, lang.strike		, 'strike'		, config.coreStyles_strike );
		addButtonCommand( 'Subscript'	, lang.subscript		, 'subscript'	, config.coreStyles_subscript );
		addButtonCommand( 'Superscript'	, lang.superscript		, 'superscript'	, config.coreStyles_superscript );
	}
});

// Basic Inline Styles.

/**
 * The style definition to be used to apply the bold style in the text.
 * @type Object
 * @example
 * config.coreStyles_bold = { element : 'b', overrides : 'strong' };
 * @example
 * config.coreStyles_bold = { element : 'span', attributes : {'class': 'Bold'} };
 */
OMEDITOR.config.coreStyles_bold = { element : 'strong', overrides : 'b' };

/**
 * The style definition to be used to apply the italic style in the text.
 * @type Object
 * @default { element : 'em', overrides : 'i' }
 * @example
 * config.coreStyles_italic = { element : 'i', overrides : 'em' };
 * @example
 * OMEDITOR.config.coreStyles_italic = { element : 'span', attributes : {'class': 'Italic'} };
 */
OMEDITOR.config.coreStyles_italic = { element : 'em', overrides : 'i' };

/**
 * The style definition to be used to apply the underline style in the text.
 * @type Object
 * @default { element : 'u' }
 * @example
 * OMEDITOR.config.coreStyles_underline = { element : 'span', attributes : {'class': 'Underline'}};
 */
OMEDITOR.config.coreStyles_underline = { element : 'u' };

/**
 * The style definition to be used to apply the strike style in the text.
 * @type Object
 * @default { element : 'strike' }
 * @example
 * OMEDITOR.config.coreStyles_strike = { element : 'span', attributes : {'class': 'StrikeThrough'}, overrides : 'strike' };
 */
OMEDITOR.config.coreStyles_strike = { element : 'strike' };

/**
 * The style definition to be used to apply the subscript style in the text.
 * @type Object
 * @default { element : 'sub' }
 * @example
 * OMEDITOR.config.coreStyles_subscript = { element : 'span', attributes : {'class': 'Subscript'}, overrides : 'sub' };
 */
OMEDITOR.config.coreStyles_subscript = { element : 'sub' };

/**
 * The style definition to be used to apply the superscript style in the text.
 * @type Object
 * @default { element : 'sup' }
 * @example
 * OMEDITOR.config.coreStyles_superscript = { element : 'span', attributes : {'class': 'Superscript'}, overrides : 'sup' };
 */
OMEDITOR.config.coreStyles_superscript = { element : 'sup' };
