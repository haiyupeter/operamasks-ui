(function( $ ) {

module( "omCombo: options");

//1
test( "{ autoFilter: true }", function() {
	expect( 1 );
	var element = $( '#autoFilter_true' ).omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'}, 
                       {text : '英国', value : 'the United Kingdom/UK'}, 
                       {text : '日本', value : 'Japan/JPN'} ]
	}).next("input");
	element.focus();
	element.val('中');
	element.keyup();	
	stop();
	setTimeout(function(){
		var actualdata = $('#autoFilter_true').data('omCombo').dropList.children('.om-helper-hidden').size();
		equal(actualdata,3);
		start();
	},1000); 
});

//2
test( "{ autoFilter: false }", function() {
	expect( 1 );
	var element1 = $( '#autoFilter_false' ).omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'}, 
                       {text : '英国', value : 'the United Kingdom/UK'}, 
                       {text : '日本', value : 'Japan/JPN'} ],
        autoFilter : false
	}).next("input");
	element1.focus();
	element1.val('中');
	element1.keyup();
	stop();
	setTimeout(function(){
		ok(!element1.hasClass('div .om-helper-hidden'),"没有隐藏项");		
		start();
	},1000);

});

//3
test( "{ dataSource: JSON数据;lazyLoad:false }", function() {
	expect( 1 );
	var element2 = $( '#dataSource_JSON' ).omCombo({
		dataSource : [ {text : 'China', value : 'China/PRC'}, 
                       {text : 'American', value : 'America/USA'}, 
                       {text : 'England', value : 'the United Kingdom/UK'}, 
                       {text : 'Japnese', value : 'Japan/JPN'} ]
	});
	var actualdata = $('#dataSource_JSON').data('omCombo').dropList.children('.om-combo-list-row').size();
	equal(actualdata,4);
});

//4
test( "{ dataSource: url }", function() {
	expect( 1 );
	var element3 = $( '#dataSource_URL' ).omCombo({
		dataSource : '../../../omCombo.json'
	}).next("input");
	
	stop();
	setTimeout(function(){
		element3.focus();
		var a = $('#dataSource_URL').data('omCombo').dropList.children().text();
		equal(a,"张三李四王五赵六");
		start();
	},4000);
});

//5
test("{disabled:true}",function(){
	expect(1);
	var element = $('#disabled_test').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'}, 
                       {text : '英国', value : 'the United Kingdom/UK'}, 
                       {text : '日本', value : 'Japan/JPN'} ],
        disabled : true
	});
	var realStr = element.next("input").attr('disabled');
	//var rr = $('#disabled_test').prop('disabled'); equal(rr,'true');
	equal(realStr,"disabled");
});

//6
test("{editable : false//第一个测试案例成功则editable为true时测试案例成功}",function(){
	expect(1);
	var element = $('#editable_test').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'}, 
                       {text : '英国', value : 'the United Kingdom/UK'}, 
                       {text : '日本', value : 'Japan/JPN'} ],
        editable : false
	}).next("input");
	element.focus();
	element.val('中');
	element.keyup();	
	stop();
	
	setTimeout(function(){
		//var a = $('div:visible .om-helper-hidden').text();
		var a = $('#editable_test').data('omCombo').dropList.children('.om-helper-hidden').size();
		equal(a,0);
		start();
	},1000);
});

//7
test("{emptyText : '请输入值'}",function(){
	expect(1);
	var element = $('#emptyText_test').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'} ],
        emptyText : '请输入值'
	}).next("input");
	var realStr = element.attr('class');
	equal(realStr,"om-empty-text");
});

//8
test("{filterDelay : 1000}",function(){
	expect(2);
	var element = $('#filterDelay_test').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'} ],
        filterDelay : 1000
	}).next("input");
	element.focus();
	element.val('中');
	element.keyup();	
	//var a = $('div:visible .om-helper-hidden').text();
	var a = $('#filterDelay_test').data('omCombo').dropList.children('.om-helper-hidden').size();
	equal(a,0);
	
	stop();
	setTimeout(function(){
		//var a = $('div:visible .om-helper-hidden').text();
		var a = $('#filterDelay_test').data('omCombo').dropList.children('.om-helper-hidden').size();
		equal(a,1);
		start();
	},1200);
});

//9
test("{filterStrategy:first}",function(){
	expect(1);
	var element = $('#filterStrategy_test1').omCombo({
		dataSource : [ {text : '中国的', value : 'China/PRC'}, 
                       {text : '国中的', value : 'America/USA'},
                       {text : '国的中', value : 'Hehe/USA'}]
	//filterStrategy默认为first
	}).next("input");
	element.focus();
	element.val('中');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#filterStrategy_test1').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,'国中的国的中');
		start();
	},500);
	
});

