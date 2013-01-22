( function($) {
	module("omCalendar: set_options");
	
	test("date", function() {
		expect(2);
		var element = $('.date input:eq(0)').omCalendar({date : new Date(2011, 8, 15)});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择那个默认日期
		var value = element.val();
		var defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd');
		equal(value, '2011-09-15', '设置日期');
		element.val("");
		element = $('.date input:eq(0)').omCalendar({
			date : new Date(2010, 7, 15)
		});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择那个默认日期
		value = element.val();
		equal(value, '2010-08-15', '通过option改变date值');
	});
	
	test("dateFormat", function() {
		expect(2);
		var element = $('.dateFormat input:eq(0)').omCalendar({});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		var value = element.val();
		var defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd');
		equal(value, defaultValue, '日期时间时默认格式是yy-mm-dd');
		element.val("");
		element = $('.dateFormat input:eq(0)').omCalendar({
			dateFormat : 'yy/mm/dd'
		});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择那个默认日期
		value = element.val();
		defaultValue = $.omCalendar.formatDate(new Date(), 'yy/mm/dd');
		equal(value, defaultValue, '通过option改变dateFormat属性后格式是yy/mm/dd');
	});
	
	test("disabled", function() {
		expect(2);
		var element = $('.disabled input:eq(0)').omCalendar({});
		element.next().click();
		var dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility=='visible' ||dropListVisibility=='inherit' , true,'默认disabled属性为false');
		element = $('.disabled input:eq(0)').omCalendar({
			disabled : true
		});
		element.next().click();
		var dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility, 'hidden', '通过option改变disabled属性');
	});
	
	test("disabledDays", function() {
		var element = $('.disabledDays input:eq(0)').omCalendar({});
		$('div.om-dbd>a:eq(6)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里第一行第7个日期（星期6）
		notStrictEqual(element.val(), '', '默认disabledDays属性为空');
		element.val("");
		element = $('.disabledDays input:eq(0)').omCalendar({
			disabledDays : [6]
		});
		$('div.om-dbd>a:eq(6)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里第一行第7个日期（星期6）
		strictEqual(element.val(), '', '通过option改变disabledDays属性');
	});
	test("disabledFn", function() {
		var element = $('.disabledFn input:eq(0)').omCalendar({
			disabledFn : function(date) {
				if(date.getDate() === 3) {
					return false;
				}
			}
		});
		element = $('.disabledFn input:eq(0)').omCalendar({
			disabledFn : function(date) {
				if(date.getDate() === 1) {
					return false;
				}
			}
		});
		$('div.om-dbd > a:contains("1"):eq(0)', $.data(element[0], "omCalendar").con).click();
		//点击下拉框里1号
		equal(element.val(), '', '通过option设置disabledFn');
	});
	test("maxDate", function() {
		var d = new Date();
		d.setDate(4);
		var element = $('.maxDate input:eq(0)').omCalendar({
			maxDate: d
		});
		d.setDate(2);
		element = $('.maxDate input:eq(0)').omCalendar({
			maxDate : d
		});
		//最大日期是本月2号
		$('div.om-dbd > a:contains("3"):eq(0)', $.data(element[0], "omCalendar").con).click();
		strictEqual(element.val(), '', '通过option设置maxDate');
	});
	test("minDate", function() {
		var d = new Date();
		d.setDate(2);
		var element = $('.minDate input:eq(0)').omCalendar({});

		d.setDate(6);
		element = $('.minDate input:eq(0)').omCalendar({
			minDate : d
		});
		//最大日期是本月2号
		$('div.om-dbd > a:contains("5"):eq(0)', $.data(element[0], "omCalendar").con).click();
		//点击下拉框里本月1号
		strictEqual(element.val(), '', '通过option设置minDate');
	});
	test("pages", function() {
		var element = $('.pages input').omCalendar({
			pages : 2
		});
		equal($.data(element[0], "omCalendar").con.children().size(), 2, '下拉框里应该一次显示3个月');
		element = $('.pages input').omCalendar({
			pages : 3
		});
		equal($.data(element[0], "omCalendar").con.children().size(), 3, '下拉框里应该一次显示3个月');
	});
	test("popup", function() {
		var element = $('.popup div').omCalendar({});
		ok($.data(element[0], "omCalendar").con !== undefined, 'popup=false时可以把日历控件渲染在非input容器上');
	});
	test("readOnly", function() {
		var element = $('.readOnly input:eq(0)').omCalendar({});
		strictEqual(element.prop('readOnly'), false, '默认情况下readOnly为false');
		element = $('.readOnly input:eq(0)').omCalendar({
			readOnly : true
		});
		strictEqual(element.prop('readOnly'), true, '设置readOnly为true时应该是只读');
		element = $('.readOnly input:eq(0)').omCalendar({
			readOnly : false
		});
		strictEqual(element.prop('readOnly'), false, '设置readOnly为false时应该不是只读');
	});
	test("showTime", function() {
		var element = $('.showTime input:eq(0)').omCalendar({});
		var hasTimeInput = $('button.ct-ok', $.data(element[0], "omCalendar").con).size() > 0;
		strictEqual(hasTimeInput, false, '默认下拉框里不应该显示出选择时间的输入框');
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择默认日期
		var defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd');
		equal(element.val(), defaultValue, '选择当前日期后输入框里不应该显示出时间');
		element.val("");
		element = $('.showTime input:eq(0)').omCalendar({
			showTime : true
		});
		hasTimeInput = $('button.ct-ok', $.data(element[0], "omCalendar").con).size() > 0;
		strictEqual(hasTimeInput, true, 'showTime=true后下拉框里应该显示出选择时间的输入框');
		defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd H:i:s');
		$('button.ct-ok', $.data(element[0], "omCalendar").con).click();
		timeAlmostEquals(element.val(), defaultValue, 'showTime=true后选择当前日期后输入框里应该显示出时间');
		element.val("");
		element = $('.showTime input:eq(0)').omCalendar({
			showTime : false
		});
		hasTimeInput = $('button.ct-ok', $.data(element[0], "omCalendar").con).size() > 0;
		strictEqual(hasTimeInput, false, 'showTime=false后下拉框里应该显示出选择时间的输入框');
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择默认日期
		defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd');
		equal(element.val(), defaultValue, 'showTime=false后选择当前日期后输入框里不应该显示出时间');
	});
	test("startDay", function() {
		var element = $('.startDay input:eq(0)').omCalendar({
			startDay : 1
		});
		var startDay = $('.om-whd > span:eq(0)', $.data(element[0], "omCalendar").con).html();
		equal(startDay, '一', '下拉框里第一天设置为周一');
		element = $('.startDay input:eq(0)').omCalendar({
			startDay : 4
		});
		startDay = $('.om-whd > span:eq(0)', $.data(element[0], "omCalendar").con).html();
		equal(startDay, '四', 'startDay=4后下拉框里第一天应该是周四');
	});
}(jQuery));
