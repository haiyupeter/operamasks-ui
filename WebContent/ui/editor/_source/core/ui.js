/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * Contains UI features related to an editor instance.
 * @constructor
 * @param {OMEDITOR.editor} editor The editor instance.
 * @example
 */
OMEDITOR.ui = function( editor )
{
	if ( editor.ui )
		return editor.ui;

	/**
	 * Object used to hold private stuff.
	 * @private
	 */
	this._ =
	{
		handlers : {},
		items : {},
		editor : editor
	};

	return this;
};

// PACKAGER_RENAME( OMEDITOR.ui )

OMEDITOR.ui.prototype =
{
	/**
	 * Adds a UI item to the items collection. These items can be later used in
	 * the interface.
	 * @param {String} name The UI item name.
	 * @param {Object} type The item type.
	 * @param {Object} definition The item definition. The properties of this
	 *		object depend on the item type.
	 * @example
	 * // Add a new button named "MyBold".
	 * editorInstance.ui.add( 'MyBold', OMEDITOR.UI_BUTTON,
	 *     {
	 *         label : 'My Bold',
	 *         command : 'bold'
	 *     });
	 */
	add : function( name, type, definition )
	{
		this._.items[ name ] =
		{
			type : type,
			// The name of {@link OMEDITOR.command} which associate with this UI.
			command : definition.command || null,
			args : Array.prototype.slice.call( arguments, 2 )
		};
	},

	/**
	 * Gets a UI object.
	 * @param {String} name The UI item hame.
	 * @example
	 */
	create : function( name )
	{
		var item	= this._.items[ name ],
			handler	= item && this._.handlers[ item.type ],
			command = item && item.command && this._.editor.getCommand( item.command );

		var result = handler && handler.create.apply( this, item.args );

		// Allow overrides from skin ui definitions..
		item && ( result = OMEDITOR.tools.extend( result, this._.editor.skin[ item.type ], true ) );

		// Add reference inside command object.
		if ( command )
			command.uiItems.push( result );

		return result;
	},

	/**
	 * Adds a handler for a UI item type. The handler is responsible for
	 * transforming UI item definitions in UI objects.
	 * @param {Object} type The item type.
	 * @param {Object} handler The handler definition.
	 * @example
	 */
	addHandler : function( type, handler )
	{
		this._.handlers[ type ] = handler;
	}
};

OMEDITOR.event.implementOn( OMEDITOR.ui );

/**
 * (Virtual Class) Do not call this constructor. This class is not really part
 *		of the API. It just illustrates the features of hanlder objects to be
 *		passed to the {@link OMEDITOR.ui.prototype.addHandler} function.
 * @name OMEDITOR.ui.handlerDefinition
 * @constructor
 * @example
 */

 /**
 * Transforms an item definition into an UI item object.
 * @name OMEDITOR.handlerDefinition.prototype.create
 * @function
 * @param {Object} definition The item definition.
 * @example
 * editorInstance.ui.addHandler( OMEDITOR.UI_BUTTON,
 *     {
 *         create : function( definition )
 *         {
 *             return new OMEDITOR.ui.button( definition );
 *         }
 *     });
 */

/**
 * Internal event fired when a new UI element is ready
 * @name OMEDITOR.ui#ready
 * @event
 * @param {Object} element The new element
 */
