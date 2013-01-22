/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

// Compressed version of core/omeditor_base.js. See original for instructions.
/*jsl:ignore*/
if(!window.OMEDITOR)window.OMEDITOR=(function(){var a={timestamp:'',version:'1.0.0',revision:'7072',_:{},status:'unloaded',basePath:(function(){var d=window.OMEDITOR_BASEPATH||'';if(!d){var e=document.getElementsByTagName('script');for(var f=0;f<e.length;f++){var g=e[f].src.match(/(^|.*[\\\/])omeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);if(g){d=g[1];break;}}}if(d.indexOf(':/')==-1)if(d.indexOf('/')===0)d=location.href.match(/^.*?:\/\/[^\/]*/)[0]+d;else d=location.href.match(/^[^\?]*\/(?:)/)[0]+d;return d;})(),getUrl:function(d){if(d.indexOf(':/')==-1&&d.indexOf('/')!==0)d=this.basePath+d;if(this.timestamp&&d.charAt(d.length-1)!='/')d+=(d.indexOf('?')>=0?'&':'?')+('t=')+this.timestamp;return d;}},b=window.OMEDITOR_GETURL;if(b){var c=a.getUrl;a.getUrl=function(d){return b.call(a,d)||c.call(a,d);};}return a;})();
/*jsl:end*/

// Uncomment the following line to have a new timestamp generated for each
// request, having clear cache load of the editor code.
// OMEDITOR.timestamp = ( new Date() ).valueOf();

if ( OMEDITOR.loader )
	OMEDITOR.loader.load( 'core/omeditor' );
else
{
	// Set the script name to be loaded by the loader.
	OMEDITOR._autoLoad = 'core/omeditor';

	// Include the loader script.
	document.write(
		'<script type="text/javascript" src="' + OMEDITOR.getUrl( '_source/core/loader.js' ) + '"></script>' );
}
