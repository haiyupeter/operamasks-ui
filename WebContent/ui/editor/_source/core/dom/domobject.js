/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.editor} class, which is the base
 *		for other classes representing DOM objects.
 */

/**
 * Represents a DOM object. This class is not intended to be used directly. It
 * serves as the base class for other classes representing specific DOM
 * objects.
 * @constructor
 * @param {Object} nativeDomObject A native DOM object.
 * @augments OMEDITOR.event
 * @example
 */
OMEDITOR.dom.domObject = function( nativeDomObject )
{
	if ( nativeDomObject )
	{
		/**
		 * The native DOM object represented by this class instance.
		 * @type Object
		 * @example
		 * var element = new OMEDITOR.dom.element( 'span' );
		 * alert( element.$.nodeType );  // "1"
		 */
		this.$ = nativeDomObject;
	}
};

OMEDITOR.dom.domObject.prototype = (function()
{
	// Do not define other local variables here. We want to keep the native
	// listener closures as clean as possible.

	var getNativeListener = function( domObject, eventName )
	{
		return function( domEvent )
		{
			// In FF, when reloading the page with the editor focused, it may
			// throw an error because the OMEDITOR global is not anymore
			// available. So, we check it here first. (#2923)
			if ( typeof OMEDITOR != 'undefined' )
				domObject.fire( eventName, new OMEDITOR.dom.event( domEvent ) );
		};
	};

	return /** @lends OMEDITOR.dom.domObject.prototype */ {

		getPrivate : function()
		{
			var priv;

			// Get the main private function from the custom data. Create it if not
			// defined.
			if ( !( priv = this.getCustomData( '_' ) ) )
				this.setCustomData( '_', ( priv = {} ) );

			return priv;
		},

		/** @ignore */
		on  : function( eventName )
		{
			// We customize the "on" function here. The basic idea is that we'll have
			// only one listener for a native event, which will then call all listeners
			// set to the event.

			// Get the listeners holder object.
			var nativeListeners = this.getCustomData( '_cke_nativeListeners' );

			if ( !nativeListeners )
			{
				nativeListeners = {};
				this.setCustomData( '_cke_nativeListeners', nativeListeners );
			}

			// Check if we have a listener for that event.
			if ( !nativeListeners[ eventName ] )
			{
				var listener = nativeListeners[ eventName ] = getNativeListener( this, eventName );

				if ( this.$.attachEvent )
					this.$.attachEvent( 'on' + eventName, listener );
				else if ( this.$.addEventListener )
					this.$.addEventListener( eventName, listener, !!OMEDITOR.event.useCapture );
			}

			// Call the original implementation.
			return OMEDITOR.event.prototype.on.apply( this, arguments );
		},

		/** @ignore */
		removeListener : function( eventName )
		{
			// Call the original implementation.
			OMEDITOR.event.prototype.removeListener.apply( this, arguments );

			// If we don't have listeners for this event, clean the DOM up.
			if ( !this.hasListeners( eventName ) )
			{
				var nativeListeners = this.getCustomData( '_cke_nativeListeners' );
				var listener = nativeListeners && nativeListeners[ eventName ];
				if ( listener )
				{
					if ( this.$.detachEvent )
						this.$.detachEvent( 'on' + eventName, listener );
					else if ( this.$.removeEventListener )
						this.$.removeEventListener( eventName, listener, false );

					delete nativeListeners[ eventName ];
				}
			}
		},

		/**
		 * Removes any listener set on this object.
		 * To avoid memory leaks we must assure that there are no
		 * references left after the object is no longer needed.
		 */
		removeAllListeners : function()
		{
			var nativeListeners = this.getCustomData( '_cke_nativeListeners' );
			for ( var eventName in nativeListeners )
			{
				var listener = nativeListeners[ eventName ];
				if ( this.$.detachEvent )
					this.$.detachEvent( 'on' + eventName, listener );
				else if ( this.$.removeEventListener )
					this.$.removeEventListener( eventName, listener, false );

				delete nativeListeners[ eventName ];
			}
		}
	};
})();

