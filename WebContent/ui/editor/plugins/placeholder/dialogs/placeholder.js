/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

(function(){function a(b,c){var d=b.lang.placeholder,e=b.lang.common.generalTab;return{title:d.title,minWidth:300,minHeight:80,contents:[{id:'info',label:e,title:e,elements:[{id:'text',type:'text',style:'width: 100%;',label:d.text,'default':'',required:true,validate:OMEDITOR.dialog.validate.notEmpty(d.textMissing),setup:function(f){if(c)this.setValue(f.getText().slice(2,-2));},commit:function(f){var g='[['+this.getValue()+']]';OMEDITOR.plugins.placeholder.createPlaceholder(b,f,g);}}]}],onShow:function(){if(c)this._element=OMEDITOR.plugins.placeholder.getSelectedPlaceHoder(b);this.setupContent(this._element);},onOk:function(){this.commitContent(this._element);delete this._element;}};};OMEDITOR.dialog.add('createplaceholder',function(b){return a(b);});OMEDITOR.dialog.add('editplaceholder',function(b){return a(b,1);});})();
