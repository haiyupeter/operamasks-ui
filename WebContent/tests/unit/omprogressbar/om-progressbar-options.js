(function($){
    module( "omProgressbar: options");
    test( "{ value: 30 }", function() {
        expect(2);
        $('#val').omProgressbar({value:30});
        var text = $('#val .om-progressbar-text').html();
        equal(text, "30%");
        var width = $('#val .om-progressbar-value').width();
        equal(width, "30");
    });
    test( "{ text: '已完成{value}%' }", function() {
        expect(1);
        $('#text1').omProgressbar({text:'已完成{value}%', value:30});
        var text = $('#text1 .om-progressbar-text').html();
        equal(text,"已完成30%");
    });
    test( "{ text: function() }", function() {
        expect(2);
        $('#text2').omProgressbar({
        	text:function(value){
        		if(value < 30){
        			return "初始化";
        		}else if(value >= 100){
        			return "任务完成";
        		}
        	}, 
        	value:20});
        $('#btn1').click(function(){
        	$("#text2").omProgressbar('value', 100);
        });
        var text = $('#text2 .om-progressbar-text').html();
        equal(text,"初始化");
        $('#btn1').click();
        text = $('#text2 .om-progressbar-text').html();
        equal(text,"任务完成");
        
    });
    test( "{ width: 300 }", function() {
        expect(1);
        $('#width').omProgressbar({width:300});
        var width = $('#width').width();
        equal(width,"300");
    });
}(jQuery));