(function( domObjectProto )
{
	var customData = {};

	OMEDITOR.on( 'reset', function()
		{
			customData = {};
		});

	/**
	 * Determines whether the specified object is equal to the current object.
	 * @name OMEDITOR.dom.domObject.prototype.equals
	 * @function
	 * @param {Object} object The object to compare with the current object.
	 * @returns {Boolean} "true" if the object is equal.
	 * @example
	 * var doc = new OMEDITOR.dom.document( document );
	 * alert( doc.equals( OMEDITOR.document ) );  // "true"
	 * alert( doc == OMEDITOR.document );         // "false"
	 */
	domObjectProto.equals = function( object )
	{
		return ( object && object.$ === this.$ );
	};

	/**
	 * Sets a data slot value for this object. These values are shared by all
	 * instances pointing to that same DOM object.
	 * <strong>Note:</strong> The created data slot is only guarantied to be available on this unique dom node,
	 * thus any wish to continue access it from other element clones (either created by clone node or from innerHtml)
	 * will fail, for such usage, please use {@link OMEDITOR.dom.element::setAttribute} instead.
	 * @name OMEDITOR.dom.domObject.prototype.setCustomData
	 * @function
	 * @param {String} key A key used to identify the data slot.
	 * @param {Object} value The value to set to the data slot.
	 * @returns {OMEDITOR.dom.domObject} This DOM object instance.
	 * @see OMEDITOR.dom.domObject.prototype.getCustomData
	 * @example
	 * var element = new OMEDITOR.dom.element( 'span' );
	 * element.setCustomData( 'hasCustomData', true );
	 */
	domObjectProto.setCustomData = function( key, value )
	{
		var expandoNumber = this.getUniqueId(),
			dataSlot = customData[ expandoNumber ] || ( customData[ expandoNumber ] = {} );

		dataSlot[ key ] = value;

		return this;
	};

	/**
	 * Gets the value set to a data slot in this object.
	 * @name OMEDITOR.dom.domObject.prototype.getCustomData
	 * @function
	 * @param {String} key The key used to identify the data slot.
	 * @returns {Object} This value set to the data slot.
	 * @see OMEDITOR.dom.domObject.prototype.setCustomData
	 * @example
	 * var element = new OMEDITOR.dom.element( 'span' );
	 * alert( element.getCustomData( 'hasCustomData' ) );  // e.g. 'true'
	 */
	domObjectProto.getCustomData = function( key )
	{
		var expandoNumber = this.$[ 'data-cke-expando' ],
			dataSlot = expandoNumber && customData[ expandoNumber ];

		return dataSlot && dataSlot[ key ];
	};

	/**
	 * @name OMEDITOR.dom.domObject.prototype.removeCustomData
	 */
	domObjectProto.removeCustomData = function( key )
	{
		var expandoNumber = this.$[ 'data-cke-expando' ],
			dataSlot = expandoNumber && customData[ expandoNumber ],
			retval = dataSlot && dataSlot[ key ];

		if ( typeof retval != 'undefined' )
			delete dataSlot[ key ];

		return retval || null;
	};

	/**
	 * Removes any data stored on this object.
	 * To avoid memory leaks we must assure that there are no
	 * references left after the object is no longer needed.
	 * @name OMEDITOR.dom.domObject.prototype.clearCustomData
	 * @function
	 */
	domObjectProto.clearCustomData = function()
	{
		// Clear all event listeners
		this.removeAllListeners();

		var expandoNumber = this.$[ 'data-cke-expando' ];
		expandoNumber && delete customData[ expandoNumber ];
	};

	/**
	 * Gets an ID that can be used to identiquely identify this DOM object in
	 * the running session.
	 * @name OMEDITOR.dom.domObject.prototype.getUniqueId
	 * @function
	 * @returns {Number} A unique ID.
	 */
	domObjectProto.getUniqueId = function()
	{
		return this.$[ 'data-cke-expando' ] || ( this.$[ 'data-cke-expando' ] = OMEDITOR.tools.getNextNumber() );
	};

	// Implement OMEDITOR.event.
	OMEDITOR.event.implementOn( domObjectProto );

})( OMEDITOR.dom.domObject.prototype );
