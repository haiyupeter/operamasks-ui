( function($) {
	module("omCalendar: methods");
	
	test("disable()和enable()", function() {
		expect(6);
		var element, dropListVisibility;
		element = $('.disableEnable input:eq(0)').omCalendar({});
		element.next().click();
		//点击trigger
		dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		positionTop = $.data(element[0], "omCalendar").con.css('top');
		positionLeft = $.data(element[0], "omCalendar").con.css('left');
		equal(dropListVisibility=='visible' ||dropListVisibility=='inherit' , true, '默认情况下点击trigger应该可以显示出下拉框');
		
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).click();
		element.omCalendar('disable');
		element.next().click();
		//点击trigger
		dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		var position = $.data(element[0], "omCalendar").con.css('top');
		equal(dropListVisibility, 'hidden', '禁用后点击trigger应该无法显示出下拉框');
		
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).click();
		element.omCalendar('enable');
		element.next().click();
		//点击trigger
		dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility=='visible' ||dropListVisibility=='inherit' , true, '禁用后再启用点击trigger应该可以显示出下拉框');
		
		element = $('.disableEnable input:eq(1)').omCalendar({
			disabled : true
		});
		element.next().click();
		//点击trigger
		dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility, 'hidden', '设置了disabled=true后默认情况下点击trigger应该无法显示出下拉框');
		
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).click();
		element.omCalendar('enable');
		element.next().click();
		//点击trigger
		dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility=='visible' ||dropListVisibility=='inherit' , true, '启用后点击trigger应该无法显示出下拉框');
		
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).click();
		element.omCalendar('disable');
		element.next().click();
		//点击trigger
		dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility, 'hidden', '启用后再禁用点击trigger应该无法显示出下拉框');
	});
	
	test("setDate()和getDate()", function() {
		expect(3);
		var element = $('.getDateSetDate input').omCalendar({});
		var date = $.omCalendar.formatDate(element.omCalendar('getDate'), 'yy-mm-dd');
		var aimDate = $.omCalendar.formatDate(new Date(), 'yy-mm-dd');
		equal(aimDate, date, '不设置date属性时getDate()应该返回当前日期');

		element.omCalendar('setDate', new Date(2010, 7, 15));
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择那个默认日期
		date = $.omCalendar.formatDate(element.omCalendar('getDate'), 'yy-mm-dd');
		aimDate = '2010-08-15';
		equal(element.val(), aimDate, 'setDate后再选择当前日期时输入框的值应该与setDate的参数一样');
		equal(date, aimDate, 'setDate后再getDate返回的值应该与setDate的参数一样');
	});
}(jQuery));
