(function($){
    module( "omPanel: setoptions");
    test( "{ title}", function() {
        expect(2);
        $('#title').omPanel({title: "hello"});
        var title = $('#title').prev('.om-panel-header').children('.om-panel-title').html();
        equal(title, "hello");
        $('#title').omPanel({title: "world"});
        title = $('#title').prev('.om-panel-header').children('.om-panel-title').html();
        equal(title, "world");
       
    });
    test( "{ width }", function() {
        expect(2);
        $('#width').omPanel({width: 200});
        var width = $('#width').parent().width();
        equal(width,"200");
        $('#width').omPanel({width: 400});
        width = $('#width').parent().width();
        equal(width,"400");
    });
    test( "{ height }", function() {
        expect(2);
        $('#height').omPanel({
        	height: 200});
        var height = $('#height').parent().height();
        equal(height,"200");
        $('#height').omPanel({
        	height: 400});
        height = $('#height').parent().height();
        equal(height,"400");
    });
    test( "{ header }", function() {
        expect(2);
        $('#header').omPanel({header:false});
        var header = $('#header').prev('.om-panel-header');
        equal(header.length, 0);
        $('#header').omPanel({header: true});
        header = $('#header').prev('.om-panel-header');
        equal(header.length, 1);
    });
    
    test( "{ collapsible }", function() {
        expect(2);
        $('#collapsible').omPanel({collapsible:false});
        var collapsible = $('#collapsible').prev('.om-panel-header').find('.om-panel-tool-collapse');
        equal(collapsible.length ,0);
        $('#collapsible').omPanel({collapsible:true});
        collapsible = $('#collapsible').prev('.om-panel-header').find('.om-panel-tool-collapse');
        ok(collapsible.length > 0,"是否显示收起按钮");
    });
    
    test( "{ closable }", function() {
        expect(2);
        $('#closable').omPanel({closable:true});
        var num = $('#closable').prev('.om-panel-header').find('.om-panel-tool-close');
        ok(num.length > 0,"是否显示关闭按钮");
        $('#closable').omPanel({closable:false});
        num = $('#closable').prev('.om-panel-header').find('.om-panel-tool-close');
        equal(num.length,0);
    });
    
    test( "{ closed }", function() {
        expect(2);
        $('#closed').omPanel({closed:true});
        var ishidden = $('#closed').parent().is(":hidden");
        ok(ishidden,"是否关闭状态");
        $('#closed').omPanel({closed:false});
        ishidden = $('#closed').parent().is(":hidden");
        equal(ishidden, false);
    });
    
    test( "{ collapsed }", function() {
        expect(2);
        var el = $('#collapsed').omPanel({collapsed:true});
        var collapsed = el.parent().height() == el.prev().outerHeight(); 
        ok(collapsed, "是否收起状态");
        el = $('#collapsed').omPanel({collapsed:false});
        collapsed = el.parent().height() == el.prev().outerHeight(); 
        equal(collapsed, false);
    });
    
    test( "{ tools: [] }", function() {
        expect(1);
        $('#tools').omPanel();
        $('#tools').omPanel({
        	tools:[
   			        {id:'min',handler:function(){
   			        	$("#tools").html("click btn");
   			        }}
   			   ]
        });
        $('#tools').prev().find(".om-panel-tool-min").click();
        equal($("#tools").html(), "click btn");
    });
    
    test( "{ loadingMessage: '' }", function() {
        expect(3);
        var $el = $('#loadingMessage').omPanel({url:'jquery-desc.txt'}),
        	$loadMsg = $el.parent().find(".om-panel-loadingMessage");
        equal($loadMsg.length , 1 ,"默认情况下会自动创建loadingMessage");
		equal($loadMsg.is(":hidden") , false ,"加载内容过程当中loadingMessage是可见的");
		stop();
		setTimeout(function(){
			equal($loadMsg.is(":hidden") , true ,"加载完成后loadingMessage是不可见的");
			start();
		} , 500);
    });
    
    test( "{ url }", function() {
        expect(1);
        $('#url').omPanel({url:""});
        $('#url').omPanel({url:"jquery-desc.txt"});
        stop();
        setTimeout(function(){
        	equal($("#url").html(),"Jquery-desc","是否加载成功");
        	start();
        },1000);
        
    });
    
    test( "{ preProcess}", function() {
        expect(1);
        $('#preProcess').omPanel({url:"jquery-desc.txt", preProcess: function(){
        	return "world";
        }});
        $('#preProcess').omPanel({url:"jquery-desc.txt", preProcess: function(){
        	return "hello";
        }});
        stop();
        setTimeout(function(){
        	equal($("#preProcess").html(),"hello","是否预处理数据");
        	start();
        },1000);
    });
    
    test( "{ onError: '' }", function() {
        expect(1);
        $('#onError').omPanel({url:"jquery.txt", onError: function(){
        	$("#onError").html("first onError function!");
        }});
        $('#onError').omPanel({url:"jquery.txt", onError: function(){
        	$("#onError").html("load failed!");
        }});
        stop();
        setTimeout(function(){
        	equal($("#onError").html(),"load failed!");
        	start();
        },1000);
        
    });
    
    test( "{ onSuccess: '' }", function() {
        expect(1);
        $('#onSuccess').omPanel({url:"jquery-desc.txt", onSuccess: function(){
        	$("#onSuccess").html("first onsuccess function!");
        }});
        
        $('#onSuccess').omPanel({url:"jquery-desc.txt", onSuccess: function(){
        	$("#onSuccess").html("load success!");
        }});
        stop();
        setTimeout(function(){
        	equal($("#onSuccess").html(),"load success!");
        	start();
        },1000);
    });
    
    test( "{ onBeforeOpen: function, onOpen: function }", function() {
        expect(2);
        $('#onOpen').omPanel({onBeforeOpen:function(){
        	$('#onOpen').html("first beforeopen function");
        },
        onOpen: function(){
        	$('#onOpen').append("first Open function");
        },
        closed: true
        }
        );
        $('#onOpen').omPanel({onBeforeOpen:function(){
        	$('#onOpen').html("onBeforeOpen do");
        },
        onOpen: function(){
        	$('#onOpen').append("onOpen do");
        },
        closed: true
        }
        );
        $('#onOpen').omPanel("open");
        var content = $('#onOpen').html();
        ok(content.indexOf("onBeforeOpen do")!=-1,"是否执行onBeforeOpen");
        ok(content.indexOf("onOpen do")!=-1,"是否执行onOpen");
    });
    
    test( "{ onBeforeClose: function, onClose: function }", function() {
        expect(2);
        $('#onClose').omPanel({onBeforeClose:function(){
        	$('#onClose').html("first BeforeClose function");
        },
        onClose: function(){
        	$('#onClose').append("onClose do");
        }});
        $('#onClose').omPanel({onBeforeClose:function(){
        	$('#onClose').html("onBeforeClose do");
        },
        onClose: function(){
        	$('#onClose').append("onClose do");
        }});
        $('#onClose').omPanel("close");
        var content = $('#onClose').html();
        ok(content.indexOf("onBeforeClose do")!=-1,"是否执行onBeforeClose");
        ok(content.indexOf("onClose do")!=-1,"是否执行onClose");
    });
    
    test( "{ onBeforeCollapse: function, onCollapse: function }", function() {
        expect(2);
        $('#onCollapse').omPanel({onBeforeCollapse:function(){
        	$('#onCollapse').html("hello");
        },collapsible: true,
        onCollapse: function(){
        	$('#onCollapse').append("world");
        }});
        
        $('#onCollapse').omPanel({onBeforeCollapse:function(){
        	$('#onCollapse').html("onBeforeCollapse do");
        },collapsible: true,
        onCollapse: function(){
        	$('#onCollapse').append("onCollapse do");
        }});
        
        $('#onCollapse').omPanel("collapse",false);
        var content = $('#onCollapse').html();
        ok(content.indexOf("onBeforeCollapse do")!=-1,"是否执行onBeforeCollapse");
        ok(content.indexOf("onCollapse do")!=-1,"是否执行onCollapse");
    });
    
    test( "{ onBeforeExpand: function, onExpand: function }", function() {
        expect(2);
        
        $('#onExpand').omPanel({onBeforeExpand:function(){
        	$('#onExpand').html("ni hao");
        },collapsible: true, collapsed: true,
        onExpand: function(){
        	$('#onExpand').append("lady");
        }});
        
        $('#onExpand').omPanel({onBeforeExpand:function(){
        	$('#onExpand').html("onBeforeExpand do");
        },collapsible: true, collapsed: true,
        onExpand: function(){
        	$('#onExpand').append("onExpand do");
        }});
        $('#onExpand').omPanel("expand",false);
        var content = $('#onExpand').html();
        ok(content.indexOf("onBeforeExpand do")!=-1,"是否执行onBeforeExpand");
        ok(content.indexOf("onExpand do")!=-1,"是否执行onExpand");
    });
}(jQuery));