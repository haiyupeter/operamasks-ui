(function($){
    module( "omNumberfield: options");
    test( "{ allowDecimals: false }", function() {
        expect(1);
        $('#allowDecimals').omNumberField({allowDecimals:false});
       stop();
       setTimeout(function(){
            $("#allowDecimals").focus();
            $("#allowDecimals").val("123.456");
            $("#allowDecimals").blur();
            setTimeout(function(){
               var curVal= $("#allowDecimals").val();
               equal(123,curVal,"能够输入小数123.456，测试不通过");
               start();
            },500);
       },500);
    });
    test( "{ allowNegative: true }", function() {
        expect(1);
        $('#allowNegative').omNumberField({allowNegative:true});
        stop();
        setTimeout(function(){
            $("#allowNegative").focus();
            $("#allowNegative").val("-123");
            $("#allowNegative").blur();
            setTimeout(function(){
                var curVal= $("#allowNegative").val();
                equal(-123,curVal,"能够输负数");
                start();
            },500);
        },500);
    });
    test( "{ decimalPrecision: 4 }", function() {
        expect(1);
        $('#decimalPrecision').omNumberField({decimalPrecision:4});
        stop();
        setTimeout(function(){
            $("#decimalPrecision").focus();
            $("#decimalPrecision").val("123.3333");
            $("#decimalPrecision").blur();
            setTimeout(function(){
                var curVal= $("#decimalPrecision").val();
                equal(123.3333,curVal,"精确到小数点后4位");
                start();
            },500);
        },500);
    });
    test( "{ disabled: true }", function() {
        expect(1);
        $('#disabled').omNumberField({disabled:true});
        stop();
        setTimeout(function(){
            setTimeout(function(){
                var attrdis = $("#disabled").attr("disabled");
                equal("disabled",attrdis,"禁用组件之后无法输入");
                start();
            },500);
        },500);
    });
    test( "{ readOnly: true }", function() {
        expect(1);
        $('#readOnly').omNumberField({readOnly:true});
        stop();
        setTimeout(function(){
            setTimeout(function(){
                var attrred = $("#readOnly").attr("readOnly");
                equal("readonly", attrred, "组件只读");
                start();
            },500);
        },500);
    });
    
}(jQuery));