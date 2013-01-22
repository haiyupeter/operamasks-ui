(function($){
	module( "omDroppable: event");
    //width
    test( "{onDragStart}", function() {
    	var isStart = false;
    	$( "#draggable1" ).omDraggable().css({left: "25px", top: "25px"});
		$( "#droppable1" ).omDroppable({
			onDragStart: function(e, source){
				isStart = true; 
			}
		});
		$("#draggable1").simulate("drag", {dx: 10, dy: 10});
		ok(isStart, "onDragStart execute");
		$("#droppable1").omDroppable("destroy");
		
    });
    
    test( "{onDragOver}", function() {
    	var isOver = false;
    	$( "#draggable1" ).omDraggable().css({left: "25px", top: "25px"});
    	$( "#droppable1" ).omDroppable({
			onDragOver: function( event, ui ) {
               isOver = true;
			}
		});
		$("#draggable1").simulate("drag", {dx: 0, dy: 120});
		ok(isOver, "onDragOver execute");
		$("#droppable1").omDroppable("destroy");
    });
    
    test( "{onDragOut}", function() {
    	var isOut = false;
    	$( "#draggable1" ).omDraggable().css({left: "25px", top: "145px"});
    	$( "#droppable1" ).omDroppable({
			onDragOut: function( event, ui ) {
               isOut = true;
			}
		});
		$("#draggable1").simulate("drag", {dx: 0, dy: 200});
		ok(isOut, "onDragOut execute");
		$("#droppable1").omDroppable("destroy");
    });
    
    test( "{onDrop}", function() {
    	var isDrop = false;
    	$( "#draggable1" ).omDraggable().css({left: "25px", top: "25px"});
    	$( "#droppable1" ).omDroppable({
			onDrop: function( event, ui ) {
				isDrop = true;
			}
		});
		$("#draggable1").simulate("drag", {dx: 0, dy: 120});
		ok(isDrop, "onDrop execute");
		$("#droppable1").omDroppable("destroy");
    });
   
}(jQuery));