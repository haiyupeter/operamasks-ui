/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileSave plugin.
 */

(function()
{
	var saveCmd =
	{
		modes : { wysiwyg:1, source:1 },
		readOnly : 1,

		exec : function( editor )
		{
			var $form = editor.element.$.form;

			if ( $form )
			{
				try
				{
					$form.submit();
				}
				catch( e )
				{
					// If there's a button named "submit" then the form.submit
					// function is masked and can't be called in IE/FF, so we
					// call the click() method of that button.
					if ( $form.submit.click )
						$form.submit.click();
				}
			}
		}
	};

	var pluginName = 'save';

	// Register a plugin named "save".
	OMEDITOR.plugins.add( pluginName,
	{
		init : function( editor )
		{
			var command = editor.addCommand( pluginName, saveCmd );
			command.modes = { wysiwyg : !!( editor.element.$.form ) };

			editor.ui.addButton( 'Save',
				{
					label : editor.lang.save,
					command : pluginName
				});
		}
	});
})();
