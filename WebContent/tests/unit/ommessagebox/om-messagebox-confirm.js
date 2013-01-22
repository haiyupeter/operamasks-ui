(function($){
	module( "omMessagebox: confirm");

	test("{title is advanced}",function(){
		expect(3);
		 $('#confirmTitleAdvanced').click(function(){
             $.omMessageBox.confirm({title:'<font color="red">红色</font>',content:'确认内容'});
         });
		 $('#confirmTitleAdvanced').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 var title = messagebox.find('span.om-messageBox-title').html();
		 //fix http://jira.apusic.net/browse/AOM-402
		 var result= (title=='<font color="red">红色</font>' || title=='<FONT color=red>红色</FONT>');
         ok(result, "title属性");
		 messagebox.find("a.om-messageBox-titlebar-close").click();
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{content is advanced}",function(){
		expect(3);
		$('#confirmContentAdvanced').click(function(){
            $.omMessageBox.confirm({content:'<h1><font color="red">高级</font>定义内容</h1>'});
        });
		 $('#confirmContentAdvanced').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 //fix http://jira.apusic.net/browse/AOM-402
		 var td=messagebox.find('td.om-message-content-html');
         var content = td.has('<h1><font color="red">高级</font>定义内容</h1>') || td.has('<H1><FONT color=red>高级</FONT>定义内容</H1>');
         ok(content, "content属性");
		 messagebox.find("a.om-messageBox-titlebar-close").click();
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{onclose}",function(){
		expect(3);
		$('#confirmOnCloseDefined').click(function(){
            $.omMessageBox.confirm({content:'确定删除吗？',onClose:function(value){
               if(value===false){
                   $("#result2").html("你不同意");
               }else{
            	   $("#result2").html("你同意了");
               }
            }});
        });
		 $('#confirmOnCloseDefined').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 messagebox.find("button").first().click();
		 equal($("#result2").html(), "你同意了", "执行onclose");
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	
})(jQuery);