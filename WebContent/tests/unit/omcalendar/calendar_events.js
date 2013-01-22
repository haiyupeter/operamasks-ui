(function( $ ) {
    module( "omCalendar: events");
    test( "onSelect", function() {
        var selDate;
        var element=$('.onSelect input').omCalendar({
            onSelect:function(date){
                selDate = $.omCalendar.formatDate(date,'yy-mm-dd');
            }
        });
        $('.om-state-nobd',$.data(element[0], "omCalendar").con).mousedown(); //选择那个默认日期
        equal(selDate,$.omCalendar.formatDate(new Date(),'yy-mm-dd'),'选择默认日期时应该会自动触发onSelect事件');
        
        $('div.om-dbd > a:contains("1"):eq(0)',$.data(element[0], "omCalendar").con).mousedown(); //点击下拉框里1号
        equal(selDate,$.omCalendar.formatDate(new Date(),'yy-mm-')+'01','选择非默认日期时应该会自动触发onSelect事件');
    });
}(jQuery));