//10
test("{filterStrategy:last}",function(){
	expect(1);
	var element = $('#filterStrategy_test2').omCombo({
		dataSource : [ {text : '中国的', value : 'China/PRC'}, 
                       {text : '国中的', value : 'America/USA'},
                       {text : '国的中', value : 'Hehe/USA'}],
	filterStrategy : 'last'
	}).next("input");
	element.focus();
	element.val('中');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#filterStrategy_test2').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,'中国的国中的');
		start();
	},500);
});

//11
test("{filterStrategy:anywhere}",function(){
	expect(1);
	var element = $('#filterStrategy_test3').omCombo({
		dataSource : [ {text : '中国的', value : 'China/PRC'}, 
                       {text : '国中的', value : 'America/USA'},
                       {text : '国的中', value : 'Hehe/USA'}],
	filterStrategy : 'anywhere'
	}).next("input");
	element.focus();
	element.val('中');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#filterStrategy_test3').data('omCombo').dropList.children('.om-helper-hidden').size();
		equal(a,0);
		start();
	},500);
});

//12 由于设置optionField为code，则text为code中的值，所以取值时返回code对应的值
test("{filterStrategy:define function}",function(){
	expect(1);
	var element = $('#filterStrategy_test4').omCombo({
		dataSource : [ {code:'0755', name:'深圳', type:'市'},
                       {code:'010', name:'北京', type:'直辖市'},
                       {code:'021', name:'上海', type:'直辖市'} ],
        optionField : 'code',
        inputField : 'name',

	    filterStrategy : function(value, data){
                         return data.code.indexOf(value) > -1 || data.name.indexOf(value) > -1;
                     }
	}).next("input");
	element.focus();
	element.val('1');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#filterStrategy_test4').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,"0755");
		start();
	},500);
});

//13
test("{inputField:默认值text}",function(){
	expect(1);
	var element = $('#inputField_test1').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
                       {text:'010', name:'北京', type:'直辖市'},
                       {text:'021', name:'上海', type:'直辖市'} ],
        valueField : 'type'
	}).next("input");
	element.focus();
	element.val('01');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#inputField_test1').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,'0755021');
		start();
	},500);
});

//14
test("{inputField:name}",function(){
	expect(1);
	var element = $('#inputField_test2').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
                       {text:'010', name:'北京', type:'直辖市'},
                       {text:'021', name:'上海', type:'直辖市'} ],
        inputField : 'name'
	}).next("input");
	element.focus();
	element.val('深圳');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#inputField_test2').data('omCombo').dropList.children('.om-helper-hidden').text();
		equal(a,'010021');
		start();
	},500);
});

//15
test("{inputField:define a function}",function(){
	expect(1);
	var element = $('#inputField_test2').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
                       {text:'010', name:'北京', type:'直辖市'},
                       {text:'021', name:'上海', type:'直辖市'} ],
        filterStrategy : 'anywhere',
        inputField : function(data, index) {
            return '<font color="blue">' + data.name + '</font>' + data.type;
        }
	}).next("input");
	element.focus();
	element.val('直辖');
	element.keyup();
	stop();
	setTimeout(function(){
		var a = $('#inputField_test2').data('omCombo').dropList.children().eq(0).text();
		equal(a,'0755');
		start();
	},500);
});

