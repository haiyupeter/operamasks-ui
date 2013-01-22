/*
 * $Id: om-editor.js,v 1.1 2012/05/28 02:47:20 licongping Exp $
 * operamasks-ui omEditor @VERSION
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
     * @name omEditor
     * @class HTML富文本编辑器.<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>在网页中使用的可见即所得HTML富文本编辑器</li>
     * 		<li>支持更换皮肤样式</li>
     * 		<li>支持文件上传</li>
     * 		<li>支持自定义工具条</li>
     * 		<li>支持自定义快捷键及其命令</li>
     * </ol>
     * <b>工具条命令列表：</b><br/>
     * <ol>
     * 		<li>'Source'：源码</li>
     * 		<li>'Preview'：预览</li>
     * 		<li>'Print'：打印</li>
     * 		<li>'PasteText'：粘贴为无格式文本</li>
     * 		<li>'PasteFromWord'：从 MS Word 粘贴</li>
     * 		<li>'Undo'：撤销</li>
     * 		<li>'Redo'：重做</li>
     * 		<li>'Find'：查找</li>
     * 		<li>'Replace'：替换</li>
     * 		<li>'Bold'：加粗</li>
     * 		<li>'Italic'：倾斜</li>
     * 		<li>'Underline'：下划线</li>
     * 		<li>'Strike'：删除线</li>
     * 		<li>'Subscript'：下标</li>
     * 		<li>'Superscript'：上标</li>
     * 		<li>'RemoveFormat'：清除格式</li>
     * 		<li>'NumberedList'：编号列表</li>
     * 		<li>'BulletedList'：项目列表</li>
     * 		<li>'Outdent'：减少缩进量</li>
     * 		<li>'Indent'：增加缩进量</li>
     * 		<li>'Blockquote'：块引用</li>
     * 		<li>'JustifyLeft'：左对齐</li>
     * 		<li>'JustifyCenter'：居中</li>
     * 		<li>'JustifyRight'：右对齐</li>
     * 		<li>'JustifyBlock'：两端对齐</li>
     * 		<li>'BidiLtr'：文字方向为从左至右</li>
     * 		<li>'BidiRtl'：文字方向为从右至左</li>
     * 		<li>'Link'：插入/编辑超链接</li>
     * 		<li>'Unlink'：取消超链接</li>
     * 		<li>'Anchor'：插入/编辑锚点链接</li>
     * 		<li>'Image'：图象</li>
     * 		<li>'Flash'：Flash</li>
     * 		<li>'Table'：表格</li>
     * 		<li>'HorizontalRule'：插入水平线</li>
     * 		<li>'Smiley'：表情符</li>
     * 		<li>'SpecialChar'：插入特殊符号</li>
     * 		<li>'PageBreak'：插入分页符</li>
     * 		<li>'Iframe'：iFrame</li>
     * 		<li>'Styles'：样式</li>
     * 		<li>'Format'：格式</li>
     * 		<li>'Font'：字体</li>
     * 		<li>'FontSize'：大小</li>
     * 		<li>'TextColor'：文本颜色</li>
     * 		<li>'BGColor'：背景颜色</li>
     * 		<li>'Maximize'：全屏</li>
     * 		<li>'ShowBlocks'：显示区块</li>
     * 		<li>'About'：关于omEditor</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#editor').omEditor({
     *         skin:'kama',
     *         toolbar:'Basic',
     *         filebrowserImageUploadUrl : '/operamasks-ui/omUpload.do?type=Images'
     *     });
     * });
     * &lt;/script&gt;
     * &lt;textarea id="editor" name="editor" class="editor"&gt;&lt;p&gt;Initial value &lt;/p&gt;&lt;/textarea&gt;
     * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.omWidget("om.omEditor", {
        
        options: /** @lends omEditor.prototype */{
        /**
         * 工具箱（别名工具栏）的定义。它是一个工具栏的名称或数组。
         * editor默认定义了两个工具箱，名字分别为'Full'和'Basic'。
         * @type Array,String
         * @default 'Full'
         * @example
         * // 定义一个工具条只包含”源代码“、一个分隔符，”加粗“和”斜体“按钮 
         * var config = {};
         * config.toolbar =
         * [
         *     [ 'Source', '-', 'Bold', 'Italic' ]
         * ];
         * $( "#editor" ).omEditor(config);
         * @example
         * // 加载名字为'Basic'的工具集.
         * $( "#editor" ).omEditor({ toolbar: 'Basic' });
         */
            toolbar : 'Full' ,

            /**
             * 编辑器的高度。<b>注意: 不支持百分比</b>
             * @type Number
             * @default 200
             * @example
             * $( "#editor" ).omEditor({ height: 500 });
             */
            height : 200,

            /**
             * 编辑器的皮肤。可以是安装路径下的皮肤文件夹的名字，或者是用逗号分隔路径和文件夹的名字。
             * @type String
             * @default 'eac'
             * @example
             * $( "#editor" ).omEditor({ skin: 'kama' });
             * $( "#editor" ).omEditor({ skin: 'myskin,/customstuff/myskin/' });
             */
            skin : 'eac',

            /**
             * 编辑器的宽度，可设置具体的像素值或百分比。
             * @type String,Number
             * @default 无
             * @example
             * $( "#editor" ).omEditor({ width: 850 });
             * @example
             * $( "#editor" ).omEditor({ width: '75%' });
             */
            width : '',
            
            /**
             * 编辑器是否只读。
             * @type Boolean
             * @default false
             * @example
             * $( "#editor" ).omEditor({ readOnly: true });
             */
            readOnly : false,
            
            /**
             * 是否在“源码”模式中对“所见即所得”模式里的HTML实体进行转义，包括:nbsp,gt,lt,amp;
             * @type Boolean
             * @default true
             * @example
             * $( "#editor" ).omEditor({ basicEntities: false });
             */
            basicEntities : true,
            
            // 设置为false且暂时不开放这个属性，当设置为true且basicEntities设置为false时会出现转义异常
            // 见：http://jira.apusic.net/browse/AOM-33
            entities : false,
            
            /**
             * 定义一组快捷键列表用来阻止浏览器对这些按键的默认行为。
             * @type Array
             * @default (查看该属性示例)
             * @name omEditor#blockedBrowserKeystrokes
             * @example
             * // 这是默认值
             * var config = {};
             * config.blockedBrowserKeystokes =
             * [
             *     OMEDITOR.CTRL + 66 &#47;*B*&#47;,
             *     OMEDITOR.CTRL + 73 &#47;*I*&#47;,
             *     OMEDITOR.CTRL + 85 &#47;*U*&#47;
             * ];
             * $( "#editor" ).omEditor(config);
             */
            
            /**
             * 设置加载为HTML编辑器的内容时，要使用的DOCTYPE。
             * @type String
             * @default '&lt;!DOCTYPE HTML&gt;'
             * @example
             * // Set the doctype to the HTML 4 (quirks) mode.
             * $( "#editor" ).omEditor({ docType: '&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"&gt;' });
             */
            docType : '<!DOCTYPE HTML>',
            
            /**
             * 允许上下文敏感的tab键行为，包括下列情况：
             * <h5>当在表格里面按下tab键时:</h5>
             * <ul>
             *      <li>如果 TAB 被按下, 选择表格的下一个单元格，如果当前是表格的最后一个单元格则新建一行并focus到该行的第一个单元格</li>
             *      <li>如果 SHIFT+TAB 被按下, 选择表格的上一个单元格，如果当前是表格的第一个单元格则什么事都不做.</li>
             * </ul>
             * <br/>
             * @type Boolean
             * @default true
             * @example
             * $( "#editor" ).omEditor({ enableTabKeyTools: false });
             */
            
            enableTabKeyTools : true,
            
            /**
             * 设置回车键的行为. 这也决定了在编辑器中的其他行为规则, 例如元素 &lt;br&gt;是否作为段落分隔时使用。
             * 允许的值包括以下常量，以及它们的相对行为:
             * <ul>
             *     <li>{@link OMEDITOR.ENTER_P} (1): 创建新的 &lt;p&gt; 段落;</li>
             *     <li>{@link OMEDITOR.ENTER_BR} (2): 行被 &lt;br&gt; 元素分隔;</li>
             *     <li>{@link OMEDITOR.ENTER_DIV} (3): 创建新的 &lt;div&gt; 块</li>
             * </ul>
             * <strong>注意</strong>: 建议使用
             * {@link OMEDITOR.ENTER_P} 值，因为它的语义值和正确性。并且编辑器会优化这个值.
             * @type Number
             * @default OMEDITOR.ENTER_P
             * @example
             * // 不建议使用的.
             * $( "#editor" ).omEditor({ enterMode: OMEDITOR.ENTER_BR });
             */
            enterMode : OMEDITOR.ENTER_P,
            
            /**
             * 快捷键关联命令的列表。
             * 列表中的每个元素是一个数组，其中第一项是按键，第二个是要执行的命令的名称。
             * <b>注意：如果设置了这个属性值则默认值会被覆盖</b>
             * @type Array
             * @default (查看该属性示例)
             * @name omEditor#keystrokes
             * @example
             * // 下面是默认值.
             * var config={};
             * config.keystrokes =
             * [
             *     [ OMEDITOR.ALT + 121 &#47;*F10*&#47;, 'toolbarFocus' ],
             *     [ OMEDITOR.ALT + 122 &#47;*F11*&#47;, 'elementsPathFocus' ],
             *
             *     [ OMEDITOR.SHIFT + 121 &#47;*F10*&#47;, 'contextMenu' ],
             *
             *     [ OMEDITOR.CTRL + 90 &#47;*Z*&#47;, 'undo' ],
             *     [ OMEDITOR.CTRL + 89 &#47;*Y*&#47;, 'redo' ],
             *     [ OMEDITOR.CTRL + OMEDITOR.SHIFT + 90 &#47;*Z*&#47;, 'redo' ],
             *
             *     [ OMEDITOR.CTRL + 76 &#47;*L*&#47;, 'link' ],
             *
             *     [ OMEDITOR.CTRL + 66 &#47;*B*&#47;, 'bold' ],
             *     [ OMEDITOR.CTRL + 73 &#47;*I*&#47;, 'italic' ],
             *     [ OMEDITOR.CTRL + 85 &#47;*U*&#47;, 'underline' ],
             *
             *     [ OMEDITOR.ALT + 109 &#47;*-*&#47;, 'toolbarCollapse' ]
             * ];
             * $( "#editor" ).omEditor(config);
             */
            
            /**
             * 是否允许改变编辑器大小。
             * @type Boolean
             * @default true
             * @example
             * $( "#editor" ).omEditor({ resizable:true });
             */
            resizable : true,
            
            /**
             * 设置页面加载的时候编辑器是否默认focus。
             * @type Boolean
             * @default false
             * @example
             * $( "#editor" ).omEditor({ startupFocus:true });
             */
            
            startupFocus : false,
            
            /**
             * 设置编辑器启动时加载的模式。
             * 这取决于加载的插件。默认情况下，“所见即所得”(wysiwyg)和“源”(source)模式可供选择。
             * @type String
             * @default 'wysiwyg'
             * @example
             * $( "#editor" ).omEditor({ startupMode:'source' });
             */
            startupMode : 'wysiwyg',
            
            /**
             * 要保持的撤销步骤的数量。此值设置越高则占用内存越大。
             * @type Number
             * @default 20
             * @example
             * $( "#editor" ).omEditor({ undoStackSize:50 });
             */
            undoStackSize : 20,
            
            /**
             * 编辑器的界面颜色。并不适用于所有皮肤。
             * @type String
             * @default 无
             * @example
             * $( "#editor" ).omEditor({ uiColor:'#AADC6E' });
             */           
            uiColor : ''
            
        	/**
        	 * 图象对话框中处理图片上传的服务端地址。默认为空，表示不支持图片上传。
        	 * @type String
        	 * @default 无
        	 * @name omEditor#filebrowserImageUploadUrl
        	 * @example
        	 * $( "#editor" ).omEditor({ filebrowserImageUploadUrl:'/uploadImage.do?type=Images' });
        	 */           
            
            /**
             * 允许上传的图片类型。
             * @type Array
             * @default ['jpg','gif','png']
             * @name omEditor#allowImageType
             * @example
             * $( "#editor" ).omEditor({ allowImageType:['jpg','gif','png','bmp'] });
             */
            
            /**
             * 编辑器中释放键盘时的事件。
             * @event
             * @type Function
             * @default null
             * @param event
             * @name omEditor#onKeyUp
             * @example
             * $("#editor").omEditor({
			 *	onKeyUp: function(e) {
			 *		alert($('#editor').omEditor('getData').length);
			 *	}
			 * });
             */

        },
        _create: function() {
        	if(!this.options.allowImageType){
        		this.options.allowImageType = ['jpg','gif','png'];
        	}
        	if(!this.options.keystrokes){
        		this.options.keystrokes =   
        			[
                         [ OMEDITOR.ALT + 121 /*F10*/, 'toolbarFocus' ],
                         [ OMEDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' ],

                         [ OMEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],
                         [ OMEDITOR.CTRL + OMEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],

                         [ OMEDITOR.CTRL + 90 /*Z*/, 'undo' ],
                         [ OMEDITOR.CTRL + 89 /*Y*/, 'redo' ],
                         [ OMEDITOR.CTRL + OMEDITOR.SHIFT + 90 /*Z*/, 'redo' ],

                         [ OMEDITOR.CTRL + 76 /*L*/, 'link' ],

                         [ OMEDITOR.CTRL + 66 /*B*/, 'bold' ],
                         [ OMEDITOR.CTRL + 73 /*I*/, 'italic' ],
                         [ OMEDITOR.CTRL + 84 /*U*/, 'underline' ],

                         [ OMEDITOR.ALT + ( OMEDITOR.env.ie || OMEDITOR.env.webkit ? 189 : 109 ) /*-*/, 'toolbarCollapse' ],
                         [ OMEDITOR.ALT + 48 /*0*/, 'a11yHelp' ]
                     ];
        	}
        	if(!this.options.blockedBrowserKeystrokes){
        		this.options.blockedBrowserKeystrokes = 
        		[
                    OMEDITOR.CTRL + 66 /*B*/,
                    OMEDITOR.CTRL + 73 /*I*/,
                    OMEDITOR.CTRL + 85 /*U*/
                ];
        	}
        	this.options.blockedKeystrokes = this.options.blockedBrowserKeystrokes;
            var options=this.options;
            this.element.filter( 'textarea, div, p' ).each( function(){
                var $element = $( this ),
                editor = $element.data( 'omeditorInstance' ),
                element = this;
                if (!editor){
                    editor = OMEDITOR.replace( element, options );
                    $element.data( 'omeditorInstance', editor );
                }
            });  
        },
        _init: function() {
            
        },
        _get:function($el) {
            return $el.data('omeditorInstance');
        },
        /**
         * 获取editor的HTML内容。
         * @name omEditor#getData
         * @function
         * @returns omEditor的HTML内容
         * @example
         * $('#editor').omEditor('getData');
         */  
        getData:function(){
            var editor = this._get(this.element.eq(0));
            return editor.getData();
        },
        /**
         * 获取editor的内容。包含纯文本，不包含IMG、EMBED元素以及文本头尾的换行符和空格符。
         * @name omEditor#getPlainText
         * @function
         * @returns omEditor的文本内容
         * @example
         * $('#editor').omEditor('getPlainText');
         */         
        getPlainText:function(){
            var data = this.getData();
            data = data.replace(/<(?!img|embed).*?>/ig, '');
            data = data.replace(/&nbsp;/ig, ' ');
            
            data = data.replace(/<(?:img|embed).*?>/ig, '');
            data = data.replace(/\r\n|\n|\r/g, '');
            data = OMEDITOR.tools.trim(data);
            return data;  
        },
        
        /**
         * 设置editor的内容。
         * @name omEditor#setData
         * @function
         * @param params 要设置的内容
         * @example
         * $('#editor').omEditor('setData','&lt;a href="#"&gt;link&lt;/a&gt;');
         */
        setData:function(params){
            var _self = this;
            this.element.each(function(){
                var editor = _self._get($(this));
                editor.setData(params);
            });
        },
        /**
         * 设置editor为只读模式。
         * @name omEditor#setReadOnly
         * @function
         * @param params Boolean是否只读
         * @example
         * $('#editor').omEditor('setReadOnly', true);
         */
        setReadOnly:function(params){
            var _self = this;
            this.element.each(function(){
                var editor = _self._get($(this));
                editor.setReadOnly(params);
            });
        },
        /**
         * 插入HTML内容。
         * @name omEditor#insertHtml
         * @function
         * @param params 要插入的HTML内容
         * @example
         * $('#editor').omEditor('insertHtml', '&lt;a href="#"&gt;link&lt;/a&gt;');
         */        
        insertHtml:function(params){
            var _self = this;
            this.element.each(function(){
                var editor = _self._get($(this));
                editor.insertHtml(params);
            }); 
        },
        /**
         * 插入文本内容。
         * @name omEditor#insertText
         * @function
         * @param params 要插入的内容
         * @example
         * $('#editor').omEditor('insertText', 'new text');
         */        
        insertText:function(params){
            var _self = this;
            this.element.each(function(){
                var editor = _self._get($(this));
                editor.insertText(params);
            });
        },
        /**
         * 更新&lt;textarea&gt;元素，取而代之的是在编辑器中当前的数据。
         * @name omEditor#updateElement
         * @function
         * @example
         * $('#editor').omEditor('updateElement');
         */
        updateElement:function(){
        	var _self = this;
        	this.element.each(function(){
        		var editor = _self._get($(this));
        		editor.updateElement();
        	});
        }
    });
})(jQuery);