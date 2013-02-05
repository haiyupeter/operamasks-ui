(function($){
    module( "omGrid: setOptions");
    
    function calWidth(grid , widths , msg){
    	var actual = [];
    	grid.parent().parent().find(".om-resizable")
    		.each(function(index , header){
    			actual.push($(header).width());
    		});
    	deepEqual(actual , widths , msg || "头部各列宽度比较正确");
    	
    	grid.find("tr").each(function(index , tr){
    		actual = [];
    		$(tr).find(">td >div").each(function(index , td){
    			actual.push($(td).width());
    		});
    		deepEqual(actual , widths , msg || "头部各列宽度比较正确");
    	});
    }
    
    test( "{ height }", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            height : 200,
            singleSelect : false,
            showIndex : true,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand'} ]
        });
        var height = element.parent().parent().height();
        equal(height + 2,200,"{height:200}");
        
        element = $('#options').omGrid({height:300});
        height = element.parent().parent().height();
        equal(height + 2,300,"{height:300}");
    });
    
    test( "{ autoFit }", function() {
    	expect();
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            width : 300,
            autoFit : true,
            colModel : [ {header : 'ID', name : 'id', width : 100}, 
                         {header : '地区', name : 'city', width : 200}, 
                         {header : '地址', name : 'address' , width : 300} ]
        });
        calWidth(element , [34 , 69 , 103] , "{autoFit:true},各列宽度设置[100,200,300],实际结果[34,69,103],比值一样");
        
        $('#options').omGrid({
        	autoFit : false
        });
        equal(element.parent().parent().outerWidth() , 300 , "{width:300}");
        calWidth(element , [100 , 200 , 300] , "{autoFit:false},各列宽度设置[100,200,300],实际结果[100,200,300]");
    });
    
    test( "{ width }", function() {
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            width : 350,
            colModel : [ {header : 'ID', name : 'id', width : 100}, 
                         {header : '地区', name : 'city', width : 120}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand'} ]
        });
        var width = $('#options').parent().parent().outerWidth();
        equal(width,350,"{width:350}");
        calWidth(element , [100 , 120 , 38] , "{width:350},各列宽度设置[100,120,autoExpand],实际结果[100,120,38]");
        
        element = $('#options').omGrid({
        	width : 400
        });
        calWidth(element , [100 , 120 , 88] , "{width:350},各列宽度设置[100,120,autoExpand],实际结果[100,120,88]");
    });
    
    test( "{ showIndex }", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            width : 350,
            limit : 20,
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var indexColNo = element.find('.indexCol').length;
            equal(indexColNo , 20 , "默认情况下渲染了行的数字索引");
            
            element = $('#options').omGrid({
            	showIndex : false
            });
        } , 500);
        
        setTimeout(function(){
        	var indexColNo = element.find('.indexCol').length;
            equal(indexColNo , 0 , "{showIndex:false} 没有渲染行的数字索引");
        	start();
        } , 1000);
    });
    
    test( "{ colModel }", function() {
        expect(3);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center'}, 
                         {header : '地区', name : 'city', width : 120, align : 'left'}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand'} ]
        });
        stop();
        setTimeout(function(){
            var col = $('#options').parent().parent().find(".om-resizable").length;
            equal(col , 3 , "colModel定义列模型，显示正确");
            
            element = $('#options').omGrid({
            	colModel : [ {header : 'NID', name : 'id', width : 100, align : 'center'}, 
                         {header : '新地区', name : 'city', width : 120, align : 'left'}, 
                         {header : '新地址', name : 'address', align : 'left', width : 'autoExpand'} ]
            });
        } , 500);
        
        setTimeout(function(){
        	var col = $('#options').parent().parent().find(".om-resizable").length;
            equal(col , 3 , "colModel定义列模型，显示正确");
            
            var headers = [];
            element.parent().parent().find(".om-resizable")
            	.each(function(index , th){
            		headers.push($(th).text());
            	});
            deepEqual(headers , ["NID" , "新地区" , "新地址"] , "重新初始化colModel");
            start();
        } , 1000);
    });
    
    test( "{ dataSource }", function() {
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center', sortable : true}, 
                         {header : '地区', name : 'city', width : 120, align : 'left', sortable : true}, 
                         {header : '地址', name : 'address', align : 'left', width : 'autoExpand', autoExpandMin : 150, sortable : true} ]
        });
        stop();
        setTimeout(function(){
            var col = element.children("tbody").children().length;
            equal(col , 15 , "dataSource远端取数成功");
            
            element = $('#options').omGrid({
            	dataSource : 'staticData.json'
            });
        } , 500);
        
        setTimeout(function(){
        	var col = element.children("tbody").children().length;
            equal(col , 1 , "重新初始化dataSource并取数成功");
            start();
        } , 1000);
    });
    
    test( "{ loadingMsg }", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            loadingMsg : '111',
            colModel : [ {header : 'ID', name : 'id'}, 
                         {header : '地区', name : 'city'}, 
                         {header : '地址', name : 'address'} ]
        });
        var loadingMsg = element.parent().next(".pDiv").children().children().find(".pPageStat").text();
        equal(loadingMsg , "111" , "{loadingMsg:'111'}");
        stop();
        setTimeout(function(){
        	element = $('#options').omGrid({
        		loadingMsg : '222'
        	});
    		var loadingMsg = element.parent().next(".pDiv").children().children().find(".pPageStat").text();
        	equal(loadingMsg , "222" , "{loadingMsg:'222'}");
        	start();
        } , 500);
    });
        
    test( "{ emptyMsg }", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=empty',
            emptyMsg: 'no record',
            colModel : [ {header : 'ID', name : 'id'}, 
                         {header : '地区', name : 'city'}, 
                         {header : '地址', name : 'address'} ]
        });
        stop();
        setTimeout(function(){
            var emptyMsg = element.parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal(emptyMsg,"no record","{emptyMsg : 'no record'}");
            
            element = $('#options').omGrid({
            	emptyMsg : 'nothing'
            });
        },500);
        
        setTimeout(function(){
        	var emptyMsg = element.parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal(emptyMsg,"nothing","{emptyMsg : 'nothing'}");
            start();
        } , 1000);
    });
    
    test( "{ errorMsg }", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do111?method=empty',
            errorMsg: 'wrong',
            colModel : [ {header : 'ID', name : 'id'}, 
                         {header : '地区', name : 'city'}, 
                         {header : '地址', name : 'address'} ]
        });
        stop();
        setTimeout(function(){
            var errorMsg = element.parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal(errorMsg,"wrong","{errorMsg : 'wrong'}");
            
            element = $('#options').omGrid({
            	errorMsg : 'error'
            });
        },500);
        
        setTimeout(function(){
        	var errorMsg = element.parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal(errorMsg , "error" , "{errorMsg : 'error'}");
            start();
        } , 1000);
    });
    
    test( "{extraData}" , function() {
    	var element = $('#options').omGrid({
    		dataSource : 'griddata.do?method=fast',
    		extraData : {name : "test"},
    		colModel : [ {header : 'ID', name : 'id'}, 
                         {header : '地区', name : 'city'}, 
                         {header : '地址', name : 'address'} ]
    	});
    	stop();
    	setTimeout(function(){
    		deepEqual(element.omGrid("options").extraData , {name : "test"} , "extraData设为{name : 'test''}");
    		element = $('#options').omGrid({
    			extraData : {extra : 'something else.'}
    		});
    		setTimeout(function(){
				deepEqual(element.omGrid("options").extraData , {extra : 'something else.'} , "重新初始化，extraData设为{extra:'something else.'}");
				start();    			
    		} , 1000);
    	} , 500);
    });
    
    test( "{ limit }", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            limit : 15,
            colModel : [ {header : 'ID', name : 'id'}, 
                         {header : '地区', name : 'city'}, 
                         {header : '地址', name : 'address'} ]
        });
        stop();
        setTimeout(function(){
            var col = element.children("tbody").children().length;
            equal(col , 15 , "默认情况下每页的条数为15");
            
            element = $('#options').omGrid({
            	limit: 20
            });
        } , 500);
        
        setTimeout(function(){
        	var col = element.children("tbody").children().length;
            equal(col , 20 , "{limit:20}");
            start();
        } , 1000);
    });
    
    test( "{ pageText }", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            pageText: 'now{index}page，total{totalPage}page',
            colModel : [ {header : 'ID', name : 'id'}, 
                         {header : '地区', name : 'city'}, 
                         {header : '地址', name : 'address'} ]
        });
        stop();
        setTimeout(function(){
            var pageText =  element.parent().next(".pDiv").children().children().find(".pControl").text();
            equal((pageText.indexOf("now") != -1 && pageText.indexOf("total") != -1 ) , true , "{pageText:'now{index}page，total{totalPage}page'}");
            
            element = $('#options').omGrid({
            	pageText: '当前{index}页，一共有{totalPage}页'
            });
        } , 500);
        
        setTimeout(function(){
        	var pageText =  element.parent().next(".pDiv").children().children().find(".pControl").text();
            equal((pageText.indexOf("当前") != -1 && pageText.indexOf("一共") != -1 ) , true , "{pageText:'当前{index}页，一共有{totalPage}页'}");
        	start();
        } , 1000);
    });
    
    test( "{ pageStat}", function() {
    	expect(2);
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            pageStat: 'total{total}data，show{from}-{to}',
            colModel : [ {header : 'ID', name : 'id'}, 
                         {header : '地区', name : 'city'}, 
                         {header : '地址', name : 'address'} ]
        });
        stop();
        setTimeout(function(){
            var pageText =  element.parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal((pageText.indexOf("total") != -1 && pageText.indexOf("show") != -1 ),true,"{pageStat:'total{total}data，show{from}-{to}'}");
            
            element = $('#options').omGrid({
            	pageStat: '一共{total}条记录，当前显示{from}到{to}'
            });
        } , 500);
        
        setTimeout(function(){
        	var pageText =  element.parent().next(".pDiv").children().children().find(".pPageStat").text();
            equal((pageText.indexOf("一共") != -1 && pageText.indexOf("当前显示") != -1 ),true,"{pageStat:'一共{total}条记录，当前显示{from}到{to}'}");
        	start();
        } , 1000);
    });
    
    test( "{ wrap }", function() {
    	expect(2);
    	function checkWrap($tr , wrap){
    		var h;
    		$tr.each(function(index , tr){
            	var height = $(tr).children().eq(2).children("div.wrap").height();
            	h = height>15? height : h;
            });
            equal(h>15 , wrap , "colModel中定义{warp:"+wrap+"}生效.");
    	}
    	
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            pageStat: 'total{total}data，show{from}-{to}',
            colModel : [ {header : 'ID', name : 'id', width : 100}, 
                         {header : '地区', name : 'city', width : 60, align : 'left', wrap:true}, 
                         {header : '地址', name : 'address'} ]
        });
        stop();
        setTimeout(function(){
            checkWrap(element.children().children() , true);
            
            element = $('#options').omGrid({
            	colModel : [ {header : 'ID', name : 'id', width : 100}, 
                         {header : '地区', name : 'city', width : 60, align : 'left', wrap:false}, 
                         {header : '地址', name : 'address'} ]
            });
        } , 500);
        
        setTimeout(function(){
        	checkWrap(element.children().children() , false);
        	start();
        } , 1000);
    });
    
    test( "{ rowClasses }", function() {
    	expect(2);
    	var classes = ['class1' , 'class2'];
        var element = $('#options').omGrid({
        	rowClasses : classes,
            dataSource : 'griddata.do?method=fast',
            colModel : [ {header : 'ID', name : 'id', width : 100}, 
                         {header : '地区', name : 'city', width : 60}, 
                         {header : '地址', name : 'address', align : 'left' , width: 100} ]
        });
        stop();
        setTimeout(function(){
            var $trs =  element.children().children(),
            	i = 0,
            	right = true;
            $trs.each(function(index , tr){
            	if(!$(tr).hasClass( classes[i++%2] )){
            		right = false;
            	}
            });
            ok(right , "{rowClasses:['class1','class2']}");
            
            element = $('#options').omGrid({
            	rowClasses : function(){
            		return "funny";
            	}
            });
        } , 500);
        
        setTimeout(function(){
        	var $trs =  element.children().children(),
        		right = true;
        		$trs.each(function(index , tr){
        			if(!$(tr).hasClass("funny")){
        				right = false;
        			}
        		});
        		ok(right , "{rowClasses:function(){return 'funny';}}");
        	start();
        } , 1000);
    });

    test( "{ singleSelect }", function() {
    	expect(2);
    	function expectCheckbox($trs , expect){
    		var hasCheckbox = true;
    		$trs.each(function(index , tr){
    			if($(tr).children(".checkboxCol").length == 0){
    				hasCheckbox = false;//只要一行数据没有checkbox,就认为没有checkbox
    			}
    		});
    		equal(hasCheckbox , expect , "{singleSelect:"+expect+"} "+hasCheckbox?"有checkbox可以多选":"没有checkbox只能单选");
    	}
        var element = $('#options').omGrid({
            dataSource : 'griddata.do?method=fast',
            singleSelect : false,
            colModel : [ {header : 'ID', name : 'id', width : 100}, 
                         {header : '地区', name : 'city', width : 60}, 
                         {header : '地址', name : 'address'} ]
        });
        stop();
        setTimeout(function(){
        	expectCheckbox(element.children().children() , true);

            element = $('#options').omGrid({
            	singleSelect : true
            });
        },500);
        
        setTimeout(function(){
        	expectCheckbox(element.children().children() , false);
        	start();
        } , 1000);
    });
  
}(jQuery));