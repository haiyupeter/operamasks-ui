(function( $ ) {

module( "omCombo: methods");

//1必须将disable测试放到前面，因为测试enable时，一旦focus，display变成block，即使移出焦点（blur）后再disable，display也不会变成none，仍然为block
test( "{ enable and disable }", function() {
	expect( 2 );
	var element = $( '#disable_enable' ).omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'} ]
	});
	element.omCombo('disable');
	element.next("input").focus();
	var a1 = $('#disable_enable').data('omCombo').dropList.css('display');
	equal(a1,'none');
	
	element.omCombo('enable');
	element.next("input").focus();
	var a3 = $('#disable_enable').data('omCombo').dropList.css('display');
	equal(a3,'block');
});

//2
test("{getData and setData}",function(){
	expect( 4 );
	var element = $( '#getData_setData' ).omCombo({
		dataSource : [{text:'中国',value:'China/PRC'}, 
                       {text:'美国',value:'America/USA'}]
	});
	var data = element.omCombo('getData');
//	var jsondata = JSON.parse("[{text:'中国',value:'China/PRC'},{text:'美国',value:'America/USA'}]");
//	equal(data,jsondata);
	equal(data[0].text, "中国");
	equal(data[1].text,"美国");
	element.omCombo('setData',[{text:'China',value:'China/PRC'},{text:'American',value:'America/USA'}]);
	var newdata = element.omCombo('getData');
//	equal(JSON.stringify(newdata),"[{\\text:'China',value:'China/PRC'},{text:'American',value:'America/USA'}]");
	equal(newdata[0].text,"China");
	equal(newdata[1].text,"American");
});
}(jQuery));