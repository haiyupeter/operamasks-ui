/*
 * $Id: om-messagebox.js,v 1.25 2012/06/28 02:13:57 licongping Exp $
 * operamasks-ui omMessageBox @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-core.js
 *  om-mouse.js
 *  om-draggable.js
 *  om-position.js
 */
 
(function( $, undefined ) {
	 var tmpl = '<div class="om-messageBox om-widget om-widget-content om-corner-all" tabindex="-1">'+
	                '<div class="om-messageBox-titlebar om-widget-header om-corner-top om-helper-clearfix">'+
	                    '<span class="om-messageBox-title"></span>'+
	                    '<a href="#" class="om-messageBox-titlebar-close om-corner-tr"><span class="om-icon om-icon-closethick"></span></a>' +
	                '</div>'+
	                '<div class="om-messageBox-content om-widget-content">'+
	                    '<table><tr vailgn="top">' +
	                        '<td class="om-messageBox-imageTd"><div class="om-messageBox-image"/>&nbsp;</td>' +
	                        '<td class="om-message-content-html"></td>' +
	                    '</tr></table>'+
	                '</div>'+
	                '<div class="om-messageBox-buttonpane om-widget-content om-corner-bottom om-helper-clearfix">'+
	                    '<div class="om-messageBox-buttonset"></div>'+
	                '</div>'+
	            '</div>';
	var _height = function(){
        // handle IE 6
        if ($.browser.msie && $.browser.version < 7) {
            var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
            return (scrollHeight < offsetHeight) ?  $(window).height() : scrollHeight;
        // handle "good" browsers
        } else {
            return $(document).height();
        }
	};
	var _width = function() {
        // handle IE
        if ( $.browser.msie ) {
            var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
                offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
            return (scrollWidth < offsetWidth) ? $(window).width() : scrollWidth;
        // handle "good" browsers
        } else {
            return $(document).width();
        }
    };
	var close = function(messageBox, mask, handler, value){
	    if (messageBox.hasClass('om-messageBox-waiting')) {
	        return;
	    }
	    handler ? handler(value) : jQuery.noop();
	    messageBox.remove();
	    mask.remove();
	};
    var _show = function(config){
        var onClose = config.onClose;
        var messageBox = $(tmpl).appendTo(document.body).css('z-index', 1500).position({
            of:window,
            collision: 'fit'
        }).omDraggable({
            containment: 'document',
            cursor:'move',
            handle: '.om-messageBox-titlebar'
        }).hide().keydown(function(event){
            if (event.keyCode && event.keyCode === $.om.keyCode.ESCAPE) {
                close(messageBox, mask, null, false);
                event.preventDefault();
            }
        });
        var mask = $('<div class="om-widget-overlay"/>').appendTo(document.body).show().css({height:_height(),width:_width()});
        var closeBut = messageBox.find('span.om-messageBox-title').html(config.title).next().hover(function(){
            $(this).addClass('om-state-hover');
        }, function(){
            $(this).removeClass('om-state-hover');
        }).focus(function(){
            $(this).addClass('om-state-focus');
        }).blur(function(){
            $(this).removeClass('om-state-focus');
        }).click(function(event){
            close(messageBox, mask, null, false);
            return false;
        }).bind('mousedown mouseup', function(){
            $(this).toggleClass('om-state-mousedown');
        });
        messageBox.find('div.om-messageBox-image').addClass('om-messageBox-image-' + config.type);
        var content = config.content;
        if (config.type == 'prompt') {
            content = content || '';
            content += '<br/><input id="om-messageBox-prompt-input" type="text"/>';
        }
        messageBox.find('td.om-message-content-html').html(content);
        var buttonSet = messageBox.find('div.om-messageBox-buttonset');
        switch (config.type) {
            case 'confirm':
                buttonSet.html('<button id="confirm">确定</button><button id="cancel">取消</button>');
                if($.fn.omButton){
	                buttonSet.find("button#confirm").omButton({
	                	width:60,
	                	onClick:function(event){
	                		close(messageBox, mask, onClose, true);
	                	}
	                });
	                buttonSet.find("button#cancel").omButton({
	                	width:60,
	                	onClick:function(event){
	                		close(messageBox, mask, onClose, false);
	                	}
	                });
                }
                break;
            case 'prompt':
                buttonSet.html('<button id="confirm">确定</button><button id="cancel">取消</button>');
                if($.fn.omButton){
	                buttonSet.find("button#confirm").omButton({
	                	width:60,
	                	onClick:function(event){
	                        var returnValue = onClose ? onClose($('#om-messageBox-prompt-input').val()) : jQuery.noop();
	                        if (returnValue !== false) {
	                            messageBox.remove();
	                            mask.remove();
	                        }
	                	}
	                });
	                buttonSet.find("button#cancel").omButton({
	                	width:60,
	                	onClick:function(event){
	                		close(messageBox, mask, onClose, false);
	                	}
	                });
                }
                break;
            case 'waiting':
                messageBox.addClass('om-messageBox-waiting');
                mask.addClass('om-messageBox-waiting');
                closeBut.hide(); //不显示关闭按钮
                buttonSet.parent().hide(); //不显示下面的按钮面板
                messageBox.find(">.om-messageBox-content").addClass("no-button om-corner-bottom");
                break;
            default:
                buttonSet.html('<button id="confirm">确定</button>');
	            if($.fn.omButton){
		            buttonSet.find("button#confirm").omButton({
		            	width:60,
		            	onClick:function(event){
		            		close(messageBox, mask, onClose, true);
		            	}
		            });
	            }
        }
        var buts = $('button',buttonSet);
        buts.width("100%");
        messageBox.show();
        var okBut = buts.first()[0];
        okBut ? okBut.focus() : messageBox.focus();
    };
     /**
      * @name omMessageBox
      * @class
      * omMessageBox用于提供提示信息的弹出窗口，类似于JavaScript中使用alert()、confirm()、prompt()函数时出现的那种提示信息的弹出窗口。<br/><br/>
      * <br/>
      * <h2>有以下特点：</h2><br/>
      * <ul>
      *     <li>有较好的浏览器兼容性</li>
      *     <li>可以定义标题、内容，并且标题和内容可以使用html代码</li>
      *     <li>标题栏有关闭按钮，也可以按Esc键关闭</li>
      *     <li>支持丰富的提示（图标不同）</li>
      *     <li>可以监听关闭事件</li>
      * </ul>
      * <br/>
      * <h2>提供了以下工具方法：</h2><br/>
      * <ul>
      *     <li>
      *         <b>$.omMessageBox.alert(config)</b><br/>
      *         弹出一个Alert提示，仅有一个“确定”按钮。其中config有以下配置项：<br/>
      *         <ul style="margin-left:40px">
      *             <li>type：alert提示的类型，类型不同时弹出窗口左边的图标会不同。String类型，可选的值有'alert'、'success'、'error'、'question'、'warning'。默认值为'alert'。</li>
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'提示'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的回调函数，Function类型，点击"确定"按钮来关闭弹出窗口时，Function的参数value值为true，按ESC键关闭弹出窗口时，Function的参数value值为false。无默认值。</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageBox.alert({
      *                 type:'error',
      *                 title:'失败',
      *                 content:'不能删除&lt;font color="red">admin&lt;/font>用户',
      *                 onClose:function(value){
      *                     alert('do something');
      *                 }
      *             });
      *         </pre>
      *     </li>
      *     <li>
      *         <b>$.omMessageBox.confirm(config)</b><br/>
      *         弹出一个Confirm提示，有“确定”和“取消”按钮。其中config有以下配置项：<br/>
      *         <ul style="margin-left:40px">
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'确认'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的回调函数，Function类型，点击"确定"按钮来关闭弹出窗口时，Function的参数value值为true，点击“取消”按钮或按ESC键关闭弹出窗口时，Function的参数value值为false。无默认值。</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageBox.confirm({
      *                 title:'确认删除',
      *                 content:'删除用户后，它所有的发帖和回帖将同时删除（不可恢复），你确定要这样做吗？',
      *                 onClose:function(value){
      *                     alert(value?'开始删除操作':'不删除了');
      *                 }
      *             });
      *         </pre>
      *     </li>
      *     <li>
      *         <b>$.omMessageBox.prompt(config)</b><br/>
      *         弹出一个Prompt提示，有一个输入框和“确定”和“取消”按钮。其中config有以下配置项：
      *         <ul style="margin-left:40px">
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'请输入'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的回调函数，Function类型，点击"确定"按钮来关闭弹出窗口时，Function的参数value值为用户在输入框里输入的字符串（一定是字符串），点击“取消”按钮或按ESC键关闭弹出窗口时，Function的参数value值为false。无默认值。<b>注意：在此方法中返回false将会阻止弹出窗口关闭。</b></li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageBox.prompt({
      *                 title:'商品数量',
      *                 content:'请输入你要购买的商品的数量（你的余额最多只能购买12千克）：',
      *                 onClose:function(value){
      *                     if(value===false){ //按了取消或ESC
      *                         alert('取消购买');
      *                         return;
      *                     }
      *                     if(value==''){
      *                         alert('数量不能为空');
      *                         return false; //不关闭弹出窗口
      *                     }
      *                     if(value-0+'' !== value){
      *                         alert('只能输入数字');
      *                         return false;  //不关闭弹出窗口
      *     `               }
      *                     if(value&lt;0 || value&gt;12){
      *                         alert('请输入0-12之间的数字（可带小数）');
      *                         return false; //不关闭弹出窗口
      *                     }else{
      *                         alert('开始购买'+value+'千克商品');
      *                     }
      *                 }
      *             });
      *         </pre>
      *     </li>
      *     <li>
      *         <b>$.omMessageBox.waiting(config | 'close')</b><br/>
      *         弹出一个Prompt提示，有一个输入框和“确定”和“取消”按钮。该提示窗口没有关闭按钮，也不可以按ESC关闭。如果参数是'close'时表示关闭上次弹出的Waiting提示窗口。如果是config时表示要弹出一个Waiting提示窗口，其中config有以下配置项：
      *         <ul style="margin-left:40px">
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'请稍候'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             //弹出提示
      *             $.omMessageBox.waiting({
      *                 title:'请稍候',
      *                 content:'服务器正在处理您的请求，请稍候...',
      *             });
      * 
      *             //关闭提示
      *             $.omMessageBox.waiting('close');
      *         </pre>
      *     </li>
      * </ul>
      */
    $.omMessageBox = {
        alert: function(config){
            config = config || {};
            config.title = config.title || '提示';
            config.type = config.type || 'alert';
            _show(config);
        },
        confirm: function(config){
            config = config || {};
            config.title = config.title || '确认';
            config.type = 'confirm';
            _show(config);
        },
        prompt: function(config){
            config = config || {};
            config.title = config.title || '请输入';
            config.type = 'prompt';
            _show(config);
        },
        waiting: function(config){
            if (config === 'close') {
                $('.om-messageBox-waiting').remove();
                return;
            }
            config = config || {};
            config.title = config.title || '请等待';
            config.type = 'waiting';
            _show(config);
        }
    };
}(jQuery));