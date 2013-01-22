/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the "virtual" {@link OMEDITOR.eventInfo} class, which
 *		contains the defintions of the event object passed to event listeners.
 *		This file is for documentation purposes only.
 */

/**
 * (Virtual Class) Do not call this constructor. This class is not really part
 * of the API.
 * @class Virtual class that illustrates the features of the event object to be
 * passed to event listeners by a {@link OMEDITOR.event} based object.
 * @name OMEDITOR.eventInfo
 * @example
 * // Do not do this.
 * var myEvent = new OMEDITOR.eventInfo();  // Error: OMEDITOR.eventInfo is undefined
 */

/**
 * The event name.
 * @name OMEDITOR.eventInfo.prototype.name
 * @field
 * @type String
 * @example
 * someObject.on( 'someEvent', function( event )
 *     {
 *         alert( <b>event.name</b> );  // "someEvent"
 *     });
 * someObject.fire( 'someEvent' );
 */

/**
 * The object that publishes (sends) the event.
 * @name OMEDITOR.eventInfo.prototype.sender
 * @field
 * @type Object
 * @example
 * someObject.on( 'someEvent', function( event )
 *     {
 *         alert( <b>event.sender</b> == someObject );  // "true"
 *     });
 * someObject.fire( 'someEvent' );
 */

/**
 * The editor instance that holds the sender. May be the same as sender. May be
 * null if the sender is not part of an editor instance, like a component
 * running in standalone mode.
 * @name OMEDITOR.eventInfo.prototype.editor
 * @field
 * @type OMEDITOR.editor
 * @example
 * myButton.on( 'someEvent', function( event )
 *     {
 *         alert( <b>event.editor</b> == myEditor );  // "true"
 *     });
 * myButton.fire( 'someEvent', null, <b>myEditor</b> );
 */

/**
 * Any kind of additional data. Its format and usage is event dependent.
 * @name OMEDITOR.eventInfo.prototype.data
 * @field
 * @type Object
 * @example
 * someObject.on( 'someEvent', function( event )
 *     {
 *         alert( <b>event.data</b> );  // "Example"
 *     });
 * someObject.fire( 'someEvent', <b>'Example'</b> );
 */

/**
 * Any extra data appended during the listener registration.
 * @name OMEDITOR.eventInfo.prototype.listenerData
 * @field
 * @type Object
 * @example
 * someObject.on( 'someEvent', function( event )
 *     {
 *         alert( <b>event.listenerData</b> );  // "Example"
 *     }
 *     , null, <b>'Example'</b> );
 */

/**
 * Indicates that no further listeners are to be called.
 * @name OMEDITOR.eventInfo.prototype.stop
 * @function
 * @example
 * someObject.on( 'someEvent', function( event )
 *     {
 *         <b>event.stop()</b>;
 *     });
 * someObject.on( 'someEvent', function( event )
 *     {
 *         // This one will not be called.
 *     });
 * alert( someObject.fire( 'someEvent' ) );  // "false"
 */

/**
 * Indicates that the event is to be cancelled (if cancelable).
 * @name OMEDITOR.eventInfo.prototype.cancel
 * @function
 * @example
 * someObject.on( 'someEvent', function( event )
 *     {
 *         <b>event.cancel()</b>;
 *     });
 * someObject.on( 'someEvent', function( event )
 *     {
 *         // This one will not be called.
 *     });
 * alert( someObject.fire( 'someEvent' ) );  // "true"
 */
