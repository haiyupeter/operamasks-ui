(function($){
    module( "omGrid: options");
    test( "{ height: 200 }", function() {
        var element = $('#height').omGrid({
            dataSource : 'griddata.do?method=fast',
            height : 200,
            singleSelect : false,
            showIndex : true,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        var height = $('#height').parent().parent().outerHeight();
       equal(height,200,"grid的高度为200px");
    });
    test( "{ autoFit: true }", function() {
        var element = $('#autoFit').omGrid({
            dataSource : 'griddata.do?method=fast',
            width : 300,
            autoFit : true,
            colModel : [ {header : 'ID', name : 'id', width : 200, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 320, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 250, sortable : true} ]
        });
        //设置autoFit为true的时候会重新计算grid列宽，根据width宽度决定
        var width = $('#autoFit').parent().parent().outerWidth();
        equal(width,300,"grid宽度为300px");
    });
    
    test( "{ width: 350 }", function() {
        var element = $('#width').omGrid({
            dataSource : 'griddata.do?method=fast',
            width : 350,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        var width = $('#width').parent().parent().outerWidth();
       equal(width,350,"grid宽度为350px");
    });
    
    test( "{ showIndex: 350 }", function() {
        var element = $('#showIndex').omGrid({
            dataSource : 'griddata.do?method=fast',
            width : 350,
            limit : 20,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var indexColNo = $('#showIndex').find('.indexCol').length;
            equal(indexColNo,20,"显示行的数字索引");start();
        },500);
    });
    test( "{ colModel: true }", function() {
    	//只要参数有一个不对，那就是错的
    	var rightParam = true;
    	function renderer(v , rowData , index){
    		if(rightParam){
    			rightParam = typeof index === 'number';
    		}
    		if(rightParam){
    			rightParam = typeof rowData === 'object';
    		}
    		return v;
    	}
        expect(2);
        var element = $('#colModel').omGrid({
            dataSource : 'griddata.do?method=fast',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true , renderer:renderer}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var col = element.children("tbody").children().length;
            ok(col > 0,"colModel定义列模型，显示正确");
            ok(rightParam , "列模型的列自定义函数renderer接收参数是正确的");
            start();
        },500);
    });

    test( "{ dataSource: true }", function() {
        var element = $('#dataSource').omGrid({
            dataSource : 'griddata.do?method=fast',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var colLength = $('#dataSource').children("tbody").children().length;
            equal(colLength > 0,true,"数据dataSource定义正确");
            start();
        },500);
    });
    /*test( "{ method: POST }", function() { //此案例不测试
        expect(1);
        var method ;
        var element = $('#method').omGrid({
            dataSource : 'griddata.do?method=fast',
            method : 'POST',
            onSuccess : fn,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        function fn(grid,data,reponse){
            method = this.type;
            equal(method,"POST","method为post");
            start();
        }
    });
    */
    test( "{ loadingMsg: 11111111 }", function() {
        var element = $('#loadingMsg').omGrid({
            dataSource : 'griddata.do?method=block',
            loadingMsg : '11111111',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        var loadingMsg = $("#loadingMsg").parent().next(".pDiv").children().children().find(".pPageStat").text();
        equal(loadingMsg,"11111111","loadingMsg定义正确");
    });
    
    test( "{ emptyMsg: null data }", function() {
        var element = $('#emptyMsg').omGrid({
            dataSource : 'griddata.do?method=empty',
            emptyMsg: 'null data',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var emptyMsg = $("#emptyMsg").parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal(emptyMsg,"null data","emptyMsg定义正确");
            start();
        },500);
    });
    test( "{ errorMsg: NND CCL }", function() {
        var element = $('#errorMsg').omGrid({
            dataSource : 'griddata.do111?method=empty',
            errorMsg: 'NND CCL',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var emptyMsg = $("#errorMsg").parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal(emptyMsg,"NND CCL","errorMsg定义正确");
            start();
        },500);
    });
    test( "{extraData}" , function(){
    	var element = $('#extraData').omGrid({
    		dataSource : 'griddata.do?method=fast',
    		colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
    	});
    	stop();
    	setTimeout(function(){
    		deepEqual(element.omGrid("options").extraData , {} , "extraData默认为{}");
    		element = $('#extraData').omGrid({
    			extraData : {extra : 'something else.'}
    		});
    		setTimeout(function(){
				deepEqual(element.omGrid("options").extraData , {extra : 'something else.'} , "显示设置extraData为{extra:'something else.'}");
				start();    			
    		} , 1000);
    	} , 500);
    });
    test( "{ limit: 20 }", function() {
        var element = $('#limit').omGrid({
            dataSource : 'griddata.do?method=fast',
            limit : 20,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var colLength = $('#limit').children("tbody").children().length;
            equal(colLength,20,"每行限制为20条数据");
            start();
        },500);
    });
    test( "{ pageText: now{index}page，total{totalPage}page }", function() {
        var element = $('#pageText').omGrid({
            dataSource : 'griddata.do?method=fast',
            pageText: 'now{index}page，total{totalPage}page',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var pageText =  $("#pageText").parent().next(".pDiv").children().children().find(".pControl").text();
            equal((pageText.indexOf("now") != -1 && pageText.indexOf("total") != -1 ),true,"pageText自定义正确");
            start();
        },500);
    });
    test( "{ pageStat: total{total}data，show{from}-{to}}", function() {
        var element = $('#pageStat').omGrid({
            dataSource : 'griddata.do?method=fast',
            pageStat: 'total{total}data，show{from}-{to}',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var pageText =  $("#pageStat").parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal((pageText.indexOf("total") != -1 && pageText.indexOf("show") != -1 ),true,"pageStat定义正确");
            start();
        },500);
    });
    test( "{ wrap: 为true的时候列长度少于数据宽度会换行", function() {
        var element = $('#wrap').omGrid({
            dataSource : 'griddata.do?method=fast',
            pageStat: 'total{total}data，show{from}-{to}',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 60, align : 'left', sortable : true,wrap:true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var trs =  $("#wrap").children().children();
            var h ; 
            for(var i=0;i<trs.length ; i++){
                var height = $(trs[i]).children().eq(2).children("div.wrap").height();
                if(height > 15){
                    h = height;
                    break;
                }
            }
            equal(h>15,true,"wrap定义正确");
            start();
        },500);
    });
    test( "{ rowClasses: ['oddRow','evenRow']}", function() {
        var element = $('#rowClasses').omGrid({
            dataSource : 'griddata.do?method=fast',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 60, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var trs =  $("#grid").children().children();
            var isOddOrEvenClass = true;
            for(var i=0;i<trs.length ; i++){
                 var classname = $(trs[i]).attr("class");
                 if(classname == "oddRow" || classname =="evenRow"){
                     
                 }else{
                     isOddOrEvenClass = false;
                     break;
                 }
            }
            equal(isOddOrEvenClass,true,"行样式定义正确");
            start();
        },500);
    });
    test( "{ singleSelect: false}", function() {
        var element = $('#singleSelect').omGrid({
            dataSource : 'griddata.do?method=fast',
            singleSelect : false,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 60, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var trs =  $("#singleSelect").children().children();
            var hasCheckbox = true;
            for(var i=0;i<trs.length ; i++){
                 var checkbox = $(trs[i]).children(".checkboxCol");
                 if(checkbox.length <= 0){
                     hasCheckbox = false;
                     break;
                 }
                    
            }
            ok(hasCheckbox,"singleSelect为false，支持多选");
            start();
        },500);
    });
   
    
}(jQuery));