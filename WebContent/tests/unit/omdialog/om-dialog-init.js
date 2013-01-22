/*
 * om-dialog-options.js
 */
(function($) {

module("omDialog: init");

test("autoOpen", function() {
	expect(1);

	el = $('<div></div>').omDialog({ autoOpen: false });
	el.omDialog({autoOpen:true});
		isOpen('.omDialog({ autoOpen: true })');
	el.remove();
});

test("buttons", function() {
	expect(8);

	var initButtons = [
   		{	text:'确定', 
   			click:function() {
   			}
   		},
   		{	text:'取消', 
   			click:function() {
   			}
   		}
   	];
	var newButtons = [
		{	text:'确定', 
			click:function() {
				ok(true, "确定按钮点击的回调");
				equals(this, el[0], "按钮回调方法的上下文");
			}
		},
		{	text:'取消', 
			click:function() {
				ok(true, "取消按钮点击的回调");
				equals(this, el[0], "按钮回调方法的上下文");
			}
		}
	];
	el = $('<div></div>').omDialog({ buttons: initButtons });
	el.omDialog({buttons:newButtons});
	var btn = $("button", dlg());
	equal(btn.length, 2, "自定义按钮的个数");

	var i = 0;
	$.each(newButtons, function(index , button) {
		equal(btn.eq(i).text(), button.text, "第"+(i+1)+"个按钮的文本内容");
		i++;
	});

	ok(btn.parent().hasClass('om-dialog-buttonset'), "按钮处于容器当中");
	btn.trigger("click");
	el.remove();
});

test("closeOnEscape", function() {
	el = $('<div></div>').omDialog({ closeOnEscape: false });
	el.omDialog({ closeOnEscape: true });
	ok(true, 'closeOnEscape: true');
	ok(el.is(':visible') && !el.is(':hidden'), '在按下键盘ESC之前对话框是打开的');
	el.simulate('keydown', { keyCode: $.om.keyCode.ESCAPE })
		.simulate('keypress', { keyCode: $.om.keyCode.ESCAPE })
		.simulate('keyup', { keyCode: $.om.keyCode.ESCAPE });
	ok(el.is(':hidden') && !el.is(':visible'), '在按下键盘ESC之后对话框是关闭的');
	
	el.remove();
});

test("dialogClass", function() {
	expect(2);

	el = $('<div></div>').omDialog();

	el.omDialog({ dialogClass: "colorful , another" });
		equal(dlg().is(".colorful"), true, '创建对话框时使用dialogClass属性，指定两个class， colorful class 已经被添加');
		equal(dlg().is(".another"), true, '创建对话框时使用dialogClass属性, 指定两个class，another class 已经被添加');
	el.remove();
});

test("draggable", function() {
	expect(1);

	el = $('<div></div>').omDialog({ draggable: false });

	el.omDialog({ draggable: true });
		shouldmove();
	el.remove();
});

test("height", function() {
	expect(1);

	el = $('<div></div>').omDialog();

	el.omDialog({ height: 250 });
		equal(dlg().height(), 250, "显示设置高度(height)");
	el.remove();
});

test("maxHeight", function() {
	expect(1);

	el = $('<div></div>').omDialog({ maxHeight: 200 });

	el.omDialog({ maxHeight: 200 });
		drag('.om-resizable-n', -1000, -1000);
		equal(heightAfter, 200, "maxHeight");
	el.remove();
});

test("maxWidth", function() {
	expect(1);

	el = $('<div></div>').omDialog({ maxWidth: 400 });

	el.omDialog({ maxWidth: 400 });
		drag('.om-resizable-w', -1000, -1000);
		equal(widthAfter, 400, "maxWidth");
	el.remove();
});

test("minHeight", function() {
	expect(1);

	el = $('<div></div>').omDialog({ minHeight: 15 });

	el.omDialog({ minHeight: 15 });
		drag('.om-resizable-n', 1000, 1000);
		equal(heightAfter, 15, "minHeight");
	el.remove();
});

test("minWidth", function() {
	expect(1);
	
	el = $('<div></div>').omDialog({ minWidth: 20 });

	el.omDialog({ minWidth: 20 });
		drag('.om-resizable-w', 1000, 1000);
		equal(widthAfter, 20, "minWidth");
	el.remove();
});
// 赞不支持动态修改modal
/*test("modal", function() {
	expect(1);
	el = $('<div></div>').omDialog({modal:false});

	el.omDialog({modal:true});
		isModal('显示设置为模态');
	el.remove();
});*/

test("resizable", function() {
	expect(1);

	el = $('<div></div>').omDialog();

	el.omDialog({ resizable: true });
		shouldresize("显示设置可变大小");
	el.remove();
});

test("title", function() {
	expect(2);

	function titleText() {
		return dlg().find(".om-dialog-title").html();
	}

	el = $('<div></div>').omDialog();
		// some browsers return a non-breaking space and some return "&nbsp;"
		// so we get the text to normalize to the actual non-breaking space

	el.omDialog({ title: '个人信息' });
		equal(titleText(), "个人信息", "初始化指定标题");
		equal(el.omDialog("option", "title"), "个人信息", "通过option获取初始化设置的标题");
	el.remove();
});


test("width", function() {
	expect(1);

	el = $('<div></div>').omDialog();

	el.omDialog({width: 369 });
		equals(dlg().width(), 369, "初始化时显式设置宽度(width)");
	el.remove();
});

})(jQuery);