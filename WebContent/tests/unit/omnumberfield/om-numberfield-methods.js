(function($){
    module( "omNumberfield: methods");
    test( "{ disable方法 }", function() {
        expect(1);
        $('#disable').omNumberField();
        stop();
        setTimeout(function(){
            $("#disable").omNumberField("disable");
            setTimeout(function(){
                var attrred = $("#disable").attr("disabled");
                equal("disabled",attrred,"组件调用disable方法之后被设置为不可用");
                start();
            },500);
        },500);
    });
    test( "{ enable方法 }", function() {
        expect(1);
        $('#enable').omNumberField({
            disabled:true
        });
        stop();
        setTimeout(function(){
            $("#enable").omNumberField("enable");
            setTimeout(function(){
                var attrred = $("#enable").attr("disabled");
                equal(true,(attrred == undefined || "undefined" == attred || attrred == ""),"组件调用enable方法之后被设置为可用");
                start();
            },500);
        },500);
    });
    test( "{ onBlur方法 }", function() {
        expect(1);
        $('#onBlur').omNumberField({
            onBlur:fn
        });
        stop();
        var v;
        function fn(val){
            v = val;
        }
        setTimeout(function(){
            $("#onBlur").focus();
            $("#onBlur").val(1234);
            $("#onBlur").blur();
            setTimeout(function(){
                equal(1234,v,"组件调用blur方法之后将输入的值返回");
                start();
            },500);
        },500);
    });
}(jQuery));