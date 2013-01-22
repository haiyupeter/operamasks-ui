/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview API initialization code.
 */

(function()
{
	// Disable HC detaction in WebKit. (#5429)
	if ( OMEDITOR.env.webkit )
	{
		OMEDITOR.env.hc = false;
		return;
	}

	// Check whether high contrast is active by creating a colored border.
	var hcDetect = OMEDITOR.dom.element.createFromHtml(
		'<div style="width:0px;height:0px;position:absolute;left:-10000px;' +
			'border: 1px solid;border-color: red blue;"></div>', OMEDITOR.document );

	hcDetect.appendTo( OMEDITOR.document.getHead() );

	// Update OMEDITOR.env.
	// Catch exception needed sometimes for FF. (#4230)
	try
	{
		OMEDITOR.env.hc = hcDetect.getComputedStyle( 'border-top-color' ) == hcDetect.getComputedStyle( 'border-right-color' );
	}
	catch (e)
	{
		OMEDITOR.env.hc = false;
	}

	if ( OMEDITOR.env.hc )
		OMEDITOR.env.cssClass += ' cke_hc';

	hcDetect.remove();
})();

// Load core plugins.
OMEDITOR.plugins.load( OMEDITOR.config.corePlugins.split( ',' ), function()
	{
		OMEDITOR.status = 'loaded';
		OMEDITOR.fire( 'loaded' );

		// Process all instances created by the "basic" implementation.
		var pending = OMEDITOR._.pending;
		if ( pending )
		{
			delete OMEDITOR._.pending;

			for ( var i = 0 ; i < pending.length ; i++ )
				OMEDITOR.add( pending[ i ] );
		}
	});

// Needed for IE6 to not request image (HTTP 200 or 304) for every CSS background. (#6187)
if ( OMEDITOR.env.ie )
{
	// Remove IE mouse flickering on IE6 because of background images.
	try
	{
		document.execCommand( 'BackgroundImageCache', false, true );
	}
	catch (e)
	{
		// We have been reported about loading problems caused by the above
		// line. For safety, let's just ignore errors.
	}
}

/**
 * Indicates that OMEditor is running on a High Contrast environment.
 * @name OMEDITOR.env.hc
 * @example
 * if ( OMEDITOR.env.hc )
 *     alert( 'You're running on High Contrast mode. The editor interface will get adapted to provide you a better experience.' );
 */

/**
 * Fired when a OMEDITOR core object is fully loaded and ready for interaction.
 * @name OMEDITOR#loaded
 * @event
 */
