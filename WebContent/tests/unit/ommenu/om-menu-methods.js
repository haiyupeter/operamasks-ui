(function($){
    module( "omMenu: methods");
    test( "{ show }", function() {
        expect( 1 );
         $('#show').omMenu({
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
        $("#show_btn").click(function(){
            $('#show').omMenu("show",this);
        });
        var menushow = $("#show").css("display");
       equal(menushow,"block","成功显示menu");
    });
    test( "{ hide }", function() {
        expect( 2 );
        $('#hide').omMenu({
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
        $("#hide_show_btn").click(function(){
            $('#hide').omMenu("show",this);
        });
        var menushow = $("#hide").css("display");
        equal(menushow,"block","成功显示menu");
        
        $("#hide_hide_btn").click(function(){
            $('#hide').omMenu("hide");
        });
        $("#hide_hide_btn").mousedown();
        var menuhide = $("#hide").css("display");
        equal(menuhide,"none","成功隐藏menu");
    });
    test( "{ disableItem }", function() {
        expect( 1 );
        $('#disableItem').omMenu({
            minWidth : 150,
            maxWidth : 230,
            dataSource : [{id:'001',label:'节点一'},
                          {id:'002',label:'节点二',icon : 'calendar.gif'}
            ]
        });
        $("#disableItem_btn").click(function(){
            $('#disableItem').omMenu("show",this);
        });
        $("#disableItem_btn").click();
        
        $('#disableItem').omMenu("disableItem","002");
        var disabled = $("#disableItem").find("#002").hasClass("om-state-disabled");
        equal(disabled,true,"disableItem方法成功执行");
    });
    test( "{ enableItem }", function() {
        expect( 1 );
        $('#enableItem').omMenu({
            minWidth : 150,
            maxWidth : 230,
            dataSource : [{id:'001',label:'节点一'},
                          {id:'002',label:'节点二',icon : 'calendar.gif',disabled:true}
            ]
        });
        $("#enableItem_btn").click(function(){
            $('#enableItem').omMenu("show",this);
        });
        $("#enableItem_btn").click();
        
        $('#enableItem').omMenu("enableItem","002");
        var disabled = $("#enableItem").find("#002").hasClass("om-state-disabled");
        equal(disabled,false,"enableItem方法成功执行");
    });
}(jQuery));