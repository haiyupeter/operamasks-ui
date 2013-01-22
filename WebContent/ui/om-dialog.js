/*
 * $Id: om-dialog.js,v 1.34 2012/06/18 08:49:06 linxiaomin Exp $
 * operamasks-ui omDialog @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-core.js
 *  om-button.js
 *  om-draggable.js
 *  om-mouse.js
 *  om-position.js
 *  om-resizable.js
 */
(function( $, undefined ) {

var uiDialogClasses =
		'om-dialog ' +
		'om-widget ' +
		'om-widget-content ' +
		'om-corner-all ',
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},
	// support for jQuery 1.3.2 - handle common attrFn methods for dialog
	attrFn = $.attrFn || {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true,
		click: true
	};

	/**
     * @name omDialog
     * @class 对话框组件。可以放置html。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>方便地自定义按钮</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#dialog').omDialog({
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;div id="dialog"/>
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
$.omWidget("om.omDialog", {
	options: /** @lends omDialog#*/ {
	    /**
         * 对话框创建完成后是否自动打开。
         * @type Boolean
         * @default true
         * @example
         *   $("#select").omDialog({autoOpen : true});
         */
		autoOpen: true,
		
		/**
         * 对话框中的按钮。此配置项为JSON数组。每个JSON对象具有 <code>text</code> 属性(配置按钮文字)
         * 和 <code>click</code> 属性配置按钮触发时的回调方法。
         * @type Array
         * @default []
         *  @example
         *   $("#select").omDialog({buttons : [{
         *      text : "确定", 
         *      click : function () {...}
         *  }, {
         *      text : "取消", 
         *      click : function () {...}
         *  }]);
         */
		buttons: {},
		
		/**
		 * 按下 Esc 键时是否关闭对话框。
		 * @type Boolean
		 * @default true
		 * @example
         *   $("#select").omDialog({closeOnEscape : true});
		 */
		closeOnEscape: true,
		closeText: 'close',
		
		/**
		 * 对话框的样式。
		 * @type String
		 * @default 无
		 * @example
         *   $("#select").omDialog({dialogClass : 'class1'});
		 */
		dialogClass: '',
		
		/**
		 * 组件是否可拖动。
		 * @type Boolean
		 * @default true
		 * @example
         *   $("#select").omDialog({draggable : true});
		 */
		draggable: true,
		
		hide: null,
		
		/**
		 * 组件的高度。
		 * @type Number
		 * @default 'auto'
		 * @example
         *   $("#select").omDialog({height : 200});
		 */
		height: 'auto',
		
		/**
		 * 可改变大小时组件最大高度。
		 * @type Number
		 * @default 无
		 * @example
         *   $("#select").omDialog({maxHeight : 500});
		 */
		maxHeight: false,
		
		/**
		 * 可改变大小时组件最大宽度。
		 * @type Number
		 * @default 无
		 * @example
         *   $("#select").omDialog({maxWidth : 500});
		 */
		maxWidth: false,
		
		/**
		 * 可改变大小时组件最小高度。
		 * @type Number
		 * @default 150
		 * @example
         *   $("#select").omDialog({minHeight : 150});
		 */
		minHeight: 150,
		
		/**
		 * 可改变大小时组件最小宽度。
		 * @type Number
		 * @default 150
		 * @example
         *   $("#select").omDialog({minWidth : 150});
		 */
		minWidth: 150,
		
		/**
		 * 是否模态窗口。
		 * @type Boolean
		 * @default false
		 * @example
         *   $("#select").omDialog({modal : true});
		 */
		modal: false,
		position: {
			my: 'center',
			at: 'center',
			collision: 'fit',
			// ensure that the titlebar is never outside the document
			using: function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 0) {
					$(this).css('top', pos.top - topOffset);
				}
			}
		},
		
		/**
		 * 是否可改变大小。
		 * @type Boolean
		 * @default true
		 * @example
         *   $("#select").omDialog({resizable : true});
		 */
		resizable: true,
		show: null,
		
		stack: true,
		
		/**
		 * 对话框的标题。
		 * @type String
		 * @default 无
		 */
		title: '',
		
		/**
		 * 组件的宽度。
		 * @type Number
		 * @default 300
		 * @example
         *   $("#select").omDialog({width : 300});
		 */
		width: 300,
		
        /**
         * 组件的堆叠顺序。默认为1000。
         * @type Number
         * @default 1000
         * @example
         *   $("#select").omDialog({zIndex : 300});
         */
		zIndex: 1000
		
		/**
         * 对话框打开时触发事件。
         * @event
         * @param event jQuery.Event对象。
         * @name omDialog#onOpen
         * @type Function
         * @example
         *   $("#select").omDialog({onOpen : function(event) {doSomething...}});
         */
		
		/**
         * 对话框关闭时触发事件。
         * @event
         * @param event jQuery.Event对象。
         * @name omDialog#onClose
         * @type Function
         * @example
         *   $("#select").omDialog({onClose : function(event) {doSomething...}});
         */
		
		/**
         * 对话框关闭前触发事件。
         * @event
         * @param event jQuery.Event对象。
         * @name omDialog#onBeforeClose
         * @type Function
         * @example
         *   $("#select").omDialog({onBeforeClose : function(event) {doSomething...}});
         */
	},

	_create: function() {
		this.originalTitle = this.element.attr('title');
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}


		this.options.title = this.options.title || this.originalTitle;
		var self = this;
	    self.element.parent().bind("om-remove.omDialog", (self.__removeBind = function() {
	        self.element.remove();
	    }));
	    var options = self.options,

			title = options.title || '&#160;',
			titleId = $.om.omDialog.getTitleId(self.element),

			uiDialog = (self.uiDialog = $('<div></div>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiDialogClasses + options.dialogClass)
				.css({
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
				.attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
					if (options.closeOnEscape && event.keyCode &&
						event.keyCode === $.om.keyCode.ESCAPE) {
						
						self.close(event);
						event.preventDefault();
					}
				})
				.attr({
					role: 'dialog',
					'aria-labelledby': titleId
				})
				.mousedown(function(event) {
					self.moveToTop(false, event);
				}),

			uiDialogContent = self.element
				.show()
				.removeAttr('title')
				.addClass(
					'om-dialog-content ' +
					'om-widget-content')
				.appendTo(uiDialog),

			uiDialogTitlebar = (self.uiDialogTitlebar = $('<div></div>'))
				.addClass(
					'om-dialog-titlebar ' +
					'om-widget-header ' +
					'om-corner-all ' +
					'om-helper-clearfix'
				)
				.prependTo(uiDialog),

			uiDialogTitlebarClose = $('<a href="#"></a>')
				.addClass(
					'om-dialog-titlebar-close ' +
					'om-corner-tr'
				)
				.attr('role', 'button')
				.hover(
					function() {
						uiDialogTitlebarClose.addClass('om-state-hover');
					},
					function() {
						uiDialogTitlebarClose.removeClass('om-state-hover');
					}
				)
				.focus(function() {
					uiDialogTitlebarClose.addClass('om-state-focus');
				})
				.blur(function() {
					uiDialogTitlebarClose.removeClass('om-state-focus');
				})
				.click(function(event) {
					self.close(event);
					return false;
				})
				.appendTo(uiDialogTitlebar),

			uiDialogTitlebarCloseText = (self.uiDialogTitlebarCloseText = $('<span></span>'))
				.addClass('om-icon-closethick')
				.text(options.closeText)
				.appendTo(uiDialogTitlebarClose),

			uiDialogTitle = $('<span></span>')
				.addClass('om-dialog-title')
				.attr('id', titleId)
				.html(title)
				.prependTo(uiDialogTitlebar);

		uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

		if (options.draggable && $.om.omDraggable) {
			self._makeDraggable();
		}
		if (options.resizable && $.fn.omResizable) {
			self._makeResizable();
		}

		self._createButtons(options.buttons);
		self._isOpen = false;

		if ($.fn.bgiframe) {
			uiDialog.bgiframe();
		}
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	destroy: function() {
		var self = this;
		
		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.hide();
		self.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('om-dialog-content om-widget-content')
			.hide().appendTo('body');
		self.uiDialog.remove();

		if (self.originalTitle) {
			self.element.attr('title', self.originalTitle);
		}

		return self;
	},

	widget: function() {
		return this.uiDialog;
	},

	/**
     * 关闭对话框.
     * @name omDialog#close
     * @function
     * @returns 支持链式操作，返回JQuery对象
     * @example
     * var store = $("#select").omDialog('close');
     * 
     */
	close: function(event) {
		var self = this,
			maxZ, thisZ,
			options = this.options,
			onBeforeClose = options.onBeforeClose,
			onClose = options.onClose;
		
		if (onBeforeClose && false === self._trigger("onBeforeClose",event)) {
			return;
		}

		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.unbind('keypress.om-dialog');

		self._isOpen = false;

		if (self.options.hide) {
			self.uiDialog.hide(self.options.hide, function() {
                onClose && self._trigger("onClose",event);
			});
		} else {
			self.uiDialog.hide();
			onClose && self._trigger("onClose",event);
		}

		$.om.omDialog.overlay.resize();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		if (self.options.modal) {
			maxZ = 0;
			$('.om-dialog').each(function() {
				if (this !== self.uiDialog[0]) {
					thisZ = $(this).css('z-index');
					if(!isNaN(thisZ)) {
						maxZ = Math.max(maxZ, thisZ);
					}
				}
			});
			$.om.omDialog.maxZ = maxZ;
		}

		return self;
	},

	/**
     * 判断对话框是否已打开。
     * @name omDialog#isOpen
     * @function
     * @returns 如果对话框已打开返回true，否则返回false
     * @example
     * var isOpen = $("#select").omDialog('isOpen');
     * 
     */
	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function(force, event) {
		var self = this,
			options = self.options,
			saveScroll;

		if ((options.modal && !force) ||
			(!options.stack && !options.modal)) {
			return self._trigger('onFocus', event);
		}

		if (options.zIndex > $.om.omDialog.maxZ) {
			$.om.omDialog.maxZ = options.zIndex;
		}
		if (self.overlay) {
			$.om.omDialog.maxZ += 1;
			self.overlay.$el.css('z-index', $.om.omDialog.overlay.maxZ = $.om.omDialog.maxZ);
		}

		//Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
		//  http://ui.jquery.com/bugs/ticket/3193
		saveScroll = { scrollTop: self.element.scrollTop(), scrollLeft: self.element.scrollLeft() };
		$.om.omDialog.maxZ += 1;
		self.uiDialog.css('z-index', $.om.omDialog.maxZ);
		self.element.attr(saveScroll);
		self._trigger('onFocus', event);

		return self;
	},

	/**
     * 打开对话框。
     * @name omDialog#open
     * @function
     * @returns 支持链式操作，返回JQuery对象
     * @example
     * var store = $("#select").omDialog('open');
     * 
     */
	open: function() {
		if (this._isOpen) { return; }

		var self = this,
			options = self.options,
			uiDialog = self.uiDialog;

		self.overlay = options.modal ? new $.om.omDialog.overlay(self) : null;
		self._size();
		self._position(options.position);
		uiDialog.show(options.show);
		self.moveToTop(true);

		// prevent tabbing out of modal dialogs
		if (options.modal) {
			uiDialog.bind('keypress.om-dialog', function(event) {
				if (event.keyCode !== $.om.keyCode.TAB) {
					return;
				}

				var tabbables = $(':tabbable', this),
					first = tabbables.filter(':first'),
					last  = tabbables.filter(':last');

				if (event.target === last[0] && !event.shiftKey) {
					first.focus(1);
					return false;
				} else if (event.target === first[0] && event.shiftKey) {
					last.focus(1);
					return false;
				}
			});
		}

		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		$(self.element.find(':tabbable').get().concat(
			uiDialog.find('.om-dialog-buttonpane :tabbable').get().concat(
				uiDialog.get()))).eq(0).focus();

		self._isOpen = true;
		var onOpen = options.onOpen;
		if(onOpen){
		    self._trigger("onOpen");
		}
		return self;
	},

	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false,
			uiDialogButtonPane = $('<div></div>')
				.addClass(
					'om-dialog-buttonpane ' +
					'om-helper-clearfix'
				),
			uiButtonSet = $( "<div></div>" )
				.addClass( "om-dialog-buttonset" )
				.appendTo( uiDialogButtonPane );

		// if we already have a button pane, remove it
		self.uiDialog.find('.om-dialog-buttonpane').remove();

		if (typeof buttons === 'object' && buttons !== null) {
			$.each(buttons, function() {
				return !(hasButtons = true);
			});
		}
		if (hasButtons) {
			$.each(buttons, function(name, props) {
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				var button = $('<button type="button"></button>')
					.click(function() {
						props.click.apply(self.element[0], arguments);
					})
					.appendTo(uiButtonSet);
				// can't use .attr( props, true ) with jQuery 1.3.2.
				$.each( props, function( key, value ) {
					if ( key === "click" ) {
						return;
					}
					if ( key in attrFn ) {
						button[ key ]( value );
					} else {
						button.attr( key, value );
					}
				});
				if ($.fn.omButton) {
					button.omButton();
				}
			});
			uiDialogButtonPane.appendTo(self.uiDialog);
		}
	},

	_makeDraggable: function() {
		var self = this,
			options = self.options,
			doc = $(document),
			heightBeforeDrag;

		function filteredUi(ui) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		self.uiDialog.omDraggable({
			cancel: '.om-dialog-content, .om-dialog-titlebar-close',
			handle: '.om-dialog-titlebar',
			containment: 'document',
			cursor: 'move',
			onStart: function(ui, event) {
				heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
				$(this).height($(this).height()).addClass("om-dialog-dragging");
				self._trigger('onDragStart', filteredUi(ui), event);
			},
			onDrag: function(ui, event) {
				self._trigger('onDrag', filteredUi(ui), event);
			},
			onStop: function(ui, event) {
				options.position = [ui.position.left - doc.scrollLeft(),
					ui.position.top - doc.scrollTop()];
				$(this).removeClass("om-dialog-dragging").height(heightBeforeDrag);
				self._trigger('onDragStop', filteredUi(ui), event);
				$.om.omDialog.overlay.resize();
			}
		});
	},

	_makeResizable: function(handles) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var self = this,
			options = self.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = self.uiDialog.css('position'),
			resizeHandles = (typeof handles === 'string' ?
				handles	:
				'n,e,s,w,se,sw,ne,nw'
			);

		function filteredUi(ui) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		self.uiDialog.omResizable({
			cancel: '.om-dialog-content',
			containment: 'document',
			alsoResize: self.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: self._minHeight(),
			handles: resizeHandles,
			start: function(event, ui) {
				$(this).addClass("om-dialog-resizing");
				self._trigger('onResizeStart', event, filteredUi(ui));
			},
			resize: function(event, ui) {
				self._trigger('onResize', event, filteredUi(ui));
			},
			stop: function(event, ui) {
				$(this).removeClass("om-dialog-resizing");
				options.height = $(this).height();
				options.width = $(this).width();
				self._trigger('onResizeStop', event, filteredUi(ui));
				$.om.omDialog.overlay.resize();
			}
		})
		.css('position', position)
		.find('.om-resizable-se').addClass('om-icon om-icon-grip-diagonal-se');
	},

	_minHeight: function() {
		var options = this.options;

		if (options.height === 'auto') {
			return options.minHeight;
		} else {
			return Math.min(options.minHeight, options.height);
		}
	},

	_position: function(position) {
		var myAt = [],
			offset = [0, 0],
			isVisible;

		if (position) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
				myAt = position.split ? position.split(' ') : [position[0], position[1]];
				if (myAt.length === 1) {
					myAt[1] = myAt[0];
				}

				$.each(['left', 'top'], function(i, offsetPosition) {
					if (+myAt[i] === myAt[i]) {
						offset[i] = myAt[i];
						myAt[i] = offsetPosition;
					}
				});

				position = {
					my: myAt.join(" "),
					at: myAt.join(" "),
					offset: offset.join(" ")
				};
			} 

			position = $.extend({}, $.om.omDialog.prototype.options.position, position);
		} else {
			position = $.om.omDialog.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin
		isVisible = this.uiDialog.is(':visible');
		if (!isVisible) {
			this.uiDialog.show();
		}
		this.uiDialog
			// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
			.css({ top: 0, left: 0 })
			.position($.extend({ of: window }, position));
		if (!isVisible) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var self = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			self._setOption( key, value );
			
			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.omResizable( "option", resizableOptions );
		}
	},

	_setOption: function(key, value){
		var self = this,
			uiDialog = self.uiDialog;

		switch (key) {
			case "buttons":
				self._createButtons(value);
				break;
			case "closeText":
				// ensure that we always pass a string
				self.uiDialogTitlebarCloseText.text("" + value);
				break;
			case "dialogClass":
				uiDialog
					.removeClass(self.options.dialogClass)
					.addClass(uiDialogClasses + value);
				break;
			case "disabled":
				if (value) {
					uiDialog.addClass('om-dialog-disabled');
				} else {
					uiDialog.removeClass('om-dialog-disabled');
				}
				break;
			case "draggable":
				var isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.omDraggable( "destroy" );
				}
				
				if ( !isDraggable && value ) {
					self._makeDraggable();
				}
				break;
			case "position":
				self._position(value);
				break;
			case "resizable":
				// currently resizable, becoming non-resizable
				var isResizable = uiDialog.is( ":data(resizable)" );
				if (isResizable && !value) {
					uiDialog.omResizable('destroy');
				}

				// currently resizable, changing handles
				if (isResizable && typeof value === 'string') {
					uiDialog.omResizable('option', 'handles', value);
				}

				// currently non-resizable, becoming resizable
				if (!isResizable && value !== false) {
					self._makeResizable(value);
				}
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$(".om-dialog-title", self.uiDialogTitlebar).html("" + (value || '&#160;'));
				break;
		}

		$.OMWidget.prototype._setOption.apply(self, arguments);
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var options = this.options,
			nonContentHeight,
			minContentHeight,
			isVisible = this.uiDialog.is( ":visible" );

		// reset content sizing
		this.element.show().css({
			width: 'auto',
			minHeight: 0,
			height: 0
		});

		if (options.minWidth > options.width) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: 'auto',
				width: options.width
			})
			.height();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		
		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.uiDialog.show();
				var autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.uiDialog.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is(':data(resizable)')) {
			this.uiDialog.omResizable('option', 'minHeight', this._minHeight());
		}
	}
});

