(function($){
	module( "omMessagebox: prompt");

	test("{title is advanced}",function(){
		expect(3);
		$('#promptTitleAdvanced').click(function(){
            $.omMessageBox.prompt({title:'<font color="red">红色</font>',content:'输入任意内容'});
        });
		 $('#promptTitleAdvanced').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示 messagebox");
		 var title = messagebox.find('span.om-messageBox-title').html();
		 //fix http://jira.apusic.net/browse/AOM-402
		 var result= (title=='<font color="red">红色</font>' || title=='<FONT color=red>红色</FONT>');
         ok(result, "title属性");
		 messagebox.find("a.om-messageBox-titlebar-close").click();
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭 messagebox");
	});
	test("{content is advanced}",function(){
		expect(3);
		$('#promptContentAdvanced').click(function(){
            $.omMessageBox.prompt({content:'<h1><font color="red">高级</font>定义内容</h1>'});
        });
		 $('#promptContentAdvanced').click();
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
		$('#promptOnCloseDefined').click(function(){
            $.omMessageBox.prompt({content:'请输入AOM',onClose:function(value){
               if(value===false){
                   $("#result1").html("你取消了输入");
               }else{
                   if(value==="AOM")
                	   $("#result1").html("输入正确");
                   else{
                	   $("#result1").html("请输入AOM");
                       return false;
                   }
               }
            }});
		});
		 $('#promptOnCloseDefined').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 messagebox.find("#om-messageBox-prompt-input").val("AOM");
		 messagebox.find("button").first().click();
		 equal($("#result1").html(), "输入正确", "执行onclose");
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	
})(jQuery);