/*
 * om-dialog-events.js
 */
(function($) {

module("dialog: events");

test("onBeforeClose", function() {
	expect(3);

	el = $('<div></div>').omDialog({
		onBeforeClose: function() {
			ok(true, '.omDialog("close")方法触发onBeforeClose回调');
			equals(this[0], el[0], "回调方法的上下文");
			return false;
		}
	});
	el.omDialog('close');
	isOpen('onBeforeClose回调方法返回false会阻止对话框关闭');
	el.remove();
});

test("onClose", function() {
	expect(2);

	el = $('<div></div>').omDialog({
		onClose: function() {
			ok(true, '.omDialog("close")触发onClose回调');
			equals(this[0], el[0], "回调方法中的上下文");
		}
	});
	el.omDialog("close");
	el.remove();
});

test("onOpen", function() {
	expect(4);

	el = $("<div></div>");
	el.omDialog({
		onOpen: function() {
			ok(true, 'autoOpen: true 触发onOpen回调');
			equals(this[0], el[0], "回调方法中的上下文");
		}
	});
	el.remove();

	el = $("<div></div>");
	el.omDialog({
		autoOpen: false,
		onOpen: function() {
			ok(true, '.omDialog("open")触发onOpen回调');
			equals(this[0], el[0], "回调方法中的上下文");
		}
	});
	el.omDialog("open");
	el.remove();
});

})(jQuery);
