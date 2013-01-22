/*
 * $Id: om-messagetip.js,v 1.11 2012/06/21 03:09:30 wangfan Exp $
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
 */
 
(function( $, undefined ) {
     /**
      * @name omMessageTip
      * @class
      * omMessageTip用于右下角弹出提示窗口（像QQ新闻一样）。<br/><br/>
      * <br/>
      * <h2>有以下特点：</h2><br/>
      * <ul>
      *     <li>不中断用户操作（非模态窗口提示）</li>
      *     <li>有较好的浏览器兼容性</li>
      *     <li>可以定义标题、内容，并且标题和内容可以使用html代码</li>
      *     <li>支持丰富的提示（图标不同）</li>
      *     <li>可以监听关闭事件</li>
      *     <li>弹出提示和关闭提示时有简单动画</li>
      *     <li>较轻量（仅简单的提示功能和定时消失功能，不可改变提示窗口大小，不可拖动提示窗口位置）</li>
      * </ul>
      * <br/>
      * 该组件非常轻量，功能也较少，如果需要中断用户操作，请使用omDialog或omMessageBox组件。内容区也仅能放html代码，如果有较复杂的内容请使用omDialog组件。
      * <br/>
      * <h2>提供了以下工具方法：</h2><br/>
      * <ul>
      *     <li>
      *         <b>$.omMessageTip.show(config)</b><br/>
      *         从当前页面右下角弹出一个非中断提示，弹出的提示可以关闭。其中config有以下配置项：<br/>
      *         <ul style="margin-left:40px">
      *             <li>type：提示的类型，类型不同时弹出窗口左边的图标会不同。String类型，可选的值有'alert'、'success'、'error'、'question'、'warning'、'waiting'。默认值为'alert'。</li>
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'提示'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的无参回调函数，Function类型。</li>
      *             <li>timeout：弹出窗口持续的时间，单位为毫秒，窗口弹出后经过这么长的时间后自动关闭（如果有onClose回调函数，会自动触发它），Int类型。默认值为无穷大（即不自动关闭）</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageTip.show({
      *                 type:'warning',
      *                 title:'提醒',
      *                 content:'请选择你要删除的记录（可以选择一条或多条）！'
      *             });
      *             $.omMessageTip.show({
      *                 type:'error',
      *                 title:'数据非法',
      *                 content:'&lt;font color="red">123456&lt;/font>不是有效的邮箱地址！',
      *                 onClose:function(){
      *                     $('#emial').focus();
      *                 }
      *             });
      *         </pre>
      *     </li>
      * </ul>
      */
    $.omMessageTip = {
        show: function(config){
            config = $.extend({
                title : '提醒',
                content : '&#160;',
                type : 'alert'
            },config);
            var html = '<div class="om-messageTip om-widget om-corner-all" tabindex="-1">'+
                    '<div class="om-widget-header om-corner-top om-helper-clearfix">'+
                        '<span class="om-messageTip-title">'+config.title+'</span>'+
                        '<a href="#" class="om-messageTip-titlebar-close om-corner-tr"><span class="om-icon-closethick"></span></a>' +
                    '</div>'+
                    '<div class="om-messageTip-content om-widget-content om-corner-bottom">'+
                        '<div class="om-messageTip-image om-messageTip-image-'+config.type+'"></div>' +
                        '<div class="om-messageTip-content-body">'+config.content+'</div>' +
                    '</div>'+
                '</div>';
            var messageTip = $(html).appendTo(document.body).css('z-index', 3000).hide();
            var result = {d:messageTip,l:config.onClose};
            messageTip.find('a.om-messageTip-titlebar-close')
                .bind('mouseenter mouseleave',function(){
                    $(this).toggleClass('om-state-hover');
                })
                .bind('focus blur',function(){
                    $(this).toggleClass('om-state-focus');
                })
                .bind('mousedown mouseup', function(){
                    $(this).toggleClass('om-state-mousedown');
                })
                .click(function(event){
                    $.omMessageTip._close(result);
                    return false;
                });
            messageTip.slideDown('slow');
            
            var timer;
            function timeout(time){
            	timer = setTimeout(function(){
                    $.omMessageTip._close(result);
                },time);
            }
            if(config.timeout){ //定时关闭
              timeout(config.timeout);
            }
            
            messageTip.bind('mouseover', function(){
            		clearTimeout(timer);
            }).bind('mouseout', function(){
            	if(timer){
            		timeout(config.timeout);
            	}
            });
            return messageTip;
        },
        _close : function(result){
            result.d.slideUp('slow');
            if(result.l){
                result.l(); //调用onClose回调函数
            }
            setTimeout(function(){
                result.d.remove();
            },1000);
        }
    };
}(jQuery));