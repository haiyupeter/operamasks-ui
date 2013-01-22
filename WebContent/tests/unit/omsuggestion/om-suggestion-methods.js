(function($){
    module( "omSuggestion: methods");   
    
    asyncTest( "{ disable方法 }", function() {
        expect(1);
        $('#disable').omSuggestion({
            dataSource : tmpDataSource + 'simpleSuggestion.json'
        });
        setTimeout(function(){
            $("#disable").omSuggestion("disable");
            $("#disable").val("abc");
            $("#disable").keyup();
            var len = $('#disable').data('omSuggestion').dropList.children().length;
            equal(len <= 0,true , "使用disable方法禁用组件之后下拉框不出现");
            start();
        },1000);
    });
   
    asyncTest( "{ enable方法 }", function() {
        expect(1);
        $('#enable').omSuggestion({
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            disabled : true,
            crossDomain:true
        });
       setTimeout(function(){
            $("#enable").omSuggestion("enable");
            $("#enable").val("abc");
            $("#enable").keyup();
            setTimeout(function(){
                var len = $('#enable').data('omSuggestion').dropList.children().length;
                equal(len > 1,true , "使用enable方法将禁用的组件重新启用");
                start();
            },1000);
           
        },1000);
    });
    
    asyncTest( "{ getData方法 }", function() {
        expect(2);
        $('#getData').omSuggestion({
        	crossDomain:true
        });
        var data = $("#getData").omSuggestion("getData");
        equal(data ==null,true,"没有数据源信息");        
        $('#getData').omSuggestion("setData",tmpDataSource + 'simpleSuggestion.json');
       	$('#getData').focus().val("abc");
        $('#getData').keyup();
        setTimeout(function(){
	        var data = $("#getData").omSuggestion("getData");	        
	        equal(data != null,true , "使用getData方法获取数据");
	        start();
        },1000);       
    });
    
    asyncTest( "{ setData方法 }", function() {
        expect(1);
        $('#setData').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource,
            onSuccess : function fn(data, textStatus){
        		equal(data.data[0].text.indexOf("china") != -1 ,true ,  "返回的下拉框数据里面包含china");
        		start();            
         	}
        });        
        $('#setData').omSuggestion("setData",tmpDataSource + "changeUrlSuggestionServlet.json?country=china");
        $('#setData').val("abc");
        $('#setData').keyup();        
    });
   
    asyncTest( "{ showMessage方法 }", function() {
        expect(1);
        $('#showMessage').omSuggestion({
        	crossDomain:true,
            dataSource :tmpDataSource + 'simpleSuggestion.json1',
            onError : fn
        });       
        setTimeout(function(){
            $('#showMessage').val("abc");
            $('#showMessage').keyup();
           
        },1000);
        function fn(xmlHttpRequest, textStatus, errorThrown){
            $('#showMessage').omSuggestion('showMessage','请求数据出错');
            setTimeout(function(){
                var message = $('#showMessage').data('omSuggestion').dropList.html();
                equal( message.indexOf("请求数据出错") != -1,true ,"showMessage方法显示错误信息");
                start();
            },6000);
        }
    });
    
    asyncTest( "{ getDropList方法 }", function() {
        expect(1);
        $('#getDropList').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json'
        });
        
        setTimeout(function(){
            $('#getDropList').val("abc");
            $('#getDropList').keyup();
            $('#getDropList').omSuggestion('getDropList').hide();
            equal($('#getDropList').data('omSuggestion').dropList.css('display'),'none','使用getDropList可以直接得到下拉框');
            start();
        },1000);
    });
    
    asyncTest( "{ onBeforeSuggest方法 }", function() {
        expect(1);
        $('#onBeforeSuggest').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource  + 'simpleSuggestion.json',
            onBeforeSuggest :function(text){
                if("日" == text){
                    return false;
                }else{
                    return true;
                }
            }
        });       
        setTimeout(function(){
            $('#onBeforeSuggest').val("日");
            $('#onBeforeSuggest').keyup();
            setTimeout(function(){
                var len = $('#onBeforeSuggest').data('omSuggestion').dropList.children().length;
                equal(len <= 0,true , "使用onBeforeSuggest拦截非法字符，不会生成下拉框");
                start();
            },1000);
        },1000);
        
    });    
    
    test( "{ onError方法 }", function() {
        expect(1);
        $('#onError').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json11',
            onError : fn
        });
        stop();
        setTimeout(function(){
            $('#onError').val("a");
            $('#onError').keyup();
        },6000);
        function fn(xmlHttpRequest, textStatus, errorThrown){ 
            ok(true , "使用onError捕获异常");//由于jsonp无错误触发机制，故此处使用超时机制模拟
            start();
        }
    });
    
    test( "{ onSelect方法 }", function() {
        expect(1);
        $('#onSelect').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            onSelect : fn
        });
        stop();
        setTimeout(function(){
            $('#onSelect').val("a");
            $('#onSelect').keyup();
            setTimeout(function(){
                var dropList_1 = $('#onSelect').data('omSuggestion').dropList.children().eq(1);
                $(dropList_1).mouseover().mousedown();
            },1000);
        },1000);
        function fn(text, rowData, index){
            equal(text != undefined ,true , "使用onSelect捕获选择事件");
            start();
        }
    });
    
    test( "{ onSuccess方法 }", function() {
        expect(1);
        $('#onSuccess').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            onSuccess : fn
        });
        stop();
        setTimeout(function(){
            $('#onSuccess').val("a");
            $('#onSuccess').keyup();
        },500);
        function fn(data, textStatus){
            equal(data.length > 0 ,true , "使用onSuccess捕获ajax成功返回事件");
            start();
        }
    });
}(jQuery));