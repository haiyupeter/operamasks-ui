(function($){
    module( "omPanel: methods");
    test( "{ setTitle }", function() {
        expect(1);
        $('#setTitle').omPanel();
        $('#setTitle').omPanel("setTitle", "Title");
        equal($("#setTitle").prev().find(">.om-panel-title").html(), "Title");
    });
    
    test( "{ setIconClass }", function() {
        expect(1);
        $('#setIconClass').omPanel();
        $('#setIconClass').omPanel("setIconClass","icon");
        equal($('#setIconClass').prev().find(">.om-panel-icon").hasClass("icon"), true);
    });
    
    test( "{ open }", function() {
        expect(1);
        $('#open').omPanel({closed: true});
        $('#open').omPanel("open");
        equal($('#open').parent().is(":hidden"), false);
    });
    
    test( "{ close }", function() {
        expect(1);
        $('#close').omPanel();
        $('#close').omPanel("close");
        equal($('#close').parent().is(":hidden"), true);
    });
    
    test( "{ reload }", function() {
        expect(1);
        $('#reload').omPanel();
        $('#reload').omPanel("reload", "jquery-desc.txt");
        stop();
        setTimeout(function(){
        	equal($("#reload").html(),"Jquery-desc","是否加载成功");
        	start();
        },1000);
    });
    
    test( "{ resize }", function() {
        expect(2);
        $('#resize').omPanel({width:50,height:50});
        $('#resize').omPanel("resize",{width:'100px',height:'100px'});
        equal($('#resize').parent().width(), '100');
        equal($('#resize').parent().height(), '100');
    });
   
    test( "{ collapse }", function() {
        expect(2);
        var el = $('#collapse').omPanel({collapsible: true});
        el.omPanel("collapse");
        stop();
        setTimeout(function(){
        	equal( el.parent().height() , el.prev().outerHeight() , 'panel收起后高度与header高度一样' );
        	equal( el.is(":hidden") , true , 'panel收起后主体部分隐藏了');
        	start();
        },1000);
    });
    
    test( "{ expand }", function() {
        expect(2);
        var el = $('#expand').omPanel({collapsible:true, collapsed: true});
        el.omPanel("expand");
        stop();
        setTimeout(function(){
        	notEqual( el.parent().height() , el.prev().outerHeight() , 'panel展开后高度与header高度不一样' );
        	equal( el.is(":hidden") , false , "panel展开后主体部分可见了")
        	start();
        } , 1000);
    });
}(jQuery));