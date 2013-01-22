(function( $ ) {
    module( "omTree: setOptions");
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
    
   test( "{ cascadeCheck }", function() {
   		expect(20);
        var element = $('.setOptions_cascadeCheck ul:eq(0)').omTree({dataSource :treeData,showCheckbox: true});
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
        
        element = $('.setOptions_cascadeCheck ul:eq(0)').omTree({dataSource:treeData , showCheckbox: true, cascadeCheck:false}); 
        $('div.tree-checkbox:eq(0)',element).click();
        equal($('div.checkbox_full',element).size(),1,'{cascadeCheck:false} 情况下选择根节点');
        equal($('div.checkbox_part',element).size(),0,'{cascadeCheck:false} 情况下选择根节点');
        $('div.tree-checkbox:eq(0)',element).click();
        equal($('div.checkbox_full',element).size(),0,'{cascadeCheck:false} 情况下取消选择根节点');
        equal($('div.checkbox_part',element).size(),0,'{cascadeCheck:false} 情况下取消选择根节点');
        $('div.tree-checkbox:eq(1)',element).click();
        equal($('div.checkbox_full',element).size(),1,'{cascadeCheck:false} 情况下选择节点Node21');
        equal($('div.checkbox_part',element).size(),0,'{cascadeCheck:false} 情况下选择节点Node21');
        $('div.tree-checkbox:eq(4)',element).click();
        equal($('div.checkbox_full',element).size(),2,'{cascadeCheck:false} 情况下选择Node21后选择Node22');
        equal($('div.checkbox_part',element).size(),0,'{cascadeCheck:false} 情况下选择Node21后选择Node22');
        $('div.tree-checkbox:eq(3)',element).click();
        equal($('div.checkbox_full',element).size(),3,'{cascadeCheck:false} 情况下选择Node21后选择Node22再选择Node212');
        equal($('div.checkbox_part',element).size(),0,'{cascadeCheck:false} 情况下选择Node21后选择Node22再取消Node212');
    });
    
    test( "{ dataSource }", function() {
    	expect(3);
        var element = $('.setOptions_dataSource ul:eq(0)').omTree({dataSource :treeData});
        equal($('li.om-tree-node',element).size(),10,"dataSource标准静态数据");
        
        element = $('.setOptions_dataSource ul:eq(0)').omTree({dataSource :'../../../omTree.json'});
        stop();
        setTimeout(function(){
            equal($('li.om-tree-node',element).size() , 5 , "dataSource后台取数");
            
            element = $('.setOptions_dataSource ul:eq(0)').omTree({dataSource :simpleData, simpleDataModel: true});
        	equal($('li.om-tree-node',element).size(),9,"dataSource简单静态数据");
            start();
        },1000);
    });
    
    test( "{ showCheckbox }", function() {
    	expect(2);
        var element = $('div.setOptions_showCheckbox ul:eq(0)').omTree({dataSource : treeData,showCheckbox : true}),
        	hasCheckbox = true;
        $(".setOptions_showCheckbox ul li").each(function(index,item){
           if($(item).children().filter("div.tree-checkbox").length == 0){
               hasCheckbox = false;
           }
        });
        equal(hasCheckbox , true , "{showCheckBox:true} 所有节点前面有checkbox");
        
        element = $('div.setOptions_showCheckbox ul:eq(0)').omTree({showCheckbox : false});
        hasCheckbox = false;
        $(".setOptions_showCheckbox ul li").each(function(index,item){
           if($(item).children().filter("div.tree-checkbox").length == 0){
               hasCheckbox = false;
           }
        });
        notEqual(hasCheckbox , true , "{showCheckBox:false} 所有节点前面都没有checkbox");
    });
    
    test( "{ showIcon }", function() { 
        expect(2);
        var element = $('#setOptions_showIcon').omTree({dataSource : treeData}),
        	hasIcon = true;
        $("li.om-tree-node",element).each(function(index,item){
           if(!$(item).children().filter("span").hasClass("folder") &&
                   !$(item).children().filter("span").hasClass("file")){
               hasIcon = false;
           }
        });
        equal(hasIcon , true , "{showIcon:true} 所有节点前面有icon图标");
        
        element = $('#setOptions_showIcon').omTree({dataSource : treeData , showIcon : false}),
        hasIcon = false;
        $("li.om-tree-node",element).each(function(index,item){
           if($(item).children().filter("span").hasClass("folder") ||
                   $(item).children().filter("span").hasClass("file")){
               hasIcon = true;
           }
        });
        notEqual(hasIcon , true , "{showIcon:false} 所有节点前面没有icon图标");
    });

}(jQuery));