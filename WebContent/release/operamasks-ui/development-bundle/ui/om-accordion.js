/*
 * operamasks-ui omAccordion 0.1
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  om-panel.js
 */
(function( $, undefined ) {
    var panelIdPrefix = 'om-accordion-panel-' + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '-',
    id = 0;
	/**
     * @name omAccordion
     * @author 陈天真，陈界
     * @class 抽屉布局组件。以抽屉的形式展现信息，每个抽屉内容可为当前页面内容，也可以使用Ajax装载其他页面的内容，其原理是jQuery的load方法，没用到嵌入的iframe，不支持跨域装载.支持初始化过后再次更新某个抽屉的数据源(调用url方法)，值得注意的是:更新数据源不会触发抽屉的刷新操作，需要显示调用另一个api来完成(调用reload方法)<br/><br/>
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
$.widget( "om.omAccordion", {
	
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
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onActivate : function(index) {
         *          alert('accordion ' + index + ' has been activated!');
         *      }
         *  });
         */
        onActivate: function(index){
        },
        /**
         * 激活一个抽屉之前执行的方法。
         * 如果返回布尔值false,那么对应抽屉将不会激活。
         * @event
         * @param index 被选择的抽屉的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onBeforeActivate : function(index) {
         *          alert('accordion ' + index + ' will be activated!');
         *      }
         *  });
         */
        onBeforeActivate: function(index){
        },
        /**
         * 收起一个抽屉前执行的方法。
         * 如果返回布尔值false,那么对应抽屉将不会被收起。
         * @event
         * @param index 被收起的抽屉的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onBeforeCollapse : function(index) {
         *          alert('accordion ' + index + ' will been collapsed!');
         *      }
         *  });
         */
        onBeforeCollapse: function(index){
        },
        /**
         * 收起一个抽屉时执行的方法
         * @event
         * @param index 被收起的抽屉的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onCollapse : function(index) {
         *          alert('accordion ' + index + ' has been collapsed!');
         *      }
         *  });
         */
        onCollapse : function(index) {
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
    	index = this._correctIndex(index);
        index = index == -1 ? 0 : index;
        this._activate(index);
        this._setAutoInterId(this);
        return this;
    },
    /**
     * 禁用整个抽屉组件。
     * @name omAccordion#disable
     * @function
     * @example
     * $('#make-accordion').omAccordion('disable');
     */
    disable : function() {
        var panels= $.data(this.element , "panels");
        var len = panels.length;
        while(len--){
            $(panels[len]).omPanel("disable");
        }
        var options = this.options;
        if (options.autoPlay) {
            clearInterval(options.autoInterId);
        }
        options.disabled = true;
    },
    /**
     * 使整个抽屉处于可用状态(即非禁用状态)
     * @name omAccordion#enable
     * @function
     * @example
     * $('#make-accordion').omAccordion('enable');
     */
    enable : function() {
        var panels= $.data(this.element , "panels");
        var len = panels.length;
        while(len--){
            $(panels[len]).omPanel("enable");
        }
        this._buildEvent();
        this.options.disabled = false;
    },
    /**获取当前处于激活状态的抽屉的id,如果抽屉总数为0或者当前没有抽屉处于激活状态，那么返回null<br/>
     * 抽屉的id在创建时可以自行指定，如果没有指定，组件内部会动态产生一个.<br/>
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
        var panels= $.data(this.element , "panels"),
        	active = this.options.active;
    	for(var i=0,len=panels.length; i<len; i++){
    		if($(panels[i]).omPanel("header").hasClass("om-panel-expanded")){
    			return $(panels[i]).omPanel("body").prop("id");
    		}
    	}
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
        $(panels[index]).omPanel('reload');
    },
    /**
     * 重新计算并动态改变整个布局组件的大小,重新设置了组件的宽和高后要调用此方法才可以生效。
     */
    resize: function() {
        if(this.options.disabled !== false){
            return this;
        }
        var acc = this.element,
            panels = $.data(this.element , "panels"),
            len = panels.length,
            panelBodyHeight;
        this._initWidthOrHeight('width');
        this._initWidthOrHeight('height');
        if(this.options.height !== 'auto'){
            panelBodyHeight = acc.innerHeight();
            var i;
            for(i=0; i<len; i++){
                panelBodyHeight -= $(panels[i]).omPanel("panel").outerHeight(true);
            }
            var activePanelId = this.getActivated();
            if(activePanelId){
                panelBodyHeight += acc.find("#"+activePanelId).omPanel('body').outerHeight();
            }
            for(i=0 ; i<len; i++){
                var panelBody = $(panels[i]).omPanel('body');
                panelBody.height( panelBodyHeight - (panelBody.outerHeight()-panelBody.height()) );
            }
        }else{
            for(i=0 ; i<len; i++){
                var panelBody = $(panels[i]).omPanel('body');
                panelBody.css('height' , "");
            }
        }
        return this;
    }, 
    /**
     * 设置指定抽屉的标题，标题内容可以为html文本
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
        $(panels[index]).omPanel("header").find(">div.om-panel-title").html(title);
        return this;
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
        var panels= $.data(this.element , "panels"),
        	len = panels.length;
        if (!url || this.options.disabled !== false || panels.length === 0) {
            return ;
        }
        index = this._correctIndex(index);
        $(panels[index]).omPanel('options', {
            url : url
        });
    },
    _create: function(){
        var acc = this.element,
            options = this.options,
            panels = [],
            len,
            index = options.active,
            panel;
        acc.addClass("om-widget om-accordion");
        this._renderPanels();
        this.resize();
        index = this._correctIndex(index);
        if(index !=-1 || !(options.collapsible!==false)){
            index = index == -1 ? 0 : index;
            this._activate(index);
        }
        options.disabled !== false ? this.disable() : this._buildEvent();
        acc.hasCreated = true;//组件已创建标记
    },
    /**
     * 修正索引，返回值为-1,0,1,2,...,len-1
     * 只有组件第一次创建的时候才有可能返回-1
     */
    _correctIndex: function(index){
    	var acc = this.element,
        	options = this.options,
        	panels = $.data(this.element , "panels"),
        	panel = acc.children().find(">div#"+index),
        	len = panels.length,
        	oldIndex = index;
        index = panel.length ? $(panels).index(panel) : index;
        index = index==-1 ? oldIndex : index;
        //如果id找不到，则认为是索引，进行修正
        var r = parseInt(index);
        r = (isNaN(r) && '0' || r)-0;
        return len==0 || r==-1&&!acc.hasCreated? -1: (r<0? 0 : (r>=len?len-1 : r));
    },
    _renderPanels: function () {
        var acc = this.element,
        	self = this,
            panels = [],
            options = this.options;
        var headers = acc.find("ul:first");
        headers.find("a").each(function(n){
            var href  = this.getAttribute('href', 2);
            var hrefBase = href.split( "#" )[ 0 ],
                baseEl;
            if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
                    ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
                href = this.hash;
                this.href = href;
            }
            var anchor = $(this);
            var cfg = {
                    title : anchor.text(),
                    tools : ['collapse'],
                    iconCls: anchor.attr("iconCls"),
                    clickExpand : true,
                    onExpand : function() {
                        options.onActivate(n);
                    },
                    collapsed : true,
                    onCollapse : function() {
                        if(acc.hasCreated){
                            options.onCollapse(n);
                        }
                    },
                    border : true
            };
            var target = $('>' + href, acc);
            var pId = target.prop("id"); 
            //target要么指向一个当前页面的div，要么是一个url
            if (!!(target[0])) {
                if(!pId){
                    target.prop("id" , panelIdPrefix+(id++));
                }
                cfg.content = target.html();
                panels.push(self._createPanel(target[0], cfg));
            } else {
                cfg.url = anchor.attr('href');
                var panel = self._createPanel($('<div></div>')[0], cfg);
                panels.push(panel);
                var aid = anchor.prop('id');
                $(panel).prop("id" , aid?aid:panelIdPrefix+(id++));
            }
            $(panels[n]).omPanel('header').addClass( 'om-widget-header ');
            $(panels[n]).omPanel('panel').appendTo(acc);
        }); 
        $.data(acc , "panels" , panels);
        headers.remove();
    },
    _initWidthOrHeight: function(type){
    	var acc = this.element,
        	options = this.options,
        	styles = this.element.attr("style"),
        	value = options[type];
    	if(styles && styles.indexOf(type)!=-1 && !acc.hasCreated){
    		options[type] = acc.css(type);
    	}else if(value === 'fit'){
    		options[type] = '100%';
            acc.css(type, '100%');
    	}else{
    		acc.css(type , value==='auto'?"":value);
    	}
    },
    _createPanel: function(target, config){
        $(target).omPanel(config);
        return target;      
    },
    _buildEvent: function() {
        var options = this.options,
            self = this;
        this.element.children().find('>div.om-panel-header').each(function(n){
            var header = $(this);
            header.unbind();
            header.find('div.om-panel-tool').children().unbind();
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
		$.Widget.prototype._setOption.apply( this, arguments );
		var options = this.options;
		switch(key){
			case "active":
				var active = this.getActivated();
				if(value == '-1' && options.collapsible!==false && options.disabled===false){
					//说明可以全部收起
					var old = active,
					    anim,
					    speed;
					active = this._correctIndex(active);
					if(old && options.onBeforeCollapse.call(this,active)!==false){
						if (options.switchEffect) {
				            anim = true;
				            speed = 'fast';
				        }
						var panels = $.data(this.element , 'panels');
						$(panels[active]).omPanel('collapse', anim, speed);
		                options.active = -1;
					}
					break;
				}
				this.activate(this._correctIndex(value));
				break;
			case "disabled":
				value===false?this.enable():this.disable();
				break;
			case "width":
				if(value == 'fit'){
					options.width = "100%";
				}
				break;
			case "height":
				if(value == 'fit'){
					options.height = "100%";
				}
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
        anim,
        speed;
    	if(options.disabled !== false && this.element.hasCreated || len === 0){
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
                if( isSwitchMode === true && options.collapsible !== false && options.onBeforeCollapse.call(self , expandIndex)!==false){
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
                    options.active = -1;
                }
            }else{//当前想要激活的抽屉并不是处于激活状态
                var canAct;
                if( options.onBeforeCollapse.call(self , expandIndex)!==false 
                        && ((canAct=options.onBeforeActivate.call(self, index)!==false) || options.collapsible !== false) ){
                    //收起抽屉，然后整个组件的抽屉都将处于收起状态
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
                    if(canAct){
                        //可以激活,进行激活
                        $(panels[index]).omPanel('expand', anim, speed);
                    }
                    options.active = canAct?index:-1;
                }
            }
        }else{//当前并没有任何已经激活的抽屉
            if(options.onBeforeActivate.call(self, index)!==false){
                $(panels[index]).omPanel('expand', anim, speed);
                options.active = index;
            }
        }
        return this;
    }
});
})( jQuery );
