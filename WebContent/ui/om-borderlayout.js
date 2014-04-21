/*
 * $Id: om-borderlayout.js,v 1.19 2012/06/18 08:40:56 licongping Exp $
 * operamasks-ui omBorderLayout @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 * om-core.js
 * om-mouse.js
 * om-resizable.js
 * om-panel.js
 */
    /** 
     * @name omBorderLayout
     * @class omBroderLayout是页面布局的基础组件.把页面拆分为north,south,west,center,east（上、下、左、中、右）5个区域，除了center是必须设置的之外其他的都是可选的。<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>以omPanel作为子组件，五个区域(north,south,west,center,east)都用omPanel实现。即每个panel都支持omPanel中的属性设置。</li>
     * 		<li>在omPanel的基础上添加两个个属性：region表示所属区域，resizable表示区域是否可拖拉改变大小。</li>
     * 		<li>左边(west)和右边(east)的面板还可设置expandToTop或者expandToBottom属性分别拉伸面板至顶部或底部。</li>
     * 		<li>可设置每个区域之间的间隔大小。</li>
     * 		<li>可设置borderLayout自动适应父容器的大小。</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#page').omBorderLayout({
     *     panels:[{ 
     *        id:"north-panel", 
     *        title:"This is north panel", 
     *        region:"north", 
     *        resizable:true, 
     *        collapsible:true 
     *    },{ 
     *        id:"center-panel", 
     *        title:"This is center panel", 
     *        region:"center" 
     *    },{ 
     *        id:"west-panel", 
     *        title:"This is west panel", 
     *        region:"west", 
     *        resizable:true, 
     *        collapsible:true, 
     *        width:200 
     *    },{ 
     *        id:"east-panel", 
     *        title:"This is east panel", 
     *        region:"east", 
     *        resizable:true, 
     *        collapsible:true, 
     *        width:100 
     *    }], 
     *    spacing:3 
     * });
     * &lt;/script&gt;
     * 
     * &lt;div id="page" style="width:800px;height:600px;"&gt;
     *	&lt;div id="north-panel" /&gt;
     *	&lt;div id="center-panel" /&gt;
     *	&lt;div id="west-panel" /&gt;
     *	&lt;div id="east-panel" /&gt;
	 * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
(function($) {
	$.omWidget("om.omBorderLayout", {
		options : /** @lends omBorderLayout#*/{
            /**
             * 设置borderlayout每个区域的panel。
             * @name omBorderLayout#panels
             * @default ""
             * @type Array
             * @example
		     *     $('#page').omBorderLayout({
		     *     panels:[{ 
		     *        id:"north-panel", 
		     *        title:"This is north panel", 
		     *        region:"north", 
		     *        resizable:true, 
		     *        collapsible:true 
		     *    },{ 
		     *        id:"center-panel", 
		     *        title:"This is center panel", 
		     *        region:"center" 
		     *    },{ 
		     *        id:"west-panel", 
		     *        title:"This is west panel", 
		     *        region:"west", 
		     *        resizable:true, 
		     *        collapsible:true, 
		     *        width:200 
		     *    },{ 
		     *        id:"east-panel", 
		     *        title:"This is east panel", 
		     *        region:"east", 
		     *        resizable:true, 
		     *        collapsible:true, 
		     *        width:100 
		     *    }], 
		     *    spacing:3 
		     * });
             */
			// panels:"",
            /**
             * 设置面板是否自动充满父容器。
             * @default false
             * @type Boolean
             * @example
             * $('#page').omBorderLayout({fit : true});
             */
			fit : false,
            /**
             * 设置区域的panel之间的间隔。只能设置为数字，单位是px。
             * @default 5
             * @type Number
             * @example
             * $('#page').omBorderLayout({spacing : 3});
             */
			spacing : 5,
            /**
             * 设置是否隐藏panel的header上的收缩按钮，当hideCollapsBtn设置为true且panel为collapsible时收缩/展开的按钮出现在panel之间的分隔条上。
             * @default false
             * @type Boolean
             * @example
             * $('#page').omBorderLayout({hideCollapsBtn : true});
             */			
			hideCollapsBtn : false,
            /**
             * 面板开始拖拽改变大小时触发。
             * @event
             * @type Function
             * @default emptyFn
             * @param element 被拖拽的面板的jquery对象
             * @param event jQuery.Event对象
             * @name omBorderlayout#onBeforeDrag
             * @example
             * $('#page').omBorderLayout({onBeforeDrag : function(element,event){alert("开始拖拽 "+element.attr("region")+" 区域");});
             */
			onBeforeDrag : function(element,event){},
			/**
			 * 面板拖拽改变大小结束时触发。
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param element 被拖拽的面板的jquery对象
			 * @param event jQuery.Event对象
			 * @name omBorderlayout#onAfterDrag
			 * @example
			 * $('#page').omBorderLayout({onAfterDrag : function(element,event){alert("拖拽 "+element.attr("region")+" 区域结束");});
			 */
			onAfterDrag : function(element,event){}
		},
		_create : function() {
			if(!this.options.panels) return;
			// 设置region拖拉改变宽度的最小值
			this._minWidth = 50;
			// 设置region拖拉改变高度的最小值
			this._minHeight = 28;
			this._buildRegion();
			this._resizeRegion(true);
			$(window).resize($.proxy(this, "_resizeRegion"));
		},
		// 获取区域的大小，如果区域被隐藏了则获取代理区域(regionProxy)的大小，如果代理区域也被隐藏则返回0
		_getRegionSize : function(region){
			var $region = this._getRegion(region),
				$proxy = this._getRegionProxy(region),
				size = {};
			size.width = this._regionVisible($region)?$region.outerWidth(true):
				(this._regionVisible($proxy)?$proxy.outerWidth(true):0);
			size.height = this._regionVisible($region)?$region.outerHeight(true):
				(this._regionVisible($proxy)?$proxy.outerHeight(true):0);
			return size;
		},
		_resizeRegion : function(init) {
			var $centerRegion = this._getRegion("center"),
				$northRegion = this._getRegion("north"),
				$southRegion = this._getRegion("south"),
				$westRegion = this._getRegion("west"),
				$eastRegion = this._getRegion("east"),

				$northProxy = this._getRegionProxy("north"),
				$southProxy = this._getRegionProxy("south"),
				$westProxy = this._getRegionProxy("west"),
				$eastProxy = this._getRegionProxy("east"),
				
				northHeight = this._getRegionSize("north").height;
				southHeight = this._getRegionSize("south").height;
				westWidth = this._getRegionSize("west").width;
				eastWidth = this._getRegionSize("east").width;
				centerWidth = this._getRegionSize("center").width;
				layoutWidth = this.element.width();
				layoutHeight = this.element.height();
				
				westOpt = this._getPanelOpts("west");
				eastOpt = this._getPanelOpts("east");
			
			$centerRegion.css({top:northHeight,left:westWidth});
			$centerRegion.find(">.om-panel-body").omPanel("resize",{
				height:layoutHeight - northHeight - southHeight
			});
			// 初始化后需要拖拽动态改变center panel的宽度
			if(!init){
				$centerRegion.find(">.om-panel-body").omPanel("resize",{
					width:layoutWidth - westWidth - eastWidth
				});
			}

			var centerHeight = $centerRegion.outerHeight(true);
			if($northRegion){
				// 根据左右（west、east）两边的面板是否会拉伸至顶部来计算northPanel的宽度
				var northWidth = layoutWidth - (westOpt.expandToTop?westWidth:0) - (eastOpt.expandToTop?eastWidth:0);
				$northRegion.find(">.om-panel-body").omPanel("resize",{width:northWidth});
				$northRegion.css({left:westOpt.expandToTop?westWidth:0});
				if($northProxy){
						$northProxy.outerWidth(northWidth)
								   .css({left:westOpt.expandToTop?westWidth:0});
				}
			}
			if($southRegion){
				// 根据左右（west、east）两边的面板是否会拉伸至底部来计算northPanel的宽度
				var southWidth = layoutWidth - (westOpt.expandToBottom?westWidth:0) - (eastOpt.expandToBottom?eastWidth:0);
				$southRegion.find(">.om-panel-body").omPanel("resize",{width:southWidth});
				$southRegion.css({top:layoutHeight-$southRegion.outerHeight(true),left:westOpt.expandToBottom?westWidth:0});
				if($southProxy){
					$southProxy.outerWidth(southWidth)
							   .css({left:westOpt.expandToBottom?westWidth:0});
				}
			}
			if($westRegion){
				var westTop = westOpt.expandToTop?0:northHeight;
				var westHeight = centerHeight + (westOpt.expandToBottom?southHeight:0) + (westOpt.expandToTop?northHeight:0);
				$westRegion.css({top:westTop});
				$westRegion.find(">.om-panel-body").omPanel("resize",{height:westHeight});
				if($westProxy){
					$westProxy.css({top:westTop});
					$westProxy.outerHeight(westHeight);
				}
			}
			if($eastRegion){
				var eastTop = eastOpt.expandToTop?0:northHeight;
				var eastHeight = centerHeight + (eastOpt.expandToBottom?southHeight:0) + (eastOpt.expandToTop?northHeight:0);
				$eastRegion.css({top:eastTop});
				$eastRegion.find(">.om-panel-body").omPanel("resize",{height:eastHeight});
				if($eastProxy){
					$eastProxy.css({top:eastTop});
					$eastProxy.outerHeight(eastHeight);
				}
			}
			// 初始化的时候如果center或east或west的宽度没有设置则自动调整宽度为自适应
			if(init){
				var fitEastWidth = this._getPanelOpts("east") && !this._getPanelOpts("east").width;
				var fitWestWidth = this._getPanelOpts("west") && !this._getPanelOpts("west").width;
				var fitCenterWidth = !this._getPanelOpts("center").width;
				if(fitEastWidth || fitWestWidth || fitCenterWidth){
					if(!fitCenterWidth && fitEastWidth && fitWestWidth){
						eastWidth = westWidth = (layoutWidth-centerWidth)/2;
					} else if(fitCenterWidth && !fitEastWidth && fitWestWidth){
						centerWidth = westWidth = (layoutWidth-eastWidth)/2;
					} else if(fitCenterWidth && fitEastWidth && !fitWestWidth){
						centerWidth = eastWidth = (layoutWidth-westWidth)/2;
					} else if(fitCenterWidth && fitEastWidth && fitWestWidth){
						eastWidth = westWidth = centerWidth = layoutWidth/3;
					}
				}
				if(fitCenterWidth){
					$centerRegion.find(">.om-panel-body").omPanel("resize",{width:Math.floor(layoutWidth - westWidth - eastWidth)});
				}
				if(fitEastWidth){
					$eastRegion.find(">.om-panel-body").omPanel("resize",{width:Math.ceil(layoutWidth - westWidth - centerWidth) - this.options.spacing});
				}
				if(fitWestWidth){
					$westRegion.find(">.om-panel-body").omPanel("resize",{width:Math.ceil(layoutWidth - eastWidth - centerWidth) - this.options.spacing});
					$centerRegion.css({left:$westRegion.width() + this.options.spacing});
				}
			}
			
		},
		_regionVisible : function($region){
			return $region && $region.css("display") != "none";
		},
		_createRegionProxy : function(panel,showCollapsTrigger){
			var _self = this;
			var proxyHtml = "";
			var $proxy = null;
			if(showCollapsTrigger){
				proxyHtml = "<div class=\"om-borderlayout-proxy om-borderlayout-trigger-proxy-"+panel.region+"\" proxy=\""+panel.region+"\">" +
							"<div class=\"om-borderlayout-expand-trigger\">"+
							"</div>"+
							"</div>";
				$proxy = $(proxyHtml);
				if(panel.region == "west" || panel.region == "east"){
					$proxy.width(_self.options.spacing);
				} else if(panel.region == "north" || panel.region == "south"){
					$proxy.height(_self.options.spacing);
				}
				(function(panel){
					$proxy.find(".om-borderlayout-expand-trigger").click(function(){
						_self.expandRegion(panel.region);
					});
				})(panel);
			} else{
				proxyHtml = "<div class=\"om-borderlayout-proxy om-borderlayout-proxy-"+panel.region+"\" proxy=\""+panel.region+"\">" +
							"<div class=\"om-panel-title\"></div>"+
							"<div class=\"om-panel-tool\">"+
							"<div class=\"om-icon panel-tool-expand\">"+
							"</div>"+
							"</div>"+
							"</div>";
				$proxy = $(proxyHtml);
				(function(panel){
					$proxy.find(".panel-tool-expand").hover(function(){
						$(this).toggleClass("panel-tool-expand-hover");
					}).click(function(){
						_self.expandRegion(panel.region);
					});
				})(panel);
			}
			if ($proxy) {
			    $proxy.hover(function(){
			        $(this).toggleClass("om-borderlayout-proxy-hover");
			    }).appendTo(this.element);
			}
		},
		// 构建布局框架
		_buildRegion : function() {
			var _self = this;
			var $layout = this.element;
			this.element.addClass("om-borderlayout");
			if(this.options.hideCollapsBtn){
				this.element.addClass("om-borderlayout-hide-collaps-btn");
			}
			if (this.options.fit) {
				$layout.css({
					"width" : "100%",
					"height" : "100%"
				});
			}
			for ( var i = 0; i < this.options.panels.length; i++) {
				var panel = $.extend({},this.options.panels[i]);
				var $panelEl = this.element.find("#" + panel.id);
				// 是否在panel之间的间隔上显示收缩/展开panel的trigger按钮
				var showCollapsTrigger = panel.collapsible && _self.options.hideCollapsBtn;
				// 添加代理工具条
				if(panel.collapsible && panel.region != "center"){
					this._createRegionProxy(panel,showCollapsTrigger);
				}
				
				// 扩展panel初始化参数，添加一些必要的事件
				if(panel.collapsible){
					$.extend(panel,{
						collapsible:false
					});
					if(!_self.options.hideCollapsBtn){
						$.extend(panel,{
							tools:[{
								iconCls:["panel-tool-collapse","panel-tool-collapse-hover"],
								handler:function(widget){
									_self.collapseRegion(widget.element.parent().attr("region"));
								}
							}]
						});
					}
				}
				if(panel.closable){
					var oldPanelOnClose = panel.onClose;
					$.extend(panel,{
						onClose:function(){
							oldPanelOnClose && oldPanelOnClose.call($panelEl[0]);
							_self._resizeRegion();
						}
					});
				}
				
				
				// 构建panel组件
				$panelEl.omPanel(panel);
				
				// 初始化north和south的宽度
				if(panel.region == "north" || panel.region == "south"){
					$panelEl.omPanel("resize",{"width":$layout.width()});
				}
				
				var margin = "0",
					spacing = this.options.spacing + "px";
				// 给panel添加resize功能
				if(panel.resizable && panel.region != "center"){
					var handles = "";
						handleClass = {};
					if(panel.region == "west"){
						handles = "e";
						handleClass.width = spacing;
						handleClass.right = "-" + spacing;
					} else if(panel.region == "east"){
						handles = "w";
						handleClass.width = spacing;
						handleClass.left = "-" + spacing;
					} else if(panel.region == "south"){
						handles = "n";
						handleClass.height = spacing;
						handleClass.top = "-" + spacing;
					} else if(panel.region == "north"){
						handles = "s";
						handleClass.height = spacing;
						handleClass.bottom = "-" + spacing;
					}
					$panelEl.parent().omResizable({
						handles : handles,
						helper : "om-borderlayout-resizable-helper-" + handles,
						stop : function(ui,event){
							$layout.find(">.om-borderlayout-mask").remove();
							ui.element.find(">.om-panel-body").omPanel("resize",ui.size);
							_self._resizeRegion();
							// 监听拖拽改变panel大小的事件
							_self.options.onAfterDrag && _self._trigger("onAfterDrag",null,ui.element);
						},
						start : function(ui,event){
							var helper = ui.element.omResizable("option","helper");
							// 修改resizable的helper的宽/高为spacing大小
							$("body").find("." + helper).css("border-width",_self.options.spacing);
							// 限制拖拉改变大小的范围
							var region = ui.element.attr("region"),
								maxWidth = $layout.width() - 2*_self._minWidth,
								maxHeight = $layout.height() - 2*_self._minHeight;
							if(region == "west"){
								maxWidth = $layout.width() - (_self._getRegionSize("east").width + _self._minWidth);
								ui.element.omResizable( "option", "maxWidth", maxWidth );
							} else if(region == "east"){
								maxWidth = $layout.width() - (_self._getRegionSize("west").width + _self._minWidth);
								ui.element.omResizable( "option", "maxWidth", maxWidth );
							} else if(region == "north"){
								maxHeight = $layout.height() - (_self._getRegionSize("south").height + _self._minHeight + _self.options.spacing);
								ui.element.omResizable( "option", "maxHeight", maxHeight );
							} else if(region == "south"){
								maxHeight = $layout.height() - (_self._getRegionSize("north").height + _self._minHeight + _self.options.spacing);
								ui.element.omResizable( "option", "maxHeight", maxHeight );
							}
							$('<div class="om-borderlayout-mask"></div>').css({
								width:$layout.width(),
								height:$layout.height()
							}).appendTo($layout);
							// 监听拖拽改变panel大小的事件
							_self.options.onBeforeDrag && _self._trigger("onBeforeDrag",null,ui.element);
						},
						minWidth : _self._minWidth,
						minHeight : _self._minHeight
						
					});
					$panelEl.parent().find(".om-resizable-handle").css(handleClass);
					margin = (panel.region == "south" ? spacing : 0) + " " +
							 (panel.region == "west" ? spacing : 0) + " " +
							 (panel.region == "north" ? spacing : 0) + " " +
							 (panel.region == "east" ? spacing : 0);
					
					// 如果隐藏收缩panel的按钮，则在panel之间的间隔条上显示收缩/展开trigger按钮
					if(showCollapsTrigger){
						var $collapsTrigger = $("<div class='om-borderlayout-collaps-trigger-"+panel.region+"'></div>");
						(function($panel){$collapsTrigger.click(function(){
							_self.collapseRegion($panel.attr("region"));
						});})($panelEl.parent());
						$panelEl.parent().find(".om-resizable-handle").append($collapsTrigger);
					}
				}
				
				$panelEl.parent()
					   .addClass("om-borderlayout-region")
					   .addClass("om-borderlayout-region-" + panel.region)
					   .css("margin",margin)
					   .attr("region",panel.region);
				//添加样式使borderlayout中使用panel样式和borderlayout中内嵌的panel body样式区分。以防发生样式覆盖的问题。
				$panelEl.addClass("om-borderlayout-region-body");
				//添加header class用来区别borderlayout和borderlayout中内嵌的panel使用的tools 图片
				$panelEl.prev().addClass("om-borderlayout-region-header");
			}
		},
		_getRegion : function(region){
			var $regionEl = this.element.find(">[region=\""+region+"\"]");
			return $regionEl.length>0?$regionEl:false;
		},
		_getRegionProxy : function(region){
			var $proxyEl = this.element.find(">[proxy=\""+region+"\"]");
			return $proxyEl.length>0?$proxyEl:false;
		},
		_getPanelOpts : function(region){
			for(var i = 0; i < this.options.panels.length; i++){
				if(region == this.options.panels[i].region){
					return this.options.panels[i];
				}
			}
			return false;
		},
        /**
         * 折叠某个区域的panel。
         * @name omBorderLayout#collapseRegion
         * @function
         * @param region 区域名称
         * @example
         * //折叠north区域的panel
         * $('#page').omBorderLayout('collapseRegion', 'north');
         */
		collapseRegion : function(region){
			var panel = this._getPanelOpts(region);
			if(!panel || !panel.collapsible){
				return;
			}
			var $region = this._getRegion(region);
				$body = $region.find(">.om-panel-body");
			if($region){
				var panelInstance = $.data($body[0],"omPanel");
				if(panelInstance.options.closed) return;
				if(panel.onBeforeCollapse && panelInstance._trigger("onBeforeCollapse") === false){
					return false;
				}
				$region.hide();
				panel.onCollapse && panelInstance._trigger("onCollapse");
				this._getRegionProxy(region).show();
				this._resizeRegion();
			}
		},
		/**
		 * 展开某个区域的panel。
		 * @name omBorderLayout#expandRegion
		 * @function
		 * @param region 区域名称
		 * @example
		 * //展开north区域的panel
		 * $('#page').omBorderLayout('expandRegion', 'north');
		 */
		expandRegion : function(region){
			var panel = this._getPanelOpts(region);
			if(!panel || !panel.collapsible){
				return;
			}
			var $region = this._getRegion(region);
				$body = $region.find(">.om-panel-body");
			if($region){
				var panelInstance = $.data($body[0],"omPanel");
				if(panelInstance.options.closed) return;
				if(panel.onBeforeExpand && panelInstance._trigger("onBeforeExpand") === false){
					return false;
				}
				$region.show();
				panel.onExpand && panelInstance._trigger("onExpand");
				this._getRegionProxy(region).hide();
				this._resizeRegion();
			}
		},
		/**
		 * 关闭某个区域的panel。
		 * @name omBorderLayout#closeRegion
		 * @function
		 * @param region 区域名称
		 * @example
		 * //关闭north区域的panel
		 * $('#page').omBorderLayout('closeRegion', 'north');
		 */
		closeRegion : function(region){
			var panel = this._getPanelOpts(region);
			if(!panel || !panel.closable){
				return;
			}
			var $region = this._getRegion(region);
				$body = $region.find(">.om-panel-body");
			if($region){
				var panelInstance = $.data($body[0],"omPanel");
				if(panelInstance.options.closed) return;
				
				$region.find(">.om-panel-body").omPanel("close");
				this._getRegionProxy(region).hide();
				this._resizeRegion();
			}
		},
		/**
		 * 打开某个区域的panel。
		 * @name omBorderLayout#openRegion
		 * @function
		 * @param region 区域名称
		 * @example
		 * //打开north区域的panel
		 * $('#page').omBorderLayout('openRegion', 'north');
		 */
		openRegion : function(region){
			var panel = this._getPanelOpts(region);
			if(!panel || !panel.closable){
				return;
			}
			var $region = this._getRegion(region);
				$body = $region.find(">.om-panel-body");
			if($region){
				var panelInstance = $.data($body[0],"omPanel");
				if(!panelInstance.options.closed) return;
				
				$region.find(">.om-panel-body").omPanel("open");
				this._getRegionProxy(region).hide();
				this._resizeRegion();
			}
		}

	});
})(jQuery);