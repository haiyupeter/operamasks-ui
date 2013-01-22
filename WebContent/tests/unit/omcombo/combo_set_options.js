(function( $ ) {

module( "omCombo: set_options");


//1
test( "'autoFilter' 从 true 到 false", function() {
	expect( 1 );
	var element1 = $( '#autoFilter_set' ).omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'}, 
                       {text : '英国', value : 'the United Kingdom/UK'}, 
                       {text : '日本', value : 'Japan/JPN'} ]
	}).next("input");
	$( '#autoFilter_set' ).omCombo({autoFilter : false});
	element1.focus();
	element1.val('中');
	element1.keyup();
	stop();
	setTimeout(function(){
		ok(!element1.hasClass('div .om-helper-hidden'),"没有隐藏项");		
		start();
	},1000);

});

//2
test( "dataSource", function() {
	expect( 1 );
	var element2 = $( '#dataSource_set' ).omCombo({
		dataSource : [ {text : 'China', value : 'China/PRC'}, 
                       {text : 'American', value : 'America/USA'}, 
                       {text : 'England', value : 'the United Kingdom/UK'}, 
                       {text : 'Japnese', value : 'Japan/JPN'} ]
	});
	$( '#dataSource_set' ).omCombo({
	    dataSource : [ {text : 'China', value : 'China/PRC'}, 
                       {text : 'Japnese', value : 'Japan/JPN'} ]
	});
	var actualdata = $('#dataSource_set').data('omCombo').dropList.children('.om-combo-list-row').size();
	equal(actualdata,2);
});


//3
test("disabled",function(){
	expect(1);
	var element = $('#disabled_set').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'}, 
                       {text : '英国', value : 'the United Kingdom/UK'}, 
                       {text : '日本', value : 'Japan/JPN'} ]
	});
	$('#disabled_set').omCombo({disabled : true});
	var realStr = element.next("input").attr('disabled');
	equal(realStr,"disabled");
});

//4
test("{editable : false//第一个测试案例成功则editable为true时测试案例成功}",function(){
	expect(1);
	var element = $('#editable_set').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'}, 
                       {text : '英国', value : 'the United Kingdom/UK'}, 
                       {text : '日本', value : 'Japan/JPN'} ]
	}).next("input");
	$('#editable_set').omCombo({editable : false});
	element.focus();
	element.val('中');
	element.keyup();	
	stop();
	
	setTimeout(function(){
		//var a = $('div:visible .om-helper-hidden').text();
		var a = $('#editable_set').data('omCombo').dropList.children('.om-helper-hidden').size();
		equal(a,0);
		start();
	},1000);
});

//5
test("{emptyText : '请输入值'}",function(){
	expect(1);
	var element = $('#emptyText_set').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'} ]
	});
	$('#emptyText_set').omCombo({emptyText : '请输入值'});
	var realStr = element.next("input").attr('class');
	equal(realStr,"om-empty-text");
});

//6
test("{filterDelay : 1000}",function(){
	expect(2);
	var element = $('#filterDelay_set').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'} ]
	}).next("input");
	$('#filterDelay_set').omCombo({filterDelay : 1000});
	element.focus();
	element.val('中');
	element.keyup();	
	//var a = $('div:visible .om-helper-hidden').text();
	var a = $('#filterDelay_set').data('omCombo').dropList.children('.om-helper-hidden').size();
	equal(a,0);
	
	stop();
	setTimeout(function(){
		//var a = $('div:visible .om-helper-hidden').text();
		var a = $('#filterDelay_set').data('omCombo').dropList.children('.om-helper-hidden').size();
		equal(a,1);
		start();
	},1200);
});


//7
test("{filterStrategy:last}",function(){
	expect(1);
	var element = $('#filterStrategy_set').omCombo({
		dataSource : [ {text : '中国的', value : 'China/PRC'}, 
                       {text : '国中的', value : 'America/USA'},
                       {text : '国的中', value : 'Hehe/USA'}]
	}).next("input");
	$('#filterStrategy_set').omCombo({filterStrategy : 'last'});
	element.focus();
	element.val('中');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#filterStrategy_set').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,'中国的国中的');
		start();
	},500);
});


//8
test("{inputField:默认值text}",function(){
	expect(1);
	var element = $('#inputField_set1').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
                       {text:'010', name:'北京', type:'直辖市'},
                       {text:'021', name:'上海', type:'直辖市'} ]
	}).next("input");
	$('#inputField_set1').omCombo({valueField : 'type'});
	element.focus();
	element.val('01');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#inputField_set1').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,'0755021');
		start();
	},500);
});

//9
test("{inputField:name}",function(){
	expect(1);
	var element = $('#inputField_set2').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
                       {text:'010', name:'北京', type:'直辖市'},
                       {text:'021', name:'上海', type:'直辖市'} ]
	}).next("input");
	$('#inputField_set2').omCombo({ inputField : 'name'});
	element.focus();
	element.val('深圳');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#inputField_set2').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,'010021');
		start();
	},500);
});


