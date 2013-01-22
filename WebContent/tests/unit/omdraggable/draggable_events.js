(function($) {

module("omDraggable: events");

test("回调函数调用次数", function() {

	expect(3);

	var start = 0, stop = 0, dragc = 0;
	el = $("#draggable2").omDraggable({
		onStart: function() { start++; },
		onDrag: function() { dragc++; },
		onStop: function() { stop++; }
	});

	drag(el, 10, 10);

	equals(start, 1, "onStart 回调函数只被调用一次");
	equals(dragc, 3, "onDrag 回调函数在每次 mousemove 的时候调用一次");
	equals(stop, 1, "onStop 回调函数只被调用一次");

});

test("在 onStart 回调函数中返回false取消拖动", function() {

	expect(3);

	var start = 0, stop = 0, dragc = 0;
	el = $("#draggable2").omDraggable({
		onStart: function() { start++; return false; },
		onDrag: function() { dragc++; },
		onStop: function() { stop++; }
	});

	drag(el, 10, 10);

	equals(start, 1, "onStart 回调函数只被调用一次");
	equals(dragc, 0, "onDrag 回调函数不被调用");
	equals(stop, 0, "onStop 回调函数不会被调用");

});

test("在 onDrag 回调函数中返回false取消拖动", function() {

	expect(3);

	var start = 0, stop = 0, dragc = 0;
	el = $("#draggable2").omDraggable({
		onStart: function() { start++;},
		onDrag: function() { dragc++; return false;  },
		onStop: function() { stop++; }
	});

	drag(el, 10, 10);

	equals(start, 1, "onStart 回调函数被调用一次");
	equals(dragc, 1, "onDrag 回调函数被调用一次");
	equals(stop, 1, "onStop 回调函数被调用一次");

});

test("在 onDrag 回调函数中返回false取消停止", function() {

	expect(1);

	el = $("#draggable2").omDraggable({
		helper: 'clone',
		onStop: function() { return false; }
	});

	drag(el, 10, 10);

	ok($("#draggable2").data('omDraggable').helper, "当 stop 回调函数返回 false 时(取消停止) clone 对象不被删除");


});

})(jQuery);
