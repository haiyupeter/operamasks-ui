/*
 * $Id: om-tooltip.js,v 1.14 2012/06/26 07:07:03 luoyegang Exp $
 * operamasks-ui omTooltip @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-core.js
 */
;(function($) {
    /**
     * @name omTooltip
     * @class 提示组件，当某个链接、表单、输入框等需要做功能向导提示的时候可以使用本组件。
     * <b>特点：</b><br/>
     * <ol>
     *      <li>提示内容多样化，可以是文字，html，页面dom节点还可以是异步加载的内容</li>
     *      <li>异步加载内容的时候支持懒加载</li>
     *      <li>最大限度节约资源，只有需要使用的时候才在页面加入dom元素</li>
     *      <li>支持所有标准html元素</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#tip').omTooltip({
     *         trackMouse : true,
     *         html : '&lt;div style="color:red;"&gt;欢迎使用omTooltip组件&lt;/div&gt;'
     *     });
     * });
     * &lt;/script&gt;
     * 
     * &lt;input id="tip" type="submit" /&gt;
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.omWidget('om.omTooltip', {
        options: /**@lends omTooltip# */{
            /**
             * 提示框的宽度。
             * @type Number 
             * @default 'auto' 
             * @example
             * $("#tip").omTooltip({width: 100}); 
             */
            width : 'auto',
            /**
             * 最小宽度，当提示内容很少的时候为了样式美观显示指定的宽度。
             * @type Number 
             * @default null 
             * @example
             * $("#tip").omTooltip({minWidth: 100}); 
             */
            minWidth : null,
            /**
             * 最大宽度，当需要根据内容自动适应宽度而又不想因为内容太多而导致太宽的情况，可以使用maxWidht设置一个最大宽度。
             * @type Number 
             * @default null 
             * @example
             * $("#tip").omTooltip({maxWidth: 200}); 
             */
            maxWidth : null,
            /**
             * 提示框的高度。
             * @type Number 
             * @default 'auto' 
             * @example
             * $("#tip").omTooltip({height: 100}); 
             */
            height : 'auto',
            /**
             * 最大高度，高度默认自适应，当达到最大高度之后会隐藏内容 。
             * @type Number 
             * @default null 
             * @example
             * $("#tip").omTooltip({maxHeight: 100}); 
             */
            maxHeight : null,
            /**
             * 最小高度。
             * @type Number 
             * @default null 
             * @example
             * $("#tip").omTooltip({minHeight: 100}); 
             */
            minHeight : null,
            /**
             * 鼠标移入目标区域之后弹出提示框的延迟时间(ms) ，同时也是隐藏延迟的事件。
             * @type Number 
             * @default 300 
             * @example
             * $("#tip").omTooltip({delay: 300}); 
             */
            delay : 300,
            /**
             * 是否显示anchor，默认不显示，如果trackMouse为true，则显示在左上角，如果不跟随，
             * 则根据region属性确定，箭头的方向永远指向被提示的目标。
             * @type Boolean 
             * @default false 
             * @example
             * $("#tip").omTooltip({anchor: false}); 
             */
            anchor : false,
            /**
             * 提示框是否跟随鼠标移动,默认不跟随鼠标移动，设置为true则跟随鼠标移动，
             * 比region优先级低。
             * @type Boolean 
             * @default false 
             * @example
             * $("#tip").omTooltip({trackMouse: false}); 
             */
            trackMouse : false,
            /**
             * 显示提示框的触发方式,可选值有mouseover、click 
             * @type String 
             * @default 'mouseover' 
             * @example
             * $("#tip").omTooltip({showOn: click}); 
             */
            showOn : "mouseover",
            /**
             * ajax方式显示内容的时候是否延迟加载页面，必须配置了url才有效 
             * @type Boolean 
             * @default false 
             * @example
             * $("#tip").omTooltip({url:'a.html',lazyLoad: true}); 
             */
            lazyLoad : false,
            /**
             * ajax加载内容的url地址,返回的内容格式dataType为html
             * @type String 
             * @default null 
             * @example
             * $("#tip").omTooltip({url:'a.html'}); 
             */
            url : null,
            /**
             * 提示框显示在指定位置的偏离度,提示框有两种基准位置，一是鼠标，二是目标区域,
             *  第一个参数为top偏差值，第二个为left偏差值。
             * @type Object 
             * @default [5,5] 
             * @example
             * $("#tip").omTooltip({offset:[10,15]}); 
             */
            offset : [5,5],
            /**
             * anchor偏移度(px),
             * 当设置anchor为top、button的时候，偏移度指相对于最左边的距离；
             * 为left、right的时候偏移度指相对于最上的距离
             * @type Number
             * @default 0
             * @example
             * $("#tip").omTooltip({anchorOffset:10}); 
             */
            anchorOffset : 0,
            /**
             * 提示框显示的区域,设置提示框显示的区域，如果不设置，
             * 则以鼠标的当前位置为基准点显示并跟随鼠标移动，
             * 如果设置了则以目标为基准点显示,可选值有left、right、top、bottom，
             * 比如选择了left，则提示框永远出现在目标的左边，不会进入目标。
             * @type String
             * @default null
             * @example
             * $("#tip").omTooltip({region:'bottom'}); 
             */
            region : null,
            /**
             * 提示组件显示的内容，可以是html和普通字符,优先级比contentEL属性高。
             * @type String
             * @default null
             * @example
             * $("#tip").omTooltip({html:'&lt;span style="color:red;"&gt;我是omTooltip&lt;/span&gt;'}); 
             */
            html : null,
            /**
             * jquery选择器，可以获取页面的dom元素作为提示内容，格式为#ID、.className、tagName等，优先级比html属性低。
             * @type selector
             * @default null
             * @example
             * $("#tip").omTooltip({contentEL:'#aa'}); 
             */
            contentEL : null
            
        },
        _create:function(){
            this.tipContent = $('<div class="tip-body"></div>');
            this.tipAnchor = $('<div class="tip-anchor"></div>');
            this.regionMap = {'right':'left','top':'bottom','left':'right','bottom':'top'};
            this.tip = $('<div class="tip"></div>').append(this.tipContent);
        },
        /**
         * 初始化方法，主要设置高宽，加载内容
         */
        _init:function(){
            var self = this , options = self.options;
            
            this.tipContent.empty();
            this.tip.find('div.tip-anchor').remove();
            
            if(options.anchor){
                self.tip.append(self.tipAnchor);
            }
            self.adjustWidth = 6 ; //内外边框
            self.adjustHeight =  6 ;
            if(options.width != 'auto'){
                this.tip.css('width',options.width-self.adjustWidth);
            }else{
                this.tip.css('width','auto');
            }
            if(options.height != 'auto'){
                this.tip.css('height',options.height - self.adjustHeight);
            }else{
                this.tip.css('height','auto');
            }
            if(options.minWidth) {
                this.tip.css('minWidth',options.minWidth - self.adjustWidth);
            }
            if(options.maxWidth){
                this.tip.css('maxWidth',options.maxWidth - self.adjustWidth);
            }
            if(options.maxHeight){
                this.tip.css('maxHeight',options.maxHeight - self.adjustHeight);
            }
            if(options.minHeight){
                this.tip.css('minHeight',options.minHeight - self.adjustHeight);
            }
            /**
             * 内容加载的优先级为url、html、contentEl，前者会覆盖后者
             */
            if(options.url && !options.lazyLoad){ //如果是ajax方式并且不是懒加载模式下面，初始化组件的时候就请求数据
                self._ajaxLoad(options.url);
            }else if(options.html){
                this.tip.find('.tip-body').append(options.html);
            }else{
            	var contentElClone = $(options.contentEL).clone();
            	$(options.contentEL).remove();
                this.tip.find('.tip-body').append(contentElClone.show());
            }
            this._bindEvent();
        },
        /**
         * ajax方法异步加载数据，返回的数据格式为html。
         * @param url
         */
        _ajaxLoad:function(url){
            var self = this;
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'html',
                success: function(data, textStatus){
                    self.tip.find('.tip-body').append(data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    self.tip.find('.tip-body').append($.om.lang.omTooltip.FailedToLoad);
                }
            });
        },
        /**
         * 给提示框绑定事件，同时根据配置的delay参数做延迟显示，延迟隐藏处理
         * 而且鼠标离开了目标区域，但是还停留在提示框内的时候不能隐藏
         */
        _bindEvent : function(){
            var self = this , options = self.options , element = self.element;
            if(options.showOn == 'mouseover'){ //mouseover的时候显示
                element.bind('mouseover.tooltip',function(e){
                    if(self.showTime)clearTimeout(self.showTime); 
                    self.showTime = setTimeout(function(){
                        self.show(e);
                    },options.delay);
                });
            }else if(options.showOn == 'click'){ //click的时候显示
                self.showTime = element.bind('click.tooltip',function(e){
                    setTimeout(function(){
                        self.show(e);
                    },options.delay);
                });
            }
            if(options.trackMouse){
                element.bind('mousemove.tooltip',function(e){
                    self._adjustPosition(e);
                });
            }
            element.bind('mouseleave.tooltip',function(){
                if(self.showTime)clearTimeout(self.showTime); 
                self.hideTime = setTimeout(function(){ self.hide(); }, options.delay);
            });
            self.tip.bind('mouseover.tooltip',function(){
                if(self.hideTime){clearTimeout(self.hideTime);}
            }).bind('mouseleave.tooltip',function(){
                setTimeout(function(){ self.hide(); }, options.delay);
            });
        },
        /**
         * 显示组件，组件只有在显示的时候才添加到dom树，
         * 第二次显示已经存在dom树，只需要改变显示状态。
         * @name omTooltip#show
         * @function
         * @example
         * $('#mytip').omTooltip('show');
         */
        show : function(e){
            var self = this ,options = self.options;
            if($(document.body).find(self.tip).length <= 0){ //组件没有写入dom树的情况下
                if(options.url && options.lazyLoad){
                    self._ajaxLoad(options.url);
                }
                self.tip.appendTo(document.body).fadeIn();
                self._adjustPosition(e);
            }else{
                self._adjustPosition(e);
                self.tip.fadeIn();
            }
        },
        /**
         * 调整提示框的位置，如果传入了event且trackMouse为true，则会根据event计算出鼠标的位置
         * 作为提示框的基础位置，再根据设置的offset等计算最终的提示框位置
         * 如果没有传入event或者trackMouse为false，则提示框将以目标位置为基础位置，再根据offset
         * region等参数配置情况计算最终位置。
         * 这里会根据浏览器的宽度对显示做调整，如果region配置了right，二浏览器右边已经没有足够的空间
         * 容纳提示框，则会将提示框显示到左边，region配置了bottom的时候同理。
         * @param event
         */
        _adjustPosition : function(event){
            var self = this , options = self.options , 
            element = self.element , top ,left,
            offSet = $(element).offset();
           if(event && !options.region){
                top = event.pageY + options.offset[0]; 
                left = event.pageX + options.offset[1]; 
                //anchor距离最顶部的距离，使用用户设置的偏移减去tip的高度和调节高度
                self.tip.find('.tip-anchor').css({'top':options.anchorOffset+3,'left':'-9px'}).addClass('tip-anchor-left');
           }else{
               var bottomWidth = parseInt($(element).css('borderBottomWidth').replace('px',''));
               top = offSet.top +  $(element).height() + (isNaN(bottomWidth)?0:bottomWidth) +options.offset[0]; //1px作为调节距离
               left = offSet.left +options.offset[1];
               //-----------根据region配置显示固定位置--------------
               if(options.region == 'right'){ //offset向右下偏 right作为默认配置
                   left = offSet.left + options.offset[1] + $(element).width() + self.adjustWidth; //元素的offset向右移动$(element).widht()的距离
                   top = top - self.element.height() + self.adjustHeight + options.offset[0]; 
                   self.tip.find('.tip-anchor').css({'top':options.anchorOffset+3,'left':'-9px'}); //要减去自身的高度,去掉3px的radius
               }else if(options.region == 'left'){ //offset向左上偏
                   left = offSet.left - self.tip.width() - self.adjustWidth - options.offset[1] - 2; //靠左的话就要减去tip自身的宽度
                   top = top - self.element.height() - self.adjustHeight - options.offset[0];
                   self.tip.find('.tip-anchor').css({'top':options.anchorOffset+3,'left': self.tip.outerWidth()-2}); //将anchor向右移动tip的宽度
               }else if(options.region == 'top'){ //offset向右上偏
                   top = top - (self.element.height() + self.tip.height() + self.adjustHeight + 2) - options.offset[0];
                   left = left + options.offset[1];
                   self.tip.find('.tip-anchor').css({'top':self.tip.outerHeight()-3, 'left':options.anchorOffset+3}); //25+4
               }else if(options.region == 'bottom'){ //offset向右下偏
                   top = top + options.offset[0];
                   left = left + options.offset[1];
                   self.tip.find('.tip-anchor').css({'top': -9, 'left':options.anchorOffset + 3});
               }
               self.tip.find('.tip-anchor').addClass('tip-anchor-'+self.regionMap[options.region]);
           }
           if((left + self.tip.width()) > document.documentElement.clientWidth){ //当右边距离过短的时候会将提示框调整到左边
               left = left - self.tip.width() - 20;
           }
           if((top + self.tip.height()) > document.documentElement.clientHeight){ //当下边距离过短的时候会将提示框调整到上边
               top = top - (self.element.height() + self.tip.height()) - 20;
           }
           self.tip.css({'top':top - $(document).scrollTop(),'left':left - $(document).scrollLeft()});
        },
        /**
         * 隐藏组件。
         * @name omTooltip#hide
         * @function
         * @example
         * $('#mytip').omTooltip('hide');
         */
        hide : function(){
            this.tip.hide();
        },
        destroy : function(){
        	clearTimeout(this.showTime);
        	clearTimeout(this.hideTime);
        	this.element.unbind('.tooltip');
        	this.tip.remove();
        }
    });
    $.om.lang.omTooltip = {
            FailedToLoad : '加载提示信息出错！'
    };
})(jQuery);