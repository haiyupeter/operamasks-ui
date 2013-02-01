/*
 * $Id: om-button.js,v 1.61 2012/07/03 08:58:21 wangfan Exp $
 * operamasks-ui omButton @VERSION
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
     * @name omButton
     * @class 按钮组件。类似于html中的button、input[type=submit]、input[type=button]，使用背景图片实现圆角，支持icon，可以只显示icon。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>实现圆角</li>
     *      <li>支持左icon和右icon，可同时出现左右icon，也可以只显示icon不显示label</li>
     *      <li>按钮文字数目不限，也可以任意设置按钮宽度</li>
     *      <li>支持input[type=button]、input[type=submit]、input[type=reset]、button、a五种标签形式</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $("#btn").omButton({
     *         icons : {left:"images/help.png",right:"images/edit_add.png"},
     *         width : 150,
     *         disabled : "disabled",
     *         onClick : function(event){
     *             // do something
     *         }
     *     });
     * });
     * &lt;/script&gt;
     * 
     * &lt;input id="btn" type="submit" /&gt;
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.omWidget("om.omButton", {
    	
        options: /**@lends omButton# */{
        	/**
        	 * 是否禁用组件。可通过("#id").attr("disabled")判断按钮是否禁用。
             * @type String 
             * @default null 
             * @example
             * $("#button").omButton({disabled: true}); 
             */
            disabled : null ,
            /**
             * 显示文本。label值可以写到dom元素里面，也可以设置在属性里，设置在属性里优先级最高。
             * @type String 
             * @default ""
             * @example
             * $("#button").omButton({label: "apusic"});
             */
            label : null ,
            /**
        	 * 按钮图标。left 左图标，right 右图标，取值为图片路径。
             * @type Object 
             * @default null 
             * @example
             * $("#button").omButton({
             *     icons: {
             *         left: "images/help.png",
             *         right: "images/edit_add.png"
             *     }
             * });
             */
            icons: {
    			left: null,
    			right: null
    		},
    		/**
        	 * 按钮宽度。设置固定宽度后按钮不会随文字多少而改变。
             * @type Number 
             * @default null 
             * @example
             * width : 150
             */
            width : null ,
            /**
        	 * 点击按钮时触发的事件。
             * @event
             * @param event jQuery.Event对象。
             * @name omButton#onClick 
             * @example
             * onClick : function(event){
             *    //do something
             * }
             */
            onClick : null
        },
        
        _create : function() {
            this._initElemType();
            var wrapperSpan = $("<span>").addClass("om-btn om-state-default").css("border", "none"),
            leftSpan = $("<span>").addClass("om-btn-bg om-btn-left"),
            centerSpan = $("<span>").addClass("om-btn-bg om-btn-center"),
            rightSpan = $("<span>").addClass("om-btn-bg om-btn-right");
            // TODO: 删除对apuaic具体类型的依赖
            if(this.element.hasClass("apusic-btn-deepblue")){
            	wrapperSpan.addClass("apusic-btn-deepblue");
            }
            
            this.element.addClass( "om-btn-txt" )
                .css( {"background-position":"left center","background-repeat":"no-repeat"} )
                .wrap( wrapperSpan )
                .before( leftSpan )
                .after( rightSpan )
                .wrap( centerSpan );
        },
        
        _init : function(){
            var self = this,
                options = this.options,
                element = this.element;
            if ( typeof options.disabled != "boolean" ) {
                options.disabled = element.propAttr( "disabled" );
    		}
            if ( element.attr("disabled") == "disabled" || options.disabled == "disabled") {
    			options.disabled = true;
    		}
            this._initButton();
            if(options.disabled){
            	self._addClass("disabled");
            	element.css("cursor","default");
            }
            var $newelement = element.parent().parent();
            $newelement.bind("mouseenter", function( event ){
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass("hover");
            				}).bind( "mouseleave", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._removeClass("hover");
            					self._removeClass("active");
            				}).bind( "click", function( event ){
            					if ( options.disabled ) {
            						event.preventDefault();
            						event.stopImmediatePropagation();
            						return false;
            					}else if(self.options.onClick){
            						self._trigger("onClick",event);
            					}
            				}).bind( "mousedown", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass("active");
            				    self._removeClass("focus");
            				})
            				.bind( "mouseup", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._removeClass("focus");
            					self._removeClass("active");
            				})
            				.bind( "keydown", function(event) {
            					if ( options.disabled ) {
            						return false;
            					}
            					if ( event.keyCode == $.om.keyCode.SPACE || event.keyCode == $.om.keyCode.ENTER ) {
            						self._addClass("active");
            					}
            					if( event.keyCode == $.om.keyCode.SPACE){
            						var onClick = options.onClick;
            		                if ( onClick && self._trigger("onClick",event) === false ) {
            		                    return;
            		                }
            					}
            				})
            				.bind("keyup", function() {
								self._removeClass("active");
							});
	            element.bind( "focus.button", function( event ) {
								if ( options.disabled ) {
									return false;
								}
								self._addClass("focus");
							}).bind( "blur.button", function( event ) {
	        					if ( options.disabled ) {
	        						return false;
	        					}
	        					self._removeClass("focus");
	        				});
	            element.next().bind("click", function(event){
	            	if(element.is("input")&&element.attr("type")=="submit"){	
	            		element.submit();
	            	}
	            });
        },
        /**
         * 启用组件。
         * @name omButton#enable
         * @function
         * @example
         * $("#btn").omButton("enable");
         */
        enable : function(){
            this._removeClass("disabled");
            this.options.disabled = false;
            this.element.css("cursor","pointer")
                        .removeAttr("disabled");
        },
        /**
         * 禁用组件。
         * @name omButton#disable
         * @function
         * @example
         * $("#btn").omButton("disable");
         */
        disable : function(){
        	this._addClass("disabled");
            this.options.disabled = true;
            this.element.css("cursor","default");
            if(this.type == "input" || this.type == "button"){
            	this.element.attr("disabled", "disabled");
            }
        },
        /**
         * 触发点击事件。
         * @name omButton#click
         * @function
         * @example
         * $("#btn").omButton("click");
         */
        click : function(){
        	if(!this.options.disabled && this.options.onClick){
        		this._trigger("onClick");
            }
        },
        /**
         * 改变按钮的label属性。
         * @name omButton#changeLabel
         * @function
         * @param label 按钮文本
         * @example
         * $("#btn").omButton("changeLabel","按钮label");
         */
        changeLabel : function(label){
            if(this.type == "a"){
            	this.element.text(label) ;
            }else if( this.type == "input" ){
            	this.element.val(label) ;
            }else if ( this.type == "button" ){
            	this.element.html(label) ;
            }
        },
        /**
         * 改变按钮的icon属性。
         * @name omButton#changeIcons
         * @function
         * @param icons 图标路径
         * @example
         * $("#btn").omButton("changeIcons",{
         *     left: "images/help.png",
         *     right: "images/edit_add.png"
         * });
         */
        changeIcons : function( icons ){
        	if( !this.options.disabled ){
	            if( icons ){
	            	icons.left?this.element.css( "backgroundImage","url( "+icons.left+" )" ):null;
	            	icons.right?this.element.next().attr( "src",icons.right ):null;
	            }
            }
        },
        destroy : function(){
        	$el = this.element;
        	$el.closest(".om-btn").after($el).remove();
        },
        _addClass : function( state ){
        	this.element.parent().parent().addClass( "om-state-"+state );
        },
        _removeClass : function( state ){
        	this.element.parent().parent().removeClass( "om-state-"+state );
        },
        _initButton : function(){
        	var options = this.options,
        	    label = this._getLabel(),
        	    element = this.element;
        	
            element.removeClass("om-btn-icon om-btn-only-icon")
                .next("img").remove();
        	
        	if( options.width > 10 ){
        		element.css( "width",parseInt( options.width )-10 );
        	}
        	if( this.type == "a" || this.type == "button" ){
        	    element.html( label );
        	}else{
        	    element.val( label );
        	}
        	
        	if( options.icons.left ){
        	    if( label ){
        	        element.addClass( "om-btn-icon" ).css( "background-image","url("+options.icons.left+")" );
        	    }else{
        	        element.addClass( "om-btn-only-icon" ).css("background-image","url("+options.icons.left+")" );
        	    }
        	}
        	if( options.icons.right ){
        	    if( label != "" ){
        	        $( "<img>" ).attr( "src",options.icons.right ).css( {"vertical-align":"baseline","padding-left":"3px"} ).insertAfter( element );
        	    }else{
        	        $( "<img>" ).attr( "src",options.icons.right ).css( "vertical-align","baseline" ).insertAfter( element );
        	    }
            }
        },
        _getLabel : function(){
        	return this.options.label || this.element.html() || this.element.text() || this.element.val();
        },
        _initElemType: function() {
    		if ( this.element.is("input") ) {
    			this.type = "input";
    		}  else if ( this.element.is("a") ) {
    			this.type = "a";
    		} else if ( this.element.is("button") ){
    			this.type = "button";
    		}
    	}
    });
})(jQuery);