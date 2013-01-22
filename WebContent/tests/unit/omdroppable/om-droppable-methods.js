/*
 * droppable_methods.js
 */
(function($) {

module("omDroppable: methods");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').omDroppable().remove();
	ok(true, '.omDroppable() called on element');

	$([]).omDroppable();
	ok(true, '.omDroppable() called on empty collection');

	$("<div></div>").omDroppable();
	ok(true, '.omDroppable() called on disconnected DOMElement');

	$("<div></div>").omDroppable().omDroppable("foo");
	ok(true, 'arbitrary method called after init');

	$("<div></div>").omDroppable().omDroppable("option", "foo");
	ok(true, 'arbitrary option getter after init');

	$("<div></div>").omDroppable().omDroppable("option", "foo", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	$("<div></div>").appendTo('body').omDroppable().omDroppable("destroy").remove();
	ok(true, '.omDroppable("destroy") called on element');

	$([]).omDroppable().omDroppable("destroy");
	ok(true, '.omDroppable("destroy") called on empty collection');

	$("<div></div>").omDroppable().omDroppable("destroy");
	ok(true, '.omDroppable("destroy") called on disconnected DOMElement');

	$("<div></div>").omDroppable().omDroppable("destroy").omDroppable("foo");
	ok(true, 'arbitrary method called after destroy');
	
	var expected = $('<div></div>').omDroppable(),
		actual = expected.omDroppable('destroy');
	equals(actual, expected, 'destroy is chainable');
});

})(jQuery);
