/*
 * $Id: om-grid-rowexpander.js,v 1.7 2012/06/29 09:22:20 chentianzhen Exp $
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
    $.omWidget.addInitListener('om.omGrid',function(){
        var self = this,
        	ops = this.options,
            rdp = ops.rowDetailsProvider, //渲染行详情的function
            cm = ops.colModel,
            $thead = this.thead;
            
        if( !(rdp && cm.length>0) ){
            return;
        }
        
        ops._onResizableCallbacks.push(_resizeRowExpander);
        ops._onResizableStopCallbacks.push(_resizeRowExpander);
        
        $thead.find("th:first").before('<th align="center" axis="expenderCol" class="expenderCol" rowspan='
        								+($.isArray(cm[0])?cm.length:1)+'><div style="text-align: center; width: 14px;"></div></th>');
        var autoExpandColIndex = -1,
            allColsWidth = 0;
            
        cm = this._getColModel();//确保此时cm为最简单形式的colModel
        $(cm).each(function(i){
        	if(cm[i].width == 'autoExpand'){
                autoExpandColIndex = i;
            }else{
                allColsWidth += cm[i].width;
            }
        });

        var expenderWidth = $thead.find('th[axis="expenderCol"]').width();
        if(autoExpandColIndex != -1){ //说明有某列要自动扩充
        	$thead.find('th[axis="col'+autoExpandColIndex+'"] >div')
        		.css("width" , "-="+expenderWidth);
        }else if(ops.autoFit){
            var percent = expenderWidth/allColsWidth;
            $thead.find('th[axis^="col"] >div')
            	.each(function(i){
            		$(this).css('width' , "-=" + parseInt(cm[i].width*percent));
            	});
        }
        
        var colCount= this._getHeaderCols().length;//总共列数
        this.tbody.delegate('td.expenderCol >div','click',function(event){
            var _this = $(this),
                $row = _this.closest('tr'),
                $next = $row.next('tr');
                
            if($next.hasClass('rowExpand-rowDetails')){ //已经构造过了，直接显示/隐藏
                $next.toggle();
            }else{ //没有构造过，则构造并显示
                var rowIndex = self._getTrs().index($row);
                    rowData = self._getRowData(rowIndex),
                    rowDetails = rdp? rdp(rowData,rowIndex):'&#160;';
                $row.after('<tr class="rowExpand-rowDetails"><td colspan="'+(colCount-1)+'"><div class="rowExpand-rowDetails-content">'+rowDetails+'</div></td></tr>');
            }
            
            _this.toggleClass('rowExpand-expanded').parent()
            	.attr('rowspan' , _this.hasClass('rowExpand-expanded')? 2:1);

			_resizeRowExpander.call(self);
            return false; //不触发onRowSelect和onRowClick事件
        });
    });
    
    function _resizeRowExpander(){
    	var $grid = this.element; 
    	var $rowExpander = $grid.find("tr.rowExpand-rowDetails");
    	
    	if($rowExpander.length == 0){
    		return ;
    	}
    	
    	//计算行详情的宽度
    	var $ht = this.hDiv.find("table");
    	var width = $ht.width() - $ht.find("th.expenderCol").outerWidth() - parseInt($rowExpander.find("> td").css("border-right-width"));

    	$rowExpander.each(function(){
    		$(this).find(".rowExpand-rowDetails-content").outerWidth(width);
    	});
    }
})(jQuery);