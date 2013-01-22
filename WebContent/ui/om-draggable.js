/*
 * $Id: om-draggable.js,v 1.17 2012/03/29 06:03:09 chentianzhen Exp $
 * operamasks-ui omTree @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *	om-core.js
 *	om-mouse.js
 */
/** 
     * @name omDraggable
     * @class 用来提供拖动功能.<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>轻量级，简单易用。</li>
     * 		<li>可限制拖动的范围及方向。</li>
     * 		<li>可自定义鼠标在拖动时的样式。</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#selector').omDraggable();
     * });
     * &lt;/script&gt;
     * 
     * &lt;div id="selector"&gt;
	 * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
;(function( $, undefined ) {

$.omWidget("om.omDraggable", $.om.omMouse, {
	widgetEventPrefix: "drag",
	options: {
		/**
         * 指定拖动的方向,提供的取值有“x”，“y”，默认不指定方向，可以任意拖动。
         * @name omDraggable#axis
         * @type String
         * @default 无
         * @example
         * //只能沿着x轴的方向拖动
         * $("#selector").omDraggable({axis:"x"});
         */
		axis: false,
		/**
         * 设置拖动的范围,不能拖动到该范围以外的地方，默认不指定拖动的范围，可以任意拖动。
         * 其值可以是：“parent”、“document”、“window”、[x1,y1,x2,y2]等。
         * @name omDraggable#containment
         * @type Selector,Element,String,Array
         * @default 无
         * @example
         * //只能在上一级父元素范围内拖动
         * $("#selector").omDraggable({containment:"parent"});
         */
		containment: false,
		/**
         * 设置鼠标拖动时的样式。其值为CSS中cursor属性的取值。
         * @name omDraggable#cursor
         * @type String
         * @default “auto”
         * @example
         * //拖动元素时，鼠标呈现十字状
         * $("#selector").omDraggable({cursor:"crosshair"});
         */
		cursor: "auto",
		/**
         * 不能启动拖动操作的区域。
         * @name omDraggable#cancel
         * @type Selector
         * @default :input,option
         * @example
         * //$("#selector")的子元素的&lt;p /&gt不能能够启动拖动操作
         * $("#selector").omDraggable({cancel:"p"});
         */
		_scope:"default",
		/**
         * 能够启动拖动操作的区域，默认不指定区域，拖动元素内的所有区域都可以启动拖动操作。
         * @name omDraggable#handle
         * @type Selector
         * @default 无
         * @example
         * //只有$("#selector")的子元素的&lt;p /&gt内才能够启动拖动操作
         * $("#selector").omDraggable({handle:"p"});
         */
		handle: false,
		/**
         * 提供一个辅助的元素作为元素被拖动时的展现，默认为被拖动元素本身作为拖动时的展现元素。
         * @name omDraggable#helper
         * @type String,function
         * @default "original"
         * @example
         * //$("#selector")的clone元素将作为辅助元素
         * $("#selector").omDraggable({helper:"clone"});
         */
		helper: "original",
		/**
         * 设置当拖动结束后，元素是否会返回到初始位置。默认为false，不会返回；反之为true时，返回到初始位置。
         * String类型的取值有：“valid”，“invalid”。如果该值为“invalid”，则当元素没有拖动到目的位置时返回；反之为“valid”
         * 时，当元素拖动到目的位置返回。
         * @name omDraggable#revert
         * @type Boolean,String
         * @default false
         * @example
         * //元素没有拖动到目的位置时，返回到原位。
         * $("#selector").omDraggable({revert:"invalid"});
         */
		revert: false,
		/**
		 * 是否可拖动。
		 * @name omDraggable#disabled
         * @type Boolean
         * @default false
         * @example
         * //元素不可拖动
         * $("#selector").omDraggable({disabled:true});
         */

		/**
		 * 拖动元素时，是否自动滚屏。
		 * @name omDraggable#scroll
         * @type Boolean
         * @default true
         * @example
         * //拖动元素时，不自动滚屏
         * $("#selector").omDraggable({scroll:false});
         */
		scroll: true
		
		/**
         * 开始拖动时触发事件。
         * @event
         * @param ui Objec对象。包括四个属性：helper，position(当前位置)，originalPosition(原始位置)，offset(偏移量)
         * @param event jQuery.Event对象。
         * @name omDraggable#onStart
         * @type Function
         * @example
         *   $("#selector").omDraggable({onStart : function(ui, event) {doSomething...}});
         */
		
		/**
         * 拖动时触发事件，当返回为false时，将取消拖动操作。
         * @event
         * @param ui Objec对象。包括四个属性：helper，position(当前位置)，originalPosition(原始位置)，offset(偏移量)
         * @param event jQuery.Event对象。
         * @name omDraggable#onDrag
         * @type Function
         * @example
         *   $("#selector").omDraggable({onDrag : function(ui, event) {doSomething...}});
         */
		
		/**
         * 停止拖动时触发事件。
         * @event
         * @param ui Objec对象。包括四个属性：helper，position(当前位置)，originalPosition(原始位置)，offset(偏移量)
         * @param event jQuery.Event对象。
         * @name omDraggable#onStop
         * @type Function
         * @example
         *   $("#selector").omDraggable({onStop : function(ui, event) {doSomething...}});
         */
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		this.element.addClass("om-draggable");
		(this.options.disabled && this.element.addClass("om-draggable-disabled"));

		this._mouseInit();

	},

	/**
     * 删除元素的拖动功能.
     * @name omDraggable#destroy
     * @function
     * @returns JQuery对象
     * @example
     * var $selector = $("#selector").omDraggable('destroy');
     * 
     */
	destroy: function() {
		if(!this.element.data('omDraggable')) return;
		this.element
			.removeData("omDraggable")
			.unbind(".draggable")
			.removeClass("om-draggable"
				+ " om-draggable-dragging"
				+ " om-draggable-disabled");
		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.om-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;
		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.om.ddmanager)
			$.om.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("onStart", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.om.ddmanager && !o.dropBehaviour)
			$.om.ddmanager.prepareOffsets(this, event);

		this.helper.addClass("om-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		
		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.om.ddmanager ) $.om.ddmanager.dragStart(this, event);
		
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('onDrag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.om.ddmanager) $.om.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.om.ddmanager && !this.options.dropBehaviour)
			dropped = $.om.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}
		
		//if the original element is removed, don't bother to continue if helper is set to "original"
		if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, 500, function() {
				if(self._trigger("onStop", event) !== false) {
					self._clear();
				}
			});
		} else {
			if(this._trigger("onStop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},
	
	_mouseUp: function(event) {
		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.om.ddmanager ) $.om.ddmanager.dragStop(this, event);
		
		return $.om.omMouse.prototype._mouseUp.call(this, event);
	},
	
	cancel: function() {
		
		if(this.helper.is(".om-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}
		
		return this;
		
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

		if(!helper.parents('body').length)
			helper.appendTo( this.element[0].parentNode);

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
		        var c = $(o.containment);
			var ce = c[0]; if(!ce) return;
			var co = c.offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
			this.relative_container = c;

		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
		         var containment;
		         if(this.containment) {
				 if (this.relative_container){
				     var co = this.relative_container.offset();
				     containment = [ this.containment[0] + co.left,
						     this.containment[1] + co.top,
						     this.containment[2] + co.left,
						     this.containment[3] + co.top ];
				 }
				 else {
				     containment = this.containment;
				 }

				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("om-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.om.ddmanager) $.om.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.om.plugin.call(this, type, [event, ui]);
		if(type == "onDrag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.OMWidget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.om.plugin.add("omDraggable", "cursor", {
	onStart: function(ui, event) {
		var t = $('body'), o = $(this).data('omDraggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	onStop: function(ui, event) {
	    var drag = $(this).data('omDraggable');
	    if(drag){
	        var o = drag.options;
	        if (o._cursor) $('body').css("cursor", o._cursor);
	    }
	}
});

$.om.plugin.add("omDraggable", "scroll", {
	onStart: function(ui, event) {
		var i = $(this).data("omDraggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	onDrag: function(ui, event) {
		
		var i = $(this).data("omDraggable"), o = i.options, scrolled = false, scrollSensitivity = 20, scrollSpeed = 20;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + scrollSpeed);
			}

		}

		if(scrolled !== false && $.om.ddmanager && !o.dropBehaviour)
			$.om.ddmanager.prepareOffsets(i, event);

	}
});

})(jQuery);
