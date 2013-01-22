( function($) {

	module("omAccordion: options");

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

	test("{ active: default }", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		equal(element.omAccordion("option", "active"), 0);
		accordion_state(element, 1, 0, 0);
	});
	test("{ active: Number }", function() {
		expect(2);
		//TODO 初始化时没有处理超过accordion数的情况（正数、负数）
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			active : 2
		});
		equal(element.omAccordion("option", "active"), 2);
		accordion_state(element, 0, 0, 1);
	});
	test("{ active: -Number }", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			active : -1
		});
		equal(element.omAccordion("option", "active"), 0);
		accordion_state(element, 1, 0, 0);
	});
	
	test("{ autoplay/interval }", function() {
		expect(2);
		var element = $('#accordionId').omAccordion({
			autoplay : true,
			interval : 2000
		});
		equal(element.omAccordion("option", "autoplay"), true);
		equal(element.omAccordion("option", "interval"), 2000);

	});
	// TODO: add animation tests

	// TODO:
	test("{ collapsible: default }", function() {
		expect(4);
		var element = $("#accordionId").omAccordion({
			active : 1
		});
		//before click
		equal(element.omAccordion("option", "active"), 1);
		accordion_state(element, 0, 1, 0);
		//after click
		element.find(".om-panel-header").eq(1).click();
		equal(element.omAccordion("option", "active"), 1);
		accordion_state(element, 0, 1, 0);
	});
	test("{ collapsible: true }", function() {
		expect(4);
		var element = $("#accordionId").omAccordion({
			active : 1,
			collapsible : true
		});

		equal(element.omAccordion("option", "active"), 1);
		accordion_state(element, 0, 1, 0);

		element.find(".om-panel-header").eq(1).click();
		equal(element.omAccordion("option", "active"), -1);
		//when accordion is collapsible,'active' is '-1'
		accordion_state(element, 0, 0, 0);
	});
	test("{disable: true}", function() {
		expect(1);
		var element = $("#accordionId").omAccordion({
			disabled : true,
			collapsible : true
		});
		equal(element.find(">.om-accordion-disable").length , 1 , "init accordion width disabled:true");
	});
	test("{ height/width:default }", function() {//default
		expect(2);
		//default:auto element is'nt 'style' attribute
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		equal(element.omAccordion("option", "height"), 'auto', "accordion's heigh default:'auto'");
		equal(element.omAccordion("option", "width"), 'auto', "accrodion's width default:'auto'");

	});
	test("{ height:fit}", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			height : 'fit'
		});
		equal(element.omAccordion("option", "height"), 'fit', "accordion's height is 'fit'");
		var expectValue = ["height", "100%"];
		compareStyleValue(element, expectValue, "accordion's height fit in with it father container");

	});
	test("{ height:% }", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			height : '80%'
		});
		equal(element.omAccordion("option", "height"), '80%', "accordion's height is 'fit'");
		var expectValue = ["height", "80%"];
		compareStyleValue(element, expectValue, "accordion's height % in with it father container");
	});
	test("{ height:em }", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			height : '35em'
		});
		equal(element.omAccordion("option", "height"), '35em', "accordion's height is 'fit'");
		var expectValue = ["height", "35em"];
		compareStyleValue(element, expectValue, "accordion's height 'em' in with it father container");

	});
	test("{ width:fit }", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			width : 'fit'
		});
		equal(element.omAccordion("option", "width"), 'fit', "accordion's width is 'fit'");
		var expectValue = ["width", "100%"];
		compareStyleValue(element, expectValue, "accordion's width fit in with it father container");

	});
	test("{ width:% }", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			width : '80%'
		});
		equal(element.omAccordion("option", "width"), '80%', "accordion's width is 'fit'");
		var expectValue = ["width", "80%"];
		compareStyleValue(element, expectValue, "accordion's width % in with it father container");

	});
	test("{ width:em }", function() {
		expect(2);
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			width : '35em'
		});
		equal(element.omAccordion("option", "width"), '35em', "accordion's width is 'fit'");
		var expectValue = ["width", "35em"];
		compareStyleValue(element, expectValue, "accordion's width em in with it father container");

	});
	test("{ switchEffect }", function() {
		expect(0);
		//Default: false

	});
	test("{ switchMode:default }", function() {
		expect(1);
		//Default：click
		var element = $("#accordionId").omAccordion({
			collapsible : true
		});
		var headers = element.find(".om-panel-header");
		headers.eq(1).click();
		accordion_state(element, 0, 1, 0);
	});
	test("{switchMode:mouseover}", function() {
		expect(1);
		//mouseover
		var element = $("#accordionId").omAccordion({
			collapsible : true,
			switchMode : 'mouseover'
		});
		var headers = element.find(".om-panel-header");
		headers.eq(2).mouseover();
		stop();
		setTimeout(function() {
			accordion_state(element, 0, 0, 1);
			start();
		}, 500);
	});
	test("{ iconCls }", function() {
		expect(0); $('div li a').eq(0).attr('iconcls') == undefined
	});
}(jQuery) );
