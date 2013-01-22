/*
 * $Id: om-grid-sort.js,v 1.5 2012/05/29 00:52:30 chentianzhen Exp $
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
	/**
	 * 分页导航按钮样式与类别
	 */
	var pagerNvg = [
		{cls:"pFirst" , type:"first"},
		{cls:"pPrev" , type:"prev"},
		{cls:"pNext" , type:"next"},
		{cls:"pLast" , type:"last"},
		{cls:"pReload" , type:"reload"}
	];	
	function needChange(self , type){
		var oldPage = self._oldPage,
		    nowPage = self.pageData.nowPage;
		if("input" === type){
			return oldPage != $('.pControl input', self.element.closest('.om-grid')).val();
		}else if("reload" === type){
			return true;
		}else{
			return oldPage != nowPage;
		}
	}
	
    $.omWidget.addInitListener('om.omGrid',function(){
        var self = this,
            cm = this._getColModel(),
            tds = this._getHeaderCols().filter("[axis^='col']"),
            $pDiv = this.pDiv;
        
        $(tds).each(function(index){
            var sortFn=cm[index].sort;
            if(sortFn){
                var _this=$(this).click(function(){
                    var sortCol = cm[index].name;
                    var removeClass = _this.hasClass('asc')?'asc'
                                    : _this.hasClass('desc')?'desc'
                                    : null;
                    var sortDir=(removeClass=='asc'?'desc':'asc');
                    tds.removeClass('asc desc');
                    _this.addClass(sortDir);
                    
                    var extraData = self._extraData;
                    delete extraData.sortBy;
                    delete extraData.sortDir;
                    switch(sortFn){
                        case 'serverSide':
                            extraData.sortBy=sortCol;
                            extraData.sortDir=sortDir;
                            self.reload();
                            return;
                        case 'clientSide':
                            sortFn=function(obj1,obj2){
                                var v1=obj1[sortCol],v2=obj2[sortCol];
                                return v1==v2?0:v1>v2?1:-1;
                            };
                            break;
                        default:
                            // do nothing,keep sortFn==cm[index].sort
                    }
                    var datas = self.pageData.data;
                    if(removeClass==null){//从未排序变成升序排列
                        datas.rows=datas.rows.sort(sortFn);
                    }else{//升序变成降序，或降序变成升序，只需要反转数据即可
                        datas.rows=datas.rows.reverse();
                    }
                    self.refresh();
                });
                _this.children().first().append('<img class="om-grid-sortIcon" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="></img>');
            }
        });
        //监听分页条按钮的事件，如果为客户端排序，每次都要清除掉排序的状态
        for(var i=0,len=pagerNvg.length; i<len; i++){
        	(function(i){
        		$pDiv.find("."+pagerNvg[i].cls).click(function(){
					var change = needChange(self , pagerNvg[i].type);
					tds.each(function(index){
						var $headerCol = $(this);
						if(change && ($headerCol.hasClass('asc') || $headerCol.hasClass('desc')) &&  "serverSide" !== cm[index].sort){
							$headerCol.removeClass('asc desc');
						}
					});
				});	 
        	})(i);
		}
        $('.pControl input', $pDiv).keydown(function(e){
        	var change = needChange(self , "input");
        	if (e.keyCode == $.om.keyCode.ENTER) {
        		tds.each(function(index){
					var $headerCol = $(this);
					if(change && ($headerCol.hasClass('asc') || $headerCol.hasClass('desc')) &&  "serverSide" !== cm[index].sort){
						$headerCol.removeClass('asc desc');
					}
				});
        	}
        });
        
        /**
	     * 清空omGrid的排序状态。比如先在第一列上进行了降序排列，以后每次取数时都是按这个降序排列条件来取数，如果要清空排序条件，调用本方法即可，调用后再次取数时就跟从未进行过排序一样。<br/>
	     * <b>注意：此方法仅清空排序状态，并不立即取数。</b>
	     * @function
	     * @example
	     *  $('.selector').omGrid('clearSort');
	     */
	    this.clearSort=function(){
	        var extraData = this._extraData;
	        extraData.sortBy = undefined;
	        extraData.sortDir = undefined;
	        this._getHeaderCols().removeClass('asc desc');
	        //$('tr:first th[axis^="col"]',this.thead).removeClass('asc desc');
	    };
    });
})(jQuery);