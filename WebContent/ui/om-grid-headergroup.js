/*
 * $Id: om-grid-headergroup.js,v 1.9 2012/06/13 05:37:55 chentianzhen Exp $
 * operamasks-ui omGrid @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 * 
 * Depends:
 *  om-grid.js
 */

(function($) {

	$.omWidget.addBeforeInitListener('om.omGrid',function(){
		var cm = this._getColModel();
		if(!$.isArray(cm) || cm.length<=0 || !$.isArray(cm[0])){
			return ;
		}
		_buildBasicColModel(this);
		this.hDiv.addClass("hDiv-group-header");
		
		//把方法绑定在实例上，这样非多表头实例不受影响
		$.extend(this , {
			_getColModel : function(){
				return this._colModel;
			},
			_getHeaderCols : function(){
				var result = [],
					op = this.options,
					$hDiv = this.hDiv,
					$ths = $hDiv.find("th[axis^='col']");
					$($ths).each(function(){result.push(this);});
					
					result.sort(function(first , second){
						return first.axis.slice(3) - second.axis.slice(3);
					});
					
					!op.singleSelect && result.unshift($hDiv.find("th[axis='checkboxCol']")[0]);					
					op.showIndex && result.unshift($hDiv.find("th[axis='indexCol']")[0]);
					op.rowDetailsProvider && result.unshift($hDiv.find("th[axis='expenderCol']")[0]);
					
					return $(result);//此处返回jquery对象主要跟omGrid中的原生方法返回值保持一致
			},
			_buildTableHead : function(){
				var op=this.options,
	                $elem=this.element,
	                $grid = $elem.closest('.om-grid'),
	                cm= op.colModel,
	                allColsWidth = 0, //colModel的宽度
	                autoExpandColIndex = -1,
	                tmp = "<th class='$' $ $ $ $ $><div class='$' style='text-align:$; $'>$</div></th>",
	                content = ["<thead>"],
	                cols,
	                item,
	                rowHeader,
	                $thead;
	            for(var i=0,row=cm.length; i<row; i++){
	            	content.push("<tr>");
	            	if(i == 0){//行号和多选框标题列永远在第一行
	            		if(op.showIndex){
	            			content.push("<th class='indexCol data-header-"+row+"' align='center' axis='indexCol' rowspan="+row+"><div class='indexheader' style='text-align:center;width:25px;' /></th>");
	            		}
	            		if(!op.singleSelect){
	            			content.push("<th class='checkboxCol data-header-"+row+"' align='center' axis='checkboxCol' rowspan="+row+"><div class='checkboxheader' style='text-align:center;width:17px;'><span class='checkbox'/></div></th>");
	            		}
	            	}
	            	rowHeader = cm[i];
	            	for(var j=0,col=rowHeader.length; j<col; j++){
	            		item = rowHeader[j];
	            		var cmWidth = item.width || 60,
	            			cmAlign = item.align || 'center',
	            			name = item.name;
	            		if(item.name && cmWidth == 'autoExpand'){
		                    cmWidth = 0;
		                    autoExpandColIndex = _getColIndex(this,item);
		                }
		                var cls = item.wrap?"wrap" : "";
		                
		                cls += (item.name? " data-header-" : " group-header-")+(item.rowspan?item.rowspan:1);
		                cols = [cls, 
		                		item.align?"align="+item.align:"", 
		                		name?"axis=col"+_getColIndex(this,item):"", 
		                		name?"abbr="+name:"", 
		                		item.rowspan?"rowspan="+item.rowspan:"" ,
		                		item.colspan?"colspan="+item.colspan:"",  
		                		item.wrap?"wrap":"", 
		                		cmAlign, 
		                		name?"width:"+cmWidth+"px":"" , 
		                		item.header];
		                _buildTh(content , cols , tmp);
		                
		                if(item.name){
		                	allColsWidth += cmWidth;
		                }
	            	}
	            	content.push("</tr>");
	            }
	            content.push("</thead>");
	            $('table',this.hDiv).html(content.join(""));
	            $thead = $('thead',this.hDiv);
	            
	            this._fixHeaderWidth(autoExpandColIndex , allColsWidth);
	            this.thead = $thead;
	            $thead = null;
			}
		});

	});
	
	function _getColIndex(self , header){
		var cm = self._getColModel();
		for(var i=0,len=cm.length; i<len; i++){
			if(cm[i].name == header.name){
				return i;
			}
		}
	}
	
	function _buildTh(content , cols , tmp){
    	var j=0;
		content.push(tmp.replace(/\$/g , function(){
			return cols[j++];
		}));
	}
	
	/**
	 * 创建只包含最基本数据的colModel。也就是创建出没有多表头时的基本colModel。注意，生成的colModel是具有顺序的。
	 */
	function _buildBasicColModel(self){
		//基本colModel缓存引用
		self._colModel = [];
		var cm = self._getColModel(),
			matrix = [],
			realRowHeader = [],//colModel中非最后一行的具有真实数据意义的header缓存
			rows = 1,
			cols = 1,
			rowHeader,
			item,
			colIndex,//每个header从哪一列开始渲染
			len = cm.length;

		for(var i=0; i<len; i++){
			matrix[i] = [];
		}
		for(var i=0,row=len; i<row; i++){
			rowHeader = cm[i];
			
			for(var j=0,col=rowHeader.length; j<col; j++){
				item = rowHeader[j];
				rows = item.rowspan || 1;
				cols = item.colspan || 1;
				
				colIndex = _checkMatrix(matrix , i , rows , cols);
				if(item.name){
					realRowHeader.push({header:item , colIndex:colIndex});
				}
			}
		}
		realRowHeader.sort(function(first , second){
			return first.colIndex - second.colIndex;
		});
		i=0;
		while(realRowHeader[i] && self._colModel.push(realRowHeader[i++].header));
	}
	
	function _checkMatrix(matrix , index , rows , cols){
		var i=0;
		while(matrix[index][i] && ++i);
		for(var j=index; j<index+rows; j++){
			for(var k=i; k<i+cols; k++){
				matrix[j][k] = true;
			}
		}
		return i;
	}
		
})(jQuery);