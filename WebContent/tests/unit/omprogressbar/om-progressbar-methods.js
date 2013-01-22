(function($){
    module( "omProgressbar: methods");
    test( "{ onChange }", function() {
        expect(1);
        $('#onChange').omProgressbar({
        	width:300,
        	onChange: function(newvalue, olovalue){
        		if(newvalue == 50)
        		$("#result").html("任务完成一半");
        	}
        });
        $('#btn1').click(function(){
        	$("#onChange").omProgressbar('value', 50);
        });
        $('#btn1').click();
        equal($("#result").html(), "任务完成一半");
    });
    
    test( "{ value }", function() {
        expect(2);
        $('#value').omProgressbar({
        	width:300,
        	value:10
        });
        var oldvalue = 0, newvalue = 0;
        $('#btn1').click(function(){
        	oldvalue = $("#value").omProgressbar('value');
        	$("#value").omProgressbar('value', 50);
        	newvalue = $("#value").omProgressbar('value');
        });
        $('#btn1').click();
        equal(oldvalue, "10");
        equal(newvalue, "50");
    });
   
}(jQuery));