(function($){
    module( "omItemselector: options");
    test( "width", function() {
        expect(1);
        var element,width;
        element = $('#selector-width').omItemSelector({width:500});
        width = element.width();
        equal(width,500,"宽度不正确");
        element.remove();
    });
    test( "height", function() {
    	expect(1);
    	var element,height;
    	element = $('#selector-width').omItemSelector({height:300});
    	height = element.height();
    	equal(height,300,"高度不正确");
    	element.remove();
    });
    test( "availableTitle", function() {
    	expect(1);
    	var element,title;
    	element = $('#selector-availableTitle').omItemSelector({availableTitle:"测试availableTitle"});
    	title = element.find('.header span.om-itemselector-title').eq(0).html();
    	equal(title,"测试availableTitle","设置availableTitle属性不正确");
    	element.remove();
    });
    test( "selectedTitle", function() {
    	expect(1);
    	var element,title;
    	element = $('#selector-selectedTitle').omItemSelector({selectedTitle:"测试selectedTitle"});
    	title = element.find('.header span.om-itemselector-title').eq(1).html();
    	equal(title,"测试selectedTitle","设置selectedTitle属性不正确");
    	element.remove();
    });
    test( "dataSource", function() {
    	expect(8);
    	var element,itemSize,itemText;
    	// 本地数据
    	element = $('#selector-dataSource-local').omItemSelector({dataSource:[{"text":"北京","value":"1"},{"text":"上海","value":"2"},{"text":"广州","value":"3"}]});
    	itemSize = element.find('.om-itemselector-items').eq(0).find('dt').size();
    	equal(itemSize,3,"设置dataSource属性后渲染的item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(0).text();
    	equal(itemText,"北京","设置dataSource属性后渲染的第一个item显示文字不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    	equal(itemText,"上海","设置dataSource属性后渲染的第二个item显示文字不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(2).text();
    	equal(itemText,"广州","设置dataSource属性后渲染的第三个item显示文字不正确");
    	
    	// 远程数据
    	element = $('#selector-dataSource-remote').omItemSelector({dataSource:"./data-source.json"});
    	stop();
    	setTimeout(function(){
    		start();
    		itemSize = element.find('.om-itemselector-items').eq(0).find('dt').size();
    		equal(itemSize,3,"设置dataSource属性（远程数据）后渲染的item数量不正确");
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(0).text();
    		equal(itemText,"北京","设置dataSource属性（远程数据）后渲染的第一个item显示文字不正确");
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    		equal(itemText,"上海","设置dataSource属性（远程数据）后渲染的第二个item显示文字不正确");
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(2).text();
    		equal(itemText,"广州","设置dataSource属性（远程数据）后渲染的第三个item显示文字不正确");
    		element.remove();
    	},100);
    });
    test( "value", function() {
    	expect(5);
    	var element,itemSize,itemText;
    	element = $('#selector-value').omItemSelector({dataSource:[{"text":"北京","value":"1"},{"text":"上海","value":"2"},{"text":"广州","value":"3"}],value:["3","2"]});
    	itemSize = element.find('.om-itemselector-items').eq(0).find('dt').size();
    	equal(itemSize,1,"设置value属性后渲染的可选item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(0).text();
    	equal(itemText,"北京","设置value属性后渲染的第一个item显示文字不正确");
    	
    	itemSize = element.find('.om-itemselector-items').eq(1).find('dt').size();
    	equal(itemSize,2,"设置value属性后渲染的已选item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(1).find('dt').eq(0).text();
    	equal(itemText,"上海","设置value属性后已选的第一个item显示文字不正确");
    	itemText = element.find('.om-itemselector-items').eq(1).find('dt').eq(1).text();
    	equal(itemText,"广州","设置value属性后已选的第二个item显示文字不正确");
    	element.remove();
    });
    
    test( "preProcess", function() {
    	expect(1);
    	var element,itemText;
    	element = $('#selector-preProcess').omItemSelector({dataSource:"./data-source.json",preProcess:function(data){
    		data[1].text = "修改后的值";
    		return data;
    	}});
    	stop();
    	setTimeout(function(){
    		start();
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    		equal(itemText,"修改后的值","设置preProcess属性修改数据不起效");
    		element.remove();
    	},100);
    });
    
    test( "clientFormatter", function() {
    	expect(1);
    	var element,itemText;
    	element = $('#selector-clientFormatter').omItemSelector({dataSource:"./data-source.json",clientFormatter:function(itemData,index){
    		return itemData.text+'('+itemData.value+')';
    	}});
    	stop();
    	setTimeout(function(){
    		start();
    		itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(1).text();
    		equal(itemText,"上海(2)","设置clientFormatter属性修改数据不起效");
    		element.remove();
    	},100);
    });
    
    
}(jQuery));