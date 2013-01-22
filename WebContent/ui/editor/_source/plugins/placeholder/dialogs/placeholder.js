/*
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 */

(function()
{
	function placeholderDialog( editor, isEdit )
	{

		var lang = editor.lang.placeholder,
			generalLabel = editor.lang.common.generalTab;
		return {
			title : lang.title,
			minWidth : 300,
			minHeight : 80,
			contents :
			[
				{
					id : 'info',
					label : generalLabel,
					title : generalLabel,
					elements :
					[
						{
							id : 'text',
							type : 'text',
							style : 'width: 100%;',
							label : lang.text,
							'default' : '',
							required : true,
							validate : OMEDITOR.dialog.validate.notEmpty( lang.textMissing ),
							setup : function( element )
							{
								if ( isEdit )
									this.setValue( element.getText().slice( 2, -2 ) );
							},
							commit : function( element )
							{
								var text = '[[' + this.getValue() + ']]';
								// The placeholder must be recreated.
								OMEDITOR.plugins.placeholder.createPlaceholder( editor, element, text );
							}
						}
					]
				}
			],
			onShow : function()
			{
				if ( isEdit )
					this._element = OMEDITOR.plugins.placeholder.getSelectedPlaceHoder( editor );

				this.setupContent( this._element );
			},
			onOk : function()
			{
				this.commitContent( this._element );
				delete this._element;
			}
		};
	}

	OMEDITOR.dialog.add( 'createplaceholder', function( editor )
		{
			return placeholderDialog( editor );
		});
	OMEDITOR.dialog.add( 'editplaceholder', function( editor )
		{
			return placeholderDialog( editor, 1 );
		});
} )();
