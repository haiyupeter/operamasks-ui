(function($){
	module( "omMessagebox: alert");
	test("{type: alert}",function(){
		expect(3);
		$('#alertTypeAlert').click(function(){
    	     $.omMessageBox.alert({type:'alert',content:'提示内容'});
    	 });
		$('#alertTypeAlert').click();
		var messagebox = $('.om-messageBox');
		var overlay = $(".om-widget-overlay");
		ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
	    var isAlert = messagebox.find('div.om-messageBox-image').hasClass('om-messageBox-image-alert');
		ok(isAlert, "加载alert图片");
		messagebox.find("a.om-messageBox-titlebar-close").click();
		ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{type: success}",function(){
		expect(3);
		$('#alertTypeSuccess').click(function(){
    	     $.omMessageBox.alert({type:'success',content:'提示内容'});
    	 });
		$('#alertTypeSuccess').click();
		var messagebox = $('.om-messageBox');
		var overlay = $(".om-widget-overlay");
		ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
	    var isAlert = messagebox.find('div.om-messageBox-image').hasClass('om-messageBox-image-success');
		ok(isAlert, "加载success图片");
		messagebox.find("a.om-messageBox-titlebar-close").click();
		ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{type: error}",function(){
		expect(3);
		$('#alertTypeError').click(function(){
    	     $.omMessageBox.alert({type:'error',content:'提示内容'});
    	 });
		$('#alertTypeError').click();
		var messagebox = $('.om-messageBox');
		var overlay = $(".om-widget-overlay");
		ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
	    var isAlert = messagebox.find('div.om-messageBox-image').hasClass('om-messageBox-image-error');
		ok(isAlert, "加载error图片");
		messagebox.find("a.om-messageBox-titlebar-close").click();
		ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{type: question}",function(){
		expect(3);
		$('#alertTypeQuestion').click(function(){
    	     $.omMessageBox.alert({type:'question',content:'提示内容'});
    	 });
		$('#alertTypeQuestion').click();
		var messagebox = $('.om-messageBox');
		var overlay = $(".om-widget-overlay");
		ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
	    var isAlert = messagebox.find('div.om-messageBox-image').hasClass('om-messageBox-image-question');
		ok(isAlert, "加载question图片");
		messagebox.find("a.om-messageBox-titlebar-close").click();
		ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{type: warning}",function(){
		expect(3);
		$('#alertTypeWarning').click(function(){
    	     $.omMessageBox.alert({type:'warning',content:'提示内容'});
    	 });
		$('#alertTypeWarning').click();
		var messagebox = $('.om-messageBox');
		var overlay = $(".om-widget-overlay");
		ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
	    var isAlert = messagebox.find('div.om-messageBox-image').hasClass('om-messageBox-image-warning');
		ok(isAlert, "加载warning图片");
		messagebox.find("a.om-messageBox-titlebar-close").click();
		ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{title is advanced}",function(){
		expect(3);
		 $('#alertTitleAdvanced').click(function(){
   	        $.omMessageBox.alert({title:'<font color="red">红色</font>',content:'提示内容'});
   	     });
		 $('#alertTitleAdvanced').click();
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
		$('#alertContentAdvanced').click(function(){
   	     $.omMessageBox.alert({content:'<h1><font color="red">高级</font>定义内容</h1>'});
   	    });
		 $('#alertContentAdvanced').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 var content = messagebox.find('td.om-message-content-html').html();
		 //fix http://jira.apusic.net/browse/AOM-402
		 var result= (content=='<h1><font color="red">高级</font>定义内容</h1>' || content=='<H1><FONT color=red>高级</FONT>定义内容</H1>');
		 ok(result, "content属性");
		 messagebox.find("a.om-messageBox-titlebar-close").click();
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	test("{onclose}",function(){
		expect(3);
		$('#alertOnCloseDefined').click(function(){
   	      $.omMessageBox.alert({content:'提示内容',
   	    	  onClose:function(){
   	    	  $('#alertOnCloseDefined').html("newname");
   	    	  }
   	      });
   	     });
		 $('#alertOnCloseDefined').click();
		 var messagebox = $('.om-messageBox');
		 var overlay = $(".om-widget-overlay");
		 ok(messagebox.length > 0 && overlay.length > 0, "显示messagebox");
		 messagebox.find("button").click();
		 equal($("#alertOnCloseDefined").html(), "newname", "执行onclose");
		 ok($(".om-widget-overlay").length < 1 && $('.om-messageBox').length < 1, "关闭messagebox");
	});
	
})(jQuery);