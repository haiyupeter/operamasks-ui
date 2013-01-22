(function( $ ) {
    module( "omCalendar: tools");
    test( "$.omCalendar.formatDate", function() {
        var d=new Date(2011,3,5);
        equal($.omCalendar.formatDate(d, 'yy-mm-dd'),'2011-04-05');
        equal($.omCalendar.formatDate(d, 'yy/mm/dd'),'2011/04/05');
        equal($.omCalendar.formatDate(d, 'yy#mm#dd'),'2011#04#05');
        equal($.omCalendar.formatDate(d, 'yymmdd'),'20110405');
        equal($.omCalendar.formatDate(d, 'y-mm-dd'),'11-04-05');
        equal($.omCalendar.formatDate(d, 'yy-m-dd'),'2011-4-05');
        equal($.omCalendar.formatDate(d, 'yy-mm-d'),'2011-04-5');
        equal($.omCalendar.formatDate(d, 'dd-mm-yy'),'05-04-2011');
        equal($.omCalendar.formatDate(d, 'mmdy'),'04511');
        equal($.omCalendar.formatDate(d, 'yy y mm m dd d DD D MM M'),'2011 11 04 4 05 5 Tuesday Tue April Apr');
    });
    
    test( "$.omCalendar.parseDate", function() {
        var d=new Date(2011,3,5)+'';
        equal($.omCalendar.parseDate('2011-04-05 00:00:00','yy-mm-dd H:i:s')+'',d);
        equal($.omCalendar.parseDate('2011/04/05 00:00:00', 'yy/mm/dd H:i:s')+'',d);
        equal($.omCalendar.parseDate('2011#04#05 00:00:00', 'yy#mm#dd H:i:s')+'',d);
        equal($.omCalendar.parseDate('20110405 00:00:00', 'yymmdd H:i:s')+'',d);
        equal($.omCalendar.parseDate('11-04-05 00:00:00', 'y-mm-dd H:i:s')+'',d);
        equal($.omCalendar.parseDate('2011-4-05 00:00:00', 'yy-m-dd H:i:s')+'',d);
        equal($.omCalendar.parseDate('2011-04-5 00:00:00', 'yy-mm-d H:i:s')+'',d);
        equal($.omCalendar.parseDate('05-04-2011 00:00:00', 'dd-mm-yy H:i:s')+'',d);
        equal($.omCalendar.parseDate('04511 00:00:00', 'mmdy H:i:s')+'',d);
        equal($.omCalendar.parseDate('2011 11 04 4 05 5 Tuesday Tue April Apr 00:00:00', 'yy y mm m dd d DD D MM M H:i:s')+'',d);
    });
}(jQuery));