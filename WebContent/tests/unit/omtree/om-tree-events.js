(function( $ ) {
    module( "omTree: events");
    var treeData=[{
        "text": "node1",
        "id": "n1",
        "children":[{
            "text": "node11",
            "id": "n11"
        }, {
            "text": "node12",
            "id": "n12"
        }]
    }, {
        "text": "node2",
        "expanded": true,
        "id": "n2",
        "children":[{
            "text":"node21",
            "id": "n21",
            "expanded": true,
            "children": [{
                "id": "n211",
                "text":"node211"
            },{
                "id": "n212",
                "text":"node212"
            }]
        },{
            "text":"node22",
            "id": "n22"
        }]
    }, {
        "text": "node3",
        "id": "n3"
    }, {
        "text": "node4",
        "id": "n4"
    }];
  
   asyncTest( "onBeforeCollapse事件", function() { 
        expect(1);
        var element = $('div.onBeforeCollapse ul:eq(0)').omTree({
        	                      dataSource : treeData,
        	                      onBeforeCollapse : fn
        	                    });
        var target = element.omTree("findNode","id","n2");
        element.omTree('collapse',target);
        function fn(node){
        	ok(true,"onBeforeCollapse事件正确调用");
        	start();
        }
    });
 
     asyncTest( "onBeforeCollapse事件", function() { 
        expect(1);
        var element = $('div.onBeforeCollapse ul:eq(0)').omTree({
        	                      dataSource : treeData,
        	                      onBeforeCollapse : fn
        	                    });
        var target = element.omTree("findNode","id","n2");
        element.omTree('collapse',target);
        function fn(node){
        	ok(true,"onBeforeCollapse事件正确调用");
        	start();
        }
    });
   
     asyncTest( "onBeforeExpand事件", function() { 
    	 expect(1);
    	 var element = $('div.onBeforeExpand ul:eq(0)').omTree({
    		 dataSource : treeData,
    		 onBeforeExpand : fn
    	 });
    	 var target = element.omTree("findNode","id","n1");
    	 element.omTree('expand',target);
    	 function fn(node){
    		 ok(true,"onBeforeExpand事件正确调用");
    		 start();
    	 }
     });
     
     asyncTest( "onBeforeLoad事件", function() { 
    	 expect(1);
    	 var element = $('div.onBeforeLoad ul:eq(0)').omTree({
    		 dataSource : '../../../omTree.json',
    		 onBeforeLoad : fn
    	 });
    	 function fn(node){
    		 ok(true,"onBeforeLoad事件正确调用");
    		 start();
    	 }
     });
   
     asyncTest( "onBeforeSelect事件", function() { 
    	 expect(1);
    	 var element = $('div.onBeforeSelect ul:eq(0)').omTree({
    		 dataSource : treeData,
    		 onBeforeSelect : fn
    	 });
    	 var target = element.omTree("findNode","id","n1");
    	 element.omTree("select",target);
    	 function fn(node){
    		 ok(true,"onBeforeSelect事件正确调用");
    		 start();
    	 }
     });
     
     asyncTest( "onCheck事件", function() { 
    	 expect(1);
    	 var element = $('div.onCheck ul:eq(0)').omTree({
    		 dataSource : treeData,
    		 showCheckbox:true,
    		 onCheck : fn
    	 });
    	 var target = element.omTree("findNode","id","n1");
    	 element.omTree("check",target);
    	 function fn(node){
    		 ok(true,"onCheck事件正确调用");
    		 start();
    	 }
     });
     
     asyncTest( "onClick事件", function() { 
    	 expect(1);
    	 var element = $('div.onClick ul:eq(0)').omTree({
    		 dataSource : treeData,
    		 showCheckbox:true,
    		 onClick : fn
    	 });
    	 var target = element.omTree("findNode","id","n1");
    	 $("#"+target.nid).children().filter("span").children("a").click();	 
    	 function fn(node){
    		 ok(true,"onClick事件正确调用");
    		 start();
    	 }
     });
     
     asyncTest( "onCollapse事件", function() { 
    	 expect(1);
    	 var element = $('div.onCollapse ul:eq(0)').omTree({
    		 dataSource : treeData,
    		 showCheckbox:true,
    		 onCollapse : fn
    	 });
    	 var node = element.omTree("findNode","id","n2");
    	 $("#"+node.nid).children().filter(".hitarea").click();
    	 function fn(node){
    		 ok(true,"onCollapse事件正确调用");
    		 start();
    	 }
     });
     
     asyncTest( "onDblClick事件", function() { 
    	 expect(1);
    	 var element = $('div.onDblClick ul:eq(0)').omTree({
    		 dataSource : treeData,
    		 onDblClick : fn
    	 });
    	 var node = element.omTree("findNode","id","n2");
    	 $("#"+node.nid).children().filter("span").children("a").dblclick();
    	 function fn(node){
    		 ok(true,"onDblClick事件正确调用");
    		 start();
    	 }
     });
     
     asyncTest( "onExpand事件", function() { 
    	 expect(1);
    	 var element = $('div.onExpand ul:eq(0)').omTree({
    		 dataSource : treeData, 
    		 onExpand : fn
    	 });
    	 var node = element.omTree("findNode","id","n1","",true); 
    	 $("#"+node.nid).children().filter(".hitarea").click();
    	 function fn(node){
    		 ok(true,"onExpand事件正确调用");
    		 start();
    	 }
     });
  
    asyncTest( "onSelect事件", function() { 
    	 expect(1);
    	 var element = $('div.onSelect ul:eq(0)').omTree({
    		 dataSource : treeData, 
    		 onSelect : fn
    	 });
    	 var node = element.omTree("findNode","id","n1","",true); 
    	 element.omTree('select',node);
    	 function fn(node){
    		 ok(true,"onSelect事件正确调用");
    		 start();
    	 }
     });
    
     asyncTest( "onError事件", function() { 
    	 expect(1);
    	 var element = $('div.onError ul:eq(0)').omTree({
    		 dataSource : '../../../omTree1.json1', //使用错误的地址引发onError
    		 onError : fn
    	 });
    	 function fn(xmlHttpRequest,textStatus,errorThrown){
    		 ok(true,"onError事件正确调用");
    		 start();
    	 }
     });
     
     asyncTest( "onSuccess事件", function() { 
    	 expect(1);
    	 var element = $('div.onSuccess ul:eq(0)').omTree({
    		 dataSource : '../../../omTree.json', 
    		 onSuccess : fn
    	 });
    	 function fn(node){
    		 ok(true,"onSuccess事件正确调用");
    		 start();
    	 }
     });
     
}(jQuery));