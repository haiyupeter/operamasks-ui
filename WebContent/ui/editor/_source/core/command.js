/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * Creates a command class instance.
 * @class Represents a command that can be executed on an editor instance.
 * @param {OMEDITOR.editor} editor The editor instance this command will be
 *		related to.
 * @param {OMEDITOR.commandDefinition} commandDefinition The command
 *		definition.
 * @augments OMEDITOR.event
 * @example
 * var command = new OMEDITOR.command( editor,
 *     {
 *         exec : function( editor )
 *         {
 *             alert( editor.document.getBody().getHtml() );
 *         }
 *     });
 */
OMEDITOR.command = function( editor, commandDefinition )
{
	/**
	 * Lists UI items that are associated to this command. This list can be
	 * used to interact with the UI on command execution (by the execution code
	 * itself, for example).
	 * @type Array
	 * @example
	 * alert( 'Number of UI items associated to this command: ' + command.<b>uiItems</b>.length );
	 */
	this.uiItems = [];

	/**
	 * Executes the command.
	 * @param {Object} [data] Any data to pass to the command. Depends on the
	 *		command implementation and requirements.
	 * @returns {Boolean} A boolean indicating that the command has been
	 *      successfully executed.
	 * @example
	 * command.<b>exec()</b>;  // The command gets executed.
	 */
	this.exec = function( data )
	{
		if ( this.state == OMEDITOR.TRISTATE_DISABLED )
			return false;

		if ( this.editorFocus )     // Give editor focus if necessary (#4355).
			editor.focus();

		return ( commandDefinition.exec.call( this, editor, data ) !== false );
	};

	OMEDITOR.tools.extend( this, commandDefinition,
		// Defaults
		/** @lends OMEDITOR.command.prototype */
		{
			/**
			 * The editor modes within which the command can be executed. The
			 * execution will have no action if the current mode is not listed
			 * in this property.
			 * @type Object
			 * @default { wysiwyg : 1 }
			 * @see OMEDITOR.editor.prototype.mode
			 * @example
			 * // Enable the command in both WYSIWYG and Source modes.
			 * command.<b>modes</b> = { wysiwyg : 1, source : 1 };
			 * @example
			 * // Enable the command in Source mode only.
			 * command.<b>modes</b> = { source : 1 };
			 */
			modes : { wysiwyg : 1 },

			/**
			 * Indicates that the editor will get the focus before executing
			 * the command.
			 * @type Boolean
			 * @default true
			 * @example
			 * // Do not force the editor to have focus when executing the command.
			 * command.<b>editorFocus</b> = false;
			 */
			editorFocus : 1,

			/**
			 * Indicates the editor state. Possible values are:
			 * <ul>
			 * <li>{@link OMEDITOR.TRISTATE_DISABLED}: the command is
			 *		disabled. It's execution will have no effect. Same as
			 *		{@link disable}.</li>
			 * <li>{@link OMEDITOR.TRISTATE_ON}: the command is enabled
			 *		and currently active in the editor (for context sensitive commands,
			 *		for example).</li>
			 * <li>{@link OMEDITOR.TRISTATE_OFF}: the command is enabled
			 *		and currently inactive in the editor (for context sensitive
			 *		commands, for example).</li>
			 * </ul>
			 * Do not set this property directly, using the {@link #setState}
			 * method instead.
			 * @type Number
			 * @default {@link OMEDITOR.TRISTATE_OFF}
			 * @example
			 * if ( command.<b>state</b> == OMEDITOR.TRISTATE_DISABLED )
			 *     alert( 'This command is disabled' );
			 */
			state : OMEDITOR.TRISTATE_OFF
		});

	// Call the OMEDITOR.event constructor to initialize this instance.
	OMEDITOR.event.call( this );
};

OMEDITOR.command.prototype =
{
	/**
	 * Enables the command for execution. The command state (see
	 * {@link OMEDITOR.command.prototype.state}) available before disabling it
	 * is restored.
	 * @example
	 * command.<b>enable()</b>;
	 * command.exec();    // Execute the command.
	 */
	enable : function()
	{
		if ( this.state == OMEDITOR.TRISTATE_DISABLED )
			this.setState( ( !this.preserveState || ( typeof this.previousState == 'undefined' ) ) ? OMEDITOR.TRISTATE_OFF : this.previousState );
	},

	/**
	 * Disables the command for execution. The command state (see
	 * {@link OMEDITOR.command.prototype.state}) will be set to
	 * {@link OMEDITOR.TRISTATE_DISABLED}.
	 * @example
	 * command.<b>disable()</b>;
	 * command.exec();    // "false" - Nothing happens.
	 */
	disable : function()
	{
		this.setState( OMEDITOR.TRISTATE_DISABLED );
	},

	/**
	 * Sets the command state.
	 * @param {Number} newState The new state. See {@link #state}.
	 * @returns {Boolean} Returns "true" if the command state changed.
	 * @example
	 * command.<b>setState( OMEDITOR.TRISTATE_ON )</b>;
	 * command.exec();    // Execute the command.
	 * command.<b>setState( OMEDITOR.TRISTATE_DISABLED )</b>;
	 * command.exec();    // "false" - Nothing happens.
	 * command.<b>setState( OMEDITOR.TRISTATE_OFF )</b>;
	 * command.exec();    // Execute the command.
	 */
	setState : function( newState )
	{
		// Do nothing if there is no state change.
		if ( this.state == newState )
			return false;

		this.previousState = this.state;

		// Set the new state.
		this.state = newState;

		// Fire the "state" event, so other parts of the code can react to the
		// change.
		this.fire( 'state' );

		return true;
	},

	/**
	 * Toggles the on/off (active/inactive) state of the command. This is
	 * mainly used internally by context sensitive commands.
	 * @example
	 * command.<b>toggleState()</b>;
	 */
	toggleState : function()
	{
		if ( this.state == OMEDITOR.TRISTATE_OFF )
			this.setState( OMEDITOR.TRISTATE_ON );
		else if ( this.state == OMEDITOR.TRISTATE_ON )
			this.setState( OMEDITOR.TRISTATE_OFF );
	}
};

OMEDITOR.event.implementOn( OMEDITOR.command.prototype, true );

/**
 * Indicates the previous command state.
 * @name OMEDITOR.command.prototype.previousState
 * @type Number
 * @see #state
 * @example
 * alert( command.<b>previousState</b> );
 */

/**
 * Fired when the command state changes.
 * @name OMEDITOR.command#state
 * @event
 * @example
 * command.on( <b>'state'</b> , function( e )
 *     {
 *         // Alerts the new state.
 *         alert( this.state );
 *     });
 */
