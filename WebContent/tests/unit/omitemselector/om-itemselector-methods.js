(function($){
    module( "omItemselector: method");
    test( "method-value-get", function() {
    	expect(1);
    	var element,selectedLength;
    	element = $('#selector-method-value-get').omItemSelector({dataSource:[{"text":"北京","value":"1"},{"text":"上海","value":"2"},{"text":"广州","value":"3"}],value:["1","2"]});
    	selectedLength = element.omItemSelector("value").length;
    	equal(selectedLength,2,"调用value()获得的数量不正确");
    	element.remove();
    });
    test( "method-value-set", function() {
    	expect(5);
    	var element,itemSize,itemText;
    	element = $('#selector-method-value-set').omItemSelector({dataSource:[{"text":"北京","value":"1"},{"text":"上海","value":"2"},{"text":"广州","value":"3"}]});
    	element.omItemSelector("value",["2","3"]);
    	itemSize = element.find('.om-itemselector-items').eq(0).find('dt').size();
    	equal(itemSize,1,"调用value()方法后渲染的可选item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(0).find('dt').eq(0).text();
    	equal(itemText,"北京","调用value()方法后渲染的第一个item显示文字不正确");
    	
    	itemSize = element.find('.om-itemselector-items').eq(1).find('dt').size();
    	equal(itemSize,2,"调用value()方法后渲染的已选item数量不正确");
    	itemText = element.find('.om-itemselector-items').eq(1).find('dt').eq(0).text();
    	equal(itemText,"上海","调用value()方法后已选的第一个item显示文字不正确");
    	itemText = element.find('.om-itemselector-items').eq(1).find('dt').eq(1).text();
    	equal(itemText,"广州","调用value()方法后已选的第二个item显示文字不正确");
    	element.remove();
    });
}(jQuery));