/*
 * $Id: om-progressbar.js,v 1.14 2012/03/15 06:14:47 linxiaomin Exp $
 * operamasks-ui omProgressbar @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-core.js
 */
/** 
 * @name omProgressbar
 * @class 进度条一般用来呈现任务完成的进度情况。<br/>
 * <b>示例：</b><br/>
 * <pre>
 * &lt;script type="text/javascript" &gt;
 * $(document).ready(function() {
 *     $('#selector').omProgressbar({
 *         value : 30
 *     });
 * });
 * &lt;/script&gt;
 * 
 * &lt;div id="selector" /&gt;
 * </pre>
 * @constructor
 * @description 构造函数. 
 * @param p 标准config对象：{}
 * @example
 * $('#selector').omProgressbar();
 */
;(function($) {
	
$.omWidget("om.omProgressbar", {
		
	options: /**@lends omProgressbar#*/{
		/**
         * 进度值，默认值为0，最大值为100
         * @type Number
         * @default 0
         * @example
         * $("#selector").omProgressbar({value:50});
         */
		value: 0,
		
		/**
         * 提示内容，默认的内容格式为{value}%，如当进度值为30时，显示的文本为30%; 并且支持方法自定义提示内容，
         * 方法提供一个参数为当前的进度值，返回值为提示内容。
         * @type String, Function
         * @default "{value}%"
         * @example
         * $("#selector").omProgressbar({text: "已完成{value}%"});
         */
		text: "{value}%",
		/**
         * 设置进度条的宽度,单位为像素,默认值为"auto"自适应宽度。
         * @type Number,String
         * @default auto
         * @example
         * $("#selector").omProgressbar({width: 300});
         */
		width: "auto",
		
		max: 100
	},

	min: 0,

	_create: function() {
	    var $ele = this.element;
		$ele.addClass( "om-progressbar om-widget om-widget-content om-corner-all" );
        this.textDiv = $("<div class='om-progressbar-text'></div>").appendTo($ele);
		this.valueDiv = $( "<div class='om-progressbar-value om-widget-header om-corner-left'></div>" )
			.appendTo( $ele );
	},
	
	_init : function() {
	    var width = this.element.width();
	    if( typeof(this.options.width) == "number" ){
            width = this.options.width;
            this.element.width(width);
        }
	    
	    this.textDiv.width(Math.floor(width));
	    this.oldValue = this._value();
        this._refreshValue();
	}, 
	/**
     * 获取或者设置进度值。没有传入参数时，该方法为获取当前进度值，反之，则设置当前进度值。
     * @name omProgressbar#value
     * @param newValue Number对象 设置进度值
     * @function
     * @example
     * $("#selector").omProgressbar('value', '30');
     * 
     */
	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this.options.value = newValue;
        this._refreshValue();
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		return 100 * this._value() / this.options.max;
	},

	_refreshValue: function() {
		var self = this, value = self.value(), onChange = self.options.onChange;
		var percentage = self._percentage();
		var text = self.options.text, label = "";

		self.valueDiv
			.toggle( value > self.min )
			.toggleClass( "om-corner-right", value === self.options.max )
			.width( percentage.toFixed(0) + "%" );
		
		if(typeof(text) == "function"){
			label = text.call(value,value);
		}else if(typeof(text) == "string"){
			label = text.replace("{value}", value);
		}
		self.textDiv.html(label);
		
		if ( self.oldValue !== value ) {
			onChange && self._trigger("onChange",null,value,self.oldValue);
			self.oldValue = value;
		}
	}
});
/**
 * 进度值改变触发事件。
 * @event
 * @name omProgressbar#onChange
 * @param newValue 改变后进度值
 * @param oldValue 改变前进度值
 * @param event jQuery.Event对象
 * @example
 *  $("#selector").omProgressbar({
 *      onChange: function(newValue, oldValue, event){ ... }
 *  });
 */
})(jQuery);