/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.themes} object, which is used to
 *		manage themes registration and loading.
 */

/**
 * Manages themes registration and loading.
 * @namespace
 * @augments OMEDITOR.resourceManager
 * @example
 */
OMEDITOR.themes = new OMEDITOR.resourceManager(
	'_source/'+		// @Packager.RemoveLine
	'themes/', 'theme' );
