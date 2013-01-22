/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function()
{

	/**
	 * A lightweight representation of HTML text.
	 * @constructor
	 * @example
	 */
	OMEDITOR.htmlParser.cdata = function( value )
	{
		/**
		 * The CDATA value.
		 * @type String
		 * @example
		 */
		this.value = value;
	};

	OMEDITOR.htmlParser.cdata.prototype =
	{
		/**
		 * CDATA has the same type as {@link OMEDITOR.htmlParser.text} This is
		 * a constant value set to {@link OMEDITOR.NODE_TEXT}.
		 * @type Number
		 * @example
		 */
		type : OMEDITOR.NODE_TEXT,

		/**
		 * Writes write the CDATA with no special manipulations.
		 * @param {OMEDITOR.htmlWriter} writer The writer to which write the HTML.
		 */
		writeHtml : function( writer )
		{
			writer.write( this.value );
		}
	};
})();
