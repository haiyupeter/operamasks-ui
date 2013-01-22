/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.dom.comment} class, which represents
 *		a DOM comment node.
 */

OMEDITOR.dom.comment = OMEDITOR.tools.createClass(
{
	base : OMEDITOR.dom.node,

	$ : function( text, ownerDocument )
	{
		if ( typeof text == 'string' )
			text = ( ownerDocument ? ownerDocument.$ : document ).createComment( text );

		this.base( text );
	},

	proto :
	{
		type : OMEDITOR.NODE_COMMENT,

		getOuterHtml : function()
		{
			return '<!--' + this.$.nodeValue + '-->';
		}
	}
});
