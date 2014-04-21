/*
 * $Id: om-combo.js,v 1.175 2012/06/26 08:39:27 linxiaomin Exp $
 * operamasks-ui omCombo @VERSION
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
    
    // Array.prototype.indexOf is added in JavaScript v1.6.
    // IE8 only support JavaScript v1.3. So added it to make this component support IE.
    if(!Array.prototype.indexOf){
        Array.prototype.indexOf=function(item){
            var len=this.length;
            for(var i=0;i<len;i++){
                if(this[i]===item){
                    return i;
                }
            }
            return -1;
        };
    }
	/**
     * @name omCombo
     * @class 下拉输入框组件。类似于html中的select，但是可以输入，可以过滤，可以使用远程数据。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用本地数据源，也可以使用远程数据源</li>
     *      <li>支持下拉框的缓加载（第一次显示时才初始化下拉框中的内容）</li>
     *      <li>用户可定制下拉框中数据的显示效果</li>
     *      <li>用户可定制选择后回填到输入框的文字</li>
     *      <li>用户可定制选择后组件的value值</li>
     *      <li>用户可定制下拉框的宽度和最大高度</li>
     *      <li>具有边输入边过滤的功能，也可定制过滤的算法</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#combo').omCombo({
     *         dataSource:[
     *                 {text:'Java',value:'1'},
     *                 {text:'JavaScript',value:'2'},
     *                 {text:'C',value:'3'},
     *                 {text:'PHP',value:'4'},
     *                 {text:'ASP',value:'5'}
     *         ],
     *         optionField:function(data,index){
     *             return '&lt;font color="red">'+index+'：&lt;/font>'+data.text+'('+data.value+')';
     *         },
     *         emptyText:'select one option!',
     *         value:'1',
     *         editable:false,
     *         lazyLoad:true,
     *         listMaxHeight:40
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;input id="combo"/>
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
	$.omWidget('om.omCombo', {
	    options: 
	       /** @lends omCombo#*/
	       {
                /**
                 * 将JSON对象中哪个字段作为option的text，可以指定为JSON的一个属性，也可以指定一个function来自己决定如何显示option的text。<br/><br/> 
                 * <ul>
                 * <li>对于[{"text":"Java语言","value":"java"},{"text":"C语言","value":"c"},{"text":"C#语言","value":"c#"}]这样的对象,此属性可以不设置，将采用默认值'text'。</li>
                 * <li>对于[{"label":"Java语言","id":"java"},{"label":"C语言","id":"c"},{"label":"C#语言","id":"c#"}]这样的对象,此属性可以设置为'label'。</li>
                 * <li>对于[{"name":"深圳","abbreviation":"sz","code":"0755"},{"name":"武汉","abbreviation":"wh","code":"027"},{"name":"北京","abbreviation":"bj","code":"010"}]这样的对象,此属性可以设置为</li>
                 * </ul>
                 * <br/>
                 * @type String or Function 
                 * @default 'text' 
                 * @example
                 * optionField:function(data,index){ 
                 *   return data.name+'('+ data.abbreviation+')'; 
                 * }  
                 * // 最后options分显示成"深圳(sz)、武汉(wh)、北京(bj)"这样的。
                 * // 当然也可以写成其它东西，如下面的代码可以实现options为左图片右文字的情况
                 * // return '&lt;img src="options.jpg" style="float:left"/>&lt;span style="float:right">' + data.value+'&lt;/span>'; 
                 */
                optionField : 'text',
                /**
                 * JSON对象中哪个字段作为option的value属性，可以指定为JSON的一个属性，也可以指定一个function来自己决定如何显示option的value。<br/><br/>
                 * <ul>
                 *   <li>[{"text":"Java语言","value":"java"},{"text":"C语言","value":"c"},{"text":"C#语言","value":"c#"}] 将采用默认值'value'。</li>
                 *   <li>[{"label":"Java语言","id":"java"},{"label":"C语言","id":"c"},{"label":"C#语言","id":"c#"}] 此属性可以设置为'id'。</li>
                 *   <li>[{"name":"深圳","abbreviation":"sz","code":"0755"},{"name":"武汉","abbreviation":"wh","code":"027"},{"name":"北京","abbreviation":"bj","code":"010"}]此属性可以设置为'code'</li>
                 * </ul>
                 * <br/>
                 * @type String , Function
                 * @default 'value'
                 * @example
                 * 如果JSON数据为
                 * [
                 *   {"name":"深圳","abbreviation":"sz","code":"0755"},
                 *   {"name":"武汉","abbreviation":"wh","code":"027"}
                 * ]
                 * function(data,index){
                 *    return data.code+'(' + data.abbreviation+')';
                 * } 
                 *  最后各options的值分别是"0755(sz)、027(wh)、010(bj)"这样的。
                 *  当然也可以写成其它复杂的东西，如return data.code.substring(1); 
                 *  以实现将区号前面的0去掉作为option的value这样的功能。
                 */
                valueField : 'value',
                /**
                 * 组件宽度。可以使用px、pt、em、auto，如'100px'、'10pt'、'15em'、'auto'
                 * @type String
                 * @default 'auto'
                 * @example
                 * width : '100px'
                 */
                width : 'auto',
                /**
                 * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
                 * @type Boolean
                 * @default false
                 * @example
                 * disabled : true
                 */
                disabled : false,
                /**
                 * 组件是否只读。如果是只读，则不可以输入，不可以通过下拉框选择一个option，form提交时将包含这个输入框。
                 * @type Boolean
                 * @default false
                 * @example
                 * readOnly : true
                 */
                readOnly : false,
                /**
                 * 组件是否可以输入。设成false时不可以输入，但可以从下拉框里选择一个option。
                 * @type Boolean
                 * @default true
                 * @example
                 * editable : true
                 */
                editable : true,
                /**
                 * 是否延迟加载下拉框里的选项，设成true时页面显示时不加载下拉框选项，第一次展开下拉框才加载。
                 * @type Boolean
                 * @default false
                 * @example
                 * lazyLoad : true
                 */
                lazyLoad : false,
                /**
                 * 组件的下拉框的最大高度，设成'auto'时高度不固定，有多少选项就显示多高；设成50时表示下拉框最大高度50px，如果超过这个则显示垂直滚动条。<b>注意：由于浏览器的限制，这个属性的最小值是31，如果小于这个值时将看不到垂直滚动条</b>
                 * @type Number
                 * @default 300
                 * @example
                 * listMaxHeight : 500
                 */
                listMaxHeight : 300,
                /**
                 * 组件的下拉框的宽度是否自动扩展。设成false时下拉框的宽度将与输入框宽度保持一致；设成true时下拉框宽度将等于最宽的那个选项的宽度。
                 * @type Boolean
                 * @default false
                 * @example
                 * listAutoWidth : true
                 */
                listAutoWidth : false,
                /**
                 * 是否自动过滤下拉框选项。设成true时下拉框中将仅显示与输入框当前值匹配（匹配算法由filterStrategy决定）的选项。
                 * @type Boolean
                 * @default true
                 * @example
                 * autoFilter : true
                 */
                autoFilter : true,
                /**
                 * 自动过滤下拉框选项采用的过滤算法。<b>注意：仅当autoFilter不为false时该属性才有效果</b><br/>
                 * 默认值为'first'表示从左边匹配（相当于startWith），即下拉框的选项的label以输入框的值开头的才会显示。<br/>
                 * 设为'last'表示从右边匹配（相当于endWith），即下拉框的选项的label以输入框的值结尾的才会显示。<br/>
                 * 设为'anywhere'表示从任意位置匹配（相当于contains），即下拉框的选项的label只要出现过与输入框的值一样的都会显示。<br/>
                 * 也可以设为一个自定义function，该function返回true表示匹配成功，将会显示在下拉列表中，返回true则不显示。
                 * @type String,Function
                 * @default 'first'
                 * @example
                 * //此属性可以设置为'first' 或 'last' 或 'anywhere' 或 
                 * function(text,record){ 
                 *      var reg=new RegExp(text); 
                 *      //只要当前记录的postCode属性或idCardNo属性中包含输入框的值就算匹配成功
                 *      return reg.test(record.postCode) || reg.test(record.idCradNo); 
                 * } 
                 */
                filterStrategy : 'first',
                /**
                 * 自动过滤下拉框选项延迟时间（单位：毫秒）。如果设成300则表示在300毫秒内输入连续按键多次，则只进行最后一次按键的过滤。<b>注意：仅当autoFilter不为false时该属性才有效果</b>
                 * @type Number
                 * @default 500
                 * @example
                 * filterDelay : 1000
                 */
                filterDelay : 500, 
                /**
                 * 是否强制选择。当属性值为true时，强制用户选择下拉列表中的选项，如果用户输入的字符非下拉项中的某项，当输入框失去焦点时，输入框将被清空。
                 * 属性值为false时，允许用户输入任意字符，当输入框失去焦点时，该字符串将作为value值。
                 * @type Boolean
                 * @default false
                 * @example
                 * forceSelction : false
                 */
                forceSelection: false,
                
                /**
                 * 是否支持多选，默认为 false。如果支持多选默认将不可编辑只可选择。
                 * @type Boolean
                 * @default false
                 * @example
                 *  multi : true
                 */
                multi : false, 
                
                /**
                 * 支持多选时的多个选项之间的分隔符，默认为 ','.
                 * @type String
                 * @default ','
                 * @example
                 *  multiSeparator : ';'
                 */
                multiSeparator : ','
                
                /**
                 * 数据源属性，可以设置为“后台获取数据的URL”或者“JSON数据”
                 * @name omCombo#dataSource
                 * @type Array[JSON],URL
                 * @default 无
                 * @example
                 * dataSource : '/operamasks-ui/getCountryNameServlet.json' 
                 * 或者
                 * dataSource : [{"value":"001","text":"张三"},{"value":"002","text":"李四"}]
                 */
                /**
                 * 当input框的值为空时，input框里出现提示消息。当input框得到焦点或者input框的值不为空时这个提示消息会自动消失。
                 * @name omCombo#emptyText
                 * @default 无
                 * @type String
                 * @example
                 * emptyText : '请输入值'
                 */
                /**
                 * combo组件的初始值。<b>注意：如果设置了value属性的值则lazyLoad属性将会被强制转换为false</b>
                 * @name omCombo#value
                 * @default 无
                 * @type String
                 * @example
                 * value : '北京'
                 */
                /**
                 * 填充下拉框内容的function。设置此属性时表示用户要自己接管从records到下拉框的显示过程，用户拿到所有的records然后自己填充下拉框里的内容，最后返回一个JQuery元素集合，集合里的每个元素表示一个option，按上下键选择时将会在这个集合的元素间循环高亮。
                 * @name omCombo#listProvider
                 * @type Function
                 * @default 无
                 * @returns {jQuery Array} 应该返回一个jQuery数组，里面的每个元素表示下拉框里的一个option（如下示例中下拉框里是一个table，tabody中的每个tr表示一个option，所以返回container.find('tbody tr')）。
                 * @example
                 * listProvider:function(container,records){ 
                 *      $('&lt;table&gt;').appendTo(container);
                 *      records.each(function(){ 
                 *          $('&lt;tr&gt;&lt;td&gt;'+this.text+'&lt;td&gt;&lt;/tr&gt;').appendTo(container); 
                 *      }); 
                 *      $('&lt;/table>').appendTo(container);
                 *      return container.find('tbody tr'); //tbody中每个tr表示一个option，而thead中的tr表示表头，不是option
                 *  } 
                 */
                 /**
                 * 将JSON对象的哪个字段作为显示到input框的文字。可以指定为JSON的一个属性，也可以指定一个function来自己决定显示什么文字到input框。<b>注意：这里的内容在选择一个option后会直接显示在input框里，所以只能显示普通字符串，不能使用html</b>
                 * @name omCombo#inputField
                 * @type String or Function
                 * @default 'text'
                 * @example
                 * //以JSON对象的userName属性值作为显示到输入框的文字
                 * inputField:'userName'
                 * 
                 * //自定义一个Function来决定以什么作为显示到输入框的文字
                 * inputField:function(data,index){ 
                 *      return data.text+'('+data.value+')';
                 * } 
                 */
                 /**
                 * omCombo的输入框的内容发生变化时的回调函数。
                 * @event
                 * @param target 当前输入框对象
                 * @param newValue 选择的新值
                 * @param oldValue 原来的值
                 * @param event jQuery.Event对象。
                 * @name omCombo#onValueChange
                 * @type Function
                 * @example
                 * onValueChange:function(target,newValue,oldValue,event){ 
                 *      //do something
                 *  } 
                 */
                 /**
                 * 以Ajax方式加载下拉列表中的内容出错时的回调函数。可以在这里进行一些处理，比如以人性化的方式提示用户。
                 * @event
                 * @param xmlHttpRequest XMLHttpRequest对象
                 * @param textStatus  错误类型
                 * @param errorThrown  捕获的异常对象
                 * @param event jQuery.Event对象。
                 * @name omCombo#onError
                 * @type Function
                 * @example
                 * onError:function(xmlHttpRequest, textStatus, errorThrown, event){ 
                 *      alert('An error occurred while load records from URL "'+url+'",the error message is:'+errorThrown.message);
                 *  } 
                 */
                 /**
                 * Ajax响应回来时执行的方法。
                 * @event
                 * @param data Ajax请求返回的数据
                 * @param textStatus 响应的状态
                 * @param event jQuery.Event对象。
                 * @name omCombo#onSuccess
                 * @type Function
                 * @example
                 * onSuccess:function(data, textStatus, event){
                 *     if(data.length==0){
                 *          $('#txt').omSuggestion('showMessage','没有数据！');
                 *     } 
                 * }
                 */
        },
        _init:function(){
            var options = this.options,
                inputEl = this.textInput,
                source = options.dataSource;
            
            if (!options.inputField) {
                options.inputField = options.optionField;
            }
            //由于在lazyLoad=false的情况下设置value时无法显示正确的fieldText
            if (typeof options.value !== 'undefined') {
                options.lazyLoad = false;
            }
            
            if (options.width != 'auto') {
                var span = inputEl.parent().width(options.width);
                inputEl.width(span.innerWidth() - inputEl.next().outerWidth() - inputEl.outerWidth() + inputEl.width());
            }
            /*if (!options.listAutoWidth) {
                this.dropList.width(inputEl.parent().width());
            }*/
            
            if (options.multi) {
                options.editable = this.options.editable = false;
            }
            
            this._refeshEmptyText(options.emptyText);
            
            options.disabled ? inputEl.attr('disabled', true) : inputEl.removeAttr('disabled');
            (options.readOnly || !options.editable) ? inputEl.attr('readonly', 'readOnly') : inputEl.removeAttr('readonly');
            
            if (!options.lazyLoad) {
                //load data immediately
                this._toggleLoading('add');
                if(source && typeof source == 'string'){
                    this._ajaxLoad(source);
                }else if(source && typeof source == 'object'){
                    this._loadData(source);
                    this._toggleLoading('remove');
                }else{
                    //neither records nor remote url was found
                    this.dataHasLoaded = true;
                    this._toggleLoading('remove');
                }
                
            } else {
                this.dataHasLoaded = false;
            }
            var unusable = options.disabled || options.readOnly;
            
            if (unusable) {
                this.expandTrigger.addClass('om-state-disabled');
            } else {
                this._bindEvent();
            }
        },
        _create:function(){
            var valueEl = this.element;
            var span = $('<span class="om-combo om-widget om-state-default"></span>').insertAfter(valueEl).wrapInner(valueEl);
            this.textInput = valueEl.clone().removeAttr("id").removeAttr("name").appendTo(span);
            this.expandTrigger = $('<span class="om-combo-trigger"></span>').appendTo(span);
            valueEl.hide();
            this.dropList = $($('<div class="om-widget"><div class="om-widget-content om-droplist"></div></div>').css({position:'absolute', zIndex:2000}).appendTo(document.body).children()[0]).hide();
        },
        /**
         * 重新加载下拉框里的数据，一般用于级联combo功能。
         * @name omCombo#setData
         * @function
         * @param arg records（JSON数组）或url
         * @example
         * //用一个固定的JSON数组来重新加载combo的下拉列表
         * $('#productCombo').omCombo('setData',[
         *      {"text":'Apusic Server',"value":"aas"},
         *      {"text":'Apusic OperaMasks SDK',"value":"aom"},
         *      {"text":'Apusic OperaMasks Studio',"value":"studio"}
         * ]);
         * 
         * //通过一个url来发送Ajax请求重新加载combo的下拉列表
         * $('#cityCombo').omCombo('setData',"../data/cityData.do?province="+$('#cityCombo').omCombo('value'));
         */
        setData:function(param){
            var self = this, inputEl = self.textInput, valueEl = self.element;
            self.options.value = '';
            valueEl.val('');
            inputEl.val('');
            self._toggleLoading('add');
            if (typeof param === 'string') {
                self._ajaxLoad(param);
            } else {
                self._loadData(param);
                self._toggleLoading('remove');
            }
        },
        /**
         * 获取combo的数据源，返回一个JSON数组。<b>注意：该数组和下拉项数组不是等同的，但存在一一对应的关系:前者经过格式化后能转变成后者</b>
         * @name omCombo#getData
         * @function
         * @returns 如果combo中有数据，则返回combo的数据源(一个由所有记录组成的JSON数组)；否则返回null
         * @example
         * //获取combo的数据源
         * var store = $('#productCombo').omCombo('getData');
         * 
         */
        getData:function(){
            //如果已经存在dataSource则直接取出
            var returnValue = this.options.dataSource;
            return (typeof returnValue == 'object') ? returnValue : null;
        },
        /**
         * 得到或设置combo的value值。
         * @function
         * @name omCombo#value
         * @param v 设置的值，不设置表示获取值
         * @returns 如果没有参数时表示getValue()返回combo的value值。如果有参数时表示setValue(newValue)返回jQuery对象。
         * 
         */
         value:function(v){
             if (typeof v === 'undefined') {
                 //var value = $(this.element).attr(_valueKey);
                 var value =this.element.val();
            	 return value ? value : '';
             } else {
                 this._setValue(v+'');
                 return this;
             }
         },
        /**
         * 禁用组件。
         * @name omCombo#disable
         * @function
         * @example
         * $('#mycombo').omCombo('disable');
         */
        disable:function(){
            var input=this.element;
            //distroy event listening
            input.attr('disabled', true).unbind();
            this.options.disabled = true;
            this.expandTrigger.addClass('om-state-disabled').unbind();
        },
        /**
         * 启用组件。
         * @name omCombo#enable
         * @function
         * @example
         * $('#mycombo').omCombo('enable');
         */
        enable:function(){
            var input=this.element;
            input.removeAttr('disabled').unbind();
            this.options.disabled = false;
            this.expandTrigger.removeClass('om-state-disabled').unbind();
            //rebuild event listening
            this._bindEvent();
        },
        destroy:function(){
        	var $input = this.element;
        	$(document).unbind('mousedown.omCombo',this.globalEvent);
        	$input.parent().after($input).remove();
        	this.dropList.parent().remove();
        },
        //private
        _bindEvent:function(){
            var self = this, options = self.options,input = self.textInput, 
            valueEl = self.element, dropList = self.dropList,
            expandTrigger = self.expandTrigger, emptyText = options.emptyText;
            var isFocus = false, span = input.parent('span');
            span.mouseenter(function(){   
               if(!options.disabled){
                   span.addClass("om-state-hover");
               }
            }).mouseleave(function(){      
                span.removeClass("om-state-hover");
            }).mousedown(function(e){
                e.stopPropagation(); //document的mousedown会隐藏下拉框，这里要阻止冒泡
            });
            input.focus(function(){
                if(isFocus) 
                    return;
                isFocus = true;
                $('.om-droplist').hide(); //hide all other dropLists
                span.addClass('om-state-focus');
                //input.addClass('om-span-field-focus');
                //input.parent('span').
                //expandTrigger.addClass('om-state-hover');
                self._refeshEmptyText(emptyText);
                if (!self.dataHasLoaded) {
                    if(!expandTrigger.hasClass('om-loading')){
                        self._toggleLoading('add');
                        if (typeof(options.dataSource) == 'object') {
                            self._loadData(options.dataSource);
                            self._toggleLoading('remove');
                        } else if (typeof(options.dataSource) == 'string') {
                            self._ajaxLoad(options.dataSource);
                        } else {
                            //neither records nor remote url was found
                            self.dataHasLoaded = true;
                            self._toggleLoading('remove');
                        }
                    }
                }
                if (!options.disabled && !options.readOnly) {
                    self._showDropList();
                }
            }).blur(function(e){
                isFocus = false;
                span.removeClass('om-state-focus');
                input.removeClass('om-combo-focus');
                //expandTrigger.removeClass('om-trigger-hover');
                if (!options.disabled && !options.readOnly && !options.multi) {
                    if (self.hasManualInput) {
                        //如果有手工输入过值，在blur时检查是否是合法的值，如果不是要清除不合法的输入并还原成输入前的值
                        self.hasManualInput = false;
                        var text = input.val();
                        if (text !== '') {
                            var allInputText = $.data(valueEl, 'allInputText');
                            var allValues = $.data(valueEl, 'allValues');
                            var index = allInputText.indexOf(text);
                            if (index > -1) {
                                self._setValue(allValues[index]);
                            } else if(!options.forceSelection){ //如果输入的值在data里面不存在，则设置key和vlue为同一输入的值
                                valueEl.val(input.val());
                            }else{
                            	var value = valueEl.val();
                                index = allValues.indexOf(value);
                                if (index > -1) {
                                    input.val(allInputText[index]);
                                } else {
                                    input.val('');
                                }
                            }
                        }else{
                        	valueEl.val('');
                    	}
                    }
                    self._refeshEmptyText(emptyText);
                }
            }).keyup(function(e){
                var key = e.keyCode,
                    value = $.om.keyCode;
                switch (key) {
                    case value.DOWN:
                        self._selectNext();
                        break;
                    case value.UP: 
                        self._selectPrev();
                        break;
                    case value.ENTER: 
                        self._backfill(self.dropList.find('.om-state-hover'));
                        break;
                    case value.ESCAPE: 
                        dropList.hide();
                        break;
                    case value.TAB:
                        //only trigger the blur event
                        break;
                    default:
                        //fiter功能
                        self.hasManualInput = true;
                        if (!options.disabled && !options.readOnly && options.editable && options.autoFilter) {
                            if (window._omcomboFilterTimer) {
                                clearTimeout(window._omcomboFilterTimer);
                            }
                            window._omcomboFilterTimer = setTimeout(function(){
                                if($(document).attr('activeElement').id == input.attr('id')){//当焦点在当前输入框的时候才显示下拉框，否则隐藏
                                    dropList.show();
                                }
                                self._doFilter(input);
                            }, options.filterDelay);
                        }
                }
            });
            dropList.mousedown(function(e){
                e.stopPropagation(); //document的mousedown会隐藏下拉框，这里要阻止冒泡
            });
            expandTrigger.click(function(){
                !expandTrigger.hasClass('om-loading') && input.focus();
            }).mousedown(function(){
                !expandTrigger.hasClass('om-loading') && span.addClass('om-state-active');
            }).mouseup(function(){
                !expandTrigger.hasClass('om-loading') && span.removeClass('om-state-active');
            });
            $(document).bind('mousedown.omCombo',this.globalEvent=function(){
                dropList.hide();
            });
        },
        _showDropList:function(){
        	var self = this, options = self.options, 
        	    inputEl = self.textInput, valueInput = self.element,
          	    dropList = self.dropList.scrollTop(0).css('height','auto'),
         	    valuedItem = null,
         	    nowValue = valueInput.val(),
         	    $listRows = dropList.find('.om-combo-list-row'),
         	    allItems = self._getAllOptionsBeforeFiltered().removeClass('om-helper-hidden om-state-hover');
            
        	if(allItems.length<=0){ //如果下拉框没有数据
                return;
            }
            $listRows.removeClass('om-combo-selected');
            if (nowValue !== undefined && nowValue !== '') {
                var allValues = $.data(valueInput, 'allValues');
                if (options.multi) {
                    var selectedValues = nowValue.split(options.multiSeparator);
                    for (var i=0; i<selectedValues.length; i++) {
                        var index = allValues.indexOf(selectedValues[i]);
                        if (index > -1) {
                            $(dropList.find('.om-combo-list-row').get(index)).addClass('om-combo-selected');
                        }
                    }
                    valueItem = selectedValues[0];
                } else {
                    var index = allValues?allValues.indexOf(nowValue):-1;
                    if (index > -1) {
                        valuedItem = $(dropList.find('.om-combo-list-row').get(index)).addClass('om-combo-selected');
                    }
                }
            }
            var dropListContainer = dropList.parent(), span = inputEl.parent();
            if (!options.listAutoWidth) {
                dropListContainer.width(span.outerWidth());
            }else{
            	if($.browser.msie&&($.browser.version == "7.0")&&!$.support.style){
            		dropListContainer.width(dropList.show().outerWidth());
            	}else{
            		dropListContainer.width(dropList.outerWidth());
            	}
            }
            if (options.listMaxHeight != 'auto' && dropList.show().height() > options.listMaxHeight) {
                dropList.height(options.listMaxHeight).css('overflow-y','auto');
            }
            var inputPos = span.offset();
            dropListContainer.css({
                'left': inputPos.left,
                'top': inputPos.top + span.outerHeight()
            });
            dropList.show();
            if (valuedItem) { //自动滚动滚动条到高亮的行
                dropList.scrollTop($(valuedItem).offset().top - dropList.offset().top);
            }
        },
        _toggleLoading:function(type){
            if(!this.options.disabled){
                if (type == 'add') {
                    this.expandTrigger.removeClass('om-icon-carat-1-s').addClass('om-loading');
                } else if (type == 'remove') {
                    this.expandTrigger.removeClass('om-loading').addClass('om-icon-carat-1-s');
                }
            }
        },
        _ajaxLoad:function(url){
            var self=this;
            var options = this.options;
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                success: function(data, textStatus){
                    self.dataHasLoaded = true;
                    var onSuccess = options.onSuccess;
                    if (onSuccess && self._trigger("onSuccess", null, data, textStatus) === false) {
                        options.dataSource = data;
                        return;
                    }
                    self._loadData(data);
                    self._toggleLoading('remove');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    self.dataHasLoaded = true; // 必须设置为true，否则在lazyLoad为true的时候会陷入死循环
                    if (options.onError) {
                        self._toggleLoading('remove');
                        self._trigger("onError", null, XMLHttpRequest, textStatus, errorThrown);
                    } else {
                        self._toggleLoading('remove');
                        throw new Error('An error occurred while load records from URL "' + url + '",the error message is:' + errorThrown.message);
                    }
                }
            });
        },
        _loadData:function(records){
            var options = this.options,
                valueEl = this.element;
            options.dataSource = records;
            this.dataHasLoaded = true;
            //build all inputText
            var inputField = options.inputField;
            var allInputText = [];
            if (typeof inputField === 'string') {
                $(records).each(function(){
                    allInputText.push(this[inputField]);
                });
            } else {
                $(records).each(function(index){
                    allInputText.push(inputField(this, index));
                });
            }
            $.data(valueEl, 'allInputText', allInputText);
            //build all value
            var valueField = options.valueField;
            var allValues = [];
            if (typeof valueField === 'string') {
                $(records).each(function(){
                    allValues.push('' + this[valueField]);
                });
            } else {
                $(records).each(function(index){
                    allValues.push('' + valueField(this, index));
                });
            }
            $.data(valueEl, 'allValues', allValues);
            //build dropList
            var dropList = this.dropList.empty();
            if (options.listProvider) {
                var selectableOptions = options.listProvider(dropList, records);
                if (selectableOptions) {
                    selectableOptions.each(function(){
                        $(this).addClass('om-combo-list-row');
                    });
                }
            } else {
                var optionField = options.optionField;
                var innerHtml = '';
                var self = this;
                if (typeof optionField === 'string') {
                    $(records).each(function(index){
                        innerHtml += self._wrapText(this[options.optionField]);
                    });
                } else {
                    $(records).each(function(index){
                        innerHtml += self._wrapText(options.optionField(this, index));
                    });
                }
                if (innerHtml) {
                    $(innerHtml).appendTo(dropList);
                    dropList.show().css('height','auto');
                    if (options.listMaxHeight != 'auto' && dropList.height() > options.listMaxHeight) {
                        dropList.height(options.listMaxHeight).css('overflow-y','auto');
                    }
                    dropList.hide();
                    if(valueEl.parent().hasClass('om-state-hover')){
                        self._showDropList();
                    }
                }
            }
           
            if (options.value) {
                this._setValue('' + options.value);
            }
            this._bindEventsToList();
        },
        _bindEventsToList:function(){
        	var self = this,
        	items = self._getAllOptionsBeforeFiltered();
            items.hover(function(){
                items.removeClass('om-state-hover');
                $(this).addClass('om-state-hover');
            }, function(){
                $(this).removeClass('om-state-hover');
            }).mousedown(function(){
                self._backfill(this);
            });
        },
        _wrapText:function(text) {
            return '<div class="om-combo-list-row">' + text + '</div>';
        },
        _setValue:function(value){
            var input = this.textInput, valueEl = this.element;
            var valueChange = true ;
            var oldValue = valueEl.val();
            var options = this.options;
            if(value == oldValue){
                valueChange = false ;
            }
            var allValues = $.data(valueEl, 'allValues');
            
            var inputText = [], values=[];
            if (options.multi) {
                values = value.split(options.multiSeparator);
            } else {
                values.push(value);
            }
            for (var i=0; i<values.length; i++) {
                var index = allValues?allValues.indexOf(values[i]):-1;
                if (index > -1) {
                    inputText.push($.data(valueEl, 'allInputText')[index]);
                } else if(!options.forceSelection){
                	//与getValue保持一致，当setValue的值不在allVlues中，则将value值作为text显示在输入框中。bug616。
                	inputText.push(value);
                }else{
                	valueEl.val('');
                    value = '';
                }
            }
            valueEl.val(value);
            if (options.multi) {
                input.val(inputText.join(options.multiSeparator));
            } else {
                input.val(inputText.join(''));
            }
            options.value = value;
            // trigger onValueChange event
            if (options.onValueChange && valueChange) {
            	this._trigger("onValueChange",null,input,value,oldValue);
            }
            //refresh the emptyText
            this._refeshEmptyText(options.emptyText);
        },
        
        _findHighlightItem : function() {
            var dropList = this.dropList;
            var hoverItem = dropList.find('.om-state-hover');
            
            // only one item hover
            if (hoverItem.length > 0) {
                return hoverItem;
            }
            var selectedItems = dropList.find('.om-combo-selected');
            return selectedItems.length > 0 ? selectedItems[0] : selectedItems;
        },
        
        _selectPrev:function(){
            var highLightItem = this._findHighlightItem();
            var all = this._getAllOptionsAfterFiltered();
            var nowIndex = all.index(highLightItem);
            var currentItem = $(all[nowIndex]);
            if (nowIndex === 0) {
                nowIndex = all.length;
            } else if (nowIndex == -1) {
                nowIndex = all.length;
            }
            var preNeighborItem = $(all[nowIndex - 1]);
            this._highLisghtAndScrollTo(currentItem,preNeighborItem);
        },
        _selectNext:function(){
            var dropList = this.dropList;
            if (dropList.css('display') == 'none') {
                this._showDropList();
                return;
            }
            var all = this._getAllOptionsAfterFiltered();
            var nowIndex = all.index(this._findHighlightItem());
            var currentItem = $(all[nowIndex]);
            if (nowIndex == all.length - 1) {
                nowIndex = -1;
            }
            var nextNeighbor = $(all[nowIndex + 1]);
            this._highLisghtAndScrollTo(currentItem,nextNeighbor);
        },
        _highLisghtAndScrollTo: function(currentItem, targetItem){
            var dropList = this.dropList;
            currentItem.removeClass('om-state-hover');
            targetItem.addClass('om-state-hover');
            if (targetItem.position().top <= 0) {
                dropList.scrollTop(dropList.scrollTop() + targetItem.position().top);
            } else if (targetItem.position().top + targetItem.outerHeight() > dropList.height()) {
                dropList.scrollTop(dropList.scrollTop() + targetItem.position().top + targetItem.outerHeight() - dropList.height());
            }
        },
        _backfill:function(source){
            if (source.length === 0) {
                return;
            }
                
            var self = this, valueEl = self.element,
            dropList = self.dropList,
            options = self.options,
            enableMulti = options.multi;
            
            if (enableMulti) {
                $(source).toggleClass('om-combo-selected').removeClass('om-state-hover');
            } else {
                this._getAllOptionsBeforeFiltered().removeClass('om-combo-selected');
                $(source).addClass('om-combo-selected');
            }
            
            if (dropList.css('display') == 'none') {
                return;
            }
            var value = [], selectedIndexs = dropList.find('.om-combo-selected');
            for (var i=0; i<selectedIndexs.length; i++) {
                var nowIndex = $(selectedIndexs[i]).index();
                if (nowIndex > -1) {
                    value.push($.data(valueEl, 'allValues')[nowIndex]);
                }
            }
            
            this._setValue(value.join(enableMulti ? options.multiSeparator : ''));
            if (!enableMulti) {
                dropList.hide();
            }
        },
        _getAllOptionsBeforeFiltered:function(){
            return this.dropList.find('.om-combo-list-row');
        },
        _getAllOptionsAfterFiltered:function(){
            var dropList=this.dropList;
            return dropList.find('.om-combo-list-row').not(dropList.find('.om-helper-hidden'));
        },
        _doFilter:function(){
        	var self = this, inputEl = self.textInput, valueEl = self.element, options = self.options;
            records = options.dataSource,
            filterStrategy = options.filterStrategy,
            text = inputEl.val(),
            needShow=false,
            items = self._getAllOptionsBeforeFiltered(),
            allInputText = $.data(valueEl, 'allInputText');
            
            $(records).each(function(index){
                if (self._filetrPass(filterStrategy, text, records[index], allInputText[index])) {
                    $(items.get(index)).removeClass('om-helper-hidden');
                    needShow=true;
                } else {
                    $(items.get(index)).addClass('om-helper-hidden');
                }
            });
            var dropList = this.dropList.css('height','auto');
            //过滤后重新计算下拉框的高度，看是否需要出现滚动条
            if (options.listMaxHeight != 'auto' && dropList.height() > options.listMaxHeight) {
                dropList.height(options.listMaxHeight).css('overflow-y','auto');
            }
            if(!needShow){
                dropList.hide();
            }
        },
        _filetrPass:function(filterStrategy,text,record,inputText){
            if (text === '') {
                return true;
            }
            if (typeof filterStrategy === 'function') {
                return filterStrategy(text, record);
            } else {
                if (filterStrategy === 'first') {
                    return inputText.indexOf(text) === 0;
                } else if (filterStrategy === 'anywhere') {
                    return inputText.indexOf(text) > -1;
                } else if (filterStrategy === 'last') {
                    var i = inputText.lastIndexOf(text);
                    return i > -1 && i + text.length == inputText.length;
                } else {
                    return false;
                }
            }
        },
        _refeshEmptyText: function(emptyText){
            var inputEl = this.textInput;
            if(!emptyText)
                return;
            if (inputEl.val() === '') {
                inputEl.val(emptyText).addClass('om-empty-text');
            } else {
                if(inputEl.val() === emptyText){
                    inputEl.val('');
                }
                inputEl.removeClass('om-empty-text');
            }
        }
	});
})(jQuery);