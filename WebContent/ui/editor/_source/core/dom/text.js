/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.dom.text} class, which represents
 *		a DOM text node.
 */

/**
 * Represents a DOM text node.
 * @constructor
 * @augments OMEDITOR.dom.node
 * @param {Object|String} text A native DOM text node or a string containing
 *		the text to use to create a new text node.
 * @param {OMEDITOR.dom.document} [ownerDocument] The document that will contain
 *		the node in case of new node creation. Defaults to the current document.
 * @example
 * var nativeNode = document.createTextNode( 'Example' );
 * var text = OMEDITOR.dom.text( nativeNode );
 * @example
 * var text = OMEDITOR.dom.text( 'Example' );
 */
OMEDITOR.dom.text = function( text, ownerDocument )
{
	if ( typeof text == 'string' )
		text = ( ownerDocument ? ownerDocument.$ : document ).createTextNode( text );

	// Theoretically, we should call the base constructor here
	// (not OMEDITOR.dom.node though). But, IE doesn't support expando
	// properties on text node, so the features provided by domObject will not
	// work for text nodes (which is not a big issue for us).
	//
	// OMEDITOR.dom.domObject.call( this, element );

	/**
	 * The native DOM text node represented by this class instance.
	 * @type Object
	 * @example
	 * var element = new OMEDITOR.dom.text( 'Example' );
	 * alert( element.$.nodeType );  // "3"
	 */
	this.$ = text;
};

OMEDITOR.dom.text.prototype = new OMEDITOR.dom.node();

OMEDITOR.tools.extend( OMEDITOR.dom.text.prototype,
	/** @lends OMEDITOR.dom.text.prototype */
	{
		/**
		 * The node type. This is a constant value set to
		 * {@link OMEDITOR.NODE_TEXT}.
		 * @type Number
		 * @example
		 */
		type : OMEDITOR.NODE_TEXT,

		getLength : function()
		{
			return this.$.nodeValue.length;
		},

		getText : function()
		{
			return this.$.nodeValue;
		},

		setText : function( text )
		{
			this.$.nodeValue = text;
		},

		/**
		 * Breaks this text node into two nodes at the specified offset,
		 * keeping both in the tree as siblings. This node then only contains
		 * all the content up to the offset point. A new text node, which is
		 * inserted as the next sibling of this node, contains all the content
		 * at and after the offset point. When the offset is equal to the
		 * length of this node, the new node has no data.
		 * @param {Number} The position at which to split, starting from zero.
		 * @returns {OMEDITOR.dom.text} The new text node.
		 */
		split : function( offset )
		{
			// If the offset is after the last char, IE creates the text node
			// on split, but don't include it into the DOM. So, we have to do
			// that manually here.
			if ( OMEDITOR.env.ie && offset == this.getLength() )
			{
				var next = this.getDocument().createText( '' );
				next.insertAfter( this );
				return next;
			}

			var doc = this.getDocument();
			var retval = new OMEDITOR.dom.text( this.$.splitText( offset ), doc );

			// IE BUG: IE8 does not update the childNodes array in DOM after splitText(),
			// we need to make some DOM changes to make it update. (#3436)
			if ( OMEDITOR.env.ie8 )
			{
				var workaround = new OMEDITOR.dom.text( '', doc );
				workaround.insertAfter( retval );
				workaround.remove();
			}

			return retval;
		},

		/**
		 * Extracts characters from indexA up to but not including indexB.
		 * @param {Number} indexA An integer between 0 and one less than the
		 *		length of the text.
		 * @param {Number} [indexB] An integer between 0 and the length of the
		 *		string. If omitted, extracts characters to the end of the text.
		 */
		substring : function( indexA, indexB )
		{
			// We need the following check due to a Firefox bug
			// https://bugzilla.mozilla.org/show_bug.cgi?id=458886
			if ( typeof indexB != 'number' )
				return this.$.nodeValue.substr( indexA );
			else
				return this.$.nodeValue.substring( indexA, indexB );
		}
	});