$.extend($.om.omDialog, {
	version: "@VERSION",

	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		var id = $el.attr('id');
		if (!id) {
			this.uuid += 1;
			id = this.uuid;
		}
		return 'ui-dialog-title-' + id;
	},

	overlay: function(dialog) {
		this.$el = $.om.omDialog.overlay.create(dialog);
	}
});

$.extend($.om.omDialog.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency (see #5185)
	oldInstances: [],
	maxZ: 0,
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event) { return event + '.dialog-overlay'; }).join(' '),
	create: function(dialog) {
		if (this.instances.length === 0) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ($.om.omDialog.overlay.instances.length) {
					$(document).bind($.om.omDialog.overlay.events, function(event) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ($(event.target).zIndex() < $.om.omDialog.overlay.maxZ) {
							return false;
						}
					});
				}
			}, 1);

			// allow closing by pressing the escape key
			$(document).bind('keydown.dialog-overlay', function(event) {
				if (dialog.options.closeOnEscape && event.keyCode &&
					event.keyCode === $.om.keyCode.ESCAPE) {
					
					dialog.close(event);
					event.preventDefault();
				}
			});

			// handle window resize
			$(window).bind('resize.dialog-overlay', $.om.omDialog.overlay.resize);
		}

		var $el = (this.oldInstances.pop() || $('<div></div>').addClass('om-widget-overlay'))
			.appendTo(document.body)
			.css({
				width: this.width(),
				height: this.height()
			});

		if ($.fn.bgiframe) {
			$el.bgiframe();
		}

		this.instances.push($el);
		return $el;
	},

	destroy: function($el) {
	    $el.parent().unbind(this.__removeBind);
		var indexOf = $.inArray($el, this.instances);
		if (indexOf != -1){
			this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
		}

		if (this.instances.length === 0) {
			$([document, window]).unbind('.dialog-overlay');
		}

		$el.remove();
		
		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		var maxZ = 0;
		$.each(this.instances, function() {
			maxZ = Math.max(maxZ, this.css('z-index'));
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).height() + 'px';
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE
		if ( $.browser.msie ) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).width() + 'px';
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.om.omDialog.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.om.omDialog.overlay.width(),
			height: $.om.omDialog.overlay.height()
		});
	}
});

$.extend($.om.omDialog.overlay.prototype, {
	destroy: function() {
		$.om.omDialog.overlay.destroy(this.$el);
	}
});

}(jQuery));
