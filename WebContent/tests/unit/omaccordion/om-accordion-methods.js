(function( $ ) {

module( "omAccordion: methods");

test( "activate", function () {
	expect(1);
	var element = $("#accordionId").omAccordion({collapsible:true});
	element.omAccordion("activate","1");
	accordion_state( element, 0, 1, 0 );
});

test( "enable/disable", function() {
	expect( 3 );
	var element = $( "#accordionId" ).omAccordion({collapsible :true});	
	accordion_state( element, 1, 0, 0 );
	
	element.omAccordion( "disable" );
	equal(element.find(">.om-accordion-disable").css("display"), "block", "expect disable omAccordion" );
	element.omAccordion( "enable", 0 );
	equal(element.find(".om-accordion-disable").css("display"), "none", "expect ensable omAccordion" );
});

test( "activate/getActivated", function() {
	expect(1);
	var element = $( "#accordionId" ).omAccordion({collapsible :true});
	element.omAccordion("activate","1");
	equal(element.omAccordion("getActivated"), "accordion-2", "the sencond accordion is activated");
});

test( "getLength", function() {
	expect(1);
	var element = $( "#accordionId" ).omAccordion({collapsible :true});
	equal(element.omAccordion("getLength"), 3, "total number of omAccordion is "+element.omAccordion("getLength"));
});

test( "setTitle", function () {
	expect(1);
	var element =  $( "#accordionId").omAccordion({collapsible :true});
	element.omAccordion("setTitle",0,"apusic");
	equal($('.om-panel-title').first().text(), "apusic", "title of the first accordion is 'apusic'");
});

test( "url/reload", function() {
	expect(2);
	var element = $('#accordionId').omAccordion({collapsible :true});	
	element.omAccordion("activate","1");
	var activatedID = element.omAccordion("getActivated");
	stop();
	setTimeout(function(){
		equal($('#' + activatedID).text().match("C")[0], "C", "previous value before reset");	
		start();
	},500);
	
	element.omAccordion('url',1,'./ajax/content1.html');
	element.omAccordion('reload',1);
	stop();
	setTimeout(function(){
		equal($('#' + activatedID).text().match("Java")[0], "Java", "the now value after reset");
		start();
	},1000);
});

}( jQuery ) );
