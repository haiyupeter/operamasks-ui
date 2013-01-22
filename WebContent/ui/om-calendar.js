/*
 * $Id: om-calendar.js,v 1.109 2012/06/01 06:52:15 linxiaomin Exp $
 * operamasks-ui omCalendar @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 */
/**
 * @name omCalendar
 * @param p 标准config对象 {minDate : new Date(2011, 7, 5), maxDate : new Date(2011, 7, 15)}
 * @class 日历控件。默认通过绑定一个输入域来触发展示，同时也可以直接显示在页面上。<br /> 
 * 日历控件提供了一系列配置项参数和常用的组件api，尽量考虑到各种不同的应用场景。请注意，此控件支持的年份从100到10000。<br /><br/>
 * <b>工具方法:</b>
 * <pre>$.omCalendar.formatDate(date, formatter)</pre>
 * <p>将传入的日期对象date按照formatter格式化成一个string并返回.</p>
 * <pre>$.omCalendar.parseDate(date_string, formatter)</pre>
 * <p>传入的string遵循formatter格式,此时提取日期信息,构建并返回日期对象.</p>
 * <p>两个方法都接收一个格式字符串参数formater，大概像这样："yy-m-d H:i"，<br />
 * 在该字符串中每个字母(如 yy , m 等等)都有严格的定义，如下所示：<br /></p>
 * <b>日期格式定义:</b>
 * <pre>
 * y:   年份(取后面2位字符),<br />
 * yy:  年份(用4位字符表示),<br />
 * m:   月份(数字表示,最少1个字符表示),<br />
 * mm:  月份(数字表示,最少2个字符表示,不足时在前面添加0),<br />
 * d:   日期(最少1个字符表示),<br />
 * dd:  日期(最少2个字符表示,不足时在前面添加0),<br />
 * h:   小时(12小时制,最少2个字符表示,不足时在前面添加0,取值范围00~11),<br />
 * H:   小时(24小时制,最少2个字符表示,不足时在前面添加0,取值范围00~23),<br />
 * g:   小时(12小时制,最少1个字符表示,取值范围0~11),<br />
 * G:   小时(24小时制,最少1个字符表示,取值范围0~23),<br />
 * i:   分钟(最少2个字符表示,取值范围00~59),<br />
 * s:   秒钟(最少2个字符表示,取值范围00~59),<br />
 * u:   毫秒(最少3个字符表示,取值范围000~999),<br />
 * D:   星期的简写(如 Sun, Sat等等),<br />
 * DD:  星期的全名(如 Sunday, Saturday等等),<br />
 * M:   月份的简写(如 Jan, Feb 等等),<br />
 * MM:  月份的全名(如 January, February等),<br />
 * a:   上午下午(小写 am & pm),<br />
 * A:   上午下午(大写 AM & PM),<br />
 * </pre>
 */
