(function( $ ) {
    module( "omButton: events");
    test( "onClick", function() {
        var hasClick=false;
        var disabledOptions={
            disabled:true,
            onClick:function(){
                hasClick=true;
                return false;
            }
        };
        var enabledOptions={
            onClick:function(){
                hasClick=true;
                return false;
            }
        };
        var element = $('.onClick a:eq(0)').omButton(enabledOptions);
        element.omButton('click');
        strictEqual(hasClick,true,'点击元素为a的按钮后应该能触发onClick事件');
        hasClick=false;
        element = $('.onClick a:eq(1)').omButton(disabledOptions);
        element.omButton('click');
        strictEqual(hasClick,false,'禁用元素为a的按钮后点击它不应该触发onClick事件');
        
        hasClick=false;
        element = $('.onClick input:eq(0)').omButton(enabledOptions);
        element.omButton('click');
        strictEqual(hasClick,true,'点击元素为input的按钮后应该能触发onClick事件');
        hasClick=false;
        element = $('.onClick input:eq(1)').omButton(disabledOptions);
        element.omButton('click');
        strictEqual(hasClick,false,'禁用元素为input的按钮后点击它不应该触发onClick事件');
        
        hasClick=false;
        element = $('.onClick button:eq(0)').omButton(enabledOptions);
        element.omButton('click');
        strictEqual(hasClick,true,'点击元素为button的按钮后应该能触发onClick事件');
        hasClick=false;
        element = $('.onClick button:eq(1)').omButton(disabledOptions);
        element.omButton('click');
        strictEqual(hasClick,false,'禁用元素为button的按钮后点击它不应该触发onClick事件');
    });
}(jQuery));