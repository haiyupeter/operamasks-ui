(function($){
    module( "omPanel: options");
    test( "{ title: 'hello' }", function() {
        expect(1);
        $('#title').omPanel({title: "hello"});
        var title = $('#title').prev('.om-panel-header').children('.om-panel-title').html();
        equal(title, "hello");
       
    });
    test( "{ width: 200 }", function() {
        expect(1);
        $('#width').omPanel({width: 200});
        var width = $('#width').parent().width();
        equal(width,"200");
    });
    test( "{ height: 200 }", function() {
        expect(1);
        $('#height').omPanel({
        	height: 200});
        var height = $('#height').parent().height();
        equal(height,"200");        
    });
    test( "{ header: false }", function() {
        expect(1);
        $('#header').omPanel({header:false});
        var header = $('#header').prev('.om-panel-header');
        equal(header.length, 0);
    });
    
    test( "{ collapsible: true }", function() {
        expect(1);
        $('#collapsible').omPanel({collapsible:true});
        var collapsible = $('#collapsible').prev('.om-panel-header').find('.om-panel-tool-collapse');
        ok(collapsible.length > 0,"是否显示收起按钮");
    });
    
    test( "{ closable: true }", function() {
        expect(1);
        $('#closable').omPanel({closable:true});
        var num = $('#closable').prev('.om-panel-header').find('.om-panel-tool-close');
        ok(num.length > 0,"是否显示关闭按钮");
    });
    
    test( "{ closed: true }", function() {
        expect(1);
        $('#closed').omPanel({closed:true});
        var ishidden = $('#closed').parent().is(":hidden");
        ok(ishidden,"是否关闭状态");
    });
    
    test( "{ collapsed: true }", function() {
        expect(1);
        var el = $('#collapsed').omPanel({collapsed:true});
        var collapsed = el.parent().height() == el.prev().outerHeight(); 
        ok(collapsed, "是否收起状态");
    });
    
    test( "{ tools: [] }", function() {
        expect(1);
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
    
    test( "{ url: '' }", function() {
        expect(1);
        $('#url').omPanel({url:"jquery-desc.txt"});
        stop();
        setTimeout(function(){
        	equal($("#url").html(),"Jquery-desc","是否加载成功");
        	start();
        },1000);
        
    });
    
    test( "{ preProcess: function }", function() {
        expect(1);
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