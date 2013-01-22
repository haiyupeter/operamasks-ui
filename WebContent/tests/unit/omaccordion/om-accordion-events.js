(function($) {

	module("omAccordion: events");

	asyncTest("Activate", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		element.omAccordion({
			onActivate : function(index) {
				equal(index, 1 ,"Activate event is triggered");
				start();
			}
		});
		element.omAccordion("activate", "1");
		accordion_state(element, 0, 1, 0);
	});

	asyncTest("beforeActivate", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		element.omAccordion("activate", "1");
		element.omAccordion({
			onBeforeActivate : function(index) {
				equal(index , 0, "BeforeActivate event is triggered");
				start();
			}
		});
		element.omAccordion("activate", "0");
		accordion_state(element, 1, 0, 0);
	});

	asyncTest("Collaspe", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		element.omAccordion("activate", "1");
		element.omAccordion({
			onCollapse : function(index) {
				equal(index , 1 , "Collapse event is triggered");
				start();
			}
		});
		element.omAccordion("activate", "2");		
		accordion_state(element, 0, 0, 1);
	});

	asyncTest(" onBeforeCollapse ", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		element.omAccordion({
			onBeforeCollapse : function(index) {
				equal(index , 0 , "beforeCollapse event is triggered");
				start();
			}
		});
		element.omAccordion("activate", "1");		
		accordion_state(element, 0,1,0);
	});

}(jQuery));
