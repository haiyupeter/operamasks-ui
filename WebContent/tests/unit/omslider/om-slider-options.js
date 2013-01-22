(function($){
    module( "omSlider: options");
     test( "{ activeNavCls: my-nav-selected }", function() {
        expect(1);
        $('#activeNavCls').omSlider({activeNavCls: 'my-nav-selected',autoPlay:false});
        var i = 0;
        $("#activeNavCls").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("my-nav-selected"))i++;
         });
        equal(i >= 1 ,true,"找到了设置的导航条样式");
    });
   
    /**
    //设置autoPlay为false，则不会自动切换图片，可以设置动画切换时间为500mm，然后过一秒钟之后检测当前图片样式是否变换
    test( "{ autoPlay: false }", function() {
        expect(1);
        $('#autoPlay').omSlider({autoPlay: false,animSpeed:500,startSlide: 3});
        stop();
        var indexRecord=0;
        var interval = setInterval(function(){
            if(indexRecord > 0){
                $("#autoPlay").children().eq(1).children().each(function(index,item){
                    if($(item).hasClass("nav-selected")){
                        equal(indexRecord ==index,true,"autoPlay为false，自动切换停止");
                        clearInterval(interval)
                        start();
                    }
                });
            }else{
                $("#autoPlay").children().eq(1).children().each(function(index,item){
                    if($(item).hasClass("nav-selected"))indexRecord = index;
                });
            }
        },1000);
    });
   */
  
    //设置controlNav为false，则不会出现导航条，可以检测是否存在导航条dom节点
    test( "{ controlNav: false }", function() {
        $('#controlNav').omSlider({controlNav: false,autoPlay:false});
        var it = $("#controlNav").children().eq(1).children().length;
        equal(it,0,"controlNav设置为false之后不会出现导航条");
    });
    
   
    //设置directionNav为true，鼠标移动到slider上面会出现左右的导航图标
    test( "{ directionNav: true }", function() {
        $('#directionNav').omSlider({directionNav: true,autoPlay:false});
        var it = $("#directionNav div.om-slider-directionNav").length;
        equal(it,1,"directionNav设置为true，鼠标移动到slider上面会出现左右切换功能条");
    });
    
    /*
    //设置interval为1000，自动切换的事件为1秒，则在600mm的时候检测图片是否切换，再检测1200mm的时候是否切换，不太严谨，同时保留原来的测试案例
    test( "{ interval: 1000 }", function() {
        expect(2);
        $('#interval').omSlider({interval: 1000,autoPlay:false});
        stop();
        var indexRecord=1;
        setTimeout(function(){
            $("#interval").children().eq(1).children().each(function(index,item){
                if($(item).hasClass("nav-selected")){
                    indexRecord= index;
                    equal(indexRecord == 0,true,"此时不应该切换到第二张图片");
                }
            });
            setTimeout(function(){
                $("#interval").children().eq(1).children().each(function(index,item){
                    if($(item).hasClass("nav-selected")){
                        equal(index > indexRecord,true,"此时应该切换到第二张图片");
                        start();
                    }
                });
            },900);
        },900);
    });
   */
    test( "{ startSlide: 3 }", function() { //将animSpeed设置为10秒是为了不影响此属性的检测
        $('#startSlide').omSlider({startSlide: 3 , animSpeed : 10000,autoPlay:false});
        $("#startSlide").children().eq(1).children().each(function(index,item){
            if($(item).hasClass("nav-selected")){
                equal(index,3,"startSlide为3则样式为nav-selected的导航页为第三个");
            }
        });
    });
    
}(jQuery));