/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

// Register a plugin named "sample".
OMEDITOR.plugins.add( 'keystrokes',
{
	beforeInit : function( editor )
	{
		/**
		 * Controls keystrokes typing in this editor instance.
		 * @name OMEDITOR.editor.prototype.keystrokeHandler
		 * @type OMEDITOR.keystrokeHandler
		 * @example
		 */
		editor.keystrokeHandler = new OMEDITOR.keystrokeHandler( editor );

		editor.specialKeys = {};
	},

	init : function( editor )
	{
		var keystrokesConfig	= editor.config.keystrokes,
			blockedConfig		= editor.config.blockedKeystrokes;

		var keystrokes			= editor.keystrokeHandler.keystrokes,
			blockedKeystrokes	= editor.keystrokeHandler.blockedKeystrokes;

		for ( var i = 0 ; i < keystrokesConfig.length ; i++ )
			keystrokes[ keystrokesConfig[i][0] ] = keystrokesConfig[i][1];

		for ( i = 0 ; i < blockedConfig.length ; i++ )
			blockedKeystrokes[ blockedConfig[i] ] = 1;
	}
});

/**
 * Controls keystrokes typing in an editor instance.
 * @constructor
 * @param {OMEDITOR.editor} editor The editor instance.
 * @example
 */
OMEDITOR.keystrokeHandler = function( editor )
{
	if ( editor.keystrokeHandler )
		return editor.keystrokeHandler;

	/**
	 * List of keystrokes associated to commands. Each entry points to the
	 * command to be executed.
	 * @type Object
	 * @example
	 */
	this.keystrokes = {};

	/**
	 * List of keystrokes that should be blocked if not defined at
	 * {@link keystrokes}. In this way it is possible to block the default
	 * browser behavior for those keystrokes.
	 * @type Object
	 * @example
	 */
	this.blockedKeystrokes = {};

	this._ =
	{
		editor : editor
	};

	return this;
};

(function()
{
	var cancel;
	
	var onKeyUp = function( event )
	{
	    var editor = this._.editor;
        if (jQuery.isFunction(editor.config.onKeyUp)){
            // fire custom event
            editor.config.onKeyUp(event);
        }
	};

	var onKeyDown = function( event )
	{
		// The DOM event object is passed by the "data" property.
		event = event.data;

		var keyCombination = event.getKeystroke();
		var command = this.keystrokes[ keyCombination ];
		var editor = this._.editor;


		cancel = ( editor.fire( 'key', { keyCode : keyCombination } ) === true );

		if ( !cancel )
		{
			if ( command )
			{
				var data = { from : 'keystrokeHandler' };
				cancel = ( editor.execCommand( command, data ) !== false );
			}

			if  ( !cancel )
			{
				var handler = editor.specialKeys[ keyCombination ];
				cancel = ( handler && handler( editor ) === true );

				if ( !cancel )
					cancel = !!this.blockedKeystrokes[ keyCombination ];
			}
		}

		if ( cancel )
			event.preventDefault( true );

		return !cancel;
	};

	var onKeyPress = function( event )
	{
		if ( cancel )
		{
			cancel = false;
			event.data.preventDefault( true );
		}
	};

	OMEDITOR.keystrokeHandler.prototype =
	{
		/**
		 * Attaches this keystroke handle to a DOM object. Keystrokes typed
		 ** over this object will get handled by this keystrokeHandler.
		 * @param {OMEDITOR.dom.domObject} domObject The DOM object to attach
		 *		to.
		 * @example
		 */
		attach : function( domObject )
		{
			// For most browsers, it is enough to listen to the keydown event
			// only.
			domObject.on( 'keydown', onKeyDown, this );

			domObject.on( 'keyup', onKeyUp, this );

			// Some browsers instead, don't cancel key events in the keydown, but in the
			// keypress. So we must do a longer trip in those cases.
			if ( OMEDITOR.env.opera || ( OMEDITOR.env.gecko && OMEDITOR.env.mac ) )
				domObject.on( 'keypress', onKeyPress, this );
		}
	};
})();

