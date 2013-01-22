/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

OMEDITOR.dialog.add( 'anchor', function( editor )
{
	// Function called in onShow to load selected element.
	var loadElements = function( element )
	{
		this._.selectedElement = element;

		var attributeValue = element.data( 'cke-saved-name' );
		this.setValueOf( 'info','txtName', attributeValue || '' );
	};

	function createFakeAnchor( editor, anchor )
	{
		return editor.createFakeElement( anchor, 'cke_anchor', 'anchor' );
	}

	return {
		title : editor.lang.anchor.title,
		minWidth : 300,
		minHeight : 60,
		onOk : function()
		{
			var name = this.getValueOf( 'info', 'txtName' );
			var attributes =
			{
				name : name,
				'data-cke-saved-name' : name
			};

			if ( this._.selectedElement )
			{
				if ( this._.selectedElement.data( 'cke-realelement' ) )
				{
					var newFake = createFakeAnchor( editor, editor.document.createElement( 'a', { attributes: attributes } ) );
					newFake.replace( this._.selectedElement );
				}
				else
					this._.selectedElement.setAttributes( attributes );
			}
			else
			{
				var sel = editor.getSelection(),
						range = sel && sel.getRanges()[ 0 ];

				// Empty anchor
				if ( range.collapsed )
				{
					if ( OMEDITOR.plugins.link.synAnchorSelector )
						attributes[ 'class' ] = 'cke_anchor_empty';

					if ( OMEDITOR.plugins.link.emptyAnchorFix )
					{
						attributes[ 'contenteditable' ] = 'false';
						attributes[ 'data-cke-editable' ] = 1;
					}

					var anchor = editor.document.createElement( 'a', { attributes: attributes } );

					// Transform the anchor into a fake element for browsers that need it.
					if ( OMEDITOR.plugins.link.fakeAnchor )
						anchor = createFakeAnchor( editor, anchor );

					range.insertNode( anchor );
				}
				else
				{
					if ( OMEDITOR.env.ie && OMEDITOR.env.version < 9 )
						attributes['class'] = 'cke_anchor';

					// Apply style.
					var style = new OMEDITOR.style( { element : 'a', attributes : attributes } );
					style.type = OMEDITOR.STYLE_INLINE;
					style.apply( editor.document );
				}
			}
		},

		onHide : function()
		{
			delete this._.selectedElement;
		},

		onShow : function()
		{
			var selection = editor.getSelection(),
				fullySelected = selection.getSelectedElement(),
				partialSelected;

			// Detect the anchor under selection.
			if ( fullySelected )
			{
				if ( OMEDITOR.plugins.link.fakeAnchor )
				{
					var realElement = OMEDITOR.plugins.link.tryRestoreFakeAnchor( editor, fullySelected );
					realElement && loadElements.call( this, realElement );
					this._.selectedElement = fullySelected;
				}
				else if ( fullySelected.is( 'a' ) && fullySelected.hasAttribute( 'name' ) )
					loadElements.call( this, fullySelected );
			}
			else
			{
				partialSelected = OMEDITOR.plugins.link.getSelectedLink( editor );
				if ( partialSelected )
				{
					loadElements.call( this, partialSelected );
					selection.selectElement( partialSelected );
				}
			}

			this.getContentElement( 'info', 'txtName' ).focus();
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.anchor.title,
				accessKey : 'I',
				elements :
				[
					{
						type : 'text',
						id : 'txtName',
						label : editor.lang.anchor.name,
						required: true,
						validate : function()
						{
							if ( !this.getValue() )
							{
								alert( editor.lang.anchor.errorName );
								return false;
							}
							return true;
						}
					}
				]
			}
		]
	};
} );
