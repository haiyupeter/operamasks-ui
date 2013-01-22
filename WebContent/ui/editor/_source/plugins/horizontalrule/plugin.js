/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @file Horizontal Rule plugin.
 */

(function()
{
	var horizontalruleCmd =
	{
		canUndo : false,    // The undo snapshot will be handled by 'insertElement'.
		exec : function( editor )
		{
			var hr = editor.document.createElement( 'hr' ),
				range = new OMEDITOR.dom.range( editor.document );

			editor.insertElement( hr );

			// If there's nothing or a non-editable block followed by, establish a new paragraph
			// to make sure cursor is not trapped.
			range.moveToPosition( hr, OMEDITOR.POSITION_AFTER_END );
			var next = hr.getNext();
			if ( !next || next.type == OMEDITOR.NODE_ELEMENT && !next.isEditable() )
				range.fixBlock( true, editor.config.enterMode == OMEDITOR.ENTER_DIV ? 'div' : 'p'  );

			range.select();
		}
	};

	var pluginName = 'horizontalrule';

	// Register a plugin named "horizontalrule".
	OMEDITOR.plugins.add( pluginName,
	{
		init : function( editor )
		{
			editor.addCommand( pluginName, horizontalruleCmd );
			editor.ui.addButton( 'HorizontalRule',
				{
					label : editor.lang.horizontalrule,
					command : pluginName
				});
		}
	});
})();