/**
 * A list of keystrokes to be blocked if not defined in the {@link OMEDITOR.config.keystrokes}
 * setting. In this way it is possible to block the default browser behavior
 * for those keystrokes.
 * @type Array
 * @default (see example)
 * @example
 * // This is actually the default value.
 * config.blockedKeystrokes =
 * [
 *     OMEDITOR.CTRL + 66 &#47;*B*&#47;,
 *     OMEDITOR.CTRL + 73 &#47;*I*&#47;,
 *     OMEDITOR.CTRL + 85 &#47;*U*&#47;
 * ];
 */
OMEDITOR.config.blockedKeystrokes =
[
	OMEDITOR.CTRL + 66 /*B*/,
	OMEDITOR.CTRL + 73 /*I*/,
	OMEDITOR.CTRL + 85 /*U*/
];

/**
 * A list associating keystrokes to editor commands. Each element in the list
 * is an array where the first item is the keystroke, and the second is the
 * name of the command to be executed.
 * @type Array
 * @default (see example)
 * @example
 * // This is actually the default value.
 * config.keystrokes =
 * [
 *     [ OMEDITOR.ALT + 121 &#47;*F10*&#47;, 'toolbarFocus' ],
 *     [ OMEDITOR.ALT + 122 &#47;*F11*&#47;, 'elementsPathFocus' ],
 *
 *     [ OMEDITOR.SHIFT + 121 &#47;*F10*&#47;, 'contextMenu' ],
 *
 *     [ OMEDITOR.CTRL + 90 &#47;*Z*&#47;, 'undo' ],
 *     [ OMEDITOR.CTRL + 89 &#47;*Y*&#47;, 'redo' ],
 *     [ OMEDITOR.CTRL + OMEDITOR.SHIFT + 90 &#47;*Z*&#47;, 'redo' ],
 *
 *     [ OMEDITOR.CTRL + 76 &#47;*L*&#47;, 'link' ],
 *
 *     [ OMEDITOR.CTRL + 66 &#47;*B*&#47;, 'bold' ],
 *     [ OMEDITOR.CTRL + 73 &#47;*I*&#47;, 'italic' ],
 *     [ OMEDITOR.CTRL + 85 &#47;*U*&#47;, 'underline' ],
 *
 *     [ OMEDITOR.ALT + 109 &#47;*-*&#47;, 'toolbarCollapse' ]
 * ];
 */
OMEDITOR.config.keystrokes =
[
	[ OMEDITOR.ALT + 121 /*F10*/, 'toolbarFocus' ],
	[ OMEDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' ],

	[ OMEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],
	[ OMEDITOR.CTRL + OMEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],

	[ OMEDITOR.CTRL + 90 /*Z*/, 'undo' ],
	[ OMEDITOR.CTRL + 89 /*Y*/, 'redo' ],
	[ OMEDITOR.CTRL + OMEDITOR.SHIFT + 90 /*Z*/, 'redo' ],

	[ OMEDITOR.CTRL + 76 /*L*/, 'link' ],

	[ OMEDITOR.CTRL + 66 /*B*/, 'bold' ],
	[ OMEDITOR.CTRL + 73 /*I*/, 'italic' ],
	[ OMEDITOR.CTRL + 85 /*U*/, 'underline' ],

	[ OMEDITOR.ALT + ( OMEDITOR.env.ie || OMEDITOR.env.webkit ? 189 : 109 ) /*-*/, 'toolbarCollapse' ],
	[ OMEDITOR.ALT + 48 /*0*/, 'a11yHelp' ]
];

/**
 * Fired when any keyboard key (or combination) is pressed into the editing area.
 * @name OMEDITOR.editor#key
 * @event
 * @param {Number} data.keyCode A number representing the key code (or
 *		combination). It is the sum of the current key code and the
 *		{@link OMEDITOR.CTRL}, {@link OMEDITOR.SHIFT} and {@link OMEDITOR.ALT}
 *		constants, if those are pressed.
 */
