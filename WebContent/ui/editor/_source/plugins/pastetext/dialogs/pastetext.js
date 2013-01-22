/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function()
{
	OMEDITOR.dialog.add( 'pastetext', function( editor )
		{
			return {
				title : editor.lang.pasteText.title,

				minWidth : OMEDITOR.env.ie && OMEDITOR.env.quirks ? 368 : 350,
				minHeight : 240,

				onShow : function(){ this.setupContent(); },
				onOk : function(){ this.commitContent(); },

				contents :
				[
					{
						label : editor.lang.common.generalTab,
						id : 'general',
						elements :
						[
							{
								type : 'html',
								id : 'pasteMsg',
								html : '<div style="white-space:normal;width:340px;">' + editor.lang.clipboard.pasteMsg + '</div>'
							},
							{
								type : 'textarea',
								id : 'content',
								className : 'cke_pastetext',

								onLoad : function()
								{
									var label = this.getDialog().getContentElement( 'general', 'pasteMsg' ).getElement(),
										input = this.getElement().getElementsByTag( 'textarea' ).getItem( 0 );

									input.setAttribute( 'aria-labelledby', label.$.id );
									input.setStyle( 'direction', editor.config.contentsLangDirection );
								},

								focus : function()
								{
									this.getElement().focus();
								},
								setup : function()
								{
									this.setValue( '' );
								},
								commit : function()
								{
									var value = this.getValue();
									setTimeout( function()
									{
										editor.fire( 'paste', { 'text' : value } );
									}, 0 );
								}
							}
						]
					}
				]
			};
		});
})();
