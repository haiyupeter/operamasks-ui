(function($){
    module( "omMenu: setOptions");
    test( "{ minWidth }", function() {
    	expect(2);
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
        equal(length > 150,true,"menu[minWidth:150]");
        
        element = $('#minWidth').omMenu({
            minWidth : 180
        });
        $("#minWidth_btn").click(function(){
            $('#minWidth').omMenu("show",this);
        });
        length = $('#minWidth').outerWidth();
        equal(length > 180,true,"menu[minWidth:180]");
    });
    
    test( "{ maxWidth }", function() {
        expect( 2 );
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
        equal(length,200,"menu[maxWidth:200]");
        element = $('#maxWidth').omMenu({
            minWidth : 150,
            maxWidth : 250
        });
        $("#maxWidth_btn").click(function(){
            $('#maxWidth').omMenu("show",this);
        });
        var length = $('#maxWidth').outerWidth();
        equal(length,250,"menu[maxWidth:250]");
    });
    
}(jQuery));