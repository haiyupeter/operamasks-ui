/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add('uicolor',{requires:['dialog'],lang:['en','he'],init:function(a){if(OMEDITOR.env.ie6Compat)return;a.addCommand('uicolor',new OMEDITOR.dialogCommand('uicolor'));a.ui.addButton('UIColor',{label:a.lang.uicolor.title,command:'uicolor',icon:this.path+'uicolor.gif'});OMEDITOR.dialog.add('uicolor',this.path+'dialogs/uicolor.js');OMEDITOR.scriptLoader.load(OMEDITOR.getUrl('plugins/uicolor/yui/yui.js'));a.element.getDocument().appendStyleSheet(OMEDITOR.getUrl('plugins/uicolor/yui/assets/yui.css'));}});
