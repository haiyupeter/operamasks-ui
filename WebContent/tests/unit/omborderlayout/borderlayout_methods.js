(function( $ ) {
    module( "omBorderLayout: methods");
   test( "collapseRegion", function() {
        expect(1);
        $("#collapseRegion").omBorderLayout({ 
            panels:[{ 
                id:"collapseRegion_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"collapseRegion_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"collapseRegion_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"collapseRegion_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:100 
            },{ 
                id:"collapseRegion_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true, 
                width:100 
            }]
        }); 
        $("#collapseRegion").omBorderLayout('collapseRegion','east');
        equal($('#collapseRegion_east-panel').parent().css('display') == 'none' , true , '折叠之后east方向的div被隐藏');
    });
   
    
    test( "expandRegion", function() {
        expect(2);
        $("#expandRegion").omBorderLayout({ 
            panels:[{ 
                id:"expandRegion_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"expandRegion_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"expandRegion_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"expandRegion_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:100 
            },{ 
                id:"expandRegion_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true, 
                width:100 
            }]
        }); 
        $("#expandRegion").omBorderLayout('collapseRegion','east');
        equal($('#expandRegion_east-panel').parent().css('display') == 'none' , true , '折叠之后east被隐藏');
        $("#expandRegion").omBorderLayout('expandRegion','east');
        equal($('#expandRegion_east-panel').parent().css('display') == 'block' , true , '展开之后east显示出来');
        
    });
    
    
    test( "closeRegion", function() {
        expect(1);
        $("#closeRegion").omBorderLayout({ 
            panels:[{ 
                id:"closeRegion_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"closeRegion_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"closeRegion_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"closeRegion_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:100
            },{ 
                id:"closeRegion_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true,
                closable:true,
                width:200 
            }]
        }); 
        $("#closeRegion").omBorderLayout('closeRegion','south');
        equal($('#closeRegion_south-panel').parent().css('display') == 'none' , true , '关闭之后隐藏panel');
    });
    
    test( "openRegion", function() {
        expect(2);
        $("#openRegion").omBorderLayout({ 
            panels:[{ 
                id:"openRegion_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"openRegion_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"openRegion_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"openRegion_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:100
            },{ 
                id:"openRegion_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true,
                closable:true,
                width:100 
            }]
        }); 
        $("#openRegion").omBorderLayout('closeRegion','south');
        equal($('#openRegion_south-panel').parent().css('display') == 'none' , true , '关闭之后不显示panel');
        $("#openRegion").omBorderLayout('openRegion','south');
        equal($('#openRegion_south-panel').parent().css('display') == 'block' , true , '从新打开panel');
    });
}(jQuery));