//16
test("{lazyLoad:true;lazyLoad默认为false，第三个测试案例通过则lazyLoad为false时验证通过}",function(){
	expect(2);
	var element = $('#lazyLoad_true').omCombo({
	     dataSource : [ {text : '中国', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'} ],
	     lazyLoad : true
	}).next("input");
	equal($('#lazyLoad_true').data('omCombo').dropList.children().size(),0);
	element.focus();
	stop();
	setTimeout(function(){
		equal($('#lazyLoad_true').data('omCombo').dropList.children().size(),2);
		start();
	},500);
});

//17
test("{listAutoWidth:false}",function(){
	expect(1);
	var element = $('#listAutoWidth_false').omCombo({
	     dataSource : [ {text : '中华人民共和国国歌：起来，不愿做奴隶的人们，把我们的血肉', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'} ]
	}).next("input");
	element.focus();
	stop();
	setTimeout(function(){
		var a1 = $('#listAutoWidth_false').parent().css('width');
		var a2 = $('#listAutoWidth_false').data('omCombo').dropList.css('width');
		ok(a1==a2,"下拉框的宽度等于输入框的宽度，分别是"+a2+"和"+a1);
		start();
	},500);
	//在firebug下取到的像素值与测试案例中取到的像素值不同，运行下面的代码即可发现，因此用上面的代码进行测试
//    stop();
//    setTimeout(function(){
//            var a1 = $('#listAutoWidth_false').parent().css('width');  //input输入框宽度（不包括下拉框图标21px）
//            var a2 = $.data($('#listAutoWidth_false').omCombo('widget'),'dropList').css('width');  //下拉列表框宽度
//            var a3 = $.data($('#listAutoWidth_false').omCombo('widget'),'dropList').children().css('width');  //数据宽度
//            equal(a1,'155px');
//            equal(a2,'155px');
//            start();
//            //实际测试时只需测试a1+21 和a2是否相等，因为下拉框宽度相当于最长数据宽度+12px
//    },500);
});

//18
test("{listAutoWidth:true}",function(){
	expect(1);
	var element = $('#listAutoWidth_true').omCombo({
	     dataSource : [ {text : '中华人民共和国国歌：起来，不愿做奴隶的人们，把我们的血肉', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'} ],
	     listAutoWidth:true
	}).next("input");
	element.focus();
	stop();
	setTimeout(function(){
		var a1 = $('#listAutoWidth_true').parent().css('width');
		var a2 = $('#listAutoWidth_true').data('omCombo').dropList.css('width');
		ok(!(a1==a2),"下拉框宽度不等于输入框宽度，分别是"+a2+"和"+a1);
		start();
	},500);
//	setTimeout(function(){
//		  var a1 = $('#listAutoWidth_true').parent().css('width');  //input输入框宽度（不包括下拉框图标21px）
//        var a2 = $.data($('#listAutoWidth_true').omCombo('widget'),'dropList').css('width');  //下拉列表框宽度
//        var a3 = $.data($('#listAutoWidth_true').omCombo('widget'),'dropList').children().css('width');  //数据宽度
//        equal(a1,'155px');
//        equal(a2,'348px');
//        equal(a3,'336px');
//		start();
//	},500);
});

//19
test("{listMaxHeight:200,下拉框中数据总高度不足200}",function(){
	expect(2);
	var element = $('#listMaxHeight_true1').omCombo({
	     dataSource : [ {text : '中国', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'} ],
	     listMaxHeight:200
	});
	equal($('#listMaxHeight_true1').data('omCombo').dropList.css('height'),'43px');
	equal($('#listMaxHeight_true1').data('omCombo').dropList.css('overflow-y'),"visible"); //在firebug下是hidden，运行后是visible
});

//20当数据高度超过设置的下拉框的高度时，class为om-widget-content om-droplist的div出现样式：overflow-y: auto
test("{listMaxHeight:200,下拉框中数据总高度超过200}",function(){
	expect(2);
	var element = $('#listMaxHeight_true2').omCombo({
	     dataSource : [ {text : '中国', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'}, 
	                    {text : '法国', value : 'America/USA'}, 
	                    {text : '德国', value : 'America/USA'}, 
	                    {text : '英国', value : 'America/USA'}, 
	                    {text : '日本', value : 'America/USA'}, 
	                    {text : '加拿大', value : 'America/USA'}, 
	                    {text : '意大利', value : 'America/USA'}, 
	                    {text : '韩国', value : 'America/USA'}, 
	                    {text : '朝鲜', value : 'America/USA'}, 
	                    {text : '印度', value : 'America/USA'} ],
	     listMaxHeight:200
	});
	equal($('#listMaxHeight_true2').data('omCombo').dropList.css('height'),'200px');
	equal($('#listMaxHeight_true2').data('omCombo').dropList.css('overflow-y'),'auto');
});

//21
test("{listMaxHeight:auto,无论有多少数据永远不会出现滚动条}",function(){
	expect(2);
	var element = $('#listMaxHeight_auto').omCombo({
	     dataSource : [ {text : '中国', value : 'China/PRC'}, 
	                    {text : '美国', value : 'America/USA'}, 
	                    {text : '法国', value : 'America/USA'}, 
	                    {text : '德国', value : 'America/USA'}, 
	                    {text : '英国', value : 'America/USA'}, 
	                    {text : '日本', value : 'America/USA'}, 
	                    {text : '加拿大', value : 'America/USA'}, 
	                    {text : '意大利', value : 'America/USA'}, 
	                    {text : '韩国', value : 'America/USA'}, 
	                    {text : '朝鲜', value : 'America/USA'}, 
	                    {text : '印度', value : 'America/USA'} ],
	     listMaxHeight:'auto'
	});
	equal($('#listMaxHeight_auto').data('omCombo').dropList.css('height'),'232px');
	equal($('#listMaxHeight_auto').data('omCombo').dropList.css('overflow-y'),'visible');
});

//22listProvider
test("listProvider",function(){
	expect(1);
	var ee = $('#listProvider_test').omCombo({
        dataSource : [ {country : '中国', locale : 'zh_CN', flag : 'china.jpg'}, 
                       {country : '美国', locale : 'en_US', flag : 'usa.jpg'}, 
                       {country : '英国', locale : 'en', flag : 'uk.jpg'}, 
                       {country : '日本', locale : 'ja', flag : 'japan.jpg' } ],
        listAutoWidth : true,
        //将记录的locale属性作为value,如果选择'中国'，然后调用getValue方法将得到'zh_CN'
        valueField : 'locale', 
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
        },
        inputField : function(data, index) {
            //选择'中国'后输入框的文字显示成'中国(zh_CN)'
            return data.country + '(' + data.locale + ')';
        },
        value : 'zh_CN'
    });
	var ar = $('#listProvider_test').data('omCombo').dropList.children().eq(0).children().eq(0).text();
	equal(ar,'国旗国家语言简写');
});

//23
test("{optionField:name}",function(){
	expect(1);
	var element = $('#optionField_name').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
	                   {text:'010', name:'北京', type:'直辖市'},
	                   {text:'021', name:'上海', type:'直辖市'} ],
	    optionField : 'name'
	});
	equal($('#optionField_name').data('omCombo').dropList.children().eq(0).html(),'深圳');
});

//24
test("{optionField:function}",function(){
	expect(1);
	var element = $('#optionField_function').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
	                   {text:'010', name:'北京', type:'直辖市'},
	                   {text:'021', name:'上海', type:'直辖市'} ],
	    optionField : function(data,value){
	    	return data.text+data.name;
	    }
	});
	equal($('#optionField_function').data('omCombo').dropList.children().eq(0).html(),'0755深圳');
});

//25
test("{readOnly:true}",function(){
	expect(1);
	var element = $('#readOnly').omCombo({
		dataSource : [ {text:'0755', name:'深圳', type:'市'},
	                   {text:'010', name:'北京', type:'直辖市'},
	                   {text:'021', name:'上海', type:'直辖市'} ],
	    readOnly : true
	});
	element.focus();
	//下面需要确定下来列表框没有弹出来，可通过visible或者display:block确定，不知道如何取得这两个值？
	equal($('#readOnly').data('omCombo').dropList.css('display'),'none');
});

//26
test("{value:value}",function(){
	expect(1);
	var element = $('#value-test').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ],
	    value : '市'
	});
	//下面需要确定input框中显示的是否是0755？
	//equal($('#value-test').omCombo('value'),'市');
	equal($('#value-test').next("input").val(),'0755');
});

