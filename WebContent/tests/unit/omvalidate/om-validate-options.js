(function($) {
	
	jQuery.validator.defaults.debug = true;
		
	module("validate options");
	
	test("errorClass:{default}",function(){
		expect(1);
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true, minlength: '2'},				
			}
		});
		$('#firstname').focus().val("o");
		$('#submit').click();
		
		equal($('#firstname').next().attr('class'),'error',"errolClass default value equal 'error'");	
	
		
	});
	
	test("errorClass:{change to 'invalid'}",function(){
		expect(1);
		var v = $("#testForm1").validate({
			rules:{
				lastname:{required:true,minlength: '2'},
			},
			errorClass: 'invalid'
		});
		$('#lastname').focus().val("o");
		$('#submit').click();
		
		equal($('#lastname').next().attr('class'),'invalid',"errolClass default value equal 'error'");
		
	});
	
	test("errorContainer/errorLabelContainer",function(){
		expect(2);
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true},
				lastname:{required:true},
				someting:{required:true}
			},
			errorContainer: '#messagebox1,#messagebox2',
			errorLabelContainer:'#messagebox1 ul'			
		});
		equal($('#messagebox1 ul').children().length==0,true,"after 'set' errorContainer/errorLabelContainer ");
		$("#submit").click();
		equal($('#messagebox1 ul').children().length>0,true,"after 'excute' errorContainer/errorLabelContainer ");
	});

	test("errorElement",function(){
		expect(2);
		var v = $("#testForm1").validate({
			rules:{
				lastname:{required:true,minlength:'2'},				
			},
			errorElement: "aa"
		});
		ok(!$('aa')[0],"error element type has been not created");
		$('#lastname').focus().val("o");
		$('#submit').click();
		
		ok($('aa')[0],"error element type has been created");
		
	});

	test("errorPlacement",function(){
		expect(1);
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true},
				lastname:{required:true},
				someting:{required:true}
			},
			errorPlacement: function(error,element){
				error.appendTo( element.parent('#testForm1') );
			}
		});		
		$('#firstname').focus().val("o");
		$('#submit').click();
		var t = $('#testForm1').children();
		equal(t.last()[0].tagName,"LABEL","before error happen" );
		
	});
	
	test("focusCleanup:{ default false}", function() {
		expect(2);
		var form = $("#userForm");
		form.validate({
			rules:{
				username:{required:true},
			}
		});
		form.valid();
		ok( form.is(":has(label.error[for=username]:visible)"));
		$("#username").focus();
		ok( form.is(":has(label.error[for=username]:visible)"));
	});
	
	test("focusCleanup:{true}/focusInvalid: {false}", function() {
		expect(2);
		var form = $("#userForm");
		var v = form.validate({
			rules:{
				username:{required:true},
			},
			focusInvalid: false, //必须设置
			focusCleanup: true
		});
		v.form();
		ok( form.is(":has(label.error[for=username]:visible)") );
		$("#username").focus().trigger("focusin");
		ok( !form.is(":has(label.error[for=username]:visible)") );
	});
	
	test("focusInvalid:{default true}",function(){
		expect(1);
		var n = 0;		
		var inputs = $("#testForm1 input").bind('focus',function() {
			n++;
			if(n==2){
				n=0;
				return;
			}
			equals( this, inputs[1],  "focused first element" );
		});	
	    var form = $("#testForm1");
		var v = $("#testForm1").validate({
			rules:{
				lastname:{required:true}
			},
			focusInvalid: true						
		});
		
		
		$('#submit').click();		
     	// v.form();
	    //v.focusInvalid();   
	});
    
    test("groups:{without 'errorPlacement'}",function(){
    		expect(1);
    		var v =$('#testForm1').validate({
    			rules:{
    				firstname:{required:true},
					lastname:{required:true},
					someting:{required:true}
    			},
    			groups:{
    				username: "firstname lastname"
    			}
    		});
    		$('#submit').click();
    		equal($('#firstname').next().attr("class")=='error' && $('#lastname').next()[0].tagName=='INPUT' ,true,"'without errorPlacement' groups success");
    });
    
	test("groups:{with 'errorPlacement'}",function(){
		expect(1);		
		var v= $("#testForm1").validate({
				rules:{
					firstname:{required:true},
					lastname:{required:true,minlength:2},
					someting:{required:true}
				},
			 	groups: {
			    	username: "firstname lastname"
			  	},
			  	errorPlacement: function(error, element) {
			    	if (element.attr("name") == "firstname" 
			        	|| element.attr("name") == "lastname" )
			       		error.insertAfter("#lastname");
			     	else
			       		error.insertAfter(element);
			   }		  
		});
	 	$('#firstname').focus().val("o");
	 	$('#lastname').focus().val("o");
	 	$('#submit').click();
	 	equal($('#lastname').next().attr('class')=='error',true,"with errorPlacement groups success"); 		
	});

	test("ignore", function() {
		expect(1);
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true},
				lastname:{required:true},
				someting:{required:true}
			},
			ignore: "[name=lastname]"
		});
		v.form();
		equals( 1, v.size() ,"ignore 'lastname' validate");
	});

	test("invalidHandler",function(){
		expect(1);
		var v = $("#testForm1clean").validate({
			invalidHandler: function() {
				ok( true, "invalid-form event triggered called" );
				start();
			}
		});
		$("#usernamec").val("asdf").rules("add", { required: true, minlength: 5 });
		stop();
		$("#testForm1clean").submit();
	});
	
	test("messages:{custom}",function(){
		expect(1);
		var v = $("#testForm1").validate({
			rules:{
				firstname:{required:true},
				lastname:{required:true,minlength:2},
				someting:{required:true}
			},
			messages:{
				lastname:{minlength:"firstname at last 2"}	
			}
		});
		$('#firstname').focus().val("o");
	 	$('#lastname').focus().val("o");
	 	$('#submit').click();
	 	equal($('#lastname').next().text()=='firstname at last 2',true,"custom message success"); 		
	
	});
	
	asyncTest("onClick:{default true}",function(){		
		expect(1);
			/*onClick test case external function*/
		$.validator.addMethod("isCheck", function(value,element,params) {			   
				return checkCheckBox(value,element,params);
		}, "please select this checkbox!");
	   
		function checkCheckBox (value,element,params){
	    	ok(true,"checkbox click valid success");
	    	start();
	    	if($(element).attr('checked')=='checked'){    		
	    		return true;
	    	}else{    	   
	    		return false;}
	    }; 
		
		var v = $('#checkboxForm').validate({
			rules:{
				checkboxForm1: {isCheck:true}
			}
		});		
		$('#checkboxForm1').attr('checked',true);
		v.form();			
	});	


	test("submitHandler:{keeps submitting button}",function(){
		expect(2);
		$("#userForm").validate({
			debug: true,
			submitHandler: function(form) {
				// dunno how to test this better; this tests the implementation that uses a hidden input
				var hidden = $(form).find("input:hidden")[0];
				equal(hidden.value, button.value)
				equal(hidden.name, button.name)
			}
		});
		$("#username").val("bla");
		var button = $("#userForm :submit")[0]
		$(button).triggerHandler("click");
		$("#userForm").submit();
	});


}(jQuery));