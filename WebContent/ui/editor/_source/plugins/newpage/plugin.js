/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @file Horizontal Page Break
 */

// Register a plugin named "newpage".
OMEDITOR.plugins.add( 'newpage',
{
	init : function( editor )
	{
		editor.addCommand( 'newpage',
			{
				modes : { wysiwyg:1, source:1 },

				exec : function( editor )
				{
					var command = this;
					editor.setData( editor.config.newpage_html || '', function()
					{
						// Save the undo snapshot after all document changes are affected. (#4889)
						setTimeout( function ()
						{
							editor.fire( 'afterCommandExec',
							{
								name: command.name,
								command: command
							} );
							editor.selectionChange();

						}, 200 );
					} );
					editor.focus();
				},
				async : true
			});

		editor.ui.addButton( 'NewPage',
			{
				label : editor.lang.newPage,
				command : 'newpage'
			});
	}
});
/**
 * The HTML to load in the editor when the "new page" command is executed.
 * @type String
 * @default ''
 * @example
 * config.newpage_html = '&lt;p&gt;Type your text here.&lt;/p&gt;';
 */
