/*
 * om-tabs-options.js
 */
(function($) {

module("omTabs: set options");

test("active", function() {
	expect(5);
	
	el = $("#tab-option-default").omTabs();
	active = $(".om-tabs-headers li" , el).eq(0);
	hasClass(active , 'om-state-active om-tabs-activated', '默认初始化选中第一个tab');
	
	el = $("#tab-option-default").omTabs({active:1});
	active = $(".om-tabs-headers li" , el).eq(1);
	hasClass(active , 'om-state-active om-tabs-activated', '初始化时通过索引指定要选中的tab');
	
	el = $("#tab-option-default").omTabs({active:'tab3'});
	active = $(".om-tabs-headers li" , el).eq(2);
	hasClass(active , 'om-state-active om-tabs-activated', '初始化时通过tabId指定要选中的tab');
	
	//非法值测试
	el = $("#tab-option-default").omTabs({active:-1});
	active = $(".om-tabs-headers li" , el).eq(0);
	hasClass(active , 'om-state-active om-tabs-activated', '初始化非法值[active:-1]时默认激活第一个页签');
	
	el = $("#tab-option-default").omTabs({active:100});
	active = $(".om-tabs-headers li" , el).eq(2);
	hasClass(active , 'om-state-active om-tabs-activated', '初始化非法值[active:100]时默认激活最后一个页签');
});

test("border", function() {
	expect(8);
	el = $("#tab-option-border-true").omTabs();
	hasBorder(el , '初始化指定[border:true]时页签正文区是有边框的');
	
	el = $("#tab-option-border-true").omTabs({border:false});
	noBorder(el , '初始化指定[border:false]时页签正文区没有边框');
});

test("closable", function() {
	expect(13);
	
	el = $("#tab-option-closable-true").omTabs();
	equal($(".om-tabs-headers .om-icon-close" , el).length , 0 , '默认初始化所有页签都是不可关闭的');
	
	el = $("#tab-option-closable-true").omTabs({closable:true});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 2 , '初始化指定[closable:true]所有页签都是可关闭的');
	el.omTabs("add" , {closable:true});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 3 , '添加新的页签，并指定[{closable:true}]');
	el.omTabs("add" , {closable:false});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 3 , '添加新的页签，并指定[{closable:false}]');
	
	el = $("#tab-option-closable-true").omTabs({closable:false});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 0 , '初始化指定[closable:false]所有页签都是不可关闭的');
	el.omTabs("add" , {closable:true});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 1 , '添加新的页签，并指定[{closable:true}]');
	el.omTabs("add" , {closable:false});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 1 , '添加新的页签，并指定[{closable:false}]');
	
	el = $("#tab-option-closable-true").omTabs({closable:[0,2]});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 2 , '初始化指定[closable:[0,2]]有两个页签可关闭');
	$(".om-tabs-headers li" , el).each(function(n){
		switch(n){
			case 0:
				equal($(".om-icon-close" , this).length , 1 , '初始化指定[closable:[0,2]]索引为0的页签可关闭');
			break;
			case 1:
				equal($(".om-icon-close" , this).length , 0 , '初始化指定[closable:[0,2]]索引为1的页签不可关闭');
			break;
			case 2:
				equal($(".om-icon-close" , this).length , 1 , '初始化指定[closable:[0,2]]索引为2的页签可关闭');
			break;
		}
	});
	el.omTabs("add" , {closable:true});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 3 , '添加新的页签，并指定[{closable:true}]');
	el.omTabs("add" , {closable:false});
	equal($(".om-tabs-headers .om-icon-close" , el).length , 3 , '添加新的页签，并指定[{closable:false}]');
});

test("height", function() {
	expect(2);
	
	el = $("#tab-option-height-fit").omTabs({height:'fit'});
	//在IE6下设置height=100%,则其行为是: 子容器的child.outerHeight = parent.height, 但其它浏览器均为 child.innerHeight = parent.height
	equal( 200 , el.parent().outerHeight(), '初始化指定[height:"fit"]组件高度填充父容器');
	
	el = $("#tab-option-height-fit").omTabs({height:'300px'});
	equal(el.innerHeight() , el.height() , '初始化指定[height:"300px"]组件高度则为300px');
});

asyncTest("lazyLoad", function() {
//	expect(4);
	expect(3);
	
	el = $("#tab-option-lazyLoad-default").omTabs();
	var elNotLazy = $("#tab-option-lazyLoad-default").omTabs({lazyLoad:false});
	var elLazy = $("#tab-option-lazyLoad-default").omTabs({lazyLoad:true});
	setTimeout(function(){
		notEqual($(".om-tabs-panels .om-panel-body:last" , el).html() , '' , '默认初始化为非懒加载');
		notEqual($(".om-tabs-panels .om-panel-body:last" , elNotLazy).html() , '', '初始化指定[lazyLoad:false]进行非懒加载取数');
		// 去掉此测试, 因为默认lazyLoad 为 false 已经进行了取数
		// equal($(".om-tabs-panels .om-panel-body:last" , elLazy).html() , '', '初始化指定[lazyLoad:true]进行懒加载取数');
		//懒加数取数时，选中页签后才进行取数
		$(".om-tabs-headers li:last" , elLazy).eq(0).find('a').simulate('click');
		setTimeout(function(){
			notEqual($(".om-tabs-panels .om-panel-body:last" , elLazy).html() , '', '懒加载页签选中后会进行取数');
			start();
		},500);
	},500);
});

