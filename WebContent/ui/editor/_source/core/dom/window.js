/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.dom.document} class, which
 *		represents a DOM document.
 */

/**
 * Represents a DOM window.
 * @constructor
 * @augments OMEDITOR.dom.domObject
 * @param {Object} domWindow A native DOM window.
 * @example
 * var document = new OMEDITOR.dom.window( window );
 */
OMEDITOR.dom.window = function( domWindow )
{
	OMEDITOR.dom.domObject.call( this, domWindow );
};

OMEDITOR.dom.window.prototype = new OMEDITOR.dom.domObject();

OMEDITOR.tools.extend( OMEDITOR.dom.window.prototype,
	/** @lends OMEDITOR.dom.window.prototype */
	{
		/**
		 * Moves the selection focus to this window.
		 * @function
		 * @example
		 * var win = new OMEDITOR.dom.window( window );
		 * <b>win.focus()</b>;
		 */
		focus : function()
		{
			// Webkit is sometimes failed to focus iframe, blur it first(#3835).
			if ( OMEDITOR.env.webkit && this.$.parent )
				this.$.parent.focus();
			this.$.focus();
		},

		/**
		 * Gets the width and height of this window's viewable area.
		 * @function
		 * @returns {Object} An object with the "width" and "height"
		 *		properties containing the size.
		 * @example
		 * var win = new OMEDITOR.dom.window( window );
		 * var size = <b>win.getViewPaneSize()</b>;
		 * alert( size.width );
		 * alert( size.height );
		 */
		getViewPaneSize : function()
		{
			var doc = this.$.document,
				stdMode = doc.compatMode == 'CSS1Compat';
			return {
				width : ( stdMode ? doc.documentElement.clientWidth : doc.body.clientWidth ) || 0,
				height : ( stdMode ? doc.documentElement.clientHeight : doc.body.clientHeight ) || 0
			};
		},

		/**
		 * Gets the current position of the window's scroll.
		 * @function
		 * @returns {Object} An object with the "x" and "y" properties
		 *		containing the scroll position.
		 * @example
		 * var win = new OMEDITOR.dom.window( window );
		 * var pos = <b>win.getScrollPosition()</b>;
		 * alert( pos.x );
		 * alert( pos.y );
		 */
		getScrollPosition : function()
		{
			var $ = this.$;

			if ( 'pageXOffset' in $ )
			{
				return {
					x : $.pageXOffset || 0,
					y : $.pageYOffset || 0
				};
			}
			else
			{
				var doc = $.document;
				return {
					x : doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
					y : doc.documentElement.scrollTop || doc.body.scrollTop || 0
				};
			}
		}
	});
