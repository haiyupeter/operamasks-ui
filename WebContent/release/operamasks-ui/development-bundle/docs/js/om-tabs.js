/**
 * $.fn.omTabs
 * 将如下html结构转变成一个tab页签布局.
 *      <div id="make-tab">
 *          <ul>
 *              <li>
 *                  <a href="#tab1"></a>
 *              </li>
 *              <li>
 *                  <a href="#tab2"></a>
 *              </li>
 *              <li>
 *                  <a href="#tab3"></a>
 *              </li>
 *          </ul>
 *      	<div id="tab1">
 *          	this is tab1 content
 *      	</div>
 *      	<div id="tab2">
 *          	this is tab2 content
 *      	</div>
 *      	<div id="tab3">
 *          	this is tab3 content
 *      	</div>
 *      </div>
 *          ......//some other stuff
 *      
 * 使用了 $('#make-tab').omTabs() 之后, 最终的dom结构如下所示:
 * 
 *      <div id="make-tab" class="om-tabs">
 *          <div class="om-tabs-headers">
 *              <ul>
 *                  <li>
 *                      <a href="#tab1"></a>
 *                  </li>
 *                  <li>
 *                      <a href="#tab2"></a>
 *                  </li>
 *                  <li>
 *                      <a href="#tab3"></a>
 *                  </li>
 *              </ul>
 *          </div>
 *          <div class="om-tabs-panels">
 *              <div id="tab1">
 *                  this is tab1 content
 *              </div>
 *              <div id="tab2">
 *                  this is tab2 content
 *              </div>
 *              <div id="tab3">
 *                  this is tab3 content
 *              </div>
 *          </div>
 *      
 *      </div>
 * 
 */
