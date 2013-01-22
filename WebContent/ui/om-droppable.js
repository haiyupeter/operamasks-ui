/*
 * $Id: om-droppable.js,v 1.12 2012/03/15 07:16:12 wangfan Exp $
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
 *	om-draggable.js
 */
/** 
     * @name omDroppable
     * @class 用来提供放置功能。<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>轻量级，简单易用。</li>
     * 		<li>可定义放置元素的范围。</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#selector').omDroppable();
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

$.omWidget("om.omDroppable", {
	widgetEventPrefix: "drop",
	options: {
		/**
         * 指定可以接受的拖动元素，默认任意元素都可以被接受。
         * @name omDroppable#accept
         * @type Selector，function
         * @default "*"
         * @example
         * //只接受id为draggable的元素
         * $("#selector").omDroppable({accept:"#draggable"});
         */
		accept: '*',
		/**
         * 当可接受的元素被拖动时，添加到droppable元素上的样式。
         * @name omDroppable#activeClass
         * @type String
         * @default 无
         * @example
         * $("#selector").omDroppable({activeClass:"om-state-highlight"});
         */
		activeClass: false,
		/**
         * 指定是否在嵌套的droppable元素中阻止事件传播，默认为false，不阻止事件传播；反正为true时，阻止事件传播。
         * @name omDroppable#greedy
         * @type Boolean
         * @default false
         * @example
         * $("#selector").omDroppable({greedy:true});
         */
		greedy: false,
		/**
         * 当可接受的元素悬停在droppable元素上时，添加到droppable元素上的样式。
         * @name omDroppable#hoverClass
         * @type String
         * @default 无
         * @example
         * $("#selector").omDroppable({hoverClass:"om-state-hover"});
         */
		hoverClass: false,
		_scope: 'default'
		/**
		 * 设置放置功能是否可用。
		 * @name omDroppable#disabled
         * @type Boolean
         * @default false
         * @example
         * $("#selector").omDroppable({disabled:true});
         */
		
		/**
         * 可接受的元素开始拖动时触发事件。
         * @event
         * @param source 被拖动的Dom元素。
         * @param event jQuery.Event对象。
         * @name omDroppable#onDragStart
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDragStart : function(source, event) {doSomething...}});
         */
			
		/**
         * 拖动元素可以放置时触发事件。
         * @event
         * @param source 被拖动的Dom元素。
         * @param event jQuery.Event对象。
         * @name omDroppable#onDragOver
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDragOver : function(source, event) {doSomething...}});
         */
			
		/**
         * 拖动元素移出可放置位置时触发事件。
         * @event
         * @param source 被拖动的Dom元素。
         * @param event jQuery.Event对象。
         * @name omDroppable#onDragOut
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDragOut : function(source, event) {doSomething...}});
         */
		
		/**
         * 拖动的元素成功放置时触发事件。
         * @event
         * @param source 被拖动的Dom元素。
         * @param event jQuery.Event对象。
         * @name omDroppable#onDrop
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDrop : function(source, event) {doSomething...}});
         */
	},
	_create: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.om.ddmanager.droppables[o._scope] = $.om.ddmanager.droppables[o._scope] || [];
		$.om.ddmanager.droppables[o._scope].push(this);

		this.element.addClass("om-droppable");

	},
	
	/**
     * 删除元素的放置功能。
     * @name omDroppable#destroy
     * @function
     * @returns JQuery对象
     * @example
     * var $selector = $("#selector").omDroppable('destroy');
     * 
     */
	destroy: function() {
		var drop = $.om.ddmanager.droppables[this.options._scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element
			.removeClass("om-droppable om-droppable-disabled")
			.removeData("omDroppable")
			.unbind(".droppable");

		return this;
	},

	_setOption: function(key, value) {

		if(key == 'accept') {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.OMWidget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.om.ddmanager.current;
		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
		(draggable && this._trigger('onDragStart', event, draggable.currentItem || draggable.element));
	},

	_deactivate: function(event) {
		var draggable = $.om.ddmanager.current;
		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
		//(draggable && this._trigger('onDeactivate', event, draggable.currentItem || draggable.element));
	},

	_over: function(event) {

		var draggable = $.om.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
			this._trigger('onDragOver', event, draggable.currentItem || draggable.element);
		}

	},

	_out: function(event) {

		var draggable = $.om.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('onDragOut', event, draggable.currentItem || draggable.element);
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.om.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(omDroppable)").not(".om-draggable-dragging").each(function() {
			var inst = $.data(this, 'omDroppable');
			if(
				inst.options.greedy
				&& !inst.options.disabled
				&& inst.options._scope == draggable.options._scope
				&& inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
				&& $.om.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }))
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) return false;

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('onDrop', event, draggable.currentItem || draggable.element);
			return this.element;
		}

		return false;

	}

});


$.om.intersect = function(draggable, droppable) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;
	return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
		&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
		&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
		&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
};

/*
	This manager tracks offsets of draggables and droppables
*/
$.om.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.om.ddmanager.droppables[t.options._scope] || [];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(omDroppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.om.ddmanager.droppables[draggable.options._scope] || [], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.om.intersect(draggable, this))
				dropped = dropped || this._drop.call(this, event);

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if( !draggable.options.refreshPositions ) $.om.ddmanager.prepareOffsets( draggable, event );
		});
	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.om.ddmanager.prepareOffsets(draggable, event);

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.om.ddmanager.droppables[draggable.options._scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.om.intersect(draggable, this);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents(':data(omDroppable):eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'omDroppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if( !draggable.options.refreshPositions ) $.om.ddmanager.prepareOffsets( draggable, event );
	}
};

})(jQuery);
