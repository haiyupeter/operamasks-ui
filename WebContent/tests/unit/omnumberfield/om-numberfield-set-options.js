(function($){
    module( "omNumberfield: set-options");
    test( "{ allowDecimals: false }", function() {
        expect(1);
        $('#allowDecimals_set').omNumberField();
        $('#allowDecimals_set').omNumberField({allowDecimals:false});
       stop();
       setTimeout(function(){
            $("#allowDecimals_set").focus();
            $("#allowDecimals_set").val("123.456");
            $("#allowDecimals_set").blur();
            setTimeout(function(){
               var curVal= $("#allowDecimals_set").val();
               equal(123,curVal,"能够输入小数123.456，测试不通过");
               start();
            },500);
       },500);
    });
    test( "{ allowNegative: true }", function() {
        expect(1);
        $('#allowNegative_set').omNumberField();
        $('#allowNegative_set').omNumberField({allowNegative:true});
        stop();
        setTimeout(function(){
            $("#allowNegative_set").focus();
            $("#allowNegative_set").val("-123");
            $("#allowNegative_set").blur();
            setTimeout(function(){
                var curVal= $("#allowNegative_set").val();
                equal(-123,curVal,"能够输负数");
                start();
            },500);
        },500);
    });
    test( "{ decimalPrecision: 4 }", function() {
        expect(1);
        $('#decimalPrecision_set').omNumberField();
        $('#decimalPrecision_set').omNumberField({decimalPrecision:4});
        stop();
        setTimeout(function(){
            $("#decimalPrecision_set").focus();
            $("#decimalPrecision_set").val("123.3333");
            $("#decimalPrecision_set").blur();
            setTimeout(function(){
                var curVal= $("#decimalPrecision_set").val();
                equal(123.3333,curVal,"精确到小数点后4位");
                start();
            },500);
        },500);
    });
    test( "{ disabled: true }", function() {
        expect(1);
        $('#disabled_set').omNumberField();
        $('#disabled_set').omNumberField({disabled:true});
        stop();
        setTimeout(function(){
            setTimeout(function(){
                var attrdis = $("#disabled_set").attr("disabled");
                equal("disabled",attrdis,"禁用组件之后无法输入");
                start();
            },500);
        },500);
    });
    test( "{ readOnly: true }", function() {
        expect(1);
        $('#readOnly_set').omNumberField();
        $('#readOnly_set').omNumberField({readOnly:true});
        stop();
        setTimeout(function(){
            setTimeout(function(){
                var attrred = $("#readOnly_set").attr("readOnly");
                equal("readonly", attrred, "组件只读");
                start();
            },500);
        },500);
    });
    
}(jQuery));