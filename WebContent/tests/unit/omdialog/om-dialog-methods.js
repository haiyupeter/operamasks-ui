/*
 * om-dialog-methods.js
 */
(function($) {

module("omDialog: methods");

test("close", function() {
	var expected = $('<div></div>').omDialog(),
		actual = expected.omDialog('close');
	equals(actual, expected, 'close方法支持链式操作');
	expected.remove();
	actual.remove();
	
	el = $('<div></div>').omDialog();
	ok(dlg().is(':visible') && !dlg().is(':hidden'), '在执行close方法之前对话框是可见的');
	el.omDialog('close');
	ok(dlg().is(':hidden') && !dlg().is(':visible'), '在执行close方法之后对话框不可见了');
	el.remove();
});

test("isOpen", function() {
	expect(4);

	el = $('<div></div>').omDialog();
	equals(el.omDialog('isOpen'), true, "在初始化后对话框是可见的,isOpen方法返回true");
	el.omDialog('close');
	equals(el.omDialog('isOpen'), false, "执行close方法后对话框被关闭了，isOpen方法返回false");
	el.remove();

	el = $('<div></div>').omDialog({autoOpen: false});
	equals(el.omDialog('isOpen'), false, "初始化时显式设置对话框为关闭状态，这时调用isOpen方法返回false");
	el.omDialog('open');
	equals(el.omDialog('isOpen'), true, "调用open方法，此时isOpen方法返回true");
	el.remove();
});

test("open", function() {
	var expected = $('<div></div>').omDialog(),
		actual = expected.omDialog('open');
	equals(actual, expected, 'open方法支持链式操作');
	expected.remove();
	actual.remove();

	el = $('<div></div>').omDialog({ autoOpen: false });
	ok(dlg().is(':hidden') && !dlg().is(':visible'), '初始化指定对话框为关闭状态，对话框是不可见的');
	el.omDialog('open');
	ok(dlg().is(':visible') && !dlg().is(':hidden'), '执行open方法，对话框变为可见状态');
	el.remove();
});

})(jQuery);
