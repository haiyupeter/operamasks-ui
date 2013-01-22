( function($) {

	module("omAccordion: setoptions");

	function compareStyleValue(element, expect, message) {
		var actualValue = element.attr('style').valueOf();
		var expectValue = expect;
		var positionOfSemicolon = actualValue.indexOf(';');
		if(positionOfSemicolon != -1) {
			var keyset = actualValue.split(";");
			for(var i=0,len=keyset.length; i<len; i++){
				if(keyset[i].indexOf(expect[i]) != -1){
					var entry = keyset[i].split(":");
					entry[0] = $.trim(entry[0]);
					entry[1] = $.trim(entry[1]);
					deepEqual(entry, expectValue, message);
					break;
				}
			}
		} else {
			deepEqual(actualValue.split(":"), expectValue, message);
		}
	}

	test("{ active }", function() {
		expect(6);
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		equal(element.omAccordion("option", "active"), 0);
		accordion_state(element, 1, 0, 0);
		
		element = $("#accordionId").omAccordion({
			active : 2
		});
		equal(element.omAccordion("option", "active"), 2);
		accordion_state(element, 0, 0, 1);
		
		element = $("#accordionId").omAccordion({
			active : -1
		});
		equal(element.omAccordion("option", "active"), -1);//由于{collapsible:true}，所以active:-1是合法的，全部panel收起
		accordion_state(element, 0, 0, 0);
	});

	test("{disable}", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			disabled : true,
			collapsible : true
		});
		equal(element.find(">.om-accordion-disable").is(":hidden") , false , "init accordion width disabled:true");
		
		element = $("#accordionId").omAccordion({
			disabled : false,
			collapsible : true
		});
		equal(element.find(">.om-accordion-disable").is(":hidden") , true , "init accordion width disabled:false");
	});
	test("{ height }", function() {//default
		expect(8);
		//default:auto element is'nt 'style' attribute
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		equal(element.omAccordion("option", "height"), 'auto', "accordion's heigh default:'auto'");
		equal(element.omAccordion("option", "width"), 'auto', "accrodion's width default:'auto'");
		
		element = $("#accordionId").omAccordion({
			collapsible : true,
			height : 'fit'
		});
		equal(element.omAccordion("option", "height"), 'fit', "accordion's height is 'fit'");
		var expectValue = ["height", "100%"];
		compareStyleValue(element, expectValue, "accordion's height fit in with it father container");
		
		element = $("#accordionId").omAccordion({
			collapsible : true,
			height : '80%'
		});
		equal(element.omAccordion("option", "height"), '80%', "accordion's height is 'fit'");
		var expectValue = ["height", "80%"];
		compareStyleValue(element, expectValue, "accordion's height % in with it father container");
		
		element = $("#accordionId").omAccordion({
			collapsible : true,
			height : '35em'
		});
		equal(element.omAccordion("option", "height"), '35em', "accordion's height is 'fit'");
		var expectValue = ["height", "35em"];
		compareStyleValue(element, expectValue, "accordion's height 'em' in with it father container");

	});
	
	test("{ width }", function() {
		expect(6);
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			width : 'fit'
		});
		equal(element.omAccordion("option", "width"), 'fit', "accordion's width is 'fit'");
		var expectValue = ["width", "100%"];
		compareStyleValue(element, expectValue, "accordion's width fit in with it father container");
		
		element = $("#accordionId").omAccordion({
			collapsible : true,
			width : '80%'
		});
		equal(element.omAccordion("option", "width"), '80%', "accordion's width is 'fit'");
		var expectValue = ["width", "80%"];
		compareStyleValue(element, expectValue, "accordion's width % in with it father container");
		
		element = $("#accordionId").omAccordion({
			collapsible : true,
			width : '35em'
		});
		equal(element.omAccordion("option", "width"), '35em', "accordion's width is 'fit'");
		var expectValue = ["width", "35em"];
		compareStyleValue(element, expectValue, "accordion's width em in with it father container");

	});
}(jQuery) );
