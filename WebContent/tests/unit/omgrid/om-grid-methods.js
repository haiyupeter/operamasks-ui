(function($){
    module( "omGrid: methods");
    
    var colModel = [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ];
                         
    test( "{ getData }", function() {
    	expect(1);
        var element = $('#getData').omGrid({
            dataSource : 'staticData.json',
            height : 200,
            singleSelect : false,
            showIndex : true,
            colModel : colModel
        });
        var data = {
				"colmodel":[],
				"rows" : [
					{"address":"CZ88.NET","city":"泰国","end":"1.1.255.255","id":15,"start":"1.1.128.0"}
			 	],
				"total" : 1};
		stop();
		setTimeout(function(){
			deepEqual(element.omGrid("getData") , eval(data) , "getData方法获取正确数据");
			start();
		} , 500);
    });
    
    test( "{ getSelections }", function() {
    	expect(4);
        var element = $('#getSelections').omGrid({
            dataSource : 'griddata.do?method=fast',
            height : 200,
            singleSelect : false,
            showIndex : true,
            colModel : colModel
        });
		stop();
		setTimeout(function(){
			element.omGrid("setSelections",[1,2,3]);
			var selects = element.omGrid("getSelections");
			deepEqual(selects , [1,2,3] , "getSelections获取已选中数组索引");
			
			selects =  element.omGrid("getSelections" , true);
			var i=selects.length-1,
				v;
			while(v=selects[i--]){
				ok($.isPlainObject(v) , "getSelections获取已选中数组记录数据对象");
			}
			start();
		} , 500);
    });
    
    test( "{ reload }", function() {
    	expect(2);
        var element = $('#reload').omGrid({
            dataSource : 'griddata.do?method=fast',
            height : 200,
            singleSelect : false,
            showIndex : true,
            colModel : colModel
        });
        var data;
		stop();
		setTimeout(function(){
			element.omGrid("setSelections" , [1,2,3]).omGrid("reload");
		} , 500);
		setTimeout(function(){
			equal(element.omGrid("getSelections").length , 0 , "reload后数据并不选中");
			data = element.omGrid("getData");
			element.omGrid("reload" , 2);
		} , 1000);
		setTimeout(function(){
			notDeepEqual(element.omGrid("getData") , data , "reload(page)加载了指定页的数据");
			start();
		} , 1500);
    });
    
    test( "{ setData }", function() {
    	expect(1);
        var element = $('#setData').omGrid({
            dataSource : 'griddata.do?method=fast',
            height : 200,
            singleSelect : false,
            showIndex : true,
            colModel : colModel
        });
		stop();
		var data;
		setTimeout(function(){
			data = element.omGrid("getData");
			element.omGrid("setData" , "staticData.json");
		} , 500);
		setTimeout(function(){
			notDeepEqual(element.omGrid("getData") , data , "setData重新取数了");
			start();
		} , 1000);
    });
    
    test( "{ setSelections }", function() {
    	expect(1);
        var element = $('#setSelections').omGrid({
            dataSource : 'griddata.do?method=fast',
            height : 200,
            singleSelect : false,
            showIndex : true,
            colModel :colModel
        });
		stop();
		setTimeout(function(){
			element.omGrid("setSelections",[1,2,3]);
			var selects = element.omGrid("getSelections");
			deepEqual(selects , [1,2,3] , "setSelections动态选中多条记录");
			start();
		} , 500);
    });
}(jQuery));