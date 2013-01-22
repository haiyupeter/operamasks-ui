(function($){
    module( "omSuggestion: options");
    
    asyncTest( "{ cacheSize: 2 }", function() {
        expect(1);
        $('#cacheSize').omSuggestion({
        	crossDomain:true,
            cacheSize: 2,
           	dataSource : tmpDataSource + 'simpleSuggestion.json',
            onSuccess:fn
        });
       var count = 0;
       
        function fn(data, textStatus){
            count++;
        }
        setTimeout(function(){
            $("#cacheSize").val("a");
            $("#cacheSize").keyup();
            setTimeout(function(){
                $("#cacheSize").val("b");
                $("#cacheSize").keyup();
                
                setTimeout(function(){
                    $("#cacheSize").val("a");
                    $("#cacheSize").keyup();
                    setTimeout(function(){
                        $("#cacheSize").val("b");
                        $("#cacheSize").keyup();
                        $(document).mousedown(); //始终使得页面保持一个div显示
                        equal(count,2,"cacheSize设置为2，执行正确");
                        start();
                    },500);
                },500);
            },500);
        },500);
    });
   
    asyncTest( "{ clientFormatter: 使用<b>标签将下拉框文字加粗 }", function() {
        expect(1);
        $('#clientFormatter').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'advancedSuggestion.json',
            clientFormatter:function(data,index){
                return '<b>'+data.text+'</b>';
            }
        });
       
       setTimeout(function(){
            $("#clientFormatter").val("a");
            $("#clientFormatter").keyup();
            setTimeout(function(){
               var curDropList= $("div.om-droplist");
               setTimeout(function(){
                   var items = curDropList.length > 1 ?curDropList.eq(1).children():curDropList.children();
                   var item0 = items.length > 0 ?items.eq(0).html():"";
                   var item1 = items.length > 0 ?items.eq(1).html():"";
                   var item2 = items.length > 0 ?items.eq(2).html():"";
                   var pass;
                   var match=function(str){
                       return str.indexOf("<b>") != -1 || str.indexOf("<B>") != -1 ;
                   }
                   if(match(item0) && match(item1) && match(item2))
                       pass = true;
                   equal(pass,true,"clientFormatter个性化定制列样式执行正确");
                   start();
               },500);
            },500);
       },500);
    });
    
    test( "{ crossDomain: 跨域请求 }", function() {
        expect(1);
        $('#crossDomain').omSuggestion({
            dataSource : 'http://suggest.taobao.com/sug?code=utf-8&extras=1',
            queryName:'q',
            crossDomain:true,
            preProcess:function(text,data){
                //将淘宝返回的数据转换为omSuggestion所需要的数据
                data=data.result;
                var result={valueField:'text',data:[]};
                $(data).each(function(index){
                    result.data[index]={'text':this[0],'count':this[1]};
                });
                return result;
            },
            clientFormatter : function(data,index){
                return '<div class="itemFloatLeft">' + data.text
                     + '</div><div class="itemFloatRight">约' + data.count + '个宝贝</div>';
            }
        });

        stop();
        setTimeout(function(){
            $("#crossDomain").val("鞋子");
            $("#crossDomain").keyup();
            setTimeout(function(){
                var childrenLen = $('#crossDomain').data('omSuggestion').dropList.children().length;
                equal( childrenLen > 1,true ,"跨域案例执行正确");
                start();
            },2000); //此处设置1500，如果网络问题还可能导致失败
        },500);
    });
    
    test( "{ dataSource: 设置数据源 }", function() {
        expect(1);
        $('#dataSource').omSuggestion({
        	crossDomain:true,
            dataSource :tmpDataSource + 'simpleSuggestion.json'
        });

        stop();
        setTimeout(function(){
            $("#dataSource").val("a");
            $("#dataSource").keyup();
            setTimeout(function(){
                var childrenLen = $('#dataSource').data('omSuggestion').dropList.children().length;
                equal(childrenLen > 1,true , "dataSource设置数据源");
                $("#dataSource").val("");
                start();
            },1500);
        },500);
    });
   
    test( "{ delay: 1000 }", function() {
        expect(2);
        $('#delay').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            delay : 2000
        });
        $("#delay").val("a");
        $("#delay").keyup();
        stop();
        setTimeout(function(){
            var childrenLen0 = $('#delay').data('omSuggestion').dropList.children().length;
            equal(childrenLen0 <= 0,true , "延迟中，没有发送请求生成下拉框");
            $("#delay").val("ab");
            $("#delay").keyup();
            setTimeout(function(){
                var childrenLen1 = $('#delay').data('omSuggestion').dropList.children().length;
                equal( childrenLen1 > 1,true , "延迟5秒之后发送请求生成了下拉框");
                $("#delay").val("");
                start();
            },3000);
        },500);
    });
    
    test( "{ disabled: true }", function() {
        expect(1);
        $('#disabled').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            disabled : true
        });
        $("#disabled").val("a");
        $("#disabled").keyup();
        stop();
        setTimeout(function(){
            var childrenLen0 = $('#disabled').omSuggestion("getDropList").find(".om-suggestion-list-row").length;
            equal(childrenLen0 == 0,true , "disabled,不能生成下拉框");
            start();
        },500);
    });
    
    test( "{ listMaxHeight: 100 }", function() {
        expect(1);
        $('#listMaxHeight').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            listMaxHeight : 100
        });
        $("#listMaxHeight").val("a");
        $("#listMaxHeight").keyup();
        stop();
        setTimeout(function(){
            var height = $('#listMaxHeight').data('omSuggestion').dropList.height();
            equal(height == 100,true , "高度为100");
            start();
        },1000);
    });
    
    test( "{ listWidth: 100 }", function() {
        expect(1);
        $('#listWidth').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            listWidth : 100
        });
        $("#listWidth").val("a");
        $("#listWidth").keyup();
        stop();
        setTimeout(function(){
            var width = $('#listWidth').data('omSuggestion').dropList.outerWidth();
            equal(width == 100,true , "宽度为100");
            start();
        },1000);
    });
    
    
    test( "{ minChars: 4 }", function() {
        expect(1);
        $('#minChars').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json',
            minChars : 4
        });
        $("#minChars").val("abc");
        $("#minChars").keyup();
        stop();
        setTimeout(function(){
            var len = $('#minChars').data('omSuggestion').dropList.children().length;
            equal( len <= 0,true ,"当设置miniChars为4而输入的字符为abc时，不生成下拉框");
            start();
        },1000);
    });
    
}(jQuery));