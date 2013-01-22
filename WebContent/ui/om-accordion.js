/*
 * $Id: om-accordion.js,v 1.69 2012/06/20 08:30:31 chentianzhen Exp $
 * operamasks-ui omAccordion @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-core.js
 *  om-panel.js
 */
(function( $, undefined ) {
    var panelIdPrefix = 'om-accordion-panel-' + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '-',
    id = 0;
	/**
     * @name omAccordion
     * @class 抽屉布局组件。以抽屉的形式展现信息，每个抽屉内容可为当前页面内容，也可以使用Ajax装载其他页面的内容，其原理是jQuery的load方法，没用到嵌入的iframe，不支持跨域装载.支持初始化过后再次更新某个抽屉的数据源(调用url方法)，值得注意的是:更新数据源不会触发抽屉的刷新操作，需要显示调用另一个api来完成(调用reload方法)。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>支持Ajax装载</li>
     *      <li>支持自定义每个抽屉图标</li>
     *      <li>支持多种抽屉切换方式</li>
     *      <li>支持动态更换数据源</li>
     *      <li>支持动态更换标题</li>
     *      <li>支持定时自动切换抽屉</li>
     *      <li>支持多种事件捕获</li>
     * </ol>
     * <b>使用方式：</b><br/><br/>
     * 页面上有如下html标记
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#make-accordion').omAccordion();
     * });
     * &lt;/script>
     * 
     * &lt;div id="make-accordion"&gt;
     *    &lt;ul&gt;
     *        &lt;li&gt;
     *            &lt;a href="./remote.html" id="accordion1"&gt;Title1&lt;/a&gt;&lt;!--此抽屉的id为accordion1，如果没有显示指定，会自动生成--&gt;
     *        &lt;/li&gt;
     *        &lt;li&gt;
     *             &lt;a href="#accordion2"&gt;Title2&lt;/a&gt;&lt;!--此抽屉的id为accordion2--&gt;
     *         &lt;/li&gt;
     *         &lt;li&gt;
     *             &lt;a href="#accordion3"&gt;Title3&lt;/a&gt;&lt;!--此抽屉的id为accordion3--&gt;
     *         &lt;/li&gt;
     *    &lt;/ul&gt;
     *    &lt;div id="accordion2"&gt;
     *      this is accordion2 content
     *    &lt;/div&gt;
     *    &lt;div id="accordion3"&gt;
     *      this is accordion3 content
     *    &lt;/div&gt;
     * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{width:500, height:300}
     */
$.omWidget( "om.omAccordion", {
	
    options: /**@lends omAccordion#*/{
        /**
         * 抽屉布局首次展现时，默认展开的抽屉的索引，可以为整数,也可以为抽屉的id,获取当前处于激活状态的抽屉id可用getActivated()方法。<br/>
         * 如果创建组件时想所有抽屉都不展开，可以这样创建<br/>
         * $('#make-accordion').omAccordion({collapsible:true,active:-1});<br/>
         * 组件会优先按id进行处理，如果找不到对应抽屉，则以索引处理，在处理索引时，将会用parseInt及isNaN进行处理。<br/>
         * <ul>
         * <li>如果抽屉个数为0，则active=-1，</li>
         * <li>如果抽屉个数大于0，且active小于0(当为-1时并且collapsible!==false，则可以收起所有抽屉)，则active=0，</li>
         * <li>如果抽屉个数大于0，且active大于抽屉的个数，则active=抽屉的个数-1</li>
         * </ul>
         * @default 0
         * @type Number String
         * @example
         * //激活第一个抽屉
         * $('#make-accordion').omAccordion({active: 1});
         * //激活id为'contentId'的抽屉
         * $('#make-accordion').omAccordion({active: 'contentId'});
         * //收起所有的抽屉(这时必须有collapsible!==false)
         * $('#make-accordion').omAccordion({active:-1});
         */
        active:0,
        /**
         * 是否自动循环切换抽屉。跟interval配合使用，interval用来指定切换的时间间隔。
         * @default false
         * @type Boolean
         * @example
         * //自动循环切换抽屉
         * $('#make-accordion').omAccordion({autoPlay: true});
         */
        autoPlay : false,
        /**
         * 是否允许将所有抽屉收起。当该值为true时，点击已经展开的抽屉时该抽屉被收起，结果所有抽屉都处于收起状态。（默认情况下不可以收起该抽屉，任一时刻总有一个抽屉是处于激活状态的）。
         * @default false
         * @type Boolean
         * @example
         * //设置可以收起所有的抽屉
         * $('#make-accordion').omAccordion({collapsible :true});<br/>
         * //接着再执行下边代码就可以收起所有抽屉了
         * $('#make-accordion').omAccordion({active : -1});<br/>
         */
        collapsible : false,
        /**
         * 是否禁用组件。如果禁用，则不可以对抽屉进行任何操作。
         * @type Boolean
         * @default false
         * @example
         * $('#make-accordion').omAccordion({disabled:true});
         */
        disabled : false,
        /**
         * 抽屉布局的高度，可取值为'auto'（每个抽屉的高度分别由抽屉的内容决定），可以取值为'fit'，表示适应父容器的大小（height:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给height属性。
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-accordion').omAccordion({height: '50%'});
         */
        height:'auto',
        /**
         * 头部元素选择器。用来指明组件创建时如何获取各个抽屉的初始信息。
         * @default '> ul:first li'
         * @type String
         * @example
         * $('#make-accordion').omAccordion({header:'>h3'});
         */
        header:"> ul:first li",
        /**
         * 每个抽屉的header前面可以配置一个小图标，iconCls为该小图标的样式。该图标的配置与其他属性不同，不是配置在config对象中，而是作为DOM结构中 &lt;a&gt; 标签的属性而存在。
         * 在上面的demo"简单抽屉"中可以看到完整的示例。
         * @default 无
         * @type String
         * @example
         * //DOM树结构，注意a标签上的iconCls
         * &lt;div id="make-accordion"&gt;
         *  &lt;ul&gt;
         *      &lt;li&gt;
         *          &lt;a iconCls="file-save" href="#accordion-1"&gt;&lt;/a&gt;
         *      &lt;/li&gt;
         *  &lt;/ul&gt;
         *  &lt;div id="accordion-1"&gt;
         *      This is Accordion-1
         *  &lt;/div&gt;
         * &lt;/div&gt;
         */
        iconCls : null,
        /**
         * 当自动循环切换抽屉（将autoPlay设置true）时，两次切换动作之间的时间间隔，单位为毫秒。
         * @default 1000
         * @type Number
         * @example
         * //每隔2s自动切换抽屉
         * $('#make-accordion').omAccordion({autoPlay: true, interval : 2000});
         */
        interval : 1000,
        /**
         * 抽屉切换时是否需要动画效果，若启用动画效果，则使用jQuery的slideUp和slideDown，动画速度为fast， 动画效果不可定制。
         * @default false
         * @type Boolean
         * @example
         * //收起和展开抽屉时使用动画效果
         * $('#make-accordion').omAccordion({switchEffect: true});
         */
        switchEffect : false,
        /**
         * 抽屉切换的方式。取值为下面的2种之一: "click"、"mouseover"。click表示单击切换，mouseover表示鼠标滑过切换。
         * @default "click"
         * @type String
         * @example
         * //鼠标滑过切换抽屉
         * $('#make-accordion').omAccordion({switchMode: 'mouseover'});
         */
        switchMode:"click",
        /**
         * 抽屉布局的宽度，可取值为'auto'（默认情况,由浏览器决定宽度），可以取值为'fit'，表示适应父容器的大小（width:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给width属性。 
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-accordion').omAccordion({width: 500});
         */
        width:'auto',
        /**
         * 激活一个抽屉时执行的方法
         * @event
         * @param index 被激活的抽屉的索引，从0开始计数。
         * @param event jQuery.Event对象。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onActivate : function(index, event) {
         *          alert('accordion ' + index + ' has been activated!');
         *      }
         *  });
         */
        onActivate: function(index, event){
        },
        /**
         * 激活一个抽屉之前执行的方法。
         * 如果返回布尔值false,那么对应抽屉将不会激活。
         * @event
         * @param index 被选择的抽屉的索引，从0开始计数。
         * @param event jQuery.Event对象。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onBeforeActivate : function(index, event) {
         *          alert('accordion ' + index + ' will be activated!');
         *      }
         *  });
         */
        onBeforeActivate: function(index, event){
        },
        /**
         * 收起一个抽屉前执行的方法。
         * 如果返回布尔值false,那么对应抽屉将不会被收起。
         * @event
         * @param index 被收起的抽屉的索引，从0开始计数。
         * @param event jQuery.Event对象。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onBeforeCollapse : function(index, event) {
         *          alert('accordion ' + index + ' will been collapsed!');
         *      }
         *  });
         */
        onBeforeCollapse: function(index, event){
        },
        /**
         * 收起一个抽屉时执行的方法。
         * @event
         * @param index 被收起的抽屉的索引，从0开始计数。
         * @param event jQuery.Event对象。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onCollapse : function(index, event) {
         *          alert('accordion ' + index + ' has been collapsed!');
         *      }
         *  });
         */
        onCollapse : function(index, event) {
        }
    },
    /**
     * 激活指定的抽屉。index为整数或者抽屉的id。<br/>
     * 任何其它数据将会用parseInt及isNaN进行处理。
     * (注意，如果组件为禁用状态，执行此方法无任何效果)
     * <ul>
     * <li>如果抽屉个数为0，则不激活任何抽屉</li>
     * <li>如果抽屉个数大于0，且index<0，则激活第一个抽屉(索引为0的那个抽屉)</li>
     * <li>如果抽屉个数大于0，且index>=抽屉的个数，则激活最后一个抽屉</li>
     * </ul>
     * @name omAccordion#activate
     * @function
     * @param index 要激活的抽屉的索引(从0开始)或者抽屉的id
     * @example
     * $('#make-accordion').omAccordion('activate', '1');
     */
    activate: function(index){
    	var options = this.options;
    	clearInterval(options.autoInterId);
        this._activate(index);
        this._setAutoInterId(this);
    },
    /**
     * 禁用整个抽屉组件。
     * @name omAccordion#disable
     * @function
     * @example
     * $('#make-accordion').omAccordion('disable');
     */
    disable : function() {
        var $acc = this.element,
        	options = this.options,
        	$disableDiv;
        if (options.autoPlay) {
            clearInterval(options.autoInterId);
        }
        options.disabled = true;
        
        if( ($disableDiv = $acc.find(">.om-accordion-disable")).length === 0 ){
	        $("<div class='om-accordion-disable'></div>").css({position:"absolute",top:0,left:0})
	        	.width($acc.outerWidth()).height($acc.outerHeight()).appendTo($acc);
        }
        $disableDiv.show();
    },
    /**
     * 使整个抽屉处于可用状态(即非禁用状态)
     * @name omAccordion#enable
     * @function
     * @example
     * $('#make-accordion').omAccordion('enable');
     */
    enable : function() {
        this.options.disabled = false;
        this.element.find(">.om-accordion-disable").hide();
    },
    /**获取当前处于激活状态的抽屉的id,如果抽屉总数为0或者当前没有抽屉处于激活状态，那么返回null<br/>
     * 抽屉的id在创建时可以自行指定，如果没有指定，组件内部会动态产生一个。<br/>
     * //DOM树结构，注意，下面代码创建后的抽屉的id为accordion-1.<br/>
     * <pre>
     * &lt;div id="make-accordion"&gt;
     *  &lt;ul&gt;
     *      &lt;li&gt;
     *          &lt;a iconCls="file-save" href="#accordion-1"&gt;&lt;/a&gt;
     *      &lt;/li&gt;
     *  &lt;/ul&gt;
     *  &lt;div id="accordion-1"&gt;
     *      This is Accordion-1
     *  &lt;/div&gt;
     * &lt;/div&gt;
     * </pre>
     * @name omAccordion#getActivated
     * @function
     * @returns 当前处于激活状态的抽屉的id
     * @example
     * $('#make-accordion').omAccordion('getActivated');
     */
    getActivated: function(){
        var panels= $.data(this.element , "panels");
        for(var i=0, len = panels.length; i < len; i++){
        	if(!panels[i].omPanel("option" , "collapsed")){
        		return panels[i].prop("id");
        	}
        }
        return null;
    },
    /**
     * 获取抽屉的总数。
     * @name omAccordion#getLength
     * @function
     * @return len 抽屉的总数
     * @example
     * var len = $('#make-accordion').omAccordion('getLength');
     * alert('total lenght of accordoins is : ' + len);
     */
    getLength: function(){
        return $.data(this.element, "panels").length;
    },
    /**
     * 重新装载指定抽屉的内容.如果该抽屉的数据源是url，则根据该url去取内容，如果该抽屉的数据源是普通文本，则什么都不会做。
     * @name omAccordion#reload
     * @function
     * @param index 要重新装载内容的抽屉的索引（从0开始计数）或者是抽屉的id
     * @example
     * //重新装载索引为1的抽屉
     * $('#make-accordion').omAccordion('reload', 1);
     */
    reload: function(index) {
        var panels= $.data(this.element , "panels");
        if(this.options.disabled !== false || panels.length === 0){
            return this;
        }
        index = this._correctIndex(index);
        panels[index].omPanel('reload');
    },
    /**
     * 重新计算并动态改变整个布局组件的大小,重新设置了组件的宽和高后要调用此方法才可以生效。
     */
    resize: function() {
        var $acc = this.element,
        	options  = this.options,
            panels = $.data(this.element , "panels"),
            headerHeight = 0;
        this._initWidthOrHeight('width');
        this._initWidthOrHeight('height');
    	$.each(panels , function(index , panel){
    		headerHeight += panel.prev().outerHeight();
    	});
    	$.each(panels , function(index , panel){
    		if(options.height === 'auto'){
    			panel.css('height'  , "");
    		}else{
    			panel.outerHeight($acc.height() - headerHeight);
    		}
    	});
    }, 
    /**
     * 设置指定抽屉的标题，标题内容可以为html文本。
     * @name omAccordion#setTitle
     * @function
     * @param index 要改变标题的抽屉的索引（从0开始计数）或者是抽屉的id
     * @param title 新的标题，内容可以为html
     * @example
     * $('#make-accordion').omAccordion('setTitle',0,'apusic').omAccordion('setTitle',1,'AOM');
     */
    setTitle: function(index , title){
        var panels= $.data(this.element , "panels");
        if(this.options.disabled !== false || panels.length === 0){
            return this;
        }
        index = this._correctIndex(index);
        panels[index].omPanel("setTitle" , title);
    },
    
    /**
     * 重新设置指定抽屉的数据源。注意该方法只会重新设置数据源，而不会主动去装载。<br/>
     * 重新装载需要调用另一个api : $('make-accordion').omAccordion('reload',1);<br/>
     * 如果需要更换内容的抽屉并不是用url去装载的，可以用如下方法更换:<br/>
     * $("#accordionId").find("#accordion-2").html("我们是AOM，一个神奇的团队");<br/>
     * 其中accordion-2为抽屉的id.
     * @name omAccordion#url
     * @function
     * @param index 要重新设置数据源的抽屉的索引（从0开始计数）
     * @example
     * //重新设置第二个抽屉的数据源，然后重新装载该抽屉的内容
     * $('#make-accordion').omAccordion( 'url', 1, './ajax/content2.html' );
     * $('#make-accordion').omAccordion( 'reload',1 );
     */
    url : function(index, url) {
        var panels= $.data(this.element , "panels");
        if (!url || this.options.disabled !== false || panels.length === 0) {
            return ;
        }
        index = this._correctIndex(index);
        panels[index].omPanel('option' , "url" , url);
    },
    _create: function(){
        var $acc = this.element,
            options = this.options;
        $acc.addClass("om-widget om-accordion").css("position","relative");
        this._renderPanels();
        options.active = this._correctIndex(options.active);
        this.resize();
        this._buildEvent();
        if(options.disabled !== false){
        	this.disable();
        }
    },
    /**
     * 修正索引，返回值为-1,0,1,2,...,len-1
     */
    _correctIndex: function(index){
    	var $acc = this.element,
        	panels = $.data(this.element , "panels"),
        	panel = $acc.children().find(">div#"+index),
        	len = panels.length,
        	oldIndex = index;
        index = panel.length ? $acc.find(">.om-panel").index(panel.parent()) : index;
        index = index==-1 ? oldIndex : index;
        //如果id找不到，则认为是索引，进行修正
        var r = parseInt(index);
        r = (isNaN(r) && '0' || r)-0;
        return len==0 || (r === -1 && this.options.collapsible !== false) ? -1: (r<0? 0 : (r>=len?len-1 : r));
    },
    _panelCreateCollapse: function(len , index){
    	var $acc = this.element,
    		options = this.options,
    		panel,
    		num;
    	if(options.active === -1 && options.collapsible === true){
    		return true;
    	}else{
			panel = $acc.find(">div#"+options.active);
			num = $acc.children().index(panel);
			num = (num == -1? options.active : num); 		
    		var r = parseInt(num);
    		r = (isNaN(r) && '0' || r)-0;
    		r = r<0? 0 : (r>=len?len-1 : r);
    		return r !== index;  
    	}
    },
    _renderPanels: function () {
        var $acc = this.element,
        	self = this,
            panels = [],
            options = this.options,
        	$headers = $acc.find(options.header),
        	cfg = [],
        	first;
        $headers.find("a").each(function(n){
            var href  = this.getAttribute('href', 2);
            var hrefBase = href.split( "#" )[ 0 ],
                baseEl;
            if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
                    ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
                href = this.hash;
                this.href = href;
            }
            var $anchor = $(this);
            cfg[n] = {
                    title : $anchor.text(),
                    iconCls: $anchor.attr("iconCls"),
                    onExpand : function(event) {
                    	self._trigger("onActivate",event,n);
                    },
                    tools:[{id:"collapse" , handler: function(panel , event){
                    	clearInterval(options.autoInterId);
	                    self._activate(n , true);
	                    self._setAutoInterId(self);
	                    event.stopPropagation();
                    }}],
                    onCollapse : function(event) {
                    	self._trigger("onCollapse",event,n);
                    },
                    onSuccess : function() {
                    	self.resize();
                    },
                    onError : function() {
                    	self.resize();
                    }
            };
            var target = $('>' + href, $acc);
            var pId = target.prop("id"); 
            //target要么指向一个当前页面的div，要么是一个url
            if (!!(target[0])) {
                if(!pId){
                    target.prop("id" , pId=panelIdPrefix+(id++));
                }
                target.appendTo($acc);
            } else {
                cfg[n].url = $anchor.attr('href');
                $("<div></div>").prop('id', pId=($anchor.prop('id') || panelIdPrefix+(id++)) ).appendTo($acc);
            }
            first = first || pId;
            /**
            if(n === 0){
                var $h = panels[0].prev();
                $h.css('border-top-width' , $h.css('border-bottom-width'));
            }
            **/
        }); 
        first && $acc.find("#"+first).prevAll().remove();
        $headers.remove();
        $.each(cfg , function(index , config){
        	config.collapsed = self._panelCreateCollapse(cfg.length , index);
        });
		$.each($acc.children() , function(index , panel){
			panels.push(self._createPanel(panel , cfg[index]));
			if( index === 0){
				var $h = panels[0].prev();
                $h.css('border-top-width' , $h.css('border-bottom-width'));
			}
		});
        $.data($acc , "panels" , panels);  
    },
    _initWidthOrHeight: function(type){
    	var $acc = this.element,
        	options = this.options,
        	styles = this.element.attr("style"),
        	value = options[type];
        if(value == 'fit'){
            $acc.css(type, '100%');
        }else if(value !== 'auto'){
        	$acc.css(type , value);
        }else if(styles && styles.indexOf(type)!=-1){
        	options[type] = $acc.css(type);
        }else{//'auto'
        	$acc.css(type , '');
        }
    },
    _createPanel: function(target, config){
        return $(target).omPanel(config);
    },
    _buildEvent: function() {
        var options = this.options,
            self = this;
        this.element.children().find('>div.om-panel-header').each(function(n){
            var header = $(this);
            header.unbind();
            if ( options.switchMode == 'mouseover' ) {
                header.bind('mouseenter.omaccordions', function(event){
                	clearInterval(options.autoInterId);
                    var timer = $.data(self.element, 'expandTimer');
                    (typeof timer !=='undefined') && clearTimeout(timer);
                    timer = setTimeout(function(){
                    	self._activate(n , true);
                        self._setAutoInterId(self);
                    },200);
                    $.data(self.element, 'expandTimer', timer);
                });
            } else if ( options.switchMode == 'click' ) {
                header.bind('click.omaccordions', function(event) {
                    clearInterval(options.autoInterId);
                    self._activate(n , true);
                    self._setAutoInterId(self);
                });
            } 
            header.hover(function(){
                $(this).toggleClass("om-panel-header-hover");
            });
        });
        if (options.autoPlay) {
            clearInterval(options.autoInterId);
            self._setAutoInterId(self);
        }
        
    },
    _setAutoInterId: function(self){
    	var options = self.options;
    	if (options.autoPlay) {
    		options.autoInterId = setInterval(function(){
                self._activate('next');
            }, options.interval);
        }
    },
    _setOption: function( key, value ) {
    	$.OMWidget.prototype._setOption.apply( this, arguments );
		var options = this.options;
		switch(key){
			case "active":
				this.activate(value);
				break;
			case "disabled":
				value===false?this.enable():this.disable();
				break;
			case "width":
			    options.width = value;
			    this._initWidthOrHeight("width");
				break;
			case "height":
			    options.height = value;
			    this._initWidthOrHeight("height");
				break;
		}
    },
    _activate: function(index , isSwitchMode){
        var panels = $.data(this.element , "panels"),
        len = panels.length,
        options = this.options,
        self = this,
        isExpand = false,
        expandIndex=-1,
        anim = false,
        speed;
    	if(options.disabled !== false && len === 0){
    		return ;
    	}
    	index = index==='next' ? (options.active + 1) % len : self._correctIndex(index);
        if (options.switchEffect) {
            anim = true;
            speed = 'fast';
        }
        for(var i=0; i<len; i++){
            $(panels[i]).stop(true , true);
        }
        //找出当前展开的panel
        var active = self.getActivated();
        isExpand = !!active;
        if(isExpand){
            expandIndex = self._correctIndex(active);
            if(expandIndex == index){
                if( isSwitchMode === true && options.collapsible !== false && self._trigger("onBeforeCollapse",null,expandIndex)!==false){
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
                    options.active = -1;
                }else{
                	options.active = expandIndex;
                }
            }else{//当前想要激活的抽屉并不是处于激活状态
                if(index === -1){
                	if(self._trigger("onBeforeCollapse",null,expandIndex)!==false){
	                	//收起抽屉，然后整个组件的抽屉都将处于收起状态
	                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
	                    options.active = -1;
					}else{
						options.active = expandIndex;
					}
                }else if( self._trigger("onBeforeCollapse",null,expandIndex)!==false 
                        && (canAct=self._trigger("onBeforeActivate",null,index)!==false)  ){
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
                    $(panels[index]).omPanel('expand', anim, speed);
                    options.active = index;
                }else{
                	options.active = expandIndex;
                }
            }
        }else{//当前并没有任何已经激活的抽屉
        	if(index === "-1"){
        		options.active = -1;
        	}else if(self._trigger("onBeforeActivate",null,index)!==false){
        		$(panels[index]).omPanel('expand', anim, speed);
                options.active = index;
        	}
        }
    }
});
})( jQuery );
