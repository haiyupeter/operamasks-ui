/*
 * om-tabs-methods.js
 */
(function($) {

module("omTabs: methods");

test("activate", function() {
	expect(4);
	
	el = $("#tab-option-default").omTabs();
	notEqual(el.omTabs("getActivated") , "tab3" , "第三个页签处于未激活状态");
	
	el.omTabs("activate" , 2);
	equal(el.omTabs("getActivated") , "tab3" , "用[activate('2')激活第三个页签]");
	notEqual(el.omTabs("getActivated") , "tab1" , "第一个页签处于未激活状态");
	el.omTabs("activate" , "tab1");
	equal(el.omTabs("getActivated") , "tab1" , "用[activate('tab1')激活第一个页签]");
});

asyncTest("add", function() {
	expect(8);
	
	el = $("#tab-method-add").omTabs({onActivate:function(){ok(true,"触发activate事件");}});
	var data = {
		index: 1,
		title: "method_add_title",
		content: "method_add_content",
		tabId: "newTab1",
		closable: true
	};
	el.omTabs("add" , data);
	var tabHeader = $(".om-tabs-headers li").eq(data.index);
	equal(tabHeader.find(".om-tabs-inner").html() , data.title , "设置新增页签的标题");
	equal(tabHeader.find(".om-icon-close").length , 1 , "新加的页签可关闭[closable:true]");
	equal($(".om-tabs-panels .om-panel-body" , el).eq(1).html() , data.content , "新增的页签的内容");
	equal(el.omTabs("getActivated") , data.tabId , "新增页签时新增页签会自动被激活");
	
	var data2 = {
		index: "last",
		url: "./remote.html",
		content: "method_add_content",
		closable: false
	};
	el.omTabs("add" , data2);
	
	setTimeout(function(){
		tabHeader = $(".om-tabs-headers li:last").eq(0);
		equal(tabHeader.find(".om-icon-close").length , 0 , "新加的页签不可关闭[closable:false]");
		equal($(".om-tabs-panels .om-panel-body:last" , el).eq(0).html() , REMOTE_DATA , "新增页签，同时指定url和content,url优先级高");
		start();
	} , 500);
});

test("close", function() {
	expect(12);
	
	el = $("#tab-method-close").omTabs({closable:true,onClose:function(){ok(true,"触发onClose");},onActivate:function(){ok("触发onActivate");}});
	notEqual(el.omTabs("getActivated") , "tab2" , "第二个页签未激活");
	el.omTabs("close" , 0);
	equal(el.omTabs("getActivated") , "tab2" , "关闭特定的页签，如果n指向当前页签，则会选中下一页签");
	el.omTabs("activate","tab4");
	equal(el.omTabs("getActivated") , "tab4" , "最后一个页签被激活了");
	el.omTabs("close" , "tab4");
	equal(el.omTabs("getActivated") , "tab2" , "关闭特定的页签，如果当前页签是最末尾的页签，则会选中第一个页签");
	el.omTabs("close");
	equal(el.omTabs("getActivated") , "tab3" , "关闭特定的页签，如果未指定该参数，则默认关闭当前页签");
});

test("closeAll", function() {
	expect(3);
	
	el = $("#tab-method-closeAll").omTabs({closable:true,onClose:function(){ok(true,"触发onClose");},onCloseAll:function(){ok(true,"触发onCloseAll");}});
	el.omTabs("closeAll");
	equal($(".om-tabs-headers li" , el).length , 0 , "执行closeAll之后所有标题栏都被移除了");
	equal($(".om-tabs-panels div.om-panel" , el).length , 0 , "执行closeAll之后所有页签内容都被移除了");
});

test("doLayout", function() {
	expect(5);
	
	el = $("#tab-method-doLayout").omTabs({closable:true,width:'100'});
	var scrollBar = $(".om-tabs-headers>span" , el);
	ok(scrollBar.eq(0).hasClass("om-tabs-scroll-left") , "宽度不够长，出现页签左滚动箭头");
	ok(scrollBar.eq(1).hasClass("om-tabs-scroll-right") , "宽度不够长，出现页签右滚动箭头");
	el.omTabs("closeAll");
	scrollBar = $(".om-tabs-headers>span" , el);
	ok(scrollBar.eq(0).hasClass("om-tabs-scroll-left") , "closeAll之后，页签左滚动箭头依然存在");
	ok(scrollBar.eq(1).hasClass("om-tabs-scroll-right") , "closeAll之后，页签右滚动箭头依然存在");
	el.omTabs("doLayout");
	equal($(".om-tabs-headers>span" , el).length , 0 , "doLayout之后，页签多余的左右两个滚动箭头都消失了");
});

test("getActivated", function() {
	expect(3);
	
	el = $("#tab-option-default").omTabs();
	equal(el.omTabs("getActivated") , "tab1" , "默认激活第一个页签");
	hasClass($(".om-tabs-headers li" , el).eq(0), "om-state-active om-tabs-activated" , "激活的页签标题头拥有om-state-active om-tabs-activated样式");
	notHasClass($(".om-tabs-headers li" , el).eq(1), "om-state-active om-tabs-activated" , "未被激活的页签标题头没有om-state-active om-tabs-activated样式");
});

test("getAlter", function() {
	expect(4);
	
	el = $("#tab-option-default").omTabs();
	equal(el.omTabs("getAlter" , 0) , "tab1" , "利用[getAlter(0)]获取页签的id");
	equal(el.omTabs("getAlter" , "tab2") , 1 , "利用[getAlter(tabId)]获取页签的索引");
	equal(el.omTabs("getAlter" , -1) , null , "[getAlter(-1)]返回null");
	equal(el.omTabs("getAlter" , "test_id") , null , "[getAlter('test_id')]返回null");
});

test("getLength", function() {
	expect(3);
	
	el = $("#tab-method-getLength").omTabs();
	equal(el.omTabs("getLength") , 2 , "初始创建页签数为2");
	el.omTabs("closeAll");
	equal(el.omTabs("getLength") , 0 , "调用closeAll之后页签数为0");
	el.omTabs("add" , {});
	equal(el.omTabs("getLength") , 1 , "调用add之后页签数为1");
	el.remove();
});

asyncTest("reload", function() {
	expect(2);
	
	el = $("#tab-method-reload").omTabs({lazyLoad:true});
	var remote = $(".om-tabs-panels .om-panel-body:last" , el).eq(0);
	
	setTimeout(function(){
		equal(remote.html() , "" , "初始化时指定[lazyLoad:true]远程取数的页签内容暂时是空的");
		el.omTabs("reload" , 2);
		setTimeout(function(){
			equal(remote.html() , REMOTE_DATA , "调用reload之后，重新加载页签内容，原来因为懒加载没有内容的页签现在有内容了");
			el.remove();
			start();
		} , 500);
	} , 500);
});

})(jQuery);
