(function($) {

	module("omAjaxSubmit: utils");

	//test serialization to array
	test("formToArray: multi-select", function() {
		expect(3);
		var a = $("#form1").formToArray();
		ok(a.constructor == Array, "type check");
		ok(a.length == 13, "array length");
		ok(arrayCount(a, 'Multiple') == 3, "multi-select");
	});
	
	//test serialization to array
	test("formToArray: 'action' and 'method' inputs", function() {
		expect(3);
		var a = $("#form1").formToArray();
		ok(a.constructor == Array, "type check");
		ok(arrayValue(a, 'action') == 1, "input name=action");
		ok(arrayValue(a, 'method') == 2, "input name=method");
	});
	
	//test string serialization
	test("serialize: param count", function() {
		expect(2);
		var s = $("#form1").formSerialize();
		ok(s.constructor == String, "type check");
		ok(s.split('&').length == 13, "string array length");
	});
	
	//test support for input elements not contained within a form
	test("serialize: pseudo form", function() {
		expect(2);
		var s = $("#pseudo *").fieldSerialize();
		ok(s.constructor == String, "type check");
		ok(s.split('&').length == 3, "string array length");
	});
	
	//test resetForm
	test("resetForm (text input)", function() {
		expect(3);
		var $el = $('#form1 input[name=Name]');
		var val = $el.val();
		ok('MyName1' == val, 'beforeSubmit: ' + val);
		$el.val("test");
		val = $el.val();
		ok('test' == $el.val(), 'update: ' + val);
		$('#form1').resetForm();
		val = $el.val();
		ok('MyName1' == val, 'success: ' + val);
	});
	
	//test resetForm
	test("resetForm (select)", function() {
		expect(3);
		var $el = $('#form1 select[name=Single]');
		var val = $el.val();
		ok('one' == val, 'beforeSubmit: ' + val);
		$el.val("two");
		val = $el.val();
		ok('two' == $el.val(), 'update: ' + val);
		$('#form1').resetForm();
		val = $el.val();
		ok('one' == val, 'success: ' + val);
	});
	
	//test resetForm
	test("resetForm (textarea)", function() {
		expect(3);
		var $el = $('#form1 textarea');
		var val = $el.val();
		ok('This is Form1' == val, 'beforeSubmit: ' + val);
		$el.val("test");
		val = $el.val();
		ok('test' == val, 'udpate: ' + val);
		$('#form1').resetForm();
		val = $el.val();
		ok('This is Form1' == val, 'success: ' + val);
	});
	
	//test resetForm
	test("resetForm (checkbox)", function() {
		expect(3);
		var el = $('#form1 input:checkbox:checked')[0];
		var val = el.value;
		ok(el.checked, 'beforeSubmit: ' + el.checked);
		el.checked = false;
		ok(!el.checked, 'update: ' + el.checked);
		$('#form1').resetForm();
		ok(el.checked, 'success: ' + el.checked);
	});
	
	//test resetForm
	test("resetForm (radio)", function() {
		expect(3);
		var el = $('#form1 input:radio:checked')[0];
		var val = el.value;
		ok(el.checked, 'beforeSubmit: ' + el.checked);
		el.checked = false;
		ok(!el.checked, 'update: ' + el.checked);
		$('#form1').resetForm();
		ok(el.checked, 'success: ' + el.checked);
	});
	
	//test clearForm
	test("clearForm (text input)", function() {
		expect(2);
		var $el = $('#form1 input[name=Name]');
		var val = $el.val();
		ok('MyName1' == val, 'beforeSubmit: ' + val);
		$('#form1').clearForm();
		val = $el.val();
		ok('' == val, 'success: ' + val);
	});
	
	//test clearForm
	test("clearForm (select)", function() {
		expect(2);
		var $el = $('#form1 select[name=Single]');
		var val = $el.val();
		ok('one' == val, 'beforeSubmit: ' + val);
		$('#form1').clearForm();
		val = $el.val();
		ok(!val, 'success: ' + val);
	});
	
	//test clearForm; here we're testing that a hidden field is NOT cleared
	test("clearForm: (hidden input)", function() {
		expect(2);
		var $el = $('#form1 input:hidden');
		var val = $el.val();
		ok('hiddenValue' == val, 'beforeSubmit: ' + val);
		$('#form1').clearForm();
		val = $el.val();
		ok('hiddenValue' == val, 'success: ' + val);
	});
	
	//test clearForm; here we're testing that a submit element is NOT cleared
	test("clearForm: (submit input)", function() {
		expect(2);
		var $el = $('#form1 input:submit');
		var val = $el.val();
		ok('Submit1' == val, 'beforeSubmit: ' + val);
		$('#form1').clearForm();
		val = $el.val();
		ok('Submit1' == val, 'success: ' + val);
	});
	
	//test clearForm
	test("clearForm (checkbox)", function() {
		expect(2);
		var el = $('#form1 input:checkbox:checked')[0];
		ok(el.checked, 'beforeSubmit: ' + el.checked);
		$('#form1').clearForm();
		ok(!el.checked, 'success: ' + el.checked);
	});
	
	//test clearForm
	test("clearForm (radio)", function() {
		expect(2);
		var el = $('#form1 input:radio:checked')[0];
		ok(el.checked, 'beforeSubmit: ' + el.checked);
		$('#form1').clearForm();
		ok(!el.checked, 'success: ' + el.checked);
	});
	
	test("fieldValue:{fieldValue=true)", function() {
		$('#password').val('14');
	    
		ok('5' == $('#fieldTest input').fieldValue(true)[0], 'input');
		ok('1' == $('#fieldTest :input').fieldValue(true)[0], ':input');
		ok('5' == $('#fieldTest input:hidden').fieldValue(true)[0], ':hidden');
		equal($('#fieldTest :password').fieldValue(true)[0],'14', ':password');
		ok('12' == $('#fieldTest :radio').fieldValue(true)[0], ':radio');
		ok('1' == $('#fieldTest select').fieldValue(true)[0], 'select');

		var expected = ['8', '10'];
		var result = $('#fieldTest :checkbox').fieldValue(true);
		ok(result.length == expected.length, 'result size check (checkbox): ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)
			ok(result[i] == expected[i], expected[i]);
		expected = ['3', '4'];
		result = $('#fieldTest [name=B]').fieldValue(true);
		ok(result.length == expected.length, 'result size check (select-multiple): ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)
			ok(result[i] == expected[i], expected[i]);
	});
	
	test("fieldValue:{fieldValue:false)", function() {
	    $('#password').val('14');
		ok('5' == $('#fieldTest input').fieldValue(false)[0], 'input');
		ok('1' == $('#fieldTest :input').fieldValue(false)[0], ':input');
		ok('5' == $('#fieldTest input:hidden').fieldValue(false)[0], ':hidden');
		ok('14' == $('#fieldTest :password').fieldValue(false)[0], ':password');
		ok('1' == $('#fieldTest select').fieldValue(false)[0], 'select');

		var expected = ['8', '9', '10'];
		var result = $('#fieldTest :checkbox').fieldValue(false);
		ok(result.length == expected.length, 'result size check (checkbox): ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i]);
		expected = ['11', '12', '13'];
		result = $('#fieldTest :radio').fieldValue(false);
		ok(result.length == expected.length, 'result size check (radio): ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i]);
		expected = ['3', '4'];
		result = $('#fieldTest [name=B]').fieldValue(false);
		ok(result.length == expected.length, 'result size check (select-multiple): ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i]);
	});
	
	test("fieldSerialize(true) input", function() {
	    $('#password').val('14');
		var expected = ['C=5', 'D=6', 'F=8', 'F=10', 'G=12', 'H=14'];

		var result = $('#fieldTest input').fieldSerialize(true);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)
		equal(result[i] ,expected[i], expected[i] + ' = ' + result[i]);
	});
	
	test("fieldSerialize(true) :input", function() {
	    $('#password').val('14');
		var expected = ['A=1', 'B=3', 'B=4', 'C=5', 'D=6', 'E=7', 'F=8', 'F=10', 'G=12', 'H=14'];

		var result = $('#fieldTest :input').fieldSerialize(true);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i] + ' = ' + result[i]);
	});
	
	test("fieldSerialize(false) :input", function() {
	    $('#password').val('14');
		var expected = ['A=1', 'B=3', 'B=4', 'C=5', 'D=6', 'E=7', 'F=8', 'F=9', 'F=10', 'G=11', 'G=12', 'G=13', 'H=14', 'I=15', 'J=16'];

		var result = $('#fieldTest :input').fieldSerialize(false);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i] + ' = ' + result[i]);
	});
	test("fieldSerialize(true) select-mulitple", function() {
		var expected = ['B=3', 'B=4'];

		var result = $('#fieldTest [name=B]').fieldSerialize(true);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i] + ' = ' + result[i]);
	});
	test("fieldSerialize(true) :checkbox", function() {
		var expected = ['F=8', 'F=10'];

		var result = $('#fieldTest :checkbox').fieldSerialize(true);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i] + ' = ' + result[i]);
	});
	test("fieldSerialize(false) :checkbox", function() {
		var expected = ['F=8', 'F=9', 'F=10'];

		var result = $('#fieldTest :checkbox').fieldSerialize(false);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i] + ' = ' + result[i]);
	});
	test("fieldSerialize(true) :radio", function() {
		var expected = ['G=12'];

		var result = $('#fieldTest :radio').fieldSerialize(true);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i] + ' = ' + result[i]);
	});
	test("fieldSerialize(false) :radio", function() {
		var expected = ['G=11', 'G=12', 'G=13'];

		var result = $('#fieldTest :radio').fieldSerialize(false);
		result = result.split('&');

		ok(result.length == expected.length, 'result size check: ' + result.length + '=' + expected.length);
		for(var i = 0; i < result.length; i++)ok(result[i] == expected[i], expected[i] + ' = ' + result[i]);
	});
})(jQuery);
