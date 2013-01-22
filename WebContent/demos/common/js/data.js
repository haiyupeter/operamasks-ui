/**
 * 
 * 请不要格式化此文件
 * 
 * demo示例的配置;
 * 每个分类（category）有多个组件(comps)
 * 每个组件(component)对应多个示例(samples);
 * component 说明:
 *      1) name: 组件名,会显示在左边的navTree中
 *      2) samples :
 *          3.1) title : 该示例的名字,将出现在demo框架的右边
 *          3.2) height : 该示例的大小,该值将决定装载示例iframe的高度.如果没配置该项,则使用默认高度(400px);iframe的宽度是固定的(600px)
 *          3.3) url : 该示例的路径,相对于/demos/index.html
 */
 
var omUiDemos =  {components:[]};

//Widgets分类
omUiDemos.components[0]={
    category: 'Widgets',
    comps: [{name: 'omGrid', samples: [
    			{title: '基本功能', url: 'grid/simple.html',height: 500,java: 'servlet/OmGridServlet.java'},
    			{title: '列渲染', url: 'grid/column-renderer.html',java: 'servlet/OmGridServlet.java'},
    			{title: '隐藏列和分页条', isNew: true, url: 'grid/hide-columnAndPager.html'},
    			{title: '排序功能', height:740,url: 'grid/sort.html',java: 'servlet/OmSortGridServlet.java'},
    			{title: '展开行详情', url: 'grid/row-expander.html',java: 'servlet/OmGridServlet.java'},
    			{title: '基本行编辑',  url: 'grid/row-editor-basic.html'},
    			{title: '单击触发行编辑',  url: 'grid/row-editor-click.html'},
    			{title: '复杂场景',  url: 'grid/row-editor-complex.html'},
    			{title: '行编辑增删改',  url: 'grid/row-editor-editor.html'},
    			{title: '多表头', isNew: true, url: 'grid/header-group-basic.html'},
    			{title: '综合表格',height:410, isNew: true, url: 'grid/complex.html'}
            ]}, {name: 'omTree', samples: [
                {title: '基本功能', url: 'tree/simple.html'}, 
                {title: '异步加载', url: 'tree/async.html', java: 'servlet/OmTreeServlet.java'}, 
                {title: '事件响应', url: 'tree/event.html'},
                {title: '增删改树节点',  url : 'tree/editor.html'},
                {title: '拖拽', url : 'tree/dragdrop.html'},
                {title: '自定义树节点图标',isNew:true, height: 530, url: 'tree/node-icons.html'}
            ]}, {name: 'omButton',samples: [
                {title: '基本功能', url: 'form/button/simple.html'},
                {title: '显示图标', url: 'form/button/icon.html'},
                {title: '属性设置', url: 'form/button/property.html'},
                {title: '按钮事件', url: 'form/button/event.html'},
                {title: '去掉focus虚线框', url: 'form/button/hidden-focus.html'}
            ]}, {name: 'omButtonbar', isNew: true, samples: [
                {title: '基本功能', url: 'form/buttonbar/simple.html'},
                {title: '分组按钮效果', url: 'form/buttonbar/separtor.html'}
            ]}, {name: 'omSlider', samples: [
                {title: '基本功能', height: 480, url: 'slider/simple.html'},
                {title: '动画效果', height: 480, url: 'slider/effect.html'},
                {title: '修改默认导航条样式', height: 480, url: 'slider/change-default-nav-style.html'},
                {title: '自定义导航条', height: 480, url: 'slider/custom-control-nav.html'},
                {title: '复杂的内容加上自定义的导航条', url: 'slider/complex-content.html'},
                {title: '方法和事件', height: 680, url: 'slider/method-event.html'}
            ]}, {name: 'omMenu', samples: [
                {title: '基本功能', height: 480, url: 'menu/simple.html'},
                {title: '使用本地json数据', height: 480, url: 'menu/jsonLocal.html'},
                {title: '使用远程json数据', height: 480, url: 'menu/jsonremote.html', java : 'servlet/OmMenuServlet.java'},
                {title: '右键菜单', height: 480, url: 'menu/contextMenu.html', java : 'servlet/OmMenuServlet.java'},
                {title: '分组菜单', height: 480, url: 'menu/showSeparator.html'},
                {title: '菜单节点不可用', height: 480, url: 'menu/enableDisable.html'},
                {title: '自定义图标', height: 480, url: 'menu/icon.html'},
                {title: '事件支持', height: 480, url: 'menu/event.html'}
            ]}, {name: 'omProgressbar', samples: [
	            {title: '基本功能', height: 480, url: 'progressbar/simple.html'},
	            {title: '进度提示信息', height: 480, url: 'progressbar/showText.html'},
	            {title: 'onChange事件', height: 480, url: 'progressbar/event.html'}
	        ]}, {name: 'omTooltip', samples: [
                {title: '基本功能', height: 480, url: 'tooltip/simple.html'},
                {title: '高级功能', height: 480, url: 'tooltip/advance.html'}
            ]}
	         
    ]
};
    
