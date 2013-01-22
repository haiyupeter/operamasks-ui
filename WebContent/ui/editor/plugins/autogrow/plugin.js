/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function(){var a=function(b){if(!b.window)return;var c=b.document,d=b.window.getViewPaneSize().height,e;if(OMEDITOR.env.ie||OMEDITOR.env.gecko)e=c.getBody().$.scrollHeight+(OMEDITOR.env.ie&&OMEDITOR.env.quirks?0:24);else e=c.getDocumentElement().$.offsetHeight;var f=b.config.autoGrow_minHeight,g=b.config.autoGrow_maxHeight;f==undefined&&(b.config.autoGrow_minHeight=f=200);if(f)e=Math.max(e,f);if(g)e=Math.min(e,g);if(e!=d){e=b.fire('autoGrow',{currentHeight:d,newHeight:e}).newHeight;b.resize(b.container.getStyle('width'),e,true);}};OMEDITOR.plugins.add('autogrow',{init:function(b){for(var c in {contentDom:1,key:1,selectionChange:1,insertElement:1})b.on(c,function(d){var e=b.getCommand('maximize');if(d.editor.mode=='wysiwyg'&&(!e||e.state!=OMEDITOR.TRISTATE_ON))setTimeout(function(){a(d.editor);},100);});}});})();
