/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Contains the third and last part of the {@link OMEDITOR} object
 *		definition.
 */

// Remove the OMEDITOR.loadFullCore reference defined on omeditor_basic.
delete OMEDITOR.loadFullCore;

/**
 * Holds references to all editor instances created. The name of the properties
 * in this object correspond to instance names, and their values contains the
 * {@link OMEDITOR.editor} object representing them.
 * @type {Object}
 * @example
 * alert( <b>OMEDITOR.instances</b>.editor1.name );  // "editor1"
 */
OMEDITOR.instances = {};

/**
 * The document of the window holding the OMEDITOR object.
 * @type {OMEDITOR.dom.document}
 * @example
 * alert( <b>OMEDITOR.document</b>.getBody().getName() );  // "body"
 */
OMEDITOR.document = new OMEDITOR.dom.document( document );

/**
 * Adds an editor instance to the global {@link OMEDITOR} object. This function
 * is available for internal use mainly.
 * @param {OMEDITOR.editor} editor The editor instance to be added.
 * @example
 */
OMEDITOR.add = function( editor )
{
	OMEDITOR.instances[ editor.name ] = editor;

	editor.on( 'focus', function()
		{
			if ( OMEDITOR.currentInstance != editor )
			{
				OMEDITOR.currentInstance = editor;
				OMEDITOR.fire( 'currentInstance' );
			}
		});

	editor.on( 'blur', function()
		{
			if ( OMEDITOR.currentInstance == editor )
			{
				OMEDITOR.currentInstance = null;
				OMEDITOR.fire( 'currentInstance' );
			}
		});
};

/**
 * Removes an editor instance from the global {@link OMEDITOR} object. This function
 * is available for internal use only. External code must use {@link OMEDITOR.editor.prototype.destroy}
 * to avoid memory leaks.
 * @param {OMEDITOR.editor} editor The editor instance to be removed.
 * @example
 */
OMEDITOR.remove = function( editor )
{
	delete OMEDITOR.instances[ editor.name ];
};

/**
 * Perform global clean up to free as much memory as possible
 * when there are no instances left
 */
OMEDITOR.on( 'instanceDestroyed', function ()
	{
		if ( OMEDITOR.tools.isEmpty( this.instances ) )
			OMEDITOR.fire( 'reset' );
	});

// Load the bootstrap script.
OMEDITOR.loader.load( 'core/_bootstrap' );		// @Packager.RemoveLine

// Tri-state constants.

/**
 * Used to indicate the ON or ACTIVE state.
 * @constant
 * @example
 */
OMEDITOR.TRISTATE_ON = 1;

/**
 * Used to indicate the OFF or NON ACTIVE state.
 * @constant
 * @example
 */
OMEDITOR.TRISTATE_OFF = 2;

/**
 * Used to indicate DISABLED state.
 * @constant
 * @example
 */
OMEDITOR.TRISTATE_DISABLED = 0;

/**
 * The editor which is currently active (have user focus).
 * @name OMEDITOR.currentInstance
 * @type OMEDITOR.editor
 * @see OMEDITOR#currentInstance
 * @example
 * function showCurrentEditorName()
 * {
 *     if ( OMEDITOR.currentInstance )
 *         alert( OMEDITOR.currentInstance.name );
 *     else
 *         alert( 'Please focus an editor first.' );
 * }
 */

/**
 * Fired when the OMEDITOR.currentInstance object reference changes. This may
 * happen when setting the focus on different editor instances in the page.
 * @name OMEDITOR#currentInstance
 * @event
 * var editor;  // Variable to hold a reference to the current editor.
 * OMEDITOR.on( 'currentInstance' , function( e )
 *     {
 *         editor = OMEDITOR.currentInstance;
 *     });
 */

/**
 * Fired when the last instance has been destroyed. This event is used to perform
 * global memory clean up.
 * @name OMEDITOR#reset
 * @event
 */