//Forms分类
omUiDemos.components[1]={
    category: 'Forms',
    comps: [{name: 'omCalendar', samples: [
                {title: '基本功能', height: 300, url: 'form/calendar/simple.html'},
			    {title: '默认日期', height: 300, url: 'form/calendar/default-date.html'},
			    {title: '不可用日期', height: 300, url: 'form/calendar/disabled-days.html'},
			    {title: '日期范围', height: 300, url: 'form/calendar/date-limit.html'},
			    {title: '多页日历', height: 300, url: 'form/calendar/multi-pages.html'},
			    {title: '不带input的日历', height: 300, url: 'form/calendar/non-popup.html'},
			    {title: '选中日期事件', height: 300, url: 'form/calendar/select-event.html'},
			    {title: '起始日期', height: 300, url: 'form/calendar/start-day.html'},
			    {title: '多种日期格式化', height: 350, url: 'form/calendar/format.html'},
			    {title: '显示时间', height: 300, url: 'form/calendar/show-time.html'}
			 ]},{name: 'omCombo', samples: [
			     {title: '基本功能', height: 300, url: 'form/combo/simple.html'},
			     {title: '异步加载', height: 300, url: 'form/combo/remote.html', java: 'servlet/OmComboServlet.java'},
			     {title: '自定义显示字段', height: 300, url: 'form/combo/defineField.html'},
			     {title: '自动过滤', height: 380, url: 'form/combo/filter.html'},
			     {title: '键盘操作', height: 300, url: 'form/combo/keyboard.html'},
			     {title: '默认选中高亮', height: 400, url: 'form/combo/default-select.html'},
			     {title: '多选支持', height: 400, url: 'form/combo/multi.html'},
			     {title: '级联下拉框', height: 300, url: 'form/combo/cascade.html', java: 'servlet/OmCascadeComboServlet.java'},
			     {title: '高级定制下拉框', height: 300, url: 'form/combo/advanced.html'},
			     {title: '下拉框表格', height: 300, url: 'form/combo/gridSelect.html',java: 'servlet/OmGridServlet.java'}
			 ]},{name: 'omNumberField', samples: [
			     {title: '基本功能', height: 200, url: 'form/numberfield/simple.html'},
			     {title: '正整数', height: 200, url: 'form/numberfield/decimal.html'},
			     {title: '设置可用状态', height: 200, url: 'form/numberfield/isableNum.html'},
			     {title: '事件处理', height: 200, url: 'form/numberfield/blurEvent.html'}
			 ]},{name: 'omEditor', samples: [
			     {title: '基本功能', height: 480, url: 'form/editor/simple.html', java: 'servlet/OmEditorServlet.java'},
			     {title: '操作编辑内容', height: 480, url: 'form/editor/edit-data.html'},
			     {title: 'onKeyUp事件', height: 480, url: 'form/editor/on-keyup.html'},
			     {title: '只读模式',height: 480,url: 'form/editor/readonly.html'},
			     {title: '自定义皮肤', height: 480, url: 'form/editor/skin.html'},
			     {title: '简单工具条', height: 380, url: 'form/editor/toolbar-basic.html'},
			     {title: '自定义工具条', height: 480, url: 'form/editor/toolbar-custom.html'},
			     {title: '自定义ui颜色', height: 480, url: 'form/editor/ui-color.html'},
			     {title: '图片上传', height: 480, url: 'form/editor/upload-image.html', java: 'servlet/OmEditorImageUploadServlet.java'},
			     {title: '快捷键', height: 480, url: 'form/editor/keystrokes.html'}
			 ]},{name: 'omSuggestion', samples: [
                 {title: '基本功能', height: 330, url: 'form/suggestion/simple.html', java: 'servlet/SimpleSuggestionServlet.java'},
                 {title: '复杂JSON字符串', height: 330, url: 'form/suggestion/advanced.html', java: 'servlet/AdvancedSuggestionServlet.java'},
                 {title: '键盘操作', height: 330, url: 'form/suggestion/keyboard.html', java: 'servlet/SimpleSuggestionServlet.java'},
                 {title: '事件监听', height: 330, url: 'form/suggestion/event.html', java: 'servlet/SuggestionEventServlet.java'},
                 {title: '定制是否发送请求', height: 330, url: 'form/suggestion/prevent.html', java: 'servlet/SimpleSuggestionServlet.java'},
                 {title: '设置/获取url', height: 330, url: 'form/suggestion/change-url.html', java: 'servlet/ChangeUrlSuggestionServlet.java'},
                 {title: '跨域请求数据', height: 330, url: 'form/suggestion/crossDomain.html'}
             ]},{name: 'validate', samples: [
                 {title: '简单校验', height: 330, url: 'form/validation/simple.html'},
                 {title: '自定义信息展现', height: 330, url: 'form/validation/custom-messages.html'},
                 {title: '校验规则', height: 330, url: 'form/validation/custom-method.html'},
                 {title: '复杂表单校验', height : 330, url : 'form/validation/complex-form.html'},
                 {title: '类淘宝注册页面', height : 330, url : 'form/validation/taobao.html' , java : 'servlet/OmButtonServlet.java'},
                 {title: '校验信息国际化', height : 330, url : 'form/validation/internation.html'},
                 {title: '支持参数的校验信息', height : 330, url : 'form/validation/sendParam.html'},
                 {title: 'rules自定义', height : 330, url : 'form/validation/rules.html'},
                 {title: 'remote校验', height : 330, url : 'form/validation/remote.html', java : 'servlet/OmButtonServlet.java'},
                 {title: 'ajax提交表单校验', height : 330, url : 'form/validation/ajaxSubmit.html', java : 'servlet/OmButtonServlet.java'}
             ]},{name: 'omAjaxSubmit', samples: [
                 {title: 'Ajax提交', height : 350, url : 'form/ajax-submit.html'},
                 {title: '综合', height : 700, url : 'form/ajax-form.html'}
             ]},{name: 'omFileUpload',samples: [
                {title: '基本功能',height:300, url: 'form/fileupload/simple.html', java: 'servlet/OmFileUploadServlet.java'},
                {title: '限制上传文件类型',height:300, url: 'form/fileupload/file-type.html', java: 'servlet/OmFileUploadServlet.java'},
                {title: '限制上传文件大小',height:300, url: 'form/fileupload/size-limit.html', java: 'servlet/OmFileUploadServlet.java'},
                {title: '批量上传文件',height:300, url: 'form/fileupload/multi-files.html', java: 'servlet/OmFileUploadServlet.java'},
                {title: '自定义按钮图片',height:300, url: 'form/fileupload/custom-button.html', java: 'servlet/OmFileUploadServlet.java'},
                {title: '动态更新属性',height:300, url: 'form/fileupload/update-setting.html', java: 'servlet/OmFileUploadServlet.java'},
                {title: '上传附加数据',height:300, url: 'form/fileupload/action-data.html', java: 'servlet/OmFileUploadServlet.java'},
                {title: '事件回调函数',height:350, url: 'form/fileupload/event-data.html', java: 'servlet/OmFileUploadServlet.java'}
             ]},{name: 'omItemSelector',isNew: true, samples: [
                {title: '基本功能',height:350, url: 'form/itemselector/static.html'},
                {title: '动态数据源',height:350, url: 'form/itemselector/dynamic.html', java: 'servlet/OmItemSelectorServlet.java'}              
             ]}
    ]
};

