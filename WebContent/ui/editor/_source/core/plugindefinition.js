/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the "virtual" {@link OMEDITOR.pluginDefinition} class, which
 *		contains the defintion of a plugin. This file is for documentation
 *		purposes only.
 */

/**
 * (Virtual Class) Do not call this constructor. This class is not really part
 *		of the API. It just illustrates the features of plugin objects to be
 *		passed to the {@link OMEDITOR.plugins.add} function.
 * @name OMEDITOR.pluginDefinition
 * @constructor
 * @example
 */

/**
 * A list of plugins that are required by this plugin. Note that this property
 * doesn't guarantee the loading order of the plugins.
 * @name OMEDITOR.pluginDefinition.prototype.requires
 * @type Array
 * @example
 * OMEDITOR.plugins.add( 'sample',
 * {
 *     requires : [ 'button', 'selection' ]
 * });
 */

/**
 * A list of language files available for this plugin. These files are stored inside
 * the "lang" directory, which is inside the plugin directory, follow the name
 * pattern of "langCode.js", and contain a language definition created with {@link OMEDITOR.pluginDefinition#setLang}.
 * While the plugin is being loaded, the editor checks this list to see if
 * a language file of the current editor language ({@link OMEDITOR.editor#langCode})
 * is available, and if so, loads it. Otherwise, the file represented by the first list item
 * in the list is loaded.
 * @name OMEDITOR.pluginDefinition.prototype.lang
 * @type Array
 * @example
 * OMEDITOR.plugins.add( 'sample',
 * {
 *     lang : [ 'en', 'fr' ]
 * });
 */

 /**
 * Function called on initialization of every editor instance created in the
 * page before the init() call task. The beforeInit function will be called for
 * all plugins, after that the init function is called for all of them. This
 * feature makes it possible to initialize things that could be used in the
 * init function of other plugins.
 * @name OMEDITOR.pluginDefinition.prototype.beforeInit
 * @function
 * @param {OMEDITOR.editor} editor The editor instance being initialized.
 * @example
 * OMEDITOR.plugins.add( 'sample',
 * {
 *     beforeInit : function( editor )
 *     {
 *         alert( 'Editor "' + editor.name + '" is to be initialized!' );
 *     }
 * });
 */

 /**
 * Function called on initialization of every editor instance created in the
 * page.
 * @name OMEDITOR.pluginDefinition.prototype.init
 * @function
 * @param {OMEDITOR.editor} editor The editor instance being initialized.
 * @example
 * OMEDITOR.plugins.add( 'sample',
 * {
 *     init : function( editor )
 *     {
 *         alert( 'Editor "' + editor.name + '" is being initialized!' );
 *     }
 * });
 */
