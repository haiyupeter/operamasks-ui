/*
 * operamasks-ui omSuggestion 0.1
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
;(function($){
    var suggestionRowClass='om-suggestion-list-row';
    var suggestionHighLightClass='om-state-hover';
    /**
     * @name omSuggestion
     * @author 周发志
     * @class 
     * &nbsp;&nbsp;&nbsp;&nbsp;Ajax提示组件。类似于google首页的搜索功能（在输入的同时下拉框里给出可用的提示，用户可以从里面选择一个）。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;将该功能添加到一个input输入框上，将允许用户在输入的同时可以快速地查找和选择所要的内容。当输入框得到焦点并输入字符时，该组件会将用户输入的内容以Ajax方式发送到服务器进行处理，服务器处理完后返回一个数据集，客户端将数据集显示成一个可选列表，用户可以从可选列表中很方便地选择自己所要查找的东西。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;目前该组件主要用于从远程URL取得数据（如果是本地数据的话，可以使用omCombo组件，它也有边输入边过滤的功能）。一般用于从大量数据中进行查找的场合，如百度搜索、google搜索、taobao商品搜索、邮件系统快速输入收件人。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;该组件有客户端缓存的功能，如输入a开始Ajax查找；再输入b（输入框内容是ab）再次Ajax查找；再删除b（输入框内容是a）将不进行Ajax查找，因为缓存中已经有key=a的缓存内容，将直接根据缓存内容来重构可选列表而不发送Ajax请求从服务器取数。如果不需要缓存可以将cacheSize参数设成0。如果要清除缓存可以调用clearCache()方法。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;实际应用中一般都要控制可选列表框中记录的数目（如百度搜索、google搜索、taobao商品搜索的可选列表中记录数都为10，有道搜索的可选列表中记录数为8），这个要由服务器进行控制，服务器返回数据时请不要返回得太多（比如从数据库中查询时一般使用TOP-N查询）。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用普通数组，也可使用JSON数组</li>
     *      <li>支持鼠标操作和键盘操作</li>
     *      <li>支持数据的客户端缓存</li>
     *      <li>提供丰富的事件</li>
     *      <li>用户可定制数据的显示效果</li>
     *      <li>用户可定制请求的发送与处理</li>
     *      <li>支持跨域请求数据</li>
     * </ol><br/>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#input1').omSuggestion({
     *         dataSource:'/suggestion.json',
     *         minChars :3,
     *         listMaxHeight:40
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;input id="input1"/>
     * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：
     */
    $.widget('om.omSuggestion', {
        options:/** @lends omSuggestion#*/{
            /**
             * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
             * @type Boolean
             * @default false
             */
            disabled : false,
            /**
             * 组件是否只读。如果是只读，则不可以输入，form提交时将会包含这个输入框。
             * @type Boolean
             * @default false
             */
            readOnly : false,
            /**
             * 输入框输入字符数大于等于minChars时，才发送请求。<b>注意：如果要页面一显示完就开始提示，可以设成0。</b>
             * @type Number
             * @default 1
             */
            minChars : 1,
            /**
             * 发送请求的延迟时间（单位是毫秒）。比如设成300，假设输入时每隔100ms输入一个字符，则快速输入1234时，只会在4输入完成后300ms才进行一次提示。<b>注意：如果此属性值设成0或负数则不会延迟</b>
             * @type Number
             * @default 500
             */
            delay : 500,
            /**
             * 本地缓存的数目。组件针对每一次输入值进行缓存，如果缓存中存在输入域中的输入值，不再发送ajax请求取数。<br/>
             * <b>注意：该属性值必须为非负整数。设置cacheSize:0禁用缓存</b>
             * @type Number
             * @default 10
             */
            cacheSize : 10,
            /**
             * Ajax请求时的方式，取值GET'或'POST'。
             * @type String
             * @default 'GET'
             */
            method : 'GET',
            /**
             * 下拉框的最大高度（单位是px）。<b>注意：由于浏览器的限制，这个属性的最小值是31，如果小于这个值时将看不到垂直滚动条</b>
             * @type Number
             * @default 300
             */
            listMaxHeight : 300,
            /**
             * 发送Ajax请求时代表输入值的参数名。比如url是'fetchData.jsp?type=book'，queryName是'q'，当前输入的值是'abc'，则最终发送请求的url是'fetchData.jsp?type=book&q=abc'。
             * @type String
             * @default 'key'
             */
            queryName : 'key',
            /**
             * Ajax请求是否需要跨域（从本页面所在的网站以外的地方取数）。
             * @type Boolean
             * @default false
             */
            crossDomain : false,
            /**
             * 数据成功响应后触发事件。<b>注意：此方法一定要返回处理后的结果。</b><br/>
             * 一个Ajax请求成功（不出错误也不超时）后会先执行onSuccess事件的监听器，如果它返回false则不显示下拉框。如果没有监听器或者监听没有返回false则执行此preProcess预处理，处理结束后开始刷新并显示下拉框。
             * @event
             * @name omSuggestion#preProcess
             * @type Function
             * @default 无
             * @example
             * //text是输入框的值,data是服务器返回的数据
             * preProcess:function(text,data){
             *     return $(data).each(function(){
             *         this.sex = this.sex==0?'男':'女';
             *     });
             * }
             */
            /**
             * Ajax请求的URL路径，所有的请求将由此URL来处理，处理结果必须返回一个JSON数组。
             * @name omSuggestion#dataSource
             * @type URL
             * @default 无
             * @example
             * dataSource:'/operamasks-ui/getData.json'
             */
            /**
             * 下拉框中每行显示内容的转换器。对dataSource进行格式化，如：[{"text":"中国","count":123},{"text":"中间件","count":42}]作为参数传递到clientFormatter属性进行格式化输出。<br/>
             * @name omSuggestion#clientFormatter
             * @type Function
             * @example
             * //对于非普通record一定要写这个属性
             * clientFormatter:function(data,index){
             *         return '&lt;b>'+data.text+'&lt;/b>(共找到'+data.count+'条记录)';
             * }
             * 
             * //对于普通的record也可以写这个属性
             * clientFormatter:function(data,index){
             *         return '&lt;span style="color:red">'+data+'&lt;/span>;
             * }
             */
            /**
             * 下拉框的宽度。必须为数字。<b>不设置时默认与输入框一样宽</b>
             * @name omSuggestion#listWidth
             * @type Number
             * @default 无
             */
            /**
             * 发送Ajax请求之前触发事件。<b>注意：return false将会阻止请求发送。无返回值或return true将继续发送请求</b>
             * @event
             * @param text 输入框里当前文本
             * @example
             * $('#inputID').omSuggestion({
             *         onBeforeSuggest:function(text){
             *                 if(text=='不文明用语'){
             *                         return false;//如果是不文明用语不进行提示
             *                 }else{
             *                         return true;
             *                 } 
             *         }
             * });
             */
            onBeforeSuggest : function(text){/*do nothing*/},
            /**
             * Ajax请求发送后响应回来前触发事件。
             * @event
             * @param text 输入框里当前文本
             * @example
             * $('#inputID').omSuggestion({
             *         onSuggesting:function(text){
             *                 $('#inputID').omSuggestion('showMessage','正在加载...'); 
             *         }
             * });
             */
            onSuggesting : function(text){/*do nothing*/},
            /**
             * Ajax响应回来时触发事件。
             * @event
             * @param data Ajax请求返回的数据
             * @param textStatus 响应的状态
             * @example
             * $('#inputID').omSuggestion({
             *         onSuccess:function(data, textStatus){
             *                 if(data.length==0){
             *                         $('#txt').omSuggestion('showMessage','无提示数据！');
             *                 } 
             *         }
             * });
             */
            onSuccess : function(data, textStatus){/*do nothing*/},
            /**
             * Ajax请求出错时触发事件。
             * @event
             * @param xmlHttpRequest XMLHttpRequest对象
             * @param textStatus  错误类型
             * @param errorThrown  捕获的异常对象
             * @example
             * $('#inputID').omSuggestion({
             *         onError:function(xmlHttpRequest, textStatus, errorThrown){
             *                 $('#txt').omSuggestion('showMessage','请求出错。原因：'+errorThrown.message); 
             *         }
             * });
             */
            onError : function(xmlHttpRequest, textStatus, errorThrown){/*do nothing*/},
            /**
             * 选择下拉框中一个后触发事件。
             * @event
             * @param text 输入框里当前文本
             * @param rowData 行记录，是Ajax请求返回的数据中的一行
             * @param index 当前行在下拉框所有行中的索引（第一行是0，第二行是1...）
             * @example
             * $('#inputID').omSuggestion({
             *         onSelect:function(rowData,text,index){
             *                 $('#searchbut').click(); //选择完后自动点击“查询”按钮
             *         }
             * });
             */
            onSelect : function(rowData,text,index){/*do nothing*/}
        },
        _create:function(){
            var options = this.options;
            var inputEl = this.element;
            inputEl.addClass('om-suggestion om-widget om-state-default om-state-nobg');
            //非法属性值修正
            if(options.minChars<0){
                options.minChars=0;
            }
            if(options.cacheSize<0){
                options.cacheSize=0;
            }
            if(options.delay<0){
                options.delay=0;
            }
            //开始构造
            var dropList = $($('<div class="om-widget"><div class="om-widget-content om-droplist"></div></div>').css('position', 'absolute').appendTo(document.body).children()[0]).hide();
            $.data(inputEl, 'dropList', dropList);
        },
        _init:function(){
            var options = this.options;
            var inputEl = this.element.attr('autocomplete', 'off');
            var dropList = $.data(inputEl, 'dropList');
            if (options.disabled) {
                this.disable();
            } else {
                this.enable();
            }
            if (options.readOnly) {
                inputEl.attr('readonly', 'readonly');
            } else {
                inputEl.removeAttr('readonly');
            }
            //绑定按键事件
            var self = this;
            
            inputEl.focus(function(){      
                $(this).addClass("om-state-focus");
            }).blur(function(){      
                $(this).removeClass("om-state-focus");
            }).bind('mouseenter mouseout',function(){      
                $(this).toggleClass("om-state-hover");
            }).keydown(function(e){
                if(e.keyCode == 9){ //hide the dropList when press [Tab] key
                    dropList.hide();
                }
            }).keyup(function(e){
                var key = e.keyCode;
                switch (key) {
                    case 40: //down
                        if (dropList.css('display') !== 'none') {
                            self._selectNext();
                        } else {
                            if (dropList.find('.' + suggestionRowClass).size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case 38: //up
                        if (dropList.css('display') !== 'none') {
                            self._selectPrev();
                        } else {
                            if (dropList.find('.' + suggestionRowClass).size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case 13: //enter
                        dropList.hide();
                        return false;
                    case 27: //esc
                        dropList.hide();
                        break;
                    case 9: //tab
                        //only trigger the blur event
                        break;
                    default:
                        if (options.disabled || options.readOnly) {
                            return false;
                        }
                        if (options.delay > 0) {
                            var delayTimer = $.data(inputEl, 'delayTimer');
                            if (delayTimer) {
                                clearTimeout(delayTimer);
                            }
                            delayTimer = setTimeout(function(){
                                self._suggest();
                            }, options.delay);
                            $.data(inputEl, 'delayTimer', delayTimer);
                        } else {
                            self._suggest();
                        }
                }
            }).mousedown(function(e){
                e.stopPropagation();
            });
            dropList.mousedown(function(e){
                e.stopPropagation();
            });
            $(document).bind('mousedown.omSuggestion',function(){
                dropList.hide();
            });
        },
        /**
         * 清空与此组件相关的缓存数据。每次提示后都会将结果集缓存（缓存的数目为config中配置的cacheSize），下次再需要对相同内容进行提示时会直接从缓存读取而不发送请求到服务器，如果需要忽略缓存而从服务器重新提示则可以调用此方法清除缓存。
         * @name omSuggestion#clearCache
         * @function
         * @returns 无
         * @example
         * $('#txt').omSuggestion('clearCache');
         */
        clearCache:function(){
            $.removeData(this.element,'cache');
        },
        /**
         * 在下拉框中显示一个提示信息（仅用于阅读，不可以通过快捷键或鼠标选择它）。
         * @name omSuggestion#showMessage
         * @function
         * @param message 要显示在下拉框中的消息
         * @example
         * $('#txt').omSuggestion('showMessage','请求数据出错');
         */
        showMessage: function(message){
            var inputEl = this.element;
            var dropList = $.data(inputEl, 'dropList').empty().css('height','auto');
            $('<div>' + message + '<div>').appendTo(dropList);
            dropList.parent().css('left', inputEl.offset().left).css('top',inputEl.offset().top+inputEl.outerHeight());
            var listWidth = this.options.listWidth;
            if (!listWidth) {//没有定义
                dropList.parent().width(inputEl.outerWidth());
            } else if (listWidth !== 'auto') {
                dropList.parent().width(listWidth);
            }
            dropList.show();
            var listMaxHeight = this.options.listMaxHeight;
            if(listMaxHeight !== 'auto'){
                if(dropList.height() > listMaxHeight){
                    dropList.height(listMaxHeight).css('overflow','auto');
                }
            }
            return this;
        },
        /**
         * 禁用组件。
         * @name omSuggestion#disable
         * @function
         * @example
         * $('#myinput').omSuggestion('disable');
         */
        disable:function(){
            return this.element.attr('disabled', 'disabled').addClass('om-state-disabled');
        },
        /**
         * 启用组件。
         * @name omSuggestion#enable
         * @function
         * @example
         * $('#myinput').omSuggestion('enable');
         */
        enable:function(){
            return this.element.removeAttr('disabled').removeClass('om-state-disabled');
        },
        /**
         * 设置新的请求地址，新地址表示参数的改变或者地址的改变。
         * @name omSuggestion#setData
         * @function
         * @param dataSource
         * @example
         * $('#country').change(function() {
         *   var v = $('#country').val();
         *   $('#txt').omSuggestion("setData","../../../advancedSuggestion.json?contry="+v+"&province=hunan");
         * });
         */
        setData:function(dataSource){
            var options = this.options;
            if(dataSource){
                options.dataSource = dataSource;
            }
			if(options.cacheSize > 0){
			    this.clearCache(); //清空缓存
			}
        },
        /**
         * 获取当前下拉框中的数据（服务器端返回的数据）。
         * @name omSuggestion#getData
         * @function
         * @return Array[Json]
         * @example
         * $('#txt').omSuggestion("getData");
         */
        getData:function(){
            var returnValue = $.data(this.element, 'records');
            return returnValue || null;
        },
        _clear:function(){
            var inputEl = this.element.val('');
            var dropList=$.data(inputEl, 'dropList');
            return dropList.find('.'+suggestionRowClass).removeClass(suggestionHighLightClass);
        },
        _selectNext:function(){
            var inputEl = this.element;
            var dropList = $.data(inputEl, 'dropList');
            var index = dropList.find('.' + suggestionHighLightClass).index();
            var all = this._clear();
            index += 1;
            if (index >= all.size()) {
                index = 0;
            }
            this._scrollToAndSelect(all,index,dropList);
        },
        _selectPrev:function(){
            var inputEl = this.element;
            var dropList=$.data(inputEl, 'dropList');
            var index=dropList.find('.'+suggestionHighLightClass).index();
            var all = this._clear();
            index-=1;
            if(index<0){
                index=all.size()-1;
            }
            this._scrollToAndSelect(all,index,dropList);
        },
        _scrollToAndSelect:function(all,index,dropList){
            var target = $(all.get(index)).addClass(suggestionHighLightClass);
            var targetTop = target.position().top;
            if (targetTop <= 0) {
                //需要向上滚动滚动条
                dropList.scrollTop(dropList.scrollTop() + targetTop);
            } else {
                //需要向下滚动滚动条
                var offset = targetTop + target.outerHeight() - dropList.height();
                if (offset > 0) {
                    dropList.scrollTop(dropList.scrollTop() + offset);
                }
            }
            this._select(index);
        },
        _select:function(index){
            var inputEl = this.element;
            var records=$.data(inputEl, 'records');
            var rowData,text;
            if(records.valueField){
                rowData=records.data[index];
                text=rowData[records.valueField];
            }else{
                rowData=records[index];
                text=rowData;
            }
            inputEl.val(text);
            $.data(inputEl, 'lastStr', text);
            //trigger onSelect handler
            var onSelect=this.options.onSelect;
            if(onSelect){
                onSelect(rowData,text,index);
            }
        },
        _suggest:function(){
            var inputEl = this.element;
            var text = inputEl.val();
            var last = $.data(inputEl, 'lastStr');
            if (last && last === text) {
                return;
            }
            $.data(inputEl, 'lastStr', text);
            var options = this.options;
            var cache = $.data(inputEl, 'cache');
            if (text.length > 0 && text.length >= options.minChars) {
                if (cache) {
                    var data = cache[text];
                    if (data) {//有缓存
                        $.data(inputEl, 'records', data);
                        this._buildDropList(data, text);
                        return;
                    }
                }
                //无缓存
                if (options.onBeforeSuggest) {
                    if (options.onBeforeSuggest(text) === false) {
                        $.data(inputEl, 'dropList').empty().hide();
                        return;
                    }
                }
                var self = this;
                var requestOption = {
                    url: options.dataSource,
                    type: options.method,
                    dataType: options.crossDomain ? 'jsonp':'json',
                    data: {},
                    success: function(data, textStatus){
                        var onSuccess = options.onSuccess;
                        if (onSuccess && onSuccess(data, textStatus) === false) {
                            return;
                        }
                        var preProcess = options.preProcess;
                        if(preProcess){
                            data = preProcess(text,data);
                        }
                        //如果有preProcess且没有返回值
                        if(typeof data === 'undefined'){
                            data=[];
                        }
                        //cache data
                        if (options.cacheSize > 0) {
                            var cache = $.data(inputEl, 'cache') ||
                            {
                                ___keys: []
                            };
                            var keys = cache.___keys;
                            if (keys.length == options.cacheSize) {
                                //cache满了先去掉一个
                                var k = keys[0];
                                cache.___keys = keys.slice(1);
                                cache[k] = undefined;
                            }
                            cache[text] = data;
                            cache.___keys.push(text);
                            $.data(inputEl, 'cache', cache);
                        }
                        $.data(inputEl, 'records', data);
                        //buildDropList
                        self._buildDropList(data, text);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        var onError = options.onError;
                        if (onError) {
                            onError(XMLHttpRequest, textStatus, errorThrown);
                        }
                    }
                };
                requestOption.data[options.queryName]=text;
                $.ajax(requestOption);
                var onSuggesting = options.onSuggesting;
                if (onSuggesting) {
                    onSuggesting(text);
                }
            } else {
                $.data(inputEl, 'dropList').empty().hide();
            }
        },
        _buildDropList:function(records,text){
            var inputEl = this.element;
            var dropList = $.data(inputEl, 'dropList').empty().css('height','auto');
            var isSimple = records.valueField ? false : true;
            var clientFormatter = this.options.clientFormatter;
            var self = this;
            if (isSimple) {
                if (clientFormatter) {
                    $(records).each(function(index){
                        self._addRow(clientFormatter(this, index), dropList);
                    });
                } else {
                    $(records).each(function(index){
                        self._addRow(this, dropList);
                    });
                }
            } else {
                if (clientFormatter) {
                    $(records.data).each(function(index){
                        self._addRow(clientFormatter(this, index), dropList);
                    });
                }
            }
            var all = dropList.find('.' + suggestionRowClass);
            if (all.size() > 0) {
                dropList.parent().css('left', parseInt(inputEl.offset().left)).css('top',inputEl.offset().top+inputEl.outerHeight());
                var listWidth = this.options.listWidth;
                if (!listWidth) {//没有定义
                    dropList.parent().width(inputEl.outerWidth());
                } else if (listWidth !== 'auto') {
                    dropList.parent().width(listWidth);
                }
                all.mouseover(function(){
                    all.removeClass(suggestionHighLightClass);
                    $(this).addClass(suggestionHighLightClass);
                }).mousedown(function(){
                    var index = dropList.find('.' + suggestionHighLightClass).index();
                    self._select(index);
                    dropList.hide();
                });
                dropList.show();
                var listMaxHeight = this.options.listMaxHeight;
                if(listMaxHeight !== 'auto'){
                    if(dropList.height() > listMaxHeight){
                        dropList.height(listMaxHeight).css('overflow','auto');
                    }
                }
                dropList.scrollTop(0);
            }
        },
        _addRow: function(html,dropList){
            //do replace
            $('<div class="' + suggestionRowClass + '">' + html + '</div>').appendTo(dropList);
        }
    });
    
})(jQuery);
