/*
 * droppable_defaults.js
 */

var droppable_defaults = {
	accept: '*',
	activeClass: false,
	disabled: false,
	greedy: false,
	hoverClass: false,
	_scope: 'default'
};

commonWidgetTests('omDroppable', { defaults: droppable_defaults });
