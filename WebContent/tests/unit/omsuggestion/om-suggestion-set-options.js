(function($){
    module( "omSuggestion: set-options");
    
    asyncTest( "{ cacheSize: 2 }", function() {
        expect(1);
        $('#cacheSize_set').omSuggestion({
        	crossDomain:true,
           	dataSource : tmpDataSource + 'simpleSuggestion.json',
            onSuccess:fn
        });
        $('#cacheSize_set').omSuggestion({cacheSize: 2});
       var count = 0;
       
        function fn(data, textStatus){
            count++;
        }
        setTimeout(function(){
            $("#cacheSize_set").val("a");
            $("#cacheSize_set").keyup();
            setTimeout(function(){
                $("#cacheSize_set").val("b");
                $("#cacheSize_set").keyup();
                
                setTimeout(function(){
                    $("#cacheSize_set").val("a");
                    $("#cacheSize_set").keyup();
                    setTimeout(function(){
                        $("#cacheSize_set").val("b");
                        $("#cacheSize_set").keyup();
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
        $('#clientFormatter_set').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'advancedSuggestion.json'
        });
        $('#clientFormatter_set').omSuggestion({
            clientFormatter:function(data,index){
                return '<b>'+data.text+'</b>';
            }
        });
       setTimeout(function(){
            $("#clientFormatter_set").val("a");
            $("#clientFormatter_set").keyup();
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
        $('#crossDomain_set').omSuggestion({
            dataSource : 'http://suggest.taobao.com/sug?code=utf-8&extras=1',
            queryName:'q',
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
        $('#crossDomain_set').omSuggestion({crossDomain:true});
        stop();
        setTimeout(function(){
            $("#crossDomain_set").val("鞋子");
            $("#crossDomain_set").keyup();
            setTimeout(function(){
                var childrenLen = $('#crossDomain_set').data('omSuggestion').dropList.children().length;
                equal( childrenLen > 1,true ,"跨域案例执行正确");
                start();
            },2000); //此处设置1500，如果网络问题还可能导致失败
        },500);
    });
    
    test( "{ dataSource: 设置数据源 }", function() {
        expect(1);
        $('#dataSource_set').omSuggestion({
        	crossDomain:true
        });
        $('#dataSource_set').omSuggestion({dataSource :tmpDataSource + 'simpleSuggestion.json'});
        stop();
        setTimeout(function(){
            $("#dataSource_set").val("a");
            $("#dataSource_set").keyup();
            setTimeout(function(){
                var childrenLen = $('#dataSource_set').data('omSuggestion').dropList.children().length;
                equal(childrenLen > 1,true , "dataSource设置数据源");
                $("#dataSource_set").val("");
                start();
            },1500);
        },500);
    });
   
    test( "{ delay: 1000 }", function() {
        expect(2);
        $('#delay_set').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json'
        });
        $('#delay_set').omSuggestion({delay : 2000});
        $("#delay_set").val("a");
        $("#delay_set").keyup();
        stop();
        setTimeout(function(){
            var childrenLen0 = $('#delay_set').data('omSuggestion').dropList.children().length;
            equal(childrenLen0 <= 0,true , "延迟中，没有发送请求生成下拉框");
            $("#delay_set").val("ab");
            $("#delay_set").keyup();
            setTimeout(function(){
                var childrenLen1 = $('#delay_set').data('omSuggestion').dropList.children().length;
                equal( childrenLen1 > 1,true , "延迟5秒之后发送请求生成了下拉框");
                $("#delay_set").val("");
                start();
            },3000);
        },500);
    });
    
    test( "{ disabled: true }", function() {
        expect(1);
        $('#disabled_set').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json'
        });
        $('#disabled_set').omSuggestion({disabled : true});
        $("#disabled_set").val("a");
        $("#disabled_set").keyup();
        stop();
        setTimeout(function(){
            var childrenLen0 = $('#disabled_set').omSuggestion("getDropList").find(".om-suggestion-list-row").length;
            equal(childrenLen0 == 0,true , "disabled,不能生成下拉框");
            start();
        },500);
    });
    
    test( "{ listMaxHeight: 100 }", function() {
        expect(1);
        $('#listMaxHeight_set').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json'
        });
        $('#listMaxHeight_set').omSuggestion({listMaxHeight : 100});
        $("#listMaxHeight_set").val("a");
        $("#listMaxHeight_set").keyup();
        stop();
        setTimeout(function(){
            var height = $('#listMaxHeight_set').data('omSuggestion').dropList.height();
            equal(height == 100,true , "高度为100");
            start();
        },1000);
    });
    
    test( "{ listWidth: 100 }", function() {
        expect(1);
        $('#listWidth_set').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json'
        });
        $('#listWidth_set').omSuggestion({listWidth : 100});
        $("#listWidth_set").val("a");
        $("#listWidth_set").keyup();
        stop();
        setTimeout(function(){
            var width = $('#listWidth_set').data('omSuggestion').dropList.outerWidth();
            equal(width == 100,true , "宽度为100");
            start();
        },1000);
    });
    
    
    test( "{ minChars: 4 }", function() {
        expect(1);
        $('#minChars_set').omSuggestion({
        	crossDomain:true,
            dataSource : tmpDataSource + 'simpleSuggestion.json'
        });
        $('#minChars_set').omSuggestion({minChars : 4});
        $("#minChars_set").val("abc");
        $("#minChars_set").keyup();
        stop();
        setTimeout(function(){
            var len = $('#minChars_set').data('omSuggestion').dropList.children().length;
            equal( len <= 0,true ,"当设置miniChars为4而输入的字符为abc时，不生成下拉框");
            start();
        },1000);
    });
    
}(jQuery));