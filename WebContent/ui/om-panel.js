/*
 * $Id: om-panel.js,v 1.47 2012/06/20 08:29:10 chentianzhen Exp $
 * operamasks-ui omPanel @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *   om-core.js
 */
(function($) {
	var innerToolId = ['collapse','min','max','close'],
		innerToolCls = ['om-panel-tool-collapse','om-panel-tool-expand','om-panel-tool-min','om-panel-tool-max','om-panel-tool-close'],
		effects = {anim:true , speed: 'fast'};
	/**
     * @name omPanel
     * @class 面版是一个布局组件，同时也是一个展示内容的容器。<br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用本地数据源，也可以使用远程数据源，同时提供友好的错误处理机制。</li>
     *      <li>支持动态修改标题内容和图标。</li>
     *      <li>工具条按钮内置与可扩展。</li>
     *      <li>提供丰富的事件。</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#panel').omPanel({
     *         width: '400px',
     *         height: '200px',
     *         title: 'panel标题',
     *         collapsed: false,//组件创建后为收起状态
     *         collapsible: true,//渲染收起与展开按钮
     *         closable: true, //渲染关闭按钮
     *         onBeforeOpen: function(event){if(window.count!==0)return false;}, 
     *         onOpen: function(event){alert('panel被打开了。');}
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;input id="panel"/>
     * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
	$.omWidget("om.omPanel" , {
		options:/** @lends omPanel#*/{
			/**
			 * panel的标题，位于头部左边的位置。
			 * @type String 
			 * @default 无
			 * @example
             * $("#panel").omPanel({title:"&lt;span style='color:red'&gt;标题&lt;/span&gt;"});<br/>
             * 因为所给的标题会当成html文本，所以当出现特殊字符时必须进行转义，如"<"必须转义为"&amp;lt;"。
			 */
			title: '',
			/**
			 * panel的图标样式，位于头部左边的位置。
			 * @name omPanel#iconCls
			 * @type String
			 * @default 无
			 * @example
			 * $("#panel").omPanel({iconCls:'myCls'});(myCls为自定义的css样式类别)
			 */
			/**
			 * panel组件的宽度，可取值为'auto'（默认情况,由浏览器决定宽度），可以取值为'fit'，表示适应父容器的大小（width:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给width属性。 
			 * @type Number,String
			 * @default 'auto'
			 * @example
			 * $("#panel").omPanel({width:'300px'});
			 */ 
			width: 'auto',
			/**
			 * panel组件的高度，可取值为'auto'（由内容决定高度），可以取值为'fit'，表示适应父容器的大小（height:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给height属性。
			 * @type Number,String
			 * @default 'auto'
			 * @example
			 * $("#panel").omPanel({height:'200px'});
			 */
			height: 'auto',
			/**
			 * 在组件创建时是否要渲染其头部。
			 * @type Boolean
			 * @default true
			 * @example
			 * $("#panel").omPanel({header:false}); //不要渲染panel的头部
			 */
			header: true,
			/**
			 * 组件内容的数据来源。当设置了此值后，组件会从远程获取数据来填充主体部分。可以调用reload方法动态更新组件主体内容。
			 * @name omPanel#url
			 * @type String
			 * @default 无
			 * @example
			 * $("#panel").omPanel({url:'http://www.ui.operamasks.org/test'});
			 */
			/**
			 * 组件创建时是否显示收起工具按钮(位于头部右边)。
			 * @type Boolean
			 * @default false
			 * @example
			 * $("#panel").omPanel({collapsible:true});
			 */
			collapsible: false,
			/**
			 * 组件创建时是否显示关闭工具按钮(位于头部右边)。
			 * @type Boolean
			 * @default false
			 * @example
			 * $("#panel").omPanel({closable:true});
			 */
			closable: false,
			/**
			 * 组件创建后是否处于关闭状态，可调用open方法动态打开该组件。
			 * @type Boolean
			 * @default false
			 * @example
			 * $("#panel").omPanel({closed:false});
			 */
			closed: false,
			/**
			 * 组件创建后是否处于收起状态，可调用expand方法动态展开组件主体内容。
			 * @type Boolean
			 * @default false
			 * @example
			 * $("#panel").omPanel({collapsed:true});
			 */
			collapsed: false,
			/**
			 * 组件头部右上角的工具条。<br/>
			 * 当为Array时，数组中每个对象代表了一个工具按钮,每个对象格式如下:<br/>
			 * <pre>
			 * {
			 *     id:内置工具按钮，可选值为'min'，'max'，'close'，collapse'。
			 *     iconCls:工具按钮的样式，如果id属性存在，则忽略此属性，此属性可为String或者Array，
			 *             当为String时，表示按钮在所有状态下的样式，当为Array时，索引0表示按钮
			 * 	           常态下的样式，索引1表示按钮被鼠标hover时的样式。
			 *     handler:按钮图标被单击时触发的事件(如果没有提供此属性，则按钮按下后会没有反应)。
			 * }
			 * </pre>
			 * 补充:考虑到用户习惯，默认情况下，如果collapsible=true，则会显示收起按钮，它将永远排在第一个位置。<br/>
			 * 如果closable=true,则会显示关闭按钮，它将永远排在最后一个位置。 <br/>
			 * 所以可以认为tools产生的工具条会放在中间，如果用户不想受限于这样的排序，则不要设置collapsible和closable这两个属性，直接利用tools属性重新定义想要的工具条。 <br/><br/>
			 * 
			 * 当为Selector时，此Selector对应的dom结构将作为tool的一部分进行渲染，这时事件的注册，样式的变换将完全交由用户处理。
			 * @type Array,Selector
			 * @default []
			 * @example
			 * <pre>
			 * $("#panel").omPanel({tools:[
			 *         {id:'min',handler:function(panel , event){ alert("最小化操作还未实现."); }},
			 *         {id:'max',handler:function(panel , event){ alert("最大化操作还未实现."); }}
			 *     ]}
			 * );
			 * </pre>
			 */
			tools: [],
			/**
			 * 远程加载数据时的提示信息，只有设置了url或者调用reload方法时传入一个url才生效。
			 * 内置了一种默认的样式(显示一个正在加载的图标)，当传入字符串"default"时启用此默认样式。
			 * @type String
			 * @default 'default'
			 * @example
			 * $("#panel").omPanel({loadingMessage:"&lt;img src='load.gif'&gt;&lt;/img&gt;loading......"});
			 */
			loadingMessage: "default",
			/**
			 * 在远程取数时，拿到数据后，显示数据前的一个预处理函数，类似于一个过滤器的作用，该函数的返回值即为最终的数据。
			 * @name omPanel#preProcess
			 * @type Function
			 * @param data 服务端返回的数据 
			 * @param textStatus 服务端响应的状态
			 * @default null
			 * @example
			 * $("#panel").omPanel({url:'test.do',preProcess:function(data , textStatus){return 'test';}});
			 * //不管服务器返回什么数据，主体内容永远为'test'
			 */
			/**
			 * 远程取数发生错误时触发的函数。
			 * @event
			 * @param xmlHttpRequest XMLHttpRequest对象
			 * @param textStatus  错误类型
			 * @param errorThrown  捕获的异常对象
			 * @param event jQuery.Event对象
			 * @name omPanel#onError
			 * @type Function
			 * @default null
			 * @example
			 * <pre>
			 * $("#panel").omPanel({url:'test.do',
			 *     onError:function(xmlHttpRequest, textStatus, errorThrown, event){
			 *         alert('网络发生了错误，请稍后再试。');
			 *     }
			 * });
			 * </pre>
			 */
			/**
			 * 远程取数成功后触发的函数。
			 * @event
			 * @param data 从服务器返回的数据
			 * @param textStatus 服务端响应的状态
			 * @param xmlHttpRequest XMLHttpRequest对象
			 * @param event jQuery.Event对象
			 * @name omPanel#onSuccess
			 * @type Function
			 * @default null
			 * @example
			 * <pre>
			 * $("#panel").omPanel({url:'test.do',
			 *     onSuccess:function(data, textStatus, xmlHttpRequest, event){
			 *         alert("服务器返回的数据为:" + data);
			 *     }
			 * });
			 * </pre>
			 */
			/**
			 * 打开panel组件前触发的函数，返回false可以阻止打开。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onBeforeOpen
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onBeforeOpen:function(event){alert("永远打不开该组件.");return false;}});
			 */
			/**
			 * 打开panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onOpen
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onOpen:function(event){alert("panel已经被打开了。");}});
			 */
			/**
			 * 关闭panel组件前触发的函数，返回false可以阻止关闭。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onBeforeClose
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onBeforeClose:function(event){alert("该组件即将被关闭。");}});
			 */
			/**
			 * 关闭panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onClose
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onClose:function(event){alert("panel已经被关闭了。");}});
			 */
			/**
			 * 收起panel组件前触发的函数，返回false可以阻止收起。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onBeforeCollapse
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onBeforeCollapse:function(event){alert("该组件即将被收起。");}});
			 */
			/**
			 * 收起panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onCollapse
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onCollapse:function(event){alert("panel已经被收起了。");}});
			 */
			/**
			 * 展开panel组件前触发的函数，返回false可以阻止展开。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onBeforeExpand
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onBeforeExpand:function(event){alert("该组件即将被展开。");}});
			 */
			/**
			 * 展开panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name omPanel#onExpand
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").omPanel({onExpand:function(event){alert("panel已经被展开了。");}});
			 */
			 /**
			  *组件的关闭模式，当调用close方法时怎么处理组件的关闭，"hidden"表示直接display:none ,"visibility"表示缩小为1px的点
			  * 此属性暂时不暴露
			  */
			 _closeMode : "hidden",
			 _helpMsg : false
		},
		_create: function(){
		    this.element.addClass("om-panel-body om-widget-content")
		    	.wrap("<div class='om-widget om-panel'></div>");
		},
		_init: function(){
			var options = this.options,
				$body = this.element,
				$parent = $body.parent(),
				$header;
			this._renderHeader();
			$header = $body.prev();
			if(options.header === false){
		 		$body.addClass("om-panel-noheader");
		 	}
			this._bindEvent();
		 	this._resize($parent);
		 	var headerHeight = options.header !== false? $header.outerHeight() : 0;
		 	if(options.collapsed !== false){
		 		"auto"!==options.height && $parent.height(headerHeight);		 		
		 		$body.hide();
		 		if(options.header !== false){
		 			$header.find(">.om-panel-tool >.om-panel-tool-collapse").removeClass("om-panel-tool-collapse")
		 				.addClass("om-panel-tool-expand");
		 		}
		 	}else{
		 		$body.show();
		 		"auto"!==options.height && $parent.height(headerHeight + $body.outerHeight());
		 		if(options.header !== false){
		 			$header.find(">.om-panel-tool >.om-panel-tool-expand").removeClass("om-panel-tool-expand")
		 				.addClass("om-panel-tool-collapse");
		 		}	
		 	}
		 	options.closed !== false? this._hide($parent) : this._show($parent);
		 	this.reload();
		},
		_hide: function($target){
			if("hidden" === this.options._closeMode){
				$target.hide();
			}else if("visibility" === this.options._closeMode){
				$target.addClass("om-helper-hidden-accessible");
			}
		},
		_show: function($target){
			if("hidden" === this.options._closeMode){
				$target.show();
			}else if("visibility" === this.options._closeMode){
				$target.removeClass("om-helper-hidden-accessible");
			}
		},
		_bindEvent: function(){
			var self = this,
				$body = this.element,
				options = this.options,
				header = $body.prev();
			if(options.collapsible !== false){
				header.click(function(event){
					if($(event.target).is(".om-panel-icon,.om-panel-title,.om-panel-header")){
						options.collapsed !== false? self.expand() : self.collapse();
					}
				}).find(".om-panel-tool-collapse , .om-panel-tool-expand")
				.click(function(){
					options.collapsed !== false? self.expand() : self.collapse();
				});
			}
			if(options.closable !== false){
				header.find(".om-panel-tool-close")
					.click(function(e){
						self.close();
					});				
			}
		},
		_renderHeader: function(){
			this.header && this.header.remove();
			if(this.options.header === false){
				return ;
			}
			var that = this,
				options = this.options,
				tools = options.tools,
				$header = this.header = $("<div class='om-panel-header'></div>").insertBefore(this.element);
			if(options._helpMsg){
				$header.parent().addClass('helpMsg');
			}
			if(options.iconCls){
				$("<div class='om-icon om-panel-icon'></div>").addClass(options.iconCls).appendTo($header);
			}
			$("<div class='om-panel-title'></div>").html(options.title).appendTo($header);
			$tool = $("<div class='om-panel-tool'></div>");
			if(options.collapsible !== false){
				$("<div class='om-icon om-panel-tool-collapse'></div>").appendTo($tool);	
			}
			//处理自定义头部右边的工具条
			if($.isArray(tools)){
				for(var i=0,len=tools.length; i<len; i++){
					var tool = tools[i],
						iconCls;
					if(iconCls = this._getInnerToolCls(tool.id)){
						$("<div class='om-icon'></div>").addClass(iconCls)
							.click(	function(event){
								tool.handler.call(this,that,event);
							}).appendTo($tool);
					}else if(typeof tool.iconCls === 'string'){
						$("<div class='om-icon'></div>").addClass(tool.iconCls)
							.click(	function(event){
								tool.handler.call(this,that,event);
							}).appendTo($tool);
					}else if($.isArray(tool.iconCls)){
						//这里必须要用内部匿名函数，因为hover中用到了tool，否则tool的值很可能已经被改掉了
						(function(tool){
							$("<div class='om-icon'></div>").addClass(tool.iconCls[0])
								.click(function(event){
									tool.handler.call(this,that,event);
								})
								.hover(function(){
									if(tool.iconCls[1]){
										$(this).toggleClass(tool.iconCls[1]);
									}
								}).appendTo($tool);
						})(tool);
					}
				}
			}else{
				try{
					$(tools).appendTo($tool);
				}catch(error){
					throw "bad format of jquery selector.";
				}
			}
			
			if(options.closable !== false){
				$("<div class='om-icon om-panel-tool-close'></div>").appendTo($tool);	
			}
			//处理内置工具按钮hover时的样式变换
			$tool.find(">div.om-icon").hover(
				function(){
					var self = this;
					$.each(innerToolCls , function(){
						if($(self).hasClass(this)){
							$(self).toggleClass(this+"-hover");
						}
					});
				}
			);
			$tool.appendTo($header);
		},
		/**
		 * 初始化panel,header,body的宽和高
		 */
	 	_resize: function($panel){
	 		var $body = this.element,
	 			$header = $body.prev(),
	 			$panel = $body.parent(),
	 			options = this.options;
	 		if(options.width == 'fit'){
	 			options.width = '100%';
	 			$panel.width('100%');
	 			$header.css("width" , "");
	 			$body.css("width" , "");
	 		}else if(options.width !== 'auto'){
				$panel.width(options.width);
				$header.outerWidth($panel.width());
				$body.outerWidth($panel.width());
	 		}else{
	 			var style = $body.attr("style");
	 			if(style && style.indexOf("width") !== -1){
	 				$panel.width($body.outerWidth());
	 				$header.outerWidth($body.outerWidth());
	 			}else{
	 				$panel.css("width" , "");
		 			$header.css("width" , "");
		 			$body.css("width" , "");
	 			}
	 		}
	 		if(options.height == 'fit'){
	 			options.height = '100%';
	 			$panel.height('100%');
	 			$body.outerHeight($panel.height()- (this.options.header!==false?$header.outerHeight():0) );	 
	 		}else if(options.height !== 'auto'){
				$panel.height(options.height);
				$body.outerHeight($panel.height()- (this.options.header!==false?$header.outerHeight():0) );	 
	 		}else{
	 			var style = $body.attr("style");
	 			if(style && style.indexOf("height") !== -1){
	 				$panel.height($header.outerHeight() + $body.outerHeight());
	 			}else{
	 				$panel.css("height" , "");
		 			$body.css("height" , "");
	 			}
	 		}
	 	},
	 	_getInnerToolCls: function(id){
	 		return $.inArray(id , innerToolId)!=-1? 'om-panel-tool-'+id : null;
	 	},
		_showLoadingMessage: function(){
			var options = this.options,
				$body = this.element,
				$loadMsg = $body.next(".om-panel-loadingMessage"),
				position = {
					width:$body.innerWidth(), 
					height:$body.innerHeight(),
					left:$body.position().left + parseInt($body.css("border-left-width")),
					top:$body.position().top
				};
			if($loadMsg.length === 0){
				if("default" === options.loadingMessage){
					$("<div class='om-panel-loadingMessage'><div class='valignMiddle'><div class='loadingImg'>数据加载中</div></div></div>")
					.css(position).appendTo($body.parent());
				}else{
					$("<div class='om-panel-loadingMessage'></div>").appendTo($body.parent())
					.html(options.loadingMessage)
					.css(position);
				}
			}else{
				$loadMsg.css(position).show();
			}
		},
		_hideLoadingMessage: function(){
			this.element.parent().find(".om-panel-loadingMessage").hide();
		},
		/**
		 * 设置panel的标题
		 * @name omPanel#setTitle
		 * @function
		 * @param title 新的标题
		 */
		setTitle: function(title){
		 	this.element.prev().find(">.om-panel-title").html(title);
		},
		/**
		 * 设置panel的图标样式
		 * @name omPanel#setIconClass
		 * @function
		 * @param iconCls 新的图标样式
		 * @returns 当前jquery对象
		 */
		setIconClass: function(iconCls){
			var $header = this.element.prev();
			var $icon = $header.find(">.om-panel-icon");
		 	if(iconCls == null && $icon.length!==0){
		 		$icon.remove();
		 	}else{
		 		if($icon.length==0){
		 			$icon = $("<div class='om-icon om-panel-icon'></div>").insertBefore($header.find(">.om-panel-title"));
		 		}
		 		if(this.options.iconCls){
		 			$icon.removeClass(this.options.iconCls);
		 		}
		 		$icon.addClass(iconCls);
		 		this.options.iconCls = iconCls;
		 	}
		},
		/**
		 * 打开组件，使组件可见。
		 * @name omPanel#open
		 * @function
		 */
		open: function(){
			var $body = this.element,
				options = this.options;
			if(options.closed){
				if(options.onBeforeOpen && this._trigger("onBeforeOpen") === false){
					return ;
				}
				this._show($body.parent());
				options.closed = false;
				options.onOpen && this._trigger("onOpen");
			}
		},
		/**
		 * 关闭组件，使组件不可见。
		 * @name omPanel#close
		 * @function
		 */
		close: function(){
			var $body = this.element,
				options = this.options;
			if(!options.closed){
				if(options.onBeforeClose && this._trigger("onBeforeClose") === false){
					return ;
				}
				this._hide($body.parent());
				options.closed = true;
				options.onClose && this._trigger("onClose");
			}
		},
		/**
		 * 重新加载数据,为使该方法有效，创建组件时必须指定url属性或者调用此方法时传入一个合法的url。
		 * @name omPanel#reload
		 * @function
		 * @param url 一个有效的取数地址
		 */
		reload: function(url){
			var options = this.options,
				$body = this.element,
				self = this;
			if($body.data("loading")){
				return ;
			}else{
				$body.data("loading" , true);
			}
		 	url = url || options.url;
		 	if(!url){
		 		$body.data("loading" , false);
		 		return ;
		 	}
		 	options.url = url;
		 	this._showLoadingMessage();
		 	$.ajax(url , {
		 		cache: false,
		 		success: function(data, textStatus, jqXHR){
		 			$body.html(options.preProcess? options.preProcess.call($body[0] , data , textStatus) : data);
		 			$body.data("loading" , false);
		 			self._hideLoadingMessage();
		 			options.onSuccess && self._trigger("onSuccess", null, data, textStatus, jqXHR);
		 		},
		 		error: function(jqXHR, textStatus, errorThrown){
		 			$body.data("loading" , false);
		 			self._hideLoadingMessage();
		 			options.onError && self._trigger("onError", null, jqXHR, textStatus, errorThrown);
		 		}
		 	});
		},
		/**
		 * 改变组件的大小。
		 * @name omPanel#resize
		 * @function
		 * @param position (1)可以为Object,格式如{width:'100px',height:'100px'} <br/>
		 *                 (2)只有一个参数表示width,有两个参数时依次表示width,height
		 */
		resize: function(position){
		 	var options = this.options,
		 		width,
		 		height;
		 	if($.isPlainObject(position)){
		 		width = position.width || null;
		 		height = position.height || null;
		 	}else{
		 		width = arguments[0];
		 		height = arguments[1];
		 	}
		 	options.width = width || options.width;
		 	options.height = height || options.height;
		 	this._resize(this.element.parent());
		},
		/**
		 * 收起组件。
		 * @name omPanel#collapse
		 * @function
		 */
		collapse: function(/**anim , speed**/){
		 	var self = this,
		 		$body = this.element,
				$header = $body.prev(),
				$parent = $body.parent(),
				$loadMessage = $body.next(".om-panel-loadingMessage"),
				options = this.options,
				anim = effects.anim,
				speed = effects.speed;
				if(arguments[0] != undefined){//由于anim为boolean，所以不可以写成 anim = arguments[0] || effects.anim
					anim = arguments[0];//内部使用
				}
				speed = arguments[1] || speed;//内部使用
			if (options.onBeforeCollapse && self._trigger("onBeforeCollapse") === false) {
            	return ;
        	}
        	$parent.stop(true,true);
			if($header.length !== 0){
				var $expandTool = $header.find("> .om-panel-tool > div.om-panel-tool-collapse");
				if($expandTool.length !== 0){
					$expandTool.removeClass("om-panel-tool-collapse").addClass("om-panel-tool-expand");
					if($expandTool.hasClass("om-panel-tool-collapse-hover")){
						$expandTool.toggleClass("om-panel-tool-collapse-hover om-panel-tool-expand-hover");
					}
				}
			}

			$parent.animate({
					height: '-='+$body.outerHeight()
				} , 
				anim? (speed || 'normal') : 0 , 
				function(){
					$body.hide();
					$loadMessage.hide();
					"auto"===options.height && $parent.css("height" , "");//动画执行后parent会自动添加高度值，所以设置为"auto"时要手动去掉此高度
                	options.onCollapse && self._trigger("onCollapse");
				}
			);    
			options.collapsed = true;
		},
		/**
		 * 展开组件。
		 * @name omPanel#expand
		 * @function
		 */
		expand: function(/**anim , speed**/){
			var self = this,
				$body = this.element,
				$header = $body.prev(),
				$parent = $body.parent(),
				$loadMessage = $body.next(".om-panel-loadingMessage"),
				options = this.options,
				anim = effects.anim,
				speed = effects.speed;
				if(arguments[0] != undefined){//由于anim为boolean，所以不可以写成 anim = arguments[0] || effects.anim
					anim = arguments[0];//内部使用
				}
				speed = arguments[1] || speed;//内部使用
			if (options.onBeforeExpand && self._trigger("onBeforeExpand") === false) {
            	return ;
        	}
        	$parent.stop(true,true);
			if($header.length !== 0){
				var $expandTool = $header.find("> .om-panel-tool > div.om-panel-tool-expand");
				if($expandTool.length !== 0){
					$expandTool.removeClass("om-panel-tool-expand").addClass("om-panel-tool-collapse");
					if($expandTool.hasClass("om-panel-tool-expand-hover")){
						$expandTool.toggleClass("om-panel-tool-expand-hover om-panel-tool-collapse-hover");
					}
				}
			}
			//如果parent没有设置高度值，要设置一个，不然动画效果是出不来的
			"auto"===options.height && $parent.height($header.outerHeight());
			$body.show();
			if($body.data("loading")){
				$loadMessage.show();
			}
			$parent.animate({
					height: '+='+$body.outerHeight()
				} , 
				anim? (speed || 'normal') : 0 , 
				function(){
					"auto"===options.height && $parent.css("height" , "");//动画执行后parent会自动添加高度值，所以设置为"auto"时要手动去掉此高度
	                options.onExpand && self._trigger("onExpand");
				}
			);     
			options.collapsed = false;
		},
		/**
		 * 销毁组件
		 * @name omPanel#destroy
		 * @function
		 */
		destroy: function(){
			var $body = this.element;
			$body.parent().after($body).remove();
		}
	});
})(jQuery);