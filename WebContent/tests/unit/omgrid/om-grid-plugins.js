(function($){
    module( "omGrid: plugins");
    var ip2Number=function(ip){
        var sections=ip.split('.');
        for(var i=0,len=sections.length;i<len;i++){
            switch(sections[i].length){
                case 0:sections[i]='000';break;
                case 1:sections[i]='00'+sections[i];break;
                case 2:sections[i]='0'+sections[i];break;
                default : ;//do nothing
            }
        }
        return parseInt(sections.join("") , 10);
    };
    var options={
        dataSource : '../../../sortgriddata.data',
        colModel : [ {header : 'ID', name : 'id', width : 50, align : 'center',sort:'clientSide'}, 
                     {header : '开始IP', name : 'start', width : 120, align : 'left',sort:function(rowData1,rowData2){
                        return ip2Number(rowData1.start)-ip2Number(rowData2.start);
                        }
                     }, 
                     {header : '结束IP', name : 'end', width : 120, align : 'left',sort:function(rowData1,rowData2){
                        return ip2Number(rowData1.end)-ip2Number(rowData2.end);
                        }
                     },
                     {header : '地区', name : 'city', width : 100, align : 'left',sort:'serverSide'}, 
                     {header : '地址', name : 'address', width : 'autoExpand', align : 'left'} ]
    };
    test( "{默认算法}", function() {
        expect(1);
        var element = $('#sortplugin1').omGrid(options);
        stop();
        var thead=element.parent().prev(),
            idCol=$('thead th:eq(1)',thead);
        setTimeout(function(){
            idCol.click();
        },1000);
        setTimeout(function(){
            idCol.click();
        },1100);
        setTimeout(function(){
            equal($('tbody tr:eq(0) td:eq(1) div',element).html(),'15',"默认算法'ID'降序排列第一条ID是15");
            start();
        },1200);
    });
    test( "{自定义算法}", function() {
        expect(1);
        var element = $('#sortplugin2').omGrid(options);
        stop();
        var thead=element.parent().prev(),
            startCol=$('thead th:eq(2)',thead);
        setTimeout(function(){
            startCol.click();
        },1000);
        setTimeout(function(){
            startCol.click();
        },1100);
        setTimeout(function(){
            equal($('tbody tr:eq(0) td:eq(1) div',element).html(),'15',"自定义算法'开始IP'降序时第一条ID是15");
            start();
        },1200);
    });
    test( "{服务器排序}", function() {
        expect(1);
        var element = $('#sortplugin3').omGrid(options);
        stop();
        var thead=element.parent().prev(),
            cityCol=$('thead th:eq(4)',thead);
        setTimeout(function(){
            cityCol.click();
        },1000);
        setTimeout(function(){
            equal($('tbody tr:eq(0) td:eq(1) div',element).html(),'69',"服务器排序'地区'升序时第一条ID是69");
            start();
        },2000);
    });
    test( "{不可排序}", function() {
        expect(1);
        var element = $('#sortplugin3').omGrid(options);
        stop();
        var thead=element.parent().prev(),
            addressCol=$('thead th:eq(5)',thead);
        setTimeout(function(){
            addressCol.click();
        },1000);
        setTimeout(function(){
            equal($('tbody tr:eq(0) td:eq(0) div',element).html(),'1',"不可排序情况下怎么点表头第一条ID永远是1");
            start();
        },1200);
    });
    test( "{展开行详情}", function() {
        expect(1);
        var element = $('#rowExpanderPlugin').omGrid({
                dataSource : '../../../griddata.do?method=fast',
                colModel : [ {header : 'ID', name : 'id', width : 100, align : 'center'}, 
                             {header : '地区', name : 'city', width : 120, align : 'left'}, 
                             {header : '地址', name : 'address', align : 'left', width : 200} ],
                autoFit:true,
                height : 300,
                //展开行时使用下面的方法生成详情，必须返回一个字符串
                rowDetailsProvider:function(rowData,rowIndex){
                    return '第'+rowIndex+'行，ID='+rowData.id+rowData.city+rowData.address
                                +'的IP地址范围是：'+rowData.start+'~'+rowData.end;
                }
            });
        stop();
        setTimeout(function(){
            var trigger=$('#rowExpanderPlugin td.expenderCol:eq(0)>div');
            trigger.click();
            var nextTr=$('#rowExpanderPlugin tr:eq(1)');
            var result=nextTr.hasClass('rowExpand-rowDetails') && nextTr.find('div.rowExpand-rowDetails-content').html()=='第0行，ID=1IANA保留地址CZ88.NET的IP地址范围是：0.0.0.0~0.255.255.255';
            ok(result,"展开第一行后下面会显示行详情");
            start();
        },1500);
    });
}(jQuery));