//10
test("{listAutoWidth:true}",function(){
	expect(1);
	var element = $('#listAutoWidth_set').omCombo({
	     dataSource : [ {text : '中华人民共和国国歌：起来，不愿做奴隶的人们，把我们的血肉', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'} ]
	}).next("input");
	$('#listAutoWidth_set').omCombo({listAutoWidth:true});
	element.focus();
	stop();
	setTimeout(function(){
		var a1 = $('#listAutoWidth_set').parent().css('width');
		var a2 = $('#listAutoWidth_set').data('omCombo').dropList.css('width');
		ok(!(a1==a2),"下拉框宽度不等于输入框宽度，分别是"+a2+"和"+a1);
		start();
	},500);
});

//11
test("{listMaxHeight:200,下拉框中数据总高度不足200}",function(){
	expect(2);
	var element = $('#listMaxHeight_set').omCombo({
	     dataSource : [ {text : '中国', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'} ]
	});
	$('#listMaxHeight_set').omCombo({ listMaxHeight:200});
	equal($('#listMaxHeight_set').data('omCombo').dropList.css('height'),'43px');
	equal($('#listMaxHeight_set').data('omCombo').dropList.css('overflow-y'),"visible"); //在firebug下是hidden，运行后是visible
});


//12
test("listProvider",function(){
	expect(1);
	var ee = $('#listProvider_set').omCombo({
        dataSource : [ {country : '中国', locale : 'zh_CN', flag : 'china.jpg'}, 
                       {country : '美国', locale : 'en_US', flag : 'usa.jpg'}, 
                       {country : '英国', locale : 'en', flag : 'uk.jpg'}, 
                       {country : '日本', locale : 'ja', flag : 'japan.jpg' } ],
        listAutoWidth : true,
        //将记录的locale属性作为value,如果选择'中国'，然后调用getValue方法将得到'zh_CN'
        valueField : 'locale', 
        inputField : function(data, index) {
            //选择'中国'后输入框的文字显示成'中国(zh_CN)'
            return data.country + '(' + data.locale + ')';
        },
        value : 'zh_CN'
    });
	$('#listProvider_set').omCombo({
	    listProvider : function(container, records) {
            var len = records.length;
            var html = '<table cellpadding="3" cellspacing="0"><thead><tr><th>国旗</th><th>国家</th><th>语言简写</th></tr></thead><tbody>';
            for ( var i = 0; i < len; i++) {
                html += '<tr><td>' + records[i].flag + '</td><td>' + records[i].country 
                        + '</td><td>' + records[i].locale + '</td></tr>';
            }
            html += '</tbody></table>';
            $(html).appendTo(container);
            return container.find('tbody tr');
        }
	});
	var ar = $('#listProvider_set').data('omCombo').dropList.children().eq(0).children().eq(0).text();
	equal(ar,'国旗国家语言简写');
});

//13
test("{optionField:name}",function(){
	expect(1);
	var element = $('#optionField_set').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
	                   {text:'010', name:'北京', type:'直辖市'},
	                   {text:'021', name:'上海', type:'直辖市'} ]
	});
	$('#optionField_set').omCombo({optionField : 'name'});
	equal($('#optionField_set').data('omCombo').dropList.children().eq(0).html(),'深圳');
});


//14
test("{readOnly:true}",function(){
	expect(1);
	var element = $('#readOnly_set').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
	                   {text:'010', name:'北京', type:'直辖市'},
	                   {text:'021', name:'上海', type:'直辖市'} ]
	});
	$('#readOnly_set').omCombo({readOnly : true});
	element.next("input").focus();
	//下面需要确定下来列表框没有弹出来，可通过visible或者display:block确定，不知道如何取得这两个值？
	equal($('#readOnly_set').data('omCombo').dropList.css('display'),'none');
});

//15
test("{value:value}",function(){
	expect(1);
	var element = $('#value_set').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ]
	});
	$('#value_set').omCombo({value : '市'});
	//下面需要确定input框中显示的是否是0755？
	//equal($('#value-test').omCombo('value'),'市');
	equal($('#value_set').next("input").val(),'0755');
});


//测试width的测试案例在取width的值时会将设置的值以px的方式转换，所以需要注意转换算法是否适合所有浏览器和所有分辨率，下面的四个案例只保证在firefox下正常运行
//16
test("{width:100px}",function(){
	expect(1);
	var element = $('#width_set').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ]
	});
	 $('#width_set').omCombo({ width : '100px'});
	var testwidth = $('#width_set').parent().css('width');
	var actualwidth = $('#width_set_equal').css('width');
	equal(testwidth,actualwidth);
});
}(jQuery));