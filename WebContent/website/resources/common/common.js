$(document).ready(function(){
    //top menu on hover
    var allItems = $('#__hdmenu span');
    allItems.click(function(){
        var link = $(this).parent().attr('link');
        if(link.indexOf('http://') == 0){
        	window.open(link);
        } else{
        	window.location.href = link;
        }
    });
});
