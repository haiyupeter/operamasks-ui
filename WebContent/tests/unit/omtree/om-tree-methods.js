(function( $ ) {
    module( "omTree: methods");
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
    
    test( "check方法", function() { 
        expect(3);
        var element = $('div.check ul:eq(0)').omTree({dataSource : treeData , showCheckbox : true});
        var node12 = element.omTree("findNode","id","n12","",true);
        var node11 = element.omTree("findNode","id","n11","",true);
        var parentNode = element.omTree('getParent',node12);
        element.omTree('check',node12); //选中节点n12，检测本节点和父节点是否被选中即可
        equal($('#'+node12.nid).children().filter(".tree-checkbox").hasClass("checkbox_full"),true , "当前节点被全部选中");
        equal($('#'+parentNode.nid).children().filter(".tree-checkbox").hasClass("checkbox_part"),true,"当前节点的父节点只有部分被选中");
        
        element.omTree('check',node11); //选中节点n11，检测父节点是否全部选中
        equal($('#'+parentNode.nid).children().filter(".tree-checkbox").hasClass("checkbox_full"),true,"当前节点的父节点全部被选中");
    });
    
    
    test( "checkAll方法", function() { 
        expect(1);
        var element = $('div.checkAll ul:eq(0)').omTree({dataSource : treeData , showCheckbox : true});
        element.omTree('checkAll',true);
        var i=0 ,j=0;
        $("li.om-tree-node" , element).each(function(){
            i++;
           var checked = $(this).children().filter(".tree-checkbox").hasClass("checkbox_full");
           if(checked)j++;
        });
        equal(i == j , true ,"checkAll方法将所有checkbox设置为选中状态，即所有checkbox的样式为checkbox_full");
    });
    test( "collapse方法", function() { 
        expect(2);
        var element = $('div.collapse ul:eq(0)').omTree({dataSource : treeData});
        var node = element.omTree("findNode","id","n21","",true); //使用n21做为测试点
        equal($("#"+node.nid).children().filter(".hitarea").hasClass("expandable-hitarea"),false , "未点击前节点为展开状态");
        element.omTree('collapse',node);
        equal( $("#"+node.nid).children().filter(".hitarea").hasClass("expandable-hitarea"),true ,"点击后节点为收缩状态");
    });
   
    test( "collapseAll方法", function() { 
        expect(1);
        var element = $('div.collapseAll ul:eq(0)').omTree({dataSource : treeData});
        element.omTree('collapseAll');
        var i=0,j=0;
        $("li.om-tree-node" , element).each(function(){
            var node_hitarea = $(this).children().filter(".hitarea");
            if(node_hitarea.length > 0){
                i++;
                if(node_hitarea.hasClass("expandable-hitarea")){
                    j++;
                }
            }
        });
        equal(i== j , true ,"全部图标都为+号，即样式为expandable-hitarea");
    });
   
    test( "expand方法", function() { 
        expect(1);
        var element = $('div.expand ul:eq(0)').omTree({dataSource : treeData});
        var node1 = element.omTree("findNode","id","n1","",true); //使用n1做为测试点
        element.omTree('expand',node1);
        var is = $("li.om-tree-node" , element).filter("#"+node1.nid).children().filter("div.hitarea").hasClass("collapsable-hitarea");
        equal(is ,true , "收缩node1节点，节点的样式为collapsable-hitarea");
    });
    
    test( "expandAll方法", function() { 
        expect(1);
        var element = $('div.expandAll ul:eq(0)').omTree({dataSource : treeData});
        element.omTree('expandAll');
        var i=0,j=0;
        $("li.om-tree-node" , element).each(function(){
            var node_hitarea = $(this).children().filter(".hitarea");
            if(node_hitarea.length > 0){
                i++;
                if(node_hitarea.hasClass("collapsable-hitarea")){
                    j++;
                }
            }
        });
        equal(i == j , true ,"全部图标都为-号，即样式为collapsable-hitare");
    });
    
    test( "findByNId方法", function() { 
        expect(1);
        var element = $('div.findByNId ul:eq(0)').omTree({dataSource : treeData});
        var findNode = element.omTree('findByNId',element.omTree('findNode', "id", 'n1', "",true).nid);
        equal(findNode.id,"n1" , "返回的节点id应该和查找设置的id一样");
    });
    
    test( "findNode方法", function() { 
        expect(1);
        var element = $('div.findNode ul:eq(0)').omTree({dataSource : treeData});
        var node = element.omTree('findNode', "id", 'n1', "",true);
        equal(node.id,"n1" , "返回的节点id应该和查找设置的id一样");
    });
    
    test( "findNodeBy方法", function() { 
        expect(1);
        var element = $('div.findNodeBy ul:eq(0)').omTree({dataSource : treeData});
        var node = element.omTree('findNodeBy', function(node){
            if(node.id == 'n1') return true;
        },"",true);
        equal(node.id,"n1" , "返回的节点id应该和查找设置的id一样");
    });
   
    test( "findNodes方法", function() { 
        expect(1);
        var element = $('div.findNodes ul:eq(0)').omTree({dataSource : treeData});
        var node = element.omTree('findNodes',"id","n1","",true);
        equal(node[0].id,"n1" , "返回的节点id应该和查找设置的id一样");
    });
    
    test( "findNodesBy方法", function() { 
        expect(1);
        var element = $('div.findNodesBy ul:eq(0)').omTree({dataSource : treeData});
        var node = element.omTree('findNodesBy',function(node){
            if(node.id == 'n1') return true;
        },"",true);
        equal(node[0].id,"n1" , "返回的节点id应该和查找设置的id一样");
    });
    
    test( "getChecked方法", function() { 
        expect(1);
        var element = $('div.getChecked ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var node1=element.omTree("findNode","id","n1");
        element.omTree("check", node1);

        var node = element.omTree('getChecked',true);
        equal( node[0].id,"n1" ,"返回的节点id应该和勾选的id一样");
    });
   
    test( "getChildren方法", function() { 
        expect(1);
        var element = $('div.getChildren ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var node1=element.omTree("getChildren", element.omTree("findNode","id","n1"));
        equal(node1.length,2 , "返回的节点个数为2");
    });
   
    test( "getData方法", function() { 
        expect(1);
        var element = $('div.getData ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var nodes=element.omTree("getData");
        equal( nodes.length,4 ,"返回的节点个数为4");
    });
    
    test( "getParent方法", function() { 
        expect(1);
        var element = $('div.getParent ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var pnode=element.omTree("getParent",element.omTree("findNode","id","n11"));
        equal( pnode.id,"n1" ,"返回的父节点为n1");
    });
    
    test( "getSelected方法", function() { 
        expect(1);
        var element = $('div.getSelected ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        element.omTree('select',element.omTree("findNode","id","n1"));
        var node=element.omTree("getSelected");
        equal( node.id,"n1" ,"返回选中的节点n1");
    });
  
    test( "insert方法", function() { 
        expect(1);
        var element = $('div.insert ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var pNode = element.omTree("findNode","id","n1");
        element.omTree('insert', {"id": "n13","text":"node13"} , pNode);
        var node= element.omTree("findNode","id","n13");
        equal( node.id,"n13" ,"返回插入的节点id：n13");
    });
    
    test( "isCheck方法", function() { 
        expect(2);
        var element = $('div.isCheck ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var target = element.omTree("findNode","id","n1");
        var nodeCheck = element.omTree("isCheck",target);
        equal(nodeCheck , false , "节点还没有选中");
        element.omTree("check",target);
        nodeCheck = element.omTree("isCheck",target);
        equal( nodeCheck ,true , "节点被选中");
    });
    
    test( "modify方法", function() { 
        expect(2);
        var element = $('div.modify ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var target = element.omTree("findNode","id","n1");
        equal(target.text ,"node1" ,  "修改前节点名称为node1");
        element.omTree("modify",target,{"text": "node1111","id": "n1"});
        
        equal(element.omTree("findNode","id","n1").text ,"node1111" ,  "修改后的节点名称为node1111");
    });
    
    
    test( "remove方法", function() { 
        expect(2);
        var element = $('div.remove ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var target = element.omTree("findNode","id","n12");
        equal(target.text ,"node12" ,  "删除前存在节点node12");
        element.omTree("remove",target);
        target = element.omTree("findNode","id","n12");
        equal(target ,null ,  "删除后找不到node12节点");
    });
   
    
    test( "select方法", function() { 
        expect(2);
        var element = $('div.select ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var target = element.omTree("findNode","id","n1");
        var snode = element.omTree("getSelected");
        equal(snode , null , "没有选中之前无数据");
        element.omTree("select",target);
        snode = element.omTree("getSelected");
        equal( snode.id ,"n1" , "选中之后得到节点id为n1");
    });
    
    test( "setData方法", function() { 
        expect(2);
        var element = $('div.setData ul:eq(0)').omTree({dataSource : treeData});
        equal( element.omTree("getData").length ,4 , "设置数据前结果为4");
        var data=[{text:'newNode2',children:[{text:'newNode21'},{text:'newNode22'}]},
                  {text:'newNode3'}
           ];
        element.omTree('setData',data);
        equal(element.omTree("getData").length ,2 ,  "设置数据前结果为1");
    });
    
    test( "uncheck方法", function() { 
        expect(2);
        var element = $('div.uncheck ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var target = element.omTree("findNode","id","n1");
        element.omTree('check',target);
        var checkClass = element.children().filter("#"+target.nid).children().filter(".tree-checkbox");
        equal(checkClass.hasClass("checkbox_full") ,true , "节点为被选中状态");
        element.omTree('uncheck',target);
        equal(checkClass.hasClass("checkbox_full") ,false , "节点不被选中");
    });
    
    test( "unselect方法", function() { 
        expect(2);
        var element = $('div.unselect ul:eq(0)').omTree({dataSource : treeData,showCheckbox:true});
        var target = element.omTree("findNode","id","n1");
        element.omTree('select',target);
        var selectClass = element.children("#"+target.nid).children("span");
        equal(selectClass.hasClass("selected") ,true , "节点为被选中状态");
        element.omTree('unselect',target);
        selectClass = element.children("#"+target.nid).children("span");
        equal(selectClass.hasClass("selected") ,false , "节点不被选中");
    });

}(jQuery));