//27此案例将value和valueField一起测试
test("{value,valueField}",function(){
	expect(1);
	var element = $('#value-test1').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ],
	    valueField : 'name',
	    value : '深圳'
	});
	//下面需要确定input框中显示的是否是0755？
	equal($('#value-test1').next("input").val(),'0755');
});

//测试width的测试案例在取width的值时会将设置的值以px的方式转换，所以需要注意转换算法是否适合所有浏览器和所有分辨率，下面的四个案例只保证在firefox下正常运行
//28 
test("{width:100px}",function(){
	expect(1);
	var element = $('#width-test1').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ],
	    width : '100px'
	});
	var testwidth = $('#width-test1').parent().css('width');
	var actualwidth = $('#width-test1-equal').css('width');
	equal(testwidth,actualwidth);
});

//29
test("{width:100pt}",function(){
	expect(1);
	var element = $('#width-test2').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ],
	    width : '100pt'
	});
	var testwidth = $('#width-test2').parent().css('width');
	var actualwidth = $('#width-test2-equal').css('width');
	equal(testwidth,actualwidth);
});

//30
test("{width:10em}",function(){
	expect(1);
	var element = $('#width-test3').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ],
	    width : '10em'
	});
	
	var testwidth = $('#width-test3').parent().css('width');
	var actualwidth = $('#width-test3-equal').css('width');
	equal(testwidth,actualwidth);
});

//31
test("{width:10%}",function(){
	expect(1);
	var element = $('#width-test4').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ],
	    width : '10%'
	});
	
	var testwidth = $('#width-test4').parent().css('width');
	var actualwidth = $('#width-test4-equal').css('width');
	equal(testwidth,actualwidth);
});

//32
test("{width:auto}",function(){
	expect(1);
	var element = $('#width-test5').omCombo({
		dataSource : [ {text:'0755', name:'深圳', value:'市'},
	                   {text:'010', name:'北京', value:'直辖市'},
	                   {text:'021', name:'上海', value:'直辖市'} ],
	    width : 'auto'
	});
	var testwidth = $('#width-test5').parent().css('width');
	var intwidth = testwidth.substring(0,3);
	var result ="";
	if(intwidth<=187 && intwidth>=160)
	{
		result=2;
	}
	equal(result,2);
});

//33
test("{forceSelection : true}",function(){
	expect(1);
	var element = $('#forceSelection').omCombo({
		dataSource : [ {text : '中国', value : 'China/PRC'}, 
                       {text : '美国', value : 'America/USA'} ],
        forceSelection : true
	}).next("input");
	element.focus();
	element.val('123121');
	element.keyup();
	element.blur();
	equal(element.val(),'');
});
}(jQuery));