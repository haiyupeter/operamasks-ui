/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
For licensing, see LICENSE.html or http://www.operamasks.org/license
*/

OMEDITOR.dialog.add( 'about', function( editor )
{
	var lang = editor.lang.about;

	return {
		title : OMEDITOR.env.ie ? lang.dlgTitle : lang.title,
		minWidth : 390,
		minHeight : 230,
		contents : [
			{
				id : 'tab1',
				label : '',
				title : '',
				expand : true,
				padding : 0,
				elements :
				[
					{
						type : 'html',
						html :
							'<style type="text/css">' +
								'.cke_about_container' +
								'{' +
									'color:#000 !important;' +
									'padding:10px 10px 0;' +
									'margin-top:5px' +
								'}' +
								'.cke_about_container p' +
								'{' +
									'margin: 0 0 10px;' +
								'}' +
								'.cke_about_container .cke_about_logo' +
								'{' +
									'height:70px;' +
									'background-color:#1B75BB;' +
									'background-image:url(' + OMEDITOR.plugins.get( 'about' ).path + 'dialogs/logo_omeditor.png);' +
									'background-position:center; ' +
									'background-repeat:no-repeat;' +
									'margin-bottom:10px;' +
								'}' +
								'.cke_about_container a' +
								'{' +
									'cursor:pointer !important;' +
									'color:blue !important;' +
									'text-decoration:underline !important;' +
								'}' +
							'</style>' +
							'<div class="cke_about_container">' +
								'<div class="cke_about_logo"></div>' +
								'<p>' +
									'omEditor ' + OMEDITOR.version + '<br>' +
									'<a href="http://ui.operamasks.org/">http://ui.operamasks.org/</a>' +
								'</p>' +
								'<p>' +
									lang.help.replace( '$1', '<a href="http://ui.operamasks.org/">' + lang.userGuide + '</a>' ) +
								'</p>' +
								'<p>' +
									lang.moreInfo + '<br>' +
									'<a href="http://ui.operamasks.org/license">http://ui.operamasks.org/license</a>' +
								'</p>' +
								'<p>' +
									lang.copy.replace( '$1', '<a href="http://ui.operamasks.org/">OperaMasks</a>' ) +
								'</p>' +
							'</div>'
					}
				]
			}
		],
		buttons : [ OMEDITOR.dialog.cancelButton ]
	};
} );
