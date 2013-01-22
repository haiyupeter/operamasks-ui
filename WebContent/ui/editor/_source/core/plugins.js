/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.plugins} object, which is used to
 *		manage plugins registration and loading.
 */

/**
 * Manages plugins registration and loading.
 * @namespace
 * @augments OMEDITOR.resourceManager
 * @example
 */
OMEDITOR.plugins = new OMEDITOR.resourceManager(
	'_source/' +	// @Packager.RemoveLine
	'plugins/', 'plugin' );

// PACKAGER_RENAME( OMEDITOR.plugins )

OMEDITOR.plugins.load = OMEDITOR.tools.override( OMEDITOR.plugins.load, function( originalLoad )
	{
		return function( name, callback, scope )
		{
			var allPlugins = {};

			var loadPlugins = function( names )
			{
				originalLoad.call( this, names, function( plugins )
					{
						OMEDITOR.tools.extend( allPlugins, plugins );

						var requiredPlugins = [];
						for ( var pluginName in plugins )
						{
							var plugin = plugins[ pluginName ],
								requires = plugin && plugin.requires;

							if ( requires )
							{
								for ( var i = 0 ; i < requires.length ; i++ )
								{
									if ( !allPlugins[ requires[ i ] ] )
										requiredPlugins.push( requires[ i ] );
								}
							}
						}

						if ( requiredPlugins.length )
							loadPlugins.call( this, requiredPlugins );
						else
						{
							// Call the "onLoad" function for all plugins.
							for ( pluginName in allPlugins )
							{
								plugin = allPlugins[ pluginName ];
								if ( plugin.onLoad && !plugin.onLoad._called )
								{
									plugin.onLoad();
									plugin.onLoad._called = 1;
								}
							}

							// Call the callback.
							if ( callback )
								callback.call( scope || window, allPlugins );
						}
					}
					, this);

			};

			loadPlugins.call( this, name );
		};
	});

/**
 * Loads a specific language file, or auto detect it. A callback is
 * then called when the file gets loaded.
 * @param {String} pluginName The name of the plugin to which the provided translation
 * 		should be attached.
 * @param {String} languageCode The code of the language translation provided.
 * @param {Object} languageEntries An object that contains pairs of label and
 *		the respective translation.
 * @example
 * OMEDITOR.plugins.setLang( 'myPlugin', 'en', {
 * 	title : 'My plugin',
 * 	selectOption : 'Please select an option'
 * } );
 */
OMEDITOR.plugins.setLang = function( pluginName, languageCode, languageEntries )
{
	var plugin = this.get( pluginName ),
		pluginLangEntries = plugin.langEntries || ( plugin.langEntries = {} ),
		pluginLang = plugin.lang || ( plugin.lang = [] );

	if ( OMEDITOR.tools.indexOf( pluginLang, languageCode ) == -1 )
		pluginLang.push( languageCode );

	pluginLangEntries[ languageCode ] = languageEntries;
};
