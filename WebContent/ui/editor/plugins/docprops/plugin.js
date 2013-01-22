/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.plugins.add('docprops',{init:function(a){var b=new OMEDITOR.dialogCommand('docProps');b.modes={wysiwyg:a.config.fullPage};a.addCommand('docProps',b);OMEDITOR.dialog.add('docProps',this.path+'dialogs/docprops.js');a.ui.addButton('DocProps',{label:a.lang.docprops.label,command:'docProps'});}});
