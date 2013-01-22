(function($){
    module( "omItemselector: event");
    var status = "none",
    	itemValue;
    test( "event-onBeforeItemDeselect", function() {
    	expect(2);
    	var element;
    	element = $('#selector-event-onBeforeItemDeselect').omItemSelector({
    		dataSource:"./data-source.json",
    		value:["1","2"],
    		onBeforeItemDeselect:function(itemDatas, event){
    			itemValue = itemDatas[0].value;
    			status = "onBeforeItemDeselect";
    		}
		});
    	stop();
    	setTimeout(function(){
    		start();
    		element.find('.om-itemselector-items').eq(1).find('dt').eq(0).click();
    		element.find('div.om-itemselector-tbar-remove').click();
    		equal(status,"onBeforeItemDeselect","onBeforeItemDeselect事件回调函数没有被执行");
    		equal(itemValue,"1","onBeforeItemDeselect事件回调中获取的itemValue值不正确");
    		element.remove();
    	},100);
    });
    test( "event-onBeforeItemSelect", function() {
    	expect(2);
    	var element;
    	element = $('#selector-event-onBeforeItemSelect').omItemSelector({
    		dataSource:"./data-source.json",
    		onBeforeItemSelect:function(itemDatas, event){
    			itemValue = itemDatas[0].value;
    			status = "onBeforeItemSelect";
    		}
    	});
    	stop();
    	setTimeout(function(){
    		start();
    		element.find('.om-itemselector-items').eq(0).find('dt').eq(0).click();
    		element.find('div.om-itemselector-tbar-add').click();
    		equal(status,"onBeforeItemSelect","onBeforeItemSelect事件回调函数没有被执行");
    		equal(itemValue,"1","onBeforeItemSelect事件回调中获取的itemValue值不正确");
    		element.remove();
    	},100);
    });
    test( "event-onItemDeselect", function() {
    	expect(2);
    	var element;
    	element = $('#selector-event-onItemDeselect').omItemSelector({
    		dataSource:"./data-source.json",
    		value:["1","2"],
    		onItemDeselect:function(itemDatas, event){
    			itemValue = itemDatas[0].value;
    			status = "onItemDeselect";
    		}
    	});
    	stop();
    	setTimeout(function(){
    		start();
    		element.find('.om-itemselector-items').eq(1).find('dt').eq(0).click();
    		element.find('div.om-itemselector-tbar-remove').click();
    		equal(status,"onItemDeselect","onItemDeselect事件回调函数没有被执行");
    		equal(itemValue,"1","onItemDeselect事件回调中获取的itemValue值不正确");
    		element.remove();
    	},100);
    });
    test( "event-onItemSelect", function() {
    	expect(2);
    	var element;
    	element = $('#selector-event-onItemSelect').omItemSelector({
    		dataSource:"./data-source.json",
    		onItemSelect:function(itemDatas, event){
    			itemValue = itemDatas[0].value;
    			status = "onItemSelect";
    		}
    	});
    	stop();
    	setTimeout(function(){
    		start();
    		element.find('.om-itemselector-items').eq(0).find('dt').eq(0).click();
    		element.find('div.om-itemselector-tbar-add').click();
    		equal(status,"onItemSelect","onItemSelect事件回调函数没有被执行");
    		equal(itemValue,"1","onItemSelect事件回调中获取的itemValue值不正确");
    		element.remove();
    	},100);
    });
    test( "event-onSuccess", function() {
    	expect(1);
    	var element;
    	element = $('#selector-event-onSuccess').omItemSelector({
    		dataSource:"./data-source.json",
    		onSuccess:function(data, textStatus, event){
    			status = "onSuccess";
    		}
    	});
    	stop();
    	setTimeout(function(){
    		start();
    		equal(status,"onSuccess","onSuccess事件回调函数没有被执行");
    		element.remove();
    	},100);
    });
    test( "event-onError", function() {
    	expect(1);
    	var element;
    	element = $('#selector-event-onSuccess').omItemSelector({
    		dataSource:"./data-source-error.json",
    		onError:function(xmlHttpRequest, textStatus, errorThrown, event){
    			status = "onError";
    		}
    	});
    	stop();
    	setTimeout(function(){
    		start();
    		equal(status,"onError","onError事件回调函数没有被执行");
    		element.remove();
    	},100);
    });
}(jQuery));