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
    			{title: '基本功能', url: 'grid/simple.html'},
    			{title: '隔行斑纹', url: 'grid/striped.html'},
    			{title: '列渲染', url: 'grid/column-renderer.html'},
    			{title: '显示勾选框', url: 'grid/checkbox-column.html'},
    			{title: '客户端排序', height: 500, url: 'grid/client-sort.html'},
    			{title: '双击事件', url: 'grid/row-dblclick.html'},
    			{title: '增删改查', height: 460, url: 'grid/crud.html'},
    			{title: 'LoadMask', url: 'grid/block-opacity.html'},
    			{title: '滚动装载', url: 'grid/scroll-load.html'},
    			{title: '延迟加载', height: 460, url: 'grid/deferred.html'},
    			{title: '工具条', url: 'grid/toolbar.html'},
    			{title: '综合', height: 460, url: 'grid/composite.html'}
            ]}, {name: 'omTree', samples: [
                {title: '基本功能', url: 'tree/simple.html'}, 
                {title: '异步加载', url: 'tree/async.html'}, 
                {title: '展开收缩', url: 'tree/prepends.html'}, 
                {title: '事件响应', url: 'tree/event.html'},
                {title: '多选', url: 'tree/check.html'},
                {title: '增删改树节点',  url : 'tree/editor.html'},
                {title: '查询节点', height: 480, url : 'tree/search_node.html'},
                {title: '拖拽', url : 'tree/dragdrop.html'}
            ]}, {name: 'omButton',samples: [
                {title: '基本功能', url: 'form/button/simple.html'},
                {title: '显示图标', url: 'form/button/icon.html'},
                {title: '属性设置', url: 'form/button/property.html'},
                {title: '按钮事件', url: 'form/button/event.html'},
                {title: '工具条按钮', url: 'form/button/toolbar.html'},
                {title: '去掉focus虚线框', url: 'form/button/hidden-focus.html'}
            ]}, {name: 'omSlider', samples: [
                {title: '基本功能', height: 480, url: 'slider/simple.html'},
                {title: '动画效果', height: 480, url: 'slider/effect.html'},
                {title: '修改默认导航条样式', height: 480, url: 'slider/change-default-nav-style.html'},
                {title: '自定义导航条', height: 480, url: 'slider/custom-control-nav.html'},
                {title: '复杂的内容加上自定义的导航条', url: 'slider/complex-content.html'},
                {title: '方法和事件', height: 680, url: 'slider/method-event.html'}
            ]}/*,{name: 'omMenu',samples: [
                {title: '开发中',url: 'inprogress.html'}
            ]},{name: 'omUpdater',samples: [
                {title: '开发中',url: 'inprogress.html'}
            ]},{name: 'omPageLink',samples: [
                {title: '开发中',url: 'inprogress.html'}
            ]}*/
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
			     {title: '异步加载', height: 300, url: 'form/combo/remote.html'},
			     {title: '自定义显示字段', height: 300, url: 'form/combo/defineField.html'},
			     {title: '自动过滤', height: 380, url: 'form/combo/filter.html'},
			     {title: '键盘操作', height: 300, url: 'form/combo/keyboard.html'},
			     {title: '默认选中高亮', height: 400, url: 'form/combo/default-select.html'},
			     {title: '级联下拉框', height: 300, url: 'form/combo/cascade.html'},
			     {title: '高级定制下拉框', height: 300, url: 'form/combo/advanced.html'},
			     {title: '下拉框表格', height: 300, url: 'form/combo/gridSelect.html'}
			 ]},{name: 'omNumberField', samples: [
			     {title: '基本功能', height: 200, url: 'form/numberfield/simple.html'},
			     {title: '正整数', height: 200, url: 'form/numberfield/decimal.html'},
			     {title: '设置可用状态', height: 200, url: 'form/numberfield/isableNum.html'}
			 ]},{name: 'omEditor', samples: [
			     {title: '基本功能', height: 480, url: 'form/editor/simple.html'},
			     {title: '操作编辑内容', height: 480, url: 'form/editor/edit-data.html'},
			     {title: 'onKeyUp事件', height: 480, url: 'form/editor/on-keyup.html'},
			     {title: '只读模式',height: 480,url: 'form/editor/readonly.html'},
			     {title: '自定义皮肤', height: 480, url: 'form/editor/skin.html'},
			     {title: '简单工具条', height: 380, url: 'form/editor/toolbar-basic.html'},
			     {title: '自定义工具条', height: 480, url: 'form/editor/toolbar-custom.html'},
			     {title: '自定义ui颜色', height: 480, url: 'form/editor/ui-color.html'},
			     {title: '图片上传', height: 480, url: 'form/editor/upload-image.html'},
			     {title: '快捷键', height: 480, url: 'form/editor/keystrokes.html'}
			 ]},{name: 'omSuggestion', samples: [
                 {title: '基本功能', height: 330, url: 'form/suggestion/simple.html'},
                 {title: '复杂JSON字符串', height: 330, url: 'form/suggestion/advanced.html'},
                 {title: '键盘操作', height: 330, url: 'form/suggestion/keyboard.html'},
                 //{title: '缓存数据',height: 330,url: 'form/suggestion/cache.html'},
                 {title: '事件监听', height: 330, url: 'form/suggestion/event.html'},
                 {title: '定制是否发送请求', height: 330, url: 'form/suggestion/prevent.html'},
                 {title: '设置/获取url', height: 330, url: 'form/suggestion/change-url.html'},
                 {title: '跨域请求数据', height: 330, url: 'form/suggestion/crossDomain.html'}
             ]},{name: 'validate', samples: [
                 {title: '简单校验', height: 330, url: 'form/validation/simple.html'},
                 {title: '自定义信息展现', height: 330, url: 'form/validation/custom-messages.html'},
                 {title: '校验规则', height: 330, url: 'form/validation/custom-method.html'},
                 {title: '复杂表单校验', height : 330, url : 'form/validation/complex-form.html'},
                 {title: '类淘宝注册页面', height : 330, url : 'form/validation/taobao.html'},
                 {title: '校验信息国际化', height : 330, url : 'form/validation/internation.html'},
                 {title: '支持参数的校验信息', height : 330, url : 'form/validation/sendParam.html'},
                 {title: 'rules自定义', height : 330, url : 'form/validation/rules.html'},
                 {title: 'remote校验', height : 330, url : 'form/validation/remote.html'}
             ]},{name: 'omAjaxSubmit', samples: [
                 {title: 'Ajax提交', height : 350, url : 'form/ajax-submit.html'},
                 {title: '综合', height : 700, url : 'form/ajax-form.html'}
             ]}/*,{name: 'omSpinner',samples: [
                {title: '开发中',url: 'inprogress.html'}
             ]}*/
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
    comps: [/*{name: 'omPanel',samples: [
                {title: '开发中',url: 'inprogress.html'}
            ]},*/{name: 'omTabs', samples: [
                {title: '基本功能',height : 430, url: 'tabs/simple.html'}, 
                {title: '事件监听',height : 550, url: 'tabs/events.html'}, 
                {title: '鼠标划过切换页签',height : 430, url: 'tabs/mouseover.html'},
                {title: '自动循环切换页签',height : 430, url: 'tabs/autoswitch.html'}, 
                {title: '懒加载页签',height : 430, url: 'tabs/lazyload.html'}, 
                {title: '滚动页签',height : 350, url: 'tabs/scrollable.html'}, 
                {title: '设置和获取状态',height : 350, url: 'tabs/status.html'}
            ]},{name: 'omAccordion', samples: [
                {title: '基本功能', height: 320, url: 'accordion/simple.html'},
                {title: '事件监听', height: 500, url: 'accordion/events.html'},
                {title: '自动切换', height: 420, url: 'accordion/autoplay.html'},
                {title: '鼠标划过切换抽屉', height: 420, url: 'accordion/mouseover.html'},
                {title: '动态更新抽屉内容', height: 420, url: 'accordion/toggleurl.html'}
            ]}
    ]
};
