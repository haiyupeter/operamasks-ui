/*
 * om-tabs-events.js
 */
(function($) {

module("omTabs: events");

test("onBeforeActivate onActivate", function() {
	expect(4);
	var active = -1;
	
	el = $("#tab-event-onActivate").omTabs({
		onActivate:function(n){ok(n==active,"触发onActivate，且参数正确");},
		onBeforeActivate:function(n){ok(n==active,"触发onBeforeActivate，且参数正确");}
	});
	active = 1;
	el.omTabs("activate" , 1);//触发onActivate
	active = 2;
	el.omTabs("add" , {});//触发onActivate
	el.omTabs("close" , 1);//不触发onActivate
	el.omTabs("close" , 0);//不触发onActivate
	el.omTabs("close");//不触发onActivate
	el.remove();
});

test("onBeforeAdd onAdd", function() {
	expect(6);
	
	var config = {
		content: "new content1",
		title: "new title1",
		tabId: "newTab1"
	};
	function testAdd(cfg){
		equal(cfg.content , config.content , "onAdd中获取content正确");
		equal(cfg.title , config.title , "onAdd中获取title正确");
		equal(cfg.tabId , config.tabId , "onAdd中获取tabId正确");
	}
	function testBeforeAdd(cfg){
		equal(cfg.content , config.content , "onBeforeAdd中获取content正确");
		equal(cfg.title , config.title , "onBeforeAdd中获取title正确");
		equal(cfg.tabId , config.tabId , "onBeforeAdd中获取tabId正确");
	}
	el = $("#tab-event-onAdd").omTabs({onAdd:testAdd , onBeforeAdd:testBeforeAdd});
	el.omTabs("add" , config);
	el.remove();
});

test("onBeforeClose onClose", function() {
	expect(2);
	
	var close = -1;
	el = $("#tab-event-onClose").omTabs({
		onClose: function(n){ ok(n==close , "触发onClose，且参数正确"); } , 
		onBeforeClose: function(n){ok(n==close , "触发onBeforeClose，且参数正确"); } 
	});
	close = 2;
	el.omTabs("close",2);
	el.omTabs("closeAll");//不触发onClose和onBeforeClose
	el.remove();
});

test("onBeforeCloseAll onCloseAll", function() {
	expect(4);
	
	el = $("#tab-event-onCloseAll").omTabs({
		onCloseAll: function(){ ok(true , "触发onCloseAll"); } , 
		onBeforeCloseAll: function(){ok(true , "触发onBeforeCloseAll"); },
		onBeforeClose:function(n){ ok(true , "触发onBeforeClose"); }, 
		onClose:function(n){ ok(true , "触发onClose"); }
	});
	el.omTabs("close" , 2);//不触发onBeforeCloseAll和onCloseAll
	el.omTabs("closeAll");//不触发onClose和onBeforeClose
	el.remove();
});

asyncTest("onLoadComplete", function() {
	expect(1);
	var tId = "newTabId";
	el = $("#tab-event-onLoadComplete").omTabs({
		onLoadComplete: function(tabId){ ok(tId==tabId , "触发onLoadComplete,且参数正确"); } ,
		lazyLoad: true
	});
	el.omTabs("add" , {tabId:tId , url:'./remote.html'});
	el.omTabs("activate" , 2);
	setTimeout(function(){
		el.omTabs("reload" , 1 , null , 'new content');
		el.remove();
		start();
	} , 500);
});

})(jQuery);
