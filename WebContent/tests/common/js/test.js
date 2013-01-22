$(document).ready(function() { 
    $('#tabs').omTabs();
    var apiNo = parseInt($('div.total span.apiNo').attr('number'));
    $('div.total span.apiNo').html(apiNo);
    var funcNo = parseInt($('#tabs-2', $('#tabs')).children('div.testPoint').length);  // 功能测试案例个数
    var apiTestNo = parseInt($('#tabs-1', $('#tabs')).children('div.testPoint').length); //API测试案例个数
    var borderNo = parseInt($('#tabs-3', $('#tabs')).children('div.testPoint').length);  //边界值测试案例个数
    
    var perc = parseInt((apiTestNo/apiNo)*100);
    $('div.total span.percentage').html(perc+'%');
    $('div.total span.funcNo').html(funcNo);
    $('div.total span.borderNo').html(borderNo);
});