asyncTest("scrollable", function() {
	expect(8);
	el = $("#tab-option-scrollable-default").omTabs({width:'200'});
	var scrollBar = $(".om-tabs-headers>span" , el);
	hasClass(scrollBar.eq(0) , "om-tabs-scroll-left" , "默认初始化，宽度不够长，出现页签左滚动箭头");
	hasClass(scrollBar.eq(1) , "om-tabs-scroll-right" , "默认初始化，宽度不够长，出现页签右滚动箭头");
	
	el = $("#tab-option-scrollable-default").omTabs({width:'200',scrollable:true});
	scrollBar = $(".om-tabs-headers>span" , el);
	hasClass(scrollBar.eq(0) , "om-tabs-scroll-left" , "初始化指定[scrollable:true]，宽度不够长，出现页签左滚动箭头");
	hasClass(scrollBar.eq(1) , "om-tabs-scroll-right" , "初始化指定[scrollable:true]，宽度不够长，出现页签右滚动箭头");
	el.omTabs("close" , 2);
	el.omTabs("close" , 1);
	//由于滚动箭头的出现或者隐藏会有延迟，故必须采用异步方式
	setTimeout(function(){
		equal(scrollBar.length , 0 , "close方法会自动处理滚动箭头");
		el = $("#tab-option-scrollable-default").omTabs({width:'200',scrollable:true});
		el.omTabs("add" , {});
		el.omTabs("add" , {});
		setTimeout(function(){
			scrollBar = $(".om-tabs-headers>span" , el);
			hasClass(scrollBar.eq(0) , "om-tabs-scroll-left" , "close方法会自动处理左滚动箭头");
			hasClass(scrollBar.eq(1) , "om-tabs-scroll-right" , "close方法会自动处理右滚动箭头");
			start();
		} , 500);
	} , 500);
	
	//注意，必须重新定义变量，不然上边的setTimeout回调中的el将会得不到正确的结果，会被覆盖掉了
	var el2 = $("#tab-option-scrollable-default").omTabs({width:'200',scrollable:false});
	scrollBar = $(".om-tabs-headers>span" , el2);
	equal(scrollBar.length , 0 , "初始化指定[scrollable:false]，宽度不够了长，不会出现处理滚动箭头");
});

asyncTest("switchMode", function() {
	expect(8);
	
	el = $("#tab-option-switchMode-click").omTabs({switchMode:'click'});
	notEqual(el.omTabs("getActivated") , "tab2" , "初始化指定[switchMode:'click']第二个页签未选中");
	$(".om-tabs-headers li:last" , el).eq(0).find('a').simulate('click');
	equal(el.omTabs("getActivated") , "tab2" , "第二个页签被鼠标点击后选中了");
	notEqual(el.omTabs("getActivated") , "tab1" , "第二个页签处于选中状态，第一个页签处于未选中状态");
	$(".om-tabs-headers li:first" , el).eq(0).find('a').simulate('mouseover');
	notEqual(el.omTabs("getActivated") , "tab1" , "鼠标滑过第一个页签，第一个页签还是未选中");
	
	el = $("#tab-option-switchMode-click").omTabs({switchMode:'mouseover'});
	equal(el.omTabs("getActivated") , "tab2" , "初始化指定[switchMode:'mouseover']第二个页签未选中");
	$(".om-tabs-headers li:last" , el).eq(0).find('a').simulate('mouseover');
	setTimeout(function(){
		equal(el.omTabs("getActivated") , "tab2" , "第二个页签被鼠标滑过后选中了");
		notEqual(el.omTabs("getActivated") , "tab1" , "第二个页签处于选中状态，第一个页签处于未选中状态");
		$(".om-tabs-headers li:first" , el).eq(0).find('a').simulate('mouseover');
		setTimeout(function(){
			equal(el.omTabs("getActivated") , "tab1" , "鼠标滑过第一个页签，第一个页签被选中了");
			start();
		} , 500);
	} , 500);
});

test("tabHeight", function() {
	expect(3);
	
	el = $("#tab-option-switchMode-tabHeight").omTabs();
	//由于IE6下只要设置了height和line-height,那么line-height会撑大height,所以在这里对IE6进行特殊处理
	equal($(".om-tabs-headers li >.om-tabs-inner" , el).height()-(($.browser.msie && parseInt($.browser.version) == 6)?1:0) , omTabs_defaults.tabHeight, 'tabHeight的默认值为27px' );
	
	el = $("#tab-option-switchMode-tabHeight").omTabs({tabHeight: 30});
	equal($(".om-tabs-headers li >.om-tabs-inner" , el).height() , 30 , '初始化指定[tabHeight:30]');
	
	el = $("#tab-option-switchMode-tabHeight").omTabs({tabHeight: 50});
	equal($(".om-tabs-headers li >.om-tabs-inner" , el).height() , 50 , '初始化指定[tabHeight:50]');
});

test("tabWidth", function() {
	expect(3);
	
	el = $("#tab-option-switchMode-tabWidth").omTabs();
	var style = $(".om-tabs-headers li" , el).find("a").attr('style');
	equal(true , style.indexOf('auto') != -1 , 'tabWidth的默认值为auto' );
	
	el = $("#tab-option-switchMode-tabWidth").omTabs({tabWidth: 70});
	equal($(".om-tabs-headers li" , el).find("a").width() , 70 , '初始化指定[tabWidth:70]');
	
	el = $("#tab-option-switchMode-tabWidth").omTabs({tabWidth: 90});
	equal($(".om-tabs-headers li" , el).find("a").width() , 90 , '初始化指定[tabWidth:90]');
});

test("width", function() {
	expect(2);
	
	el = $("#tab-option-width-fit").omTabs({width:'fit'});
	equal(400 , el.parent().width(), '初始化指定[width:"fit"]组件宽度填充父容器');
	
	el = $("#tab-option-width-fit").omTabs({width:'300px'});
	equal(el.innerWidth() , el.width() , '初始化指定[width:"300px"]组件宽度则为300px');
});

})(jQuery);