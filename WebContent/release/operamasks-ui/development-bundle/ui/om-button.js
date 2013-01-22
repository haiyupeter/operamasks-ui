/*
 * operamasks-ui omButton 0.1
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
 */
;(function($) {
	/**
     * @name omButton
     * @author 罗业刚
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
     *     $('#bnt').omButton({
     *         icons : {left:'images/help.png',right:'images/edit_add.png'},
     *         width : 150,
     *         disabled : 'disabled',
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
    $.widget('om.omButton', {
    	
        options: /**@lends omButton# */{
        	/**
        	 * 是否禁用组件。可通过('#id').attr('disabled')判断按钮是否禁用。
             * @type String 
             * @default null 
             * @example
             * $("#button").omButton({disabled: true}); 
             */
            disabled : null ,
            /**
             * 显示文本。label值可以写到dom元素里面，也可以设置在属性里面，设置到属性里面的优先级最高。
             * @type String 
             * @default ""
             * @example
             * $("#button").omButton({label: "apusic"});
             */
            label : null ,
            /**
        	 * 显示按钮图标，left表示左图标，right表示右图标，取值均为图片路径。
             * @type Object 
             * @default null 
             * @example
             * $("#button").omButton({
             *     icons: {
             *         left: 'images/help.png',
             *         right: 'images/edit_add.png'
             *     }
             * });
             */
            icons: {
    			left: null,
    			right: null
    		},
    		/**
        	 * 按钮宽度，设置固定宽度之后按钮将不会随文字的多少而改变。
             * @type Number 
             * @default null 
             * @example
             * width : 150
             */
            width : null ,
            /**
        	 * 单击按钮触发事件。
             * @event
             * @name omButton#onClick 
             * @example
             * onClick : function(){
             *    //do something
             * }
             */
            onClick : null
        },
        _create:function(){
            var self = this;
            var disabledState = this.options.disabled;
            if ( typeof disabledState != "boolean" ) {
                disabledState = this.element.propAttr( "disabled" );
    		}
            this._determineButtonType();
            var options = this.options;
            if ( this.buttonElement.attr('disabled') == 'disabled' || options.disabled == 'disabled') {
    			options.disabled = true;
    		}
            this._initButton();
            if(options.disabled){
            	self._addClass('disabled');
            	this.buttonElement.css('cursor','default');
            }
            var newButtonElement = this.buttonElement.parent().parent();
            newButtonElement.bind( 'mouseenter.button',function( event ){
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass('hover');
            				}).bind( "mouseleave.button", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._removeClass('hover');
            					self._removeClass('active');
            				}).bind( "click.button", function( event ){
            					if ( options.disabled ) {
            						event.preventDefault();
            						event.stopImmediatePropagation();
            						return false;
            					}
            				}).bind( "mousedown.button", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass('active');
            				    self._removeClass('focus');
            					var onClick = options.onClick;
        		                if ( onClick && onClick( event ) === false ) {
        		                    return;
        		                }
            				})
            				.bind( "mouseup.button", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass('focus');
            					self._removeClass('active');
            				})
            				.bind( "keydown.button", function(event) {
            					if ( options.disabled ) {
            						return false;
            					}
            					if ( event.keyCode == $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER ) {
            						self._addClass('active');
            					}
            					if( event.keyCode == $.ui.keyCode.SPACE){
            						var onClick = options.onClick;
            		                if ( onClick && onClick( event ) === false ) {
            		                    return;
            		                }
            					}
            				})
            				.bind( "keyup.button", function() {
            					self._removeClass('active');
            				});
	            this.element.bind( "focus", function( event ) {
								if ( options.disabled ) {
									return false;
								}
								self._addClass('focus');
							}).bind( "blur", function( event ) {
	        					if ( options.disabled ) {
	        						return false;
	        					}
	        					self._removeClass('focus');
	        				});
        },
        /**
         * 启用组件。
         * @name omButton#enable
         * @function
         * @example
         * $('#btn').omButton('enable');
         */
        enable : function(){
            this._removeClass('disabled');
            this.options.disabled = false;
            this.buttonElement.css('cursor','pointer');
            return this.element.removeAttr('disabled');
        },
        /**
         * 禁用组件。
         * @name omButton#disable
         * @function
         * @example
         * $('#btn').omButton('disable');
         */
        disable : function(){
        	this._addClass('disabled');
            this.options.disabled = true;
            this.buttonElement.css('cursor','default');
            return this.element.attr('disabled', 'disabled');
        },
        /**
         * 触发点击事件。
         * @name omButton#click
         * @function
         * @example
         * $('#btn').omButton('click');
         */
        click : function(){
        	if(!this.options.disabled && this.options.onClick){
	        		this.options.onClick();
            }
        },
        /**
         * 设置按钮的label属性。
         * @name omButton#changeLabel
         * @function
         * @param label 按钮文本
         * @example
         * $('#btn').omButton('changeLabel','按钮label');
         */
        changeLabel : function(label){
            if(this.type == 'a'){
            	this.buttonElement.text(label) ;
            }else if( this.type == 'input' ){
            	this.buttonElement.val(label) ;
            }else if ( this.type == 'button' ){
            	this.buttonElement.html(label) ;
            }
        },
        /**
         * 设置按钮的icon属性。
         * @name omButton#changeIcons
         * @function
         * @param icons 图标路径
         * @example
         * $('#btn').omButton('changeIcons',{
         *     left: 'images/help.png',
         *     right: 'images/edit_add.png'
         * });
         */
        changeIcons : function( icons ){
        	if( !this.options.disabled ){
	            if( icons ){
	            	icons.left?this.buttonElement.css( 'backgroundImage','url( '+icons.left+' )' ):null;
	            	icons.right?this.buttonElement.next().attr( 'src',icons.right ):null;
	            }
            }
        },
        _addClass : function( state ){
        	this.buttonElement.parent().parent().addClass( 'om-state-'+state );
        },
        _removeClass : function( state ){
        	this.buttonElement.parent().parent().removeClass( 'om-state-'+state );
        },
        _initButton : function(){
        	var options = this.options;
        	var label = this._getLabel();
        	var wrapperSpan = $( '<span>' ).addClass( 'om-btn om-state-default' ),
        	    leftSpan = $( '<span>' ).addClass( 'om-btn-bg om-btn-left' ),
        	    centerSpan = $( '<span>' ).addClass( 'om-btn-bg om-btn-center' ),
        	    rightSpan = $( '<span>' ).addClass( 'om-btn-bg om-btn-right' );
        	if( options.width > 10 ){
        		centerSpan.css( 'width',parseInt( options.width )-10 );
        	}
        	var buttonElement = this.buttonElement.addClass( 'om-btn-txt' );
        	if( this.type == 'a' || this.type == 'button' ){
        	    buttonElement.html( label );
        	}else{
        	    buttonElement.val( label );
        	}
        	if( options.icons.left ){
        	    if( label ){
        	        buttonElement.addClass( 'om-btn-icon' ).css( 'background-image','url('+options.icons.left+')' );
        	    }else{
        	        buttonElement.addClass( 'om-btn-only-icon' ).css('background-image','url('+options.icons.left+')' );
        	    }
        	}
        	buttonElement.css( {'background-position':'left center','background-repeat':'no-repeat'} );
        	buttonElement.wrap( wrapperSpan );
        	leftSpan.insertBefore( buttonElement );
        	rightSpan.insertAfter( buttonElement );
        	buttonElement.wrap( centerSpan );
        	if( options.icons.right ){
        	    if( label != '' ){
        	        $( '<img>' ).attr( 'src',options.icons.right ).css( {'vertical-align':'text-top','padding-left':'3px'} ).insertAfter( buttonElement );
        	    }else{
        	        $( '<img>' ).attr( 'src',options.icons.right ).css( 'vertical-align','text-top' ).insertAfter( buttonElement );
        	    }
            }
        },
        _getLabel : function(){
        	return this.options.label || this.buttonElement.html() || this.buttonElement.text() || this.buttonElement.val();
        },
        _determineButtonType: function() {
    		if ( this.element.is("input") ) {
    			this.type = "input";
    		}  else if ( this.element.is("a") ) {
    			this.type = "a";
    		} else if ( this.element.is('button') ){
    			this.type = "button";
    		}
    		this.buttonElement = this.element;
    	}
    });
})(jQuery);