;(function($) {
    
    $.omWidget("om.omCalendar", {
        options : {
            /**
             * 默认显示日期。
             * @name omCalendar#date
             * @type Date
             * @default 当前日期
             * @example 
             *   $("#input").omCalendar({date : new Date(2012, 0, 1)});
             */
            date:        new Date(),
            
            /**
             * 下拉框中第一列是星期几（默认起始星期是星期天）。值为0-6的数字，分别代表星期天到星期六。
             * @name omCalendar#startDay
             * @type Number
             * @default 0
             * @example
             *   $("#input").omCalendar({startDay : 1});
             */
            startDay:    0,
            
            /**
             * 下拉框中一次显示几个月。默认只显示一个月。
             * @name omCalendar#pages
             * @type Number
             * @default 1
             * @example
             *   $("#input").omCalendar({pages : 3});
             */
            pages:       1,
            
            /**
             * 最小日期。小于这个日期的日期将禁止选择。
             * @name omCalendar#minDate
             * @type Date
             * @default 无
             * @example
             *   $("#input").omCalendar({minDate : new Date(2010, 0, 1)});
             */
            minDate:  false,
            
            /**
             * 最大日期。大于这个日期的日期将禁止选择。
             * @name omCalendar#maxDate
             * @type Date
             * @default 无
             * @example
             *   $("#input").omCalendar({maxDate : new Date(2010, 0, 1)});
             */
            maxDate:    false,
            
            /**
             * 是否带有input框。设成false时下拉框将不再需要通过输入框得到焦点来让它显示，而是下拉框直接显示在页面上。
             * @name omCalendar#popup
             * @type Boolean
             * @default true
             * @example
             *   <div id="container" />
             *   $("#container").omCalendar({popup : false});
             */
            popup:       true,
            
            /**
             * 是否显示时间。默认情况下只显示日期不显示时间。
             * @name omCalendar#showTime
             * @type Boolean
             * @default false
             * @example
             *   $("#input").omCalendar({showTime : true});
             */
            showTime:    false,
            
            /**
             * 选择日期后触发。
             * @event
             * @name omCalendar#onSelect
             * @type Function
             * @default emptyFn
             * @param date 选中的日期
             * @param event jQuery.Event对象。
             * @example
             *   $("#input").omCalendar({onSelect : function(date,event) {alert(date);}});
             */
            onSelect:    function(date,event) {}, 
            
            /**
             * 不可选的星期。数组类型，里面的元素为 0-6，分别代表星期天到星期六。
             * @name omCalendar#disabledDays
             * @type Array[Number]
             * @default []
             * @example
             *   将星期六和星期天设为不可用:
             *     $("#input").omCalendar({disabledDays : [0, 6]});
             */
            disabledDays : [], 
            
            /**
             * 设置过滤不可选日期方法。
             * @name omCalendar#disabledFn
             * @type Function
             * @default 无
             * @param 未经过滤的日期
             * @example 
             * 大于当月10号的日期不可用
             * $("#input").omCalendar({
             *     disabledFn : function disFn(date) {
             *         var nowMiddle = new Date();
             *         nowMiddle.setDate(10);
             *         if (date > nowMiddle) {
             *             return false;
             *         }
             *     }
             * });
             */
            disabledFn : function(d) {}, 
            
            /**
             * 是否禁用组件。
             * @name omCalendar#disabled
             * @type Boolean
             * @default false
             * @example
             * $("#input").omCalendar({disabled : false});
             */
            disabled : false,
            
            /**
             * 组件是否只读。
             * @name omCalendar#readOnly
             * @type Boolean
             * @default false
             * @example
             * $("#input").omCalendar({readOnly : false});
             */
            readOnly : false,
            
            /**
             * 组件是否可编辑。如果设成false则只可以通过下拉框选择日期，而不能在输入框里直接输入日期。
             * @name omCalendar#editable
             * @type Boolean
             * @default false
             * @example
             * $("#input").omCalendar({editable : true});
             */
            editable : true,
            
            /**
             * 日期格式化。具体的日期格式化参数请参考预览页签。如果设置showtime:false，默认取值为 'yy-mm-dd'，否则为 'yy-mm-dd H:i:s'。
             * @name omCalendar#dateFormat
             * @type String
             * @default 'yy-mm-dd H:i:s'
             * @example
             * $("#input").omCalendar({dateFormat : 'yy-mm-dd'});
             */
            dateFormat : false
        },
        
        /**
         * 将控件设置为不可用。会将input设置为不可用。
         * @name omCalendar#disable
         * @function
         * @returns jQuery对象
         * @example
         * $('#input').omCalendar('disable');
         */
        disable : function() {
            if (this.options.popup) {
                this.hide();
                this.options.disabled = true;
                this.element.attr("disabled", true)
                    .unbind('.omCalendar')
                    .next().addClass('om-state-disabled').unbind();
            }
        }, 
        
        /**
         * 将控件设置为可用状态。会将input设置为可用状态。
         * @name omCalendar#enable
         * @function
         * @returns jQuery对象
         * @example
         * $('#input').omCalendar('enable');
         */
        enable : function() {
            if (this.options.popup) {
                this.options.disabled = false;
                this.element.attr("disabled", false)
                    .next().removeClass('om-state-disabled');
                this._buildStatusEvent();
            }
        },
        
        /**
         * 获取控件选中的日期。
         * @name omCalendar#getDate
         * @function
         * @returns Date
         * @example
         * var date = $('#input').omCalendar('getDate');
         */
        getDate : function(){
                return this.options.date;
        }, 
       
        /**
         * 设置控件选中的日期。
         * @name omCalendar#setDate
         * @function
         * @param Date
         * @returns jQuery 对象
         * @example
         * $('#input').omCalendar('setDate', new Date(2012, 0, 1));
         */
        setDate : function(d) {
            this.options.date = d;
            this._render({date : d});
        },
        
        _create : function() {
            var $self = this.element, opts = this.options;
                this.cid = this._stamp($self);
            
            if (opts.popup) {
                $self.wrap('<span></span>').after('<span class="om-calendar-trigger"></span>')
                    .parent().addClass("om-calendar om-widget om-state-default");
                
                this.con = $('<div></div>').appendTo(document.body).css({
                        'top':'0px',
                        'position':'absolute',
                        'background':'white',
                        'visibility':'hidden',
                        'z-index':'2000'});
                this._buildBodyEvent();
                this._buildStatusEvent();
            } else {
                this.con = this.element;
            }
            
            this.con.addClass('om-calendar-list-wrapper om-widget om-clearfix om-widget-content');
        },
        
        _init : function() {
            var $ele = this.element,
                opts = this.options;
            this.con.addClass('multi-' + opts.pages);
            this._buildParam();
            if (opts.popup) {
                $ele.val() && (opts.date = $.omCalendar.parseDate($ele.val(), opts.dateFormat || this._defaultFormat) || new Date());
            }
            this._render();
            
            if (opts.readOnly || !opts.editable) {
                $ele.attr('readonly', 'readOnly').unbind();
            } else {
                $ele.removeAttr('readonly');
            }
            
            opts.disabled ? this.disable() :  this.enable();
        }, 
        
        _render : function(o) {
            var i = 0,
                _prev,_next,_oym,
                $self = this.element,
                opt = this.options;
            this.ca = [];
            this._parseParam(o);
            
            this.con.html('');

            for (i = 0,_oym = [this.year,this.month]; i < opt.pages; i++) {
                if (i === 0) {
                    _prev = true;
                } else {
                    _prev = false;
                    _oym = this._computeNextMonth(_oym);
                }
                _next = i == (opt.pages - 1);
                this.ca.push(new $.om.omCalendar.Page({
                    year:_oym[0],
                    month:_oym[1],
                    prevArrow:_prev,
                    nextArrow:_next,
                    showTime:self.showTime
                }, this));
                this.ca[i]._render();
            }
            if(opt.pages > 1){
                var calbox = $self.find(".om-cal-box");
                var array = [];
                $.each(calbox, function(i,n){
                    array.push($(n).css("height"));
                });
                array.sort();
                calbox.css("height",array[array.length-1]);
            }
        },
    

        /**
         * 用以给容器打上id的标记,容器有id则返回
         * @method _stamp
         * @param { JQuery-Node }
         * @return { string }
         * @private
         */
        _stamp: function($el){
            if($el.attr('id') === undefined || $el.attr('id')===''){
                $el.attr('id','K_'+ new Date().getTime());
            }
            return $el.attr('id');
        },

        _buildStatusEvent : function() {
            var self = this;
            this.element.unbind('.omCalendar').bind('click.omCalendar', function(e) {
                self.toggle();
            }).bind('focus.omCalendar', function(){
                $(this).parent().addClass('om-state-hover om-state-active');
            }).bind('blur.omCalendar', function(){
                $(this).parent().removeClass('om-state-hover om-state-active');
            }).next().unbind().click(function() {             // icon trigger
                self.element.trigger('focus');
                self.show();
            }).mouseover(function() {
                $(this).parent().addClass('om-state-hover');
            }).mouseout(function() {
                !self.isVisible() && $(this).parent().removeClass('om-state-hover');
            });
        },
        
        _buildBodyEvent: function() {
            var self = this;
            $(document).bind('mousedown.omCalendar', this.globalEvent = function(e) {
                self.hide();
            });
            self.con.mousedown(function(e) {
                e.stopPropagation(); 
            });
        },

        /**
         * 改变日历是否显示的状态
         * @mathod toggle
         */
        toggle: function() {
            if (!this.isVisible()) {
                this.show();
            } else {
                this.hide();
            }
        },
        
        isVisible : function() {
            if (this.con.css('visibility') == 'hidden') {
                return false;
            } 
            return true;
        },

        /**
         * 显示日历
         * @method show
         */
        show: function() {
            var $container = this.element.parent();
            this.con.css('visibility', '');
            var _x = $container.offset().left,
                height = $container.offsetHeight || $container.outerHeight(),
                _y = $container.offset().top + height;
            this.con.css('left', _x.toString() + 'px');
            this.con.css('top', _y.toString() + 'px');
        },

        /**
         * 隐藏日历
         * @method hide
         */
        hide: function() {
            this.con.css('visibility', 'hidden');
        },

		destroy : function() {
        	var $self = this.element;
        	$('body').unbind('.omCalendar' , this.globalEvent);
        	if(this.options.popup){
        		$self.parent().after($self).remove();
        		this.con.remove();
        	}
        },
        
        /**
         * 创建参数列表
         * @method _buildParam
         * @private
         */
        _buildParam: function() {
            var opts = this.options;
            opts.startDay && (opts.startDay = (7 - opts.startDay) % 7);
            !opts.dateFormat &&  (this._defaultFormat = opts.showTime ?  "yy-mm-dd H:i:s" : "yy-mm-dd"); 
            this.EV = [];
            return this;
        },

        /**
         * 过滤参数列表
         * @method _parseParam
         * @private
         */
        _parseParam: function(o) {
            o && $.extend(this.options, o);
            this._handleDate();
        },

        /**
         * 模板函数
         * @method _templetShow
         * @private
         */
        _templetShow: function(templet, data) {
            var str_in,value_s,i,m,value,par;
            if (data instanceof Array) {
                str_in = '';
                for (i = 0; i < data.length; i++) {
                    str_in += arguments.callee(templet, data[i]);
                }
                templet = str_in;
            } else {
                value_s = templet.match(/{\$(.*?)}/g);
                if (data !== undefined && value_s !== null) {
                    for (i = 0,m = value_s.length; i < m; i++) {
                        par = value_s[i].replace(/({\$)|}/g, '');
                        value = (data[par] !== undefined) ? data[par] : '';
                        templet = templet.replace(value_s[i], value);
                    }
                }
            }
            return templet;
        },

        /**
         * 处理日期
         * @method _handleDate
         * @private
         */
        _handleDate: function() {
            var date = this.options.date;
            this.day = date.getDate();//几号
            this.month = date.getMonth();//月份
            this.year = date.getFullYear();//年份
        },

        //get标题
        _getHeadStr: function(year, month) {
            return year.toString() + $.om.lang.omCalendar.year + (Number(month) + 1).toString() + $.om.lang.omCalendar.month;
        },

        //月加
        _monthAdd: function() {
            var self = this;
            if (self.month == 11) {
                self.year++;
                self.month = 0;
            } else {
                self.month++;
            }
            self.options.date.setFullYear(self.year, self.month, 1);
            return this;
        },

        //月减
        _monthMinus: function() {
            var self = this;
            if (self.month === 0) {
                self.year--;
                self.month = 11;
            } else {
                self.month--;
            }
            self.options.date.setFullYear(self.year, self.month, 1);
            return this;
        },

        //裸算下一个月的年月,[2009,11],年:fullYear，月:从0开始计数
        _computeNextMonth: function(a) {
            var _year = a[0],
                _month = a[1];
            if (_month == 11) {
                _year++;
                _month = 0;
            } else {
                _month++;
            }
            return [_year,_month];
        },

        //处理日期的偏移量
        _handleOffset: function() {
            var self = this,
                i18n = $.om.lang.omCalendar,
                data = [i18n.Su, i18n.Mo, i18n.Tu, i18n.We, i18n.Th, i18n.Fr, i18n.Sa],
                temp = '<span>{$day}</span>',
                offset = this.options.startDay,
                day_html = '',
                a = [];
            for (var i = 0; i < 7; i++) {
                a[i] = {
                    day:data[(i - offset + 7) % 7]
                };
            }
            day_html = self._templetShow(temp, a);

            return {
                day_html:day_html
            };
        }
    });
	
	$.extend($.om.omCalendar, {
		Page: function(config, father) {
		    var i18n = $.om.lang.omCalendar;
            //属性
            this.father = father;
            this.month = Number(config.month);
            this.year = Number(config.year);
            this.prevArrow = config.prevArrow;
            this.nextArrow = config.nextArrow;
            this.node = null;
            this.timmer = null;//时间选择的实例
            this.id = '';
            this.EV = [];
            this.html = [
                '<div class="om-cal-box" id="{$id}">',
                '<div class="om-cal-hd om-widget-header">',
                '<a href="javascript:void(0);" class="om-prev {$prev}"><span class="om-icon om-icon-seek-prev">Prev</span></a>',
                '<a href="javascript:void(0);" class="om-title">{$title}</a>',
                '<a href="javascript:void(0);" class="om-next {$next}"><span class="om-icon om-icon-seek-next">Next</span></a>',
                '</div>',
                '<div class="om-cal-bd">',
                '<div class="om-whd">',
                /*
                 '<span>日</span>',
                 '<span>一</span>',
                 '<span>二</span>',
                 '<span>三</span>',
                 '<span>四</span>',
                 '<span>五</span>',
                 '<span>六</span>',
                 */
                father._handleOffset().day_html,
                '</div>',
                '<div class="om-dbd om-clearfix">',
                '{$ds}',
                /*
                 <a href="" class="om-null">1</a>
                 <a href="" class="om-state-disabled">3</a>
                 <a href="" class="om-selected">1</a>
                 <a href="" class="om-today">1</a>
                 <a href="">1</a>
                 */
                '</div>',
                '</div>',
                '<div class="om-setime om-state-default hidden">',
                '</div>',
                '<div class="om-cal-ft {$showtime}">',
                '<div class="om-cal-time om-state-default">',
                '时间：00:00 &hearts;',
                '</div>',
                '</div>',
                '<div class="om-selectime om-state-default hidden">',//<!--用以存放点选时间的一些关键值-->',
                '</div>',
                '</div><!--#om-cal-box-->'
            ].join("");
            this.nav_html = [
                '<p>',
                i18n.month,
                '<select value="{$the_month}">',
                '<option class="m1" value="1">01</option>',
                '<option class="m2" value="2">02</option>',
                '<option class="m3" value="3">03</option>',
                '<option class="m4" value="4">04</option>',
                '<option class="m5" value="5">05</option>',
                '<option class="m6" value="6">06</option>',
                '<option class="m7" value="7">07</option>',
                '<option class="m8" value="8">08</option>',
                '<option class="m9" value="9">09</option>',
                '<option class="m10" value="10">10</option>',
                '<option class="m11" value="11">11</option>',
                '<option class="m12" value="12">12</option>',
                '</select>',
                '</p>',
                '<p>',
                i18n.year,
                '<input type="text" value="{$the_year}" onfocus="this.select()"/>',
                '</p>',
                '<p>',
                '<button class="ok">',
                i18n.ok,
                '</button><button class="cancel">',
                i18n.cancel,
                '</button>',
                '</p>'
            ].join("");


            //方法
            //常用的数据格式的验证
            this.Verify = function() {

                var isDay = function(n) {
                    if (!/^\d+$/i.test(n)){
						return false;
					}
                    n = Number(n);
                    return !(n < 1 || n > 31);

                },
                    isYear = function(n) {
                        if (!/^\d+$/i.test(n)){
							return false;
						}
                        n = Number(n);
                        return !(n < 100 || n > 10000);

                    },
                    isMonth = function(n) {
                        if (!/^\d+$/i.test(n)){
							return false;
						}
                        n = Number(n);
                        return !(n < 1 || n > 12);


                    };

                return {
                    isDay:isDay,
                    isYear:isYear,
                    isMonth:isMonth

                };

            };

            /**
             * 渲染子日历的UI
             */
            this._renderUI = function() {
                var cc = this,_o = {},ft,fOpts = cc.father.options;
                cc.HTML = '';
                _o.prev = '';
                _o.next = '';
                _o.title = '';
                _o.ds = '';
                if (!cc.prevArrow) {
                    _o.prev = 'hidden';
                }
                if (!cc.nextArrow) {
                    _o.next = 'hidden';
                }
                if (!cc.father.showTime) {
                    _o.showtime = 'hidden';
                }
                _o.id = cc.id = 'om-cal-' + Math.random().toString().replace(/.\./i, '');
                _o.title = cc.father._getHeadStr(cc.year, cc.month);
                cc.createDS();
                _o.ds = cc.ds;
                cc.father.con.append(cc.father._templetShow(cc.html, _o));
                cc.node = $('#' + cc.id);
                if (fOpts.showTime) {
                    ft = cc.node.find('.om-cal-ft');
                    ft.removeClass('hidden');
                    cc.timmer = new $.om.omCalendar.TimeSelector(ft, cc.father);
                }
                return this;
            };
            /**
             * 创建子日历的事件
             */
            this._buildEvent = function() {
                var cc = this,i,
                    con = $('#' + cc.id), 
                    fOpts = cc.father.options;

                cc.EV[0] = con.find('div.om-dbd').bind('mousedown', function(e) {
                    //e.preventDefault();
                    var $source = $(e.target);
                    if ($source.filter('.om-null, .om-state-disabled').length > 0){
						return;
					}
                    var selected = Number($source.html());
					//如果当天是30日或者31日，设置2月份就会出问题
                    var d = new Date(fOpts.date);
                    d.setFullYear(cc.year, cc.month, selected);
                    cc.father.dt_date = d;
                    
                    if (!fOpts.showTime) {
                    	cc.father._trigger("onSelect",e,d);
                    }
                    
                    if (fOpts.popup && !fOpts.showTime) {
                        cc.father.hide();
                        if(!isNaN(cc.father.dt_date)){  //解决ie7拖动日期仍然回填的问题，如果不是数字则忽略回填
                            var dateStr = $.omCalendar.formatDate(cc.father.dt_date, fOpts.dateFormat || cc.father._defaultFormat);
                            $(cc.father.element).val(dateStr).focus().blur();
                        }
                    }
                    cc.father._render({date:d});
                }).find('a').bind('mouseover',function(e){
                    $(this).addClass('om-state-hover om-state-nobd');
                }).bind('mouseout',function(e){
                    $(this).removeClass('om-state-hover')
                        .not('.om-state-highlight, .om-state-active')
                        .removeClass('om-state-nobd');
                });
                //向前
                cc.EV[1] = con.find('a.om-prev').bind('click', function(e) {
                    cc.father._monthMinus()._render();
                    return false;
                });
                //向后
                cc.EV[2] = con.find('a.om-next').bind('click', function(e) {
                    cc.father._monthAdd()._render();
                    return false;
                });
                cc.EV[3] = con.find('a.om-title').bind('click', function(e) {
                    try {
                        cc.timmer.hidePopup();
                    } catch(exp) {
                    }
                    var $source = $(e.target);
                    var in_str = cc.father._templetShow(cc.nav_html, {
                        the_month:cc.month + 1,
                        the_year:cc.year
                    });
                    con.find('.om-setime').html(in_str)
	                    .removeClass('hidden')
                        .find("option:[value=" + (cc.month + 1) + "]").attr("selected", "selected");
                    this.blur();   
                    con.find('input').bind('keydown', function(e) {
                        var $source = $(e.target);
                        if (e.keyCode == $.om.keyCode.UP) {
                            $source.val(Number($source.val()) + 1);
                            $source[0].select();
                        }
                        if (e.keyCode == $.om.keyCode.DOWN) {
                            $source.val(Number($source.val()) - 1);
                            $source[0].select();
                        }
                        if (e.keyCode == $.om.keyCode.ENTER) {
                            var _month = con.find('.om-setime select').val();
                            var _year = con.find('.om-setime input').val();
                            con.find('.om-setime').addClass('hidden');
                            if (!cc.Verify().isYear(_year)){
								return;
							}
                            if (!cc.Verify().isMonth(_month)){
								return;
							}
                            cc.father._render({
                                date : cc._computeDate(cc, _year, _month)
                            });
                        }
                    });
                    return false;
                }).bind("mouseover", function(e){
                    $(this).addClass("om-state-hover");
                }).bind("mouseout", function(e){
                    $(this).removeClass("om-state-hover");
                });
                cc.EV[4] = con.find('.om-setime').bind('click', function(e) {
                    e.preventDefault();
                    var $source = $(e.target),
                        $this = $(this);
                    if ($source.hasClass('ok')) {
                        var _month = $this.find('select').val(),
                            _year = $this.find('input').val();
                        $this.addClass('hidden');
                        if (!cc.Verify().isYear(_year)){
							return;
						}
                        if (!cc.Verify().isMonth(_month)){
							return;
						}
                        _month = _month - $this.parent().prevAll('.om-cal-box').length - 1;
                        cc.father._render({
                            date: cc._computeDate(cc, _year, _month)
                        });
                    } else if ($source.hasClass('cancel')) {
                        $this.addClass('hidden');
                    }
                });
            };
            
            this._computeDate = function(cc, year, month) {
                var result = new Date(cc.father.options.date.getTime());
                result.setFullYear(year, month);
                return result;
            };
            
            /**
             * 得到当前子日历的node引用
             */
            this._getNode = function() {
                var cc = this;
                return cc.node;
            };
            /**
             * 得到某月有多少天,需要给定年来判断闰年
             */
            this._getNumOfDays = function(year, month) {
                return 32 - new Date(year, month - 1, 32).getDate();
            };
            /**
             * 生成日期的html
             */
            this.createDS = function() {
                var cc = this,
                    fOpts = cc.father.options,
                    s = '',
                    startweekday = (new Date(cc.year + '/' + (cc.month + 1) + '/01').getDay() + fOpts.startDay + 7) % 7,//当月第一天是星期几
                    k = cc._getNumOfDays(cc.year, cc.month + 1) + startweekday,
                    i, _td_s;
                
                
                var _dis_days = [];
                for (i = 0; i < fOpts.disabledDays.length; i++) {
                    _dis_days[i] = fOpts.disabledDays[i] % 7;
                }

                for (i = 0; i < k; i++) {
                    var _td_e = new Date(cc.year + '/' + Number(cc.month + 1) + '/' + (i + 1 - startweekday).toString());
                    if (i < startweekday) {//null
                        s += '<a href="javascript:void(0);" class="om-null" >0</a>';
                    } else if ($.inArray((i + fOpts.startDay) % 7, _dis_days) >= 0) {
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                    } else if (fOpts.disabledFn(_td_e) === false) {
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                    } else if (fOpts.minDate instanceof Date &&
                        new Date(cc.year + '/' + (cc.month + 1) + '/' + (i + 1 - startweekday)).getTime() < (fOpts.minDate.getTime() + 1)) {//disabled
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';

                    } else if (fOpts.maxDate instanceof Date &&
                        new Date(cc.year + '/' + (cc.month + 1) + '/' + (i + 1 - startweekday)).getTime() > fOpts.maxDate.getTime()) {//disabled
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                    } else if (i == (startweekday + (new Date()).getDate() - 1) &&
                        (new Date()).getFullYear() == cc.year  &&
                        (new Date()).getMonth() == cc.month) {//today
                        s += '<a href="javascript:void(0);" class="om-state-highlight om-state-nobd">' + (i - startweekday + 1) + '</a>';

                    } else if (i == (startweekday + fOpts.date.getDate() - 1) &&
                        cc.month == fOpts.date.getMonth() &&
                        cc.year == fOpts.date.getFullYear()) {//selected
                        s += '<a href="javascript:void(0);" class="om-state-active om-state-nobd">' + (i - startweekday + 1) + '</a>';
                    } else {//other
                        s += '<a href="javascript:void(0);">' + (i - startweekday + 1) + '</a>';
                    }
                }
                if (k % 7 !== 0) {
                    for (i = 0; i < (7 - k % 7); i++) {
                        s += '<a href="javascript:void(0);" class="om-null">0</a>';
                    }
                }
                cc.ds = s;
            };
            /**
             * 渲染
             */
            this._render = function() {
                var cc = this;
                cc._renderUI();
                cc._buildEvent();
            };


        }//Page constructor over
    });
	
	$.extend($.om.omCalendar, {
        /**
         * 时间选择构造器
         * @constructor Calendar.TimerSelector
         * @param {object} ft ,timer所在的容器
         * @param {object} father 指向Calendar实例的指针，需要共享父框的参数
         */
        TimeSelector:function(ft, father) {
            //属性
            var date = father.options.date,
                i18n = $.om.lang.omCalendar;
            
            this.father = father;
            this.fcon = ft.parent('.om-cal-box');
            this.popupannel = this.fcon.find('.om-selectime');//点选时间的弹出层
            if (typeof date == 'undefined') {//确保初始值和当前时间一致
                father.options.date = new Date();
            }
            this.time = father.options.date;
            this.status = 's';//当前选择的状态，'h','m','s'依次判断更新哪个值
            this.ctime = $('<div class="om-cal-time om-state-default">' + i18n.time + '：<span class="h">h</span>:<span class="m">m</span>:<span class="s">s</span><!--{{arrow--><div class="cta"><button class="u om-icon om-icon-triangle-1-n"></button><button class="d om-icon om-icon-triangle-1-s"></button></div><!--arrow}}--></div>');
            this.button = $('<button class="ct-ok om-state-default">' + i18n.ok +'</button>');
            //小时
            this.h_a = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
            //分钟
            this.m_a = ['00','10','20','30','40','50'];
            //秒
            this.s_a = ['00','10','20','30','40','50'];


            //方法
            /**
             * 创建相应的容器html，值均包含在a中
             * 参数：要拼装的数组
             * 返回：拼好的innerHTML,结尾还要带一个关闭的a
             *
             */
            this.parseSubHtml = function(a) {
                var in_str = '';
                for (var i = 0; i < a.length; i++) {
                    in_str += '<a href="javascript:void(0);" class="om-cal-item">' + a[i] + '</a>';
                }
                in_str += '<a href="javascript:void(0);" class="x">x</a>';
                return in_str;
            };
            /**
             * 显示om-selectime容器
             * 参数，构造好的innerHTML
             */
            this.showPopup = function(instr) {
                var self = this;
                this.popupannel.html(instr);
                this.popupannel.removeClass('hidden');
                var status = self.status;
                var active_cls = "om-state-active om-state-nobd";
                self.ctime.find('span').removeClass(active_cls);
                switch (status) {
                    case 'h':
                        self.ctime.find('.h').addClass(active_cls);
                        break;
                    case 'm':
                        self.ctime.find('.m').addClass(active_cls);
                        break;
                    case 's':
                        self.ctime.find('.s').addClass(active_cls);
                        break;
                }
            };
            /**
             * 隐藏om-selectime容器
             */
            this.hidePopup = function() {
                this.popupannel.addClass('hidden');
            };
            /**
             * 不对其做更多的上下文假设，仅仅根据time显示出来
             */
            this._render = function() {
                var self = this;
                var h = self.get('h');
                var m = self.get('m');
                var s = self.get('s');
                self.father._time = self.time;
                self.ctime.find('.h').html(h);
                self.ctime.find('.m').html(m);
                self.ctime.find('.s').html(s);
                return self;
            };
            //这里的set和get都只是对time的操作，并不对上下文做过多假设
            /**
             * set(status,v)
             * h:2,'2'
             */
            this.set = function(status, v) {
                var self = this;
                v = Number(v);
                switch (status) {
                    case 'h':
                        self.time.setHours(v);
                        break;
                    case 'm':
                        self.time.setMinutes(v);
                        break;
                    case 's':
                        self.time.setSeconds(v);
                        break;
                }
                self._render();
            };
            /**
             * get(status)
             */
            this.get = function(status) {
                var self = this;
                var time = self.time;
                switch (status) {
                    case 'h':
                        return time.getHours();
                    case 'm':
                        return time.getMinutes();
                    case 's':
                        return time.getSeconds();
                }
            };

            /**
             * add()
             * 状态值代表的变量增1
             */
            this.add = function() {
                var self = this;
                var status = self.status;
                var v = self.get(status);
                v++;
                self.set(status, v);
            };
            /**
             * minus()
             * 状态值代表的变量增1
             */
            this.minus = function() {
                var self = this;
                var status = self.status;
                var v = self.get(status);
                v--;
                self.set(status, v);
            };


            //构造
            this._timeInit = function() {
                var self = this;
                ft.html('').append(self.ctime);
                ft.append(self.button);
                self._render();
				//TODO:
                self.popupannel.bind('click', function(e) {
                    var el = $(e.target);
                    if (el.hasClass('x')) {//关闭
                        self.hidePopup();
                    } else if (el.hasClass('om-cal-item')) {//点选一个值
                        var v = Number(el.html());
                        self.set(self.status, v);
                        self.hidePopup();
                    }
                });
                //确定的动作
                self.button.bind('click', function(e) {
                    //初始化读取父框的date
                    var fOpts = self.father.options;
                    var d = typeof self.father.dt_date == 'undefined' ? fOpts.date : self.father.dt_date;
                    d.setHours(self.get('h'));
                    d.setMinutes(self.get('m'));
                    d.setSeconds(self.get('s'));
                    self.father._trigger("onSelect",e,d);
                    if (fOpts.popup) {
                        var dateStr = $.omCalendar.formatDate(d, fOpts.dateFormat || self.father._defaultFormat);
                        $(self.father.element).val(dateStr);
                        self.father.hide();
                    }
                });
                //ctime上的键盘事件，上下键，左右键的监听
                //TODO 考虑是否去掉
                self.ctime.bind('keyup', function(e) {
                    if (e.keyCode == $.om.keyCode.UP || e.keyCode == $.om.keyCode.LEFT) {//up or left
                        //e.stopPropagation();
                        e.preventDefault();
                        self.add();
                    }
                    if (e.keyCode == $.om.keyCode.DOWN || e.keyCode == $.om.keyCode.RIGHT) {//down or right
                        //e.stopPropagation();
                        e.preventDefault();
                        self.minus();
                    }
                });
                //上的箭头动作
                self.ctime.find('.u').bind('click', function() {
                    self.hidePopup();
                    self.add();
                });
                //下的箭头动作
                self.ctime.find('.d').bind('click', function() {
                    self.hidePopup();
                    self.minus();
                });
                //弹出选择小时
                self.ctime.find('.h').bind('click', function() {
                    var in_str = self.parseSubHtml(self.h_a);
                    self.status = 'h';
                    self.showPopup(in_str);
                });
                //弹出选择分钟
                self.ctime.find('.m').bind('click', function() {
                    var in_str = self.parseSubHtml(self.m_a);
                    self.status = 'm';
                    self.showPopup(in_str);
                });
                //弹出选择秒
                self.ctime.find('.s').bind('click', function() {
                    var in_str = self.parseSubHtml(self.s_a);
                    self.status = 's';
                    self.showPopup(in_str);
                });
            };
            this._timeInit();
        }

    });
	
	$.omCalendar = $.omCalendar || {};
	
	$.extend($.omCalendar, {
        leftPad : function (val, size, ch) {
            var result = new String(val);
            if(!ch) {
                ch = " ";
            }
            while (result.length < size) {
                result = ch + result;
            }
            return result.toString();
        }
    });
	$.extend($.omCalendar, {
	    getShortDayName : function(day){
            return $.omCalendar.dayMaps[day][0];
        },
        getDayName : function (day) { 
            return $.omCalendar.dayMaps[day][1];
        },
	    
        getShortMonthName : function(month){
            return $.omCalendar.monthMaps[month][0];
	    },
	    getMonthName : function (month) { 
	        return $.omCalendar.monthMaps[month][1];
	    },
	    dayMaps : [
            ['Sun', 'Sunday'],
	        ['Mon', 'Monday'],
	        ['Tue', 'Tuesday'],
	        ['Wed', 'Wednesday'],
	        ['Thu', 'Thursday'],
	        ['Fri', 'Friday'],
	        ['Sat', 'Saturday']
	    ],
	    monthMaps : [
            ['Jan', 'January'],
            ['Feb', 'February'],
            ['Mar', 'March'],
            ['Apr', 'April'],
            ['May', 'May'],
            ['Jun', 'June'],
            ['Jul', 'July'],
            ['Aug', 'August'],
            ['Sep', 'September'],
            ['Oct', 'October'],
            ['Nov', 'November'],
            ['Dec', 'December']
        ],
        /**
         * g: getter method
         * s: setter method
         * r: regExp
         */
        formatCodes : {
	        //date
	        d: {
	            g: "this.getDate()", //date of month (no leading zero)
	            s: "this.setDate({param})",
	            r: "(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"
	        },
	        dd: {
	            g: "$.omCalendar.leftPad(this.getDate(), 2, '0')", //date of month (two digit)
	            s: "this.setDate(parseInt('{param}', 10))",
	            r: "(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"
	        },
	         
	        //month
	        m: {
	            g: "(this.getMonth() + 1)", // get month in one digits, no leading zero
	            s: "this.setMonth(parseInt('{param}', 10) - 1)",
	            r: "(0[1-9]|1[0-2]|[1-9])"
	        },
	        mm: { 
	            g: "$.omCalendar.leftPad(this.getMonth() + 1, 2, '0')",
	            s: "this.setMonth(parseInt('{param}', 10) - 1)",
	            r: "(0[1-9]|1[0-2]|[1-9])"
	        },
	        
	        //year
	        y: {
	            g: "('' + this.getFullYear()).substring(2, 4)", // get year in 2 digits
	            s: "this.setFullYear(parseInt('20{param}', 10))",
	            r: "(\\d{2})"
	        },
	        yy: {
	            g: "this.getFullYear()", // get year in 4 digits
	            s: "this.setFullYear(parseInt('{param}', 10))",
	            r: "(\\d{4})"
	        },
	        
	        //hour
	        h: {
	            g: "$.omCalendar.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",// 12 hours, two digits
	            s: "this.setHours(parseInt('{param}', 10))", // TODO,need to be fixed
	            r: "(0[0-9]|1[0-1])" // 00~11
	        },
            H: {
                g: "$.omCalendar.leftPad(this.getHours(), 2, '0')",   //24 hours, two digits
                s: "this.setHours(parseInt('{param}', 10))",
                r: "([0-1][0-9]|2[0-3])"   //00~23
            },
            g: {
                g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)", // 12 hours, no leading 0
                s: "this.setHours(parseInt('{param}', 10))", // TODO,need to be fixed
                r: "([0-9]|1[0-1])" // 0, 1, 2, 3, ..., 11
            },
            G: {
                g: "this.getHours()",   // 24 hours, no leading 0
                s: "this.setHours(parseInt('{param}', 10))",
                r: "([0-9]|1[0-9]|2[0-3])" //0, 1, 2, 3, ..., 23
            },
            
            //minute
            i: {
                g: "$.omCalendar.leftPad(this.getMinutes(), 2, '0')", // get minute (two digits)
                s: "this.setMinutes(parseInt('{param}', 10))",
                r: "([0-5][0-9])" //00, 01, 02, ..., 59
            }, 
            
            //second
            s: {
                g: "$.omCalendar.leftPad(this.getSeconds(), 2, '0')", // get seconds (two digits)
                s: "this.setSeconds(parseInt('{param}', 10))",
                r: "([0-5][0-9])" //00, 01, 02, ..., 59
            },
            
            // millisecond
            u: {
                g: "$.omCalendar.leftPad(this.getMilliseconds(), 3, '0')",
                s: "this.setMilliseconds(parseInt('{param}', 10))",
                r: "(\\d{1,3})" //0, 1, 2, ..., 999
            },
            
            //localised names
            D: {
                g: "$.omCalendar.getShortDayName(this.getDay())", // get localised short day name
                s: "",
                r: ""
            },
            DD: {
                g: "$.omCalendar.getDayName(this.getDay())", // get localised long day name
                s: "",
                r: ""
            },
            
            M: {
                g: "$.omCalendar.getShortMonthName(this.getMonth())", // get localised short month name
                s: "",
                r: ""
            },
            MM: {
                g: "$.omCalendar.getMonthName(this.getMonth())", // get localised long month name
                s:"",
                r:""
            },
            
            //am & pm
            a: {
                g: "(this.getHours() < 12 ? 'am' : 'pm')", // am pm
                s: "",
                r: ""
            },
            A: {
                g: "(this.getHours() < 12 ? 'AM' : 'PM')", // AM PM
                s: "",
                r: ""
            }
        }
	});
	$.extend($.omCalendar, {
		
	    formatDate : function(date, formatter){
	        if (!date || !formatter) {
	            return null;
	        }
	        if (!(Object.prototype.toString.call(date) === '[object Date]')) {
	            return null;
	        }
	        var i, fi , result = '', literal = false;
	        for (i = 0; i < formatter.length ; i++ ) {
	            fi = formatter.charAt(i);
	            fi_next = formatter.charAt(i + 1);
	            if (fi == "'") {
	                literal = !literal;
	                continue;
	            }
	            if (!literal && $.omCalendar.formatCodes[fi + fi_next]) {
	                fi = new Function("return " + $.omCalendar.formatCodes[fi + fi_next].g).call(date);
	                i ++;
	            } else if (!literal && $.omCalendar.formatCodes[fi]) {
	                fi = new Function("return " + $.omCalendar.formatCodes[fi].g).call(date);
	            }
	            result += fi;
	        }
	        return result;
	        
	    },
	    parseDate : function(date_string, formatter){
	        if (!date_string || !formatter) {
	            return null;
	        }
	        if (!(Object.prototype.toString.call(date_string) === '[object String]')) {
	            return null;
	        }
	        var setterArr = [], i, fi, $fci = null, m_result;
	        for (i = 0 ; i < formatter.length; i ++) {
	            fi = formatter.charAt(i);
	            fi_next = formatter.charAt(i + 1);
	            if ($.omCalendar.formatCodes[fi + fi_next]) {
	                $fci = $.omCalendar.formatCodes[fi + fi_next];
                    i ++;
                } else if ($.omCalendar.formatCodes[fi]) {
                    $fci = $.omCalendar.formatCodes[fi];
                } else {
                    continue;
                }
	            m_result = date_string.match(new RegExp($fci.r));
	            if (!m_result) {
	                // your string and your formmatter is not matched!
	                return null;
	            }
	            setterArr.push($fci.s.replace('{param}', m_result[0]));
	            date_string = date_string.substring(m_result.index + m_result[0].length);
	            var newChar = formatter.charAt(i + 1);
	            if (!(newChar == "" && date_string == "") 
	                    && (newChar !== date_string.charAt(0))
	                    && ($.omCalendar.formatCodes[newChar] === undefined)) {
	                // your string and your formmatter is not matched!
                    return null;
                }
	        }
	        var date = new Date();
	        new Function(setterArr.join(";")).call(date);
	        return date;
	    }
	});
	
	$.om.lang.omCalendar = {
        year : '年',
        month : '月',
        Su : '日',
        Mo : '一',
        Tu : '二',
        We : '三',
        Th : '四',
        Fr : '五',
        Sa : '六',
        cancel : '取消',
        ok : '确定',
        time : '时间'
    };
})(jQuery);