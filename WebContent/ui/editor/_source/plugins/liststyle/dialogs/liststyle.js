/*
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 */

(function()
{
	function getListElement( editor, listTag )
	{
		var range;
		try { range  = editor.getSelection().getRanges()[ 0 ]; }
		catch( e ) { return null; }

		range.shrink( OMEDITOR.SHRINK_TEXT );
		return range.getCommonAncestor().getAscendant( listTag, 1 );
	}

	var listItem = function( node ) { return node.type == OMEDITOR.NODE_ELEMENT && node.is( 'li' ); };

	var mapListStyle = {
		'a' : 'lower-alpha',
		'A' : 'upper-alpha',
		'i' : 'lower-roman',
		'I' : 'upper-roman',
		'1' : 'decimal',
		'disc' : 'disc',
		'circle': 'circle',
		'square' : 'square'
	};

	function listStyle( editor, startupPage )
	{
		var lang = editor.lang.list;
		if ( startupPage == 'bulletedListStyle' )
		{
			return {
				title : lang.bulletedTitle,
				minWidth : 300,
				minHeight : 50,
				contents :
				[
					{
						id : 'info',
						accessKey : 'I',
						elements :
						[
							{
								type : 'select',
								label : lang.type,
								id : 'type',
								align : 'center',
								style : 'width:150px',
								items :
								[
									[ lang.notset, '' ],
									[ lang.circle, 'circle' ],
									[ lang.disc,  'disc' ],
									[ lang.square, 'square' ]
								],
								setup : function( element )
								{
									var value = element.getStyle( 'list-style-type' )
												|| mapListStyle[ element.getAttribute( 'type' ) ]
												|| element.getAttribute( 'type' )
												|| '';

									this.setValue( value );
								},
								commit : function( element )
								{
									var value = this.getValue();
									if ( value )
										element.setStyle( 'list-style-type', value );
									else
										element.removeStyle( 'list-style-type' );
								}
							}
						]
					}
				],
				onShow: function()
				{
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ul' );

					element && this.setupContent( element );
				},
				onOk: function()
				{
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ul' );

					element && this.commitContent( element );
				}
			};
		}
		else if ( startupPage == 'numberedListStyle'  )
		{

			var listStyleOptions =
			[
				[ lang.notset, '' ],
				[ lang.lowerRoman, 'lower-roman' ],
				[ lang.upperRoman, 'upper-roman' ],
				[ lang.lowerAlpha, 'lower-alpha' ],
				[ lang.upperAlpha, 'upper-alpha' ],
				[ lang.decimal, 'decimal' ]
			];

			if ( !OMEDITOR.env.ie || OMEDITOR.env.version > 7 )
			{
				listStyleOptions.concat( [
					[ lang.armenian, 'armenian' ],
					[ lang.decimalLeadingZero, 'decimal-leading-zero' ],
					[ lang.georgian, 'georgian' ],
					[ lang.lowerGreek, 'lower-greek' ]
				]);
			}

			return {
				title : lang.numberedTitle,
				minWidth : 300,
				minHeight : 50,
				contents :
				[
					{
						id : 'info',
						accessKey : 'I',
						elements :
						[
							{
								type : 'hbox',
								widths : [ '25%', '75%' ],
								children :
								[
									{
										label : lang.start,
										type : 'text',
										id : 'start',
										validate : OMEDITOR.dialog.validate.integer( lang.validateStartNumber ),
										setup : function( element )
										{
											// List item start number dominates.
											var value = element.getFirst( listItem ).getAttribute( 'value' ) || element.getAttribute( 'start' ) || 1;
											value && this.setValue( value );
										},
										commit : function( element )
										{
											var firstItem = element.getFirst( listItem );
											var oldStart = firstItem.getAttribute( 'value' ) || element.getAttribute( 'start' ) || 1;

											// Force start number on list root.
											element.getFirst( listItem ).removeAttribute( 'value' );
											var val = parseInt( this.getValue(), 10 );
											if ( isNaN( val ) )
												element.removeAttribute( 'start' );
											else
												element.setAttribute( 'start', val );

											// Update consequent list item numbering.
											var nextItem = firstItem, conseq = oldStart, startNumber = isNaN( val ) ? 1 : val;
											while ( ( nextItem = nextItem.getNext( listItem ) ) && conseq++ )
											{
												if ( nextItem.getAttribute( 'value' ) == conseq )
													nextItem.setAttribute( 'value', startNumber + conseq - oldStart );
											}
										}
									},
									{
										type : 'select',
										label : lang.type,
										id : 'type',
										style : 'width: 100%;',
										items : listStyleOptions,
										setup : function( element )
										{
											var value = element.getStyle( 'list-style-type' )
												|| mapListStyle[ element.getAttribute( 'type' ) ]
												|| element.getAttribute( 'type' )
												|| '';

											this.setValue( value );
										},
										commit : function( element )
										{
											var value = this.getValue();
											if ( value )
												element.setStyle( 'list-style-type', value );
											else
												element.removeStyle( 'list-style-type' );
										}
									}
								]
							}
						]
					}
				],
				onShow: function()
				{
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ol' );

					element && this.setupContent( element );
				},
				onOk: function()
				{
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ol' );

					element && this.commitContent( element );
				}
			};
		}
	}

	OMEDITOR.dialog.add( 'numberedListStyle', function( editor )
		{
			return listStyle( editor, 'numberedListStyle' );
		});

	OMEDITOR.dialog.add( 'bulletedListStyle', function( editor )
		{
			return listStyle( editor, 'bulletedListStyle' );
		});
})();
