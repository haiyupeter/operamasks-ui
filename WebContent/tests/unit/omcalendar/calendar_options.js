/*
 * 比较时间，在10秒误差以内都可以看做是相同的时间
 */
function timeAlmostEquals(date1, date2, message, formatter){
    if (date1 == date2)
        return equals(date1, date2, message);
    var f = formatter || 'yy-mm-dd H:i:s',
        d1 = $.omCalendar.parseDate(date1, f),
        d2 = $.omCalendar.parseDate(date2, f);
    if (d1 && d2 && d1 - d2 < 10000 && d1 - d2 > -10000) {
        return equals(date1, date1, message);
    }
    return equals(date1, date2, message);
}

( function($) {
	module("omCalendar: options");
	
	test("date", function() {
		expect(2);
		var element = $('.date input:eq(0)').omCalendar({});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择那个默认日期
		var value = element.val();
		var defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd');
		equal(value, defaultValue, '不设置date属性时应该默认是当前日期');
		element = $('.date input:eq(1)').omCalendar({
			date : new Date(2010, 7, 15)
		});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择那个默认日期
		value = element.val();
		equal(value, '2010-08-15', '设置date属性后应该默认是设置的日期');
	});
	
	test("dateFormat", function() {
		expect(3);
		var element = $('.dateFormat input:eq(0)').omCalendar({});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		var value = element.val();
		var defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd');
		equal(value, defaultValue, '不设置dateFormat且不显示时间时应该默认格式是yy-mm-dd');
		element = $('.dateFormat input:eq(1)').omCalendar({
			showTime : true
		});
		defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd H:i:s');
		$('button.ct-ok', $.data(element[0], "omCalendar").con).click();
        value = element.val();
        timeAlmostEquals(value, defaultValue, '不设置dateFormat且显示时间时应该默认格式是yy-mm-dd H:i:s');
		element = $('.dateFormat input:eq(2)').omCalendar({
			dateFormat : 'yy/mm/dd'
		});
		$('.om-state-nobd', $.data(element[0], "omCalendar").con).mousedown();
		//选择那个默认日期
		value = element.val();
		defaultValue = $.omCalendar.formatDate(new Date(), 'yy/mm/dd');
		equal(value, defaultValue, '设置dateFormat属性后应该默认格式是yy/mm/dd');
	});
	
	test("disabled", function() {
		expect(2);
		var element = $('.disabled input:eq(0)').omCalendar({});
		element.next().click();
		var dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility=='visible' ||dropListVisibility=='inherit' , true,'不设置disabled时点击trigger应该可以显示出下拉框');
		element = $('.disabled input:eq(1)').omCalendar({
			disabled : true
		});
		element.next().mousedown();
		var dropListVisibility = $.data(element[0], "omCalendar").con.css('visibility');
		equal(dropListVisibility, 'hidden', '设置disabled=true时点击trigger应该不可以显示出下拉框');
	});
	
	test("disabledDays", function() {
		var element = $('.disabledDays input:eq(0)').omCalendar({});
		$('div.om-dbd>a:eq(6)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里第一行第7个日期（星期6）
		notStrictEqual(element.val(), '', '不设置disabledDays时应该可以选择第一个星期六');
		element = $('.disabledDays input:eq(1)').omCalendar({
			disabledDays : [6]
		});
		$('div.om-dbd>a:eq(6)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里第一行第7个日期（星期6）
		strictEqual(element.val(), '', '设置disabledDays=[6]后应该不可以选择第一个星期六');
	});
	test("disabledFn", function() {
		var element = $('.disabledFn input:eq(0)').omCalendar({});
		$('div.om-dbd > a:contains("1"):eq(0)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里1号
		equal(element.val(), $.omCalendar.formatDate(new Date(), 'yy-mm-') + '01', '不设置disabledFn时应该可以选择本月1号');
		element = $('.disabledFn input:eq(1)').omCalendar({
			disabledFn : function(date) {
				if(date.getDate() === 1) {
					return false;
				}
			}
		});
		$('div.om-dbd > a:contains("1"):eq(0)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里1号
		equal(element.val(), '', '设置disabledFn后应该不可以选择本月1号');
	});
	test("maxDate", function() {
		var element = $('.maxDate input:eq(0)').omCalendar({});
		$('div.om-dbd > a:contains("3"):eq(0)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里本月3号
		notStrictEqual(element.val(), '', '不设置maxDate时应该可以选择本月3号');

		var d = new Date();
		d.setDate(2);
		element = $('.maxDate input:eq(1)').omCalendar({
			maxDate : d
		});
		//最大日期是本月2号
		$('div.om-dbd > a:contains("3"):eq(0)', $.data(element[0], "omCalendar").con).mousedown();
		strictEqual(element.val(), '', '设置maxDate为本月2号后应该不可以选择本月3号');
	});
	test("minDate", function() {
		var element = $('.minDate input:eq(0)').omCalendar({});
		$('div.om-dbd > a:contains("1"):eq(0)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里本月1号
		notStrictEqual(element.val(), '', '不设置minDate时应该可以选择本月1号');

		var d = new Date();
		d.setDate(2);
		element = $('.minDate input:eq(1)').omCalendar({
			minDate : d
		});
		//最大日期是本月2号
		$('div.om-dbd > a:contains("1"):eq(0)', $.data(element[0], "omCalendar").con).mousedown();
		//点击下拉框里本月1号
		strictEqual(element.val(), '', '设置minDate为本月2号后应该不可以选择本月1号');
	});
	test("pages", function() {
		var element = $('.maxDate input').omCalendar({
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
		element = $('.readOnly input:eq(1)').omCalendar({
			readOnly : true
		});
		strictEqual(element.prop('readOnly'), true, '设置readOnly为true时应该是只读');
		element = $('.readOnly input:eq(2)').omCalendar({
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
		element = $('.showTime input:eq(1)').omCalendar({
			showTime : true
		});
		hasTimeInput = $('button.ct-ok', $.data(element[0], "omCalendar").con).size() > 0;
		strictEqual(hasTimeInput, true, 'showTime=true后下拉框里应该显示出选择时间的输入框');
		$('button.ct-ok', $.data(element[0], "omCalendar").con).click();
		defaultValue = $.omCalendar.formatDate(new Date(), 'yy-mm-dd H:i:s');
		timeAlmostEquals(element.val(), defaultValue, 'showTime=true后选择当前日期后输入框里应该显示出时间');
		element = $('.showTime input:eq(2)').omCalendar({
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
		var element = $('.startDay input:eq(0)').omCalendar({});
		var startDay = $('.om-whd > span:eq(0)', $.data(element[0], "omCalendar").con).html();
		equal(startDay, '日', '默认情况下下拉框里第一天应该是周日');
		element = $('.startDay input:eq(1)').omCalendar({
			startDay : 4
		});
		startDay = $('.om-whd > span:eq(0)', $.data(element[0], "omCalendar").con).html();
		equal(startDay, '四', 'startDay=4后下拉框里第一天应该是周四');
	});
}(jQuery));
