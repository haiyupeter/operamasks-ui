/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Contains the second part of the {@link OMEDITOR} object
 *		definition, which defines the basic editor features to be available in
 *		the root omeditor_basic.js file.
 */

if ( OMEDITOR.status == 'unloaded' )
{
	(function()
	{
		OMEDITOR.event.implementOn( OMEDITOR );

		/**
		 * Forces the full OMEditor core code, in the case only the basic code has been
		 * loaded (omeditor_basic.js). This method self-destroys (becomes undefined) in
		 * the first call or as soon as the full code is available.
		 * @example
		 * // Check if the full core code has been loaded and load it.
		 * if ( OMEDITOR.loadFullCore )
		 *     <b>OMEDITOR.loadFullCore()</b>;
		 */
		OMEDITOR.loadFullCore = function()
		{
			// If not the basic code is not ready it, just mark it to be loaded.
			if ( OMEDITOR.status != 'basic_ready' )
			{
				OMEDITOR.loadFullCore._load = 1;
				return;
			}

			// Destroy this function.
			delete OMEDITOR.loadFullCore;

			// Append the script to the head.
			var script = document.createElement( 'script' );
			script.type = 'text/javascript';
			script.src = OMEDITOR.basePath + 'omeditor.js';

			document.getElementsByTagName( 'head' )[0].appendChild( script );
		};

		/**
		 * The time to wait (in seconds) to load the full editor code after the
		 * page load, if the "omeditor_basic" file is used. If set to zero, the
		 * editor is loaded on demand, as soon as an instance is created.
		 *
		 * This value must be set on the page before the page load completion.
		 * @type Number
		 * @default 0 (zero)
		 * @example
		 * // Loads the full source after five seconds.
		 * OMEDITOR.loadFullCoreTimeout = 5;
		 */
		OMEDITOR.loadFullCoreTimeout = 0;

		/**
		 * The class name used to identify &lt;textarea&gt; elements to be replace
		 * by OMEditor instances.
		 * @type String
		 * @default 'omeditor'
		 * @example
		 * <b>OMEDITOR.replaceClass</b> = 'rich_editor';
		 */
		OMEDITOR.replaceClass = 'omeditor';

		/**
		 * Enables the replacement of all textareas with class name matching
		 * {@link OMEDITOR.replaceClass}.
		 * @type Boolean
		 * @default true
		 * @example
		 * // Disable the auto-replace feature.
		 * <b>OMEDITOR.replaceByClassEnabled</b> = false;
		 */
		OMEDITOR.replaceByClassEnabled = 1;

		var createInstance = function( elementOrIdOrName, config, creationFunction, data )
		{
			if ( OMEDITOR.env.isCompatible )
			{
				// Load the full core.
				if ( OMEDITOR.loadFullCore )
					OMEDITOR.loadFullCore();

				var editor = creationFunction( elementOrIdOrName, config, data );
				OMEDITOR.add( editor );
				return editor;
			}

			return null;
		};

		/**
		 * Replaces a &lt;textarea&gt; or a DOM element (DIV) with a OMEditor
		 * instance. For textareas, the initial value in the editor will be the
		 * textarea value. For DOM elements, their innerHTML will be used
		 * instead. We recommend using TEXTAREA and DIV elements only.
		 * @param {Object|String} elementOrIdOrName The DOM element (textarea), its
		 *		ID or name.
		 * @param {Object} [config] The specific configurations to apply to this
		 *		editor instance. Configurations set here will override global OMEditor
		 *		settings.
		 * @returns {OMEDITOR.editor} The editor instance created.
		 * @example
		 * &lt;textarea id="myfield" name="myfield"&gt;&lt:/textarea&gt;
		 * ...
		 * <b>OMEDITOR.replace( 'myfield' )</b>;
		 * @example
		 * var textarea = document.body.appendChild( document.createElement( 'textarea' ) );
		 * <b>OMEDITOR.replace( textarea )</b>;
		 */
		OMEDITOR.replace = function( elementOrIdOrName, config )
		{
			return createInstance( elementOrIdOrName, config, OMEDITOR.editor.replace );
		};

		/**
		 * Creates a new editor instance inside a specific DOM element.
		 * @param {Object|String} elementOrId The DOM element or its ID.
		 * @param {Object} [config] The specific configurations to apply to this
		 *		editor instance. Configurations set here will override global OMEditor
		 *		settings.
		 * @param {String} [data] Since 3.3. Initial value for the instance.
		 * @returns {OMEDITOR.editor} The editor instance created.
		 * @example
		 * &lt;div id="editorSpace"&gt;&lt:/div&gt;
		 * ...
		 * <b>OMEDITOR.appendTo( 'editorSpace' )</b>;
		 */
		OMEDITOR.appendTo = function( elementOrId, config, data )
		{
			return createInstance( elementOrId, config, OMEDITOR.editor.appendTo, data );
		};

		// Documented at omeditor.js.
		OMEDITOR.add = function( editor )
		{
			// For now, just put the editor in the pending list. It will be
			// processed as soon as the full code gets loaded.
			var pending = this._.pending || ( this._.pending = [] );
			pending.push( editor );
		};

		/**
		 * Replace all &lt;textarea&gt; elements available in the document with
		 * editor instances.
		 * @example
		 * // Replace all &lt;textarea&gt; elements in the page.
		 * OMEDITOR.replaceAll();
		 * @example
		 * // Replace all &lt;textarea class="myClassName"&gt; elements in the page.
		 * OMEDITOR.replaceAll( 'myClassName' );
		 * @example
		 * // Selectively replace &lt;textarea&gt; elements, based on custom assertions.
		 * OMEDITOR.replaceAll( function( textarea, config )
		 *     {
		 *         // Custom code to evaluate the replace, returning false
		 *         // if it must not be done.
		 *         // It also passes the "config" parameter, so the
		 *         // developer can customize the instance.
		 *     } );
		 */
		OMEDITOR.replaceAll = function()
		{
			var textareas = document.getElementsByTagName( 'textarea' );

			for ( var i = 0 ; i < textareas.length ; i++ )
			{
				var config = null,
					textarea = textareas[i];

				// The "name" and/or "id" attribute must exist.
				if ( !textarea.name && !textarea.id )
					continue;

				if ( typeof arguments[0] == 'string' )
				{
					// The textarea class name could be passed as the function
					// parameter.

					var classRegex = new RegExp( '(?:^|\\s)' + arguments[0] + '(?:$|\\s)' );

					if ( !classRegex.test( textarea.className ) )
						continue;
				}
				else if ( typeof arguments[0] == 'function' )
				{
					// An assertion function could be passed as the function parameter.
					// It must explicitly return "false" to ignore a specific <textarea>.
					config = {};
					if ( arguments[0]( textarea, config ) === false )
						continue;
				}

				this.replace( textarea, config );
			}
		};

		(function()
		{
			var onload = function()
			{
				var loadFullCore = OMEDITOR.loadFullCore,
					loadFullCoreTimeout = OMEDITOR.loadFullCoreTimeout;

				// Replace all textareas with the default class name.
				if ( OMEDITOR.replaceByClassEnabled )
					OMEDITOR.replaceAll( OMEDITOR.replaceClass );

				OMEDITOR.status = 'basic_ready';

				if ( loadFullCore && loadFullCore._load )
					loadFullCore();
				else if ( loadFullCoreTimeout )
				{
					setTimeout( function()
						{
							if ( OMEDITOR.loadFullCore )
								OMEDITOR.loadFullCore();
						}
						, loadFullCoreTimeout * 1000 );
				}
			};

			if ( window.addEventListener )
				window.addEventListener( 'load', onload, false );
			else if ( window.attachEvent )
				window.attachEvent( 'onload', onload );
		})();

		OMEDITOR.status = 'basic_loaded';
	})();
}
