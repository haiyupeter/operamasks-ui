(function($){
    module( "omTooltip: options");
    test( "{ width: auto }", function() {
    	expect(2);
    	$('#width_auto').omTooltip({
            html : '<span style="color:red;">欢迎使用omTooltip组件！</span>'
        });
        $("#width_auto").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width_index = target.attr('style').indexOf('width: auto');
       equal(width_index > -1,true,"width默认值为auto");
       $("#width_auto").omTooltip('hide');
       
       $('#width_150').omTooltip({
           width : 150,
           html : '<span style="color:red;">欢迎使用omTooltip组件！</span>'
       });
       $("#width_150").omTooltip('show');
       target = $('.tip').filter(function(){
           return $(this).css('display') == 'block';
       });
       var width_150 = target.outerWidth();
       equal(width_150 == 150,true,"width设置值为150");
       $("#width_150").omTooltip('hide');
    });
    
    test( "{ minWidth: 50 }", function() {
        expect(2);
        $('#minWidth').omTooltip({
            minWidth : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#minWidth").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width_50 = target.outerWidth();
        equal(width_50 == 50,true,"minWidth设置值为50");
        $("#minWidth").omTooltip('hide');
        
        $('#minWidth_1').omTooltip({
            minWidth : 50,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        $("#minWidth_1").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width_50 = target.outerWidth();
        equal(width_50 > 50,true,"minWidth设置值为50,则宽度多余50的时候会自动撑宽");
        $("#minWidth_1").omTooltip('hide');
    });
    
    test( "{ maxWidth: 50 }", function() {
        expect(2);
        $('#maxWidth').omTooltip({
            maxWidth : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#maxWidth").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width_50 = target.outerWidth();
        equal(width_50 < 50,true,"maxWidth设置值为50,则文字很少的情况下宽度应该少于50");
        $("#maxWidth").omTooltip('hide');
        
        $('#maxWidth_1').omTooltip({
            maxWidth : 150,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎maxWidth设置值为150,欢迎欢迎maxWidth设置值为150,欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        $("#maxWidth_1").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var width_150 = target.outerWidth(); 
        if($.browser.msie  && $.browser.version == '7.0'){
            equal(width_150 < 150 && width_150 > 140,true,"maxWidth设置值为150,则宽度多余150的时候width也等于150");
        }else{
            equal(width_150 == 150 ,true,"maxWidth设置值为150,则宽度多余150的时候width也等于150");
        }
        $("#maxWidth_1").omTooltip('hide');
    });
    
    test( "{ height: 默认和设置值测试 }", function() {
        expect(2);
        $('#height_auto').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#height_auto").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var height_index = target.attr('style').indexOf('height: auto');
        equal(height_index > -1,true,"height默认值为auto");
        $("#height_auto").omTooltip('hide');
        
        $('#height_1').omTooltip({
            height : 50,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        $("#height_1").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var height_50 = target.outerHeight();
        equal(height_50 == 50,true,"height设置值为50");
        $("#height_1").omTooltip('hide');
    });
    
    test( "{ maxHeight: 50 }", function() {
        expect(2);
        $('#maxHeight').omTooltip({
            maxHeight : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#maxHeight").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var maxHeight = target.outerHeight();
        equal(maxHeight < 50,true,"设置maxHeight为50，当内容比较少的时候，height高度少于50");
        $("#maxHeight").omTooltip('hide');
        
        $('#maxHeight_1').omTooltip({
            maxHeight : 50,
            maxWidth : 30,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        $("#maxHeight_1").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var maxHeight_1 = target.outerHeight();
        equal(maxHeight_1 == 50,true,"height设置值为50");
        $("#maxHeight_1").omTooltip('hide');
    });
    
    test( "{ minHeight: 50 }", function() {
        expect(2);
        $('#minHeight').omTooltip({
            minHeight : 50,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#minHeight").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var minHeight = target.outerHeight();
        equal(minHeight == 50,true,"高度至少是50");
        $("#minHeight").omTooltip('hide');
        
        $('#minHeight_1').omTooltip({
            minHeight : 50,
            maxWidth : 30,
            html : '<span style="color:red;">欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎欢迎</span>'
        });
        $("#minHeight_1").omTooltip('show');
        target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var minHeight_1 = target.outerHeight();
        equal(minHeight_1 > 50,true,"height的高度大于等于50");
        $("#minHeight_1").omTooltip('hide');
    });
    
    
    test( "{ delay: 1000 }", function() {
        expect(2);
        $('#delay').omTooltip({
            delay : 1000,
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#delay").mouseover();
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        equal(target.length == 0,true,"没有出现提示框");
        stop();
        setTimeout(function(){
            target = $('.tip').filter(function(){
                return $(this).css('display') == 'block';
            });
            equal(target.length > 0,true,"延迟1000ms之后出现提示框");
            $("#delay").mouseout();
            start();
        },1000);
    });
    
    test( "{ anchor: anchor不设置和设置为true }", function() {
        expect(2);
        $('#anchor').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#anchor").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var anchor = target.find('.tip-anchor');
        equal(anchor.length == 0,true,"没有出现anchor");
        $("#anchor").omTooltip('hide');
        
        $('#anchor_true').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#anchor_true").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var anchor = target.find('.tip-anchor');
        equal(anchor.length == 0,true,"出现anchor");
        $("#anchor_true").omTooltip('hide');
    });
    
    test( "{ showOn: 设置为mouseover和click }", function() {
        expect(2);
        $('#showOn').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#showOn").mouseover();
        stop();
        setTimeout(function(){
            var target = $('.tip').filter(function(){
                return $(this).css('display') == 'block';
            });
            equal(target.length > 0,true,"鼠标移动到区域显示提示");
            $("#showOn").mouseout();
            start();
        },1000);
        
        $('#showOn_1').omTooltip({
            showOn : 'click',
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#showOn_1").click();
        stop();
        setTimeout(function(){
            var target = $('.tip').filter(function(){
                return $(this).css('display') == 'block';
            });
            equal(target.length > 0,true,"鼠标点击区域出现提示");
            $("#showOn_1").mouseout();
            start();
        },1000);
    });
    test( "{ url: 通过url配置异步加载资源  }", function() {
        expect(1);
        $('#url').omTooltip({
            url : 'content.html'
        });
        $("#url").omTooltip('show');
        stop();
        setTimeout(function(){
            var target = $('.tip').filter(function(){
                return $(this).css('display') == 'block';
            });
            var content = target.find('.tip-body').html();
            equal(content.length > 0 , true,'通过异步加载html文件的内容作为提示内容');
            $("#url").omTooltip('hide');
            start();
        },1000);
    });
    test( "{ html: 通过html配置提示框内容  }", function() {
        expect(1);
        $('#html').omTooltip({
            html : '<span style="color:red;">欢迎</span>'
        });
        $("#html").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var content = target.find('.tip-body').html();
        equal(content.length > 0 , true,'通过html属性配置提示框内容');
        $("#html").omTooltip('hide');
    });
    test( "{ contentEL: 通过contentEL配置提示框内容  }", function() {
        expect(1);
        $('#contentEL').omTooltip({
            contentEL : '#aaa'
        });
        $("#contentEL").omTooltip('show');
        var target = $('.tip').filter(function(){
            return $(this).css('display') == 'block';
        });
        var content = target.find('.tip-body').html();
        equal(content.length > 0 , true,'通过contentEL属性配置提示框内容');
        $("#contentEL").omTooltip('hide');
    });
    
}(jQuery));