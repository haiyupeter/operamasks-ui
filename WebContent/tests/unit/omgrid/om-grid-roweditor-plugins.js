(function($){
    module( "omGrid: roweditor-plugins");
    var genderOptions = {
		    dataSource : [{text:"请选择",value:""},{text:"女生" , value:"female"},{text:"男生",value:"male"},{text:"未知",value:"unknowned"}],
		    editable: false
		};
    var options={
        dataSource : '../../../sortgriddata.data',
        colModel : [ {header : 'ID', name : 'id', width : 50, align : 'center',editor:{name:"colId"}}, 
                     {header : '开始IP', name : 'start', width : 120, align : 'left',editor:{type:"omCalendar"}}, 
                     {header : '结束IP', name : 'end', width : 120, align : 'left',editor:{type:"omCombo",options:genderOptions}},
                     {header : '地区', name : 'city', width : 100, align : 'left',editor:{type:"omNumberField",rules:[["max",100,"想活过100岁，还要多多努力才行"]]}}, 
                     {header : '地址', name : 'address', width : 'autoExpand', align : 'left' , editor:{editable:false,renderer:renderit}} ]
    };
    var options2={
    		dataSource : '../../../sortgriddata.data',
    		editMode:'insert',
    		colModel : [ {header : 'ID', name : 'id', width : 50, align : 'center',editor:{}}, 
    		             {header : '开始IP', name : 'start', width : 120, align : 'left',editor:{}}, 
    		             {header : '结束IP', name : 'end', width : 120, align : 'left',editor:{}},
    		             {header : '地区', name : 'city', width : 100, align : 'left',editor:{}}, 
    		             {header : '地址', name : 'address', width : 'autoExpand', align : 'left' ,editor:{}} ]
    };
    var options1={
    		dataSource : '../../../sortgriddata.data',
    		colModel : [ {header : 'ID', name : 'id', width : 50, align : 'center',editor:{}}, 
    		             {header : '开始IP', name : 'start', width : 120, align : 'left'}, 
    		             {header : '结束IP', name : 'end', width : 120, align : 'left'},
    		             {header : '地区', name : 'city', width : 100, align : 'left'}, 
    		             {header : '地址', name : 'address', width : 'autoExpand', align : 'left' , editor:{editable:false}} ]
    };
    function renderit(val){
    	return '<span class="renderer">'+val+'</span>';
    }
   test( "{type目前支持text、omCalendar、omCombo、omNumberField}", function() {
        expect(4);
        var element = $('#type').omGrid(options);
        stop();
        setTimeout(function(){
        	element.find('tr:eq(0)').dblclick();
        	var editorview = element.next('.grid-edit-view').find('div.grid-edit-wrapper');
            var text = editorview.eq(0); //input.grid-edit-text
            var calendar = editorview.eq(1);//span.om-calendar
            var combo = editorview.eq(2);//span.om-combo
            var numberfield = editorview.eq(3);//input.om-numberfield
            equal(text.children('input.grid-edit-text').length > 0,true,"{type:text}");
            equal(calendar.children('span.om-calendar').length > 0,true,"{type:calendar}");
            equal(combo.children('span.om-combo').length > 0,true,"{type:combo}");
            equal(numberfield.children('input.om-numberfield').length > 0,true,"{type:numberfield}");
        	start();
        },1000);
    });
    test( "{name属性，如果不配置默认选择colmodel里面的name}", function() {
    	expect(2);
    	var element = $('#name').omGrid(options);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view').find('div.grid-edit-wrapper');
    		var name_setting = editorview.eq(0); //input.grid-edit-text
    		var name_default = editorview.eq(1);//span.om-calendar
    		equal(name_setting.children('input[id="colId"]').length > 0 && name_setting.children('input[name="colId"]').length > 0,true,"{name=colId配置name的情况}");
    		equal(name_default.find('input[name="start"]').length > 0,true,"{默认情况下会使用colModel的name做为name值}");
    		start();
    	},1000);
    });
    test( "{options,创建组件使用的配置项}", function() {
    	expect(1);
    	var element = $('#options').omGrid(options);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		equal( $('div.om-droplist').children().length == 4,true,"{options配置生效，下拉框值展现了出来}");
    		start();
    	},1000);
    });
    
    test( "{rules ,配置校验规则}", function() {
    	expect(1);
    	var element = $('#rules').omGrid(options);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view').find('div.grid-edit-wrapper');
    		var input3 = editorview.eq(3).children('input');
    		input3.val(1000);
    		input3.focus();
    		input3.blur();
    		equal( input3.hasClass('error'),true,"{rules配置生效}");
    		start();
    	},1000);
    });
   
    
    test( "{renderer ,配置不可编辑列的renderer属性}", function() {
    	expect(1);
    	var element = $('#renderer').omGrid(options);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view').find('div.grid-edit-wrapper');
    		equal( editorview.eq(4).children('span').hasClass('renderer'),true,"{renderer配置生效}");
    		start();
    	},1000);
    });
    
    test( "{editable ,是否可编辑}", function() {
    	expect(1);
    	var element = $('#editable').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view').find('div.grid-edit-wrapper');
    		equal( editorview.eq(4).children('input').attr('readonly'),'readonly',"{editable配置生效}");
    		start();
    	},1000);
    });
    
    test( "{cancelEdit ,取消编辑状态}", function() {
    	expect(2);
    	var element = $('#cancelEdit').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view');
    		equal( editorview.attr('style').indexOf('none') == -1,true,"{组件显示正常}");
    		$('#cancelEdit').omGrid('cancelEdit');
    		equal( editorview.attr('style').indexOf('none') != -1,true,"{cancelEdit执行后编辑组件隐藏}");
    		start();
    	},1000);
    });
    
    test( "{cancelChanges  ,取消修改}", function() {
    	expect(2);
    	var element = $('#cancelChanges').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view');
    		var wrapper = editorview.find('div.grid-edit-wrapper');
    		var input3 = wrapper.eq(3).children('input');
    		input3.val(1000);
    		editorview.find('div.gird-edit-btn').children().eq(0).find('input').click();
    		equal(element.find('tr:eq(0) td:eq(4) div').html() == '1000',true,'{取消前值为修改值}');
    		$('#cancelChanges').omGrid('cancelChanges');
    		equal(element.find('tr:eq(0) td:eq(4) div').html() != '1000',true,'{取消后恢复原值}');
    		start();
    	},1000);
    });
    
    test( "{insertRow  ,插入数据}", function() {
    	expect(2);
    	var element = $('#insertRow').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		$('#insertRow').omGrid('insertRow');
    		var editorview = element.next('.grid-edit-view');
    		editorview.find('div.gird-edit-btn').children().eq(0).find('input').click();
    		equal(element.find('tr:eq(0) td:eq(0) div a').html() == '新行',true,'{默认新行插入最前面}');
    		$('#insertRow').omGrid('insertRow',4);
    		editorview.find('div.gird-edit-btn').children().eq(0).find('input').click();
    		equal(element.find('tr:eq(4) td:eq(0) div a').html() == '新行',true,'{设置index为4}');
    		start();
    	},1000);
    });
    
    test( "{deleteRow   ,删除行}", function() {
    	expect(4);
    	var element = $('#deleteRow').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		equal(element.find('tr:eq(0)').is(":hidden"),false,'{删除前}');
    		$('#deleteRow').omGrid('deleteRow',0);
    		equal(element.find('tr:eq(0)').is(":hidden"),true,'{删除后}');
    		
    		$('#deleteRow').omGrid('deleteRow',[1,2]);
    		equal(element.find('tr:eq(2)').is(":hidden"),true,'{删除后}');
    		equal(element.find('tr:eq(3)').is(":hidden"),true,'{删除后}');
    		
    		start();
    	},1000);
    });
    
   
    test( "{editRow   ,编辑行}", function() {
    	expect(2);
    	var element = $('#editRow').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		equal(element.next('.grid-edit-view').length == 0 , true , '{执行编辑前找不到行编辑dom元素}')
    		$('#editRow').omGrid('editRow',0);
    		equal(element.next('.grid-edit-view').length != 0 , true , '{执行编辑后组件初始化成功，编辑指定行}')
    		start();
    	},1000);
    });
    
    test( "{getChanges   ,获取改变数据}", function() {
    	expect(1);
    	var element = $('#getChanges').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view');
    		var wrapper = editorview.find('div.grid-edit-wrapper');
    		var input3 = wrapper.eq(3).children('input');
    		input3.val(1000);
    		editorview.find('div.gird-edit-btn').children().eq(0).find('input').click();
    		var changes = $('#getChanges').omGrid('getChanges');
    		equal(changes.update[0].city == '1000' ,true,'{获得修改的行}')
    		start();
    	},1000);
    });
    
    
    test( "{saveChanges    ,保存修改}", function() {
    	expect(4);
    	var element = $('#saveChanges ').omGrid(options1);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view');
    		var wrapper = editorview.find('div.grid-edit-wrapper');
    		var input3 = wrapper.eq(3).children('input');
    		input3.val(1000);
    		editorview.find('div.gird-edit-btn').children().eq(0).find('input').click();
    		var changes = $('#saveChanges').omGrid('getChanges');
    		equal(changes.update[0].city == '1000' ,true,'{获得修改的行,成功修改行数据}');
    		equal(element.find('tr:eq(0) td:eq(4)').hasClass('grid-cell-dirty'),true,'{含有脏数据标识}');
    		$('#saveChanges ').omGrid('saveChanges');
    		equal($('#saveChanges').omGrid('getChanges').update[0] ,undefined,'{修改数据被清空}');
    		equal(element.find('tr:eq(0) td:eq(4)').hasClass('grid-cell-dirty'),false,'{脏数据标识被清除}');
    		start();
    	},1000);
    });
    
    
    test( "{editMode    ,编辑模式，可以插入，不能修改查询出的数据}", function() {
    	expect(3);
    	var element = $('#editMode').omGrid(options2);
    	stop();
    	setTimeout(function(){
    		element.find('tr:eq(0)').dblclick();
    		var editorview = element.next('.grid-edit-view');
    		equal(editorview.length <= 0 ,true , '{不可编辑其它行}');
    		$('#editMode').omGrid('insertRow');
    		equal(element.next('.grid-edit-view').length > 0 , true ,'{可以插入新行}');
    		
    		var wrapper = element.next('.grid-edit-view').find('div.grid-edit-wrapper');
    		var input3 = wrapper.eq(3).children('input');
    		input3.val(1000);
    		element.next('.grid-edit-view').find('div.gird-edit-btn').children().eq(0).find('input').click();
    		equal(element.find('tr:eq(0) td:eq(4) div').html() , '1000' ,'{新插入行是可编辑的}');
    		start();
    	},1000);
    });
}(jQuery));