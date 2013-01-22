/*
 * $Id: om-scrollbar.js,v 1.9 2012/06/18 02:55:14 chentianzhen Exp $
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
	/**
      * @name omScrollbar
      * @class
      * 自定义滚动条，可用于取代浏览器自带的滚动条。<br/>
      * <br/>
      * <b>特点：</b><br/><br/>
      * <ul>
      *     <li>使用简单，它会自动管理滚动条的状态，包括显示与隐藏，滚动条的大小等。</li>
      * </ul>
      * <b>说明：</b><br/><br/>
      * <p>
      * 	滚动条的使用非常简单，比如页面上已经存在一个div,那么给这个div创建滚动条只需要写上如下代码:<br/>
      * 	$(".selector").omScrollbar();<br/>
      * </p>
      * <p>
      * 	有一个要特别注意的地方就是，如果把鼠标移到目标元素上边时出现了滚动条，然后鼠标在目标元素内操作致使目标元素的大小不足以出现滚动条，这时候滚动条是不会自行消失的，
      * 这是一个时机问题，只有当鼠标再次移到目标元素上时滚动条的状态才会改变修正。为了解决此问题，你可以监听目标元素内某个节点的事件，然后调用refresh方法即时刷新滚动条的状态。
      * </p>
      * @constructor
      * @description 构造函数
      * @param p 标准config对象:{}
      */
	$.omWidget("om.omScrollbar" , {
		options:/** @lends omScrollbar#*/{
			/**
             * 滚动条的厚度，单位为像素。
             * @default 8
             * @type Number
             * @example
             * $('.selector').omScrollbar({thick:20});
             */
			thick : 8
		},
		
		_create : function(){
			var ops = this.options;
			this._vScrollbar = $("<div class='om-widget om-scrollbar om-corner-all'></div>").width(ops.thick).appendTo("body").hide();
			this._vScrollbar.type = "v";
			this._hScrollbar = $("<div class='om-widget om-scrollbar om-corner-all'></div>").height(ops.thick).appendTo("body").hide();
			this._hScrollbar.type = "h";
		},
		
		_init : function(){
			this.element.css("overflow" , "hidden");
			this._buildEvent();
		},
		
		destroy : function(){
			this._vScrollbar.remove();
			this._hScrollbar.remove();
		}, 
		
		_buildEvent : function(){
			var self = this,
				$elem = this.element,
				bars = [this._vScrollbar , this._hScrollbar];
				
			$(bars).each(function(index , $bar){
				$bar._hover = false;
				$bar._enable = true;
				
				var type = $bar.type;
				
				var startPos = 0;
				$bar.omDraggable({
					axis : type==='v'? "y":"x",
					containment: $elem,
					onStart : function(ui , event){
						startPos = type==='v'? $elem.scrollTop() : $elem.scrollLeft();
					},
					onDrag: function(ui, event){
						var p = ui.position,
							op = ui.originalPosition;
						type == 'v'?
							$elem.scrollTop( startPos + self._getInt( (p.top-op.top)*$elem.innerHeight()/$bar.outerHeight()) )
							:$elem.scrollLeft( startPos + self._getInt( (p.left-op.left)*$elem.innerWidth()/$bar.outerWidth()) );
					}
				}).hover(function(){
					$(bars).each(function(index , $bar){
						$bar._hover = true;
						clearTimeout($bar._timer);
					});
					$(this).addClass("scrollbar-state-hover");
				},
				function(){
					$(bars).each(function(index , $bar){
						$bar._hover = false;
						self._setTimer($bar.type);
					});
					$(this).removeClass("scrollbar-state-hover");
				});
			});
			
			//给垂直滚动条绑定鼠标滑轮滚动事件
			var eventName = $.browser.mozilla? "DOMMouseScroll" : "mousewheel";
			$elem.bind(eventName , function(e){self._mousewheelListener.call(self,e);});
				$(bars).each(function(index , $bar){
					$bar.bind(eventName , function(e){self._mousewheelListener.call(self,e);});
				});

			$elem.hover(function(){
				$(bars).each(function(index , $bar){
					$bar._hover = true;
					clearTimeout($bar._timer);
					self._resize($bar);
					if($bar._enable){
						$bar.fadeIn("fast");						
					}
				});
			},function(){
				$(bars).each(function(index , $bar){
					$bar._hover = false;
					self._setTimer($bar.type);
				});
			});
		},

		_mousewheelListener : function(event){
			var self = this;
			if(!self._vScrollbar._enable){
				return ;
			}
			
			//在IE中，滚轮向后，wheelDelta = -120(倍数)
			//在FF中，滚轮向后，event.detail = 3(倍数)
			//进行处理，统一为 滚轮向后，120(倍数)，滚动向前,-120(倍数)
			var delta = 0;
			if (event.wheelDelta) {
	            delta = -event.wheelDelta;
	        } else {
	            delta = event.detail * 40;
	        }
	        
	        //每一份(120)表示5个象素点
	        //滚动条此次滚动了多少个像素
	        var differ = delta / 120 * 10, 
	        	$bar = self._vScrollbar,
	        	$elem = self.element,
	        	elemTop = $elem.offset().top + self._getInt($elem.css("border-top-width")) + self._getInt($elem.css("padding-top")) + self._getInt($elem.css("padding-top-width")),
	        	barCurTop = $bar.position().top - elemTop,//滚动条相对于目标元素的内容区域的top
	        	contentHeight = $elem.height(),
	        	distance = contentHeight - $bar.outerHeight();//滚动条最大滚动距离
	        	
	        
	        if(differ + barCurTop < 0){
	        	$bar.css("top" , elemTop);
	        	$elem.scrollTop(0);
	        }else if(differ + barCurTop > distance){
	        	$bar.css("top" , elemTop + distance);
	        	$elem.scrollTop( $elem[0].scrollHeight - $elem.height());
	        }else{
	        	$bar.css("top" , "+="+differ );
	        	$elem.scrollTop( $elem.scrollTop() + parseInt(differ * $elem.innerHeight()/$bar.outerHeight()) );
	        }
	        event.preventDefault();
		},
		
		_getScrollbar : function(type){
			return 'h' === type? this._hScrollbar : this._vScrollbar;
		},
		
		_setTimer : function(type){
			var self = this;
			clearTimeout(this._getScrollbar(type)._timer);
			(function(type){
				setTimeout(function(){
					var $bar = self._getScrollbar(type);
					if(!$bar._hover){
						$bar.fadeOut("fast");					
					}
				} , 200);
			})(type);
		},
		/**
		 * 刷新滚动条。当进入目标元素时，如果目标元素内容区域过长，会出现滚动条，但如果此时用鼠标进行操作使得目标元素内容过小而不应该出现滚动条，
		 * 这时候滚动条是不会自己消失的，要调用此方法进行刷新。
		 * @name omScrollbar#refresh
		 * @function
		 */
		refresh : function(){
			var bars = [this._vScrollbar , this._hScrollbar],
				self = this;
			$(bars).each(function(index , $bar){
				self._resize($bar);
			});
		},
		
		_resize : function($bar){
			var $elem = this.element,
				type = $bar.type,
				size = 0,
				offset = $elem.offset(),
				w = $elem.width(),
				h = $elem.height(),
				ow = $elem.outerWidth(),
				oh = $elem.outerHeight(),
				bl = this._getInt($elem.css("border-left-width")),
				br = this._getInt($elem.css("border-right-width")),
				bt = this._getInt($elem.css("border-top-width")),
				bb = this._getInt($elem.css("border-bottom-width")),
				pl = this._getInt($elem.css("padding-left")),
				pt = this._getInt($elem.css("padding-top"));
				
			if('v' === type){
				size = $elem[0].scrollHeight;
				if(size > h){
					$bar._enable = true;
					$bar.outerHeight( this._getInt(h*$elem.innerHeight()/size) );
					
					$bar.css({
						"left" : offset.left + ow - $bar.outerWidth() - br,
						"top" : offset.top + bt + pt  + this._getInt($elem.scrollTop() * h/ size)
					});
				}else{
					$bar._enable = false;
				}
			}else if('h' === type){
				size = $elem[0].scrollWidth;
				if(size > $elem.innerWidth()){
					$bar._enable = true;
					$bar.outerWidth( this._getInt((pl+w)*w/size) );
					$bar.css({
						"left" : offset.left + bl + pl + this._getInt($elem.scrollLeft()*w/ size),
						"top" : offset.top + oh - $bar.outerHeight() - bb
					});
				}else{
					$bar._enable = false;
				}
			}
			$bar._enable? $bar.fadeIn("fast") : $bar.fadeOut("fast");
		},
		
		_getInt : function(number){
			return parseInt(number) || 0;
		}
	});
})(jQuery);