(function(){
    var tabIdPrefix = 'om-tabs-' + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '-',
        id = 0;
    /**
     * class OmPanel, 在target指定的地方根据config生成一个Panel, 该类是$.fn.omPanel包装器
     * param target dom元素,一般指向一个div.
     * param config 生成Panel所需要的配置项,将会被传递给 $.fn.omPanel .
     * 如果当前panel是ajax载入的,则config.url不为空.否则config.content不为空
     * return 原先的target
     */
    function OmPanel (target, config) {
        $(target).omPanel(config);
        return target;
    }
    function makeSketch(self) {
        var tabs = $(self).find('>ul').wrap('<div class="om-tabs-headers om-helper-reset om-helper-clearfix om-widget-header om-corner-all"></div>').parent().parent();
        tabs.addClass('om-tabs om-widget om-widget-content om-corner-all').append('<div class="om-tabs-panels om-widget-content om-corner-bottom"></div>');
        //now we have a sketch, which contains the headers and panels
        return tabs;
    }
    function collectItems(self) {
        var options = $.data(self, 'omtabs').options;
        var items = [];
        $(self).find('>div.om-tabs-headers a').each(function(){
            var anchor = $(this);
            var tabId = anchor.attr('tabId') || anchor.attr('id') || tabIdPrefix + id++ ;
            anchor.attr('tabId', tabId);
            var href = anchor.attr('href');
            //在ie6,7中, href属性是绝对路径
            if (/*@cc_on!@*/0) {
            	href = anchor[0].getAttribute('href', 2);
            }
//            if ($.browser.msie && parseInt($.browser.version) == 7) {
//                if (anchor[0].pathname && href.lastIndexOf(anchor[0].pathname) != -1){
//                    var pathname = anchor[0].pathname;
//                    href = href.substring(href.lastIndexOf(pathname) + pathname.length );
//                }
//            }
            var target = $('>' + href, $(self))[0];
            var cfg = {
                    tabId : tabId,
                    title : anchor.text(),
                    noHeader : true,
                    lazyLoad : options.lazyLoad,
                    onLoad : function() {
                        options.onLoadComplete.call(self, tabId);
                    },
                    border : false
            };
            //target要么指向一个当前页面的div,要么是一个url
            !!target ? cfg.content = $(target).html() : cfg.url = anchor.attr('href');
            var item = new OmPanel(target || $('<div></div>')[0], cfg);
            items.push(item);
        });
        // items 是panel的集合.每一个item通过 $(item).omPanel('panel')之后能获取到对应的panel对象
        return items;
    }
    function render(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            width = options.width,
            height = options.height;
        if (width == 'fit') {
        	omtabs.css('width', '100%');
        } else if (width != 'auto') {
            omtabs.css('width', width);
        }
        if (height == 'fit') {
        	omtabs.css('height', '100%');
        } else if (height != 'auto') {
            omtabs.css('height', height);
        }
        renderHeader(self);
        renderBody(self);
    };
    function renderHeader(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            headers = omtabs.find('>div.om-tabs-headers');
        var lis = headers.find('ul li')
            .addClass('om-state-default om-corner-top')
            .each(function(n){
                var innera = $(this).find('a:first');
                if ($.browser.msie && parseInt($.browser.version) == 7 ) {
                    innera.attr('hideFocus', 'true');
                }
                if (!innera.hasClass('om-tabs-inner')) {
                    innera.addClass('om-tabs-inner');
                }
                if (n == options.active) {
                    $(this).addClass('om-tabs-selected om-state-active');
                    options.activeTabId = innera.attr('tabId');
                }
                //tab width and height. by default, tabWidth=80 tabHeight=25, accept 'auto'
                innera.css({
                    'width' : options.tabWidth,
                    'height' : options.tabHeight
                });
                if (options.closable) {
                    $('<a class="om-icon om-icon-close"></a>').insertAfter(innera);
                }
            });
        var aHeight = lis.find('a').height();
        lis.parent().css({
            'height' : ++ aHeight ,
            'line-height' : aHeight + 'px'
        });
        _checkScroller(self) && _enableScroller(self);
    };
    function renderBody(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items,
            panels = omtabs.find('>div.om-tabs-panels');
        //detach all sub divs
        panels.children().detach();
        var styles = omtabs.attr('style'); 
        if (styles && styles.indexOf('height') != -1 ) {
            var omtabsHeight = omtabs.innerHeight(),
                headersHeight = omtabs.find('>div.om-tabs-headers').outerHeight();
            panels.css('height', omtabsHeight - headersHeight);
        }
        if (!options.border) {
            omtabs.css('border-width', '0');
        }
        var i = items.length;
        while( i -- ) {
            var panel = $(items[i]).omPanel('panel');
            panel.prependTo(panels);
        }
    }
    function afterRender(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            items = data.items,
            i = items.length;
        while( i -- ) {
            var target = $(items[i]);
            if (target.omPanel('options').tabId == options.activeTabId) {
                target.omPanel('open');
            } else {
                target.omPanel('close');
            }
        }
    }
    function buildEvent(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs;
        //close icon
        omtabs.find('>div.om-tabs-headers a.om-icon-close').bind('click.omtabs', function(e){
            var tabid = $(e.target).prev().attr('tabId');
            _close(self, tabid);
            return false;
        });
        // tab click
        if (options.switchMode.indexOf('mouseover') != -1) {
            omtabs.find('>div.om-tabs-headers a.om-tabs-inner').bind('mouseover.omtabs', function() {
                _select(self, $(this).attr('tabId'));
                return false;
            });
        } else if (options.switchMode.indexOf('click') != -1 ) {
            omtabs.find('>div.om-tabs-headers a.om-tabs-inner').bind('click.omtabs', function(){
                _select(self, $(this).attr('tabId'));
                return false;
            });
        }
        if (options.switchMode.indexOf('auto') != -1 ) {
            options.autoInterId = setInterval(function(){
                $(self).omTabs('select', 'next');
            }, options.switchDuration);
        }
        //tab hover
        if ( options.switchMode.indexOf("mouseover") == -1 ) {
        	var lis = omtabs.find('>div.om-tabs-headers li');
			var addState = function( state, el ) {
				if ( el.is( ":not(.om-state-disabled)" ) ) {
					el.addClass( "om-state-" + state );
				}
			};
			var removeState = function( state, el ) {
				el.removeClass( "om-state-" + state );
			};
			lis.bind( "mouseover.omtabs" , function() {
				addState( "hover", $( this ) );
			});
			lis.bind( "mouseout.omtabs", function() {
				removeState( "hover", $( this ) );
			});
		}
        //scroller click
        omtabs.find('>div.om-tabs-headers >span').bind('click.omtabs', function(e) {
            if ($(this).hasClass('om-tabs-scroll-disabled')) {
                return false;
            }
            var scrOffset =  $(this).offset();
            var ul = $(this).parent().find('ul');
            var li = ul.children(':last');
            var dist = li.outerWidth(true);
            var parent = $(this).parent();
            if ($(this).hasClass('om-tabs-scroll-left')) {
                _scroll(self, dist, _scrollCbFn(self));
            }
            if ($(this).hasClass('om-tabs-scroll-right')) {
                _scroll(self, - dist, _scrollCbFn(self));
            }
            return false;
        });
    }
    //remove every events.
    function purgeEvent(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            headers = omtabs.find('>div.om-tabs-headers');

        headers.children().unbind('.omtabs');
        headers.find('>ul >li >a').unbind('.omtabs');
        if (options.autoInterId) {
            clearInterval(options.autoInterId);
        }
    }
    //private methods
    /**
     * 选中特定的页签
     * n 可为页签的索引(从0开始计数),或者页签的tabId TODO n 需要支持first  和 last 表示选中第一个和最后一个
     */
    function _select(self, n) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items,
            ul = omtabs.find('>div.om-tabs-headers ul');
        if ( options.activeTabId == n || options.active == n ) {
            return false;
        }
		n = n || 0;
        var anchor , tid = n;
        if ( n == 'next' ) {
            n = options.active == items.length - 1  ? 0 : options.active + 1 ;
        } else if ( n == 'prev' ) {
            n = options.active == 0 ? items.length - 1 : options.active - 1;
        } 
        if (typeof n == 'number') {
            tid = _getAlter(self, n);
        } else if (typeof n == 'string') {
            n = _getAlter(self, n);
        }
        if (options.onBeforeSelect.call(self, n) == false) {
            return false;
        }
        anchor = ul.find('li a[tabId=' + tid + ']');
        anchor.parent().siblings().removeClass('om-tabs-selected om-state-active');
        anchor.parent().addClass('om-tabs-selected om-state-active');
        options.activeTabId = tid;
        options.active = n;
        var i = items.length;
        while( i-- ) {
            var target = $(items[i]);
            if (target.omPanel('options').tabId == tid) {
                target.omPanel('open', (options.switchEffect != 'none'), options.switchSpeed);
            } else {
                target.omPanel('close');
            }
        }
        //当选中了一个并未完全显示的页签,需要滚动让他完全显示出来
        if (_checkScroller(self)) {
            //stop every animation.
            ul.stop(true, true);
            $(self).clearQueue();
            var lScroller = ul.prev();
            var rScroller = ul.next();
            var lBorder = anchor.parent().offset().left;
            var rBorder = lBorder + anchor.parent().outerWidth(true);
            var lDiff = lScroller.offset().left + lScroller.outerWidth(true) + 4 - lBorder ;
            var rDiff = rScroller.offset().left - rBorder ;
            if (lDiff >= 0) {
                _scroll(self, lDiff, _scrollCbFn(self));
            } else if (rDiff <= 0) {
                _scroll(self, rDiff, _scrollCbFn(self));
            } else {
                _scrollCbFn(self)();
            }
        }
        options.onSelect.call(self, n);
    }
    
    /**
     * 页签索引和tabId的转换器.
     * 如果传入的id为数字,则表示页签的索引,函数返回页签的tabId;如果id为字符串,则表示该页签的tabId,函数返回页签的索引.
     */
    function _getAlter (self, id) {
        var omtabs = $.data(self, 'omtabs').omtabs,
            rt;
        if (typeof id == 'number'){
            rt = omtabs.find('>div.om-tabs-headers li:nth-child(' + ++id + ') a.om-tabs-inner').attr('tabId');
        } else if (typeof id == 'string') {
            omtabs.find('>div.om-tabs-headers li a.om-tabs-inner').each(function(i){
                if ($(this).attr('tabId') == id ) {
                    rt = i;
                    return false;
                }
            });
        }
        return rt;
    }
    /**
     * 返回当前选中的页签的tabId
     */
    function _getSelected(self) {
        var options = $.data(self, 'omtabs').options;
        return options.activeTabId;
    }
    /**
     * 增加一个tab到页签布局中.最后一个参数isAjax指示了ds是否为一个URL
     */
    function _add (self, config/*title, content, url, closable , index*/) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items,
            ul = omtabs.find('>div.om-tabs-headers ul'),
            tabId = tabIdPrefix + id++;
        //调整参数
        config.index = config.index || 'last';
        if (config.index == 'last' || config.index > items.length - 1) {
            config.index = items.length;
        }
        config.title = config.title || 'New Title ' + tabId;
        if (config.content) {
            config.url == undefined;
        } else if (! $.trim(config.url)) {
            config.content = 'New Content ' + tabId;
        }
        if (options.onBeforeAdd.call(self, config/*title, content, url, closable , index*/) == false) {
            return false;
        }
        var nHeader=$('<li class="om-state-default om-corner-top"> </li>');
        var anchor = $('<a class="om-tabs-inner"></a>').html(config.title).attr({
                href : '#' + tabId,
                tabId : tabId
            }).css({
                width : options.tabWidth,
                height : options.tabHeight
            }).appendTo(nHeader);
        if ($.browser.msie && parseInt($.browser.version) == 7) {
            anchor.attr('hideFocus','true');
        }
        if ((config.closable === true) || 
                (config.closable == undefined && options.closable)) {
            anchor.after('<a class="om-icon om-icon-close"></a>');
        }
        var cfg = {
            tabId : tabId,
            noHeader : true,
            closed : true,
            lazyLoad : options.lazyLoad,
            onLoad : function() {
                options.onLoadComplete.call(self, tabId);
            },
            border : false
        };
        
        $.extend(cfg, config);
        var nPanel = new OmPanel($('<div></div>')[0],cfg);
        if (config.index == items.length) {
            items[config.index] = nPanel;
            nHeader.appendTo(ul);
        } else {
            //insert at index
            items.splice(config.index, 0, nPanel);
            ul.children().eq(config.index).before(nHeader);
        }
        //every time we add or close an tab, check if scroller is needed.
        _checkScroller(self) && _enableScroller(self);
        renderBody(self);
        purgeEvent(self);
        buildEvent(self);
        options.onAdd.call(self, cfg);
        _select(self, config.index);
    }
    /**
     * 将index处的页签关闭,如果index指向当前页签,则激活下一页签;如果当前页签是最后一个页签,则激活第一个页签
     * index :页签的位置,可为数字,tabId等. TODO index将要支持prev,  next, first, last
     */
    function _close (self, index) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items,
            headers = omtabs.find('>div.om-tabs-headers'),
            panels = omtabs.find('>div.om-tabs-panels');
        index = index || options.active;
        if (typeof index == 'string') {
            //index is a tabid
            index = _getAlter(self, index);
        }
        if (options.onBeforeClose.call(self, index) == false) {
            return false;
        }
        headers.find('li').eq(index).remove();
        panels.children().eq(index).remove();
        items.splice(index, 1);
        //in case of all tabs are closed, set body height
        if (panels.children().length == 0) {
            panels.css({height : omtabs.innerHeight() - headers.outerHeight()});
        }
        options.onClose.call(self, index);
        if (index == options.active) {
            options.active = -1;
            !items[index] && (index = 0);
            _select(self, index);
//            $(self).omTabs('select', index);
        } else {
            index < options.active && options.active --;
            _checkScroller(self) && _enableScroller(self);
        }
    } 
    /**
     * 如果tab页签总宽度较大，则显示scroll并返回true;否则删除scroll并返回false.
     */
    function _checkScroller(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs;
        if (!options.scrollable) {
            return false;
        }
        var ul = omtabs.find('>div.om-tabs-headers ul');
        var totalWidth = 0, flag = false;
        if (ul.hasClass('om-tabs-scrollable')) {
            //先假定没有左右滚动器 ,来计算宽度是否超过.
            flag = true;
            ul.removeClass('om-tabs-scrollable');
        }
        totalWidth += parseInt(ul.css('paddingLeft')) + parseInt(ul.css('paddingRight'));
        if (flag == true) {
            //重新加上滚动器 .
            flag = false;
            ul.addClass('om-tabs-scrollable');
        }
        ul.children().each(function() {
            //计算一个li占用的总宽度
            totalWidth += $(this).outerWidth(true);//sub element's width
        });
        if (totalWidth > ul.parent().innerWidth()) {
            if (!ul.hasClass('om-tabs-scrollable')) {
                var leftScr = $('<span></span>').insertBefore(ul).addClass('om-tabs-scroll-left');
                var rightScr = $('<span></span>').insertAfter(ul).addClass('om-tabs-scroll-right');
                var mgn = (ul.height() - leftScr.height())/2;
                leftScr.add(rightScr).css({ // scroller in vertical center.
                    'marginTop' : mgn,
                    'marginBottom' : mgn
                });
                ul.addClass('om-tabs-scrollable');
            }
            return true;
        } else {
            ul.siblings().remove();
            ul.removeClass('om-tabs-scrollable');
            return false;
        }
    }
    /**
     * 一般滚动之后都需要执行回调_enableScroller设置滚动条的状态,现包装成方法.
     */
    function _scrollCbFn (self) {
        return function(){
            _enableScroller(self);
        };
    }
    /**
     * 根据页签的位置,设置scroller的状态.
     * 当最右边的页签顶住组件右边沿,则右边的scroller应该禁用,表示不能再往右滚动了.
     * 当最左边的页签顶住组件左边沿,则左边的scroller应该禁用,表示不能再往左滚动了.
     */
    function _enableScroller (self) {
        var omtabs = $.data(self, 'omtabs').omtabs;
        var headers = omtabs.find('>div.om-tabs-headers');
        var ul = headers.children('ul');
        var lScroller = ul.prev();
        var rScroller = ul.next();
        var li = ul.children(':last');
        var lBorder = headers.offset().left,
            rBorder = rScroller.offset().left,
            ulLeft = ul.offset().left,
            ulRight = li.offset().left + li.outerWidth(true);
        if (ulLeft < lBorder) {
            lScroller.removeClass('om-tabs-scroll-disabled');
        } else {
            lScroller.addClass('om-tabs-scroll-disabled');
            //_scroll(self, lBorder - ulLeft);
        }
        if (ulRight > rBorder) {
            rScroller.removeClass('om-tabs-scroll-disabled');
        } else {
            rScroller.addClass('om-tabs-scroll-disabled');
            //_scroll(self, rBorder - ulRight);
        }
    }
    /**
     * 将页签头部往右边滑动distance的距离.当distance为负数时,表示往左边滑动;fn为回调函数
     */
    function _scroll(self, distance, fn) {
        var omtabs = $.data(self, 'omtabs').omtabs;
        var ul = omtabs.find('>div.om-tabs-headers ul');
        var li = ul.children(':last');
        if (distance == 0) {
            return;
        }
        var scrOffset = distance > 0 ? ul.prev().offset() : ul.next().offset();
        var queuedFn = function(next) {
            if (distance > 0 && ul.prev().hasClass('.om-tabs-scroll-disabled') ||
                    distance < 0 && ul.next().hasClass('.om-tabs-scroll-disabled')){
                ul.stop(true, true);
                $(self).clearQueue();
                return;
            }
            var flag = false;
            //fix distance.
            distance = (distance > 0) ? '+=' + Math.min(scrOffset.left - ul.offset().left, distance) : 
                '-=' + Math.min(li.offset().left + li.outerWidth(true) - scrOffset.left, Math.abs(distance));
            $.data(self, 'omtabs').isScrolling = true;
            ul.animate({
                left : distance + 'px'
            },'normal', 'swing', function() {
                !!fn && fn();
                $.data(self, 'omtabs').isScrolling = false;
                next();
            });
        };
        $(self).queue(queuedFn);
        if( $(self).queue().length == 1 && 
                !$.data(self, 'omtabs').isScrolling){
            $(self).dequeue(); //start queue
        }
    }
    /**
     * 获得当前所有页签的数目
     */
    function _getLength (self) {
        return $.data(self, 'omtabs').items.length;//items is the array of body dom
    }
    /**
     * 重新计算omTabs布局
     */
    function _doLayout(self) {
        _checkScroller(self) && _enableScroller(self);
    }
    /**
     * 设置第n个页签的数据源,如果isAjax为true,则ds将被当做url.否则ds将被当做页签的正文,
     */
    function _setDataSource(self, n, ds, isAjax) {
        var items = $.data(self, 'omtabs').items;//items is the array of body dom
        $(items[n]).omPanel('setDataSource', ds, isAjax);
    }
    /**
     * 重新加载第n个页签,如果该Panel有content,则重新刷新content,如果该Panel有url,则根据url取到最新的内容.
     */
    function _reload(self, n) {
        var items = $.data(self, 'omtabs').items;//items is the array of body dom
        $(items[n]).omPanel('reload');
    }
    
    var publicMethods = {
        disable : function() {
            
        },
        enable : function() {
            
        },
        /**
         * 获得组件的最新的配置属性.如果有参数,则将该参数合并到配置属性中.
         * @name omTabs#options
         * @function
         * @param p
         * @returns 组件的配置属性
         * @example 
         * $('#make-tab').omTabs('options', {
         *     height : 400 
         * });
         */
        options : function(p) {
            var options = $.data(this[0], "omtabs").options;
            if (p) {
                $.extend(options, p);
            }
            return options;
        },
        /**
         * 在index处增加一个tab页签
         * @name omTabs#add
         * @function
         * @param index 新增页签的位置(从0开始计数),可设置为'last' //TODO 'first'
         * @param title 新增页签的标题
         * @param ds 新增页签的数据源,可为普通文本,或者url
         * @param isAjax 数据源是否为一个url
         * @example
         * //在第一个页签的位置新增一个页签,该页签的内容是远程数据
         *  $('#make-tab').omTabs('add', {
         *      title : 'New Tab1',
         *      content : 'New Content1',
         *      closable : false,
         *      index : 0
         *  });
         */
        add : function(config /*title, content, url, closable , index*/) {
            this.each(function(){
                _add(this, config /*title, content, url, closable , index*/);
            });
        },
        
        /**
         * 关闭特定的页签,如果n指向当前页签,则激活下一页签;如果当前页签是最后一个页签,则激活第一个页签.
         * @name omTabs#close
         * @function
         * @param n 要关闭的页签的位置(从0开始计数),或者该页签的tabId(一个全局唯一的字符串). 如果未指定该参数,则默认关闭当前页签.
         * @example
         * //关闭第一个页签
         * $('#make-tab').omTabs('close', 0);
         */
        close : function(n) {
            this.each(function(){
                _close(this, n);
            });
        },
        /**
         * 激活特定的页签
         * @name omTabs#select
         * @function
         * @param n 可为页签的索引(从0开始计数),或者页签的tabId
         * @example
         * //激活第一个页签
         * $('#make-tab').omTabs('select', 0);
         */
        select : function(n) {
            this.each(function(){
                _select(this, n);
            });
        },
        /**
         * 页签索引和tabId的转换器.传入其中的一个值,获取另一个值.
         * @name omTabs#getAlter
         * @function
         * @param id 标识符
         * @returns 如果id为数字,则表示页签的索引,函数返回页签的tabId;如果id为字符串,则表示该页签的tabId,函数返回页签的索引.
         * @example
         * //获取第一个页签的tabId
         * var tabId = $('#make-tab').omTabs('getAlter', 0);
         */
        getAlter : function(id) {
            return _getAlter(this[0], id);
        },
        /**
         * 返回当前选中的页签的tabId
         * @name omTabs#getSelected
         * @function
         * @returns 当前选中页签的tabId
         * @example
         * //获取当前选中页签的tabId
         * var selectedTabId = $('#make-tab').omTabs('getSelected');
         */
        getSelected : function() {
            return _getSelected(this[0]);
        },
        /**
         * 获得所有页签的数目
         * @name omTabs#getLength
         * @function
         * @returns 页签的数目
         * @example
         * //获取页签的总数
         * var total = $('#make-tab').omTabs('getLength');
         */
        getLength : function() {
            return _getLength(this[0]);
        },
        /**
         * 设置第n个页签的数据源,可为普通文本或者url.注意该方法只是会重置一个当前页签是否已被加载的标记,而不负责实际加载数据,
         * 在非懒加载的情况下,需要手动加载数据.在懒加载的情况下,当页签被激活时会检查是否已经加载的标记,从而尝试重新加载内容
         * @name omTabs#setDataSource
         * @function
         * @param index 要设置数据源的页签的索引
         * @param ds 数据源,可为普通文本,或者url,由isAjax确定
         * @parma isAjax 数据源是否是url
         * @example
         * //设置第一个页签的数据源为远程数据
         * $('#make-tab').omTabs('setDataSource', 0, './ajax/content1.html', true);
         */
        setDataSource : function(index, ds, isAjax) {
            this.each(function(){
                _setDataSource(this, index, ds, isAjax);
            });
        },
        /**
         * 根据第n个页签当前的数据源,重新加载该页签
         * @name omTabs#reload
         * @function
         * @param n 页签的索引
         * @example
         * //重新加载第一个页签的内容
         * $('#make-tab').omTabs('reload', 0);
         */
        reload : function(n) {
            this.each(function(){
                _reload(this, n);
            });
        },
        /**
         * 对组件重新布局,主要操作是刷新页签滚动箭头.
         * 如果有必要使用页签滚动箭头,则刷新滚动箭头的状态.如果没必要使用页签滚动箭头,则将存在的删除.
         * @name omTabs#doLayout
         * @function
         * @example
         * //对组件重新布局,如果有必要使用页签滚动箭头,则刷新滚动箭头的状态.
         */
        doLayout : function() {
            this.each(function(){
                _doLayout(this);
            });
        }
    };
    var defaultConfig = {
        /**
         * 页签布局的宽度,可取值为'auto'(默认情况,不做处理),可以取值为'fit',表示适应父容器的大小(width:100%).任何其他的值将被直接赋给width属性
         * @name omTabs#width
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({width: 500});
         */
        width : 'auto',
        /**
         * 页签布局的高度,可取值为'auto'(默认情况,不做处理),可以取值为'fit',表示适应父容器的大小(height:100%).任何其他的值将被直接赋给height属性
         * @name omTabs#height
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({height: 200});
         */
        height : 'auto',
        /**
         * 是否显示页签正文区的边框
         * @name omTabs#border
         * @default true
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({border: false});//不显示页签正文区的边框
         */
        border : true,
        /**
         * 单个页签头部的宽度,可取值为'auto'.默认为80像素
         * @name omTabs#tabWidth
         * @default 80
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({tabWidth: 'auto'});
         */
        tabWidth : 80,
        /**
         * 单个页签头部的高度,可取值为'auto'.默认为25像素
         * @name omTabs#tabHeight
         * @default 25
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({tabHeight: 'auto'});
         */
        tabHeight : 25,
        /**
         * 是否禁用组件. (暂时不启用//TODO)
         * //name omTabs#disabled
         * @default false
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({disabled : true});//初始化时禁用组件
         */
        disabled : false,
        /**
         * 当页签超过组件宽度时是否出现左右滚动箭头
         * @name omTabs#scrollable
         * @default true
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({scrollable: false});//当页签数目较多时不显示滚动箭头,将访问不到未显示的页签.
         */
        scrollable : true,
        /**
         * 页签是否可关闭,当本属性为true时,将在页签头部右边放置一个关闭图标.
         * @name omTabs#closable
         * @default false
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({closable : true});//页签可关闭
         */
        closable : false,
        
        //  暂时不公布
        //  页签头部的位置,可为top和left //TODO 'left'
        // @default 'top'
        // @type String
        // @example
        // $('#make-tab').omTabs({position : 'left'});//页签头部在组件的左边
        //
        position : 'top',
        /**
         * 页签切换的模式.可为click(鼠标点击切换),mouseover(鼠标滑过切换),auto(自动切换).
         * switchMode可为三者的组合,比如{switchMode: 'click,auto'}在自动切换的模式下,仍可以使用鼠标点击切换页签
         * @name omTabs#switchMode
         * @default 'click'
         * @type String
         * @example
         * $('#make-tab').omTabs({switchMode : 'click,auto'});//在自动切换的模式下,仍可以使用鼠标点击切换页签
         */
        switchMode : 'click',
        /**
         * 页签切换的效果,现在只支持fade 和 none  // TODO 'slide'
         * @name omTabs#switchEffect
         * @default 'fade'
         * @type String
         * @example
         * $('#make-tab').omTabs({switchEffect : 'none'});//切换页签时不需要动画
         */
        switchEffect : 'fade',
        /**
         * 页签切换的响应速度.取值可为 slow, normal, fast
         * @name omTabs#switchSpeed
         * @default 'normal'
         * @type String
         * @example
         * $('#make-tab').omTabs({switchSpeed : 'fast'});//切换页签时,快速显示选中的页签.
         */
        switchSpeed : 'normal',
        /**
         * 自动切换页签的时间间隔,单位为毫秒. 该属性在 switchMode 为auto时才生效.
         * @name omTabs#switchDuration
         * @default 1000
         * @type Number
         * @example
         * $('#make-tab').omTabs({switchDuration : 2000});//自动切换页签时,时间间隔为2s
         */
        switchDuration : 1000,
        /**
         * 初始化激活的页签的索引(从0开始计数)
         * @name omTabs#active
         * @default 0
         * @type Number
         * @example
         * $('#make-tab').omTabs({active : 1});//初始化时选中第二个页签.
         */
        active : 0,
        /**
         * 是否懒加载,当该属性为true时,只有在页签被选中激活时才尝试加载页签正文区
         * @name omTabs#lazyLoad
         * @default false
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({lazyLoad : true});
         */
        lazyLoad : false,
        /**
         * 当页签被选中之前执行的方法
         * @name omTabs#onBeforeSelect
         * @event
         * @param n 选中页签的索引,从0开始计数.
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onBeforeSelect : function(n) {
         *          alert('tab ' + n + ' will be selected!');
         *      }
         *  });
         */
        onBeforeSelect : function(n) {
        },
        /**
         * 当页签被选中后执行的方法
         * @name omTabs#onSelect
         * @event
         * @param n 选中页签的索引,从0开始计数.
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onSelect : function(n) {
         *          alert('tab ' + n + ' has been selected!');
         *      }
         *  });
         */
        onSelect : function(n) {
        },
        /**
         * 当页签被关闭之前执行的方法
         * @name omTabs#onBeforeClose
         * @event
         * @param n 被关闭页签的索引,从0开始计数.
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onBeforeClose : function(n) {
         *          alert('tab ' + n + ' will be closed!');
         *      }
         *  });
         */
        onBeforeClose : function(n) {
        },
        /**
         * 当页签被关闭之后执行的方法
         * @name omTabs#onClose
         * @event
         * @param n 被关闭页签的索引,从0开始计数.
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onClose : function(n) {
         *          alert('tab ' + n + ' has been closed!');
         *      }
         *  });
         */
        onClose : function(n) {
        },
        /**
         * 当新页签被添加之后执行的方法
         * @name omTabs#onAdd
         * @event
         * @default emptyFn 
         * @param config 经过处理的配置项.在调用add新增页签时,传入的配置项参数可能不完整(使用默认值),此处的config就是完整的配置项
         * @example
         *  $('#make-tab').omTabs({
         *      onAdd : function(config) {
         *          console.dir(config);
         *          alert('you have added a tab at position:' + config.index );
         *      }
         *  });
         */
        onAdd : function(config/*title, content, url, closable , index*/) {
        },
        /**
         * 当新页签被添加之前执行的方法
         * @name omTabs#onBeforeAdd
         * @event
         * @default emptyFn 
         * @param config 经过处理的配置项.在调用add新增页签时,传入的配置项参数可能不完整(使用默认值),此处的config就是完整的配置项
         * @example
         *  $('#make-tab').omTabs({
         *      onBeforeAdd : function(config) {
         *          console.dir(config);
         *          alert('you will add a tab at position:' + index );
         *      }
         *  });
         */
        onBeforeAdd : function(config/*title, content, url, closable , index*/) {
        },
        /**
         * 当页签使用ajax方式加载内容，加载完成后执行的方法.
         * @name omTabs#onLoadComplete
         * @event
         * @default emptyFn
         * @param tabId 刚加载完成的页签的tabId
         * @example
         *  $('#make-tab').omTabs({
         *      onLoadComplete : function(tabId) {
         *          alert(tabId + 'has just been loaded!' );
         *      }
         *  });
         */
        onLoadComplete : function(tabId) {
        }
        
    };
    /**
     * @name omTabs
     * @author 陈界，李聪平
     * @class 页签布局组件,通过简单的配置就能将页面中的信息组合在各个页签中,同时组件提供丰富的事件支持,比如选中页签,关闭页签,添加页签等等.<br/>
     * 支持各个页签以ajax方式加载内容;支持懒加载;支持页签滚动
     * @constructor
     * @description 构造函数
     * @param p 标准config对象：{width:500, height:300}
     * @example
     * $('#make-tab').omTabs({width:500, height:300});
     */
    $.fn.omTabs = function(p) {
        if (p && typeof(p) == 'string') {
            if (publicMethods[p]) {
                return publicMethods[p].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            return null;
        }
        return this.each(function() {
            var tData = $.data(this, 'omtabs');
            var options;
            if (tData) {
                $.extend(tData.options, p);
            } else {
                options = $.extend({}, defaultConfig, p);
                tData = $.data(this, 'omtabs', {
                    options : options
                });
                $.data(this, 'omtabs').omtabs = makeSketch(this);
                $.data(this, 'omtabs').items = collectItems(this);
            }
            render(this);
            afterRender(this);
            buildEvent(this);
        });
    };
})(jQuery);