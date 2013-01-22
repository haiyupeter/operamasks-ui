(function( $ ) {
    module( "omButton: setOptions");
	
	test("disabled" , function(){
		expect(6);
		var element;
		element = $("#setOptionsTest a").omButton({disabled:false});
		ok(!element.closest('.om-btn').hasClass('om-state-disabled'),'a[disabled=false] 处于非禁用状态');
		element = $("#setOptionsTest a").omButton({disabled:true});
		
        ok(element.closest('.om-btn').hasClass('om-state-disabled'),'a[disabled=true] 处于禁用状态');
        element = $('#setOptionsTest input').omButton({disabled:false});
        ok(!element.closest('.om-btn').hasClass('om-state-disabled'),'input[disabled=false] 处于非禁用状态');
        element = $('#setOptionsTest input').omButton({disabled:true});
        
        ok(element.closest('.om-btn').hasClass('om-state-disabled'),'input[disabled=true] 处于禁用状态');
        element = $('#setOptionsTest button').omButton({disabled:false});
        ok(!element.closest('.om-btn').hasClass('om-state-disabled'),'button[disabled=false] 处于非禁用状态');
        element = $('#setOptionsTest button').omButton({disabled:true});
        ok(element.closest('.om-btn').hasClass('om-state-disabled'),'button[disabled=true] 处于禁用状态');
	});
	
	test("icons" , function(){
		expect(6);
		function hasIcon(type , image){
			var img = element.next('img');
			return "left"===type ? element.css('background-image').indexOf(image) !== -1
								:  img.length>0 && img.attr('src')===image;
		}
		function noIcon(type){
			var backImg = element.css('background-image');
			return "left"===type ? !backImg || 'none'==backImg
								:  element.next('img').length == 0;
		}
		var element,
			icons = {left : 'resources/edit_add.png', right: 'resources/down.png'};
		element = $("#setOptionsTest a").omButton();
		ok(noIcon('left') && noIcon('right') , 'a [无icons]没有左右图标');
		element = $("#setOptionsTest a").omButton({icons:icons});
		ok(hasIcon('left',icons.left) && hasIcon('right',icons.right) , 'a[icons:{left:Xx , right:Xx}] 有左右图标');
		
		element = $("#setOptionsTest input").omButton();
		ok(noIcon('left') && noIcon('right') , 'input [无icons]没有左右图标');
		element = $("#setOptionsTest input").omButton({icons:icons});
		ok(hasIcon('left',icons.left) && hasIcon('right',icons.right) , 'input[icons:{left:Xx , right:Xx}] 有左右图标');
		
		element = $("#setOptionsTest button").omButton();
		ok(noIcon('left') && noIcon('right') , 'button [无icons]没有左右图标');
		element = $("#setOptionsTest button").omButton({icons:icons});
		ok(hasIcon('left',icons.left) && hasIcon('right',icons.right) , 'button[icons:{left:Xx , right:Xx}] 有左右图标');
	});
	
	test("label" , function(){
		expect(6);
		var element;
		element = $("#setOptionsTest a").omButton();
		equal(element.html() , 'X' , 'a[文本作为label]');
		element = $("#setOptionsTest a").omButton({label:'Y'});
		equal(element.html() , 'Y' , 'a[{label:"Y"}]');
		
		element = $("#setOptionsTest input").omButton();
		equal(element.val() , 'X' , 'input[value作为label]');
		element = $("#setOptionsTest input").omButton({label:'Y'});
		equal(element.val() , 'Y' , 'input[{label:"Y"}]');
		
		element = $("#setOptionsTest button").omButton();
		equal(element.html() , 'X' , 'button[文本作为label]');
		element = $("#setOptionsTest button").omButton({label:'Y'});
		equal(element.html() , 'Y' , 'button[{label:"Y"}]');
	});
	
	test( "width", function() {
		var width;
        width= $('#setOptionsTest a').omButton({width:100}).closest('.om-btn').width();
    	equal(width , 100 , 'a[width:100]');
    	width= $('#setOptionsTest a').omButton({width:120}).closest('.om-btn').width();
    	equal(width , 120 , 'a[width:120]');
    	
    	width= $('#setOptionsTest input').omButton({width:100}).closest('.om-btn').width();
    	equal(width , 100 , 'input[width:100]');
    	width= $('#setOptionsTest input').omButton({width:120}).closest('.om-btn').width();
    	equal(width , 120 , 'input[width:120]');
    	
    	width= $('#setOptionsTest button').omButton({width:100}).closest('.om-btn').width();
    	equal(width , 100 , 'button[width:100]');
    	width= $('#setOptionsTest button').omButton({width:120}).closest('.om-btn').width();
    	equal(width , 120 , 'button[width:120]');
    
    });
}(jQuery));