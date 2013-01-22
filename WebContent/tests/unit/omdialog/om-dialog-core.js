/*
 * om-dialog-core.js
 */
var el, offsetBefore, offsetAfter, heightBefore, heightAfter, widthBefore, widthAfter, dragged;

var omDialog_defaults = {
	minHeight : 150,
	width : 300
};

function dlg() {
	return el.parent();
}

function isModal(why) {
	notEqual($(".om-widget-overlay").length, 0, why);
}

function isNotModal(why) {
	equal($(".om-widget-overlay").length, 0, why);
}

function isOpen(why) {
	ok(el.is(":visible"), why);
}

function isNotOpen(why) {
	ok(!el.is(":visible"), why);
}

function drag(handle, dx, dy) {
	var d = dlg();
	offsetBefore = d.offset();
	heightBefore = d.height();
	widthBefore = d.width();
	//this mouseover is to work around a limitation in resizable
	//TODO: fix resizable so handle doesn't require mouseover in order to be used
	$(handle, d).simulate("mouseover");
	$(handle, d).simulate("drag", {
		dx : dx || 0,
		dy : dy || 0
	});
	dragged = {
		dx : dx,
		dy : dy
	};
	offsetAfter = d.offset();
	heightAfter = d.height();
	widthAfter = d.width();
}

function moved(dx, dy, msg) {
	msg = msg ? msg + "." : "";
	var actual = {
		left : Math.round(offsetAfter.left),
		top : Math.round(offsetAfter.top)
	};
	var expected = {
		left : Math.round(offsetBefore.left + dx),
		top : Math.round(offsetBefore.top + dy)
	};
	deepEqual(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function shouldmove(why) {
	var handle = $(".om-dialog-titlebar", dlg());
	drag(handle, 50, -50);
	moved(50, -50, why);
}

function shouldnotmove(why) {
	var handle = $(".om-dialog-titlebar", dlg());
	drag(handle, 50, -50);
	moved(0, 0, why);
}

function resized(dw, dh, msg) {
	msg = msg ? msg + "." : "";
	var actual = {
		width : widthAfter,
		height : heightAfter
	};
	var expected = {
		width : widthBefore + dw,
		height : heightBefore + dh
	};
	deepEqual(actual, expected, 'resized[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function shouldresize(why) {
	var handle = $(".om-resizable-se", dlg());
	drag(handle, 50, 50);
	resized(50, 50, why);
}

function shouldnotresize(why) {
	var handle = $(".om-resizable-se", dlg());
	drag(handle, 50, 50);
	resized(0, 0, why);
}