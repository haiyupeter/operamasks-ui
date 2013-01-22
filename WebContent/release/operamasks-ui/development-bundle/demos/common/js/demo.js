$(document).ready( function() {
    var _privateMethods = {
        initNavTree : function() {
            // initiate the demos-nav of the west panel
            var categorys = omUiDemos.components;
            var html = '';
            for ( var i = 0, len = categorys.length; i < len; i++) {
                var c = categorys[i], cName = c.category, cComps = [];
                for ( var j = 0, cs = c.comps, len2 = cs.length; j < len2; j++) {
                    cComps[cComps.length] = '<dd><a __index="' + i + '#' + j + '">' + cs[j].name + '</a></dd>';
                }
                var dds = cComps.length == 0 ? '' : cComps.join('');
                html += '<dt>' + cName + '</dt>' + dds;
            }
            $('dl.demos-nav').html(html);
            html = null;
            _privateMethods.initNavHandler();
            //如果url中带有组件参考，则在navTree中自动点击它，否则点击第一个
            var now = self.location.href.split('#')[1];
            if (now) {
                $('dl.demos-nav a:contains("' + now + '")').click();
            } else {
                $('dl.demos-nav a:first').click();
            }
        },
        initNavHandler : function() {
            var allLinks = $('dl.demos-nav a');
            allLinks.click(function(ev) {
                        allLinks.filter('.selected').removeClass('selected');
                        var link = $(this).addClass('selected'), text = link.text();
                        $("#demo-header > h2").html(text);
                        var __indexs = link.attr('__index').split('#');
                        _privateMethods.showDocsAndlistDemos(__indexs[0], __indexs[1]);
                        ev.preventDefault();
                        ev.stopPropagation();
                        var location = self.location, href = location.href;
                        location.href = href.split('#')[0] + '#' + text;
                    });
            $("#view_source").bind("click",
                    function(ev) {
                        $(this).toggleClass("view_source_open").toggleClass("view_source_close");
                        $("#demo-source").toggle();
                        ev.preventDefault();
                    });
        },
        initSpamleHandler : function(lists) {
            lists.click(function(e) {
                        // load spamle to iframe
                        lists.filter('.demo-config-on').removeClass('demo-config-on');
                        var link = $(this).addClass('demo-config-on').children(), href = '../demos/' + link.attr('__href');
                        $('#content_frame').css('height', link.attr('__height') * 1.1);
                        document.getElementById("content_frame").src = href;
                        $('#demo-link a.demo-new-window').attr('href', href);
                        _privateMethods.updateDemoSource(href);
                        return false;
                    });
        },
        showDocsAndlistDemos : function(categoryIndex, compIndex) {
            var comp = omUiDemos.components[categoryIndex].comps[compIndex];
            var name = comp.name, samples = comp.samples, lis = [];
            // 将该组件对应的所有示例列表显示在eastPanel中
            for ( var i = 0, len = samples.length; i < len; i++) {
                var sample = samples[i];
                lis[lis.length] = '<li><a href="#" __height="'
                        + (sample.height || 400) + '" __href="'
                        + sample.url + '">' + sample.title
                        + '</a></li>';
            }
            var lists = $('#demo-config-menu #demos-nav ul').html(lis.join('')).children();
            lis = null;
            _privateMethods.initSpamleHandler(lists);
            lists.first().click(); // 自动选择第一个示例

            // 将该组件对应的文档加载进来
            var docHref = '../docs/symbols/' + name + '.html';
            // $('#demo-frame #demo-link
            // a.demo-view-doc').attr('href',docHref);
            var docTarget = $('#api_div');
            docTarget.load(docHref + ' .widget-docs', function(responseText, textStatus, XMLHttpRequest) {
                if (textStatus == 'success') {
                    docTarget.show();
                    _privateMethods.makeDocTabs();
                } else if (textStatus == 'error') {
                    docTarget.empty().hide();
                }
            });
        },
        makeDocTabs : function() {
            $(".widget-docs").omTabs({
                width : 770,
                switchEffect : 'none' // 切换时不需要效果
            });
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
        updateDemoSource : function(url) {
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

                $('#demo-source > pre').text(demo_sources);

            });
        }
    };
    _privateMethods.initNavTree();
});
