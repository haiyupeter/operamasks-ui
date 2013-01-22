/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * A lightweight representation of an HTML comment.
 * @constructor
 * @example
 */
OMEDITOR.htmlParser.comment = function( value )
{
	/**
	 * The comment text.
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

OMEDITOR.htmlParser.comment.prototype =
{
	/**
	 * The node type. This is a constant value set to {@link OMEDITOR.NODE_COMMENT}.
	 * @type Number
	 * @example
	 */
	type : OMEDITOR.NODE_COMMENT,

	/**
	 * Writes the HTML representation of this comment to a OMEDITOR.htmlWriter.
	 * @param {OMEDITOR.htmlWriter} writer The writer to which write the HTML.
	 * @example
	 */
	writeHtml : function( writer, filter )
	{
		var comment = this.value;

		if ( filter )
		{
			if ( !( comment = filter.onComment( comment, this ) ) )
				return;

			if ( typeof comment != 'string' )
			{
				comment.parent = this.parent;
				comment.writeHtml( writer, filter );
				return;
			}
		}

		writer.comment( comment );
	}
};
