(function( $ ) {
    module( "omTree: options");
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
    var simpleData =[{id:"n1",text:"品牌",expanded:true},
                     {id:"n2",text:"运营商",expanded:true},
                     {id:"n11",pid:"n1",text:"三星"},
			         {id:"n12",pid:"n1",text:"诺基亚"},
			         {id:"n13",pid:"n1",text:"摩托罗拉"},
			         {id:"n14",pid:"n1",text:"索尼"},
			         {id:"n21",pid:"n2",text:"移动"},
			         {id:"n22",pid:"n2",text:"联通"},
			         {id:"n23",pid:"n2",text:"电信"}];
    
   test( "cascadeCheck", function() {
        var element = $('.cascadeCheck ul:eq(0)').omTree({dataSource :treeData,showCheckbox: true});
        $('div.tree-checkbox:eq(0)',element).click();
        equal($('div.checkbox_full',element).size(),3,'默认情况下选择根节点');
        equal($('div.checkbox_part',element).size(),0,'默认情况下选择根节点');
        $('div.tree-checkbox:eq(0)',element).click();
        equal($('div.checkbox_full',element).size(),0,'默认情况下取消选择根节点');
        equal($('div.checkbox_part',element).size(),0,'默认情况下取消选择根节点');
        $('div.tree-checkbox:eq(1)',element).click();
        equal($('div.checkbox_full',element).size(),1,'默认情况下选择节点Node21');
        equal($('div.checkbox_part',element).size(),1,'默认情况下选择节点Node21');
        $('div.tree-checkbox:eq(4)',element).click();
        equal($('div.checkbox_full',element).size(),4,'默认情况下选择Node21后选择Node22');
        equal($('div.checkbox_part',element).size(),2,'默认情况下选择Node21后选择Node22');
        $('div.tree-checkbox:eq(3)',element).click();
        equal($('div.checkbox_full',element).size(),6,'默认情况下选择Node21后选择Node22再取消Node212');
        equal($('div.checkbox_part',element).size(),1,'默认情况下选择Node21后选择Node22再取消Node212');
        /*
        var element1 = $('.cascadeCheck ul:eq(1)').omTree({dataSource :treeData,showCheckbox: true,cascadeCheck:false});
        $('div.tree-checkbox:eq(0)',element1).click();
        equal($('div.checkbox_full',element1).size(),1,'cascadeCheck:false情况下选择根节点');
        equal($('div.checkbox_part',element1).size(),0,'cascadeCheck:false情况下选择根节点');
        $('div.tree-checkbox:eq(0)',element1).click();
        equal($('div.checkbox_full',element1).size(),0,'cascadeCheck:false情况下取消选择根节点');
        equal($('div.checkbox_part',element1).size(),0,'cascadeCheck:false情况下取消选择根节点');
        $('div.tree-checkbox:eq(1)',element1).click();
        equal($('div.checkbox_full',element1).size(),1,'cascadeCheck:false情况下选择节点Node21');
        equal($('div.checkbox_part',element1).size(),0,'cascadeCheck:false情况下选择节点Node21');
        $('div.tree-checkbox:eq(4)',element1).click();
        equal($('div.checkbox_full',element1).size(),2,'cascadeCheck:false情况下选择Node21后选择Node22');
        equal($('div.checkbox_part',element1).size(),0,'cascadeCheck:false情况下选择Node21后选择Node22');
        $('div.tree-checkbox:eq(3)',element1).click();
        equal($('div.checkbox_full',element1).size(),3,'cascadeCheck:false情况下选择Node21后选择Node22再选择Node212');
        equal($('div.checkbox_part',element1).size(),0,'cascadeCheck:false情况下选择Node21后选择Node22再取消Node212');
        */
    });
    test( "dataSource", function() {
        var element = $('.dataSource ul:eq(0)').omTree({dataSource :treeData});
        equal($('li.om-tree-node',element).size(),10,"dataSource标准静态数据");
        var element = $('.dataSource ul:eq(1)').omTree({dataSource :'../../../omTree.json'});
        stop();
        setTimeout(function(){
            equal($('li.om-tree-node',element).size(),5,"dataSource后台取数");
            start();
        },1000);
        var tree = $('.dataSource ul:eq(2)').omTree({dataSource :simpleData, simpleDataModel: true});
        equal($('li.om-tree-node',tree).size(),9,"dataSource简单静态数据");
    });
    
    test( "showCheckbox", function() {
        var element = $('div.showCheckbox ul:eq(0)').omTree({dataSource : treeData,showCheckbox : true});
        var i=0 , j=0 ;
        $(".showCheckbox ul li").each(function(index,item){
           if($(item).children().filter("div.tree-checkbox").length > 0){
               i++; j++;
           }else{
               i--;
           }
        });
        equal(i == j,true,"设置showCheckBox为true之后所有节点前面有checkbox");
    });
    
  
    test( "showIcon", function() { 
        expect(2);
        var element = $('#showIcon_1').omTree({dataSource : treeData});
        var element1 = $('#showIcon_2').omTree({dataSource : treeData,showIcon : false});
        var i=0 , j=0 ,h=0 , l=0;
        $("li.om-tree-node",element).each(function(index,item){
           if($(item).children().filter("span").hasClass("folder") || 
                   $(item).children().filter("span").hasClass("file")){
               i++; j++;
           }else{
               i--;
           }
        });
        equal(i == j,true,"设置showIcon为true之后所有节点前面有icon图标");
        
        $("li.om-tree-node",element1).each(function(index,item){
            if($(item).children().filter("span").hasClass("folder") || 
                    $(item).children().filter("span").hasClass("file")){
                h--;
            }else{
                h++; l++;
            }
         });
         equal(h == l,true,"设置showIcon为false之后所有节点前面没有icon图标");
    });

}(jQuery));