(function($){
	module( "omMessageTip: methods");
	//1
	test( "show", function() {
		expect( 2 );
		var element = $.omMessageTip.show({content:'提示内容'});
		var content = element.find('div.om-messageTip-content-body').html();
		equal(content,'提示内容','测试弹出框内容');
		equal(element.css('display'),'block','测试弹出框是否显示');
		element.remove();
	});
	//2
	test( "type", function() {
		expect( 7 );
		var element,size;
		element = $.omMessageTip.show({content:'提示内容'});
		size = element.find('div.om-messageTip-image-alert').size();
		equal(size,1,'测试默认类型的图片样式是否正确');
		element.remove();

		element = $.omMessageTip.show({content:'提示内容',type:'alert'});
		size = element.find('div.om-messageTip-image-alert').size();
		equal(size,1,'测试alert类型的图片样式是否正确');
		element.remove();
		
		element = $.omMessageTip.show({content:'提示内容',type:'question'});
		size = element.find('div.om-messageTip-image-question').size();
		equal(size,1,'测试question类型的图片样式是否正确');
		element.remove();
		
		element = $.omMessageTip.show({content:'提示内容',type:'warning'});
		size = element.find('div.om-messageTip-image-warning').size();
		equal(size,1,'测试warning类型的图片样式是否正确');
		element.remove();
		
		element = $.omMessageTip.show({content:'提示内容',type:'waiting'});
		size = element.find('div.om-messageTip-image-waiting').size();
		equal(size,1,'测试waiting类型的图片样式是否正确');
		element.remove();
		
		element = $.omMessageTip.show({content:'提示内容',type:'success'});
		size = element.find('div.om-messageTip-image-success').size();
		equal(size,1,'测试success类型的图片样式是否正确');
		element.remove();
		
		
		element = $.omMessageTip.show({content:'提示内容',type:'error'});
		size = element.find('div.om-messageTip-image-error').size();
		equal(size,1,'测试error类型的图片样式是否正确');
		element.remove();
	});
	//3
	test( "title", function() {
		expect( 3 );
		var element,title;
		element = $.omMessageTip.show({content:'提示内容'});
		title = element.find('span.om-messageTip-title').html();
		equal(title,'提醒','测试默认标题');
		element.remove();

		element = $.omMessageTip.show({content:'提示内容',title:'自定义标题'});
		title = element.find('span.om-messageTip-title').html();
		equal(title,'自定义标题','测试自定义标题');
		element.remove();
		
		element = $.omMessageTip.show({content:'提示内容',title:'<font color=\"red\">红色</font>自定义标题'});
		title = element.find('span.om-messageTip-title').html();
		//fix http://jira.apusic.net/browse/AOM-403
		var result= (title=='<font color="red">红色</font>自定义标题' || title=='<FONT color=red>红色</FONT>自定义标题');
        ok(result, "测试html内容的自定义标题");
		element.remove();
		
	});
	//4
	test( "content", function() {
		expect( 3 );
		var element,content;
		element = $.omMessageTip.show({});
		content = element.find('div.om-messageTip-content-body').html();
		equal(content,'&nbsp;','测试默认内容');
		element.remove();
		
		element = $.omMessageTip.show({content:'自定义内容'});
		content = element.find('div.om-messageTip-content-body').html();
		equal(content,'自定义内容','测试自定义内容');
		element.remove();
		
		element = $.omMessageTip.show({content:'<font size="24px" color="red">高级</font>自定义内容'});
		content = element.find('div.om-messageTip-content-body').html();
        //fix http://jira.apusic.net/browse/AOM-403
        // first and second is for FireFox、Chrome。third is for IE9、fourth is for IE6/IE7/IE8、last one is not used
        var result= (content=='<font size="24px" color="red">高级</font>自定义内容' || '<font color="red" size="24px">高级</font>自定义内容' || content=='<font color="red" size="24">高级</font>自定义内容' || content=='<FONT color=red size=24>高级</FONT>自定义内容' || content=='<FONT size=24 color=red>高级</FONT>自定义内容');
        ok(result, "测试html内容的自定义内容");
		element.remove();
		
	});
	//5
	test( "timeout", function() {
		expect( 1 );
		var element;
		element = $.omMessageTip.show({content:'自定义内容',timeout:3000});
		stop();
		setTimeout(function(){
			start();
			equal($('.om-messageTip').size(),0,'测试3秒内自动关闭');
			element.remove();
		},5000);
		
	});
	//6
	test( "onclose", function() {
		expect( 1 );
		var element;
		var fireOnclose = false; 
		element = $.omMessageTip.show({content:'自定义内容',onClose:function(){fireOnclose = true;}});
		element.find('a.om-messageTip-titlebar-close').click();
		ok(fireOnclose,'测试onclose事件是否执行');
		element.remove();
		
	});
})(jQuery);