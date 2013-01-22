/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.dom.event} class, which
 *		represents the a native DOM event object.
 */

/**
 * Represents a native DOM event object.
 * @constructor
 * @param {Object} domEvent A native DOM event object.
 * @example
 */
OMEDITOR.dom.event = function( domEvent )
{
	/**
	 * The native DOM event object represented by this class instance.
	 * @type Object
	 * @example
	 */
	this.$ = domEvent;
};

OMEDITOR.dom.event.prototype =
{
	/**
	 * Gets the key code associated to the event.
	 * @returns {Number} The key code.
	 * @example
	 * alert( event.getKey() );  "65" is "a" has been pressed
	 */
	getKey : function()
	{
		return this.$.keyCode || this.$.which;
	},

	/**
	 * Gets a number represeting the combination of the keys pressed during the
	 * event. It is the sum with the current key code and the {@link OMEDITOR.CTRL},
	 * {@link OMEDITOR.SHIFT} and {@link OMEDITOR.ALT} constants.
	 * @returns {Number} The number representing the keys combination.
	 * @example
	 * alert( event.getKeystroke() == 65 );                                   // "a" key
	 * alert( event.getKeystroke() == OMEDITOR.CTRL + 65 );                   // CTRL + "a" key
	 * alert( event.getKeystroke() == OMEDITOR.CTRL + OMEDITOR.SHIFT + 65 );  // CTRL + SHIFT + "a" key
	 */
	getKeystroke : function()
	{
		var keystroke = this.getKey();

		if ( this.$.ctrlKey || this.$.metaKey )
			keystroke += OMEDITOR.CTRL;

		if ( this.$.shiftKey )
			keystroke += OMEDITOR.SHIFT;

		if ( this.$.altKey )
			keystroke += OMEDITOR.ALT;

		return keystroke;
	},

	/**
	 * Prevents the original behavior of the event to happen. It can optionally
	 * stop propagating the event in the event chain.
	 * @param {Boolean} [stopPropagation] Stop propagating this event in the
	 *		event chain.
	 * @example
	 * var element = OMEDITOR.document.getById( 'myElement' );
	 * element.on( 'click', function( ev )
	 *     {
	 *         // The DOM event object is passed by the "data" property.
	 *         var domEvent = ev.data;
	 *         // Prevent the click to chave any effect in the element.
	 *         domEvent.preventDefault();
	 *     });
	 */
	preventDefault : function( stopPropagation )
	{
		var $ = this.$;
		if ( $.preventDefault )
			$.preventDefault();
		else
			$.returnValue = false;

		if ( stopPropagation )
			this.stopPropagation();
	},

	stopPropagation : function()
	{
		var $ = this.$;
		if ( $.stopPropagation )
			$.stopPropagation();
		else
			$.cancelBubble = true;
	},

	/**
	 * Returns the DOM node where the event was targeted to.
	 * @returns {OMEDITOR.dom.node} The target DOM node.
	 * @example
	 * var element = OMEDITOR.document.getById( 'myElement' );
	 * element.on( 'click', function( ev )
	 *     {
	 *         // The DOM event object is passed by the "data" property.
	 *         var domEvent = ev.data;
	 *         // Add a CSS class to the event target.
	 *         domEvent.getTarget().addClass( 'clicked' );
	 *     });
	 */

	getTarget : function()
	{
		var rawNode = this.$.target || this.$.srcElement;
		return rawNode ? new OMEDITOR.dom.node( rawNode ) : null;
	}
};

// For the followind constants, we need to go over the Unicode boundaries
// (0x10FFFF) to avoid collision.

/**
 * CTRL key (0x110000).
 * @constant
 * @example
 */
OMEDITOR.CTRL = 0x110000;

/**
 * SHIFT key (0x220000).
 * @constant
 * @example
 */
OMEDITOR.SHIFT = 0x220000;

/**
 * ALT key (0x440000).
 * @constant
 * @example
 */
OMEDITOR.ALT = 0x440000;
