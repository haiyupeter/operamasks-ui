/*
 * $Id: om-itemselector.js,v 1.15 2012/06/18 08:43:54 wangfan Exp $
 * operamasks-ui omCombo @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-core.js
 *  om-mouse.js
 *  om-sortable.js
 */
;(function($) {
    /**
     * @name omItemSelector
     * @class 左移右移组件。两个多选列表框，可以从左边将一些item移到右边，也可以从右边将一些item移到左边。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用本地数据源，也可以使用远程数据源</li>
     *      <li>包含常用的【左移】【右移】【全部左移】【全部右移】操作</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#itemselector').omItemSelector({
     *         dataSource:[
     *                  {text:'Java',value:'1'},
     *                  {text:'JavaScript',value:'2'},
     *                  {text:'C',value:'3'},
     *                  {text:'PHP',value:'4'},
     *                  {text:'ASP',value:'5'}
     *         ],
     *         width:250,
     *         height:200
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;div id="itemselector"/>
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.omWidget('om.omItemSelector', {
        options: /** @lends omItemSelector#*/{
             /**
              * 组件宽度。
              * @type String
              * @default '250px'
              * @example
              * width : '300px'
              */
             width : '300px',
             /**
              * 组件高度。
              * @type String
              * @default '200px'
              * @example
              * height : '300px'
              */
            height : '300px',
            /**
              * 数据源属性，可以设置为“后台获取数据的URL”或者“JSON数据”
              * @type Array[JSON],URL
              * @default []
              * @example
              * dataSource : '/data/items.json' 
              * 或者
              * dataSource : [{"value":"001","text":"张三"},{"value":"002","text":"李四"}]
              * 或者下面这种(这种非标准的itemData一定要配合clientFormatter使用)
              * dataSource : [{"value":"001","name":"张三"},{"value":"002","name":"李四"}]
              */
            dataSource : [],
            /**
              * 初始值。如dataSource:[{text:'abc',value:1},{text:'def',value:2},{text:'xyz',value:3}]且value:[2]，则左边显示1、3两条，右边显示第2条。
              * @type Array[JSON]
              * @default []
              * @example
              * value : [1,3]
              */
            value : [],
            /**
              * 每个dataSource中每个item如何显示到列表中。默认仅显示item数据的text属性值。
              * @type Function
              * @default 无
              * @example
              * //对于{text:'中国',value:'zh_CN'}将显示成'中国(zh_CN)'这样
              * clientFormatter  : function(itemData,index){
              *     return itemData.text+'('+itemData.value)+')';//返回一段html代码
              * }
              * 
              * //对于{name:'张三',role:'经理',value:'PM'}将显示成红色的'张三(经理)'这样
              * //对于{name:'李四',role:'普通员工',value:'EMP'}将显示成黑色的'李四'这样
              * clientFormatter  : function(itemData,index){
              *     if(itemData.role=='经理'){
              *         return '&lt;font color="red">'+itemData.name+'('+itemData.value)+')&lt;/font>';
              *     }else{
              *         return itemData.name;
              *     }
              * }
              */
            clientFormatter : false,
            /**
              * 左边可选项的标题。
              * @name omItemSelector#availableTitle
              * @type String
              * @default '可选项'
              * @example
              * availableTitle : '可加入的用户组'
              */
            //availableTitle : $.om.lang.omItemSelector.availableTitle,
            /**
              * 右边已选项的标题。
              * @name omItemSelector#selectedTitle
              * @type String
              * @default '已选项'
              * @example
              * selectedTitle : '已加入的用户组'
              */
            //selectedTitle : $.om.lang.omItemSelector.selectedTitle,
            /**
              * 是否自动排序。设为true后每次将item左移或右移时将会对item进行排序（按照dataSource中数据源的顺序）。<b>注意：启用此功能后将无法使用拖动排序功能，也不会显示【上移】【下移】【置顶】【置底】这几个按钮。</b>
              * @type Boolean
              * @default false
              * @example
              * autoSort : true
              */
            autoSort : false,
            /**
              * 给Ajax返回的原始数据的进行预处理的函数。其中参数data是服务器返回的数据。
              * @type Function
              * @field
              * @default 无
              * @example
              * preProcess  : function(data){
              *     return data;//这里返回处理后的数据
              * }
              */
            preProcess : function(data){
                return data;
            },
            /**
             * 以Ajax方式加载数据出错时的回调函数。可以在这里进行一些处理，比如以人性化的方式提示用户。
             * @event
             * @param xmlHttpRequest XMLHttpRequest对象
             * @param textStatus  错误类型
             * @param errorThrown  捕获的异常对象
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onError:function(xmlHttpRequest, textStatus, errorThrown,event){ 
             *      alert('取数出错');
             *  } 
             */
            onError : jQuery.noop,
            /**
             * 以Ajax方式加载数据成功时的回调函数。此方法在渲染可选项item之前执行。
             * @event
             * @param data Ajax请求返回的数据
             * @param textStatus 响应的状态
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onSuccess:function(data, textStatus, event){
             *     if(data.length==0){
             *          alert('没有数据！');
             *     } 
             * }
             */
            onSuccess : jQuery.noop,
            /**
             * 从左边将item移到右边之前执行的动作。如果返回false，则item不会进行移动。用户可以在这个事件中进行一些其它有用的处理，比如监听此方法然后return selectedItems.length &lt; 3就能实现“最多只能选择3个item”的功能
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onBeforeItemSelect:function(itemDatas,event){
             *     alert('即将加入到:'+itemDatas.length+'个群中');
             * }
             */
            onBeforeItemSelect : jQuery.noop,
            /**
             * 从右边将item移到左边之前执行的动作。如果返回false，则item不会进行移动。用户可以在这个事件中进行一些其它有用的处理，比如能实现“员工是基本角色，不可以退出该角色”的功能
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onBeforeItemDeselect:function(itemDatas,event){
             *     $.each(itemDatas,function(index,data){
             *         if(data.text=='员工'){
             *             alert('员工是基本角色，不可以退出该角色！');
             *             return false;
             *         } 
             *     });
             * }
             */
            onBeforeItemDeselect : jQuery.noop,
            /**
             * 从左边将item移到右边之后执行的动作。
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onItemSelect:function(itemDatas,event){
             *      alert('你刚刚选择了'+itemDatas.length+'个条目');
             * }
             */
            onItemSelect : jQuery.noop,
            /**
             * 从右边将item移到左边之后执行的动作。
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onItemDeselect :function(itemDatas,event){
             *      alert('你刚刚去掉了'+itemDatas.length+'个条目');
             * }
             */
            onItemDeselect  : jQuery.noop
        },
        _create:function(){
            this.element.addClass('om-itemselector om-widget').html('<table style="height:100%;width:100%" cellpadding="0" cellspacing="0"><tr><td class="om-itemselector-leftpanel"></td><td class="om-itemselector-toolbar"></td><td class="om-itemselector-rightpanel"></td></tr></table>');
            var tds=$('td',this.element);
            var thead = $('<thead></thead>');
            var cell = $('<th></th>').attr({axis:'checkboxCol',align:'center'})
            .append($('<div class="header"><span class="checkbox"/><span class="om-itemselector-title"/></div>'));
            $('<tr></tr>').append(cell).appendTo(thead);
            this.leftPanel = $('<table cellspacing="0" cellpadding="0"></table>').append(thead)
            .append('<tr><td><div class="om-itemselector-up"><span class="upbtn"/></div><div class="om-itemselector-items"><dl></dl></div><div class="om-itemselector-down"><span class="downbtn"/></div></tr></td>')
            .appendTo(tds.eq(0));
            this.toolbar=$('<div></div>').appendTo(tds.eq(1));
            this.rightPanel=this.leftPanel.clone().appendTo(tds.eq(2));
        },
        _init:function(){
            var op=this.options,
                dataSource=op.dataSource;
            this.leftPanel.find(".om-itemselector-title").html($.om.lang._get(op,"omItemSelector","availableTitle"));
            this.rightPanel.find(".om-itemselector-title").html($.om.lang._get(op,"omItemSelector","selectedTitle"));
            this.element.css({width:op.width,height:op.height});
            this._buildToolbar();
            this._resizePanel();//调整左右fieldset大小
            this._bindEvents();
            if(typeof dataSource ==='string'){
                var self=this;
                $.ajax({
                    url: dataSource,
                    method: 'GET',
                    dataType: 'json',
                    success: function(data, textStatus){
                        if (self._trigger("onSuccess",null,data,textStatus) === false) {
                            return;
                        }
                        data=op.preProcess(data);
                        op.dataSource=data;
                        self._buildList();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                    	self._trigger("onError",null,XMLHttpRequest, textStatus, errorThrown);
                    }
                });
            }else{
                this._buildList();
            }
             
            this._refreshPageButton(this.leftPanel);
            this._refreshPageButton(this.rightPanel);
        },
        _buildToolbar:function(){
            var html='',
                ALL_ICONS=['add','space','remove'];
            for(var i=0,len=ALL_ICONS.length; i<len; i++){
            	var icon=ALL_ICONS[i];
                html+='<div class="om-icon om-itemselector-tbar-'+icon+'"'+' title="'+($.om.lang._get({},"omItemSelector",icon+'IconTip') || '')+'"></div>';
            }
            this.toolbar.html(html);
        },
        _resizePanel:function(){
            var self = this, lp=self.leftPanel,
                rp=self.rightPanel,
                leftItemsContainer=$('.om-itemselector-items',lp),
                rightItemsContainer=$('.om-itemselector-items',rp),
                H=lp.parent().innerHeight()-leftItemsContainer.offset().top+lp.offset().top,
                W=($('tr',self.element).innerWidth()-self.toolbar.outerWidth())/2,
                innerW=lp.outerWidth(W).innerWidth();
            leftItemsContainer.outerHeight(H).width(innerW);
            rightItemsContainer.outerHeight(H).width(innerW);
            self.element.data("dltop",$('.om-itemselector-items >dl',lp).offset().top);
        },
        _buildList:function(){
            var op=this.options;
                dataSource = op.dataSource,
                value = op.value,
                fmt=op.clientFormatter,
                leftHtml='',
                rightHtml='',
                // {text:'abc',value:2}的value是否在value:[0,2,4]这样的数组中
                inArray=function(data,valueArr){
                    for(var i=0,len=valueArr.length;i<len;i++){
                        if(data.value===valueArr[i]){
                            return true;
                        }
                    }
                    return false;
                },
                buildHtml=fmt?function(index,data){
                    return '<dt _index="'+index+'">'+'<span class="checkbox"/>'+fmt(data,index)+'</dt>';
                }:function(index,data){
                    return '<dt _index="'+index+'">'+'<span class="checkbox"/>'+data.text+'</dt>';
                };
            if($.isArray(dataSource) && jQuery.isArray(value)){
                $.each(dataSource,function(index,data){
                    if(inArray(data,value)){//在value中，要放到右边
                        rightHtml+=buildHtml(index,data);
                    }else{//不在value中,放到左边
                        leftHtml+=buildHtml(index,data);
                    }
                });
            }
            $('.om-itemselector-items>dl',this.leftPanel).html(leftHtml);
            $('.om-itemselector-items>dl',this.rightPanel).html(rightHtml);
            var items = $('.om-itemselector-items'),itemdtH =$('>dl>dt',items).outerHeight(),
            h =items.outerHeight(),offset = itemdtH - h%itemdtH;
            items.outerHeight(h+offset);           
        },
        _bindEvents:function(){
            var self=this,
                toolbar=self.toolbar;
            //单击
            self.leftPanel.delegate('.om-itemselector-items>dl>dt','click.omItemSelector',function(e){
            	$(this).toggleClass( 'om-state-highlight' );
            	self._refreshHeaderCheckbox(self.leftPanel);
            });
            self.rightPanel.delegate('.om-itemselector-items>dl>dt','click',function(e){
            	$(this).toggleClass( 'om-state-highlight' );
            	self._refreshHeaderCheckbox(self.rightPanel);
            });
            //双击
            this.leftPanel.delegate('.om-itemselector-items>dl>dt','dblclick',function(){
            	$('.om-itemselector-items>dl>dt',self.element).removeClass('om-state-highlight');
            	$(this).addClass('om-state-highlight');
            	self._moveItemsToTarget('.om-state-highlight',true);
            });
            this.rightPanel.delegate('.om-itemselector-items>dl>dt','dblclick',function(){
            	$('.om-itemselector-items>dl>dt',self.element).removeClass('om-state-highlight');
            	$(this).addClass('om-state-highlight');
                self._moveItemsToTarget('.om-state-highlight',false);
            });
            //右移
            $('.om-itemselector-tbar-add',toolbar).click(function(){
                self._moveItemsToTarget('.om-state-highlight',true);
            });
            //左移
            $('.om-itemselector-tbar-remove',toolbar).click(function(){
                self._moveItemsToTarget('.om-state-highlight',false);
            });
            //全选
            $('.header span.checkbox', self.leftPanel).click(function(){
            	var panel = self.leftPanel, $dt =$('.om-itemselector-items>dl>dt',panel);
            	$(this).toggleClass("selected");
            	if($('div.om-itemselector-up:visible', panel).length > 0){
            		$dt = $(self._getPageItems(panel, $dt));
            	}
            	if($(this).hasClass("selected")){
            		$dt.addClass("om-state-highlight");
            	}else{
            		$dt.removeClass("om-state-highlight");
            	}
            });
            $('.header span.checkbox', self.rightPanel).click(function(){
            	var panel = self.rightPanel, $dt =$('.om-itemselector-items>dl>dt',panel);
            	$(this).toggleClass("selected");
            	if($('div.om-itemselector-up:visible', panel).length > 0){
            		$dt = $(self._getPageItems(panel, $dt));
            	}
            	if($(this).hasClass("selected")){
            		$dt.addClass("om-state-highlight");
            	}else{
            		$dt.removeClass("om-state-highlight");
            	}
            });
            //翻页
            self.element.delegate('div.om-itemselector-up:not([disabled])','click', function(){
            	self._page($(this),true);
            	self._refreshHeaderCheckbox($(this).parentsUntil('table').last().parent());
            });
            self.element.delegate('div.om-itemselector-down:not([disabled])','click',function(){
            	self._page($(this), false);
            	self._refreshHeaderCheckbox($(this).parentsUntil('table').last().parent());
            });
        },
        _page: function(btn, isup){
        	var $items = isup?btn.next():btn.prev(),
        	$dl = $items.children("dl"), h=$items.outerHeight()-2,dlH = $dl.outerHeight(),
        	dltop =$dl.offset().top, nextbtn, top = this.element.data("dltop")+20;
        	if(isup){
        		$dl.offset({top: dltop+h});
        		nextbtn = $items.next();
        		if((dltop =$dl.offset().top) >0||($dl.outerHeight()- dltop-top) >h){
        			nextbtn.removeAttr("disabled").removeClass("om-itemselector-down-disabled");
        		}
        		if(dltop > 0 && dltop < h){
        			btn.attr("disabled","disabled").addClass("om-itemselector-up-disabled");
        		}
        	}else{
        		$dl.offset({top: dltop-h});
        		nextbtn = $items.prev();
            	nextbtn.removeAttr("disabled").removeClass("om-itemselector-up-disabled");
            	if((dltop =$dl.offset().top) <0 && (dlH + dltop - top)<=h){
            		btn.attr("disabled","disabled").addClass("om-itemselector-down-disabled");
            	}
        	}
        },
        _refreshHeaderCheckbox: function(panel){
        	var $dt = $('.om-itemselector-items>dl>dt', panel);
        	$dt = $(this._getPageItems(panel, $dt));
        	var selects = $dt.filter('.om-state-highlight').length;
        	$('.header span.checkbox', panel).toggleClass("selected", selects>0 && $dt.length===selects);
        },
        _refreshPageButton: function(panel){
        	var $items=$('.om-itemselector-items',panel), $dl=$('.om-itemselector-items >dl', panel),
            $up = $('.om-itemselector-up', panel), $down = $('.om-itemselector-down', panel),
            itemsH =$items.outerHeight(),dlH = $dl.outerHeight(),
            dltop = $dl.offset().top, top = this.element.data("dltop")+20;
        	if(dlH > 20 &&(top - dltop) >=dlH){
        		$dl.offset({top: dltop+itemsH});
        		dltop = $dl.offset().top;
    		}
        	if(dlH > itemsH){
        		if($up.is(":hidden")){
            		$items.outerHeight(itemsH - $up.outerHeight()*2);
            		$up.show();
            		$down.show();
        		}
        		if(dltop>0 && dltop < itemsH){
            		$up.attr("disabled","disabled").addClass("om-itemselector-up-disabled");
            	}else{
            		$up.removeAttr("disabled").removeClass("om-itemselector-up-disabled");
            	}
        		if(dltop >0 ||(dlH + dltop- top) >(itemsH)){
        			$down.removeAttr("disabled").removeClass("om-itemselector-down-disabled");
        		}else{
        			$down.attr("disabled","disabled").addClass("om-itemselector-down-disabled");
        		}
        	}else{
        		if($up.is(":visible")){
        			$items.outerHeight(itemsH + $up.outerHeight()*2);
        			$up.hide();
        			$down.hide();
        		}
        	}
        	
        },
        _getPageItems:function(panel, $dt){
        	var items = $(".om-itemselector-items", panel), itemsH = items.outerHeight(),
        	$dl = $(">dl", items), pageItems =[], hasPageButton = items.next(":visible").length>0,
        	dtH = $dt.outerHeight(), num = itemsH/dtH, dltop = $dl.offset().top,
        	top = this.element.data("dltop");
            dltop = hasPageButton ? top - dltop+20 : top-dltop;
        		pageItems = $.grep($dt, function(n, i){
        			return i < num*(dltop/itemsH + 1)-1 && i >= num*(dltop/itemsH);
        		});
        	return pageItems;
        },
        select:function(indexs){
        	if(!$.isArray(indexes)){
                indexes=[indexes];
            }
            for(var i=0, len = indexs.length; i<len ; i++){
            	$('.om-itemselector-items>dl>dt[_index="'+indexs[i]+'"]').addClass("om-state-highlight");
            }
        	
        },
        _moveItemsToTarget:function(selector,isLeftToRight){
            var self = this, fromPanel=isLeftToRight?this.leftPanel:this.rightPanel,
                selectedItems=$('.om-itemselector-items>dl>dt'+selector,fromPanel);
            if(selectedItems.length==0)
                return;
            var toPanel=isLeftToRight?this.rightPanel:this.leftPanel,
                op=this.options,
                itemData=[];
            selectedItems.each(function(){
                itemData.push(op.dataSource[$(this).attr('_index')]);
            });
            //先触发onBeforeItemSelect或onBeforeItemDeselect事件，然后移动并触发onItemSelect或onItemDeselect事件
            if(isLeftToRight){
                if(self._trigger("onBeforeItemSelect",null,itemData)===false){
                    return;
                }
                selectedItems.appendTo($('.om-itemselector-items>dl',toPanel)).removeClass("om-state-highlight");
                
                self._trigger("onItemSelect",null,itemData);
            }else{
                if(self._trigger("onBeforeItemDeselect",null,itemData)===false){
                    return;
                }
                selectedItems.appendTo($('.om-itemselector-items>dl',toPanel)).removeClass("om-state-highlight");
                self._trigger("onItemDeselect",null,itemData);
            }
            self._refreshHeaderCheckbox(fromPanel);
            self._refreshPageButton(fromPanel);
            self._refreshPageButton(toPanel);
        },
        
        /**
         * 得到或设置组件的value值。
         * @function
         * @name omItemSelector#value
         * @param v 设置的值，不设置表示获取值
         * @returns 如果没有参数时表示getValue()返回combo的value值，比如dataSource:[{text:'abc',value:true},{text:'def',value:2},{text:'xyz',value:'x'}]选择了第2条和第三条，则getValue返回[2,'x']。如果有参数时表示setValue(newValue)返回jQuery对象。
         * 
         */
        value:function(newValue){
            if(arguments.length==0){ //getValue
                var op=this.options,
                    selectedItems=$('.om-itemselector-items>dl>dt',this.rightPanel),
                    returnValue=[];
                selectedItems.each(function(){
                    returnValue.push(op.dataSource[$(this).attr('_index')].value);
                });
                return returnValue;
            }else{ //setValue
                if($.isArray(newValue)){
                    this.options.value=newValue;
                    this._buildList();
                }
            }
        }
    });
    
    $.om.lang.omItemSelector = {
        availableTitle:'可选项',
        selectedTitle:'已选项',
        addIconTip:'右移',
        removeIconTip:'左移'       
    };
})(jQuery);