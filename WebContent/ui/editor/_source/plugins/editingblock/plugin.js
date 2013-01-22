/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview The default editing block plugin, which holds the editing area
 *		and source view.
 */

(function()
{
	// This is a semaphore used to avoid recursive calls between
	// the following data handling functions.
	var isHandlingData;

	OMEDITOR.plugins.add( 'editingblock',
	{
		init : function( editor )
		{
			if ( !editor.config.editingBlock )
				return;

			editor.on( 'themeSpace', function( event )
				{
					if ( event.data.space == 'contents' )
						event.data.html += '<br>';
				});

			editor.on( 'themeLoaded', function()
				{
					editor.fireOnce( 'editingBlockReady' );
				});

			editor.on( 'uiReady', function()
				{
					editor.setMode( editor.config.startupMode );
				});

			editor.on( 'afterSetData', function()
				{
					if ( !isHandlingData )
					{
						function setData()
						{
							isHandlingData = true;
							editor.getMode().loadData( editor.getData() );
							isHandlingData = false;
						}

						if ( editor.mode )
							setData();
						else
						{
							editor.on( 'mode', function()
								{
									if ( editor.mode )
									{
										setData();
										editor.removeListener( 'mode', arguments.callee );
									}
								});
						}
					}
				});

			editor.on( 'beforeGetData', function()
				{
					if ( !isHandlingData && editor.mode )
					{
						isHandlingData = true;
						editor.setData( editor.getMode().getData(), null, 1 );
						isHandlingData = false;
					}
				});

			editor.on( 'getSnapshot', function( event )
				{
					if ( editor.mode )
						event.data = editor.getMode().getSnapshotData();
				});

			editor.on( 'loadSnapshot', function( event )
				{
					if ( editor.mode )
						editor.getMode().loadSnapshotData( event.data );
				});

			// For the first "mode" call, we'll also fire the "instanceReady"
			// event.
			editor.on( 'mode', function( event )
				{
					// Do that once only.
					event.removeListener();

					// Redirect the focus into editor for webkit. (#5713)
					OMEDITOR.env.webkit && editor.container.on( 'focus', function()
						{
							editor.focus();
						});

					if ( editor.config.startupFocus )
						editor.focus();

					// Fire instanceReady for both the editor and OMEDITOR, but
					// defer this until the whole execution has completed
					// to guarantee the editor is fully responsible.
					setTimeout( function(){
						editor.fireOnce( 'instanceReady' );
						OMEDITOR.fire( 'instanceReady', null, editor );
					}, 0 );
				});

			editor.on( 'destroy', function ()
			{
				// ->		currentMode.unload( holderElement );
				if ( this.mode )
					this._.modes[ this.mode ].unload( this.getThemeSpace( 'contents' ) );
			});
		}
	});

	/**
	 * The current editing mode. An editing mode is basically a viewport for
	 * editing or content viewing. By default the possible values for this
	 * property are "wysiwyg" and "source".
	 * @type String
	 * @example
	 * alert( OMEDITOR.instances.editor1.mode );  // "wysiwyg" (e.g.)
	 */
	OMEDITOR.editor.prototype.mode = '';

	/**
	 * Registers an editing mode. This function is to be used mainly by plugins.
	 * @param {String} mode The mode name.
	 * @param {Object} modeEditor The mode editor definition.
	 * @example
	 */
	OMEDITOR.editor.prototype.addMode = function( mode, modeEditor )
	{
		modeEditor.name = mode;
		( this._.modes || ( this._.modes = {} ) )[ mode ] = modeEditor;
	};

	/**
	 * Sets the current editing mode in this editor instance.
	 * @param {String} mode A registered mode name.
	 * @example
	 * // Switch to "source" view.
	 * OMEDITOR.instances.editor1.setMode( 'source' );
	 */
	OMEDITOR.editor.prototype.setMode = function( mode )
	{
		this.fire( 'beforeSetMode', { newMode : mode } );

		var data,
			holderElement = this.getThemeSpace( 'contents' ),
			isDirty = this.checkDirty();

		// Unload the previous mode.
		if ( this.mode )
		{
			if ( mode == this.mode )
				return;

			this.fire( 'beforeModeUnload' );

			var currentMode = this.getMode();
			data = currentMode.getData();
			currentMode.unload( holderElement );
			this.mode = '';
		}

		holderElement.setHtml( '' );

		// Load required mode.
		var modeEditor = this.getMode( mode );
		if ( !modeEditor )
			throw '[OMEDITOR.editor.setMode] Unknown mode "' + mode + '".';

		if ( !isDirty )
		{
			this.on( 'mode', function()
				{
					this.resetDirty();
					this.removeListener( 'mode', arguments.callee );
				});
		}

		modeEditor.load( holderElement, ( typeof data ) != 'string'  ? this.getData() : data);
	};

	/**
	 * Gets the current or any of the objects that represent the editing
	 * area modes. The two most common editing modes are "wysiwyg" and "source".
	 * @param {String} [mode] The mode to be retrieved. If not specified, the
	 *		current one is returned.
	 */
	OMEDITOR.editor.prototype.getMode = function( mode )
	{
		return this._.modes && this._.modes[ mode || this.mode ];
	};

	/**
	 * Moves the selection focus to the editing are space in the editor.
	 */
	OMEDITOR.editor.prototype.focus = function()
	{
		this.forceNextSelectionCheck();
		var mode = this.getMode();
		if ( mode )
			mode.focus();
	};
})();

/**
 * The mode to load at the editor startup. It depends on the plugins
 * loaded. By default, the "wysiwyg" and "source" modes are available.
 * @type String
 * @default 'wysiwyg'
 * @example
 * config.startupMode = 'source';
 */
OMEDITOR.config.startupMode = 'wysiwyg';

/**
 * Sets whether the editor should have the focus when the page loads.
 * @name OMEDITOR.config.startupFocus
 * @type Boolean
 * @default false
 * @example
 * config.startupFocus = true;
 */

/**
 * Whether to render or not the editing block area in the editor interface.
 * @type Boolean
 * @default true
 * @example
 * config.editingBlock = false;
 */
OMEDITOR.config.editingBlock = true;

/**
 * Fired when a OMEDITOR instance is created, fully initialized and ready for interaction.
 * @name OMEDITOR#instanceReady
 * @event
 * @param {OMEDITOR.editor} editor The editor instance that has been created.
 */

/**
 * Fired when the OMEDITOR instance is created, fully initialized and ready for interaction.
 * @name OMEDITOR.editor#instanceReady
 * @event
 */

/**
 * Fired before changing the editing mode. See also OMEDITOR.editor#beforeSetMode and OMEDITOR.editor#mode
 * @name OMEDITOR.editor#beforeModeUnload
 * @event
 */

 /**
 * Fired before the editor mode is set. See also OMEDITOR.editor#mode and OMEDITOR.editor#beforeModeUnload
 * @name OMEDITOR.editor#beforeSetMode
 * @event
 * @since 3.5.3
 * @param {String} newMode The name of the mode which is about to be set.
 */

/**
 * Fired after setting the editing mode. See also OMEDITOR.editor#beforeSetMode and OMEDITOR.editor#beforeModeUnload
 * @name OMEDITOR.editor#mode
 * @event
 */
