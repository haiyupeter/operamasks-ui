/*
 * $Id: demo.js,v 1.47 2012/06/21 08:53:16 licongping Exp $
 * operamasks-ui demo.js @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 */
$(document).ready( function() {
	//拥有常见问题页签的组件名数组
	var comps =["omGrid"];
    var _privateMethods = {
        initNavTree : function() {
            // initiate the demos-nav of the west panel
            var categorys = omUiDemos.components;
            var html = '';
            for ( var i = 0, len = categorys.length; i < len; i++) {
                var c = categorys[i], cName = c.category, cComps = [];
                for ( var j = 0, cs = c.comps, len2 = cs.length; j < len2; j++) {
                    cComps[j] = '<dd><a href="#" __index="' + i + '#' + j + '" __name="'+cs[j].name+'" class="component'+(cs[j].isNew?' new':'')+'"><span class="plus">+</span>' + cs[j].name + '</a>';
                    var samples = cs[j].samples;
                    cComps[j] += '<ul>';
                    for (var k = 0; k < samples.length; k++){
                    	var s = samples[k];
                    	cComps[j] += '<li><a href="#"'+(s.isNew?' class="new"':'')+' __height="'+(s.height || 400)+'"  __href="'+s.url+ (s.java?'" __java="'+s.java+'">':'">')+s.title+'</a></li>';
                    }
                    cComps[j] += '</ul></dd>';
                }
                var dds = cComps.length == 0 ? '' : cComps.join('');
                html += '<dt class="category">' + cName + '<div class="trigger"></div></dt><div class="components">' + dds+'</div>';
            }
            $('dl.demos-nav').html(html);
            html = null;
            _privateMethods.initNavHandler();
            //如果url中带有组件参考，则在navTree中自动点击它，否则点击第一个
            var now = self.location.href.split('#')[1];
            var index = self.location.href.split('#')[2] || 0;
            if(isNaN(index)) index = 0;
            var compLink;
            if (now) {
                compLink = $('dl.demos-nav a:contains("' + now + '")');
            } else {
                compLink = $('dl.demos-nav a:first');
            }
            compLink.parents('div').prev().click();
            setTimeout(function(){
            	compLink.click().next().find('a').eq(index).click();
            },0);
        },
        initNavHandler : function() {
        	$('dl dt').click(function(ev){
        		var dt = $(this);
        		if(dt.hasClass('expand')){
        			dt.removeClass('expand').next().slideUp();
        		} else{
        			$('dl dt.expand').removeClass('expand').next().slideUp();
        			dt.addClass('expand').next().slideDown();
        		}
        	});
            $('dl a.component').click(function(ev){
            	var componentLink = $(this); 
            	var plus = componentLink.find('span.plus');
            	if(plus.html() == '+'){
            		plus.html('-');
            		componentLink.parent().find('ul').show();
            	}else{
            		plus.html('+');
            		componentLink.parent().find('ul').hide();
            	}
                ev.preventDefault();
                ev.stopPropagation();
            	return false;
            });
            var allLinks = $('dl.demos-nav li a');
            allLinks.click(function(ev) {
                allLinks.filter('.selected').removeClass('selected');
                var link = $(this).addClass('selected'), text = link.text(), href = '../demos/' + link.attr('__href');
                $('#content-frame').css('height', link.attr('__height') * 1.1);
                document.getElementById("content-frame").src = href;
                $('#demo-link a.demo-new-window').attr('href', href);
                _privateMethods.updateDemoSource(href, link.attr('__java'));
                var compName = link.parent().parent().prev().attr('__name');
                _privateMethods.showDoc(compName);
                var location = window.location, href = location.href;
                location.href = href.split('#')[0] + '#' + compName + '#' + link.parent().index();
                return false;
            });
            $("#view_source").bind("click",function(ev) {
                $(this).toggleClass("view_source_open").toggleClass("view_source_close");
                $("#demo-source").toggle();
                ev.preventDefault();
            });
        },
        showDoc : function(compName){
            // 将该组件对应的文档加载进来
        	var docTarget = $('#api_div');
        	var docCompName = docTarget.attr('__name');
        	if(compName == docCompName) return;
            var docHref = '../docs/symbols/' + compName + '.html';
            // $('#demo-frame #demo-link
            // a.demo-view-doc').attr('href',docHref);
            docTarget.load(docHref + ' .widget-docs', function(responseText, textStatus, XMLHttpRequest) {
                if (textStatus == 'success') {
                    docTarget.show();
                    _privateMethods.makeDocTabs(compName);
                } else if (textStatus == 'error') {
                    docTarget.empty().hide();
                }
            });
            docTarget.attr('__name',compName);
        },
        makeDocTabs : function(compName) {
            $(".widget-docs").omTabs({
                width : 770,
                tabWidth : 80,
                switchEffect : 'none' // 切换时不需要效果
            });
            if($.inArray(compName, comps)!==-1){
            	$(".widget-docs").omTabs("add",{index:"last", title:"常见问题", url:'../question/' + compName + '.html', closeable:false});
            }
            $(".widget-docs > div").addClass('clearfix');
            // This fixes clearing of containers
            // show details/hide details
            $("#options #options-list, #events #events-list")
                    .before('<div class="toggle-docs-links"><a class="toggle-docs-detail" href="#">显示描述</a> | <a class="toggle-docs-example" href="#">隐藏示例</a></div>');

            $("#methods #methods-list")
                    .before('<div class="toggle-docs-links"><a class="toggle-docs-detail" href="#">显示描述</a> | <a class="toggle-docs-example" href="#">隐藏示例</a></div>');

            var showExamples = true;
            $(".toggle-docs-detail")
                    .toggle(function(e) {
                        var details = $(this).text("隐藏描述")
                                .parent().next().find("li > div:first-child")
                                .addClass("header-open");
                        if (showExamples) {
                            details.nextAll().show();
                        } else {
                            details.next().show();
                        }
                        e.preventDefault();
                    }, function(e) {
                        $(this).text("显示描述").parent()
                                .next().find("li > div:first-child")
                                .removeClass("header-open")
                                .nextAll().hide();
                        e.preventDefault();
                    });

            $(".toggle-docs-example")
                    .click(function(e) {
                        if (showExamples) {
                            showExamples = false;
                            $(".toggle-docs-example")
                                    .text("显示示例")
                                    .parent()
                                    .next()
                                    .find("div.header-open ~ .option-examples, div.header-open ~ .event-examples , div.header-open ~ .method-examples")
                                    .hide();
                        } else {
                            showExamples = true;
                            $(".toggle-docs-example")
                                    .text("隐藏示例")
                                    .parent()
                                    .next()
                                    .find("div.header-open ~ .option-examples, div.header-open ~ .event-examples , div.header-open ~ .method-examples")
                                    .show();
                        }
                        e.preventDefault();
                    });

            //Initially hide all options/methods/events
            $('div.option-description, div.option-examples, div.event-description, div.event-examples, div.method-description, div.method-examples').hide();

            //Make list items collapsible
            $('div.option-header h3, div.event-header h3, div.method-header h3')
                    .click(function() {
                        var details = $(this).parent()
                                .toggleClass(
                                        'header-open');
                        if (showExamples) {
                            details.nextAll().toggle();
                        } else {
                            details.next().toggle();
                        }
                    });

            var viewJsSrcLink = $('a[href^="../symbols/src/ui__"]');
            if (viewJsSrcLink) {
                viewJsSrcLink
                    .attr('href', (viewJsSrcLink.attr('href') || '').replace('../', '../docs/'))
                    .attr('target', '_blank');
            }
        },
        updateDemoSource : function(url, java) {
            $('#demo-source > pre').empty();
            $.get(url,function(data) {
                var r_left = "<!-- ";
                var vsb = "view_source_begin";
                var vse = "view_source_end";
                var descb = "view_desc_begin";
                var desce = "view_desc_end";
                var r_right = " -->";
                var everychar = "[\\s\\S]*?";

                /*
                 * 构造 <!-- view_source_begin -->[\s\S]*?<!-- view_source_end -->
                 */
                var r_view_source = r_left + vsb + r_right + everychar + r_left + vse + r_right;
                /*
                 * 构造 <!-- view_source_begin -->|<!-- view_source_end -->
                 */
                var r_view_source2 = r_left + vsb + r_right + "|" + r_left + vse + r_right;

                /*
                 * 构造 <!-- view_desc_begin -->[\s\S]*?<!-- view_desc_end -->
                 */
                var r_view_desc = r_left + descb + r_right + everychar + r_left + desce + r_right;
                /*
                 * 构造 <!-- view_desc_begin -->|<!-- view_desc_end -->
                 */
                var r_view_desc2 = r_left + descb + r_right + "|" + r_left + desce + r_right;

                var matchReg = new RegExp(r_view_source, "gi");
                var replaceReg = new RegExp(r_view_source2, "gi");

                var descMachReg = new RegExp(r_view_desc, "gi");
                var descReplaceReg = new RegExp(r_view_desc2, "gi");

                var demoSourceArray = data.match(matchReg);
                var demoDescArray = data.match(descMachReg);

                var demo_sources = '';
                var demo_desc = '';

                if (demoSourceArray != null) {
                    for ( var i = 0; i < demoSourceArray.length; i++) {
                        var str = demoSourceArray[i];
                        str = str.replace(replaceReg, '');
                        demo_sources += str;
                    }
                }

                if (demoDescArray != null) {
                    for ( var i = 0; i < demoDescArray.length; i++) {
                        var str = demoDescArray[i];
                        str = str.replace(descReplaceReg, '');
                        demo_desc += str;
                    }
                }
                if (java){
                	var viewSource = $('#content_div a.view-java-src');
                	if(viewSource.size() == 0){
                		viewSource = $('<a target="_blank" class="view-java-src" href="#">获取JAVA源代码</a>');
                		$('#demo-source').before(viewSource);
                	}
                	viewSource.unbind('click').bind('click',function(){
                		var left = ($(window).width()-600)/2;
                		var top = ($(window).height()-300)/2;
                		var nw = window.open ('../viewjavasource?src='+java, 'JAVA源代码', 'height=300, width=600, top='+top+', left='+left+', toolbar=no, menubar=no, scrollbars=yes,resizable=yes,location=no, status=no');
                		//nw.document.title = 'JAVA源代码';
                		return false;
                	});
                } else{
                	$('#content_div a.view-java-src').remove();
                }
                $('#demo-source > pre').text(demo_sources);
            });
        }
    };
    
    _privateMethods.initNavTree();
});
