/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.loader} objects, which is used to
 *		load core scripts and their dependencies from _source.
 */

if ( typeof OMEDITOR == 'undefined' )
	OMEDITOR = {};

if ( !OMEDITOR.loader )
{
	/**
	 * Load core scripts and their dependencies from _source.
	 * @namespace
	 * @example
	 */
	OMEDITOR.loader = (function()
	{
		// Table of script names and their dependencies.
		var scripts =
		{
			'core/_bootstrap'		: [ 'core/config', 'core/omeditor', 'core/plugins', 'core/scriptloader', 'core/tools', /* The following are entries that we want to force loading at the end to avoid dependence recursion */ 'core/dom/comment', 'core/dom/elementpath', 'core/dom/text', 'core/dom/rangelist' ],
			'core/omeditor'			: [ 'core/omeditor_basic', 'core/dom', 'core/dtd', 'core/dom/document', 'core/dom/element', 'core/editor', 'core/event', 'core/htmlparser', 'core/htmlparser/element', 'core/htmlparser/fragment', 'core/htmlparser/filter', 'core/htmlparser/basicwriter', 'core/tools' ],
			'core/omeditor_base'	: [],
			'core/omeditor_basic'	: [ 'core/editor_basic', 'core/env', 'core/event' ],
			'core/command'			: [],
			'core/config'			: [ 'core/omeditor_base' ],
			'core/dom'				: [],
			'core/dom/comment'		: [ 'core/dom/node' ],
			'core/dom/document'		: [ 'core/dom', 'core/dom/domobject', 'core/dom/window' ],
			'core/dom/documentfragment'	: [ 'core/dom/element' ],
			'core/dom/element'		: [ 'core/dom', 'core/dom/document', 'core/dom/domobject', 'core/dom/node', 'core/dom/nodelist', 'core/tools' ],
			'core/dom/elementpath'	: [ 'core/dom/element' ],
			'core/dom/event'		: [],
			'core/dom/node'			: [ 'core/dom/domobject', 'core/tools' ],
			'core/dom/nodelist'		: [ 'core/dom/node' ],
			'core/dom/domobject'	: [ 'core/dom/event' ],
			'core/dom/range'		: [ 'core/dom/document', 'core/dom/documentfragment', 'core/dom/element', 'core/dom/walker' ],
			'core/dom/rangelist'    : [ 'core/dom/range' ],
			'core/dom/text'			: [ 'core/dom/node', 'core/dom/domobject' ],
			'core/dom/walker'		: [ 'core/dom/node' ],
			'core/dom/window'		: [ 'core/dom/domobject' ],
			'core/dtd'				: [ 'core/tools' ],
			'core/editor'			: [ 'core/command', 'core/config', 'core/editor_basic', 'core/focusmanager', 'core/lang', 'core/plugins', 'core/skins', 'core/themes', 'core/tools', 'core/ui' ],
			'core/editor_basic'		: [ 'core/event' ],
			'core/env'				: [],
			'core/event'			: [],
			'core/focusmanager'		: [],
			'core/htmlparser'		: [],
			'core/htmlparser/comment'	: [ 'core/htmlparser' ],
			'core/htmlparser/element'	: [ 'core/htmlparser', 'core/htmlparser/fragment' ],
			'core/htmlparser/fragment'	: [ 'core/htmlparser', 'core/htmlparser/comment', 'core/htmlparser/text', 'core/htmlparser/cdata' ],
			'core/htmlparser/text'		: [ 'core/htmlparser' ],
			'core/htmlparser/cdata'		: [ 'core/htmlparser' ],
			'core/htmlparser/filter'	: [ 'core/htmlparser' ],
			'core/htmlparser/basicwriter': [ 'core/htmlparser' ],
			'core/lang'				: [],
			'core/plugins'			: [ 'core/resourcemanager' ],
			'core/resourcemanager'	: [ 'core/scriptloader', 'core/tools' ],
			'core/scriptloader'		: [ 'core/dom/element', 'core/env' ],
			'core/skins'			: [ 'core/scriptloader' ],
			'core/themes'			: [ 'core/resourcemanager' ],
			'core/tools'			: [ 'core/env' ],
			'core/ui'				: []
		};

		var basePath = (function()
		{
			// This is a copy of OMEDITOR.basePath, but requires the script having
			// "_source/core/loader.js".
			if ( OMEDITOR && OMEDITOR.basePath )
				return OMEDITOR.basePath;

			// Find out the editor directory path, based on its <script> tag.
			var path = '';
			var scripts = document.getElementsByTagName( 'script' );

			for ( var i = 0 ; i < scripts.length ; i++ )
			{
				var match = scripts[i].src.match( /(^|.*?[\\\/])(?:_source\/)?core\/loader.js(?:\?.*)?$/i );

				if ( match )
				{
					path = match[1];
					break;
				}
			}

			// In IE (only) the script.src string is the raw valued entered in the
			// HTML. Other browsers return the full resolved URL instead.
			if ( path.indexOf('://') == -1 )
			{
				// Absolute path.
				if ( path.indexOf( '/' ) === 0 )
					path = location.href.match( /^.*?:\/\/[^\/]*/ )[0] + path;
				// Relative path.
				else
					path = location.href.match( /^[^\?]*\// )[0] + path;
			}

			return path;
		})();

		var timestamp = 'B5GJ5GG';

		var getUrl = function( resource )
		{
			if ( OMEDITOR && OMEDITOR.getUrl )
				return OMEDITOR.getUrl( resource );

			return basePath + resource +
				( resource.indexOf( '?' ) >= 0 ? '&' : '?' ) +
				't=' + timestamp;
		};

		var pendingLoad = [];

		/** @lends OMEDITOR.loader */
		return {
			/**
			 * The list of loaded scripts in their loading order.
			 * @type Array
			 * @example
			 * // Alert the loaded script names.
			 * alert( <b>OMEDITOR.loader.loadedScripts</b> );
			 */
			loadedScripts : [],

			loadPending : function()
			{
				var scriptName = pendingLoad.shift();

				if ( !scriptName )
					return;

				var scriptSrc = getUrl( '_source/' + scriptName + '.js' );

				var script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = scriptSrc;

				function onScriptLoaded()
				{
					// Append this script to the list of loaded scripts.
					OMEDITOR.loader.loadedScripts.push( scriptName );

					// Load the next.
					OMEDITOR.loader.loadPending();
				}

				// We must guarantee the execution order of the scripts, so we
				// need to load them one by one. (#4145)
				// The following if/else block has been taken from the scriptloader core code.
				if ( typeof(script.onreadystatechange) !== "undefined" )
				{
					/** @ignore */
					script.onreadystatechange = function()
					{
						if ( script.readyState == 'loaded' || script.readyState == 'complete' )
						{
							script.onreadystatechange = null;
							onScriptLoaded();
						}
					};
				}
				else
				{
					/** @ignore */
					script.onload = function()
					{
						// Some browsers, such as Safari, may call the onLoad function
						// immediately. Which will break the loading sequence. (#3661)
						setTimeout( function() { onScriptLoaded( scriptName ); }, 0 );
					};
				}

				document.body.appendChild( script );
			},

			/**
			 * Loads a specific script, including its dependencies. This is not a
			 * synchronous loading, which means that the code to be loaded will
			 * not necessarily be available after this call.
			 * @example
			 * OMEDITOR.loader.load( 'core/dom/element' );
			 */
			load : function( scriptName, defer )
			{
				// Check if the script has already been loaded.
				if ( scriptName in this.loadedScripts )
					return;

				// Get the script dependencies list.
				var dependencies = scripts[ scriptName ];
				if ( !dependencies )
					throw 'The script name"' + scriptName + '" is not defined.';

				// Mark the script as loaded, even before really loading it, to
				// avoid cross references recursion.
				this.loadedScripts[ scriptName ] = true;

				// Load all dependencies first.
				for ( var i = 0 ; i < dependencies.length ; i++ )
					this.load( dependencies[ i ], true );

				var scriptSrc = getUrl( '_source/' + scriptName + '.js' );

				// Append the <script> element to the DOM.
				// If the page is fully loaded, we can't use document.write
				// but if the script is run while the body is loading then it's safe to use it
				// Unfortunately, Firefox <3.6 doesn't support document.readyState, so it won't get this improvement
				if ( document.body && (!document.readyState || document.readyState == 'complete') )
				{
					pendingLoad.push( scriptName );

					if ( !defer )
						this.loadPending();
				}
				else
				{
					// Append this script to the list of loaded scripts.
					this.loadedScripts.push( scriptName );

					document.write( '<script src="' + scriptSrc + '" type="text/javascript"><\/script>' );
				}
			}
		};
	})();
}

// Check if any script has been defined for autoload.
if ( OMEDITOR._autoLoad )
{
	OMEDITOR.loader.load( OMEDITOR._autoLoad );
	delete OMEDITOR._autoLoad;
}
