(function($) {

function testScroll(position) {
	$("#main").css('position', position);
	drag(el, 50, 50);
	moved(50, 50, position+' parent');
}

function setScroll(what) {
	if(what) {
		$(document).scrollTop(100); $(document).scrollLeft(100);
	} else {
		$("#main")[0].scrollTop = 100; $("#main")[0].scrollLeft = 100;
	}
}

var border = function(el, side) { 
	var bwidth = el.css('border-' + side + '-width');
	if(bwidth == "medium"){
		bwidth = "0px";
	}
	return parseInt(bwidth); 
	};

var margin = function(el, side) { 
	var margin = el.css('margin-' + side);
	if(margin == "auto"){
		margin = "0px";
	}
	return parseInt(margin); 
	};

module("omDraggable: options");

test("{ axis: 'x' }", function() {
	el = $("#draggable2").omDraggable({ axis: "x" });
	drag(el, 50, 50);
	moved(50, 0);
});

test("{ axis: 'y' }", function() {
	el = $("#draggable2").omDraggable({ axis: "y" });
	drag(el, 50, 50);
	moved(0, 50);
});

test("{ axis: ? }, unexpected", function() {
	var unexpected = {
		"true": true,
		"{}": {},
		"[]": [],
		"null": null,
		"undefined": undefined,
		"function() {}": function() {}
	};
	$.each(unexpected, function(key, val) {
		el = $("#draggable2").omDraggable({ axis: val });
		drag(el, 50, 50);
		moved(50, 50, "axis: " + key);
		el.omDraggable("destroy");
	});
});

test("{ cancel: 'span' }", function() {
	el = $("#draggable2").omDraggable();
	drag("#draggable2 span", 50, 50);
	moved(50, 50);

	el.omDraggable("destroy");

	el = $("#draggable2").omDraggable({ cancel: 'span' });
	drag("#draggable2 span", 50, 50);
	moved(0, 0);
});

test("{ cancel: ? }, unexpected", function() {
	var unexpected = {
		"true": true,
		"false": false,
		"{}": {},
		"[]": [],
		"null": null,
		"undefined": undefined,
		"function() {return '';}": function() {return '';},
		"function() {return true;}": function() {return true;},
		"function() {return false;}": function() {return false;}
	};
	$.each(unexpected, function(key, val) {
		el = $("#draggable2").omDraggable({ cancel: val });
		drag(el, 50, 50);
		var expected = [50, 50];
		moved(expected[0], expected[1], "cancel: " + key);
		el.omDraggable("destroy");
	});
});


test("{ containment: 'parent' }, relative", function() {
	el = $("#draggable1").omDraggable({ containment: 'parent' });
	var p = el.parent(), po = p.offset();
	drag(el, -100, -100);
	var expected = {
		left: po.left + border(p, 'left') + margin(el, 'left'),
		top: po.top + border(p, 'top') + margin(el, 'top')
	};
	deepEqual(offsetAfter, expected, 'compare offset to parent');
});

test("{ containment: 'parent' }, absolute", function() {
	el = $("#draggable2").omDraggable({ containment: 'parent' });
	var p = el.parent(), po = p.offset();
	drag(el, -100, -100);
	var expected = {
		left: po.left + border(p, 'left') + margin(el, 'left'),
		top: po.top + border(p, 'top') + margin(el, 'top')
	};
	deepEqual(offsetAfter, expected, 'compare offset to parent');
});

test("{ cursor: 'move' }", function() {

	function getCursor() { return $("body").css("cursor"); }

	expect(2);

	var expected = "move", actual, before, after;

	el = $("#draggable2").omDraggable({
		cursor: expected,
		onStart: function(event, ui) {
			actual = getCursor();
		}
	});

	before = getCursor();
	drag("#draggable2", -1, -1);
	after = getCursor();

	equals(actual, expected, "start callback: cursor '" + expected + "'");
	equals(after, before, "after drag: cursor restored");

});

test("{ handle: 'span' }", function() {
    el = $("#draggable2").omDraggable({ handle: 'span' });

    drag("#draggable2 span", 50, 50);
    moved(50, 50, "drag span");

    drag("#draggable2", 50, 50);
    moved(0, 0, "drag element");
});

})(jQuery);
