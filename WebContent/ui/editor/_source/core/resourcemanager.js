/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.resourceManager} class, which is
 *		the base for resource managers, like plugins and themes.
 */

 /**
 * Base class for resource managers, like plugins and themes. This class is not
 * intended to be used out of the OMEditor core code.
 * @param {String} basePath The path for the resources folder.
 * @param {String} fileName The name used for resource files.
 * @namespace
 * @example
 */
OMEDITOR.resourceManager = function( basePath, fileName )
{
	/**
	 * The base directory containing all resources.
	 * @name OMEDITOR.resourceManager.prototype.basePath
	 * @type String
	 * @example
	 */
	this.basePath = basePath;

	/**
	 * The name used for resource files.
	 * @name OMEDITOR.resourceManager.prototype.fileName
	 * @type String
	 * @example
	 */
	this.fileName = fileName;

	/**
	 * Contains references to all resources that have already been registered
	 * with {@link #add}.
	 * @name OMEDITOR.resourceManager.prototype.registered
	 * @type Object
	 * @example
	 */
	this.registered = {};

	/**
	 * Contains references to all resources that have already been loaded
	 * with {@link #load}.
	 * @name OMEDITOR.resourceManager.prototype.loaded
	 * @type Object
	 * @example
	 */
	this.loaded = {};

	/**
	 * Contains references to all resources that have already been registered
	 * with {@link #addExternal}.
	 * @name OMEDITOR.resourceManager.prototype.externals
	 * @type Object
	 * @example
	 */
	this.externals = {};

	/**
	 * @private
	 */
	this._ =
	{
		// List of callbacks waiting for plugins to be loaded.
		waitingList : {}
	};
};

OMEDITOR.resourceManager.prototype =
{
	/**
	 * Registers a resource.
	 * @param {String} name The resource name.
	 * @param {Object} [definition] The resource definition.
	 * @example
	 * OMEDITOR.plugins.add( 'sample', { ... plugin definition ... } );
	 * @see OMEDITOR.pluginDefinition
	 */
	add : function( name, definition )
	{
		if ( this.registered[ name ] )
			throw '[OMEDITOR.resourceManager.add] The resource name "' + name + '" is already registered.';

		OMEDITOR.fire( name + OMEDITOR.tools.capitalize( this.fileName ) + 'Ready',
				this.registered[ name ] = definition || {} );
	},

	/**
	 * Gets the definition of a specific resource.
	 * @param {String} name The resource name.
	 * @type Object
	 * @example
	 * var definition = <b>OMEDITOR.plugins.get( 'sample' )</b>;
	 */
	get : function( name )
	{
		return this.registered[ name ] || null;
	},

	/**
	 * Get the folder path for a specific loaded resource.
	 * @param {String} name The resource name.
	 * @type String
	 * @example
	 * alert( <b>OMEDITOR.plugins.getPath( 'sample' )</b> );  // "&lt;editor path&gt;/plugins/sample/"
	 */
	getPath : function( name )
	{
		var external = this.externals[ name ];
		return OMEDITOR.getUrl( ( external && external.dir ) || this.basePath + name + '/' );
	},

	/**
	 * Get the file path for a specific loaded resource.
	 * @param {String} name The resource name.
	 * @type String
	 * @example
	 * alert( <b>OMEDITOR.plugins.getFilePath( 'sample' )</b> );  // "&lt;editor path&gt;/plugins/sample/plugin.js"
	 */
	getFilePath : function( name )
	{
		var external = this.externals[ name ];
		return OMEDITOR.getUrl(
				this.getPath( name ) +
				( ( external && ( typeof external.file == 'string' ) ) ? external.file : this.fileName + '.js' ) );
	},

	/**
	 * Registers one or more resources to be loaded from an external path
	 * instead of the core base path.
	 * @param {String} names The resource names, separated by commas.
	 * @param {String} path The path of the folder containing the resource.
	 * @param {String} [fileName] The resource file name. If not provided, the
	 *		default name is used; If provided with a empty string, will implicitly indicates that {@param path}
	 * 		is already the full path.
	 * @example
	 * // Loads a plugin from '/myplugin/samples/plugin.js'.
	 * OMEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/' );
	 * @example
	 * // Loads a plugin from '/myplugin/samples/my_plugin.js'.
	 * OMEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/', 'my_plugin.js' );
	 * @example
	 * // Loads a plugin from '/myplugin/samples/my_plugin.js'.
	 * OMEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/my_plugin.js', '' );
	 */
	addExternal : function( names, path, fileName )
	{
		names = names.split( ',' );
		for ( var i = 0 ; i < names.length ; i++ )
		{
			var name = names[ i ];

			this.externals[ name ] =
			{
				dir : path,
				file : fileName
			};
		}
	},

	/**
	 * Loads one or more resources.
	 * @param {String|Array} name The name of the resource to load. It may be a
	 *		string with a single resource name, or an array with several names.
	 * @param {Function} callback A function to be called when all resources
	 *		are loaded. The callback will receive an array containing all
	 *		loaded names.
	 * @param {Object} [scope] The scope object to be used for the callback
	 *		call.
	 * @example
	 * <b>OMEDITOR.plugins.load</b>( 'myplugin', function( plugins )
	 *     {
	 *         alert( plugins['myplugin'] );  // "object"
	 *     });
	 */
	load : function( names, callback, scope )
	{
		// Ensure that we have an array of names.
		if ( !OMEDITOR.tools.isArray( names ) )
			names = names ? [ names ] : [];

		var loaded = this.loaded,
			registered = this.registered,
			urls = [],
			urlsNames = {},
			resources = {};

		// Loop through all names.
		for ( var i = 0 ; i < names.length ; i++ )
		{
			var name = names[ i ];

			if ( !name )
				continue;

			// If not available yet.
			if ( !loaded[ name ] && !registered[ name ] )
			{
				var url = this.getFilePath( name );
				urls.push( url );
				if ( !( url in urlsNames ) )
					urlsNames[ url ] = [];
				urlsNames[ url ].push( name );
			}
			else
				resources[ name ] = this.get( name );
		}

		OMEDITOR.scriptLoader.load( urls, function( completed, failed )
			{
				if ( failed.length )
				{
					throw '[OMEDITOR.resourceManager.load] Resource name "' + urlsNames[ failed[ 0 ] ].join( ',' )
						+ '" was not found at "' + failed[ 0 ] + '".';
				}

				for ( var i = 0 ; i < completed.length ; i++ )
				{
					var nameList = urlsNames[ completed[ i ] ];
					for ( var j = 0 ; j < nameList.length ; j++ )
					{
						var name = nameList[ j ];
						resources[ name ] = this.get( name );

						loaded[ name ] = 1;
					}
				}

				callback.call( scope, resources );
			}
			, this);
	}
};
