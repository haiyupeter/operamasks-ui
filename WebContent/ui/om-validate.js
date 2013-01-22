/*
 * $Id: om-validate.js,v 1.7 2012/06/04 03:03:11 linxiaomin Exp $
 * operamasks-ui validate @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 */

;(function($) {

/**
 * @class
 * <div>
 * <b>简介</b><br/>
 * validate() 可以方便地对Html Form进行校验. 
 * </div>
 * <div>
 *  <pre>
 * 1、本校验框架提供了丰富的校验规则，满足常用的校验需求。
 *    内置的校验规则有
 <table border="1">
  <tr>
    <td align="center" style="font-weight: bolder;">rule名称</td>
    <td align="center" style="font-weight: bolder;">说明</td>
    <td align="center" style="font-weight: bolder;">默认提示</td>
  </tr>
  <tr>
    <td>required</td>
    <td>值必须输入</td>
    <td>This field is required.</td>
  </tr>
  <tr>
    <td>min</td>
    <td>能输入的最小值</td>
    <td>$.validator.format("Please enter a value greater than or equal to {0}.")</td>
  </tr>
  <tr>
    <td>max</td>
    <td>能输入的最大值</td>
    <td>$.validator.format("Please enter a value less than or equal to {0}."),</td>
  </tr>
  <tr>
    <td>minlength</td>
    <td>必须输入minlength长度的字符</td>
    <td>$.validator.format("Please enter at least {0} characters.")</td>
  </tr>
  <tr>
    <td>maxlength</td>
    <td>最多能输入maxlength长度的字符</td>
    <td>$.validator.format("Please enter no more than {0} characters.")</td>
  </tr>
  <tr>
    <td>email</td>
    <td>邮件格式</td>
    <td>Please enter a valid email address.</td>
  </tr>
  <tr>
    <td>url</td>
    <td>url地址格式</td>
    <td>Please enter a valid URL.</td>
  </tr>
  <tr>
    <td>date</td>
    <td>日期格式</td>
    <td>Please enter a valid date.</td>
  </tr>
  <tr>
    <td>number</td>
    <td>数字格式</td>
    <td>Please enter a valid number.</td>
  </tr>
  <tr>
    <td>rangelength</td>
    <td>输入字符长度在某一个范围，有两个参数传入</td>
    <td>$.validator.format("Please enter a value between {0} and {1} characters long.")</td>
  </tr>
  <tr>
    <td>accept</td>
    <td>可以接受的文件格式</td>
    <td>Please enter a value with a valid extension.</td>
  </tr>
  <tr>
    <td>equalTo</td>
    <td>和已经有的属性做对比（适合重输密码）</td>
    <td>Please enter the same value again.</td>
  </tr>
  <tr>
    <td>range</td>
    <td>输入的数值必须在某一个范围，传入两个参数</td>
    <td>$.validator.format("Please enter a value between {0} and {1}.")</td>
  </tr>
  <tr>
    <td>digits</td>
    <td>必须输入数字</td>
    <td>Please enter only digits.</td>
  </tr>
</table>
 *    
 * 2、提供灵活的校验信息展现风格，你可以让信息展现在校验元素尾部，也可以让它展现在你想要的任何div里面，
 *    对于空间比较吃紧的form表单，也可以采用鼠标移动到提示图标悬浮显示提示信息的方式。这些主要通过配置
 *    errorPlacement(定制错误信息显示)、showErrors(自定义消息处理，onblur/keyup触发，针对当前元素)
 *    只要你够强大，它就有多强大。
 *  
 * 3、提供了灵活的接口用于增加校验规则，当我们提供的校验规则不能满足您的需求的时候，你可以自定义校验
 *    规则，通过$.validator.addMethod("hasreg", function(value,element,params) {return true/false;},"message")的方式实现
 *   </pre>
 * </div>
 * <b>如何使用</b><br/>
 * 1、基本结构
 *    <pre>
 *      $("#reg").validate({
 *         onkeyup : true,
 *         rules : {
 *           password : {
                        required : true,
                        minlength : 5
             }
 *         },
 *         messages : {
 *           password : {
                        required : '密码必须输入',
                        minlength : '密码不能小于5位'
             }
 *         }
 *      });
 *     
 *    上面就是基本的校验结构，reg是需要校验的form的id，password是需要校验的字段的name
 *    (<span style="color:red;">必须配置name，否则将不能校验</span>)rules和messages是成对出现的，如果只配置了rules没有配置messages，
 *    系统将使用默认提示信息。
 * 2、自定义校验规则
 *      $.validator.addMethod("hasreg", function(value) {
 *              return value != 'admin';
 *       }, '此用户已经被注册');
 *       //模拟用户名是否已经被注册，真实的场景应该是使用ajax向后台发送请求，然后后台返回结果，
 *       //需要注意的是必须使用同步请求，异步请求将无效。
 *    
 *    现在就已经有了一个新的rules “hasreg”，它的使用同系统内置的规则一样，在需要校验
 *    的字段里面配置hasreg:true，因为messages已经配置，故可以不写。
 * 3、自定义信息展示
 *    框架默认的是在内容后面增加一个&lt;label for="username" generated="true" class="error"&gt;请输入用
 *    户名&lt;/label&gt;，同时在校验的元素上面增加class="error"属性，如果你想要一些效果，请编写error样式。
 *    如果这种提示方式不是你想要的，或者你不希望它来包装你的提示信息，你需要用到两个方法
 *    errorPlacement、showErrors鉴于这两个方法的复杂性和强自定义性，下面对他们做一个详细的说明。
 *    1)、errorPlacement
 *        错误信息展示，有两个参数error和element，error是生成的错误对象；element为当前元素。
 *        errorPlacement : function(error, element) { 
 *                   if(error){    //error存在的时候
 *                       $('#showMsg').html(error); //showMsg为你自定义的信息显示区域的id。
 *                   }
 *               }
 *     2)、showErrors
 *         它负责处理事件，当错误产生的时候它会将错误信息显示出来，错误消除时它负责将错误信息隐藏
 *         如果自定义了错误展示，而另外一部分还是默认的行为，则请调用this.defaultShowErrors()
 *         以便默认行为生效，它也有两个参数，分别是errorMap和errorList，是所有错误的集合。
 *         showErrors: function(errorMap, errorList) {
 *                   if(errorList && errorList.length > 0){  //如果存在错误信息
 *                       $.each(errorList,function(index,obj){ //遍历错误信息 ，index为错误信息的索引号，
 *                                                             //obj为当前错误信息对象
 *                           var msg = this.message;           //获取当前错误信息文本
 *                           //这里编写一些代码处理你的错误信息
 *                      });
 *                   }else{
 *                       //错误信息已经消除，此处要写隐藏错误信息的代码，
 *                       //通过this.currentElements获取当前对象
 *                   }
 *                   this.defaultShowErrors();  //如果还有默认的行为，请调用它。
 *               }
 * 4、定制提交方式(ajax提交)
 *   如果使用ajax方式提交，那请采用如下两种方式和校验框架结合
 *   1)、使用submitHandler属性配置ajax提交，submithandler：当表单全部校验通过之后会回调配置的代码，此处也就是当校验通过之后
 *      调用ajax提交，详细代码请察看“ajax表单提交校验”示例代码。
 *   2)、使用valid方法，监听form的submit事件，当$('#form').valid()返回true的时候再提交。
 *       //通过监听form的submit事件，对form进行ajax提交。
         $('#formId').submit(function() {
             if (!$("#formId").valid()) 
                 return false;
             $(this).omAjaxSubmit({});
             return false; //此处必须返回false，阻止常规的form提交
         });
 *   
 * </pre>
 * 
 * @name validate
 * @constructor
 * @param options 标准config对象
 */
$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			options && options.debug && window.console && console.warn( "nothing selected, can't validate, returning nothing" );
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}

		validator = new $.validator( options, this[0] );
		$.data(this[0], 'validator', validator);

		if ( validator.settings.onsubmit ) {

			// allow suppresing validation by adding a cancel class to the submit button
			this.find("input, button").filter(".cancel").click(function() {
				validator.cancelSubmit = true;
			});

			// when a submitHandler is used, capture the submitting button
			if (validator.settings.submitHandler) {
				this.find("input, button").filter(":submit").click(function() {
					validator.submitButton = this;
				});
			}

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();

				function handle() {
					if ( validator.settings.submitHandler ) {
						if (validator.submitButton) {
							// insert a hidden input as a replacement for the missing submit button
							var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm );
						if (validator.submitButton) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
        if ( $(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function() {
				valid &= validator.element(this);
            });
            return valid;
        }
    },
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function(command, argument) {
		var element = this[0];

		if (command) {
			var settings = $.data(element.form, 'validator').settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if (argument.messages)
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				break;
			case "remove":
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function(source, params) {
	if ( arguments.length == 1 )
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

$.extend($.validator, {

	defaults: {
	    /**
         * 当所有的输入域为空时用tab或者鼠标切换输入域时是否进行校验。<br/>
         * @name validate#validateOnEmpty
         * @type Boolean
         * @default false
         * @example
         * $(".selector").validate({
         *  rules: {
         *    name: {
         *      required: true
         *    }
         *  },
         *  messages: {
         *    name: {
         *      required: "We need your email address to contact you"
         *    },
         *  },
         *  validateOnEmpty : true
         *})
         */
	    validateOnEmpty : false,
	    /**
	     * 键值对的校验错误信息.键是元素的name属性，值是错误信息的组合对象。<br/>
	     * @name validate#messages
	     * @type JSON
	     * @default 无
	     * @example
	     * $(".selector").validate({
         *  rules: {
         *    name: {
         *      required: true,
         *      minlength: 2
         *    }
         *  },
         *  messages: {
         *    name: {
         *      required: "We need your email address to contact you",
         *      minlength: jQuery.format("At least {0} characters required!")
         *      //这里的{0}就是minlength定义的2
         *    }
         *  }
         *})
	     */
		messages: {},
		/**
		 * 错误消息分组
         * 如果没有设置errorPlacement，则分组内的元素出现错误时仅且在第一个元素后面显示错误消息，
         * 如果设置了errorPlacement，则可以在errorPlacement回调中定义显示位置 <br/>
         * @name validate#groups
         * @type JSON
         * @default 无
         * @example
         * $("#myform").validate({
         *     groups: {
         *       username: "fname lname"
         *     },
         *     errorPlacement: function(error, element) {
         *        if (element.attr("name") == "fname" 
         *                    || element.attr("name") == "lname" ){
         *          error.insertAfter("#lastname");
         *        }else{
         *          error.insertAfter(element);
         *        }
         *      },
         *    }) //将fname和lname的错误信息统一显示在lastname元素后面
         */
		groups: {},
		
		/**
         * 键值对的校验规则.键是元素的name属性，值是校验规则的组合对象，每一个规则都可以绑定一个依赖对象，<br/>
         * 通过depends设定，只有依赖对象成立才会执行验证<br/>
         * @name validate#rules
         * @type JSON
         * @default 无
         * @example
         * $(".selector").validate({
         *  rules: {
         *    contact: {
         *      required: true,
         *      email: { 
         *        depends: function(element) {
         *          return $("#contactform_email:checked")
         *          //email校验的前提是contactform_email被选中
         *        }
         *      }
         *    }
         *  }
         *})
         */
		rules: {},
		
		/**
         * 指定校验错误显示标签的class名称，此class也将添加在校验的元素上面。<br/>
         * @name validate#errorClass
         * @type String
         * @default 'error'
         * @example
         * $(".selector").validate({
         *      errorClass: "invalid"
         *   })
         */
		errorClass: 'error',
		
		/**
         * 指定校验成功没有任何错误后加到元素的class名称<br/>
         * @name validate#validClass
         * @type String
         * @default 'valid'
         * @example
         * $(".selector").validate({
         *      validClass: "success"
         *   })
         */
		validClass: 'valid',
		
		/**
		 * 指定校验成功没有任何错误后加到提示元素上面的样式名称<br/>
		 * 和validClass的区别是它只加在提示元素上面，而不对校验的对象做任何变动。
		 * @name validate#success
		 * @type String
		 * @default 无
		 * @example
		 * $(".selector").validate({
		 *      success: "valid"
		 *   })
		 */
		
		/**
         * 指定显示校验错误信息的html标签名称<br/>
         * @name validate#errorElement
         * @type String
         * @default 'label'
         * @example
         * $(".selector").validate({
         *      errorElement: "em"
         *   })
         */
		errorElement: 'label',
		
		/**
         * 校验错误的时候是否将聚焦元素。<br/>
         * @name validate#focusInvalid
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      focusInvalid: false
         *   })
         */
		focusInvalid: true,
		
		/**
         * 获得焦点的时候是否清除错误提示，这种清除是针对所有元素的，<br/>
         * 如果设置为true，则必须将focusInvalid设置为false，否则将没有校验效果。
         * @name validate#focusCleanup
         * @type Boolean
         * @default false
         * @example
         * $(".selector").validate({
         *      focusInvalid: false, //必须设置
         *      focusCleanup: true
         *   })
         */
		focusCleanup: false,
		
		/**
         * 包含错误信息的容器，根据校验结果隐藏或者显示错误容器。<br />
         * 与 errorLabelContainer 属性的区别是这个属性一般包括后者。
         * @name validate#errorContainer
         * @type Object
         * @default $( [] )
         * @example
         * $("#myform").validate({
         *      errorContainer: "#messageBox1, #messageBox2", 
         *      //可以配置多个容器，这里的messageBox2元素没有被包装处理，只是错误发生的时候显示和隐藏此元素
         *      errorLabelContainer: "#messageBox1 ul",
         *      wrapper: "li",
         *   })
         */
		errorContainer: $( [] ),
		
		/**
         * 显示错误信息的容器，根据校验结果隐藏或者显示错误容器。
         * @name validate#errorLabelContainer
         * @type Object
         * @default $( [] )
         * @example
         * $("#myform").validate({
         *      errorLabelContainer: "#messageBox",
         *      wrapper: "li",
         *   })
         *   //messageBox为容器的id
         */
		errorLabelContainer: $( [] ),
		
		/**
         * 是否在提交时校验表单，如果设置为false，则提交的时候不校验表单，<br/>
         * 但是其它keyup、onblur等事件校验不受影响.
         * @name validate#onsubmit
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onsubmit: false
         *   })
         */
		onsubmit: true,
		
		/**
         * 校验时忽略指定的元素，可以配置需要校验的元素id和样式名称等jquery识别的选择器。
         * @name validate#ignore
         * @type String
         * @default 无
         * @example
         * $("#myform").validate({
         *      ignore: ".ignore" 
         *      //此处还可以配置input[type='password']、#id等jquery的选择器
         *   })
         */
		ignore: [],
		ignoreTitle: false,
		
		onfocusin: function(element) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		
		/**
         * 在blur事件发生时是否进行校验，如果没有输入任何值，则将忽略校验。
         * @name validate#onfocusout
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onfocusout: false
         *   })
         */
		onfocusout: function(element) {
		    if (this.settings.validateOnEmpty) {
		        if ( !this.checkable(element) || (element.name in this.submitted) ) {
                    this.element(element);
                }
		    } else {
		        if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
                    this.element(element);
                }
		    }
		},
		
		/**
         * 在keyup事件发生时是否进行校验。
         * @name validate#onkeyup
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onkeyup: false
         *   })
         */
		onkeyup: function(element) {
			if ( element.name in this.submitted || element == this.lastElement ) {
				this.element(element);
			}
		},
		
		/**
         * 在checkbox和radio的click事件发生后是否进行校验。
         * @name validate#onclick
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onclick: false
         *   })
         */
		onclick: function(element) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted )
				this.element(element);
			// or option elements, check parent select in that case
			else if (element.parentNode.name in this.submitted)
				this.element(element.parentNode);
		},
		highlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
		
		/**
         * 定制错误信息显示的回调方法。该方法有两个参数，第一个参数是错误信息的元素，第二个是触发校验错误的源元素。
         * @name validate#errorPlacement
         * @type Function
         * @default 无
         * @example
         * $("#myform").validate({
         *     errorPlacement: function(error, element) {
         *        error.appendTo( element.parent("td").next("td") );
         *      }
         *    })
         */
		
		/**
         * 它负责处理事件，当错误产生的时候它会将错误信息显示出来，错误消除时它负责将错误信息隐藏
         * 如果自定义了错误展示，而另外一部分还是默认的行为，则请调用this.defaultShowErrors()
         * 以便默认行为生效，它也有两个参数，分别是errorMap和errorList，是所有错误的集合。
         * @name validate#showErrors
         * @type Function
         * @default 无
         * @example
         * $("#myform").validate({
         * showErrors: function(errorMap, errorList) {
         *                   if(errorList && errorList.length > 0){  //如果存在错误信息
         *                       $.each(errorList,function(index,obj){ //遍历错误信息 ，index为错误信息的索引号，
         *                                                             //obj为当前错误信息对象
         *                           var msg = this.message;           //获取当前错误信息文本
         *                           //这里编写一些代码处理你的错误信息
         *                      });
         *                   }else{
         *                       //错误信息已经消除，此处要写隐藏错误信息的代码，
         *                       //通过this.currentElements获取当前对象
         *                   }
         *                   this.defaultShowErrors();  //如果还有默认的行为，请调用它。
         *               }
         *  })
         */

		/**
         * 定制校验通过后表单提交前的回调方法，用来替换默认提交，一般是Ajax提交方式需要使用到。
         * @type Function
         * @name validate#submitHandler
         * @default 无
         * @param form 当前表单对象
         * @example
         * $(".selector").validate({
         *      submitHandler: function(form) {
         *       $(form).ajaxSubmit(); //校验通过之后调用ajaxSubmit提交表单
         *      }
         *   })
         */
         
         /**
         * 定制表单提交但校验不通过的回调方法。
         * @type Function
         * @name validate#invalidHandler
         * @default 无
         * @param form 当前表单对象
         * @param validator 当前校验器对象
         * @example
         * $(".selector").validate({
         *   invalidHandler: function(form, validator) {
         *     var errors = validator.numberOfInvalids();
         *     if (errors) {
         *       var message = errors == 1
         *         ? 'You missed 1 field. It has been highlighted'
         *         : 'You missed ' + errors + ' fields. They have been highlighted';
         *       $("div.error span").html(message);
         *       $("div.error").show();
         *     } else {
         *       $("div.error").hide();
         *     }
         *   }
         *})
         */   
		
		/**
         * 校验选中的表单
         * @name validate#validate
         * @function
         * @returns 当前form的校验对象
         * @example
         *   $("#myform").validate({
         *      //options
         *   });
         */
		
		/**
         * 检查表单是否通过校验
         * @name validate#valid
         * @function
         * @returns Boolean
         * @example
         *   $("#myform").validate();
         *   $("a.check").click(function() {
         *     alert("Valid: " + $("#myform").valid());
         *     return false;
         *   });
         */
		
		/**
         * 针对选中的元素，动态添加删除校验规则的方法，有rules( "add", rules ) 和rules( "remove", [rules] )两种
         * @name validate#rules
         * @function
         * @returns rules Object{Options}
         * @example
         *  $('#username').rules('add',{
         *       minlength:5,
         *       messages: {
         *           minlength: jQuery.format("Please, at least {0} characters are necessary")
         *       }
         *   });
         *   
         * $("#myinput").rules("remove", "min max"); //remove可以配置多个rule，空格隔开
         */
		
		/**
         * 触发表单校验
         * @name validate#form
         * @function
         * @returns Boolean
         * @example
         *  $("#myform").validate().form()
         */
		
		/**
         * 校验选中的element
         * @name validate#element
         * @param element
         * @function
         * @returns Boolean
         * @example
         *  $("#myform").validate().element( "#myselect" );
         */
		
		/**
         * 重置表单，调用此方法将去掉所有提示信息
         * @name validate#resetForm
         * @function
         * @returns 无
         * @example
         *  var validator = $("#myform").validate();
         *  validator.resetForm();
         */
		
		/**
		 *  添加并显示提示信息
		 * @name validate#showErrors
		 * @function
		 * @param Object
		 * @returns 无
		 * @example
		 * var validator = $("#myform").validate();
         * validator.showErrors({"firstname": "I know that your firstname is Pete, Pete!"});
		 */
		
		/**
		 *  统计没有通过校验的元素个数
		 * @name validate#numberOfInvalids
		 * @function
		 * @returns Integer
		 * @example
		 * var validator = $("#myform").validate();
		 * return validator.numberOfInvalids();
		 */
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function(key, value) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				validator.settings[eventType] && validator.settings[eventType].call(validator, this[0] );
			}
			$(this.currentForm)
				.validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate)
				.validateDelegate(":radio, :checkbox, select, option", "click", delegate);

			if (this.settings.invalidHandler)
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if (!this.valid())
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.clean( element );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element );
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			this.settings.showErrors
				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
				: this.defaultShowErrors();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm )
				$( this.currentForm ).resetForm();
			this.submitted = {};
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj )
				count++;
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() == 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name == lastActive.name;
			}).length == 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				!this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) )
					return false;

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[0];
		},

		errors: function() {
			return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		check: function( element ) {
			element = this.clean( element );

			// if radio/checkbox, validate first element in group instead
			if (this.checkable(element)) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}

			var rules = $(element).rules();
			var dependencyMismatch = false;
			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {
					var result = $.validator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result == "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result == "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method", e);
					throw e;
				}
			}
			if (dependencyMismatch)
				return;
			if ( this.objectLength(rules) )
				this.successList.push(element);
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata)
				return;

			var meta = this.settings.meta
				? $(element).metadata()[this.settings.meta]
				: $(element).metadata();

			return meta && meta.messages && meta.messages[method];
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor == String
				? m
				: m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined)
					return arguments[i];
			}
			return undefined;
		},

		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message == "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		/**
         * 显示错误信息的外层标签名称.
         * @name validate#wrapper
         * @type String
         * @default 无
         * @example
         * $(".selector").validate({
         *      wrapper: "li"
         *   })
         */
		addWrapper: function(toToggle) {
			if ( this.settings.wrapper )
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			return toToggle;
		},

		defaultShowErrors: function() {
			for ( var i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( var i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass().addClass( this.settings.errorClass );

				// check if we have a generated label, replace the message then
				label.attr("generated") && label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length )
					this.settings.errorPlacement
						? this.settings.errorPlacement(label, $(element) )
						: label.insertAfter(element);
			}
			if ( !message && this.settings.success ) {
				label.text("");
				typeof this.settings.success == "string"
					? label.addClass( this.settings.success )
					: this.settings.success( label );
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function(element) {
			var name = this.idOrName(element);
    		return this.errors().filter(function() {
				return $(this).attr('for') == name;
			});
		},

		idOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		checkable: function( element ) {
			return /radio|checkbox/i.test(element.type);
		},

		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return $(document.getElementsByName(name)).map(function(index, element) {
				return element.form == form && element.name == name && element  || null;
			});
		},

		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) )
					return this.findByName(element.name).filter(':checked').length;
			}
			return value.length;
		},

		depend: function(param, element) {
			return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
		},

		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},

		optional: function(element) {
			return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
		},

		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function(element, valid) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0)
				this.pendingRequest = 0;
			delete this.pending[element.name];
			if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		number: {number: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function(className, rules) {
		className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
	},

	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		classes && $.each(classes.split(' '), function() {
			if (this in $.validator.classRuleSettings) {
				$.extend(rules, $.validator.classRuleSettings[this]);
			}
		});
		return rules;
	},

	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);

		for (var method in $.validator.methods) {
			var value = $element.attr(method);
			if (value) {
				rules[method] = value;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}

		return rules;
	},

	metadataRules: function(element) {
		if (!$.metadata) return {};

		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},

	staticRules: function(element) {
		var rules = {};
		var validator = $.data(element.form, 'validator');
		if (validator.settings.rules) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});

		if ($.validator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages;
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data == "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
		if (method.length < 3) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) )
				return "dependency-mismatch";
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			case 'input':
				if ( this.checkable(element) )
					return this.getLength(value, element) > 0;
			default:
				return $.trim(value).length > 0;
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) )
				return "dependency-mismatch";

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] )
				this.settings.messages[element.name] = {};
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param == "string" && {url:param} || param;

			if ( this.pending[element.name] ) {
				return "pending";
			}
			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function(response) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true;
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(Date.parse(value.replace(/-/g, '/'))));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
				$(element).valid();
			});
			return value == target.val();
		}
	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

})(jQuery);

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
;(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function(settings, _, xhr) {
			var port = settings.port;
			if (settings.mode == "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function(settings) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if (mode == "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
})(jQuery);

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
;(function($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function( original, fix ){
			$.event.special[fix] = {
				setup:function() {
					this.addEventListener( original, handler, true );
				},
				teardown:function() {
					this.removeEventListener( original, handler, true );
				},
				handler: function(e) {
					arguments[0] = $.event.fix(e);
					arguments[0].type = fix;
					return $.event.handle.apply(this, arguments);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	};
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
})(jQuery);
