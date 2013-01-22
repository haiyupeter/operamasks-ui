(function($){
    module( "omSlider: methods");
    test( "{ next方法测试 }", function() { //将animSpeed设置为10秒是为了不影响此方法的检测
        $('#next').omSlider({animSpeed : 10000,autoPlay:false});
        $("#next").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("nav-selected"))equal(0,index,"当前为第一个图片");
        });
        $("#next").omSlider("next");
        $("#next").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("nav-selected"))equal(index,1,"当前为第 二个图片");
        });
    });
  
    test( "{ prev方法测试 }", function() { //将animSpeed设置为10秒是为了不影响此方法的检测
        $('#prev').omSlider({animSpeed : 10000,startSlide : 3,autoPlay:false});
        $("#prev").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("nav-selected"))equal(index,3,"当前为第三个图片");
        });
        $("#prev").omSlider("prev");
        $("#prev").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("nav-selected"))equal(index,2,"当前为第 二个图片");
        });
    });
    
    
    test( "{ slideTo方法测试 }", function() { //将animSpeed设置为10秒是为了不影响此方法的检测
        $('#slideTo').omSlider({animSpeed : 10000,startSlide : 3,autoPlay:false});
        $("#slideTo").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("nav-selected"))equal(index,3,"当前为第三个图片");
        });
        $("#slideTo").omSlider("slideTo",1);
        $("#slideTo").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("nav-selected"))equal(index,1,"当前为第 一个图片");
        });
    });
    
    
    test( "{ onAfterSlide方法测试 }", function() {
        expect(1);
        $('#onAfterSlide').omSlider({
            autoPlay : false,
            onAfterSlide : fn
        });
        stop();
        $("#onAfterSlide").omSlider("next");
        function fn(index){
           equal(index > 0,true,"执行了onAfterSlide方法");
           start();
        }
       
    });
 
    
    test( "{ onBeforeSlide方法测试 }", function() {
        expect();
        $('#onBeforeSlide').omSlider({
            autoPlay : false,
            onAfterSlide : fn
        });
        stop();
        $("#onBeforeSlide").omSlider("next");
        function fn(index){
           if(index == 1){
               return false;
           }
        }
        setTimeout(function(){ //为了等回调完成
            $("#onBeforeSlide").children().eq(1).children().each(function(index,item){
                if($(item).hasClass("nav-selected")){
                    equal(index,1,"执行切换前执行阻止动作，当前仍为第一个图片");
                    start();
                }
            });
        },1000);
        
    });
}(jQuery));