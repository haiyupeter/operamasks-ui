/*
 * $Id: om-grid.js,v 1.164 2012/06/29 09:20:32 chentianzhen Exp $
 * operamasks-ui omGrid @VERSION
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
 *  om-resizable.js
 */
 
/**
     * @name omGrid
     * @class 表格组件。类似于html中的table，支持后台数据源、分页、自动列宽、单选/多选、行样式、自定义列渲染等功能。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>使用远程数据源</li>
     *      <li>支持分页展现</li>
     *      <li>自动添加行号</li>
     *      <li>允许某列的宽度自动扩充（该列宽度等于表格总宽度送去其它列宽度之和）</li>
     *      <li>允许所有列自动缩放（自动缩放各列的宽度，使得它适应表格的总宽度）</li>
     *      <li>可以定制隔行样式，也可以根据记录的不同使用不同的行样式</li>
     *      <li>可以定制各列的显示效果</li>
     *      <li>可以设置表头和表体自动换行</li>
     *      <li>可以改变列宽</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     *  $(document).ready(function() {
     *      $('#mytable').omGrid({
     *          height : 250,
     *          width : 600,
     *          limit : 8, //分页显示，每页显示8条
     *          singleSelect : false, //出现checkbox列，可以选择同时多行记录
     *          colModel : [    {header:'编号',name:'id', width:100, align : 'center'},
     *                          {header:'地区',name:'city', width:250, align : 'left',wrap:true},
     *                          {header:'地址',name:'address', width:'autoExpand',renderer:function(value,rowData,rowIndex){ return '&lt;b>'+value+'&lt/b>'; }}
     *          ],
     *          dataSource : 'griddata.json' //后台取数的URL
     *      });
     *  });
     * &lt;/script>
     * 
     * &lt;table id="mytable"/>
     * </pre>
     * 
     * 后台返回的数据格式如下（可以不包含空格换行等格式内容，大括号内的各属性顺序可任意交换）：<br/>
     * <pre>
     * {"total":126, "rows":
     *     [
     *         {"address":"CZ88.NET ","city":"IANA保留地址","id":"1"},
     *         {"address":"CZ88.NET ","city":"澳大利亚","id":"2"},
     *         {"address":"电信","city":"福建省","id":"3"},
     *         {"address":"CZ88.NET ","city":"澳大利亚","id":"4"},
     *         {"address":"CZ88.NET ","city":"泰国","id":"5"},
     *         {"address":"CZ88.NET ","city":"日本","id":"6"},
     *         {"address":"电信","city":"广东省","id":"7"},
     *         {"address":"CZ88.NET ","city":"日本","id":"8"}
     *     ]
     * }
     * </pre>
     * 
     * <b>其它特殊说明：</b><br/>
     * 单击一行时有可能会触发onRowSelect、onRowDeselect、onRowClick这些事件中一个一个或多个。具体结果是这样的：
     * <ol>
     *     <li>单选（一次只能选择一行）表格：①如果该行还未被选中，先触发其它已选择的行的onRowDeselect事件监听再触发该行的onRowSelect事件监听②触发该行的onRowClick事件监听。</li>
     *     <li>多选（一次可以选择多行）表格：①如果该行还未被选中，先触发该行的onRowSelect事件监听，如果该行已经选中，则先触发该行的onRowDeselect事件监听②触发该行的onRowClick事件监听。</li>
     * </ol>
     * 
     * 请求参数说明
     * <ol>
     * 		<li>组件在请求数据时会加上start和limit两个参数。比如请求第一页数据时url会自动添加上 start=0&limit=20。 </li>
     * </ol>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
;(function($) {
    $.omWidget('om.omGrid', {
        options:/** @lends omGrid#*/{
            //外观
            /**
             * 表格高度，设为数字时单位为px,也可以设为'fit'，表示自适应父容器高度。
             * @default 462
             * @type Number
             * @example
             * $('.selector').omGrid({height : 300});
             */
            height:462,
            /**
             * 表格宽度，设为数字时单位为px,也可以设为'fit'，表示自适应父容器宽度。
             * @type Number,String
             * @default '100%'
             * @example
             * $('.selector').omGrid({width : 600});
             */
            width:'100%',
            /**
             * 列数据模型。每一个元素都是一个对象字面量，定义该列的各个属性，这些属性包括:<br/>
             * header : 表头文字。<br/>
             * name : 与数据模型对应的字段。<br/>
             * align : 列文字对齐方式，可以为'left'、'center'、'right'之中的一个。<br/>
             * renderer : 列的渲染函数，接受3个参数，v表示当前值，rowData表示当前行数据，rowIndex表示当前行号(从0开始)，<br/>
             * width : 列的宽度，取值为Number或者'autoExpand'。注意只能有一个列被设置为'autoExpand'属性。<br/>
             * wrap : 是否自动换行，取值为true或者false。<br/>
             * @type Array[JSON]
             * @default false
             * @example
             * 
             * $(".selector").omGrid({
             *      colModel : [ {
             *              header : '地区',          //表头文字
             *              name : 'city',          //与数据模型对应的字段
             *              width : 120,            //列宽,可设置具体数字，也可设置为'autoExpand'，表示自动扩展
             *              align : 'left',         //列文字对齐
             *              renderer : function(v, rowData , rowIndex) {   //列渲染函数，接受3个参数，v表示当前值，rowData表示当前行数据，rowIndex表示当前行号(从0开始)
             *                  return '&lt;b>'+v+'&lt;/b>';  //地区这一列的文字加粗显示
             *              }
             *          }, {
             *              header : '地址',
             *              name : 'address',
             *              align : 'left',
             *              width : 'autoExpand'
             *          } 
             *      ]
             * });
             */
            colModel:false,
            /**
             * 是否自动拉伸各列以适应表格的宽度（比如共2列第一列宽度100第二列宽度200，则当表格总宽度是600px时第一列自动会变成200px第二列宽度会自动变成400px，而如果表格总宽度是210px时第一列自动会变成70px第二列宽度会自动变成140px）。<b>注意：只有所有列的宽度都不是'autoExpand'时该属性才会起作用。</b>
             * @default false
             * @type Boolean
             * @example
             * $('.selector').omGrid({autoFit : true});
             */
            autoFit:false,
            /**
             * 是否在最左边显示序号列。
             * @default true
             * @type Boolean
             * @example
             * $('.selector').omGrid({showIndex : false});
             */
            showIndex:true,
            //数据源
            /**
             * ajax取数方式对应的url地址。
             * @type String
             * @default 无
             * @example
             * //下面的示例设置的url，表示将从griddata.json这个地址取数，同时附带有start和limit两个请求参数。
             * //该文件必须返回一段具有特定格式（格式可参考文档的“预览”页签的说明）的JSON数据，omGrid拿到该数据即可用来填充表格。
             * $('.selector').omGrid({url:'griddata.json'});
             */
            dataSource:false,
             /**
             * ajax取数时附加到请求的额外参数。<b>注意：这里JSON的value值只能使用普通值，比如可以设置为{key1:1,key2:'2',key3:0.2,key4:true,key5:undefined}这样，但是不可以设置为{key1:[]}或{key2:{a:1,b:2}}，因为[]和{a:1,b:2}都不是普通值</b>
             * @type JSON
             * @default {}
             * @example
             * //下面的示例在Ajax取数时将从griddata.json这个地址取数，同时附带有start、limit、googType、localtion这4个请求参数。
             * //真正的URL地址可能是griddata.json?start=0&limit=10&goodType=1&location=beijing
             * $('.selector').omGrid({url:'griddata.json',extraData:{googType:1,localtion:'beijing'} });
             */
            extraData:{},
            /**
             * 使用GET请求还是POST请求来取数据，取值为：'POST'或'GET'。
             * @type String
             * @default 'GET'
             * @example
             * $('.selector').omGrid({method : 'POST'});
             */
            method:'GET',
            /**
             * 正在取数时显示在分页条上的提示。
             * @name omGrid#loadingMsg
             * @type String
             * @default '正在加载数据，请稍候...'
             * @example
             * $('.selector').omGrid({loadingMsg : '取数中...'});
             */
            //loadingMsg:$.om.lang.omGrid.loadingMsg,
            /**
             * 取数完成后但是后台没有返回任何数据时显示在分页条上的提示。
             * @name omGrid#emptyMsg
             * @type String
             * @default '没有数据'
             * @example
             * $('.selector').omGrid({emptyMsg : 'No data!'});
             */
            //emptyMsg:$.om.lang.omGrid.emptyMsg,
            /**
             * 取数发生错误时显示在分页条上的提示。
             * @name omGrid#errorMsg
             * @type String
             * @default '取数出错'
             * @example
             * $('.selector').omGrid({emptyMsg : '应用异常，请与网站管理员联系!'});
             */
            //errorMsg:$.om.lang.omGrid.errorMsg,
            /**
             * 取数成功后的预处理，可以在取数成功后开始显示数据前对后台返回的数据进行一次预处理。<b>注意：此方法一定要返回一个值</b>。
             * @type Function
             * @default 无
             * @example
             * //将后台返回的数据中所有记录的id属性改名成name属性，并将sex中的0/1分别转换为'男'或'女'。
             * //如后台返回{"total":35,"rows":[{id:1,sex:0,password:'abc'},{id:2,sex:1,password:'def'}]}
             * //转换后结果为{"total":35,"rows":[{name:1,sex:'男',password:'abc'},{name:2,sex:'女',password:'def'}]}
             * $('.selector').omGrid({preProcess : function(data){
             *          var temp;
             *          for(var i=0,len=data.rows.length;i&lt;len;i++){
             *              temp=data.rows[i];
             *              temp.name=temp.id;
             *              temp.id=undefined;
             *              temp.sex= temp.sex==0?'男':'女';
             *          }
             *          return data;
             *      }
             * });
             */
            preProcess:false,
            //分页
            /**
             * 每页数据条数，比如每页要显示10条则设成10。<b>注意：如果设成0或负数则不分页</b>。此属性仅用于取数不用于显示（即如果limit设成10，取数时告诉后台要10条数据，如果后台非要返回15条数据，则页面会显示出15条而不是10条数据）。
             * @type Number
             * @default 15
             * @example
             * $('.selector').omGrid({limit : 15});
             */
            limit:15,
            /**
             * 每页数据条数切换器，将显示为分页条上的一个下拉框。<b>注意：如果设成false则不显示下拉框</b>。
             * @type Array
             * @default [15,30,50]
             * @example
             * $('.selector').omGrid({limits : [10,20,30]});
             */
            limits:[15,30,50],
            /**
             * 显示在分页条上“上一页”和“下一页”按钮之间的文字。在显示时其中的{totalPage}会被替换为总页数，{index}会被替换为一个输入框（默认显示当前的页号，用户可以输入任意数字然后回车来跳转到指定的页）。
             * @name omGrid#pageText
             * @type String
             * @default '第{index}页，共{totalPage}页'
             * @example
             * $('.selector').omGrid({pageText : '共{totalPage}页，转到{index}页'});
             */
            //pageText:$.om.lang.omGrid.pageText,
            /**
             * 显示在分页条上的统计文字。在显示时其中的{total}会被替换为总记录数，{from}和{to}会被替换为当前显示的起止行号。比如可能会显示成'共125条数据，显示21-30条'。
             * @name omGrid#pageStat
             * @type String
             * @default '共{total}条数据，显示{from}-{to}条'
             * @example
             * $('.selector').omGrid({pageStat : '总共有{total}条记录，当前正在显示第{from}行至第{to}行'});
             */
            //pageStat:$.om.lang.omGrid.pageStat,
            //行显示
            /**
             * 行样式，默认显示成斑马纹（奇偶行背景不一样）。当然用户也可以定义成3行一循环或5行一循环。也可以定义成一个Function来根据行数据不同显示成不同的样式（比如一个显示学生成绩的表格中把不及格的记录整行显示成红色背景，满分的记录整行显示成绿色背景）。
             * @type Array或Function
             * @default ['oddRow','evenRow']
             * @example
             * 
             * //示例1：结果表格中第1/4/7/10...行的tr会加上样式class1；
             * //第2/5/8/11...行的tr会加上样式class2；
             * //第3/6/9/12...行的tr会加上样式class3
             * $('.selector').omGrid({rowClasses : ['class1','class2','class2']});
             * 
             * //示例2：满分的行加上样式fullMarks，不及格的行加上样式flunk，其它行使用默认样式。
             * $('.selector').omGrid({rowClasses : function(rowIndex,rowData){
             *          if(rowData.score==100){
             *              reuturn 'fullMarks';
             *          }else if(rowData.score<60){
             *              return 'flunk';
             *          }
             *      }
             * });
             */
            rowClasses:['oddRow','evenRow'],
            //行选择
            /**
             * 是否只能单选（一次只能选择一条记录，选择第二条时第一条会自动取消选择）。若设置为false表示可以多选（选择其它行时原来已经选择的将继续保持选择状态）。<b>注意：设成true时将不会出现checkbox列，设成false则将自动出现checkbox列</b>。
             * @type Boolean
             * @default true
             * @example
             * $('.selector').omGrid({singleSelect : false});
             */
            singleSelect:true,
            
            /**
             * 设置组件的标题
             * @type String
             * @default ''
             * @example
             * $('.selector').omGrid({title : 'Data Grid'});
             */
            title: '',
            
            //event
            /**
             * 选择一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param event jQuery.Event对象。
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowSelect:function(rowIndex,rowData,event){
             *          alert('the '+rowIndex+'th row has been selected!');
             *      }
             *  });
             */
            onRowSelect:function(rowIndex,rowData,event){},
            /**
             * 取消一行记录的选择后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param event jQuery.Event对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowDeselect:function(rowIndex,rowData,event){
             *          alert('the '+rowIndex+'th row has been deselected!');
             *      }
             *  });
             */
            onRowDeselect:function(rowIndex,rowData,event){},
            /**
             * 单击一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param event jQuery.Event对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowClick:function(rowIndex,rowData,event){
             *          alert('the '+rowIndex+'th row has been clicked!city='+rowData.city);
             *      }
             *  });
             */
            onRowClick:function(rowIndex,rowData,event){},
            /**
             * 双击一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param event jQuery.Event对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowDblClick:function(rowIndex,rowData,event){
             *          alert('the '+rowIndex+'th row has been double clicked!city='+rowData.city);
             *      }
             *  });
             */
            onRowDblClick:function(rowIndex,rowData,event){},
            /**
             * 改变分页<b>之前</b>执行的方法。<b>注意：如果此方法返回false则不进行分页切换或跳转</b>。
             * @event
             * @type Function
             * @param type 切换类型，是'first'、'prev'、'next'、'last'、'input'之一。
             * @param newPage 要转到的页号（从1开始，第一页是1而不是0）
             * @param event jQuery.Event对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onPageChange:function(type,newPage,event){
             *          alert('will goto page '+newPage);
             *      }
             *  });
             */
            onPageChange:function(type,newPage,event){},
            /**
             * 从后台取数成功时执行的方法。
             * @event
             * @type Function
             * @param data 取回来的数据（ 格式是{"total":35,"rows":[{"id":11,"city":"河南省安阳市","address":"电信"},{"id":12,"city":"北京市","address":"北龙中网科技有限公司"},{"id":13,"city":"澳大利亚","address":"CZ88.NET"}]}  ）。
             * @param testStatus 响应的状态（参考jQuery的$.ajax的success属性）
             * @param XMLHttpRequest XMLHttpRequest对象（参考jQuery的$.ajax的success属性）
             * @param event jQuery.Event对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onSuccess:function(data,testStatus,XMLHttpRequest,event){
             *          alert('fetch data success,got '+data.rows+' rows');
             *      }
             *  });
             */
            onSuccess:function(data,testStatus,XMLHttpRequest,event){},
            /**
             * 从后台取数失败时执行的方法。
             * @event
             * @type Function
             * @param XMLHttpRequest XMLHttpRequest对象（参考jQuery的$.ajax的error属性）
             * @param testStatus 响应的状态（参考jQuery的$.ajax的error属性）
             * @param errorThrown 捕获的异常对象（参考jQuery的$.ajax的error属性）
             * @param event jQuery.Event对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onError:function(XMLHttpRequest,textStatus,errorThrown,event){
             *          alert('fetch data error');
             *      }
             *  });
             */
            onError:function(XMLHttpRequest,textStatus,errorThrown,event){},
            /**
             * 数据已全部显示到表体中后执行的方法。
             * @event
             * @type Function
             * @param nowPage 当前页号(第一页是1第二页是2)
             * @param pageRecords 当前页的所有记录
             * @param event jQuery.Event对象
             * @default 无
             * @example
             * //数据显示完后自动选中所有地址是'电信'的行。
             *  $(".selector").omGrid({
             *      signleSelect:false,
             *      onRefresh:function(nowPage,pageRecords,event){
             *          var rows=[];
             *          $(pageRecords).each(function(i){
             *              if(this.address=='电信'){
             *                  rows.push(i);
             *              }
             *          });
             *          $('.selector').omGrid('setSelections',rows);
             *      }
             *  });
             */
            onRefresh:function(nowPage,pageRecords,event){},
            /**
             *当重新刷新时的回调方法列表(仅内部使用)
            */
            _onRefreshCallbacks : [],
            
            /**
             * 当标题列改变大小后的回调事件列表，主要用于行编辑插件。(仅内部使用)
             */
            _onResizableStopCallbacks : [],
            
            /**
             * 当标题列改变大小过程中不断触发的回调事件列表(仅内部使用)
             */
            _onResizableCallbacks : [],
            
            /**
             * 当调用resize方法动态改变宽高时的回调事件列表
             */ 
            _onResizeCallbacks : []
        },
        //private methods
        _create:function(){
            var options=this.options,el=this.element.show() // show if hidden
                .attr({
                    cellPadding : 0,
                    cellSpacing : 0,
                    border : 0
                })
                .empty()
                .append('<tbody></tbody>');
            el.wrap('<div class="om-grid om-widget om-widget-content"><div class="bDiv" style="width:auto"></div></div>').closest('.om-grid');
            if(!$.isArray(this._getColModel())){
                return; //如果colModel没设置或值不对，什么也不做
            }
            
            this.hDiv = $('<div class="hDiv om-state-default"></div>').append('<div class="hDivBox"><table cellPadding="0" cellSpacing="0"></table></div>');
            el.parent().before(this.hDiv);
            this.pDiv=$('<div class="pDiv om-state-default"></div>');
            el.parent().after(this.pDiv);
            
            var grid = el.closest('.om-grid');
            this.loadMask=$('<div class="gBlock"><div align="center" class="gBlock-valignMiddle" ><div class="loadingImg" style="display:block"/></div></div>')
                    .mousedown(function(e){
                        return false;  //禁用双击（默认双击全把div下面的内容全选）
                    })
                    .hide();
            grid.append(this.loadMask);
            
            this.titleDiv = $("<div class='titleDiv'></div>");
            grid.prepend(this.titleDiv);
            
            this.tbody=this.element.children().eq(0);
            this._guid = 0;//对于每一行都添加一个 "_row_id"以进行唯一标识
            
            options._onRefreshCallbacks.push(function(){
            	this._refreshHeaderCheckBox();
            });
            
            //事件绑定
            this._bindScrollEnvent();
        },
        _init:function(){
        	var $el=this.element,
        		ops = this.options,
                $grid = $el.closest('.om-grid');
            
            this._measure($grid , ops);

            if(!$.isArray(this._getColModel())){
                return; //如果colModel没设置或值不对，什么也不做
            }
            //远程取数时额外带的参数，注意，这仅供内部使用，外部使用的是 this.options.extraData
            this._extraData = {};
            
            this.tbody.empty();
            $('table', this.hDiv).empty();
            this.pDiv.empty();
            this.titleDiv.empty();
            this._buildTableHead();
            this._buildPagingToolBar();
            this._buildLoadMask();
            this._bindSelectAndClickEnvent();
            this._makeColsResizable();
            this._buildTitle();
            
            this._resetHeight();
            this.pageData={nowPage:1,totalPages:1};
            this._populate();
        },
        /**
		 * 改变组件的大小。
		 * @name omGrid#resize
		 * @function
		 * @param position (1)可以为Object,格式如{width:500,height:250} <br/>
		 *                 (2)只有一个参数表示width,有两个参数时依次表示width,height
		 * @example
		 * $(".selector").omGrid("resize" , 500);<br />//把宽度改为500像素。
		 * $(".selector").omGrid("resize" , 500 , 250);<br />//把宽度改为500像素，高度改为250像素。
		 * $(".selector").omGrid("resize" , {height:300});<br />//把高度改为300像素。
		 * $(".selector").omGrid("resize" , {width:'fit',height:'fit'});<br />//把宽度和高度同时改为自适应父容器大小。
		 * 
		 */
        resize : function(position){
        	var self = this,
        		ops = this.options,
        		$grid = this.element.closest('.om-grid');

		 	position = position || {};
		 	ops.width = position.width || arguments[0] || ops.width;
		 	ops.height = position.height || arguments[1] || ops.height;
		 	
		 	this._measure($grid , ops);
		 	this._buildLoadMask();
            this._resetWidth();
            this._resetHeight();
            $.each(ops._onResizeCallbacks , function(index , fn){
            	fn.call(self);
            });
        },
        _measure : function($grid , ops){
        	$grid.outerWidth(ops.width==='fit'?$grid.parent().width():ops.width);  
            $grid.outerHeight(ops.height==='fit'?$grid.parent().height():ops.height);
        },
        _resetHeight : function(){
        	var $el = this.element,
                $grid = $el.closest('.om-grid');
        	
        	var headerHeight = this.hDiv.outerHeight(true),
                pagerHeight = this.pDiv.is(":hidden")? 0 : this.pDiv.outerHeight(true),
                titleHeight = this.titleDiv.is(":hidden")? 0 : this.titleDiv.outerHeight(true);
                
            $grid.children('.bDiv').outerHeight($grid.height() - headerHeight - pagerHeight - titleHeight);
        },
        _resetWidth : function(){
        	var cms = this._getColModel(),
        		autoExpandColIndex = -1,
        		$thead = $('thead',this.hDiv),
        		allColsWidth = 0;
        		
        	$.each(cms , function(index , cm){
        		var cmWidth = cm.width || 60;
        		if(cm.width == 'autoExpand'){
                    cmWidth = 0;
                    autoExpandColIndex = index;
                }
                $thead.find("th[axis='col"+index+"'] >div").width(cmWidth);
				allColsWidth += cmWidth;
        	});
        	
        	this._fixHeaderWidth(autoExpandColIndex , allColsWidth);
        	
            var headerWidth = {};
            $(this._getHeaderCols()).each(function(){
            	headerWidth[$(this).attr("abbr")] = $('div',$(this)).width();
            });
            
            //修正body中各个td宽度
            this.tbody.find("td[abbr]").each(function(index , td){
            	var name = $(td).prop("abbr");
            	if(headerWidth[name] != null){
            		$(td).find(">div:first").width(headerWidth[name] );
            	}
            });
        }, 
        _getColModel : function(){
        	return this.options.colModel;
        },
        _buildTitle : function() {
        	var $title = this.titleDiv;
            if (this.options.title) {
                $title.html("<div class='titleContent'>" + this.options.title + "</div>").show();
            }else{
            	$title.empty().hide();
            }
        },
        _fixHeaderWidth:function(autoExpandColIndex , allColsWidth){
        	var $grid = this.element.closest('.om-grid'),
        		$thead = $('thead',this.hDiv),
        		cms = this._getColModel(),
        		ops = this.options;
        	
        	if(autoExpandColIndex != -1){ //说明有某列要自动扩充
                var tableWidth = $grid.width() - 32,
                	toBeExpandedTh = $thead.find('th[axis="col'+autoExpandColIndex+'"] div');
                	
                //虽然toBeExpandedTh.parent().width()为0,但不同浏览器在计算下边的thead.width()竟然有差异(Chrome)，所以干脆先隐藏了，保证所有浏览器计算thead.width()值一致
                toBeExpandedTh.parent().hide();
                var usableWidth = tableWidth - $thead.width();
                toBeExpandedTh.parent().show();
                if(usableWidth <= 0){
                    toBeExpandedTh.css('width',60);
                }else{
                    toBeExpandedTh.css('width',usableWidth);
                }
            }else if(ops.autoFit){
                var tableWidth = $grid.width() - 22,
                    usableWidth = tableWidth - $thead.width(),
                    percent = 1 + usableWidth/allColsWidth,
                    toFixedThs = $thead.find('th[axis^="col"] >div');
                 
                $.each(cms , function(index){
                	var $th = toFixedThs.eq(index);
                    $th.width(parseInt($th.width()*percent));
                }); 
            }
        },
        _buildTableHead:function(){
            var op=this.options,
                el=this.element,
                cms=this._getColModel(),
                allColsWidth = 0, //colModel的宽度
                autoExpandColIndex = -1;
                thead=$('<thead></thead>');
                tr=$('<tr></tr>').appendTo(thead);
            //渲染序号列
            if(op.showIndex){
                var cell=$('<th></th>').attr({axis:'indexCol',align:'center'}).addClass('indexCol').append($('<div class="indexheader" style="text-align:center;width:25px;"></div>'));
                tr.append(cell);
                indexWidth=25;
            }
            //渲染checkbox列
            if(!op.singleSelect){
                var cell=$('<th></th>').attr({axis:'checkboxCol',align:'center'}).addClass('checkboxCol').append($('<div class="checkboxheader" style="text-align:center;width:17px;"><span class="checkbox"/></div>'));
                tr.append(cell);
                checkboxWidth=17;
            }
            //渲染colModel各列
            for (var i=0,len=cms.length;i<len;i++) {
                var cm=cms[i],cmWidth = cm.width || 60,cmAlign=cm.align || 'center';
                if(cmWidth == 'autoExpand'){
                    cmWidth = 0;
                    autoExpandColIndex = i;
                }
                var thCell=$('<div></div>').html(cm.header).css({'text-align':cmAlign,width:cmWidth});
                cm.wrap && thCell.addClass('wrap');
                var th=$('<th></th>').attr('axis', 'col' + i).addClass('col' + i).append(thCell);
                if(cm.name) {
                    th.attr('abbr', cm.name);
                }
                if(cm.align) {
                    th.attr('align',cm.align);
                }
                //var _div=$('<div></div>').html(cm.header).attr('width', cmWidth);
                allColsWidth += cmWidth;
                tr.append(th);
            }
            //tr.append($('<th></th'));
            el.prepend(thead);
            
            
            $('table',this.hDiv).append(thead);
            this._fixHeaderWidth(autoExpandColIndex , allColsWidth);
            this.thead=thead;
            thead = null;
        },
        _buildPagingToolBar:function(){
            var op=this.options;
            if(op.limit<=0){
            	this.pDiv.css("border-width" , 0).hide();
            	this.pager = this.pDiv;//即使不出现分页条，这里仍然指定其引用，这样有些地方可以不用每次都要判断是否要分页
                return;
            }
            var self=this,
                el=this.element,
                pDiv= this.pDiv;
           
            pDiv.show().html('<div class="pDiv2">'+
                    '<div class="pGroup">'+
                    '<div class="pFirst pButton om-icon"><span class="om-icon-seek-start"></span></div>'+
                    '<div class="pPrev pButton om-icon"><span class="om-icon-seek-prev"></span></div>'+
                '</div>'+
                '<div class="btnseparator"></div>'+
                '<div class="pGroup"><span class="pControl"></span></div>'+
                '<div class="btnseparator"></div>'+
                '<div class="pGroup">'+
                    '<div class="pNext pButton om-icon"><span class="om-icon-seek-next"></span></div>'+
                    '<div class="pLast pButton om-icon"><span class="om-icon-seek-end"></span></div>'+
                '</div>'+
                '<div class="btnseparator"></div>'+
                '<div class="pGroup">'+
                    '<div class="pReload pButton om-icon"><span class="om-icon-refresh"></span></div>'+
                '</div>'+
                '<div class="btnseparator"></div>'+
                '<div class="pGroup"><span class="pPageStat"></span></div>'+
            	'</div>');
            var limits=op.limits;
            if($.isArray(limits) && limits.length>0){
            	var limitsHtml='<select class="pLimits">';
            	$.each(limits,function(){
            		limitsHtml+='<option>'+this+'</option>';
            	});
            	limitsHtml+='</select><div class="btnseparator"></div>';
            	$(limitsHtml).prependTo($('.pDiv2',pDiv)).change(function(){
            		op.limit=$(this).val();
                    self.reload(1);
            	});
            }
            var pageText = $.om.lang._get(op,"omGrid","pageText").replace(/{totalPage}/, '<span>1</span>').replace(/{index}/, '<input type="text" size="4" value="1" />');
            $('.pControl',pDiv).html(pageText);
            el.parent().after(pDiv);
            $('.pReload', pDiv).click(function() {
                self._populate();
            });
            $('.pFirst', pDiv).click(function() {
                self._changePage('first');
            });
            $('.pPrev', pDiv).click(function() {
                self._changePage('prev');
            });
            $('.pNext', pDiv).click(function() {
                self._changePage('next');
            });
            $('.pLast', pDiv).click(function() {
                self._changePage('last');
            });
            $('.pControl input', pDiv).keydown(function(e) {
                if (e.keyCode == $.om.keyCode.ENTER) {
					self._changePage('input');
				}
            });
            $('.pButton', pDiv).hover(function() {
                $(this).addClass('om-state-hover');
            }, function() {
                $(this).removeClass('om-state-hover');
            });
            this.pager = pDiv;
        },
        _buildLoadMask:function(){
            var grid = this.element.closest('.om-grid');
            this.loadMask.css({width:"100%",height:grid.height()});
        },
        _changePage : function(ctype) { // change page
            if (this.loading) {
                return true;
            }
            var el=this.element,
                pageData = this.pageData,
                nowPage=pageData.nowPage,
                totalPages=pageData.totalPages,
                newPage = nowPage;
            this._oldPage = nowPage;//保存好旧的页数，有些插件如sort是需要用到的
            switch (ctype) {
                case 'first':
                    newPage = 1;
                    break;
                case 'prev':
                    if (nowPage > 1) {
                        newPage = nowPage - 1;
                    }
                    break;
                case 'next':
                    if (nowPage < totalPages) {
                        newPage = nowPage + 1;
                    }
                    break;
                case 'last':
                    newPage = totalPages;
                    break;
                case 'input':
                    var nv = parseInt($('.pControl input', el.closest('.om-grid')).val());
                    if (isNaN(nv)) {
                        nv = nowPage;
                    }
                    if (nv < 1) {
                        nv = 1;
                    } else if (nv > totalPages) {
                        nv = totalPages;
                    }
                    $('.pControl input', this.pDiv).val(nv);
                    newPage = nv;
                    break;
                default:
                    if (/\d/.test(ctype)) {
                        var nv = parseInt(ctype);
                        if (isNaN(nv)) {
                            nv = 1;
                        }
                        if (nv < 1) {
                            nv = 1;
                        } else if (nv > totalPages) {
                            nv = totalPages;
                        }
                        $('.pControl input', el.closest('.om-grid')).val(nv);
                        newPage = nv;
                    }
            }
            if (newPage == nowPage) {
                return false;
            }
            //触发事件
            if(this._trigger("onPageChange",null,ctype,newPage)===false){
                return;
            }
            //修改pageData
            pageData.nowPage=newPage;
            //刷新数据
            this._populate();
        },
        //刷新数据
        _populate : function() { // get latest data
            var self=this,
                el = this.element,
                grid = el.closest('.om-grid'),
                op = this.options,
                pageStat = $('.pPageStat', grid);
            $('.pPageStat', grid).css('color','');
            if (!op.dataSource) {
                $('.pPageStat', grid).html(op.emptygMsg);
                return false;
            }
            if (this.loading) {
                return true;
            }
            var pageData = this.pageData,
                nowPage = pageData.nowPage || 1,
                loadMask = $('.gBlock',grid);
            //具备加载数据的前提条件了，准备加载
            this.loading = true;
            pageStat.html($.om.lang._get(op,"omGrid","loadingMsg"));
            loadMask.show();
            var limit = (op.limit<=0)?100000000:op.limit;
            var param =$.extend(true,{},this._extraData,op.extraData,{
                start : limit * (nowPage - 1),
                limit : limit,
                _time_stamp_ : new Date().getTime()
            });
            $.ajax({
                type : op.method,
                url : op.dataSource,
                data : param,
                dataType : 'json',
                success : function(data,textStatus,request) {
                    if (typeof(op.onSuccess) == 'function') {
                        self._trigger("onSuccess",null,data,textStatus,request);
                    }
                    self._addData(data);
                    for(var i=0 , len=op._onRefreshCallbacks.length; i<len; i++){
                    	op._onRefreshCallbacks[i].call(self);
                    }
                    self._trigger("onRefresh",null,nowPage,data.rows);
                    loadMask.hide();
                    self.loading = false;
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    pageStat.html($.om.lang._get(op,"omGrid","errorMsg")).css('color','red');
                    try {
                        var onError = op.onError;
                        if (typeof(onError) == 'function') {
                            onError(XMLHttpRequest, textStatus, errorThrown);
                        }
                    } catch (e) {
                        // do nothing 
                    } finally {
                        loadMask.hide();
                        self.loading = false;
                        self.pageData.data={rows:[],total:0};//出错时重新设置，不然self.pageData.data可能为undefined，其它地方就要做多余空处理
                    }
                    return false;
                }
            });
        },
        _addData:function(data){
            var op = this.options,
                preProcess = op.preProcess,
                pageData=this.pageData;
            //预处理
            preProcess && (data=preProcess(data));
            pageData.data=data;
            pageData.totalPages = Math.ceil(data.total/op.limit);
            //刷新分页条
            this._buildPager();
            this._renderDatas();
        },
        _buildPager:function(){
            var op=this.options;
            if(op.limit<=0){
                return;
            }
            var pager=this.pager,
                pControl=$('.pControl',pager),
                pageData = this.pageData,
                nowPage=pageData.nowPage,
                totalPages=pageData.totalPages,
                data=pageData.data,
                from=op.limit* (nowPage-1)+1,
                to=from-1+data.rows.length,
                pageStat='';
            if(data.total===0){
                pageStat=$.om.lang._get(op,"omGrid","emptyMsg");
            }else{
                pageStat = $.om.lang._get(op,"omGrid","pageStat").replace(/{from}/, from).replace(/{to}/, to).replace(/{total}/, data.total);
            }
            $('input',pControl).val(nowPage);
            $('span',pControl).html(totalPages);
            $('.pPageStat', pager).html(pageStat);
        },
        _renderDatas:function(){
            var self=this,
                el=this.element,
                op=this.options,
                gridHeaderCols = this._getHeaderCols(),
                rows=this.pageData.data.rows || [],
                colModel=this._getColModel(),
                rowClasses=op.rowClasses,
                tbody=$('tbody',el).empty(),
                isRowClassesFn= (typeof rowClasses === 'function'),
                pageData = this.pageData,start=(pageData.nowPage-1)*op.limit,
                tdTmp = "<td align='$' abbr='$' class='$'><div align='$' class='innerCol $' style='width:$px'>$</div></td>",//td模板
                headerWidth = [],
                bodyContent = [],
                cols,
                j;
            
            if(!this.pageData.data.rows){
            	this.pageData.data.rows = [];//修复
            }
            self.hDiv.scrollLeft(0);
            
            $(gridHeaderCols).each(function(index){
            	headerWidth[index] = $('div',$(this)).width();
            });
    		
            $.each(rows,function(i, rowData) {
                var rowCls = isRowClassesFn? rowClasses(i,rowData):rowClasses[i % rowClasses.length];
                var rowValues=self._buildRowCellValues(colModel,rowData,i);
                bodyContent.push("<tr _grid_row_id="+(self._guid++)+" class='om-grid-row " + rowCls + "'>");
               
               	$(gridHeaderCols).each(function(index){
                    var axis = $(this).attr('axis'),wrap=false,html;
                    if(axis == 'indexCol'){
                        html=i+start+1;
                    }else if(axis == 'checkboxCol'){
                        html = '<span class="checkbox"/>';
                    }else if(axis.substring(0,3)=='col'){
                        var colIndex=axis.substring(3);
                        html=rowValues[colIndex];
                        if(colModel[colIndex].wrap){
							wrap=true;
						} 
                    }else{
                        html='';
                    }
                    cols = [this.align , this.abbr , axis , this.align , wrap?'wrap':'', headerWidth[index] , html];
                    j=0;
                    bodyContent.push(tdTmp.replace(/\$/g , function(){
                    	return cols[j++];
                    }));
                });
                bodyContent.push("</tr>");
            });
           	tbody.html(bodyContent.join(" ")); 
        },
        _getHeaderCols:function(){
        	return this.hDiv.find("th[axis]");
        },
        _buildRowCellValues:function(colModel,rowData,rowIndex){
            var values=[];
            for(var i=0,len=colModel.length;i<len;i++){
                var c=colModel[i],
                	r=c.renderer,
                	n=c.name,
                	v;
                try{
                	v=eval("rowData."+n);
                }catch(ex){
                	$.error("Unknown field '"+n+"' of rowData!");
                }
                if(v === undefined){
                	v = "";
                }
                if(typeof r === 'function'){
                    v=r(v,rowData,rowIndex);
                }
                values[i]=v;
            }
            return values;
        },
        //滚动水平滚动条时让表头和表体一起滚动（如果没有这个方法则只有表体滚动，表头不会动，表头和表体就对不齐了）
        _bindScrollEnvent:function(){
            this.tbody.closest('.bDiv').scroll(function(){
              $(this).prev().scrollLeft($(this).scrollLeft());
            });
        },
        //绑定行选择/行反选/行单击/行双击等事件监听
        _bindSelectAndClickEnvent:function(){
            var self=this;
            this.tbody.unbind();
            //如果有checkbox列则绑定事件
            if(!this.options.singleSelect){ //可以多选
                // 全选/反选,不需要刷新headerChekcbox的选择状态
                $('th.checkboxCol span.checkbox',this.thead).click(function(){
                    var thCheckbox=$(this),trSize=self._getTrs().length;
                    if(thCheckbox.hasClass('selected')){ //说明是要全部取消选择
                        thCheckbox.removeClass('selected');
                        for(var i=0;i<trSize;i++){
                            self._rowDeSelect(i);
                        }
                    }else{ //说明是要全选
                        thCheckbox.addClass('selected');
                        for(var i=0;i<trSize;i++){
                            self._rowSelect(i);
                        }
                    }
                });
                //行单击,需要刷新headerChekcbox的选择状态
                this.tbody.delegate('tr.om-grid-row','click',function(event){
                    var row=$(this),index=self._getRowIndex(row);
                    if(row.hasClass('om-state-highlight')){ //已选择
                        self._rowDeSelect(index);
                    }else{
                        self._rowSelect(index);
                    }
                    self._refreshHeaderCheckBox();
                    self._trigger("onRowClick",event,index,self._getRowData(index));
                });
                //行双击
                this.tbody.delegate('tr.om-grid-row','dblclick',function(event){
                    var row=$(this),index=self._getRowIndex(row);
                    if(row.hasClass('om-state-highlight')){ //已选择
                        //do nothing
                    }else{
                        self._rowSelect(index);
                        self._refreshHeaderCheckBox();
                    }
                    self._trigger("onRowDblClick",event,index,self._getRowData(index));
                });
            }else{ //不可多选
                //行单击
                this.tbody.delegate('tr.om-grid-row','click',function(event){
                    var row=$(this),index=self._getRowIndex(row);
                    if(row.hasClass('om-state-highlight')){ //已选择
                        // no need to deselect another row and select this row
                    }else{
                        var lastSelectedIndex = self._getRowIndex(self.tbody.find('tr.om-state-highlight:not(:hidden)'));
                        (lastSelectedIndex != -1) && self._rowDeSelect(lastSelectedIndex);
                        self._rowSelect(index);
                    }
                    self._trigger("onRowClick",event,index,self._getRowData(index));
                });
                
                //行双击,因为双击一定会先触发单击，所以对于单选表格双击时这一行一定是选中的，所以不需要强制双击前选中
                this.tbody.delegate('tr.om-grid-row','dblclick',function(event){
                    var index = self._getRowIndex(this);
                    self._trigger("onRowDblClick",event,index,self._getRowData(index));
                });
            }
        },
        _getRowData:function(index){
            return this.pageData.data.rows[index];
        },
        _rowSelect:function(index){
             var tr=this._getTrs().eq(index),
                chk=$('td.checkboxCol span.checkbox',tr);
            tr.addClass('om-state-highlight');
            chk.addClass('selected');
            this._trigger("onRowSelect",null,index,this._getRowData(index));
        },
        _rowDeSelect:function(index){
            var tr=this._getTrs().eq(index),
                chk=$('td.checkboxCol span.checkbox',tr);
            tr.removeClass('om-state-highlight');
            chk.removeClass('selected');
            this._trigger("onRowDeselect",null,index,this._getRowData(index));
        },
        _refreshHeaderCheckBox:function(){
        	var selects = this.getSelections(),
        		$trs = this._getTrs(),
        		headerCheckbox = $('th.checkboxCol span.checkbox' , this.thead),
        		len = $trs.length;
        	//如果当前页一条数据都没有，那么应该不选中比较合理
        	headerCheckbox.toggleClass('selected' ,len>0 && len==selects.length );
        },
        //让列可以改变宽度（index列和checkbox列不可以改变宽度）
        _makeColsResizable:function(){
            var self=this,
                bDiv=self.tbody.closest('.bDiv'),
                grid=self.element.closest('.om-grid'),
                $titleDiv = this.titleDiv,
                differWidth = 0;
                
            $('th[axis^="col"] div',self.thead).omResizable({
                handles: 'e',//只可水平改变大小
                containment: 'document',
                minWidth: 60,
                resize: function(ui , event) {
                	var callbacks = self.options._onResizableCallbacks;
                	for(var i=0,len=callbacks.length; i<len; i++){
                		callbacks[i].call(self);
                	}
                	
                    var _this=$(this),abbr=_this.parent().attr('abbr'),dataCells=$('td[abbr="'+abbr+'"] > div',self.tbody),hDiv=self.thead.closest('.hDiv');
                    _this.width(ui.size.width).height('');
                    dataCells.width(ui.size.width).height('');
                    bDiv.height(grid.height()-($titleDiv.is(":hidden")?0:$titleDiv.outerHeight(true))-hDiv.outerHeight(true)-(self.pDiv.is(":hidden")?0:self.pDiv.outerHeight(true)));
                    hDiv.scrollLeft(bDiv.scrollLeft());
                },
                start: function(ui , event) {
                	differWidth = $(this).parent().width();
                },
                stop: function(ui , event) {
                	var callbacks = self.options._onResizableStopCallbacks,
                		$th = $(this).parent(),
                		hDiv=self.thead.closest('.hDiv');
                	differWidth = $th.width() - differWidth;
                	for(var i=0,len=callbacks.length; i<len; i++){
                		callbacks[i].call(self , $th , differWidth );
                	}
                	hDiv.scrollLeft(bDiv.scrollLeft());
                }
            });
        },
        //单独抽出这个方法是为了更好整合其它grid插件，因为很多插件会对tr进行操作，比如行编辑插件会对tr进行隐藏，所以这里获取行索引要注意不与插件冲突。
		_getRowIndex:function(tr){
			return this._getTrs().index(tr);
		},
		//获取所有真正的行，此方法一样可以兼容其它插件。
		_getTrs:function(){
			return this.tbody.find("tr.om-grid-row:not([_delete='true'])");		
		},
        //public methods
        /**
         * 修改取数url并立即刷新数据。一般用于查询操作。比如开始时取数url是data.json则后台实际收到data.json?start=0&limit=15这样的请求。查询时使用setData方法将取数url改成data.json?queryString=admin，后台实际收到data.json?queryString=admin&start=0&limit=15这样的请求，后台根据参数queryString来做查询即可。
         * @name omGrid#setData
         * @function
         * @param url 新的数据源url
         * @returns jQuery对象
         * @example
         *  //使用新的url来取数，设置完后会立即开始刷新表格数据。
         *  $('.selector').omGrid('setData', 'newgriddata.json');
         */
        setData:function(url){
            this.options.dataSource=url;
            this.pageData={nowPage:1,totalPages:1};
            this._populate();
        },
        /**
         * 获取表格JSON数据。<br/>
         *     
         * @name omGrid#getData
         * @function
         * @returns 如果没有设置preProcess则返回由后台返回来的对象。如果有preProcess则返回处理后的对象
         * @example
         * //获取grid的当前页数据
         * var store = $('.selector').omGrid('getData');
         * 
         * 
         */
        getData:function(){
            return this.pageData.data;
        },
        /**
         * 使用getData方法的结果重新渲染数据。<b>注意：该方法并不会发送Ajax请求，而且如果表格当前正在加载数据（loadmask还未消失）的话则什么也不做直接返回</b>。
         * @name omGrid#refresh
         * @function
         * @returns jQuery对象
         * @example
         * //根据当前grid数据模型中的数据，重新刷新grid
         * $('.selector').omGrid('refresh');//注意refresh没有传入参数
         * 
         */
        refresh:function(){
            // 修改数据模型后可以用此方法来强制刷新（仅客户端行为,不向后台发送请求）
            if (this.loading) {
                return true;
            }
            this.loading = true;
            var op=this.options;
			$('.pPageStat', this.pager).html($.om.lang._get(op,"omGrid","loadingMsg"));
            this.loadMask.show();
            this._buildPager();
            this._renderDatas();
            this._trigger("onRefresh",null,this.pageData.nowPage || 1,this.pageData.data.rows);
            //用于行编辑插件
            for(var i=0 , len=op._onRefreshCallbacks.length; i<len; i++){
            	op._onRefreshCallbacks[i].call(this);
            }
            this.loadMask.hide();
            this.loading = false;
        },
        /**
         * 刷新表格。如果没有参数则刷新当前页，如果有参数则转到参数所表示的页（如果参数不合法会自动进行修正）。<b>注意：该方法会发送Ajax请求，而且如果表格当前正在加载数据（loadmask还未消失）的话则什么也不做直接返回</b>。
         * @name omGrid#reload
         * @function
         * @param page 要转到的页，参数为空表示刷新当前页。如果参数不是数字或者小于1则自动修正为1，如果参数大于总页数则自动修正为总页数。
         * @returns jQuery对象
         * @example
         * $('.selector').omGrid('reload');//刷新当前页
         * $('.selector').omGrid('reload',3);//转到第3页
         * 
         */
        reload:function(page){
            if (this.loading) {
                return true;
            }
            if(typeof page !=='undefined'){
                page=parseInt(page) || 1;
                if(page<0){
                    page = 1;
                }
                if(page>this.pageData.totalPages){
                    page=this.pageData.totalPages;
                }
                this.pageData.nowPage = page;
            }
            //相当于goto(page) and reload()，会转到那一页并重新刷新数据（向后台发送请求）
            //没有参数时刷新当前页
            this._populate();
        },
        /**
         * 选择行。<b>注意：传入的参数是序号（第一行是0第二行是1）数组（比如[0,1]表示选择第一行和第二行）；要想清除所有选择，请使用空数组[]作为参数；只能传入序号数组，如果要做复杂的选择算法，请先在其它地方算好序号数组后后调用此方法；此方法会清除其它选择状态，如选择第1,2行然后setSelections([3])最后结果中只有第3行，如setSelections([3,4]);setSelections([5,6])后只会选择5,6两行</b>。
         * @name omGrid#setSelections
         * @function
         * @param indexes 序号（第一行是0第二行是1）数组。
         * @returns jQuery对象
         * @example
         * //选择表格中第二行、第三行、第五行
         * $('.selector').omGrid('setSelections',[1,2,4]);
         * 
         */
        setSelections:function(indexes){
            var self=this;
            if(!$.isArray(indexes)){
                indexes=[indexes];
            }
            var selected=this.getSelections();
            $(selected).each(function(){
                self._rowDeSelect(this);
            });
            $(indexes).each(function(){
                self._rowSelect(this);
            });
            self._refreshHeaderCheckBox();
        },
        /**
         * 获取选择的行的行号或行记录。<b>注意：默认返回的是行序号组成的数组（如选择了第2行和第5行则返回[1,4]），如果要返回行记录JSON组成的数组需要传入一个true作为参数</b>。
         * @name omGrid#getSelections
         * @function
         * @param needRecords 参数为true时返回的不是行序号数组而是行记录数组。参数为空或不是true时返回行序号数组。
         * @returns jQuery对象
         * @example
         * var selectedIndexed = $('.selector').omGrid('getSelections');
         * var selectedRecords = $('.selector').omGrid('getSelections',true);
         * 
         */
        getSelections:function(needRecords){
            //needRecords=true时返回Record[],不设或为false时返回index[]
            var self=this,
            	$trs = self._getTrs(),
            	selectedTrs = $trs.filter('.om-state-highlight'),
            	result=[];
            if(needRecords){
            	var rowsData = self.getData().rows;
            	selectedTrs.each(function(index , tr){
            		result[result.length] = rowsData[$trs.index(tr)];
            	});
            }else{
            	selectedTrs.each(function(index , tr){
            		result[result.length] = $trs.index(tr);
            	});
            }
            return result;
        },
        destroy:function(){
        	var $el = this.element;
        	$el.closest('.om-grid').after($el).remove();
        }
    });
    
    $.om.lang.omGrid = {
        loadingMsg:'正在加载数据，请稍候...',
        emptyMsg:'没有数据',
        errorMsg:'取数出错',
        pageText:'第{index}页，共{totalPage}页',
        pageStat:'共{total}条数据，显示{from}-{to}条'
    };
})(jQuery);
