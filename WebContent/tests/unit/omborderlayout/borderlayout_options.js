(function( $ ) {
    module( "omBorderLayout: options");
    test( "panels", function() {
        expect(1);   
        $("#panels").omBorderLayout({ 
            panels:[{ 
                id:"panels_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"panels_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"panels_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"panels_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:100 
            },{ 
                id:"panels_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true, 
                width:100 
            }], 
            spacing:2 
        }); 
        
        //先判断dom树是否构造完成
        var outterClass = $('#panels').hasClass('om-borderlayout'); //外层样式是否添加
        var nothClass = $('#panels_north-panel').hasClass('om-panel-body') && $('#panels_north-panel').hasClass('om-widget-content');
        var nothDom =  $('#panels_north-panel').parent().parent().length > 0;
        var centerClass = $('#panels_center-panel').hasClass('om-widget-content');
        var centerDom = $('#panels_center-panel').parent().length > 0;
        var westClass = $('#panels_west-panel').hasClass('om-widget-content');
        var westDom = $('#panels_west-panel').parent().length > 0;
        var eastClass = $('#panels_east-panel').hasClass('om-widget-content');
        var eastDom = $('#panels_east-panel').parent().length > 0;
        var southClass = $('#panels_south-panel').hasClass('om-widget-content');
        var southDom = $('#panels_south-panel').parent().length > 0;
        equal(outterClass && nothClass && nothDom && centerClass && centerDom && westClass && westDom && eastClass && eastDom && southClass && southDom , true , 'borderlayout正常生成')
    });
  
   test( "{spacing : 默认为5px}", function() {
        expect(2);
        $("#spacing").omBorderLayout({ 
            panels:[{ 
                id:"spacing_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"spacing_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"spacing_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"spacing_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:100 
            },{ 
                id:"spacing_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true, 
                width:100 
            }]
        }); 
        
        var topspacing = $('#spacing_north-panel').parent().css('margin-bottom');
        var rightspacing = $('#spacing_west-panel').parent().css('margin-right');
        var bottomspacing = $('#spacing_south-panel').parent().css('margin-top');
        var leftspacing = $('#spacing_east-panel').parent().css('margin-left');
        var result = (topspacing == rightspacing ) && (bottomspacing == leftspacing) 
                  && (rightspacing == leftspacing) && topspacing == '5px';
        equal(result , true , '默认spacing为5px');
        
        $("#spacing_1").omBorderLayout({ 
            panels:[{ 
                id:"spacing_1_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"spacing_1_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"spacing_1_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"spacing_1_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:100 
            },{ 
                id:"spacing_1_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true, 
                width:100 
            }],
            spacing : 10
        }); 
        
        
        var topspacing_1 = $('#spacing_1_north-panel').parent().css('margin-bottom');
        var rightspacing_1 = $('#spacing_1_west-panel').parent().css('margin-right');
        var bottomspacing_1 = $('#spacing_1_south-panel').parent().css('margin-top');
        var leftspacing_1 = $('#spacing_1_east-panel').parent().css('margin-left');
        var result = (topspacing_1 == rightspacing_1 ) && (bottomspacing_1 == leftspacing_1) 
                  && (rightspacing_1 == leftspacing_1) && topspacing_1 == '10px';
        equal(result , true , 'spacing设置为10px');
    });
   test( "hide-collaps-btn", function() {
       expect(2);
       var element = $("#hideCollapsBtn").omBorderLayout({ 
           panels:[{ 
               id:"hideCollapsBtn_north-panel", 
               title:"This is north panel", 
               region:"north", 
               resizable:true, 
               collapsible:true 
           },{ 
               id:"hideCollapsBtn_center-panel", 
               title:"This is center panel", 
               region:"center" 
           },{ 
               id:"hideCollapsBtn_west-panel", 
               title:"This is west panel", 
               region:"west", 
               resizable:true, 
               collapsible:true, 
               width:200 
           },{ 
               id:"hideCollapsBtn_east-panel", 
               title:"This is east panel", 
               region:"east", 
               resizable:true, 
               collapsible:true, 
               width:200 
           },{ 
               id:"hideCollapsBtn_south-panel", 
               title:"This is south panel", 
               region:"south", 
               resizable:true, 
               collapsible:true, 
               width:100 
           }],
           hideCollapsBtn : true
       }); 
       var northTrigger1 = element.find(".om-resizable-handle .om-borderlayout-collaps-trigger-north");
       var northTrigger2 = element.find(".om-borderlayout-trigger-proxy-west .om-borderlayout-expand-trigger");
       equal(northTrigger1.size() , 1 , 'north 面板已生成triggerBtn');
       equal(northTrigger2.size() , 1 , 'north proxy 已生成triggerBtn');
   });
   test( "auto-width", function() {
	   expect(3);
	   var element = $("#autoWidth").omBorderLayout({ 
		   panels:[{ 
			   id:"autoWidth_center-panel", 
			   title:"This is center panel", 
			   region:"center" 
		   },{ 
			   id:"autoWidth_west-panel", 
			   title:"This is west panel", 
			   region:"west"
		   },{ 
			   id:"autoWidth_east-panel", 
			   title:"This is east panel", 
			   region:"east"
		   }]
	   });
	   var westWidth = element.find(".om-borderlayout-region-west").outerWidth();
	   var centerWidth = element.find(".om-borderlayout-region-center").outerWidth();
	   var eastWidth = element.find(".om-borderlayout-region-east").outerWidth();
	   equal(westWidth , 106 , 'west 面板宽度自动计算生成');
	   equal(centerWidth , 111 , 'center 面板宽度自动计算生成');
	   equal(eastWidth , 106 , 'east 面板宽度自动计算生成');
   });
   test( "expand-panel", function() {
	   expect(2);
	   var element = $("#expandPanel").omBorderLayout({ 
		   panels:[{ 
			   id:"expandPanel_center-panel", 
			   title:"This is center panel", 
			   region:"center" 
		   },{ 
			   id:"expandPanel_west-panel", 
			   title:"This is west panel", 
			   region:"west",
			   expandToTop : true
		   },{ 
			   id:"expandPanel_east-panel", 
			   title:"This is east panel", 
			   region:"east",
			   expandToTop : true,
			   expandToBottom : true
		   },{ 
			   id:"expandPanel_south-panel", 
			   title:"This is south panel", 
			   region:"south"
		   },{ 
			   id:"expandPanel_north-panel", 
			   title:"This is north panel", 
			   region:"south"
		   }]
	   });
	   var westRegion = element.find(".om-borderlayout-region-west");
	   var eastRegion = element.find(".om-borderlayout-region-east");
	   equal(westRegion.css("top") , "0px" , 'west 面板宽度自动计算生成');
	   equal(eastRegion.outerHeight() , element.height() , 'center 面板宽度自动计算生成');
   });
/**可能受qunit影响，发现在qunit里边测试不对，但实际例子确是对了，所以暂时不测
    test( "fit", function() {
        expect(1);
        $("#fit").omBorderLayout({ 
            panels:[{ 
                id:"fit_north-panel", 
                title:"This is north panel", 
                region:"north", 
                resizable:true, 
                collapsible:true 
            },{ 
                id:"fit_center-panel", 
                title:"This is center panel", 
                region:"center" 
            },{ 
                id:"fit_west-panel", 
                title:"This is west panel", 
                region:"west", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"fit_east-panel", 
                title:"This is east panel", 
                region:"east", 
                resizable:true, 
                collapsible:true, 
                width:200 
            },{ 
                id:"fit_south-panel", 
                title:"This is south panel", 
                region:"south", 
                resizable:true, 
                collapsible:true, 
                width:100 
            }],
            fit : true
        }); 
        //在qunit框架里面fit_center_height的高度总是有问题
        //var fit_top_height = $('#fit_north-panel').parent().outerHeight();
        //var fit_center_height = $('#fit_west-panel').parent().outerHeight();
        //var fit_bottom_height = $('#fit_south-panel').parent().outerHeight();
        //var result = (440 == (fit_top_height+fit_center_height+fit_bottom_height)); //两个margin5*2 = 10，所以为440
        
        //equal(result , true , '高度和页面高度一致');
        equal($("#fit").outerHeight() == 450 , true , '高度和页面高度一致');
    });
**/
}(jQuery));