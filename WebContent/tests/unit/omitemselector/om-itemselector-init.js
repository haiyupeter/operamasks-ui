(function($){
    module( "omItemselector: init");
    test( "width", function() {
        expect(1);
        var element,width;
        element = $('#selector-init-width').omItemSelector({width:500});
        element.omItemSelector({width:700});
        width = element.width();
        equal(width,700,"重新设置width后宽度不正确");
        element.remove();
    });
    test( "height", function() {
    	expect(1);
    	var element,height;
    	element = $('#selector-init-width').omItemSelector({height:300});
    	element.omItemSelector({height:700});
    	height = element.height();
    	equal(height,700,"重新设置height后高度不正确");
    	element.remove();
    });
    test( "availableTitle", function() {
    	expect(1);
    	var element,title;
    	element = $('#selector-init-availableTitle').omItemSelector({availableTitle:"测试availableTitle"});
    	element.omItemSelector({availableTitle:"新的availableTitle"});
    	title = element.find('.header span.om-itemselector-title').eq(0).html();
    	equal(title,"新的availableTitle","重新设置availableTitle属性不正确");
    	element.remove();
    });
    test( "selectedTitle", function() {
    	expect(1);
    	var element,title;
    	element = $('#selector-init-selectedTitle').omItemSelector({selectedTitle:"测试selectedTitle"});
    	element.omItemSelector({selectedTitle:"新的selectedTitle"});
    	title = element.find('.header span.om-itemselector-title').eq(1).html();
    	equal(title,"新的selectedTitle","重新设置selectedTitle属性不正确");
    	element.remove();
    });
    test( "dataSource", function() {
    	expect(8);
    	var element,itemSize,itemText;
    	// 本地数据
    	element = $('#selector-init-dataSource-local').omItemSelector({dataSource:[{"text":"北京","value":"1"},{"text":"上海","value":"2"},{"text":"广州","value":"3"}]});
    	element.omItemSelector({dataSource:[{"text":"中国","value":"1"},{"text":"朝鲜","value":"2"},{"text":"俄罗斯","value":"3"}]});
    	itemSize = element.find('.om-itemselector-items').eq(0).find('dt').size();
    	equal(itemSize,3,"重新设置dataSource属性后渲染的item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(0).text();
    	equal(itemText,"中国","重新设置dataSource属性后渲染的第一个item显示文字不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    	equal(itemText,"朝鲜","重新设置dataSource属性后渲染的第二个item显示文字不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(2).text();
    	equal(itemText,"俄罗斯","重新设置dataSource属性后渲染的第三个item显示文字不正确");
    	
    	// 远程数据
    	element = $('#selector-init-dataSource-remote').omItemSelector({dataSource:"./data-source.json"});
    	element.omItemSelector({dataSource:"./data-source-2.json"});
    	stop();
    	setTimeout(function(){
    		start();
    		itemSize = element.find('.om-itemselector-items').eq(0).find('dt').size();
    		equal(itemSize,3,"重新设置dataSource属性（远程数据）后渲染的item数量不正确");
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(0).text();
    		equal(itemText,"中国","重新设置dataSource属性（远程数据）后渲染的第一个item显示文字不正确");
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    		equal(itemText,"朝鲜","重新设置dataSource属性（远程数据）后渲染的第二个item显示文字不正确");
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(2).text();
    		equal(itemText,"俄罗斯","重新设置dataSource属性（远程数据）后渲染的第三个item显示文字不正确");
    		element.remove();
    	},100);
    });
    test( "value", function() {
    	expect(5);
    	var element,itemSize,itemText;
    	element = $('#selector-init-value').omItemSelector({dataSource:[{"text":"北京","value":"1"},{"text":"上海","value":"2"},{"text":"广州","value":"3"}],value:["3","2"]});
    	element.omItemSelector({value:["1","2"]});
    	itemSize = element.find('.om-itemselector-items').eq(0).find('dt').size();
    	equal(itemSize,1,"重新设置value属性后渲染的可选item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(0).text();
    	equal(itemText,"广州","重新设置value属性后渲染的第一个item显示文字不正确");
    	
    	itemSize = element.find('.om-itemselector-items').eq(1).find('dt').size();
    	equal(itemSize,2,"重新设置value属性后渲染的已选item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(1).find('dt').eq(0).text();
    	equal(itemText,"北京","重新设置value属性后已选的第一个item显示文字不正确");
    	itemText = element.find('.om-itemselector-items').eq(1).find('dt').eq(1).text();
    	equal(itemText,"上海","重新设置value属性后已选的第二个item显示文字不正确");
    	element.remove();
    });
    
    test( "preProcess", function() {
    	expect(1);
    	var element,itemText;
    	element = $('#selector-init-preProcess').omItemSelector({dataSource:"./data-source.json",preProcess:function(data){
    		data[1].text = "修改后的值";
    		return data;
    	}});
    	element.omItemSelector({preProcess:function(data){
    		data[1].text = "新修改后的值";
    		return data;
    	}});
    	stop();
    	setTimeout(function(){
    		start();
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    		equal(itemText,"新修改后的值","重新设置preProcess属性修改数据不起效");
    		element.remove();
    	},100);
    });
    
    test( "clientFormatter", function() {
    	expect(1);
    	var element,itemText;
    	element = $('#selector-init-clientFormatter').omItemSelector({dataSource:"./data-source.json",clientFormatter:function(itemData,index){
    		return itemData.text+'('+itemData.value+')';
    	}});
    	element.omItemSelector({clientFormatter:function(itemData,index){
    		return "new" + itemData.text+'('+itemData.value+')';
    	}});
    	stop();
    	setTimeout(function(){
    		start();
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    		equal(itemText,"new上海(2)","重新设置clientFormatter属性修改数据不起效");
    		element.remove();
    	},100);
    });
    
    
}(jQuery));