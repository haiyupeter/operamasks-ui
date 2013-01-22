(function($){
	module( "omMessagebox: waiting");

	test("{title is advanced}",function(){
		expect(3);
		$('#waitingTitleAdvanced').click(function(){
            $.omMessageBox.waiting({title:'<font color="red">红色</font>',content:'服务器正在处理你的请求...'});
        });
		 $('#waitingTitleAdvanced').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 var title = messagebox.find('span.om-messageBox-title').html();
		 //fix http://jira.apusic.net/browse/AOM-402
		 var result= (title=='<font color="red">红色</font>' || title=='<FONT color=red>红色</FONT>');
         ok(result, "title属性");
		 $.omMessageBox.waiting('close');
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "close messagebox");
	});
	test("{content is advanced}",function(){
		//expect(3);
		$('#waitingContentAdvanced').click(function(){
            $.omMessageBox.waiting({content:'<h1><font color="red">高级</font>定义内容</h1>'});
        });
		 $('#waitingContentAdvanced').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示 messagebox");
		 //fix http://jira.apusic.net/browse/AOM-402
		 var td=messagebox.find('td.om-message-content-html');
         var content = td.has('<h1><font color="red">高级</font>定义内容</h1>') || td.has('<H1><FONT color=red>高级</FONT>定义内容</H1>');
         ok(content, "content属性");
		 $.omMessageBox.waiting('close');
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭 messagebox");
	});
	test("{close}",function(){
		expect(2);
		$('#waitingCloseMethod').click(function(){
            $.omMessageBox.waiting({content:'服务器正在处理你的请求...'});
        });
		 $('#waitingCloseMethod').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 $.omMessageBox.waiting('close');
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭 messagebox");
	});
	
})(jQuery);