//Window分类
omUiDemos.components[2]={
    category: 'Window',
    comps: [{name: 'omMessageBox', samples: [
                {title: '基本功能', url: 'messagebox/default.html'},
                {title: 'Alert各种图标', url: 'messagebox/alert_icon.html'},
                {title: '标题和内容可以用html', url: 'messagebox/defined.html'}
            ]},{name: 'omDialog', samples: [
                {title: '模态窗口', url: 'dialog/modal.html'}, 
                {title : '对话框按钮', url: 'dialog/dialog-buttons.html'}
            ]},{name: 'omMessageTip', samples: [
                {title: '基本功能', url: 'messagetip/default.html'}, 
                {title : '提示框图标', url: 'messagetip/icons.html'},
                {title : '弹出到其它页面中', url: 'messagetip/outOfIframe.html'}
            ]}
    ]
};

//Layout分类
omUiDemos.components[3]={
    category: 'Layout',
    comps: [{name: 'omPanel', samples: [
    			{title: '基本功能',height: 400, url: 'panel/simple.html'},
    			{title: '自定义工具条',height: 400 ,url: 'panel/tool-custom.html'},
    			{title: '数据远程加载',height: 400 , url: 'panel/dataload.html'}
    		]},{name: 'omTabs', samples: [
                {title: '基本功能',height : 430, url: 'tabs/simple.html'}, 
                {title: '页签右键操作功能',isNew: true, height : 430, url: 'tabs/tabMenu.html'}, 
                {title: '事件监听',height : 550, url: 'tabs/events.html'}, 
                {title: '鼠标划过切换页签',height : 430, url: 'tabs/mouseover.html'},
                {title: '自动循环切换页签',height : 430, url: 'tabs/autoswitch.html'}, 
                {title: '懒加载页签',height : 430, url: 'tabs/lazyload.html'}, 
                {title: '滚动页签',height : 350, url: 'tabs/scrollable.html'}, 
                {title: '设置和获取状态',height : 350, url: 'tabs/status.html'},
                {title: 'iframe加载', height: 400 , url:'tabs/iframe.html'}
            ]},{name: 'omAccordion', samples: [
                {title: '基本功能', height: 320, url: 'accordion/simple.html'},
                {title: '事件监听', height: 500, url: 'accordion/events.html'},
                {title: '自动切换', height: 420, url: 'accordion/autoplay.html'},
                {title: '鼠标划过切换抽屉', height: 420, url: 'accordion/mouseover.html'},
                {title: '动态更新抽屉内容', height: 420, url: 'accordion/toggleurl.html'}
            ]},{name: 'omBorderLayout', samples: [
               {title: '左/右边面板拉伸',isNew: true,height : 1290, url: 'borderlayout/expand-to-top-bottom.html'}, 
               {title: '隐藏收缩按钮',isNew: true,height : 480, url: 'borderlayout/hide-collaps-btn.html'}, 
               {title: 'panel宽度自适应',isNew: true,height : 960, url: 'borderlayout/fit-region-width.html'}, 
               {title: '基本功能',height : 480, url: 'borderlayout/simple.html'}, 
               {title: '基本方法',height : 480, url: 'borderlayout/methods.html'}, 
               {title: '事件监听',height : 480, url: 'borderlayout/events.html'},
               {title: '自适应窗口大小',height : 480, url: 'borderlayout/fit-body.html'}
            ]}
    ]
};

