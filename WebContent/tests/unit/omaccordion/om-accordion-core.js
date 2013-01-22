(function($) {

	module("omAccordion: core");

	/*目前仅支持ul，div，dl不支持*/	
	$.each({
		ul : "#accordionId"		
	}, function(type, selector) {
		test("markup structure: " + type, function() {
			expect(4);
			var element = $(selector).omAccordion({collapsible :true});
			ok(element.hasClass("om-accordion"),
					"main element is .om-accordion");
			equal(element.find(".om-panel-header").length, 3,
					".om-panel-header elements exist, correct number");
			equal(element.find(".om-panel-body").length, 3,
					".om-accordion-content elements exist, correct number");
			deepEqual(element.find(".om-panel-header").next().get(),
					element.find(".om-panel-body").get(),
					"content panels come immediately after headers");
		});
	});

	test("handle click on header-descendant", function() {
		expect(3);
		var element = $("#accordionId").omAccordion({collapsible :true});
		
		$("#accordionId .om-panel:eq(0) .om-panel-title").click();
		accordion_state(element, 0, 0, 0);

		$("#accordionId .om-panel:eq(1) .om-panel-title").click();
		accordion_state(element, 0, 1, 0);

		$("#accordionId .om-panel:eq(2) .om-panel-title").click();
		accordion_state(element, 0, 0, 1);
	});

	test("om-accordion-heading class added to headers anchor", function() {
		expect(1);
		var element = $("#accordionId").omAccordion({collapsible :true});
		var anchors = element.find(".om-panel-header");
		equal(anchors.length, 3);
	});

}(jQuery));
