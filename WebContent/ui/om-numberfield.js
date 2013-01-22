/*
 * $Id: om-numberfield.js,v 1.70 2012/06/26 06:31:06 wangfan Exp $
 * operamasks-ui omNumberField @VERSION
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
(function($) {
    
    // 设置小数精度
    var fixPrecision = function(value, c, p) {
        var v = value.indexOf(".");       
        if (isNaN(value) && value != ".") {
            for (; isNaN(value);) {
                value = value.substring(0, value.length - 1);
            }
        }
        if(!p.allowNegative && value.indexOf("-")!= -1){
        	var array=value.split("-");
        	value=array.join("");
        }
        if(!p.allowDecimals&&v!=-1 || value.charAt(value.length-1)==='.'){
            return value.substring(0, v);
         }
        if(v!=-1){
            value=value.substring(0,v+p.decimalPrecision+1);
        }
        return value.length > 0 ? parseFloat(value) : "";
    };

    /** 
     * @name omNumberField
     * @class 数字输入框组件，只能输入数字，字符自动过滤掉。<br/>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     * @example
     * $('numberFielddiv').omNumberField({decimalPrecision:3});
     */
    $.omWidget("om.omNumberField", {
        options: /** @lends omNumberField.prototype */ 
        {
            /**
             * 是否允许输入小数。
             * @default true
             * @type Boolean
             * @example
             * $('#input').omNumberField({allowDecimals:true});
             */
            allowDecimals: true,  //是否允许输入小数
            /**
             * 是否允许输入负数。
             * @default true
             * @type Boolean
             * @example
             * $('#input').omNumberField({allowNegative:true});
             */
            allowNegative: true,  //是否允许输入负数
            /**
             * 精确到小数点后几位。
             * @default 2
             * @type Number
             * @example
             * $('#input').omNumberField({decimalPrecision:2});
             */
            decimalPrecision: 2, //精确到小数点后几位
            /**
             * 是否禁用组件。
             * @default false
             * @type Boolean
             * @example
             * $('#input').omNumberField({disabled:true});
             */
            disabled: false,
            /**
             * 在输入框失去焦点时触发的方法。
             * @event
             * @param value 当前输入框的值
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             * $('#input').omNumberField({onBlur:function(value,event){alert('now the value is'+value);}});
             */
            onBlur: function(value){},
            /**
             * 是否只读。
             * @default false
             * @type Boolean
             * @example
             * $('#input').omNumberField({readOnly:true});
             */
            readOnly: false            
        },

        _create : function() {
            // 允许输入的字符
            var options = this.options,
            	self = this;
            this.element.addClass("om-numberfield om-widget om-state-default om-state-nobg")
            			.css("ime-mode" , "disabled");
			
            this.element.keypress(function(e) {
                if (e.which == null && (e.charCode != null || e.keyCode != null)) {
                    e.which = e.charCode != null ? e.charCode : e.keyCode;
                }
                var k = e.which;
                if (k === 8 || (k == 46 && e.button == -1) || k === 0) {
                    return;
                }
                var character = String.fromCharCode(k);
                $.data(this,"character",character);
                var allowed = $.data(this, "allowed");
                if (allowed.indexOf(character) === -1||($(this).val().indexOf("-") !== -1 && character == "-")
                        || ($(this).val().indexOf(".") !== -1 && character == ".")) {
                    e.preventDefault();
                }
            }).focus(function(){
            	$(this).addClass('om-state-focus');
            }).blur(function(e){
                $(this).removeClass('om-state-focus');
            	var character = $.data(this,"character");
                this.value=fixPrecision(this.value, character, options);
                self._trigger("onBlur",e,this.value);
            }).keydown(function(e){
            	self._checkLast(this);
            	
            	//Chrome并不支持css属性ime-mode,无法阻止拼音输入，但当使用输入法时，事件的e.which===229恒成立.
            	if(229 === e.which){
            		e.preventDefault();
            	}
            }).keyup(function(e){//在Chrome中文输入法下，输入  ，。等字符不会触发input框的keypress事件
            	self._checkLast(this);
            }).bind('cut paste',function(e){
            	return false;
            });
        },
		
        _init : function() {
            var $ele = this.element,
                opts = this.options;
            
            if (typeof opts.disabled !== "boolean") {
                opts.disabled = $ele.attr("disabled");
            }

            if (opts.readOnly) {
                $ele.attr("readonly","readonly");
            }

            var character = $.data($ele[0], "character");
            
            this._buildAllowChars();
            
            if (opts.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },
        
		_checkLast : function(self){
			var v = self.value,
        		len = v.length;
        	if(v && $.data(self,"allowed").indexOf(v.charAt(len-1))===-1
        		|| v.indexOf('.') != v.lastIndexOf('.')
        		|| v.indexOf('-') != v.lastIndexOf('-')){
        		self.value = v = v.substring(0 , (len--)-1);
        	}
		},
		
        _buildAllowChars : function() {
            var allowed = "0123456789";

            // 允许输入的字符
            if (this.options.allowDecimals) {
                allowed = allowed + ".";
            }
            if (this.options.allowNegative) {
                allowed = allowed + "-";
            }
            if (this.options.readOnly) {
                allowed = "";
            }
            $.data(this.element[0], "allowed", allowed);
        },
        /**
         * 禁用组件。
         * @name omNumberField#disable
         * @function
         * @example
         * $('#input').omNumberField("disable")
         */
        disable : function() {
            this.element.attr("disabled", true)
                    .addClass("om-numberfield-disabled");
        },
        /**
         * 启用组件。
         * @name omNumberField#enable
         * @function
         * @example
         * $('#input').omNumberField("enable")
         */
        enable : function() {
            this.element.attr("disabled", false)
                    .removeClass("om-numberfield-disabled");
        }
    });
})(jQuery);