//Layout分类
omUiDemos.components[4]={
    category: 'function',
    comps: [{name: 'omDraggable', samples: [
                {title: '基本功能',height : 430, url: 'draggable/simple.html'}, 
                {title: '事件监听',height : 550, url: 'draggable/event.html'}, 
                {title: '拖动限制',height : 430, url: 'draggable/containment.html'}
            ]},{name: 'omDroppable', samples: [
                {title: '基本功能', height: 320, url: 'droppable/simple.html'},
                {title: '接收范围', height: 500, url: 'droppable/accept.html'},
                {title: '事件传播', height: 420, url: 'droppable/greedy.html'}
            ]},{name: 'omScrollbar',isNew: true, samples: [
                {title: '基本功能', height: 320, url: 'scrollbar/simple.html'},
                {title: '自定义外观', height: 320, url: 'scrollbar/custom.html'}
            ]}
    ]
};

//Example分类
omUiDemos.components[5]={
    category: 'examples',
    comps: [{name: 'layout',  samples: [
               {title: 'tab和布局嵌套',height : 430, url: '../example/borderlayout/borderlayouttab.html'},
               {title: 'grid、tree和布局嵌套',height : 430, url: '../example/borderlayout/borderlayoutgrid.html'},
               {title: 'accordion、panel和布局嵌套',height : 430, url: '../example/borderlayout/borderlayoutaccpanel.html'},
               {title: 'dialog嵌套布局组件',height : 430, url: '../example/borderlayout/dialogBorderlayout.html'} 
            ]},{name: 'combo', samples: [
                {title: '组织部门人员联动', height: 230, url: '../example/combo/cascade.html', java: 'servlet/OMCascadeComboData.java'},
                {title: '下拉表格', height: 480, url: '../example/combo/queryable-combo-grid.html'}
            ]},{name: 'grid', samples: [
                {title: '增删改查', height: 430, url: '../example/grid/simple/crud.html', java: 'servlet/OmGridCrudServlet.java'},
                {title: '异步加载表头', height: 430, url: '../example/grid/colmodel/loadColModel.html', java: 'servlet/OmGridServlet.java'},
                {title: '获取多选数据', height: 430, url: '../example/grid/select/select.html', java: 'servlet/OmGridServlet.java'},
                {title: '权限设置',isNew: true, height: 430, url: '../example/grid/set-authority/authority.html', java: 'servlet/OmGridAuthorityServlet.java'}
            ]},{name: 'suggestion', samples: [
              	{title: 'oa统一搜索', height: 460, url: '../example/suggestion/oa/search.html',java:'servlet/OASearchServlet.java'},                              
              	{title: '淘宝的商品搜索', height: 460, url: '../example/suggestion/taobao/search.html',java:'servlet/TaobaoSearchServlet.java'}                            
            ]},{name: 'validation', samples: [
            	{title: '登录校验', height: 430, url: '../example/validation/login-validate.html',java:'servlet/LoginValidateServlet.java'},
              	{title: '校验样式1', height: 530, url: '../example/validation/validate-style1.html', java : 'servlet/OmButtonServlet.java'},                              
              	{title: '校验样式2', height: 460, url: '../example/validation/validate-style2.html', java : 'servlet/OmButtonServlet.java'},                              
              	{title: '京东商城注册', height: 560, url: '../example/validation/360-reg.html', java : 'servlet/OmRegValidateServlet.java'},                              
              	{title: '当当网注册', height: 530, url: '../example/validation/dangdang-reg.html', java : 'servlet/OmRegValidateServlet.java'}                              
            ]},{name: 'tree', samples: [
                {title: '下拉菜单', height: 560, url: '../example/tree/combotree/combotree.html', java: 'servlet/OmTreeServlet.java'},        
                {title: '树节点查询', height: 430, url: '../example/tree/grid/tree-grid.html', java: 'servlet/OmGridServlet.java'},        
                {title: '导航树', height: 530, url: '../example/tree/nav/navtree.html'},        
                {title: '右键菜单', height: 530, url: '../example/tree/rightmenu/rightmenutree.html'}
            ]},{name: 'advanced', samples: [
                {title: 'f7',height : 430, url: '../example/advanced/f7/f7-select.html', java: 'servlet/F7Servlet.java'},
                {title: 'monitor',isNew: true,height : 430, url: '../example/advanced/monitor/monitor.html', java: 'servlet/OmGridServlet.java'} 
            ]}
    ]
};

