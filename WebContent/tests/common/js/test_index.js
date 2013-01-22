$(document).ready(function() { 
    var apiNo = parseInt($('#testDescriptionTable span.apiNo').attr('number'));
    $('#testDescriptionTable span.apiNo').html(apiNo);
    var apiTestNo = 0 ; //API测试案例个数
    $('.api').each(function(i,obj){
        apiTestNo += $(obj).text().split('测试点').length-1;
     });
    
    var funcNo = 0;  // 功能测试案例个数
    $('.fun').each(function(i,obj){
        funcNo += $(obj).text().split('测试点').length-1;
     });
    
    var borderNo = 0;  //边界值测试案例个数
    $('.bor').each(function(i,obj){
        borderNo += $(obj).text().split('测试点').length-1;
     });
    
    var perc = parseInt((apiTestNo/apiNo)*100);
    $('#testDescriptionTable span.percentage').html(perc+'%');
    $('#testDescriptionTable span.funcNo').html(funcNo);
    $('#testDescriptionTable span.borderNo').html(borderNo);
});