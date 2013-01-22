/*
 * om-dialog-options.js
 */
(function($) {

module("omDialog: options");

test("autoOpen", function() {
	expect(2);

	el = $('<div></div>').omDialog({ autoOpen: false });
		isNotOpen('.omDialog({ autoOpen: false })');
	el.remove();

	el = $('<div></div>').omDialog({ autoOpen: true });
		isOpen('.omDialog({ autoOpen: true })');
	el.remove();
});

test("buttons", function() {
	expect(8);

	var buttons = [
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
	el = $('<div></div>').omDialog({ buttons: buttons });
	var btn = $("button", dlg());
	equal(btn.length, 2, "自定义按钮的个数");

	var i = 0;
	$.each(buttons, function(index , button) {
		equal(btn.eq(i).text(), button.text, "第"+(i+1)+"个按钮的文本内容");
		i++;
	});

	ok(btn.parent().hasClass('om-dialog-buttonset'), "按钮处于容器当中");
	btn.trigger("click");
	el.remove();
});

test("closeOnEscape", function() {
	el = $('<div></div>').omDialog({ closeOnEscape: false });
	ok(true, 'closeOnEscape: false');
	ok(el.is(':visible') && !el.is(':hidden'), '在按下键盘ESC之前对话框是打开的');
	el.simulate('keydown', { keyCode: $.om.keyCode.ESCAPE })
		.simulate('keypress', { keyCode: $.om.keyCode.ESCAPE })
		.simulate('keyup', { keyCode: $.om.keyCode.ESCAPE });
	ok(el.is(':visible') && !el.is(':hidden'), '在按下键盘ESC之后对话框还是打开的');
	
	el.remove();
	
	el = $('<div></div>').omDialog({ closeOnEscape: true });
	ok(true, 'closeOnEscape: true');
	ok(el.is(':visible') && !el.is(':hidden'), '在按下键盘ESC之前对话框是打开的');
	el.simulate('keydown', { keyCode: $.om.keyCode.ESCAPE })
		.simulate('keypress', { keyCode: $.om.keyCode.ESCAPE })
		.simulate('keyup', { keyCode: $.om.keyCode.ESCAPE });
	ok(el.is(':hidden') && !el.is(':visible'), '在按下键盘ESC之后对话框是关闭的');
	
	el.remove();
});

test("dialogClass", function() {
	expect(4);

	el = $('<div></div>').omDialog();
		equal(dlg().is(".colorful"), false, '没有指定dialogClass属性，此时colorful class并没有被添加');
	el.remove();

	el = $('<div></div>').omDialog({ dialogClass: "colorful" });
		equal(dlg().is(".colorful"), true, '创建对话框时使用dialogClass属性，此时colorful class已经被添加');
	el.remove();

	el = $('<div></div>').omDialog({ dialogClass: "colorful , another" });
		equal(dlg().is(".colorful"), true, '创建对话框时使用dialogClass属性，指定两个class， colorful class 已经被添加');
		equal(dlg().is(".another"), true, '创建对话框时使用dialogClass属性, 指定两个class，another class 已经被添加');
	el.remove();
});

test("draggable", function() {
	expect(2);

	el = $('<div></div>').omDialog({ draggable: false });
		shouldnotmove();
	el.remove();

	el = $('<div></div>').omDialog({ draggable: true });
		shouldmove();
	el.remove();
});

test("height", function() {
	expect(2);

	el = $('<div></div>').omDialog();
		equal(dlg().height(), omDialog_defaults.minHeight, "默认高度(height)");
	el.remove();

	el = $('<div></div>').omDialog({ height: 250 });
		equal(dlg().height(), 250, "显示设置高度(height)");
	el.remove();
});

test("maxHeight", function() {
	expect(2);

	el = $('<div></div>').omDialog({ maxHeight: 200 });
		drag('.om-resizable-s', 1000, 1000);
		equal(heightAfter, 200, "maxHeight");
	el.remove();

	el = $('<div></div>').omDialog({ maxHeight: 200 });
		drag('.om-resizable-n', -1000, -1000);
		equal(heightAfter, 200, "maxHeight");
	el.remove();
});

test("maxWidth", function() {
	expect(2);

	el = $('<div></div>').omDialog({ maxWidth: 400 });
		drag('.om-resizable-e', 1000, 1000);
		equal(widthAfter, 400, "maxWidth");
	el.remove();

	el = $('<div></div>').omDialog({ maxWidth: 400 });
		drag('.om-resizable-w', -1000, -1000);
		equal(widthAfter, 400, "maxWidth");
	el.remove();
});

test("minHeight", function() {
	expect(2);

	el = $('<div></div>').omDialog({ minHeight: 15 });
		drag('.om-resizable-s', -1000, -1000);
		equal(heightAfter, 15, "minHeight");
	el.remove();

	el = $('<div></div>').omDialog({ minHeight: 15 });
		drag('.om-resizable-n', 1000, 1000);
		equal(heightAfter, 15, "minHeight");
	el.remove();
});

test("minWidth", function() {
	expect(2);
	
	el = $('<div></div>').omDialog({ minWidth: 20 });
		drag('.om-resizable-e', -1000, -1000);
		equal(widthAfter, 20, "minWidth");
	el.remove();

	el = $('<div></div>').omDialog({ minWidth: 20 });
		drag('.om-resizable-w', 1000, 1000);
		equal(widthAfter, 20, "minWidth");
	el.remove();
});

test("modal", function() {
	expect(3);
	el = $('<div></div>').omDialog();
		isNotModal('默认为非模态');
	el.remove();

	el = $('<div></div>').omDialog({modal:true});
		isModal('显示设置为模态');
	el.remove();
	
	el = $('<div></div>').omDialog({modal:false});
		isNotModal('显示设置为非模态');
	el.remove();
});

test("resizable", function() {
	expect(3);

	el = $('<div></div>').omDialog();
		shouldresize("默认为可变大小");
	el.remove();

	el = $('<div></div>').omDialog({ resizable: true });
		shouldresize("显示设置可变大小");
	el.remove();
	
	el = $('<div></div>').omDialog({ resizable: false });
		shouldnotresize("显示设置不可变大小");
	el.remove();
});

test("title", function() {
	expect(8);

	function titleText() {
		return dlg().find(".om-dialog-title").html();
	}

	el = $('<div></div>').omDialog();
		// some browsers return a non-breaking space and some return "&nbsp;"
		// so we get the text to normalize to the actual non-breaking space
		equal(dlg().find(".om-dialog-title").text(), " ", "默认标题为空");
		equal(el.omDialog("option", "title"), "", "标题内容还是为空没有改变");
	el.remove();

	el = $('<div title="个人信息"/>').omDialog();
		equal(titleText(), "个人信息", "直接从html元素的title属性获取标题");
		equal(el.omDialog("option", "title"), "个人信息", "通过option获取标题");
	el.remove();

	el = $('<div></div>').omDialog({ title: '个人信息' });
		equal(titleText(), "个人信息", "初始化指定标题");
		equal(el.omDialog("option", "title"), "个人信息", "通过option获取初始化设置的标题");
	el.remove();

	el = $('<div title="个人信息"/>').omDialog({ title: '其它信息' });
		equal(titleText(), "其它信息", "初始化指定的标题必须覆盖掉html元素本身的title");
		equal(el.omDialog("option", "title"), "其它信息", "通过option获取初始化设置的标题");
	el.remove();
});


test("width", function() {
	expect(2);

	el = $('<div></div>').omDialog();
		equals(dlg().width(), omDialog_defaults.width, "默认宽度(width)");
	el.remove();

	el = $('<div></div>').omDialog({width: 369 });
		equals(dlg().width(), 369, "初始化时显式设置宽度(width)");
	el.remove();
});

})(jQuery);