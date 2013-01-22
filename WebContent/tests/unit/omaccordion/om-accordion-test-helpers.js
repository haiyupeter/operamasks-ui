function accordion_state( omAccordion ) {
	var expected = $.makeArray( arguments ).slice( 1 );
	var actual = omAccordion.find( ".om-panel-body" ).map(function() {
		return $( this ).css( "display" ) === "none" ? 0 : 1;
	}).get();
	deepEqual( actual, expected );
}

function accordion_equalHeights( omAccordion, min, max ) {
	var sizes = [];
	omAccordion.find( ".om-panel-body" ).each(function() {
		sizes.push( $( this ).outerHeight() );
	});
	ok( sizes[ 0 ] >= min && sizes[ 0 ] <= max,
		"must be within " + min + " and " + max + ", was " + sizes[ 0 ] );
	deepEqual( sizes [ 0 ], sizes[ 1 ] );
	deepEqual( sizes[ 0 ], sizes[ 2 ] );
}

function accordion_setupTeardown() {
	
	var switchEffect = $.om.omAccordion.prototype.options.switchEffect;
	return {
		setup: function() {
			$.om.omAccordion.prototype.options.switchEffect = false;
		},
		teardown: function() {
			$.om.omAccordion.prototype.options.switchEffect = switchEffect;
		}
	};
	
}
