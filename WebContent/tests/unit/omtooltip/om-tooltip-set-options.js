(function($){
    module( "omTooltip: setOptions");
    
	test("{ width }" , function(){
    	expect(2);
    	$('#options').omTooltip({
            html : '<span style="color:red;">欢迎使用omTooltip组件！</span>'
        });
        $("#options").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width_index = target.attr('style').indexOf('width: auto');
        equal(width_index > -1,true,"width默认值为auto");
        
        $('#options').omTooltip({
            width : 150
        });
        equal(target.outerWidth() == 150,true,"width动态设置值为150");
        $("#options").omTooltip('hide');
    });
    
    test( "{ minWidth }", function() {
        expect(2);
        $('#options').omTooltip({
            minWidth : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width = target.outerWidth();
        equal(width == 50 , true , "minWidth设置值为50");
               
        $('#options').omTooltip({
            minWidth : 100
        });
        width = target.outerWidth();
        equal(width == 100 , true,"minWidth动态设置为100");
        $("#options").omTooltip('hide');
    });
    
    test( "{ maxWidth }", function() {
        expect(2);
        $('#options').omTooltip({
            maxWidth : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width = target.outerWidth();
        equal(width < 50,true,"maxWidth设置值为50,则文字很少的情况下宽度应该少于50");
        
        $('#options').omTooltip({
            maxWidth : 100,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        width = target.outerWidth();
        equal(width == 100,true,"maxWidth重新设置值为100,由于文字长度大于100,所以宽度应该为100");
        $("#options").omTooltip('hide');
    });
    
    test( "{ height }", function() {
        expect(2);
        $('#options').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var height_index = target.attr('style').indexOf('height: auto');
        equal(height_index > -1,true,"height默认值为auto");
        
        $('#options').omTooltip({
            height : 50,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        var height = target.outerHeight();
        equal(height == 50,true,"height重新初始化为50");
        $("#options").omTooltip('hide');
    });
    
    test( "{ maxHeight }", function() {
        expect(2);
        $('#options').omTooltip({
            maxHeight : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var maxHeight = target.outerHeight();
        equal(maxHeight < 50,true,"设置maxHeight为50，当内容比较少的时候，height高度少于50");
        
        $('#options').omTooltip({
            maxHeight : 50,
            maxWidth : 30,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        	maxHeight = target.outerHeight();
        equal(maxHeight == 50,true,"maxHeight重新初始化为50");
        $("#options").omTooltip('hide');
    });
    
    test( "{ minHeight }", function() {
        expect(2);
        $('#options').omTooltip({
            minHeight : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var minHeight = target.outerHeight();
        equal(minHeight == 50,true,"高度至少是50");
        
        $('#options').omTooltip({
            minHeight : 100,
            maxWidth : 30,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        minHeight = target.outerHeight();
        equal(minHeight > 100,true,"minHeight重新初始化为100");
        $("#options").omTooltip('hide');
    });
    
    test( "{ delay }", function() {
        expect(4);
        $('#options').omTooltip({
            delay : 1000,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").mouseover();
        var target = $('.tip').filter(function(){
	    	return $(this).css('display') == 'block';
	    });
        equal(target.length == 0,true,"没有出现提示框");
        stop();
        setTimeout(function(){
        	var target = $('.tip').filter(function(){
	    		return $(this).css('display') == 'block';
	    	});
            equal(target.length > 0,true,"延迟1000ms之后出现提示框");
            $("#options").mouseout();
        },1000);
        setTimeout(function(){
        	$('#options').omTooltip({
	            delay : 300
        	});
        	$("#options").mouseover();
			var target = $('.tip').filter(function(){
	    		return $(this).css('display') == 'block';
	    	});
        	equal(target.length == 0,true,"没有出现提示框");
        	setTimeout(function(){
        		var target = $('.tip').filter(function(){
	    			return $(this).css('display') == 'block';
	    		});
        		equal(target.length > 0,true,"延迟300ms之后出现提示框");
        		start();
        	} , 500);
        } , 2500);//必须等待上一个mouseout结束，这样至少也要2000ms
    });
    
    test( "{ anchor }", function() {
        expect(2);
        $('#options').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var anchor = target.find('.tip-anchor');
        equal(anchor.length == 0,true,"没有出现anchor");
        
        $('#options').omTooltip({
            anchor : true
        });
        var anchor = target.find('.tip-anchor');
        equal(anchor.length > 0,true,"出现anchor");
        $("#options").omTooltip('hide');
    });
    
    test( "{ showOn }", function() {
        expect(2);
        $('#options').omTooltip({
        	delay : 200,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").mouseover();
        stop();
        setTimeout(function(){
            var target = $('.tip').filter(function(){
                return $(this).css('display') == 'block';
            });
            equal(target.length > 0,true,"鼠标移动到区域显示提示");
            $("#options").mouseout();
        },300);
        
        setTimeout(function(){
        	$('#options').omTooltip({
            	showOn : 'click'
        	});
       	 	$("#options").click();
            setTimeout(function(){
            	var target = $('.tip').filter(function(){
                	return $(this).css('display') == 'block';
            	});
	            equal(target.length > 0,true,"鼠标点击区域出现提示");
	            $("#options").mouseout();
	            start();
            } , 300);
        },1000);
    });
    
    test( "{ url }", function() {
        expect(2);
        $('#options').omTooltip({
            url : 'content.html'
        });
        $("#options").omTooltip('show');
        stop();
        setTimeout(function(){
            var target = $('.tip').filter(function(){
                return $(this).css('display') == 'block';
            });
            var content = target.find('.tip-body').html();
            equal(content.indexOf('这里是通过异步加载进来的内容') > -1 , true,'通过异步加载content.html文件的内容作为提示内容');
            $("#options").omTooltip('hide');
            $('#options').omTooltip({
            	url : 'another.html'
        	});
            $("#options").omTooltip('show');
            setTimeout(function(){
            	content = target.find('.tip-body').html();
            	equal(content.indexOf('这是另外一个文件的内容') > -1 , true,'通过异步加载content.html文件的内容作为提示内容');
            	start();
            } , 1000);
        },1000);
    });
    
    test( "{ html }", function() {
        expect(2);
        $('#options').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#options").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var content = target.find('.tip-body').html();
        equal(content.indexOf('欢迎') > 0 , true,'通过html属性配置提示框内容');
        $('#options').omTooltip({
            html : '<span style="color:red;">再次欢迎</span>'
        });
        content = target.find('.tip-body').html();
        equal(content.indexOf('再次欢迎') > 0 , true,'再次初始化重新指定html的内容');
    });
    
    test( "{ contentEL }", function() {
        expect(2);
        $('#options').omTooltip({
            contentEL : '#aaa'
        });
        $("#options").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        equal(target.find('.tip-body').find('#aaa').html() == $('#aaa').html() , true,'通过contentEL属性配置提示框内容');
       
        $('#options').omTooltip({
            contentEL : '#contentEL'
        });
        equal(target.find('.tip-body').find("#contentEL").html() == $('#contentEL').html() , true,'重新初始化指定contentEL');
    });
}(jQuery));