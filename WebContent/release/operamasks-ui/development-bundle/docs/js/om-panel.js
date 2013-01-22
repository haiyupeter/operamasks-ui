/**
 * $('#divId').omPanel({ width : 400, height : 400, noHeader : false, title :
 * 'PanelTitle1', content : 'This is panel Content' // innerHTML //collapsible :
 * true,
 * 
 * });
 */
(function() {

    var defaultConfig = {
        title : null,
        iconCls : null,
        width : "auto",
        height : "auto",
        left : null,
        top : null,
        cls : null,
        headerCls : null,
        bodyCls : null,
        style : {},
        href : null,
        cache : true,
        fit : false,
        border : true, //TODO
        doSize : true,
        noHeader : false,
        content : null,
        url : null,
        collapsible : false,
        minimizable : false,
        maximizable : false,
        closable : false,
        collapsed : false,
        minimized : false,
        maximized : false,
        closed : false,
        tools : [],
        lazyLoad : false,
        loadingMessage : "Loading...",
        extractor : function(_67) {
            var _68 = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
            var _69 = _68.exec(_67);
            if (_69) {
                return _69[1];
            } else {
                return _67;
            }
        },
        onLoad : function() {
        },
        onBeforeOpen : function() {
        },
        onOpen : function() {
        },
        onBeforeClose : function() {
        },
        onClose : function() {
        },
        onBeforeDestroy : function() {
        },
        onDestroy : function() {
        },
        onResize : function(_6a, _6b) {
        },
        onMove : function(_6c, top) {
        },
        onMaximize : function() {
        },
        onRestore : function() {
        },
        onMinimize : function() {
        },
        onBeforeCollapse : function() {
        },
        onBeforeExpand : function() {
        },
        onCollapse : function() {
        },
        onExpand : function() {
        }
    };
    function wrapInPanel(self) {
        var panel = $(self).addClass('om-panel-body').wrap(
                '<div class="om-panel"></div>').parent();
        return panel;
    };

    function render(self) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel,
            styles = panel.attr('style');
        if ((styles && styles.indexOf('width') != -1 )|| options.width == 'auto') {
        	//just use it, do nothing 
        } else if (options.width == 'fit') {
        	panel.css('width', '100%');
        } else if ( !!options.width ){
        	//other height value, use it anyway
            panel.css('width', options.width);
        }
        if ((styles && styles.indexOf('height') != -1 )|| options.height == 'auto') {
        	//just use it, do nothing 
        } else if (options.height == 'fit') {
        	panel.css('height', '100%');
        } else if ( !!options.height ){
        	//other height value, use it anyway
            panel.css('height', options.height);
        }
        renderHeader(self);
        renderBody(self);
    };

    function renderHeader(self) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        if (options.title && !options.noHeader) {
            var header = $('<div class="om-panel-header"></div>').prependTo(
                    panel);
            var title = $('<div class="om-panel-title"></div>')
                    .appendTo(header).html(options.title);
            if (options.iconCls) {
                title.addClass('om-panel-with-icon');
                var icon = $('<div class="om-panel-icon"></div>').appendTo(
                        header);
                icon.addClass(options.iconCls);
            }
            var tools = $('<div class="om-panel-tool"></div>').appendTo(header);
            var closeIcon, minIcon, maxIcon, collapseIcon;
            if (contain(options.tools, 'collapse')) {
                minIcon = $('<div class="om-panel-tool-collapse"></div>')
                        .prependTo(tools);
            }
            if (contain(options.tools, 'min')) {
                minIcon = $('<div class="om-panel-tool-min"></div>').prependTo(
                        tools);
            }
            if (contain(options.tools, 'max')) {
                maxIcon = $('<div class="om-panel-tool-max"></div>').prependTo(
                        tools);
            }
            if (options.closable || contain(options.tools, 'close')) {
                closeIcon = $('<div class="om-panel-tool-close"></div>')
                        .prependTo(tools);
            }
        }

        function contain(array, key) {
            var i = array.length;
            while (i--)
                if (array[i] == key) {
                    return true;
                }
            return false;
        };

    };
    function renderBody(self) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel,
            body = panel.find('>.om-panel-body');
        
        if (options.noHeader || !options.title) {
            body.addClass('om-panel-body-noheader');
        } else {
            body.removeClass('om-panel-body-noheader');
        }
        // apply content
        if (!options.lazyLoad ) {
            _reload(self);
        }
        // border
        if (options.border == false) {
            body.addClass('om-panel-body-noborder');
        } else {
            body.removeClass('om-panel-body-noborder');
        }
        
        // adjust height.
        var styles = body.attr('style');
        if (( styles && styles.indexOf('height') != -1 ) || options.height == 'auto' ) {
        	//just leave it , do nothing
        } else {
        	// fit the parent
        	var pwm = body.outerHeight() - body.height();// paddings + margins + line-width
        	body.css('height', panel.innerHeight() - panel.find('>.om-panel-header').outerHeight() - pwm);
        }
        // adjust margins
        panel.css({
            'marginTop' : body.css('marginTop'),
            'marginRight' : body.css('marginRight'),
            'marginBottom' : body.css('marginBottom'),
            'marginLeft' : body.css('marginLeft')
        });
        body.css({
            'marginTop' : 0,
            'marginRight' : 0,
            'marginBottom' : 0,
            'marginLeft' : 0
        });

    };

    function afterRender(self) {
        // handle panel status
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        if (options.closed == true) {
            $(self).omPanel('close');
        } else if (options.maximized == true) {
            $(self).omPanel('maximize');
        } else if (options.minimized == true) {
            $(self).omPanel('minimize');
        }
        if (options.closed) {
            $(self).omPanel('close');
        }
        
    };

    function buildEvent(self) {
        // attachEvents
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel,
            tools = panel.find('div.om-panel-header > div.om-panel-tool');
        tools.find('.om-panel-tool-close').click(function() {
            $(self).omPanel('close', true);
            return false;
        });
        tools.find('.om-panel-tool-max').click(function() {
            alert('not implemented yet!');
            return false;
        });
        var minimize = tools.find('.om-panel-tool-min').click(function() {
            alert('not implemented yet!');
            return false;
        });
        tools.find('.om-panel-tool-collapse').click(function() {
            if (options.collapsed == true) {
                $(self).omPanel('expand', true);
            } else {
                $(self).omPanel('collapse', true);
            }
            return false;
        });
    };

    // private methods
    // show and hide
    function _show(self, anim, speed) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        if (options.onBeforeOpen.call(self) == false) {
            return false;
        }
        if (!data.isLoaded) {
            _reload(self);
        }
        if (anim == true) {
            panel.fadeIn(speed || 'normal', function() {
                options.closed = false;
                options.minimized = false;
                options.onOpen.call(self);
            });
        } else {
            panel.show();
            options.closed = false;
            options.minimized = false;
            options.onOpen.call(self);
        }

    };
    function _hide(self, anim, speed) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        if (options.onBeforeClose.call(self) == false) {
            return false;
        }
        if (anim == true) {
            panel.fadeOut(speed || 'normal', function() {
                options.closed = true;
                options.onClose.call(self);
            });
        } else {
            panel.hide();
            options.closed = true;
            options.onClose.call(self);
        }

    };

    // collapse and expand
    function _collapse(self, anim, speed) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        var collapse = panel.find('div.om-panel-tool-collapse');
        if (collapse.length == 0) {
            return;
        }
        if (options.onBeforeCollapse.call(self) == false) {
            return false;
        }

        collapse.removeClass('om-panel-tool-collapse').addClass(
                'om-panel-tool-expand');

        if (anim) {
            panel.find('div.om-panel-body').slideUp(speed || 'slow', function() {
                options.collapsed = true;
                options.onCollapse.call(self);
            });
        } else {
            panel.find('div.om-panel-body').hide();
            options.collapsed = true;
            options.onCollapse.call(self);
        }

    };
    function _expand(self, anim, speed) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        var expand = panel.find('div.om-panel-tool-expand');
        if (expand.length == 0) {
            reutrn;
        }
        if (options.onBeforeExpand.call(self) == false) {
            return false;
        }

        expand.removeClass('om-panel-tool-expand').addClass(
                'om-panel-tool-collapse');

        if (anim) {
            panel.find('div.om-panel-body').slideDown(speed || 'normal', function() {
                options.collapsed = false;
                options.onExpand.call(self);
            });
        } else {
            panel.find('div.om-panel-body').show();
            options.collapsed = false;
            options.onExpand.call(self);
        }

    };

    // title and content
    function _setTitle(self, title) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        options.title = title;
        panel.find('div.om-panel-title').html(title);
    };
    function _setDataSource(self, ds, isAjax) {
        if (!ds) {
            return false;
        }
        var options = $.data(self, 'panel').options;
        options.content = options.url = null;
        isAjax == true ? options.url = ds : options.content = ds;
        $.data(self, 'panel').isLoaded = false;
    };
    
    //使用options.content和options.url重新装载数据
    function _reload(self) {
        var data = $.data(self, 'panel'),
            options = data.options,
            panel = data.panel;
        var body = panel.find('>.om-panel-body');
        if ($.data(self, 'panel').isLoading ){
            return;
        };
        data.isLoading = true;
        if (!!$.trim(options.content)) {
            //content 为文本
            body.empty();
            body.html(options.content);
            data.isLoaded = true;
            data.isLoading = false;
            options.onLoad.call(self);
        } else if (options.url) {
            body.load(options.url, function(res,status,xhr){
                if (status == 'success'){
                    $.data(self, "panel").isLoaded = true;
                    $.data(self, 'panel').isLoading = false;
                    options.onLoad.call(self);
                }
            });
        } else {
            data.isLoading = false;
        }
    }

    // ---end private methods

    // public methods
    var publicMethods = {
        options : function(p) {
            var options = $.data(this[0], "panel").options;
            if (p) {
                $.extend(options, p);
            }
            return options;
        },
        panel : function() {
            return $.data(this[0], "panel").panel;
        },
        header : function() {
            return $.data(this[0], "panel").panel.find(">div.om-panel-header");
        },
        body : function() {
            return $.data(this[0], "panel").panel.find(">div.om-panel-body");
        },
        setTitle : function(title) {
            return this.each(function() {
                _setTitle(this, title);
            });
        },
        setDataSource : function(ds, isAjax) {
            return this.each(function() {
                _setDataSource(this, ds, isAjax);
            });
        },
        open : function(anim, speed) {
            return this.each(function() {
                _show(this, anim, speed);
            });
        },
        close : function(anim, speed) {
            return this.each(function() {
                _hide(this, anim, speed);
            });
        },
        collapse : function(anim, speed) {
            return this.each(function() {
                _collapse(this, anim, speed);
            });
        },
        expand : function(anim, speed) {
            return this.each(function() {
                _expand(this, anim, speed);
            });
        },

        reload : function(ds, isAjax) {
            return this.each(function() {
                $.data(this, "panel").isLoaded = false;
                _setDataSource(this, ds, isAjax);
                _reload(this);
            });
        },
        
        destroy : function(_60) {
            return this.each(function() {
                _30(this, _60);
            });
        },
        resize : function(_62) {
            return this.each(function() {
                resize(this, _62);
            });
        },
        move : function(_63) {
            return this.each(function() {
                _a(this, _63);
            });
        },
        maximize : function() {
            return this.each(function() {
                _2a(this);
            });
        },
        minimize : function() {
            return this.each(function() {
                _46(this);
            });
        },
        restore : function() {
            return this.each(function() {
                _4a(this);
            });
        }

    };

    $.fn.omPanel = function(p) {
        if (p && typeof (p) == 'string') {
            if (publicMethods[p]) {
                return publicMethods[p].apply(this, Array.prototype.slice.call(
                        arguments, 1));
            }
            return null;
        }
        return this.each(function() {
            var pData = $.data(this, 'panel');
            var options;
            if (pData) {
                $.extend(pData.options, p);
            } else {
                options = $.extend({}, defaultConfig, p);
                pData = $.data(this, 'panel', {
                    options : options,
                    panel : wrapInPanel(this),
                    isLoaded : false,
                    isLoading : false
                });
            }
            render(this);
            afterRender(this);
            buildEvent(this);
        });
    };

})(jQuery);