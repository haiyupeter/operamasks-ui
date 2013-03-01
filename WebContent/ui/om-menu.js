/*
 * $Id: om-menu.js,v 1.41 2012/06/27 03:10:09 luoyegang Exp $
 * operamasks-ui om-menu.js @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *	om-core.js
 */
;(function($){
    /**
     * @name omMenu
     * @class menu组件。menu组件支持三种数据组织方式，分别为页面dom元素、json数据、url取值。<br/>
     *        基本的json格式为{id:"",label:"",icon:"img/abc.png",seperator:true,disabled:true,children:[{},{}]},其中的id和label必须设置，<br/>
     *        seperator为分割线，如果设置为true，则会在当前menuItem下面增加一条分割线。<br/><br/>
     *        组件默认会处理的属性为上面列举的6个，即id、label、icon、seperator、disabled、children。<br/>
     *        如果你自定义了某个属性，比如url，系统不会处理，它是在点击的时候交给onSelect方法处理，通过item.url获取url参数。
     * <b>特点：</b><br/>
     * <ol>
     *      <li>支持icon自定制</li>
     *      <li>灵活的事件处理机制，自由增加json属性，事件执行时获取数据进行处理</li>
     *      <li>支持动态改变menuItem的disabled属性</li>
     *      <li>支持右键菜单，无需指定位置，自动定位</li>
     *      <li>支持菜单分组，使用showSeparator属性配置</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *      //menu定义
     *      $('#contextMenu').omMenu({
     *          contextMenu : true,
     *          dataSource : '../../omMenu.json'
     *      });
     *      //显示menu菜单
     *      $('#contextMenu_test').bind('contextmenu',function(e){
     *           $('#contextMenu').omMenu('show',e);
     *      });
     * });
     * &lt;/script&gt;
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.omWidget('om.omMenu', {
        options: /**@lends omMenu# */{
            /**
             * 是否为右键菜单
             * @type Boolean 
             * @default false
             * @example
             * $("#menu_1").omMenu({contextMenu:true});
             */
            contextMenu : false,
            
            /**
             * 最大宽度，如果menuItem文字长度超出了最大宽度，将会隐藏，鼠标移动到上面会有全文提示
             * @type Number 
             * @default 200
             * @example
             * $("#menu_1").omMenu({maxWidth:150});
             */
            maxWidth : 200,
            
            /**
             * 最小宽度，如果menuItem文字长度少于minWidth，则将使用空白填充。
             * @type Number 
             * @default 100
             * @example
             * $("#menu_1").omMenu({minWidth:50});
             */
            minWidth : 100,
            
            /**
             * 数据源，可以设置为json数据，也可以是url，如果不设置则为local，默认使用页面的dom元素生成Menu
             * @type String 
             * @default local
             * @example
             * $("#menu_1").omMenu({dataSource:'menuData.json'});
             */
            dataSource : 'local'
            
            /**
             * 当点击选择menu的时候触发的事件，item包含当前menuItem的所有数据。
             * @name omMenu#onSelect
             * @event
             * @param item 当前menuItem的所有数据
             * @param event jQuery.Event对象
             * @type Function
             * @default 无
             * @example
             * $("#menu_1").omMenu({
             *         onSelect:function(item,event){
             *            location.href = item.url;
             *         }
             * });
             */
        },
        
        /**
         * 显示menu，menu不会自己显示，必须调用show方法才能显示
         * @name omMenu#show
         * @function
         * @param triggerEle 触发显示事件的对象，如点击的button触发的就是button对象
         * @example
         * //通过点击button显示menu
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('show',this);
         *});
         */
        show : function(triggerEle){
            var self = this, options = self.options , top , left, element = self.element;
            var offSet = $(triggerEle).offset();
            if( options.contextMenu ){
                top = triggerEle.pageY;
                left = triggerEle.pageX;
                triggerEle.preventDefault();
                triggerEle.stopPropagation();
                triggerEle.cancelBubble=true; //IE
            }else{
                var buttomWidth = parseInt($(triggerEle).css('borderBottomWidth').replace('px',''));
                top = offSet.top +  $(triggerEle).height() + (isNaN(buttomWidth)?0:buttomWidth) + 1; //1px作为调节距离
                left = offSet.left +  1;
            }
            var parent = element.parent();
            while(parent.css('position') == 'static' && parent[0].nodeName != 'BODY'){
                parent = parent.parent();
            }
            top -= parent.offset().top;
            left -=parent.offset().left;
            
            if((left + element.outerWidth()) > document.documentElement.clientWidth){ //当右边距离过短的时候会将提示框调整到左边
                left = left - element.outerWidth() - 20;
            }
            $(element).css({"top":top,'left':left}).show();
            $(element).children("ul.om-menu").show();
            var width = $(element).width()*0.7;
            $(element).children("ul.om-menu").children().each(function(index,li){
                if($(li).find("span:first").hasClass('om-menu-item-sep')){   //TODO hasClass直接导致IE9使用MaxWidth
                    $(li).find("span:first").width('98%'); //分隔条宽度
                }else{
                    if($(li).find("span:first").width() > width){
                        $(li).find("span:first").width($(li).attr('aria-haspopup')?width-15:width); //去掉icon的padding
                    }
                }
            });
        },
        
        /**
         * 隐藏menu，隐藏之后会清空menu当前的状态。
         * @name omMenu#hide
         * @function
         * @example
         * //调用hide方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('hide');
         *});
         */
        hide : function(){
            this._hide();
        },
        
        /**
         * 将某个menuitem设置为disabled，设置之后menuitem将不会触发事件，如果有子菜单将不能打开子菜单，必须有menuItem。
         * @name omMenu#disableItem
         * @function
         * @param itemId menuItem的ID
         * @example
         * //调用disableItem方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('disableItem','001');
         *});
         */
        disableItem : function(itemId){
            this.element.find("#"+itemId)
                        .addClass("om-state-disabled")
                        .unbind(".menuItem");
        },
        /**
         * 将某个menuitem设置为enable。
         * @name omMenu#enableItem
         * @function
         * @param itemId menuItem的ID
         * @example
         * //调用enableItem方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('enableItem','001');
         *});
         */
        enableItem : function(itemId){
            var self = this , element = self.element;
            var cli = element.find("#"+itemId);
                cli.removeClass("om-state-disabled");
                self._bindLiEvent(cli);
        },
        destroy : function(){
        	var $doc = $(document),
        		handler;
        	while(handler = this.globalEvent.pop()){
        		$doc.unbind(".omMenu" , handler);
        	}
        },
        _create:function(){
            // omMenu 对 options 重设置支持不够全面，实际上也无多大必要
            var self = this , options = self.options , 
                $ele = self.element,
                source = options.dataSource;
            $ele.addClass('om-menu-container om-menu-content om-corner-all');
            $ele.css('position','absolute');
            if(source) {
                if(source != 'local'){
                     if(typeof source == 'string'){
                         self._ajaxLoad($ele,source);
                     }else if(typeof source == 'object'){
                         $ele.append(self._appendNodes.apply(self, [source]));
                         self._bindEvent();
                     }
                }else{
                    var firstMenu = $ele.children("ul").addClass("om-menu");
                    self._parseDomMenu(firstMenu);
                    self._bindEvent();
                }
             }
        },
        
        _init : function(){
            var opts = this.options, 
                $ele = this.element;
            $ele.css({"minWidth" : opts.minWidth - 10,"maxWidth" : opts.maxWidth - 10});
            if($.browser.msie && $.browser.version == '6.0') {
                $ele.css("width", opts.minWidth + 30);
            }
            if($.browser.msie && $.browser.version == '7.0') {
                $ele.css("width", opts.maxWidth - 10);
            }
        },
        
        _ajaxLoad : function(target,source){
             var self = this ;
             $.ajax({
                 url : source,
                 method: 'POST',
                 dataType: 'json',
                 success: function(data){
                     target.append(self._appendNodes.apply(self, [data]));
                     self._bindEvent();
                 }
             });
        },
        _appendNodes : function(source,index){
            var self = this , menuHtml = [];
            var ulClass = (index == undefined)?"om-menu":"om-menu-content";
            var display = (index == undefined)?"block":"none";
            var imgClass = (index == undefined)?"om-menu-icon" : "om-menu-icon om-menu-icon-child";
            menuHtml.push("<ul class=\""+ulClass+" om-corner-all\" style=\"display:"+display+";\">");
            var childrenHtml = [];
            $(source).each(function(index , item){
                    if(item.children != null){
                        if(item.disabled === true || item.disabled == "true"){
                            childrenHtml.push("<li id=\""+item.id+"\" aria-haspopup=\"true\"  class=\"om-state-disabled\">");
                        }else{
                            childrenHtml.push("<li id=\""+item.id+"\"  aria-haspopup=\"true\">");
                        }
                        childrenHtml.push("<a href=\"javascript:void(0)\" class=\"om-corner-all om-menu-indicator\">");
                        item.icon?childrenHtml.push("<img class=\""+imgClass+"\" src=\""+item.icon+"\">"):null;
                        item.icon?childrenHtml.push("<span>"+item.label+"</span>"):childrenHtml.push("<span style=\"margin-left:2em;\">"+item.label+"</span>");
                        childrenHtml.push("<span class=\"ui-icon-span\" role=\"popup\"></span>");
                        childrenHtml.push("</a>");
                        childrenHtml.push(self._appendNodes(item.children,index++));
                        childrenHtml.push("</li>");
                    }else{
                        if(item.disabled === true || item.disabled == "true"){
                            childrenHtml.push("<li id=\""+item.id+"\"  class=\"om-state-disabled\">");
                        }else{
                            childrenHtml.push("<li id=\""+item.id+"\" >");
                        }
                        childrenHtml.push("<a href=\"javascript:void(0)\" class=\"om-corner-all om-menu-indicator\">");
                        item.icon?childrenHtml.push("<img class=\""+imgClass+"\" src=\""+item.icon+"\">"):null;
                        item.icon?childrenHtml.push("<span>"+item.label+"</span>"):childrenHtml.push("<span style=\"margin-left:2em;\">"+item.label+"</span>");
                        childrenHtml.push("</a>");
                        childrenHtml.push("</li>");
                    }
                    if(item.seperator == "true" || item.seperator == true){
                        childrenHtml.push("<li class=\"om-menu-sep-li\"  ><span class=\"om-menu-item-sep\">&nbsp;</span></li>");
                    }
                    var li = $(self.element).attr('id') + "_"+item.id;
                    $(self.element).data(li , item);
            });
            menuHtml.push(childrenHtml.join(""));
            menuHtml.push("</ul>");
            return menuHtml.join("");
        },
        
        //处理页面编写dom节点的情况
        _parseDomMenu : function(element){
            if(element.parent().attr("aria-haspopup") == "true"){ //判断是否为第一帧
                element.addClass("om-menu-content om-corner-all");
            }
            element.css('display','none');
            var lis = element.children();
            for(var i=0;i<lis.length;i++){
                var li = $(lis[i]) , liCul = li.children("ul");
                if(liCul.length > 0){
                    li.attr("aria-haspopup","true");
                    li.find("span[role='popup']").addClass("ui-icon-span");
                    this._parseDomMenu(liCul);
                }
                li.find("a").addClass("om-corner-all om-menu-indicator");
                li.find("img").addClass("om-menu-icon");
            }
        },
        _showChildren : function(li){
            var self = this;
            if(li && li.length > 0){
                var li_child_ul = li.children("ul").eq(0);
                li_child_ul.css({"minWidth":this.options.minWidth, "top":li.position().top });
                var left = li.width();
                if((2*left + li.offset().left) > document.documentElement.clientWidth){ //当右边距离过短的时候会将提示框调整到左边
                    left = - left;
                }
                
                li_child_ul.css("left",left);
                li_child_ul.show();
                
                li_child_ul.children().each(function(index,li){
                    if($(li).find("span:first").hasClass('om-menu-item-sep')){
                        $(li).find("span:first").width('98%'); //分隔条宽度
                    }else{
                        if(li_child_ul.width() > self.options.maxWidth){
                            li_child_ul.width(self.options.maxWidth);
                            width = self.options.maxWidth * 0.6;
                        }else{
                        	if(li_child_ul.attr('hasShow') == undefined){
                        		li_child_ul.width(li_child_ul.find('li:eq(0)>a:eq(0)').width()+15);
                        		li_child_ul.attr('hasShow',true);
                        	}
                            width = li_child_ul.width() * 0.6;
                        }
                        $(li).find("span:first").width(width);
                    }
                });
            }
        },
        _hideChildren : function(li){
            li.children("ul").eq(0).hide();
        },
        
        _bindLiEvent : function(li){
            var self = this, element = self.element, options = self.options;
            $(li).bind("mouseenter.menuItem",function(){
                var self_li = $(this);
                var width = self_li.parent().width();
                self_li.addClass("om-menu-item-hover");
                if($.browser.msie && $.browser.version == '9.0') { //解决bug AOM-576
                	self_li.parent().width(width);
                }
                if(self_li.attr("aria-haspopup")){
                    setTimeout(function(){
                        self._showChildren(self_li);
                    },200);
                }
            }).bind("mouseleave.menuItem",function(){
                var self_li = $(this);
                self_li.removeClass("om-menu-item-hover");
                setTimeout(function(){
                    self_li.children("ul").hide();
                },200);
            }).bind("mousedown.menuItem",function(event){
                var item = $(element).data($(element).attr("id")+"_"+this.id);
                if(options.onSelect){
                	self._trigger("onSelect",event,item);
                }
            });
        },
        
        _bindEvent : function(){
            var self = this , element = self.element,
            	uls = element.find("ul"),
            	lis = element.find("li"),
            	$doc = $(document),
            	tempEvent;
            for(var i=0 ; i<lis.length ; i++){
                if(!$(lis[i]).hasClass("om-state-disabled")){
                   self._bindLiEvent(lis[i]);
                }
            };
            for(var j=0 ; j<uls.length ; j++){
                $(uls[j]).bind("mouseleave.menuContainer",function(){
                    var ul = $(this);
                    if(ul.parent().attr("aria-haspopup") == "true"){
                        ul.hide();
                    }
                });
            };
            this.globalEvent = [];
            $doc.bind('mousedown.omMenu',tempEvent=function(){
                self._hide();
            });
            this.globalEvent.push(tempEvent);
            $doc.bind('keyup.omMenu' , tempEvent=function(e){
                var key = e.keyCode,
                    keyEnum = $.om.keyCode;
                switch (key) {
                case keyEnum.DOWN: //down
                    self._selectNext();
                    break;
                case keyEnum.UP: //up
                    self._selectPrev();
                    break;
                case keyEnum.LEFT: //left
                    self._hideRight();
                    break;
                case keyEnum.RIGHT: //right
                    self._showRight();
                    break;
                case keyEnum.ENTER: //enter 建立在当前menu就是打开的menu前提下
                    if(element.css("display") == "block")
                        self._backfill(element);
                    	self._hide();
                    break;
                case keyEnum.ESCAPE: //esc
                    self._hide();
                    break;
                default:
                   null;
                }
            });
            this.globalEvent.push(tempEvent);
            $doc.bind('keydown.omMenu' , tempEvent=function(e){//fixed AOM-430
            	if(e.keyCode >= 37 && e.keyCode <= 40){
            		e.preventDefault();
            	}
            });
            this.globalEvent.push(tempEvent);
        },
        
        _hide : function(){
            var self = this , element = self.element;
            element.find("ul").css("display","none");
            element.find("li.om-menu-item-hover").each(function(index,item){
                $(item).removeClass("om-menu-item-hover");
            });
            element.hide();
        },
        /**
         * 排除掉分隔条的干扰，找到下一个menuItem
         * 返回li
         * @param liMenuItem
         */
        _findNext : function(liMenuItem){
            var next,
                oldItem = liMenuItem;
            while( (next=liMenuItem.next("li")).length !== 0 ){
            	if(!next.hasClass("om-menu-sep-li") && !next.hasClass("om-state-disabled")){
            		return next;
            	}
            	liMenuItem = next;
            }
            //如果没有，则从上到下再找一遍
            var item = oldItem.parent().find("li:first");
            while(item.length !== 0 && item != oldItem){
            	if(!item.hasClass("om-menu-sep-li") && !item.hasClass("om-state-disabled")){
            		return item;
            	}
            	item = item.next("li");
            }
        },
        /**
         * 排除掉分隔条的干扰，找到前一个menuItem
         * 返回li
         * @param liMenuItem
         */
        _findPrev : function(liMenuItem){
            var prev,
            	oldItem = liMenuItem;
            while( (prev=liMenuItem.prev("li")).length !== 0 ){
            	if(!prev.hasClass("om-menu-sep-li") && !prev.hasClass("om-state-disabled")){
            		return prev;
            	}
            	liMenuItem = prev;
            }
            //如果没有，则从下往上再找一遍
            var ulChildren = oldItem.parent().children();
            var item =ulChildren.eq(ulChildren.length - 1);
            while(item.length !== 0 && item != oldItem){
            	if(!item.hasClass("om-menu-sep-li") && !item.hasClass("om-state-disabled")){
            		return item;
            	}
            	item = item.prev("li");
            }
        },
        _selectNext : function(){
            var self = this , element = self.element ,curLi;
            var menuItemHover = element.find("li.om-menu-item-hover");
            var hoverLast = menuItemHover.eq(menuItemHover.length-1);
            if(menuItemHover.length == 0){ //如果没有被选中的就选中第一个
                curLi = element.find("li").eq(0);
                while(curLi.hasClass('om-state-disabled')){
                    curLi = curLi.next('li');
                }
                curLi.addClass("om-menu-item-hover");
            }else{
                curLi = self._findNext(hoverLast);
                if(curLi.length <= 0) return;
                curLi.addClass("om-menu-item-hover");
                hoverLast.removeClass("om-menu-item-hover");
            }
            this._hideChildren(hoverLast);
            this._showChildren(curLi);
        },
        _selectPrev : function(){
            var self = this , element = self.element,curLi;
            var menuItemHover = element.find("li.om-menu-item-hover");
            var hoverLast = menuItemHover.eq(menuItemHover.length-1);
                curLi = element.find("ul.om-menu > li");
            if(menuItemHover.length == 0){ //如果没有被选中的就选中最后一个
                var lastLi = curLi.eq(curLi.length-1) , i=1;
                while(lastLi.hasClass('om-state-disabled')){
                    lastLi = curLi.eq(curLi.length-(i++));
                }
                (curLi = lastLi).addClass("om-menu-item-hover");
            }else{
                curLi = self._findPrev(hoverLast);
                if(curLi.length <= 0) return;
                curLi.addClass("om-menu-item-hover");
                hoverLast.removeClass("om-menu-item-hover");
            }
            this._hideChildren(hoverLast);
            this._showChildren(curLi);
        },
        _hideRight : function(){
            var self = this , element = self.element;
            var currentA = element.find("li.om-menu-item-hover") , 
                hoverLast = currentA.eq(currentA.length - 1);
            hoverLast.removeClass("om-menu-item-hover");
            self._hideChildren(hoverLast);
        },
        _showRight : function(){
            var self = this , element = self.element,curLi = null;
            var parentA = element.find("li.om-menu-item-hover") , 
                parentLi = parentA.eq(parentA.length - 1);
            if(parentLi.attr("aria-haspopup") == "true"){
                curLi = parentLi.children("ul").find("li").eq(0);
                curLi.addClass("om-menu-item-hover");
            }
            self._showChildren(curLi);
        },
        _backfill : function(element){
            var curas = element.find("li.om-menu-item-hover");
            curas.eq(curas.length - 1).mousedown();
        }
    });
})(jQuery);