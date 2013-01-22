/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @class
 */
OMEDITOR.dom.nodeList = function( nativeList )
{
	this.$ = nativeList;
};

OMEDITOR.dom.nodeList.prototype =
{
	count : function()
	{
		return this.$.length;
	},

	getItem : function( index )
	{
		var $node = this.$[ index ];
		return $node ? new OMEDITOR.dom.node( $node ) : null;
	}
};
