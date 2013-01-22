(function($){
	module( "omDroppable: options");
    //width
    test( "{accept: #draggable2}", function() {
    	$( "#draggable1, #draggable2" ).omDraggable();
		$( "#droppable1" ).omDroppable({
			accept: "#draggable2",
			onDrop: function( event, source ) {
				$(this).find( "> p" ).html( "已接受！" );
			}
		});
		$("#draggable1").simulate("drag", {dx: 75, dy: 75});
		notEqual($( "#droppable1" ).find( "> p" ).html(), "已接受！", "不接受draggable1");
		$("#draggable2").simulate("drag", {dx: 75, dy: 75});
		equal($( "#droppable1" ).find( "> p" ).html(), "已接受！", "接受draggable2");
		$("#droppable1").omDroppable("destroy").find( "> p" ).html("");
		$("#draggable2").css({left: "25px", top: "25px"});
    });
    
    test( "{activeClass}", function() {
    	var isActive = false;
    	$( "#draggable1" ).css({left: "25px", top: "25px"});
		$( "#droppable1" ).omDroppable({
			activeClass: "om-state-hover",
			onDragStart: function(e, source){
				isActive = $(this).hasClass("om-state-hover"); 
			}
		});
		$("#draggable1").simulate("drag", {dx: 10, dy: 10});
		ok(isActive, "activeClass");
		$("#droppable1").omDroppable("destroy");
    });
    
    test( "{hoverClass}", function() {
    	var isHover = false;
    	$( "#draggable1" ).omDraggable().css({left: "25px", top: "25px"});
		$( "#droppable1" ).omDroppable({
			hoverClass: "om-state-active",
			onDragOver: function(e, source){
				isHover = $(this).hasClass("om-state-active"); 
			}
		});
		$("#draggable1").simulate("drag", {dx: 75, dy: 120});
		ok(isHover, "hoverClass");
    });
    
    test( "{disabled : true}", function() {
    	var isHover = false;
    	$( "#draggable1" ).omDraggable().css({left: "25px", top: "25px"});
		$( "#droppable1" ).omDroppable({
			disabled: true,
			hoverClass: "om-state-active",
			onDragOver: function(e, source){
				isHover = $(this).hasClass("om-state-active"); 
			}
		});
		$("#draggable1").simulate("drag", {dx: 75, dy: 75});
		ok(!isHover, "disabled");
		$("#droppable1").omDroppable("enable").omDroppable("destroy");
    });
    
    test( "{greedy : true}", function() {
    	$( "#draggable1" ).omDraggable().css({left: "25px", top: "25px"});
    	$( "#droppable1, #droppable1-inner" ).omDroppable({
    		greedy: true,
			onDrop: function( event, ui ) {
				$(this).find( "> p" ).html( "已放置！" );
			}
		});
		$("#draggable1").simulate("drag", {dx: 0, dy: 120});
		notEqual($( "#droppable1" ).find( "> p" ).html(), "已放置！", "greedy");
		equal($( "#droppable1-inner" ).find( "> p" ).html(), "已放置！", "greedy");
		$("#droppable1").omDroppable("destroy").find( "> p" ).html("");
		$("#droppable1-inner").omDroppable("destroy").find( "> p" ).html("");
    });
   
}(jQuery));