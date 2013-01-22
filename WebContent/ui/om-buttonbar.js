/*
 * $Id: om-buttonbar.js,v 1.2 2012/06/12 02:22:26 luoyegang Exp $
 * operamasks-ui omButtonbar @VERSION
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
     * @name omButtonbar
     * @class 按钮工具条组件，将多个按钮放置到工具条上面，属性、事件和omButton一样，通过配置每个按钮的id属性，可以操作单个button，<br/>
     *        如果没有配置id属性，则id默认为组件的id+按钮所处的顺序，如"btn_1"。<br/>
     *        组件通过在按钮数组里面增加{separtor:true}设置分隔条,具体请看示例。<br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以对按钮进行分组。</li>
     *      <li>支持所有omButton的属性和方法。</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#bnt').omButtonbar({
     *         width : 550,
     *         btns : [{id:"add",label:"新增"},{separtor:true},{id:"modify",label:"修改",}]
     *     });
     * });
     * &lt;/script&gt;
     * 
     * &lt;div id="btn" /&gt;
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.omWidget('om.omButtonbar', {
    	
        options: /**@lends omButtonbar# */{
        	/**
        	 * 组件的宽度，默认充满父容器。
             * @type Number
             * @default null 
             * @example
             * $("#button").omButtonbar({width:500}); 
             */
            width : null
        },
        
        _create : function() {
            this.element.addClass("om-buttonbar");
            $("<span></span>").addClass("om-buttonbar-null").appendTo(this.element);
        },
        
        _init : function(){
            var self = this,
                options = this.options,
                element = this.element;
            var oldStyle = element.attr("style")?element.attr("style"):"";
            if(oldStyle){
            	oldStyle = oldStyle.substr(oldStyle.length-1,oldStyle.length) == ";"?oldStyle:oldStyle+";";
            }
            if(options.width){
            	element.attr("style" , oldStyle+"width:"+(options.width - 2)+"px;");
            }
            $.each(options.btns, function(index, props) {
            	if(!props.separtor){
            		var btnId = props.id || element.attr("id")+"_"+index;
    				var button = $("<button type=\"button\"></button>")
    				    .attr('id',btnId)
    					.appendTo(element);
    				if ($.fn.omButton) {
    					button.omButton(props);
    				}
            	}else{
					$("<span class=\"om-buttonbar-sep\"></span>").appendTo(element);
				}
			});
        }
    });
})(jQuery);