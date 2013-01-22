/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.skins.add('v2',(function(){return{editor:{css:['editor.css']},dialog:{css:['dialog.css']},separator:{canGroup:false},templates:{css:['templates.css']},margins:[0,14,18,14]};})());(function(){OMEDITOR.dialog?a():OMEDITOR.on('dialogPluginReady',a);function a(){OMEDITOR.dialog.on('resize',function(b){var c=b.data,d=c.width,e=c.height,f=c.dialog,g=f.parts.contents;if(c.skin!='v2')return;g.setStyles({width:d+'px',height:e+'px'});if(!OMEDITOR.env.ie||OMEDITOR.env.ie9Compat)return;setTimeout(function(){var h=f.parts.dialog.getChild([0,0,0]),i=h.getChild(0),j=i.getSize('width');e+=i.getChild(0).getSize('height')+1;var k=h.getChild(2);k.setSize('width',j);k=h.getChild(7);k.setSize('width',j-28);k=h.getChild(4);k.setSize('height',e);k=h.getChild(5);k.setSize('height',e);},100);});};})();
