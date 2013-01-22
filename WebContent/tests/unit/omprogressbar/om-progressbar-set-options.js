(function($){
    module( "omProgressbar: setOptions");
    test( "{ value }", function() {
        expect(4);
        $('#options').omProgressbar({value:30});
        var text = $('#options .om-progressbar-text').html();
        equal(text, "30%" , "{value:30}");
        var width = $('#options .om-progressbar-value').width();
        equal(width, "30" , "{value:30}:width(30)");
        
        $('#options').omProgressbar({value:50});
        text = $('#options .om-progressbar-text').html();
        equal(text, "50%" , "{value:50}");
        width = $('#options .om-progressbar-value').width();
        equal(width, "50" , "{value:50}:width(50)");
    });
    
    test( "{ text: '已完成{value}%' }", function() {
        expect(4);
        $('#options').omProgressbar({text:'已完成{value}%', value:30});
        var text = $('#options .om-progressbar-text').html();
        equal(text,"已完成30%","{text:'已完成{value}%', value:30}");
        
        $('#options').omProgressbar({text:'执行了{value}%'});
        text = $('#options .om-progressbar-text').html();
        equal(text,"执行了30%","{text:'执行了{value}%'}");
        
        $('#options').omProgressbar({text:function(value){
        	if(value < 30){
    			return "初始化";
    		}else if(value >= 100){
    			return "任务完成";
    		}
        }, value:20});
        var text = $('#options .om-progressbar-text').html();
        equal(text,"初始化");
        $("#options").omProgressbar('value', 100);
        text = $('#options .om-progressbar-text').html();
        equal(text,"任务完成");
    });
    
    test( "{ width }", function() {
        expect(2);
        $('#options').omProgressbar({width:300});
        var width = $('#options').width();
        equal(width,"300","{width:300}");
        
        $('#options').omProgressbar({width:400});
        width = $('#options').width();
        equal(width,"400","{width:400}");
    });
}(jQuery));