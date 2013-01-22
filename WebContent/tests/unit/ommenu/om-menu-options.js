(function($){
    module( "omMenu: options");
    test( "{ minWidth: 150 }", function() {
    	expect(1);
        var element = $('#minWidth').omMenu({
            minWidth : 150,
            maxWidth : 230,
            dataSource : [{id:'001',label:'节点一'},
                          {id:'002',label:'节点二',icon : 'calendar.gif',children:[
                                                                 {id:'002001',label:'节点二一'},
                                                                 {id:'002002',icon : 'calendar.gif',label:'节点二二'}
                                                                 ]
                          }
                         ]
        });
        $("#minWidth_btn").click(function(){
            $('#minWidth').omMenu("show",this);
        });
        var length = $('#minWidth').outerWidth();
       equal(length > 150,true,"menu的属性设置正确");
    });
    
    test( "{ maxWidth: 200 }", function() {
        expect( 1 );
        var element = $('#maxWidth').omMenu({
            minWidth : 150,
            maxWidth : 200,
            dataSource : [{id:'001',label:'节点一'},
                          {id:'002',label:'节点二节点二节点二节点二节点二节点二节点二节点二节点二节点二节点二节点二节点二节点二节点二',icon : 'calendar.gif',children:[
                                                                                       {id:'002001',label:'节点二一'},
                                                                                       {id:'002002',icon : 'calendar.gif',label:'节点二二'}
                                                                                       ]
                          }
            ]
        });
        $("#maxWidth_btn").click(function(){
            $('#maxWidth').omMenu("show",this);
        });
        var length = $('#maxWidth').outerWidth();
        equal(length,200,"menu的最大宽度设置正确");
    });
    
    test( "{ showSeparator: true }", function() {
        expect( 1 );
        var element = $('#showSeparator').omMenu({
            minWidth : 150,
            maxWidth : 200,
            dataSource : [{id:'001',label:'节点一'},
                          {id:'002',label:'节点二'},
                          {id:'003',label:'节点三',seperator:true},
                          {id:'004',label:'节点四'},
                          {id:'005',label:'节点五',icon : 'calendar.gif'}
                         ]
        });
        $("#showSeparator_btn").click(function(){
            $('#showSeparator').omMenu("show",this);
        });
        var exitSep = $('#showSeparator').find("#003").next().hasClass("om-menu-sep-li");
        equal(exitSep,true,"menu分割条设置正确");
    });
    test( "{ onSelect: 'calendar.gif' }", function() {
        expect( 1 );
        var ret;
        var element = $('#onSelect').omMenu({
            minWidth : 150,
            maxWidth : 200,
            dataSource : [{id:'001',label:'节点一'},
                          {id:'002',label:'节点二'},
                          {id:'003',label:'节点三'},
                          {id:'004',label:'节点四'},
                          {id:'005',label:'节点五',icon : 'calendar.gif'}
                          ],
            onSelect : function(item){
                ret = item.icon;
            }
        });
        $("#onSelect_btn").click(function(){
            $('#onSelect').omMenu("show",this);
        });
        $('#onSelect').find('#005').mousedown();
        equal(ret,"calendar.gif","执行onSelect事件");
    });
    
}(jQuery));