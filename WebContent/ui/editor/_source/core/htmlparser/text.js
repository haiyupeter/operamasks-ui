/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function()
{
	var spacesRegex = /[\t\r\n ]{2,}|[\t\r\n]/g;

	/**
	 * A lightweight representation of HTML text.
	 * @constructor
	 * @example
	 */
 	OMEDITOR.htmlParser.text = function( value )
	{
		/**
		 * The text value.
		 * @type String
		 * @example
		 */
		this.value = value;

		/** @private */
		this._ =
		{
			isBlockLike : false
		};
	};

	OMEDITOR.htmlParser.text.prototype =
	{
		/**
		 * The node type. This is a constant value set to {@link OMEDITOR.NODE_TEXT}.
		 * @type Number
		 * @example
		 */
		type : OMEDITOR.NODE_TEXT,

		/**
		 * Writes the HTML representation of this text to a OMEDITOR.htmlWriter.
		 * @param {OMEDITOR.htmlWriter} writer The writer to which write the HTML.
		 * @example
		 */
		writeHtml : function( writer, filter )
		{
			var text = this.value;

			if ( filter && !( text = filter.onText( text, this ) ) )
				return;

			writer.text( text );
		}
	};
})();
