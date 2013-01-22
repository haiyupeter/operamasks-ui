(function($) {
	jQuery.validator.defaults.debug = true;

	module("omValidate: methods");
	
	test("element", function(){
		expect(2);
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true, minlength: '2'},
				lastname:{required:true},
				someting:{required:true}
			}
		});		
		ok(!v.element('#firstname'),"'firstname' input valid failure");
		$('#firstname').val("okai");
		ok(v.element('#firstname'),"'firstname' input valid success");
	});
	
	test("form", function(){
		expect(2);
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true, minlength: '2'},
				lastname:{required:true},
				someting:{required:true}
			}
		});
		ok(!v.form(),"form validate failure");
		$('#firstname').val("okai");
		$('#lastname').val('okai');
		ok(v.form(),"form validate success");
	});
	
	test("numberOfInvalids", function(){
		expect(1);		
		var v =$('#testForm1').validate({
			rules:{
				firstname:{required:true, minlength: '2'},
				lastname:{required:true},
				someting:{required:true}
			}
		});		
		$('#firstname').focus().val('a');
		$('#submit').click();
		equal(v.numberOfInvalids(),2 , "'firstname' input invalid");		
	});
	
	test("resetForm", function(){
		expect(3);
		function errors(expected, message) {
			equals(expected, v.size(), message );
		}
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true, minlength: '2'},
				lastname:{required:true},
				someting:{required:true}
			}
		});
		v.form();
		errors(2,"has two error tip");
		$("#firstname").val("hiy");
		v.resetForm();
		errors(0,"no error tip");
		equals( $("#firstname").val(),"hiy" ,"only reset error tip");
	});
	
	test("showErrors", function(){
		expect( 3 );
		var errorLabel = $('#errorFirstname').hide();
		var element = $('#firstname')[0];
		var v = $('#testForm1').validate();
		ok( errorLabel.is(":hidden") );
		equals( 0, $("label.error[for=lastname]").size() );
		v.showErrors({"firstname": "required", "lastname": "bla"});		
		equals( $("label.error[for=lastname]").is(":visible"), true );
	});
	
	test("valid", function(){
		expect(4);
		var errorList = [{name:"meal",message:"foo", element:$("#meal")[0]}];
		var v = $('#testForm3').validate();
		ok( v.valid(), "No errors, must be valid" );
		v.errorList = errorList;
		ok( !v.valid(), "One error, must be invalid" );
		QUnit.reset();
		v = $('#testForm3').validate({ submitHandler: function() {
			ok( false, "Submit handler was called" );
		}});
		ok( v.valid(), "No errors, must be valid and returning true, even with the submit handler" );
		v.errorList = errorList;
		ok( !v.valid(), "One error, must be invalid, no call to submit handler" );
		});
		
		test("validate", function(){
			
	});


})(jQuery);

