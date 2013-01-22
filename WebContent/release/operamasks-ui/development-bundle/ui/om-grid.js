/*
 * operamasks-ui omGrid 0.1
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 */
/*
 * 在原有基础上扩展功能:
 * 1.checkbox列
 * 2.index列
 * 3.列允许指定renderer函数
 * 4.允许通过调用xx[0].grid._resizeTo(w,h)来动态的改变大小
 * 5.分页条显示快速定位链接(只显示5个)
 * 6.limit允许使用'auto'，根据容器高度来决定显示的行数
 * 7.添加fillEmptyRows属性，如果当页数据没填满容器高度，继续填充空白行
 * 8.添加onRowClick， onRowDblClick事件
 * 9.添加onClientSort客户端排序功能，并允许指定自定义的onClientSort函数
 * 修复原有的bug:
 * 1.有两处p.colMolel拼写错误导致无法自定义列axis
 * 2.ctrl多选失效
 * 3.高度计算错误
 */
/**
 * @name omGrid
 * @author 陈界，罗业刚
 * @class 富客户端表格组件，轻量级，支持列移动及列大小改变，支持ajax方式装载json格式的数据。<br/>
 * 客户端从服务器端取到数据后即将其展示在表格中，服务器返回的数据格式一般用标准json格式。<br/><br/>
 * <b>数据格式:</b><br/>
 * 如下数据展示了服务器传到前台的数据格式<br/>
 * <pre>
 * {"total":1184, "page":1, "rows":
 *     [
 *         {"address":"CZ88.NET ","city":"IANA保留地址","end":"0.255.255.255","id":"1","start":"0.0.0.0"},
 *         {"address":"CZ88.NET ","city":"澳大利亚","end":"1.0.0.255","id":"2","start":"1.0.0.0"},
 *         {"address":"电信 ","city":"福建省","end":"1.0.3.255","id":"3","start":"1.0.1.0"},
 *         {"address":"CZ88.NET ","city":"泰国","end":"1.0.255.255","id":"9","start":"1.0.128.0"},
 *         {"address":"CZ88.NET ","city":"日本","end":"1.0.31.255","id":"6","start":"1.0.16.0"},
 *         {"address":"电信 ","city":"广东省","end":"1.0.63.255","id":"7","start":"1.0.32.0"},
 *         {"address":"CZ88.NET ","city":"澳大利亚","end":"1.0.7.255","id":"4","start":"1.0.4.0"},
 *         {"address":"CZ88.NET ","city":"日本","end":"1.0.127.255","id":"8","start":"1.0.64.0"}
 *     ]
 * }
 * </pre>
 * 在每一次返回的数据中，如下几项是必须存在的：<br/>
 * 1. total:当前总共有多少条记录<br/>
 * 2. page:当前在第几页<br/>
 * 3. rows:当前页的数据，为一个对象字面量数组，每个元素中的字段都与定义表格式的列模型colModel中的name属性一一对应<br/><br/>
 * <b>两种工作模式:</b><br/>
 * 
 *  <li>精确计算总数模式</li>
 *  	<p>&nbsp;&nbsp;&nbsp;&nbsp;第一次加载数据就马上可以得到totalCount总数信息，立即构造出表格分页器并存在一个页面跳转输入框。</p>
 *  <li>延迟计算总数模式</li> 
 *  	<p>&nbsp;&nbsp;&nbsp;&nbsp;有些情况下，表格数据可能通过几个不同的系统组合而成，或者数据量非常巨大，计算总数可能需要较长的时间，此时omGrid可提供先展示前几页数据，后取总数的能力，保证了较好的用户体验。
 *  	做到该功能只需要增加一个属性配置 lazyTotalUrl 即可，该配置属性告诉omGrid，当页面加载完成后，接下来需要根据该url发送一个ajax请求的服务器，
 *  	该请求的响应将被作为总数写在omGridd分页条上，显然这种模式下的分页条跟“精确计算总数模式”的分页条是不一样的。
 *  	通常会赋给它一个跟原先的那个求数url不一样的值，服务器另起一个专门计算总数的线程应该比较好控制。<p>
 * <b>特点：</b><br/>
 * 
 * 	1. 可配置延迟计算总数模式<br/>
 *  2. 可配置checkbox列<br/>
 *  3. 可配置index列<br/>
 *  4. 列渲染<br/>
 *  5. 自定义客户端排序函数<br/>
 *  6. ajax取数<br/>
 *  7. 分页功能<br/>
 *  8. 列可隐藏<br/>
 *  
 * 
 * @constructor
 * @description 构造函数。
 * @param p 标准config对象：{width:300, height:300}
 * @example
 * $('griddiv').omGrid({width:300, height:300});
 */
