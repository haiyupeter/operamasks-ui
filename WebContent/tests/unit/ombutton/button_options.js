(function( $ ) {
    module( "omButton: options");
    //width
    test( "width", function() {
        var width1 = $('.width a').omButton({width:100}).closest('.om-btn').width();
    	equal(width1,100,'为元素为a的按钮设置宽度是100px');
        var width2 =  $('.width input').omButton({width:120}).closest('.om-btn').width();
        equal(width2,120,'为元素input的按钮设置宽度是120px');
        var width3 =  $('.width button').omButton({width:130}).closest('.om-btn').width();;
        equal(width3,130,'为元素button的按钮设置宽度是130px');
    });
    //label
    test( "label", function() {
        var element;
        element = $('.label a:eq(0)').omButton({});
        equal(element.html(),'X','元素为a的按钮如果没有在options中设置label属性时应该默认使用html中的label');
        element = $('.label a:eq(1)').omButton({label:'Y'});
        equal(element.html(),'Y','元素为a的按钮如果在options中设置label属性时应该优先使用options中设置的label');
        element = $('.label input:eq(0)').omButton({});
        equal(element.val(),'X','元素为input的按钮如果没有在options中设置label属性时应该默认使用html中的label');
        element = $('.label input:eq(1)').omButton({label:'Y'});
        equal(element.val(),'Y','元素为input的按钮如果没有在options中设置label属性时应该默认使用html中的label');
        element = $('.label button:eq(0)').omButton({});
        equal(element.html(),'X','元素为button的按钮如果没有在options中设置label属性时应该默认使用html中的label');
        element = $('.label button:eq(1)').omButton({label:'Y'});
        equal(element.html(),'Y','元素为button的按钮如果没有在options中设置label属性时应该默认使用html中的label');
    });
    //disabled
    test( "disabled", function() {
        var element;
        element = $('.disabled a:eq(0)').omButton({disabled:false});
        ok(!element.closest('.om-btn').hasClass('om-state-disabled'),'元素为a的按钮当设置disabled=false时不应该处于禁用状态');
        element = $('.disabled a:eq(1)').omButton({disabled:true});
        ok(element.closest('.om-btn').hasClass('om-state-disabled'),'元素为a的按钮当设置disabled=true时应该处于禁用状态');
        element = $('.disabled input:eq(0)').omButton({disabled:false});
        ok(!element.closest('.om-btn').hasClass('om-state-disabled'),'元素为input的按钮当设置disabled=false时不应该处于禁用状态');
        element = $('.disabled input:eq(1)').omButton({disabled:true});
        ok(element.closest('.om-btn').hasClass('om-state-disabled'),'元素为input的按钮当设置disabled=true时应该处于禁用状态');
        element = $('.disabled button:eq(0)').omButton({disabled:false});
        ok(!element.closest('.om-btn').hasClass('om-state-disabled'),'元素为button的按钮当设置disabled=false时不应该处于禁用状态');
        element = $('.disabled button:eq(1)').omButton({disabled:true});
        ok(element.closest('.om-btn').hasClass('om-state-disabled'),'元素为button的按钮当设置disabled=true时应该处于禁用状态');
    });
    //icons
    test( "icons", function() {
        var compareLeftIcon=function(expect,element){
        	var value=element.css('background-image');
        	if(value.indexOf('url("')==0){
        		var end = expect+'")'; 
         	}else{         		
         		var end = expect +')';         		
         	}        	            
        	return value.indexOf(end)+end.length==value.length;            
        };
        var compareRightIcon=function(expect,element){
            return element.siblings().eq(0).attr('src')===expect;
        };
        var icons={left : 'resources/edit_add.png', right: 'resources/down.png'};
        var element;
        element= $('.icons a').omButton({icons : icons});
        ok(compareLeftIcon(icons.left,element) && compareRightIcon(icons.right,element),'元素为a的按钮当设置icons后应该能正确显示出左右图标');
        element = $('.icons input').omButton({icons : icons});
        ok(compareLeftIcon(icons.left,element) && compareRightIcon(icons.right,element),'元素为input的按钮当设置icons后应该能正确显示出左右图标');
        element = $('.icons button').omButton({icons : icons});
        ok(compareLeftIcon(icons.left,element) && compareRightIcon(icons.right,element),'元素为button的按钮当设置icons后应该能正确显示出左右图标');
    });
}(jQuery));