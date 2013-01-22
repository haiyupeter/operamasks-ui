(function($){
    module( "omTooltip: methods");
    test( "{ show }", function() {
        expect( 1 );
        $('#show').omTooltip({
            contentEL : '#aaa'
        });
        $('#show').omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        equal(target.length > 0 , true , '调用omTooltip的show方法，显示提示');
        $('#show').omTooltip('hide');
    });
    
    test( "{ hide }", function() {
        expect( 2 );
        $('#hide').omTooltip({
            contentEL : '#aaa'
        });
        $('#hide').omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        equal(target.length > 0 , true , '调用omTooltip的show方法，显示提示');
        $('#hide').omTooltip('hide');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        equal(target.length <= 0 , true , '调用omTooltip的hide方法，隐藏提示');
    });
}(jQuery));