(function($) {
	$.addFlex = function(t, p) {
		if (t.grid){
			return false; // return if already exist
		}
		/**
		 * @lends omGrid#
		 */
		p = $.extend({ // apply default properties
			/**
			 * 表格高度，单位为px，可取值为'auto'，表格高度根据每行的高度自动计算。
			 * @default 200
		     * @type Number
		     * @example
		     * $('.selector').omGrid({height : 300});
		     */
			height : 200, // 表格的高度
			/**
			 * 表格宽度，单位为px，可取值为'auto'，表格宽度根据每列的宽度自动计算。
		     * @type Number
		     * @default 'auto'
		     * @example
		     * $('.selector').omGrid({width : 600});
		     */
			width : 'auto', // 表格宽度
			/**
			 * 是否显示斑纹效果（即奇数行和偶数行使用不同的背景色）。
		     * @type Boolean
		     * @default true
		     * @example
		     * $('.selector').omGrid({striped : true});
		     */
			striped : true, // 是否显示斑纹效果(即奇数行和偶数行使用不同的背景色)
			/**
			 * 是否显示表格竖分隔条。
		     * @type Boolean
		     * @default false
		     * @example
		     * $('.selector').omGrid({noVStripe : false});
		     */
			noVStripe : false,// 表格竖分隔条
			/**
			 * 当用鼠标拖动改变某列的宽度时，该列的最小宽度。
		     * @type Number
		     * @default 30
		     * @example
		     * $('.selector').omGrid({minWidth : 30});
		     */
			minWidth : 30, // 最小列宽
			/**
			 * 默认列宽。
		     * @type Number
		     * @default 60
		     * @example
		     * $('.selector').omGrid({defaultColWidth : 60});
		     */
			defaultColWidth : 60,// 如果不指定某个列的宽度，其列宽会被设置成此值
			/**
			 * 当表格resize时，表格的最小高度。
		     * @type Number 
		     * @default 80
		     * @example
             * $('.selector').omGrid({minHeight : 80});
		     */
			minHeight : 80, // 当表格resize时，表格的最小高度。
			/**
			 * 是否要长出调整大小的handle。
		     * @type Boolean 
		     * @default false
		     * @deprecate
		     * @example
             * $('.selector').omGrid({resizable : false});
		     */
			resizable : false, // 是否要长出调整大小的handle，不建议使用
			/**
			 * ajax取数方式对应的url地址。
		     * @type String
		     * @default false
		     * @example
		     * //下面的示例设置的url，表示将请求服务器的griddata.do这个action，同时附带有请求参数。
		     * //该action最终必须返回一段具有特定格式的json数据，omGrid拿到该数据即可用来填充表格。
		     * //json数据格式可参考文档的Overview页签。
		     * $('.selector').omGrid({url:'griddata.do?method=fast'});
		     */
			url : false, // 取数的url
			/**
			 * 数据发送方式，取值为：'POST'，'GET'。
		     * @type String
		     * @default 'POST'
		     * @example
             * $('.selector').omGrid({method : 'POST'});
		     */
			method : 'POST', // data sending method
			/**
			 * 是否显示分页工具条。
		     * @type Boolean
		     * @default true
		     * @example
		     * //通过下面的配置，会在表格的下方长出分页工具条
		     * $('.selector').omGrid({paged : true});
		     */
			paged : true,// 是否显示分页工具条
			
			/**
			 * 当omGrid工作在lazy模式时，则必须指定lazyTotalUrl，用来请求大约条数，以便计算分页信息（注意：该url只会被请求一次）。<br/>
			 * 在这一次请求，该请求必需返回一个json格式为{"total":5}的数据。
		     * @type String
		     * @default false
		     * @example
		     * //当表格第一页加载完成，omGrid会根据该url去发送一个ajax请求到服务器，去请求totalCount；请求的响应将被作为总数写在分页条上。
		     * $('.selector').omGrid({lazyTotalUrl:'griddata.do?method=lazyTotal'});
		     */
			lazyTotalUrl : false,// 当omGrid工作在lazy模式时，则必须指定lazyTotalUrl，用来请求大约条数，以便计算分页信息(注意该url只会被请求一次)
			/**
			 * 是否不允许文字自动换行，如果设置为true，文字超出列宽度部分将隐藏，如果未false，将换行显示出所有数据
		     * @type Boolean 
		     * @default true
		     * @example
             * $('.selector').omGrid({noWrap : true});
		     */
			noWrap : true,// 是否不允许文字自动换行
			/**
			 * 指定当前显示第几页。
		     * @type Number
		     * @default 1
		     * @example
             * $('.selector').omGrid({page : 1});
		     */
			page : 1, // current page
			/**
			 * 总页数。
		     * @type Number
		     * @default 1
		     * @example
             * $('.selector').omGrid({total : 1});
		     */
			total : 1, // total pages
			/**
			 * 是否显示一个可控制每页显示条数的选择器，该属性在limit='auto'时失效。
		     * @type Boolean
		     * @default false
		     * @example
             * $('.selector').omGrid({useRp : false});
		     */
			useRp : false, // 是否显示一个可控制每页显示条数的select,该属性在limit='auto'时失效
			/**
			 * 每页数据条数，可以指定为auto来根据表格高度自动计算每页显示多少条数据。
		     * @type Number
		     * @default 15
		     * @example
             * $('.selector').omGrid({limit : 15});
		     */
			limit : 15, // 每页数据条数,可以指定为auto来根据表格高度自动计算每页显示多少条数据。
			/**
			 * 允许每页显示的结果数。当limit为非auto时，该属性才起作用。
		     * @type Array[Number]
		     * @default [10, 15, 20, 30, 50]
		     * @example
             * $('.selector').omGrid({rpOptions : [ 10, 15, 20, 30, 50 ]});
		     */
			rpOptions : [ 10, 15, 20, 30, 50 ], // allowed per-page values
			/**
			 * 标题。
		     * @type Boolean
		     * @default false
		     * @example
             * $('.selector').omGrid({title : false});
		     */
			title : false,

			/**
			 * 当前页和总页数信息。{total}，{from}，{to} 被自动替换成相应的表格数据。
		     * @type String
		     * @default '共 {total} 条数据，显示第 {from} 条到 {to} 条'
		     * @example
             * $('.selector').omGrid({pageStat : '共 {total} 条数据，显示第 {from} 条到 {to} 条'});
		     */
			pageStat : $.omGrid.lang.pageStat,
			/**
			 * 无数据时的提示信息。
		     * @type String
		     * @default '没有数据'
		     * @example
             * $('.selector').omGrid({emptyMsg : '没有数据'});
		     */
			emptyMsg : $.omGrid.lang.emptyMsg,
	
			/**
			 * 连接失败的提示信息。
		     * @type String
		     * @default '连接失败'
		     * @example
             * $('.selector').omGrid({errorMsg : '连接失败'});
		     */
			errorMsg : $.omGrid.lang.errorMsg,
			/**
			 * 至少需要显示列数目，当设置为2的时候，如果只有两列，将不能再执行隐藏列操作。
		     * @type Number
		     * @default 1
		     * @example
             * $('.selector').omGrid({minColToggle : 1});
		     */
			minColToggle : 1, // minimum allowed column to be hidden
			/**
             * 装载数据时显示的文本。
             * @type String
             * @default '正在加载数据，请稍候...'
             * @example
             * $('.selector').omGrid({loadingMsg : '正在加载数据，请稍候...'});
             */
            loadingMsg : $.omGrid.lang.loadingMsg,
            /**
             * 分页文本。{totalPage}，{index} 将被自动替换成相应的表格数据。
             * @type String
             * @default '共 {totalPage} 页，跳转至第 {index} 页'
             * @example
             * $('.selector').omGrid({pageText : '共 {totalPage} 页，跳转至第 {index} 页'});
             */
            pageText : $.omGrid.lang.pageText,
			
			/**
			 * 是否显示列隐藏列按钮。
		     * @type Boolean
		     * @default true
		     * @example
             * $('.selector').omGrid({showToggleBtn : true});
		     */
			showToggleBtn : true, // show or hide column toggle popup
			/**
			 * 默认工具条上的按钮。该属性是toolbar的可替代属性。每个按钮接受3个配置项。
			 * 使用buttons属性可由omGrid提供默认样式，使用toolbar属性则完全自定制。
		     * @type Array[JSON]
		     * @default false
		     * @example
		     * //在表头上生成三个按钮。
		     * var btns = [ {
			 *     name : '删除', //按钮的Label
			 *     icon : './images/toolbar-delete.png',  //按钮图标的路径
			 *     click:function(e){}, //响应事件
			 * }, {
			 *     name : '新建',
			 *     icon : './images/toolbar-add.png'
			 * }, {
			 *     name : '下载',
			 *     icon : './images/toolbar-down.png'
			 * } ]
			 *
			 * $(".selector").omGrid({
			 * 		buttons : btns
			 * });
		     */
			buttons : false,// 一个数组,指定有哪些按钮
			/**
			 * 某个div的id，可以被jQuery选择到具体DOM节点，将被剪切到grid作为工具条。buttons的可替代属性。
			 * @type String
			 * @default false
			 * @example
			 * $(".selector").omGrid({
			 *     toolbar : "divId"
			 * });
			 *  
			 * &lt;div id="divId"&gt;
			 * 	   &lt;button id="delete"&gt;删除&lt;/button&gt;
			 * 	   &lt;button id="create"&gt;新增&lt;/button&gt;
			 * 	   &lt;input id="queryText" &gt;&lt;/input&gt;
			 *     &lt;button id="query"&gt;查询&lt;/button&gt;
			 * &lt;/div&gt;
			 * 
			 */
			toolbar : false,// 某个div的id，可以被jQuery选择到具体DOM节点，将被剪切到grid作为工具条
			/**
			 * 列数据模型。每一个元素都是一个对象字面量，定义该列的各个属性，这些属性包括:<br/>
			 * header : 表头文字。<br/>
			 * name : 与数据模型对应的字段。<br/>
			 * align : 列文字对齐方式，可以为'left'、'center'、'right'之中的一个。<br/>
			 * sortable : 该列是否支持客户端排序。<br/>
			 * renderer : 列的渲染函数，接受2个参数，v表示当前值，row表示当前行号。<br/>
			 * width : 列的宽度，取值为Number或者'autoExpand'。注意只能有一个列被设置为'autoExpand'属性。<br/>
			 * autoExpandMin : 当表格宽度较小时，该列宽度自动扩展的最小值。<br/>
			 * autoExpandMax : 当表格宽度较大时，该列宽度自动扩展的最大值。<br/>
			 * hide : 是否隐藏当前列。
			 * @type Array[JSON]
			 * @default false
			 * @example
			 * 
			 * var colM_city = {
			 * 		header : '地区',  		//表头文字
			 * 		name : 'city',			//与数据模型对应的字段
			 * 		width : 120,			//列宽,可设置具体数字，也可设置为'autoExpand'，表示自动扩展
			 * 		align : 'left',			//列文字对齐
			 * 		sortable : true,		//是否可排序
			 * 		renderer : function(v, row) {   //列渲染函数，接受2个参数，v表示当前值，row表示当前行号
			 * 		    return v;
			 * 		}
			 * 	};
			 * var colM_address = {
			 *		header : '地址',
			 *		name : 'address',
			 *		align : 'left',
			 *		width : 'autoExpand',
			 *		autoExpandMin : 150,
			 *		sortable : true
			 *	};
			 * $(".selector").omGrid({
			 * 	    colModel : [ colM_city, colM_address ]
			 * });
			 */
			colModel : false,
			/**
			 * 是否在加载的时候显示蒙版.
		     * @type Boolean
		     * @default true
		     * @example
             * $('.selector').omGrid({loadMask : true});
		     */
			loadMask : true,// 是否在加载的时候显示蒙版
			
			
			// 是否自动加载数据，如果设置成false，则不会加载数据，需要手动加载
			autoLoad : true,  //由于暂未提供reload()方法加载数据，故不提倡使用此属性.
			/**
			 * 加载数据时蒙板的透明度，取值大透明度越小，取值区间为[0-1]。
		     * @type Number
		     * @default 0.5
		     * @example
             * $('.selector').omGrid({blockOpacity : 0.5});
		     */
			blockOpacity : 0.5,
			/**
			 * 一个在加载服务器端数据成功后（页面渲染前）执行的方法，用来进行对原始数据进行处理，比如修改原始数据。
			 * @event
			 * @type Function
			 * @default function that return the original parameter
			 * @param data 传入的json数据，包括了page、rows、total属性，其中的rows为数据数组
			 * @example
			 * //可以通过data.rows[i].Property获取具体某行某列数据
			 * $(".selector").omGrid({
			 * 	preProcess : function(data){
			 * 		for(var i=0;i &lt; data.rows.length;i++){
			 * 			data.rows[i].start='operamasks';
			 * 		}
			 * 		return data;
			 * 	}
			 * });
			 * //上面例子将所有start属性的值改为operamasks
			 */
			preProcess : function(data) {
				return data; 
			},
			/**
			 * 是否采用客户端排序，必需同时设置sortName属性。<br/>
			 * 设置成true采用默认的字典顺序进行排序。<br/>
			 * 设置成自定义排序函数并返回data数据，按自定义函数排序。<br/>
			 * @event
			 * @type Function
			 * @param data  数据
			 * @param sortName  排序字段
			 * @param sortOrder 排序顺序
			 * @param grid 当前omGrid对象
			 * @param propertyCfg 当前omGrid的配置项
			 * @default true
			 * @returns 如果配置成了一个function，则必须返回排序后的data
			 * @example
			 * //下面的代码将id为9的数据放到了第一行
		     * $(".selector").omGrid({
		     *     onClientSort: function(data, sortName, sortOrder, grid, propertyCfg){
			 *         for(var i=0;i &lt; data.rows.length;i++){
			 *             if(data.rows[i].id == 9){
			 *                 var temp = data.rows[i];
			 *                 data.rows[i] = data.rows[0];
			 *                 data.rows[0] = temp;
			 *             }
			 *         }
			 *         return data;
			 *      } 
		     * });
			 */
			onClientSort : true,
			/**
			 * 将dcoln的列拖动到dcolt时，执行的方法。
			 * @event
		     * @param dcoln 被拉动列当前的序号(从0开始计数)
		     * @param dcolt 目标列的序号(从0开始计数)
		     * @param grid 当前grid对象
		     * @type Function
		     * @default emptyFn
		     * @example
		     * 	$(".selector").omGrid({
		     * 		onDragCol:function(dcoln,dcolt,grid){
		     * 			alert('column dragged!');
		     * 		}
		     * 	});
		     */
			onDragCol : function(dcoln, dcolt, grid) {
			},//列拉动时执行的方法
			/**
			 * 隐藏和显示某一列的时候执行的方法。
		     * @event
		     * @param cid 操作的列的序号(从0开始计数)
		     * @param visible 隐藏还是显示。true表示显示，false为隐藏
		     * @type Function
		     * @default emptyFn
		     * @example
		     * 	$(".selector").omGrid({
		     * 		onToggleCol:function(cid,visible){
		     * 			alert('你让第 ' + cid + ' 列' + visible?'显示':'隐藏' + '了!');
		     * 		}
		     * 	});
		     * 
		     */
			onToggleCol : function(cid,visible) {
			},//隐藏和显示某一列的时候执行的方法
			/**
			 * 更新数据成功后执行的方法。
		     * @event
		     * @type Function
		     * @param data 请求返回的数据
		     * @param textStatus 响应的状态
		     * @default false
		     * @example
		     * 	$(".selector").omGrid({
		     * 		onSuccess:function(data,textStatus){
		     * 			alert('ajax successed!');
		     * 		}
		     * 	});
		     */
			onSuccess : false,
			/**
			 * 更新数据异常后执行的方法。错误信息为jQuery.ajax返回的异常信息，可参考jQuery ajax官方文档。
		     * @event
		     * @param xmlHttpRequest XMLHttpRequest对象
		     * @param textStatus 错误状态
		     * @param errorThrown 捕获的异常对象
		     * @example
		     * 	$(".selector").omGrid({
		     * 		onError:function(xmlHttpRequest, textStatus, errorThrown){
		     * 			alert('error occured');
		     * 		}
		     * 	});
		     */
			onError : function(xmlHttpRequest, textStatus, errorThrown){
				return ;
			},
			/**
			 * 当某一行双击时执行的方法。
			 * @event
			 * @param e 事件对象
			 * @default emptyFn
			 * @param rowData 当前行的数据，为json格式
			 * @param grid 当前的表格对象
		     * @example
		     * 	$(".selector").omGrid({
		     * 		onRowDblClick:function(){
		     * 			alert('row double click event happened');
		     * 		}
		     * 	});
			 */
			onRowDblClick : function(e, rowData, grid) {/* do nothing */
			},// 当某一行双击时触发的函数
			/**
			 * 当某一行单击时执行的方法。
			 * @event
			 * @param e 事件对象
			 * @param rowData 当前行的数据，为json格式
			 * @param grid 当前的表格对象
			 * @default emptyFn
			 * @returns 如果同时不允许该行被选中，则必须显示返回一个false；返回其他值或者没有返回值将导致该行被选中。
			 * @example
		     * 	$(".selector").omGrid({
		     * 		onRowClick:function(e, rowData, grid){
		     * 			var rtn = [];
		     * 			for (var p in rowData){
		     * 				rtn.push(p+':'+rowData[a]);
		     * 			} 
		     * 			alert(rtn.join(' '));
		     * 			return true;
		     * 		}
		     * 	});
			 */
			onRowClick : function(e, rowData, grid) {
			},// 当某一行单击时触发的函数,如果reutrn false则该行不会再被允许选择
			/**
			 * 当选择行的时候触发事件。
			 * @event
			 * @param grid 当前的表格对象
			 * @default emptyFn
			 */
			onRowSelect : function(grid) {/* do nothing */
			},// 当选择的行改变的时候触发事件
			/**
			 * 当获取表格数据时执行的方法。比如点击了"下一页"时，在发送Ajax请求之前会执行本方法。若该方法返回false，则不会再发送Ajax到后台取数据。否则仍然会发送Ajax去取数据。该方法在提交grid取数请求之前为用户提供了一个介入时机。
		     * @event
		     * @type Function
		     * @default false
		     * @returns 如果在该方法中全部自行完成了获取数据并更新表格的操作，此时可以返回false;否则需要返回true，执行默认的逻辑。一般建议返回true。
		     */
			onSubmit : false, // using a custom _populate function
			/**
			 * 是否单选。若设置了singleSelect:true，则showCheckbox属性不生效。
		     * @type Boolean
		     * @default false
		     */
			singleSelect : false,
			/**
			 * 是否显示序列号。
		     * @type Boolean
		     * @default false
		     */
			showIndex : false,// @Blee,是否显示序号
			/**
			 * 是否显示checkbox，如果设置了singleSelect:true则该属性失效。
		     * @type Boolean
		     * @default false
		     */
			showCheckbox : false,// @Blee,是否显示checkbox,如果指定了singleSelect=true则该属性失效
			/**
			 * 如果查询出来的数据小于limit数，是否需要填充空白行，仅在limit='auto'的时候该属性有效。
		     * @type Boolean
		     * @default true
		     */
			fillEmptyRows : true,
			/**
			 * 是否滚动条滚动时持续装载。若设置为true，当滚动条滚动到最底端的时候会再次发起取数请求，并将数据增量加在原数据后面。
			 * <b>注意：不能和paged同时使用，设置了此属性为true，则分页条将消失</b>
			 * @type Boolean
		     * @default false
			 */
			scrollLoad:false
		}, p);
		//下面的2个属性暂时被屏蔽。
		p = $.extend({
		    /**
             * 查询的条件。每一次与服务器的交互都会带上两个参数(query,qtype)，当用户需要有数据要传递给服务器的时候该属性会有用处。<br/>
             * 一般用于查询表格
             * @blocked
             * @type String
             * @default 无
             * @example
             * $('.selector').omGrid({query : ''});
             */
            query : '',
            /**
             * 查询的类型。每一次与服务器的交互都会带上两个参数(query,qtype)，当用户需要有数据要传递给服务器的时候该属性会有用处。<br/>
             * 一般用于查询表格
             * @blocked
             * @type String
             * @default 无
             * @example
             * $('.selector').omGrid({qtype : ''});
             */
            qtype : ''
		}, p);
		var baseclasses='om-grid om-widget om-widget-content';
		var temp = $('<div></div>').addClass(baseclasses).insertBefore($(t));
		if (p.width != 'auto') {
		    temp.width(p.width);
		    p.width = temp.width();
		}
		if (p.height != 'auto') {
		    temp.height(p.height);
		    p.height = temp.height();
		}
		temp.remove();
		var inprogress = false; //是否在取数进程中 add by luoyg
		if(p.scrollLoad){
			var scrollLoad  = document.createElement("input"); //记录blog的当前页数
			$(scrollLoad).attr('class','scrollLoad').attr('type','hidden').val(1);
			$(t).append(scrollLoad);
		}
		
		if (p.singleSelect) {
			p.showCheckbox = false;
		}
		if (p.limit == 'auto') {
			p.autoLimit = true;
		}
		p.dataType = 'json';// 只支持json
		$(t).show() // show if hidden
		.attr({
			cellPadding : 0,
			cellSpacing : 0,
			border : 0
		}) // remove padding and spacing
		.removeAttr('width'); // remove width properties
		// create grid class
		var g = {
			hset : {},
			_rePosDrag : function() {
				var cdleft = 0 - this.hDiv.scrollLeft;
				if (this.hDiv.scrollLeft > 0)
					cdleft -= Math.floor(p.cgwidth / 2);
				$(g.cDrag).css({
					top : g.hDiv.offsetTop + 1
				});
				var cdpad = this.cdpad;
				$('div', g.cDrag).hide();
				$('thead tr:first th:visible', this.hDiv).each(function() {
					var n = $('thead tr:first th:visible', g.hDiv).index(this);
					var cdpos = parseInt($(this).width());
//					if (cdleft == 0)
//						cdleft -= Math.floor(p.cgwidth / 2);
//					cdpos = cdpos + cdleft + cdpad;
//					if (isNaN(cdpos)) {
//						cdpos = 0;
//					}
					cdpos = $(this).position().left+cdpos-Math.floor(p.cgwidth/2);
					$('div:eq(' + n + ')', g.cDrag).css({
						'left' : cdpos + 'px'
					}).show();
					cdleft = cdpos;
				});
			},
			_fixHeight : function(newH) {
				newH = false;
				if (!newH)
					newH = $(g.bDiv).height();
				var hdHeight = $(this.hDiv).height();
				$('div', this.cDrag).each(function() {
					$(this).height(newH + hdHeight);
				});
				var nd = parseInt($(g.nDiv).height());
				if (nd > newH){
					$(g.nDiv).height(newH).width(200);
				}
				else {
					$(g.nDiv).height('auto').width('auto');
				}
				$(g.block).css({
					height : newH
					//marginBottom : (newH * -1)
				});
				var hrH = g.bDiv.offsetTop + newH;
				if (p.height != 'auto' && p.resizable)
					hrH = g.vDiv.offsetTop;
				$(g.rDiv).css({
					height : hrH
				});
				// @Blee修复高度计算错误的bug
				var bHeight = (p.height == 'auto') ? 'auto' : (p.height
						- $(g.tDiv).height() - $(g.hDiv).height()
						- $(g.pDiv).height() - $(g.vDiv).height() - 5)
						+ 'px';
				$(g.bDiv).css({
					height : bHeight
				});
				$('div', g.cDrag).css({
					height : $(g.bDiv).height() + $(g.hDiv).height()
				});
			},
			_dragStart : function(dragtype, e, obj) { // default drag function
				// start
				if (dragtype == 'colresize') {// column resize
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					var n = $('div', this.cDrag).index(obj);
					var ow = $('th:visible div:eq(' + n + ')', this.hDiv)
							.width();
					$(obj).addClass('dragging').siblings().hide();
					$(obj).prev().addClass('dragging').show();
					this.colresize = {
						startX : e.pageX,
						ol : parseInt(obj.style.left),
						ow : ow,
						n : n
					};
					$('body').css('cursor', 'col-resize');
				} else if (dragtype == 'vresize') {// table resize
					var hgo = false;
					$('body').css('cursor', 'row-resize');
					if (obj) {
						hgo = true;
						$('body').css('cursor', 'col-resize');
					}
					this.vresize = {
						h : p.height,
						sy : e.pageY,
						w : p.width,
						sx : e.pageX,
						hgo : hgo
					};
				} else if (dragtype == 'colMove') {// column header drag
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					this.hset = $(this.hDiv).offset();
					this.hset.right = this.hset.left
							+ $('table', this.hDiv).width();
					this.hset.bottom = this.hset.top
							+ $('table', this.hDiv).height();
					this.dcol = obj;
					this.dcoln = $('th', this.hDiv).index(obj);
					this.colCopy = document.createElement("div");
					this.colCopy.className = "colCopy";
					this.colCopy.innerHTML = obj.innerHTML;
					if ($.browser.msie) {
						this.colCopy.className = "colCopy ie";
					}
					$(this.colCopy).css({
						'position' : 'absolute',
						'float' : 'left',
						'display' : 'none',
						'textAlign' : obj.align
					});
					$('body').append(this.colCopy);
					$(this.cDrag).hide();
				}
				$('body').noSelect();
			},
			_dragMove : function(e) {
				if (this.colresize) {// column resize
					var n = this.colresize.n;
					var diff = e.pageX - this.colresize.startX;
					var nleft = this.colresize.ol + diff;
					var nw = this.colresize.ow + diff;
					if (nw > p.minWidth) {
						$('div:eq(' + n + ')', this.cDrag).css('left', nleft);
						this.colresize.nw = nw;
					}
				} else if (this.vresize) {// table resize
					var v = this.vresize;
					var y = e.pageY;
					var diff = y - v.sy;
					if (!p.defwidth)
						p.defwidth = p.width;
					if (p.width != 'auto' && !p.nohresize && v.hgo) {
						var x = e.pageX;
						var xdiff = x - v.sx;
						var newW = v.w + xdiff;
						if (newW > p.defwidth) {
							this.gDiv.style.width = newW + 'px';
							p.width = newW;
						}
					}
					var newH = v.h + diff;
					if ((newH > p.minHeight || p.height < p.minHeight)
							&& !v.hgo) {
						this.bDiv.style.height = newH + 'px';
						p.height = newH;
						this._fixHeight(newH);
					}
					v = null;
				} else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver om-state-hover');
					if (e.pageX > this.hset.right || e.pageX < this.hset.left
							|| e.pageY > this.hset.bottom
							|| e.pageY < this.hset.top) {
						// this._dragEnd();
						$('body').css('cursor', 'move');
					} else {
						$('body').css('cursor', 'pointer');
					}
					$(this.colCopy).css({
						top : e.pageY + 10,
						left : e.pageX + 20,
						display : 'block'
					});
				}
			},
			_dragEnd : function() {
				if (this.colresize) {
					var n = this.colresize.n;
					var nw = this.colresize.nw;
					$('th:visible div:eq(' + n + ')', this.hDiv).css('width', nw);
					$('tr', this.bDiv).each(
							function() {
								$('td:visible div:eq(' + n + ')', this).css('width', nw);
							});
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					$('div:eq(' + n + ')', this.cDrag).siblings().show();
					$('.dragging', this.cDrag).removeClass('dragging');
					this._rePosDrag();
					this._fixHeight();
					this.colresize = false;
				} else if (this.vresize) {
					this.vresize = false;
				} else if (this.colCopy) {
					$(this.colCopy).remove();
					if (this.dcolt != null) {
						if (this.dcoln > this.dcolt)
							$('th:eq(' + this.dcolt + ')', this.hDiv).before(this.dcol);
						else
							$('th:eq(' + this.dcolt + ')', this.hDiv).after(this.dcol);
						this._switchCol(this.dcoln, this.dcolt);
						$(this.cdropleft).remove();
						$(this.cdropright).remove();
						this._rePosDrag();
						p.onDragCol(this.dcoln, this.dcolt,p);
					}
					this.dcol = null;
					this.hset = null;
					this.dcoln = null;
					this.dcolt = null;
					this.colCopy = null;
					$('.thMove', this.hDiv).removeClass('thMove');
					$(this.cDrag).show();
				}
				$('body').css('cursor', 'default');
				$('body').noSelect(false);
			},
			_resizeTo : function(width, height) {
				this.gDiv.style.width = width + 'px';
				p.width = width;
				this.bDiv.style.height = height + 'px';
				p.height = height;
				// 重新调整列宽
				var already = 0;
				var fullCol = null;
				var max = p.width == 'auto' ? $(t).parent().width() : p.width;;
				var n = 0, index = 0;
				$('thead tr:first th:visible', g.hDiv).each(function() {
					var th = $(this);
					if (th.data('autoExpand')) {
						fullCol = th;
						index = n;
					} else {
						already += (th.width() + 2);
					}
					n++;
				});
				if (fullCol) {
					var w = max - already;
					if (w <= fullCol.data('autoExpandMin')) {
						w = fullCol.data('autoExpandMin');
					}
					if (!p.autoLimit) {
						w -= 18;
					}
					$('th:visible div:eq(' + index + ')', this.hDiv).css('width', w - 17);
					$('tr', this.bDiv).each(
							function() {
								$('td:visible div:eq(' + index + ')', this).css('width', w - 17);
							});
				}
				this._fixHeight(height);
			},
			_toggleCol : function(cid, visible) {
				var ncol = $("th[axis='col" + cid + "']", this.hDiv)[0];
				var n = $('thead th', g.hDiv).index(ncol);
				var cb = $('input[value=' + cid + ']', g.nDiv)[0];
				if (visible == null) {
					visible = ncol.hidden;
				}
				if ($('input:checked', g.nDiv).length < p.minColToggle && !visible) {
					return false;
				}
				if (visible) {
					ncol.hidden = false;
					$(ncol).show();
					cb.checked = true;
				} else {
					ncol.hidden = true;
					$(ncol).hide();
					cb.checked = false;
				}
				$('tbody tr', t).each(function() {
					if (visible) {
						$('td:eq(' + n + ')', this).show();
					} else {
						$('td:eq(' + n + ')', this).hide();
					}
				});
				this._rePosDrag();
				p.onToggleCol(cid, visible);
				return visible;
			},
			_switchCol : function(cdrag, cdrop) { // switch columns
				$('tbody tr', t).each(
						function() {
							if (cdrag > cdrop)
								$('td:eq(' + cdrop + ')', this).before($('td:eq(' + cdrag + ')', this));
							else
								$('td:eq(' + cdrop + ')', this).after($('td:eq(' + cdrag + ')', this));
						});
				// switch order in nDiv
				if (cdrag > cdrop) {
					$('tr:eq(' + cdrop + ')', this.nDiv).before($('tr:eq(' + cdrag + ')', this.nDiv));
				} else {
					$('tr:eq(' + cdrop + ')', this.nDiv).after($('tr:eq(' + cdrag + ')', this.nDiv));
				}
				if ($.browser.msie && $.browser.version < 7.0) {
					$('tr:eq(' + cdrop + ') input', this.nDiv)[0].checked = true;
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
			},
			_scroll : function() {
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				this._rePosDrag();
				//如果是滚动加载型表格 add by luoyg  ---------begin
				if(p.scrollLoad){  //新增scrollLoad属性
					var loadingdiv =  document.createElement('div'); 
					var loadingimg = document.createElement('div');
					$(loadingimg).addClass('loadingImg').css('display','block');
					loadingdiv.align = 'center';
					var $loading = $(loadingdiv);
				  	  	$loading.append(loadingimg);
				  	    $loading.css({
				  	    	position : 'relative',
				  	    	bottom : 10
						});
				  $(this.bDiv).scroll(function(){
					  var nDivHight = $(".bDiv").height();
					  var nScrollHight = $(this)[0].scrollHeight;
			          var nScrollTop = $(this)[0].scrollTop;
				      if(nScrollTop + nDivHight >= (parseInt(nScrollHight))){ //滚动条到底部了
				    	  if(!inprogress){
				    		  inprogress = true;
				        	  $('.bDiv').append($loading);
				        	 $.ajax({
									type: p.method,
									url: p.url,
									data: [
									   {
									        name:'start',
									        value:p.limit * $('input.scrollLoad', this).val()
									    },{
									        name: 'limit',
									        value: p.limit
									    },{
									        name : '_time_stamp_',
									        value : new Date().getTime()
									    }
									],
									dataType: p.dataType,
									success: function (data, textStatus) {
										$loading.detach(); //去掉loading
										if(data.rows.length > 0){
											g._addData(data, textStatus);
										}else{
											$('.bDiv').scrollTop($('.bDiv').scrollTop() - 15); //隐藏滚动图标占用的高度
										}
										inprogress = false;
										$('.scrollLoad').val(parseInt($('.scrollLoad').val())+1); //分页记录
									},
									error: function (XMLHttpRequest, textStatus, errorThrown) {
										try {
											$('.pPageStat', g.pDiv).html(p.errorMsg);
											$('.pPageStat', g.pDiv).css('color', 'red');
											if (p.loadMask) {
												$(g.block).remove();
											}
											if (typeof(p.onError) == 'function') {
												p.onError(XMLHttpRequest, textStatus, errorThrown);
												$loading.detach(); //去掉loading
											}
										} catch (e) {
											
										} finally {
											return false;
										}
										
									}
								});  
								
				        	  //$(this)[0].scrollTop  = parseInt($(this)[0].scrollHeight) - parseInt($(".bDiv").height()) + 20;
				    	  }
				      }
				 });
			 }
				//----------end
			},
			_getSelections : function() {
				var result = [];
				$('tbody tr', g.bDiv).each(function() {
					if ($(this).hasClass('om-state-highlight')) {
						result.push($(this).data('data'));
					}
				});
				return result;
			},
			_setSelections : function(arr, colId) {
			    if (Object.prototype.toString.call(arr) !== "[object Array]") {
			        var tmp = [];
			        tmp.push(arr);
			        arr = tmp;
			    }
			    $('tbody tr', g.bDiv).removeClass('om-state-highlight');
			    $('tbody tr', g.bDiv).each(function() {
			        for (var i = 0; i < arr.length ; i ++) {
			            if ($(this).find('td[abbr=' + colId + ']').text() == arr[i]) {
	                        $(this).addClass('om-state-highlight');
	                        if($(this).hasClass('erow')) {
	                            $(this).removeClass('erow');
	                        }
	                    }
	                }
                });
			},
			_getButtons : function() {
				if (p.buttons) {
					return $('div.fbutton span', g.tDiv);
				}
			},
			//如果是scrollLoad则不删除原有的data，否则会删除原有的data
			_addData : function(data, textStatus) { // parse data
				if (p.dataType == 'json') {
					data = $.extend({
						rows : [],
						page : 0,
						total : 0
					}, data);
				}
				g.data = data;
				data = p.preProcess(data);
				this.loading = false;
				if (!data) {
					$('.pPageStat', this.pDiv).html(p.errorMsg).css('color','red');
					return false;
				}
				p.total = data.total;
				p.pagelen = data.rows.length;
				if (p.total == 0) {
					if (!p.lazyTotalUrl) {// 如果不是延时加载分页信息则直接认为没有数据
						$('tr, a, td, div', t).unbind();
						$(t).empty();
						p.pages = 1;
						p.page = 1;
						this._buildPager();
						$('.pPageStat', this.pDiv).html(p.emptyMsg).css('color', 'red');
						$('.pReload', this.pDiv).removeClass('loading');
						if (p.loadMask) {
						    $(g.block).remove();
						}
						return false;
					}
					if (data.page >= 2) {
						p.pages = data.page + 3;
					} else {
						p.pages = 5;
					}
				} else {
					p.pages = Math.ceil(p.total / p.limit);
				}
				p.page = data.page;
				if (!p.lazyTotalUrl) {// 构建分页器的需要
					$('.pReload', this.pDiv).removeClass('loading');
				}
				this._buildPager();
				// build new body
				var tbody; //如果是博客型表格则查找原来的tbogdy add by luoyg
				if(p.scrollLoad){
					tbody = $('.bDiv tbody');
					if(tbody.length == 0){
						tbody = document.createElement('tbody');
					}
				}else{
					tbody = document.createElement('tbody');
				}
				
				
				if (p.dataType == 'json') {
					var rows = data.rows;
					if (p.fillEmptyRows && p.autoLimit) {// 填充空白行
						if (rows.length < (p.limit + 1)) {// 加1是为了防止最底部有可能留出的空隙不美观
							for ( var i = rows.length; i < p.limit + 1; i++) {
								rows.push({
									emptyId : 'emptyId' + i
								});
							}
						}
					}
					$.each(rows,function(i, row) {
						var tr = document.createElement('tr');
						if (i % 2 && p.striped) {
							tr.className = 'erow';
						}
						$('thead tr:first th', g.hDiv).each(function() {
							// add cell
							var td = document.createElement('td');
							var idx = $(this).attr('axis').substr(3);
							td.align = this.align;
							if (row.emptyId) {
								td.innerHTML = '';
								$(td).css('height','25px');
								$(tr).addClass('emptyTr');
							} else {
								// If the json
								// elements
								// aren't named
								// (which is
								// typical), use
								// numeric order
								// @Blee,修改row.cell[inx]为row[inx],使用row.cell[inx]会造成json格式过于复杂
								if ('index' === idx) {
									td.innerHTML = (p.page - 1) * p.limit + i + 1;
								} else if ('checkbox' === idx) {
									td.innerHTML = '<span class="checkbox"/>';
								} else if (typeof row[idx] != "undefined") {
									td.innerHTML = (row[idx] != null) ? row.cell[idx]: '';// null-check
									// for
									// Opera-browser
								} else {
									// @Blee,添加renderer支持
									if (typeof (p.colModel[idx].renderer) == 'function') {
										var fn = p.colModel[idx].renderer;
										var result = fn(row[p.colModel[idx].name] , row);
										if (typeof (result) != 'undefined') {
											if (p.autoLimit && typeof (result) == 'string') {
												td.innerHTML = result.replace(/<br\/>/g,'');
											} else {
												td.innerHTML = result;
											}
										}
									} else {
										if (typeof (row[p.colModel[idx].name]) != 'undefined') {
											if (p.autoLimit && typeof (row[p.colModel[idx].name]) == 'string') {
												td.innerHTML = row[p.colModel[idx].name].replace(/<br\/>/g,'');
											} else {
												td.innerHTML = row[p.colModel[idx].name];
											}
										}
									}
								}

								$(tr).data('data', row);
							}
							$(td).attr('abbr',$(this).attr('abbr'));
							$(tr).append(td);
							td = null;
						});
						if ($('thead', this.gDiv).length < 1) {// handle
							// if grid has no headers
							for (idx = 0; idx < cell.length; idx++) {
								var td = document.createElement('td');
								// If the json elements aren't
								// named (which is typical), use
								// numeric order
								if (typeof row.cell[idx] != "undefined") {
									td.innerHTML = (row.cell[idx] != null) ? row.cell[idx]: '';// null-check
									// for Opera-browser
								} else {
									td.innerHTML = row.cell[p.colModel[idx].name];
								}
								$(tr).append(td);
								td = null;
							}
						}
						$(tbody).append(tr);
						tr = null;
					});
				}
				$('tr', t).unbind();
				if(!p.scrollLoad){ //如果不是滚动加载型表格就清空 add by luoyg
					$(t).empty();
				}
				//如果有checkbox列则勾选框需要重置
				$("th[axis='colcheckbox'] span.selected", g.hDiv).removeClass('selected');
				$(t).append(tbody);
				this._addCellProp();
				this._addRowProp();
				this._rePosDrag();
				tbody = null;
				data = null;
				i = null;
				if (typeof(p.onSuccess) == 'function') {
					p.onSuccess(data, textStatus);
				}
				if (p.loadMask) {
					$(g.block).remove();
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if ($.browser.opera) {
					$(t).css('visibility', 'visible');
				}
			},
			/**
			 * @author chenjie
			 * @param data 输入数据(json格式)
			 * @param sortName 排序列的name
			 * @param sortOrder 顺序(非必须，默认为asc)
			 * @returns 输出排序后的数据
			 */
			_sortData : function(data, sortName, sortOrder) {
				for (var i = 0 ;i < data.rows.length; i++ ){
					if (data.rows[i].emptyId) {
						data.rows.splice(i,1);
						i --;
					}
				}
				var sortOrder = sortOrder || p.sortOrder || 'asc';
				if (typeof (p.onClientSort) == 'function') {
					return p.onClientSort(data, sortName, sortOrder, g, p);
				} else if (p.onClientSort == true) {
					var sort = (sortOrder == 'asc' ? 1 : -1);
					var renderer;
					if (p.colModel) {
						for (var i = 0; i < p.colModel.length; i ++) {
							if (p.colModel[i].name == sortName) {
								renderer = p.colModel[i].renderer;
								break;
							}
						} 
					}
					data.rows.sort(function(a, b) {
						var ah = renderer ? renderer(a[sortName], a)
								: a[sortName];
						var bh = renderer ? renderer(b[sortName], b)
								: b[sortName];
						if (ah == bh) {
							return 0;
						} else if (ah < bh) {
							return -1 * sort;
						} else {
							return 1 * sort;
						}
					});
					return data;
				}
			},

			_changeSort : function(th) { // change sortOrder
				if (this.loading) {
					return true;
				}
				$(g.nDiv).hide();
				$(g.nBtn).hide();
				if (p.sortName == $(th).attr('abbr')) {
					if (p.sortOrder == 'asc') {
						p.sortOrder = 'desc';
					} else {
						p.sortOrder = 'asc';
					}
				} else {
					p.sortOrder = 'asc';
				}
				$(th).addClass('sorted').siblings().removeClass('sorted');
				$('.sdesc', this.hDiv).removeClass('sdesc');
				$('.sasc', this.hDiv).removeClass('sasc');
				$('div', th).addClass('s' + p.sortOrder);
				p.sortName = $(th).attr('abbr');

				if (p.onClientSort) {
					g._addData(g._sortData(g.data, p.sortName), 'success');
				} else {
					this._populate();
				}
			},

			// @Blee,构造分页器,应当在此实现懒加载的分页
			_buildPager : function() { // rebuild pager based on new properties
				$('.pageLink', this.pDiv).html(this._calculateLink());
				if (!p.lazyTotalUrl) {
					$('.pcontrol input', this.pDiv).val(p.page);
					$('.pcontrol span', this.pDiv).html(p.pages);
					var r1 = (p.page - 1) * p.limit + 1;
					var r2 = r1 + p.limit - 1;
					if (p.total < r2) {
						r2 = p.total;
					}
					var stat = p.pageStat;
					stat = stat.replace(/{from}/, r1);
					stat = stat.replace(/{to}/, r2);
					stat = stat.replace(/{total}/, p.total);
					$('.pPageStat', this.pDiv).html(stat);
				} else if (!p.aboutTotal) {// 如果该参数不存在,则从服务器上加载
					if (!p.lazyTotalUrl) { //lazyTotalUrl将去掉，此处不做国际化处理，throw去掉
						//throw '未指定lazyTotalUrl';
					}
					$('.pPageStat', this.pDiv).html($.omGrid.lang.count);
					this.loading = true;
					$.ajax({
						url : p.lazyTotalUrl,
						method : p.method,
						dataType : p.dataType,
						data : [{
						    name : '_time_stamp_',
						    value : new Date().getTime()
						}],
						success : function(data) {
							p.aboutTotal = data.total;
							g._buildAboutPage();
							$('select', g.pDiv).attr('disabled','');//让rpOptions可以下拉选择
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							try {
								if (typeof(p.onError) == 'function'){
									p.onError(XMLHttpRequest, textStatus, errorThrown);
								}
							} catch (e) {
								//do nothing 
							} finally {
								return false;
							}
						}
					});
				} else {
					g._buildAboutPage();
				}
				if (p.useRp && !p.autoLimit) {
				    //g._buildLimitOptions();  //重复构建options，去掉
				    if (this.loading) {
				        $('select', g.pDiv).attr('disabled', 'disabled');
				    }
				}
			},
			_buildAboutPage : function() {
				this.loading = false;
				$('.pReload', this.pDiv).removeClass('loading');
				var r1 = (p.page - 1) * p.limit + 1;
				var r2 = r1 + p.pagelen - 1;
				var stat = p.pageStat;
				stat = stat.replace(/{from}/, r1);
				stat = stat.replace(/{to}/, r2);
				stat = stat.replace(/{total}/, p.aboutTotal);
				$('.pPageStat', this.pDiv).html(stat);
			},
			_buildLimitOptions : function(){
			    var opt = '', sel = '';
                for ( var nx = 0; nx < p.rpOptions.length; nx++) {
                    if (p.limit == p.rpOptions[nx])
                        sel = " selected='selected'";
                    else
                        sel = "";
                    opt += "<option value='" + p.rpOptions[nx] + "'" + sel + ">"
                                +$.omGrid.lang.perPage + p.rpOptions[nx] + $.omGrid.lang.word_1+"</option>";
                }
                $('.pGroup:first', g.pDiv).html("<select name='rp'>" + opt + "</select>");
                $('select', g.pDiv).change(function() {
                    if (p.onRpChange) {
                        p.onRpChange(+this.value);
                    } else {
                        p.newp = 1;
                        p.limit = +this.value;
                        g._populate();
                    }
                });
			},
			_calculateLink : function() {
				var r = [];
				if (p.pages <= 1) {
					r.push(1);
				} else if (p.page <= 2) {
					for ( var i = 1; i <= 5 && i <= p.pages; i++) {
						r.push(i);
					}
				} else if (p.pages - p.page < 2) {
					var first = (p.pages - 5 + 1) < 1 ? 1 : (p.pages - 5 + 1);
					for ( var i = first; i <= p.pages; i++) {
						r.push(i);
					}
				} else {
					r = [ p.page - 2, p.page - 1, p.page, p.page + 1,
							p.page + 2 ];
				}
				var html = '';
				for ( var i = 0; i < r.length; i++) {
					html = (html + '<a href="javascript:" class="'
							+ (r[i] == p.page ? 'now-page-link' : '') + '">'
							+ r[i] + '</a>');
				}
				html = $(html);
				html.click(function() {
					g._changePage($(this).text());
				});
				return html;
			},
			_populate : function() { // get latest data
				if (this.loading) {
					return true;
				}
				if (p.onSubmit) {
					var gh = p.onSubmit();
					if (!gh) {
						return false;
					}
				}
				if (p.autoLimit) {
					p.limit = Math.floor($(g.bDiv).height() / 26);
				}
				this.loading = true;
				if (!p.url) {
					return false;
				}
				$('.pPageStat', this.pDiv).html(p.loadingMsg);
				$('.pReload', this.pDiv).addClass('loading');
				$('.loading').children().eq(0).removeClass('om-icon om-icon-refresh');
				$(g.block).css({
					//top : g.gDiv.offsetTop,
					height : $(g.gDiv).height(),
					width : $(g.gDiv).width()
				});
				if (p.loadMask) {
					$(this.gDiv).prepend(g.block);
				}
				if ($.browser.opera) {
					$(t).css('visibility', 'hidden');
				}
				if (p.page > p.pages) {
				    p.page = p.pages;
				}
				if (!p.newp) {
					p.newp = p.page;
				}
				var param = [ {
					name : 'start',
					value : p.limit * (p.newp - 1)
				}, {
					name : 'limit',
					value : p.paged ? p.limit : 0
				}, {
					name : 'sortName',
					value : p.sortName
				}, {
					name : 'sortOrder',
					value : p.sortOrder 
				}, {
					name : 'query',
					value : p.query
				}, {
					name : 'qtype',
					value : p.qtype
				}, {
				    name : '_time_stamp_',
				    value : new Date().getTime()
				} ];
				if (p.params) {
					for ( var pi = 0; pi < p.params.length; pi++) {
						param[param.length] = p.params[pi];
					}
				}
				$.ajax({
					type : p.method,
					url : p.url,
					data : param,
					dataType : p.dataType,
					success : function(data, textStatus) {
						if (p.onClientSort && p.sortName) {
							data = g._sortData(data,p.sortName);
						}
						g._addData(data, textStatus);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						try {
							$('.pPageStat', g.pDiv).html(p.errorMsg).css('color','red');
							if (p.loadMask) {
								$(g.block).remove();
							}
							$('.pReload', g.pDiv).removeClass('loading');
							if (typeof(p.onError) == 'function') {
								p.onError(XMLHttpRequest, textStatus, errorThrown);
							}
						} catch (e) {
							// do nothing 
						} finally {
							return false;
						}
						
 					}
				});
			},
			_setParams : function(params) {
				p.params = params || {};
				p.newp = 1;
				this._populate();
			},
			_doSearch : function() {
				p.query = $('input[name=q]', g.sDiv).val();
				p.qtype = $('select[name=qtype]', g.sDiv).val();
				p.newp = 1;
				this._populate();
			},
			_changePage : function(ctype) { // change page
				if (this.loading) {
					return true;
				}
				switch (ctype) {
				case 'first':
					p.newp = 1;
					break;
				case 'prev':
					if (p.page > 1) {
						p.newp = parseInt(p.page) - 1;
					}
					break;
				case 'next':
					if (p.page < p.pages) {
						p.newp = parseInt(p.page) + 1;
					}
					break;
				case 'last':
					p.newp = p.pages;
					break;
				case 'input':
					var nv = parseInt($('.pcontrol input', this.pDiv).val());
					if (isNaN(nv)) {
						nv = 1;
					}
					if (nv < 1) {
						nv = 1;
					} else if (nv > p.pages) {
						nv = p.pages;
					}
					$('.pcontrol input', this.pDiv).val(nv);
					p.newp = nv;
					break;
				default:
					if (/\d/.test(ctype)) {
						if (isNaN(nv)) {
							nv = 1;
						}
						var nv = parseInt(ctype);
						;
						if (nv < 1) {
							nv = 1;
						} else if (nv > p.pages) {
							nv = p.pages;
						}
						$('.pcontrol input', this.pDiv).val(nv);
						p.newp = nv;
					}
				}
				if (p.newp == p.page) {
					return false;
				}
				if (p.changepage) {
					p.changepage(p.newp);
				} else {
					this._populate();
				}
			},
			_addCellProp : function() {
				$('tbody tr td', g.bDiv).each(function() {
				  if($(this.children).length == 0 || $(this.children)[0].tagName != 'DIV'){   //add by luoyg 博客类型列表是累加形式，故前面的行依据处理过样式，无需再处理
					var tdDiv = document.createElement('div');
					var n = $('td', $(this).parent()).index(this);
					var pth = $('th:eq(' + n + ')', g.hDiv).get(0);
					if (pth != null) {
						if (p.sortName == $(pth).attr('abbr') && p.sortName) {
							this.className = 'sorted';
						}
						$(tdDiv).css({
							textAlign : pth.align,
							width : $('div:first', pth)[0].style.width
						});
						if (pth.hidden) {
							$(this).css('display', 'none');
						}
					}
					if (p.noWrap == false) {
						$(tdDiv).css('white-space', 'normal');
					}
					if (this.innerHTML == '') {
						this.innerHTML = '&nbsp;';
					}
					tdDiv.innerHTML = this.innerHTML;
					var prnt = $(this).parent()[0];
					var pid = false;
					if (prnt.id) {
						pid = prnt.id.substr(3);
					}
					if (pth != null) {
						if (pth.process)
							pth.process(tdDiv, pid);
					}
					$(this).empty().append(tdDiv).removeAttr('width'); // wrap
					// content
				  }
				});
			},
			_getCellDim : function(obj) {// get cell prop for editable event
				var ht = parseInt($(obj).height());
				var pht = parseInt($(obj).parent().height());
				var wt = parseInt(obj.style.width);
				var pwt = parseInt($(obj).parent().width());
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'));
				var pdt = parseInt($(obj).css('paddingTop'));
				return {
					ht : ht,
					wt : wt,
					top : top,
					left : left,
					pdl : pdl,
					pdt : pdt,
					pht : pht,
					pwt : pwt
				};
			},
			// row: tr 
			// state: hover, erow, highlight
			_changeRowState : function(row, state, ctrlkey) {
			    if (state == 'hover') {
			        
			    } else if(state == 'erow') {
			        
			    } else if(state == 'highlight') {
			        if (row.hasClass('om-state-highlight')) {
			            row.removeClass('om-state-highlight');
                        if (p.singleSelect || !ctrlkey) {
                            row.siblings().removeClass('om-state-highlight');
                            if(p.striped) {
                                row.parent().find("tr:odd").addClass('erow');
                            }
                        } else {
                            if(p.striped) {
                                row.parent().find("tr:odd").filter(row).addClass('erow');
                            }
                        }
                    } else {
                        row.addClass('om-state-highlight');
                        if (p.singleSelect || !ctrlkey) {
                            row.siblings().removeClass('om-state-highlight');
                            if (p.striped) {
                                row.parent().find("tr:odd").addClass('erow');
                            }
                        }
                        row.removeClass('erow');
                    }
			    }
			},
			_addRowProp : function() {
				$('tbody tr', g.bDiv).each(function() {
					var hCheckbox = $('span.checkbox',$(this).closest('div').siblings('.hDiv'));
					if ($(this).hasClass('emptyTr')) {
						return;
					}
					$(this).click(function(e) {
						var obj = (e.target || e.srcElement);
						if (obj.href || obj.type)
							return true;
						var rst = p.onRowClick(e, $(this).data('data'), g);
						if (rst === false) {
							return true;
						}
						g._changeRowState($(this), 'highlight', e.ctrlKey);
						hCheckbox.addClass('selected');
						if (!$(this).hasClass('om-state-highlight') || $(this).siblings().not('.om-state-highlight').not('.emptyTr').length != 0){
							hCheckbox.removeClass('selected');
						}
						p.onRowSelect(g);
					}).mousedown(function(e) {
						if (e.shiftKey) {
							$(this).toggleClass('om-state-highlight');
							hCheckbox.addClass('selected');
							if (!$(this).hasClass('om-state-highlight') || $(this).siblings().not('.om-state-highlight').not('.emptyTr').length != 0){
								hCheckbox.removeClass('selected');
							}
							p.onRowSelect(g);
							g.multisel = true;
							this.focus();
							$(g.gDiv).noSelect();
						}
					}).mouseup(function() {
						if (g.multisel) {
							g.multisel = false;
							$(g.gDiv).noSelect(false);
						}
					}).hover(function(e) {
					    if($(this).hasClass('erow')){
                            $(this).removeClass('erow');
                            $(this).addClass('erow-hover');
                        }
                        $(this).addClass('om-state-hover');
						if (g.multisel) {
							$(this).toggleClass('om-state-highlight');
							hCheckbox.addClass('selected');
							if (!$(this).hasClass('om-state-highlight') || $(this).siblings().not('.om-state-highlight').not('.emptyTr').length != 0){
								hCheckbox.removeClass('selected');
							}
							p.onRowSelect(g);
						}
					}, function() {
					    if($(this).hasClass('erow-hover') && !$(this).hasClass('om-state-highlight')){
                            $(this).removeClass('erow-hover');
                            $(this).addClass('erow');
                        }
                        $(this).removeClass('om-state-hover');
					}).dblclick(function(e) {
						try {
							p.onRowDblClick(e, $(this).data('data'), g);
						} catch (e) {
							if (typeof(p.onError) == 'function')
								p.onError(null, 'error', e);
						}
					});
					if (p.showCheckbox) {
						var me = $(this);
						$('span.checkbox', this).click(function(e) {
							me.toggleClass('om-state-highlight');
							hCheckbox.addClass('selected');
							if (!me.hasClass('om-state-highlight') || me.siblings().not('.om-state-highlight').not('.emptyTr').length != 0){
								hCheckbox.removeClass('selected');
							}
							p.onRowSelect(g); 
							e.stopPropagation();
						});
					}
				});
			},
			pager : 0
		};
		if (p.colModel) { // create model if any
			thead = document.createElement('thead');
			var tr = document.createElement('tr');
			// @Blee,允许将col设置为autoExpand而自动充满
			var fullCol = null;
			var max = p.width == 'auto' ? $(t).parent().width() : p.width;
			var already = 0;
			if (p.showIndex) {// 构造序号列
				var th = document.createElement('th');
				$(th).attr('axis', 'colindex');
				$(th).attr('width', 25);
				$(th).attr('align', 'center');
				$(tr).append($(th));
				already += 37;
				/*
				if (p.showCheckbox) {
					$(th).css('border-right', 'none');
				}
				*/
			}
			if (p.showCheckbox) {// 构造checkbox列
				var th = document.createElement('th');
				th.innerHTML = '<span class="checkbox"/>';
				$(th).attr('axis', 'colcheckbox');
				$(th).attr('width', 17);
				$(th).attr('align', 'center');
				$(tr).append($(th));
				already += 29;
				/*
				if (p.showIndex) {
					$(th).css('border-left', 'none');
				}
				*/
			}
			for ( var i = 0; i < p.colModel.length; i++) {
				var cm = p.colModel[i];
				var th = document.createElement('th');
				th.innerHTML = cm.header;
				if (cm.sortable) {
				    $(th).attr('sortable', true);
				}
				if (cm.name) {
				    $(th).attr('abbr', cm.name);
				}
				$(th).attr('axis', 'col' + i);
				if (cm.align) {
					th.align = cm.align;
				}
				if (cm.width) {
					if (cm.width == 'autoExpand') {
						if (fullCol) {
							throw $.omGrid.lang.throw_msg_1;
						}
						fullCol = $(th);
						fullCol.data('autoExpandMin', cm.autoExpandMin
								|| p.defaultColWidth);
					} else {
						$(th).attr('width', cm.width);
						if (!cm.hide) {
							already += (cm.width + 12);
						}
					}
				} else {
					$(th).attr('width', p.defaultColWidth);
					if (!cm.hide) {
						already += (p.defaultColWidth + 12);
					}
				}
				if (cm.hide) {
					th.hidden = true;
				}
				if (cm.process) {
					th.process = cm.process;
				}
				$(tr).append(th);
			}
			if (fullCol) {
				var w = max - already;
				if (w <= fullCol.data('autoExpandMin')) {
					w = fullCol.data('autoExpandMin');
				}
				if (!p.autoLimit) {
					w -= 18;
				}
				fullCol.attr('width', w - 17);// 15为应有的padding等,20为滚动条预留宽度
				fullCol.data('autoExpand', 'yes');
				fullCol.data('autoExpandMin', fullCol.data('autoExpandMin'));
			}
			$(thead).append(tr);
			$(t).prepend(thead);
		} // end if p.colmodel
		// init divs
		g.gDiv = document.createElement('div'); // create global container
		g.mDiv = document.createElement('div'); // create title container
		g.hDiv = document.createElement('div'); // create header container
		g.bDiv = document.createElement('div'); // create body container
		g.vDiv = document.createElement('div'); // create grip
		g.rDiv = document.createElement('div'); // create horizontal resizer
		g.cDrag = document.createElement('div'); // create column drag
		g.block = document.createElement('div'); // creat blocker
		g.nDiv = document.createElement('div'); // create column show/hide popup
		g.nBtn = document.createElement('div'); // create column show/hide
		// button
		g.iDiv = document.createElement('div'); // create editable layer
		g.tDiv = document.createElement('div'); // create toolbar
		g.sDiv = document.createElement('div');
		g.pDiv = document.createElement('div'); // create pager container
		if (!p.paged || p.scrollLoad) { //如果设置为了无限滚动表格，则自动屏蔽分页工具条
			g.pDiv.style.display = 'none';
		}
		g.hTable = document.createElement('table');
		g.gDiv.className = baseclasses;
		if (p.width != 'auto') {
			g.gDiv.style.width = p.width + 'px';
		}
		// add conditional classes
		if ($.browser.msie) {
			$(g.gDiv).addClass('ie');
		}
		if (p.noVStripe) {
			$(g.gDiv).addClass('novstripe');
		}
		$(t).before(g.gDiv);
		$(g.gDiv).append(t);
		// set toolbar
		if (p.buttons) {
			g.tDiv.className = 'tDiv om-widget-header';
			var tDiv2 = document.createElement('div');
			tDiv2.className = 'tDiv2';
			for ( var i = 0; i < p.buttons.length; i++) {
				var btn = p.buttons[i];
				if (!btn.separator) {
					var btnDiv = document.createElement('div');
					btnDiv.className = 'fbutton';
					//不设置icon的话将不显示图片
					if (btn.icon || btn.imgclass){
						btnDiv.innerHTML = " <div> <span class='tbIcon'></span><span class='tbText'>"
								+ btn.name + "</span></div>";
						btn.icon && $('span.tbIcon', btnDiv).css('background-image', 'url("' + btn.icon + '")');
						btn.imgclass && $('span.tbIcon', btnDiv).addClass(btn.imgclass);
				    }else{
				    	btnDiv.innerHTML = " <div><span class='tbText'>"
							+ btn.name + "</span></div>";
				    }
					if (btn.bclass)
						$('span', btnDiv).addClass(btn.bclass);
					btnDiv.click = btn.click;
					btnDiv.name = btn.name;
					if (btn.click) {
						$(btnDiv).click(function() {
							this.click(this.name, g, $(btnDiv).find('span').get(0));
						});
					}
					$(tDiv2).append(btnDiv);
					if ($.browser.msie && $.browser.version < 7.0) {
						$(btnDiv).hover(function() {
							$(this).addClass('fbOver');
						}, function() {
							$(this).removeClass('fbOver');
						});
					}
				} else {
					$(tDiv2).append("<div class='btnseparator'></div>");
				}
			}
			$(g.tDiv).append(tDiv2);
			$(g.tDiv).append("<div style='clear:both'></div>");
			$(g.gDiv).prepend(g.tDiv);
		}
		if (p.toolbar) {
			if (!$('#'+p.toolbar)) {
				return;
			}
			g.tDiv.className = 'tDiv om-widget-header';
			var tDiv2 = $('#'+p.toolbar);
			$(g.tDiv).append(tDiv2.clone(true).addClass("tDiv2"));
			tDiv2.remove();
			$(g.gDiv).prepend(g.tDiv);
		}
		g.hDiv.className = 'hDiv om-state-default';
		$(t).before(g.hDiv);
		g.hTable.cellPadding = 0;
		g.hTable.cellSpacing = 0;
		$(g.hDiv).append('<div class="hDivBox"></div>');
		$('div', g.hDiv).append(g.hTable);
		var thead = $("thead:first", t).get(0);
		if (thead){
			$(g.hTable).append(thead);
		}
		thead = null;
		var ci = 0;
		$('thead tr:first th', g.hDiv).each(function() {
			var thdiv = document.createElement('div');
			if ($(this).attr('sortable') && !p.scrollLoad) {
				$(this).click(function(e) {
					if (!$(this).hasClass('thOver')){
						$(this).addClass('thOver om-state-hover');
						return false;
					}
					var obj = (e.target || e.srcElement);
					if (obj.href || obj.type)
						return true;
					g._changeSort(this);
				});
				if ($(this).attr('abbr') == p.sortName) {
					this.className = 'sorted';
					thdiv.className = 's' + p.sortOrder;
				}
			}
			if (this.hidden) {
				$(this).hide();
			}
			if (!p.colModel) {
				$(this).attr('axis', 'col' + ci++);
			}
			$(thdiv).css({
				textAlign : this.align,
				height : '16px',
				width : this.width + 'px'
			});
			$(thdiv).addClass('checkboxheader');
			thdiv.innerHTML = this.innerHTML;
			$(this).empty().append(thdiv).removeAttr('width').mousedown(function(e) {
				var axis = $(this).attr('axis');
				if (axis == 'colindex' || axis == 'colcheckbox') {
					return;
				}
				g._dragStart('colMove', e, this);
			}).hover(function() {
				var axis = $(this).attr('axis');
				if (axis == 'colindex' || axis == 'colcheckbox') {
					return;
				}
				if (!g.colresize && !$(this).hasClass('thMove') && !g.colCopy) {
					$(this).addClass('thOver om-state-hover');
				}
				if ($(this).attr('abbr') != p.sortName && !g.colCopy && !g.colresize && $(this).attr('sortable')) {
					$('div', this).addClass('s' + p.sortOrder);
				} else if ($(this).attr('abbr') == p.sortName && 
						!g.colCopy && !g.colresize && $(this).attr('abbr')) {
					var no = (p.sortOrder == 'asc') ? 'desc' : 'asc';
					$('div', this).removeClass('s' + p.sortOrder).addClass('s' + no);
				}
				if (g.colCopy) {
					var n = $('th', g.hDiv).index(this);
					if (n == g.dcoln) {
						return false;
					}
					if (n < g.dcoln) {
						$(this).append(g.cdropleft);
					} else {
						$(this).append(g.cdropright);
					}
					g.dcolt = n;
				} else if (!g.colresize) {
					var nv = $('th:visible',g.hDiv).index(this);
					var onl = parseInt($('div:eq(' + nv + ')',g.cDrag).css('left'));
					var nw = jQuery(g.nBtn).outerWidth();
					var nl = onl - nw + Math .floor(p.cgwidth / 2);
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					$(g.nBtn).css({
						'left' : nl,
						top : g.hDiv.offsetTop
					}).show();
					var ndw = parseInt($(g.nDiv).width());
					$(g.nDiv).css({
						top : g.bDiv.offsetTop - 3
					});
					if ((nl + ndw) > $(g.gDiv).width()) {
						$(g.nDiv).css('left',onl - ndw + 1);
					} else {
						$(g.nDiv).css('left',nl);
					}
					if ($(this).hasClass('sorted')) {
						$(g.nBtn).addClass('srtd');
					} else {
						$(g.nBtn).removeClass('srtd');
					}
				}
			},
			function() {
				$(this).removeClass('thOver om-state-hover');
				if ($(this).attr('abbr') != p.sortName) {
					$('div', this).removeClass('s' + p.sortOrder);
				} else if ($(this).attr('abbr') == p.sortName) {
					var no = (p.sortOrder == 'asc') ? 'desc' : 'asc';
					$('div', this).addClass('s' + p.sortOrder).removeClass('s' + no);
				}
				if (g.colCopy) {
					$(g.cdropleft).remove();
					$(g.cdropright).remove();
					g.dcolt = null;
				}
			}); // wrap content
		});
		if (p.showCheckbox) {
			$('thead tr:first span.checkbox', g.hDiv).click(function() {
				$(this).toggleClass('selected');
				if ($(this).hasClass('selected')) {
					$('tbody tr', g.bDiv).filter(function() {
						return !$(this).hasClass('emptyTr');
					}).addClass('om-state-highlight');
				} else {
					$('tbody tr', g.bDiv).removeClass('om-state-highlight');
				}
				p.onRowSelect(g);
			});
		}
		// set bDiv
		g.bDiv.className = 'bDiv';
		//if (p.autoLimit) {      //autoLimit属性没有暴露文档，默认却为true，当行内字符超过列宽会换行，导致下面的行不可见，而不出现滚动条将无法查看隐藏内容，所以去掉
		//	$(g.bDiv).css('overflow-y', 'auto');
		//}
		$(t).before(g.bDiv);
		$(g.bDiv).css({
			height : (p.height == 'auto') ? 'auto' : p.height + "px"
		}).scroll(function(e) {
			g._scroll();
		}).append(t);
		if (p.height == 'auto') {
			$('table', g.bDiv).addClass('autoht');
		}
		// add td & row properties
		g._addCellProp();
		g._addRowProp();
		// set cDrag
		var cdcol = $('thead tr:first th:first', g.hDiv).get(0);
		if (cdcol != null) {
			g.cDrag.className = 'cDrag';
			g.cdpad = 0;
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderLeftWidth'))) ? 0
					: parseInt($('div', cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderRightWidth'))) ? 0
					: parseInt($('div', cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingLeft'))) ? 0
					: parseInt($('div', cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingRight'))) ? 0
					: parseInt($('div', cdcol).css('paddingRight')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0
					: parseInt($(cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0
					: parseInt($(cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0
					: parseInt($(cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0
					: parseInt($(cdcol).css('paddingRight')));
			$(g.bDiv).before(g.cDrag);
			var cdheight = $(g.bDiv).height();
			var hdheight = $(g.hDiv).height();
			$(g.cDrag).css({
				top : -hdheight + 'px'
			});
			$('thead tr:first th', g.hDiv).each(function() {
				var cgDiv = document.createElement('div');
				$(g.cDrag).append(cgDiv);
				if (!p.cgwidth) {
					p.cgwidth = $(cgDiv).width();
				}
				$(cgDiv).css({
					height : cdheight + hdheight
				});
				if ('colcheckbox' == $(this).attr('axis')) {// checkbox列不可以调整大小
					$(cgDiv).addClass('checkboxcol');
					return;
				}
				if ('colindex' == $(this).attr('axis')) {
					$(cgDiv).addClass('indexcol');
					return;
				}
				$(cgDiv).mousedown(function(e) {
					g._dragStart('colresize', e, this);
				});
				if ($.browser.msie && $.browser.version < 7.0) {
					g._fixHeight($(g.gDiv).height());
					$(cgDiv).hover(function() {
						g._fixHeight();
						$(this).addClass('dragging');
					}, function() {
						if (!g.colresize)
							$(this).removeClass('dragging');
					});
				}
			});
		}
		// add strip
		if (p.striped) {
			$('tbody tr:odd', g.bDiv).addClass('erow');
		}
		if (p.resizable && p.height != 'auto') {
			g.vDiv.className = 'vGrip';
			$(g.vDiv).mousedown(function(e) {
				g._dragStart('vresize', e);
			}).html('<span></span>');
			$(g.bDiv).after(g.vDiv);
		}
		if (p.resizable && p.width != 'auto' && !p.nohresize) {
			g.rDiv.className = 'hGrip';
			$(g.rDiv).mousedown(function(e) {
				g._dragStart('vresize', e, true);
			}).html('<span></span>').css('height', $(g.gDiv).height());
			if ($.browser.msie && $.browser.version < 7.0) {
				$(g.rDiv).hover(function() {
					$(this).addClass('hgOver');
				}, function() {
					$(this).removeClass('hgOver');
				});
			}
			$(g.gDiv).append(g.rDiv);
		}
		// 分页工具条
		if (p.paged) {
			g.pDiv.className = 'pDiv om-state-default';
			g.pDiv.innerHTML = '<div class="pDiv2"></div>';
			$(g.bDiv).after(g.pDiv);
			var separator = '<div class="btnseparator"/>';
			var toPreGroup = '<div class="pGroup"><div class="pFirst pButton"><span class="om-icon om-icon-seek-start"></span></div><div class="pPrev pButton"><span class="om-icon om-icon-seek-prev"></span></div></div> ';
			var lazyToPreGroup = '<div class="pGroup"><div class="pPrev pButton"><span></span></div></div> ';
			var pageLinkGroup = '<div class="pGroup"><span class="pageLink"></span></div>';
			var toNextGroup = '<div class="pGroup"><div class="pNext pButton"><span class="om-icon om-icon-seek-next"></span></div><div class="pLast pButton"><span class="om-icon om-icon-seek-end"></span></div></div>';
			var lazyToNextGroup = '<div class="pGroup"><div class="pNext pButton"><span></span></div></div>';
			var pageText = p.pageText;
			pageText = pageText.replace(/{totalPage}/, '<span>1</span>');
			pageText = pageText.replace(/{index}/, '<input type="text" size="4" value="1" />');
			var jumpGroup = '<div class="pGroup"><span class="pcontrol">' + pageText + '</span></span></div>';
			var refreshGroup = '<div class="pGroup"> <div class="pReload pButton"><span class="om-icon om-icon-refresh"></span></div> </div>';
			var stateGroup = '<div class="pGroup"><span class="pPageStat"></span></div>';
			var html = [ p.lazyTotalUrl ? lazyToPreGroup : toPreGroup, separator,
					pageLinkGroup, separator,
					p.lazyTotalUrl ? lazyToNextGroup : toNextGroup, separator,
					p.lazyTotalUrl ? '' : jumpGroup, p.lazyTotalUrl ? '' : separator,
					refreshGroup, separator, stateGroup ].join('');
			$('div', g.pDiv).html(html);
			$('.pReload', g.pDiv).click(function() {
				g._populate();
			});
			$('.pFirst', g.pDiv).click(function() {
				g._changePage('first');
			});
			$('.pPrev', g.pDiv).click(function() {
				g._changePage('prev');
			});
			$('.pNext', g.pDiv).click(function() {
				g._changePage('next');
			});
			$('.pLast', g.pDiv).click(function() {
				g._changePage('last');
			});
			$('.pcontrol input', g.pDiv).keydown(function(e) {
				if (e.keyCode == 13){
					g._changePage('input');
				    e.preventDefault(); //阻止默认事件，避免在增加了form之后提交整个表单刷新页面。
				}
			});
			
				$('.pButton', g.pDiv).hover(function() {
					$(this).addClass('om-state-hover');
				}, function() {
					$(this).removeClass('om-state-hover');
				});
			if (p.useRp && !p.autoLimit) {
				var opt = '', sel = '';
				for ( var nx = 0; nx < p.rpOptions.length; nx++) {
					if (p.limit == p.rpOptions[nx])
						sel = 'selected="selected"';
					else
						sel = '';
					opt += "<option value='" + p.rpOptions[nx] + "' " + sel
							+ " >"+$.omGrid.lang.perPage + p.rpOptions[nx] + $.omGrid.lang.word_1+"</option>";
				}
				$('.pDiv2', g.pDiv)
						.prepend(
								"<div class='pGroup'><select name='rp'>"
										+ opt
										+ "</select></div> <div class='btnseparator'></div>");
				$('select', g.pDiv).change(function() {
					if (p.onRpChange) {
						p.onRpChange(+this.value);
					} else {
						p.newp = 1;
						p.limit = +this.value;
						g._populate();
					}
				});
			}
			// add search button
			if (p.searchItems) {
				$('.pDiv2', g.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span>" +
						"</span></div> </div>  " +
						"<div class='btnseparator'></div>");
				$('.pSearch', g.pDiv).click(function() {
					$(g.sDiv).slideToggle('fast',function() {
						$('.sDiv:visible input:first', g.gDiv).trigger('focus');
					});
				});
				// add search box
				g.sDiv.className = 'sDiv om-state-header';
				var sitems = p.searchItems;
				var sopt = '', sel = '';
				for ( var s = 0; s < sitems.length; s++) {
					if (p.qtype == '' && sitems[s].isdefault == true) {
						p.qtype = sitems[s].name;
						sel = 'selected="selected"';
					} else {
						sel = '';
					}
					sopt += "<option value='" + sitems[s].name + "' " + sel
							+ " >" + sitems[s].display
							+ "&nbsp;&nbsp;</option>";
				}
				if (p.qtype == '') {
					p.qtype = sitems[0].name;
				}
				$(g.sDiv).append(
						"<div class='sDiv2'>" + p.findtext
								+ " <input type='text' value='" + p.query
								+ "' size='30' name='q' class='qsbox' /> "
								+ " <select name='qtype'>" + sopt
								+ "</select></div>");
				// Split into separate selectors because of bug in jQuery 1.3.2
				$('input[name=q]', g.sDiv).keydown(function(e) {
					if (e.keyCode == 13) {
						g._doSearch();
					}
				});
				$('select[name=qtype]', g.sDiv).keydown(function(e) {
					if (e.keyCode == 13) {
						g._doSearch();
					}
				});
				$('input[value=Clear]', g.sDiv).click(function() {
					$('input[name=q]', g.sDiv).val('');
					p.query = '';
					g._doSearch();
				});
				$(g.bDiv).after(g.sDiv);
			}
		}
		$(g.pDiv, g.sDiv).append("<div style='clear:both'></div>");
		// add title
		if (p.title) {
			g.mDiv.className = 'mDiv om-widget-header';
			g.mDiv.innerHTML = '<div class="ftitle">' + p.title + '</div>';
			$(g.gDiv).prepend(g.mDiv);
			if (p.showTableToggleBtn) {
				$(g.mDiv)
						.append(
								'<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
				$('div.ptogtitle', g.mDiv).click(function() {
					$(g.gDiv).toggleClass('hideBody');
					$(this).toggleClass('vsble');
				});
			}
		}
		// setup cdrops
		g.cdropleft = document.createElement('span');
		g.cdropleft.className = 'cdropleft';
		g.cdropright = document.createElement('span');
		g.cdropright.className = 'cdropright';
		// add block
		g.block.className = 'gBlock';
		var gh = $(g.bDiv).height();

		$(g.block).append('<div align="center" />');
		$("div", g.block).css('margin-top', gh / 2);
		$("div", g.block).append('<div class="loadingImg" style="display:block"/>');
		
		var gtop = g.bDiv.offsetTop;
		$(g.block).css({
			width : g.bDiv.style.width,
			height : gh,
			background : 'white',
			//marginBottom : (gh * -1),
			zIndex : 1, 
			//top : gtop,
			left : '0px'
		});
		$(g.block).fadeTo(0, p.blockOpacity);
		// add column control
		if ($('th', g.hDiv).length) {
			g.nDiv.className = 'nDiv';
			g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(g.nDiv).css({
				marginBottom : (gh * -1),
				display : 'none',
				top : gtop - 3
			}).noSelect();
			var cn = 0;
			$('th div', g.hDiv).each(function() {
				var axis = $(this).parent().attr('axis');
				if ('colcheckbox' == axis || 'colindex' == axis) {
					return;
				}
				var kcol = $("th[axis='col" + cn + "']", g.hDiv)[0];
				if (typeof (kcol) == 'undefined') {
					return;
				}
				var chk = 'checked="checked"';
				if (kcol.style.display == 'none') {
					chk = '';
				}
				$('tbody', g.nDiv).append(
						'<tr><td class="ndcol1"><input type="checkbox" '
						+ chk + ' class="togCol" value="'
						+ (cn++)
						+ '" /></td><td class="ndcol2">'
						+ this.innerHTML + '</td></tr>'
				);
			});
			if ($.browser.msie && $.browser.version < 7.0)
				$('tr', g.nDiv).hover(function() {
					$(this).addClass('ndcolover');
				}, function() {
					$(this).removeClass('ndcolover');
				});
			$('td.ndcol2', g.nDiv).click(function() {
				if ($('input:checked', g.nDiv).length <= p.minColToggle
						&& $(this).prev().find('input')[0].checked)
					return false;
				return g._toggleCol($(this).prev().find('input').val());
			});
			$('input.togCol', g.nDiv).click(function() {
				if ($('input:checked', g.nDiv).length < p.minColToggle
						&& this.checked == false)
					return false;
				$(this).parent().next().trigger('click');
			});
			$(g.gDiv).prepend(g.nDiv);
			$(g.nBtn).addClass('nBtn').html('<div></div>').attr('title', $.omGrid.lang.showColumnsMsg).click(function() {
				$(g.nDiv).toggle();
				return true;
			});
			if (p.showToggleBtn) {
				$(g.gDiv).prepend(g.nBtn);
			}
		}
		// add date edit layer
		$(g.iDiv).addClass('iDiv').css({
			display : 'none'
		});
		$(g.bDiv).append(g.iDiv);
		// add omGrid events
		$(g.bDiv).hover(function() {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		}, function() {
			if (g.multisel) {
				g.multisel = false;
			}
		});
		$(g.gDiv).hover(function() {
		}, function() {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		});
		// add document events
		$(document).mousemove(function(e) {
			g._dragMove(e);
		}).mouseup(function(e) {
			g._dragEnd();
		}).hover(function() {
		}, function() {
			g._dragEnd();
		});
		// browser adjustments
		if ($.browser.msie && $.browser.version < 7.0) {
			$('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv', g.gDiv).css({
				width : '100%'
			});
			$(g.gDiv).addClass('ie6');
			if (p.width != 'auto') {
				$(g.gDiv).addClass('ie6fullwidthbug');
			}
		}
		g._rePosDrag();
		g._fixHeight();
		// make grid functions accessible
		t.p = p;
		t.grid = g;
		// load data
		if (p.url && p.autoLoad) {
			g._populate();
		}
		return t;
	};
	var docloaded = false;
	$(document).ready(function() {
		docloaded = true;
	});
	
	var publicMethods = {
	     //reload the data from server
	    /**
	     * 重新从远程加载表格数据，该方法会触发Ajax请求。
	     * @name omGrid#reload
	     * @function
	     * @returns jQuery对象
	     * @example
	     * //根据现有的url重新加载远程数据
	     * $('.selector).omGrid('reload');  //注意reload没有传入参数
	     */
		reload : function(){
		    var self = this[0];
		    if (!self.grid) {
                throw $.omGrid.lang.throw_msg_2;
                return this;
            }
		    self.grid._populate();
		    return this;
		},
		//reload the data in client
		/**
		 * 根据当前grid数据模型中的数据刷新grid。<b>注意：该方法并不会发送Ajax请求</b>
		 * @name omGrid#refresh
		 * @function
		 * @returns jQuery对象
		 * @example
		 * //根据当前grid数据模型中的数据，重新刷新grid
		 * $('.selector').omGrid('refresh');//注意refresh没有传入参数
		 * 
		 */
		refresh : function(){
		    var self = this[0];
		    if (!self.grid) {
                throw $.omGrid.lang.throw_msg_2;
                return this;
            }
		    if ($(self.grid.block)) {
		        $(self.grid.block).css({
		            top : 0,
		            left : 0
		        });
		        $(self).closest('.om-grid').append(self.grid.block);
		    }
		    self.grid._addData(self.grid.data, 'notmodified');//调用addData
		    return this;
		},
		repaint : function(){
		    //null
		    return this;
		},
		//add new properties to config options
		/**
		 * 更新表格的配置属性。该方法除了更新配置属性外不会有更多操作（比如更新url后不会触发从服务器端取数的操作）。
		 * @name omGrid#options
		 * @function
		 * @param p 新的JSON格式配置对象，该对象覆盖初始化配置对象的相关属性
		 * @returns jQuery对象
		 * @example
		 * // 更换grid的url属性，调用reload方法更新表格数据。
		 * $('.selector').omGrid('options', {
		 *     url : 'newgriddata.do?'
		 * });
		 * $('.selector').omGrid('reload');
		 */
		options : function(p){
		    var self = this[0];
		    if (!self.grid || !self.p) {
                throw $.omGrid.lang.throw_msg_2;
                return this;
            }
		    $.extend(self.p, p);
		    return this;
		},
		//toggle column's visibility
		/**
		 * 设置某一列的隐藏状态。
		 * @name omGrid#toggleCol
		 * @function
		 * @param cid 表格的列id(从0开始计数)
		 * @param visible 显示的状态 true为显示 false为隐藏
		 * @returns jQuery对象
		 * @example
		 * $('.selector').omGrid('toggleCol', 3, false);//将第四列隐藏
		 */
		toggleCol : function(cid, visible){
		    var self = this[0];
		    if (!self.grid) {
                throw $.omGrid.lang.throw_msg_2;
                return this;
            }
		    self.grid._toggleCol(cid, visible);
		    return this;
		},
		//replace grid with new datas,datas is an array
		/**
		 * 设置表格数据，既可以是本地数据，也可以是远程数据。通过该方法grid会立即刷新数据。
		 * @name omGrid#setData
		 * @function
		 * @param datas 一个url或者一个JSON数组
		 * @returns jQuery对象
		 * @example
		 * //通过一个固定的JSON数组来重新加载grid
		 * $('.selector').omGrid('setData',[
         *      {"address":"CZ88.NET ","city":"IANA保留地址","end":"0.255.255.255","id":"1","start":"0.0.0.0"},
         *      {"address":"CZ88.NET ","city":"澳大利亚","end":"1.0.0.255","id":"2","start":"1.0.0.0"},
         *      {"address":"电信 ","city":"福建省","end":"1.0.3.255","id":"3","start":"1.0.1.0"},
         *      {"address":"CZ88.NET ","city":"泰国","end":"1.0.255.255","id":"9","start":"1.0.128.0"},
         *      {"address":"CZ88.NET ","city":"日本","end":"1.0.31.255","id":"6","start":"1.0.16.0"},
         *      {"address":"电信 ","city":"广东省","end":"1.0.63.255","id":"7","start":"1.0.32.0"},
         *      {"address":"CZ88.NET ","city":"澳大利亚","end":"1.0.7.255","id":"4","start":"1.0.4.0"},
         *      {"address":"CZ88.NET ","city":"日本","end":"1.0.127.255","id":"8","start":"1.0.64.0"}
         *  ]);
         *  //通过一个url来发送Ajax请求重新加载grid的数据
         *  $('.selector').omGrid('setData', 'newgriddata.do?method=fast');
		 */
		setData : function(datas){
		    var self = this[0];
		    if (!self.grid) {
		        throw $.omGrid.lang.throw_msg_2;
		        return this;
		    }
		    if (typeof(datas) === 'string') {
		        self.p.url = datas;
		        self.grid.reload();
		    } else {
		        self.grid.data.total = datas.length;
		        self.grid.data.page = datas.page ? datas.page : 1;
		        self.grid.data.rows = datas;
		        self.grid._addData(self.grid.data, 'success');
		    }
		    return this;
		},
		//get
		/**
         * 获取表格JSON数据。<br/>
         * 数据格式为：<br/>
         * {<br/>
         * &nbsp;&nbsp;&nbsp;&nbsp;    total:30, // data数据中记录的总数<br/>
         * &nbsp;&nbsp;&nbsp;&nbsp;    page:1,   // 当面页码<br/>
         * &nbsp;&nbsp;&nbsp;&nbsp;    rows:[{...},{...}] // 当前页的所有数据<br/>
         * }<br/>
         * <br/>
         * <b>注意：total为服务器端返回的total总数，不是当前的数据总数</b>
         *     
         * @name omGrid#getData
         * @function
         * @returns 如果grid中有数据，则返回grid的数据源（一个JSON对象，由当前页所有记录组成的JSON数组），当存在多页数据时，该方法只返回当前页的数据。如果grid中没有数据，则直接返回undefined
         * @example
         * //获取grid的数据源
         * var store = $('.selector').omGrid('getData');
         * 
         * 
         */
		getData : function() {
		    var self = this[0];
		    if (!self.grid) {
		        throw $.omGrid.lang.throw_msg_2;
                return this;
            }
		    if (self.grid.data){
		        return self.grid.data;
		    }
		    return this;
		},
		//append new datas to grid, datas is an array
		/**
		 * 将本地数据拼接到grid末尾。<b>注意：不支持远程数据的拼接</b>
		 * @name omGrid#appendData
		 * @function
		 * @param datas JSON格式数组，被拼接到grid末尾的数据
		 * @returns jQuery对象
		 * @example
		 * //将数据拼接到grid末尾
		 * $('.selector').omGrid('appendData',[
         *      {"address":"天朝 ","city":"京都","end":"1.0.63.255","id":"7","start":"1.0.32.0"},
         *      {"address":"天朝 ","city":"中原","end":"1.0.7.255","id":"4","start":"1.0.4.0"},
         *      {"address":"CZ88.NET ","city":"日本","end":"1.0.127.255","id":"8","start":"1.0.64.0"}
         *  ]);
		 * 
		 */
		appendData : function(datas){
		    var self = this[0];
		    if (!self.grid) {
                throw $.omGrid.lang.throw_msg_2;
                return this;
            }
		    self.grid.data.total += datas.length;
		    self.grid.data.rows = self.grid.data.rows.concat(datas);
		    self.grid._addData(self.grid.data, 'success');
		    return this;
		},
		/**
		 * 返回表格中被选中行的data数据组成的JSON数组。
		 * @name omGrid#getSelections
		 * @function
		 * @returns 选中行的data数组(JSON数组)
		 * @example 
		 * //取出选中行的data数组
         * $('.selector').omGrid('getSelections');
		 */
		getSelections : function() {
		    var self = this[0];
		    if (!self.grid) {
		        throw $.omGrid.lang.throw_msg_2;
                return this;
		    }
		    return self.grid._getSelections();
		}, 
		/**
		 * 根据colId指定表格的列，根据valArray指定的该列的值数组，去选中表格中相关的行。
		 * @name omGrid#setSelections
		 * @function
		 * @param valArray 表格某一列的值数组，类型为Array，如果只有一个值，也可以直接写一个String
		 * @param colId  表格的列id，如果不设置，默认是字符串'id'
		 * @returns jQuery对象
		 * @example
		 * //将表格address列中，值为'CZ88.NET'的行设置为选中状态
         * $('.selector').omGrid('setSelections', ['CZ88.NET'], 'address');
         *                            
		 */
		setSelections : function(valArray, colId) {
		    var self = this[0];
            if (!self.grid) {
                throw $.omGrid.lang.throw_msg_2;
                return this;
            }
            self.grid._setSelections(valArray, colId ? colId : 'id');
            return this;
		}
	};
	
	$.fn.omGrid = function(p) {
		if (p && typeof(p) == 'string') {
			if (publicMethods[p]) {
			    try {
			        return publicMethods[p].apply(this, Array.prototype.slice.call(arguments, 1));
			    } catch (e) {
			        var emsg = e + ' cannot invoke the methd:' + p;
			        throw emsg;
			    }
			}
			return null;
		}
		
		return this.each(function() {
			if (!docloaded) {
				$(this).hide();
				var t = this;
				$(document).ready(function() {
					$.addFlex(t, p);
				});
			} else {
				$.addFlex(this, p);
			}
		});
	}; // end omGrid
	$.extend($,{omGrid:{}});
    $.omGrid.lang={
            /**
             * 显示列按钮的提示信息。
             * @type String
             * @default '显示列'
             */
            loadingMsg : '正在加载数据，请稍候...',
            pageText : '共{totalPage}页，第{index}页' ,
            emptyMsg : '没有数据',
            errorMsg : '连接失败',
            pageStat : '共{total}条数据，显示第{from}条到{to}条',
            count : '正在计算总数...',
            perPage : '每页',
            word_1 : '条',
            throw_msg_1 : '不能指定两个autoExpand列!',
            throw_msg_2 : '表格尚未初始化.',
            showColumnsMsg : '显示列'
    };
//	$.fn.flexReload = function(p) { // function to reload grid
//		return this.each(function() {
//			if (this.grid && this.p.url)
//				this.grid._populate();
//		});
//	}; // end flexReload
//	$.fn.flexOptions = function(p) { // function to update general options
//		return this.each(function() {
//			if (this.grid)
//				$.extend(this.p, p);
//		});
//	}; // end flexOptions
//	$.fn.flexToggleCol = function(cid, visible) { // function to reload grid
//		return this.each(function() {
//			if (this.grid)
//				this.grid._toggleCol(cid, visible);
//		});
//	}; // end flexToggleCol
//	$.fn.flexAddData = function(data) { // function to add data to grid
//		return this.each(function() {
//			if (this.grid)
//				this.grid._addData(data);
//		});
//	};
	$.fn.noSelect = function(p) { // no select plugin by me :-)
		var prevent = (p == null) ? true : p;
		if (prevent) {
			return this.each(function() {
				if ($.browser.msie || $.browser.safari)
					$(this).bind('selectstart', function() {
						return false;
					});
				else if ($.browser.mozilla) {
					$(this).css('MozUserSelect', 'none');
					$('body').trigger('focus');
				} else if ($.browser.opera)
					$(this).bind('mousedown', function() {
						return false;
					});
				else
					$(this).attr('unselectable', 'on');
			});
		} else {
			return this.each(function() {
				if ($.browser.msie || $.browser.safari)
					$(this).unbind('selectstart');
				else if ($.browser.mozilla)
					$(this).css('MozUserSelect', 'inherit');
				else if ($.browser.opera)
					$(this).unbind('mousedown');
				else
					$(this).removeAttr('unselectable', 'on');
			});
		}
	}; // end noSelect
})(jQuery);