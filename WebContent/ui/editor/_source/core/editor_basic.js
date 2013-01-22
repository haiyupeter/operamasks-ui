/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

if ( !OMEDITOR.editor )
{
	/**
	 * No element is linked to the editor instance.
	 * @constant
	 * @example
	 */
	OMEDITOR.ELEMENT_MODE_NONE = 0;

	/**
	 * The element is to be replaced by the editor instance.
	 * @constant
	 * @example
	 */
	OMEDITOR.ELEMENT_MODE_REPLACE = 1;

	/**
	 * The editor is to be created inside the element.
	 * @constant
	 * @example
	 */
	OMEDITOR.ELEMENT_MODE_APPENDTO = 2;

	/**
	 * Creates an editor class instance. This constructor should be rarely
	 * used, in favor of the {@link OMEDITOR} editor creation functions.
	 * @ class Represents an editor instance.
	 * @param {Object} instanceConfig Configuration values for this specific
	 *		instance.
	 * @param {OMEDITOR.dom.element} [element] The element linked to this
	 *		instance.
	 * @param {Number} [mode] The mode in which the element is linked to this
	 *		instance. See {@link #elementMode}.
	 * @param {String} [data] Since 3.3. Initial value for the instance.
	 * @augments OMEDITOR.event
	 * @example
	 */
	OMEDITOR.editor = function( instanceConfig, element, mode, data )
	{
		this._ =
		{
			// Save the config to be processed later by the full core code.
			instanceConfig : instanceConfig,
			element : element,
			data : data
		};

		/**
		 * The mode in which the {@link #element} is linked to this editor
		 * instance. It can be any of the following values:
		 * <ul>
		 * <li>{@link OMEDITOR.ELEMENT_MODE_NONE}: No element is linked to the
		 *		editor instance.</li>
		 * <li>{@link OMEDITOR.ELEMENT_MODE_REPLACE}: The element is to be
		 *		replaced by the editor instance.</li>
		 * <li>{@link OMEDITOR.ELEMENT_MODE_APPENDTO}: The editor is to be
		 *		created inside the element.</li>
		 * </ul>
		 * @name OMEDITOR.editor.prototype.elementMode
		 * @type Number
		 * @example
		 * var editor = OMEDITOR.replace( 'editor1' );
		 * alert( <b>editor.elementMode</b> );  "1"
		 */
		this.elementMode = mode || OMEDITOR.ELEMENT_MODE_NONE;

		// Call the OMEDITOR.event constructor to initialize this instance.
		OMEDITOR.event.call( this );

		this._init();
	};

	/**
	 * Replaces a &lt;textarea&gt; or a DOM element (DIV) with a OMEditor
	 * instance. For textareas, the initial value in the editor will be the
	 * textarea value. For DOM elements, their innerHTML will be used
	 * instead. We recommend using TEXTAREA and DIV elements only. Do not use
	 * this function directly. Use {@link OMEDITOR.replace} instead.
	 * @param {Object|String} elementOrIdOrName The DOM element (textarea), its
	 *		ID or name.
	 * @param {Object} [config] The specific configurations to apply to this
	 *		editor instance. Configurations set here will override global OMEditor
	 *		settings.
	 * @returns {OMEDITOR.editor} The editor instance created.
	 * @example
	 */
	OMEDITOR.editor.replace = function( elementOrIdOrName, config )
	{
		var element = elementOrIdOrName;

		if ( typeof element != 'object' )
		{
			// Look for the element by id. We accept any kind of element here.
			element = document.getElementById( elementOrIdOrName );

			// Elements that should go into head are unacceptable (#6791).
			if ( element && element.tagName.toLowerCase() in {style:1,script:1,base:1,link:1,meta:1,title:1} )
				element = null;

			// If not found, look for elements by name. In this case we accept only
			// textareas.
			if ( !element )
			{
				var i = 0,
					textareasByName	= document.getElementsByName( elementOrIdOrName );

				while ( ( element = textareasByName[ i++ ] ) && element.tagName.toLowerCase() != 'textarea' )
				{ /*jsl:pass*/ }
			}

			if ( !element )
				throw '[OMEDITOR.editor.replace] The element with id or name "' + elementOrIdOrName + '" was not found.';
		}

		// Do not replace the textarea right now, just hide it. The effective
		// replacement will be done by the _init function.
		element.style.visibility = 'hidden';

		// Create the editor instance.
		return new OMEDITOR.editor( config, element, OMEDITOR.ELEMENT_MODE_REPLACE );
	};

	/**
	 * Creates a new editor instance inside a specific DOM element. Do not use
	 * this function directly. Use {@link OMEDITOR.appendTo} instead.
	 * @param {Object|String} elementOrId The DOM element or its ID.
	 * @param {Object} [config] The specific configurations to apply to this
	 *		editor instance. Configurations set here will override global OMEditor
	 *		settings.
	 * @param {String} [data] Since 3.3. Initial value for the instance.
	 * @returns {OMEDITOR.editor} The editor instance created.
	 * @example
	 */
	OMEDITOR.editor.appendTo = function( elementOrId, config, data )
	{
		var element = elementOrId;
		if ( typeof element != 'object' )
		{
			element = document.getElementById( elementOrId );

			if ( !element )
				throw '[OMEDITOR.editor.appendTo] The element with id "' + elementOrId + '" was not found.';
		}

		// Create the editor instance.
		return new OMEDITOR.editor( config, element, OMEDITOR.ELEMENT_MODE_APPENDTO, data );
	};

	OMEDITOR.editor.prototype =
	{
		/**
		 * Initializes the editor instance. This function will be overriden by the
		 * full OMEDITOR.editor implementation (editor.js).
		 * @private
		 */
		_init : function()
		{
			var pending = OMEDITOR.editor._pending || ( OMEDITOR.editor._pending = [] );
			pending.push( this );
		},

		// Both fire and fireOnce will always pass this editor instance as the
		// "editor" param in OMEDITOR.event.fire. So, we override it to do that
		// automaticaly.

		/** @ignore */
		fire : function( eventName, data )
		{
			return OMEDITOR.event.prototype.fire.call( this, eventName, data, this );
		},

		/** @ignore */
		fireOnce : function( eventName, data )
		{
			return OMEDITOR.event.prototype.fireOnce.call( this, eventName, data, this );
		}
	};

	// "Inherit" (copy actually) from OMEDITOR.event.
	OMEDITOR.event.implementOn( OMEDITOR.editor.prototype, true );
}
