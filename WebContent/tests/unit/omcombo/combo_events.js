/*$('#combo_onError').omCombo({  //
  			dataSource: 'combo4.test1?method=combo4', //将url地址写错误，触发onError
  			lazyLoad : true,
  			onError : function(request, status, error){alert('请求数据出错，错误消息：'+error);}
  		});

$('#combo_onSuccess').omCombo({  //
		dataSource: 'combo4.test?method=combo4&t='+new Date().getTime(),
		lazyLoad : true,
		onSuccess : function(data){alert('总共加载出了：'+data.length+'条数据');}
	});

$('#combo_onValueChange').omCombo({
    dataSource:[{text:'apusic.com', name:'apusic',value:1},{text:'operamasks.org', name:'om',value:2}],
    value:1,
    onValueChange:function(target, newValue, oldValue) {
        $('#valueChange_span').html("old value:" + oldValue +" - new value:" + newValue);
    }
});
*/
(function( $ ) {
module( "omCombo: events");

test("{onError event}",function(){
	expect(1);
	var element = $('#onError-test').omCombo({
		dataSource: 'combo4.test1?method=combo4',
		lazyLoad : true,
		onError : function(request, status, error){
			$('#onError-span').html("请求数据出错，错误消息：" + error);}
	});
	element.next("input").focus();
	stop();
	setTimeout(function(){
		equal($('#onError-span').text(),"请求数据出错，错误消息：/operamasks-ui/tests/unit/omcombo/combo4.test1");
		start();
	},5000);

});

test("onSuccess event",function(){
	expect(1);
	var element = $('#onSuccess-test').omCombo({
		dataSource: 'combo4.test?method=combo4&t='+new Date().getTime(),
		lazyLoad : true,
		onSuccess : function(data){$('#onSuccess-span').html('总共加载出了：'+data.length+'条数据');}
	});
	element.next("input").focus();
	stop();
	setTimeout(function(){
		equal($('#onSuccess-span').text(),"总共加载出了：2条数据");
		start();
	},4000);
});

test("onValueChange event",function(){
	expect(1);
	var element = $('#onValueChange-test').omCombo({
		dataSource:[{text:'apusic.com', name:'apusic',value:1},{text:'operamasks.org', name:'om',value:2}],
	    value:1,
	    onValueChange:function(target, newValue, oldValue) {
	        $('#onvalueChange-span').html("old value:" + oldValue +" - new value:" + newValue);
	    }
	});
	stop();
	setTimeout(function(){
	element.omCombo('value',2);
	var changedata = $('#onvalueChange-span').text();
	equal(changedata,"old value:1 - new value:2");
	start();
	},1000);
});
}(jQuery));