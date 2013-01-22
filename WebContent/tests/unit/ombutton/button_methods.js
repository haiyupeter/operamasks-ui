(function( $ ) {
    module( "omButton: methods");
    //changeIcons()
    test( "changeIcons()", function() {
        var compareLeftIcon=function(expect,element){
        	var value=element.css('background-image');
        	if(value.indexOf('url("')==0){
        		var end = expect+'")'; 
         	}else{         		
         		var end = expect +')';         		
         	}        	            
        	return value.indexOf(end)+end.length==value.length;            
        };
        var compareRightIcon=function(expect,element){
            return element.siblings().eq(0).attr('src')===expect;
        };
        var icons1={left : 'resources/edit_add.png', right: 'resources/down.png'};
        var icons2={right : 'resources/edit_add.png', left: 'resources/down.png'};
        var element;
        element = $('.changeIcons a').omButton({icons:icons1});
        element.omButton('changeIcons',icons2);
        ok(compareLeftIcon(icons2.left,element) && compareRightIcon(icons2.right,element),'changeIcons()方法执行后应该能改变元素为a的按钮的左右图标');
        element = $('.changeIcons input').omButton({icons:icons1});
        element.omButton('changeIcons',icons2);
        ok(compareLeftIcon(icons2.left,element) && compareRightIcon(icons2.right,element),'changeIcons()方法执行后应该能改变元素为input的按钮的左右图标');
        element = $('.changeIcons button').omButton({icons:icons1});
        element.omButton('changeIcons',icons2);
        ok(compareLeftIcon(icons2.left,element) && compareRightIcon(icons2.right,element),'changeIcons()方法执行后应该能改变元素为button的按钮的左右图标');
    });
    //changeLabel
    test( "changeLabel()", function() {
        var element;
        element = $('.changeLabel a').omButton({});
        element.omButton('changeLabel','XYZ');
        equal(element.html(),'XYZ','changeLabel()方法执行后元素为a的按钮的label应该会发生改变');
        element = $('.changeLabel input').omButton({});
        element.omButton('changeLabel','XYZ');
        equal(element.val(),'XYZ','changeLabel()方法执行后元素为input的按钮的label应该会发生改变');
        element = $('.changeLabel button').omButton({});
        element.omButton('changeLabel','XYZ');
        equal(element.html(),'XYZ','changeLabel()方法执行后元素为button的按钮的label应该会发生改变');
    });
    //click
    test( "click()", function() {
        var element;
       /* element = $('.click a:eq(0)').omButton({});
        element.omButton('click');
        strictEqual(element[0].hasClicked,true,'click()方法应该能触发元素为a的按钮的html中原生的onclick属性中的js代码');*/
        element = $('.click a:eq(1)').omButton({disabled:true});
        element.omButton('click');
        strictEqual(element[0].hasClicked,undefined,'click()方法不应该能触发disabled=true的元素为a的按钮的html中原生的onclick属性中的js代码');
        var hasCliecked=false;
        element = $('.click a:eq(2)').omButton({
            onClick:function(){
                hasCliecked=true;
                return false;
            }
        });
        element.omButton('click');
        strictEqual(hasCliecked,true,'click()方法调用后应该可以元素为a的按钮触发onClick事件');
        
       /* element = $('.click input:eq(0)').omButton({});
        element.omButton('click');
        strictEqual(element[0].hasClicked,true,'click()方法应该能触发元素为input的按钮的html中原生的onclick属性中的js代码');*/
        element = $('.click input:eq(1)').omButton({disabled:true});
        element.omButton('click');
        strictEqual(element[0].hasClicked,undefined,'click()方法不应该能触发disabled=true的元素为input的按钮的html中原生的onclick属性中的js代码');
        var hasCliecked=false;
        element = $('.click input:eq(2)').omButton({
            onClick:function(){
                hasCliecked=true;
                return false;
            }
        });
        element.omButton('click');
        strictEqual(hasCliecked,true,'click()方法调用后应该可以触发元素为input的按钮onClick事件');
        
       /* element = $('.click button:eq(0)').omButton({});
        element.omButton('click');
        strictEqual(element[0].hasClicked,true,'click()方法应该能触发元素为button的按钮的html中原生的onclick属性中的js代码');*/
        element = $('.click button:eq(1)').omButton({disabled:true});
        element.omButton('click');
        strictEqual(element[0].hasClicked,undefined,'click()方法不应该能触发disabled=true的元素为button的按钮的html中原生的onclick属性中的js代码');
        var hasCliecked=false;
        element = $('.click button:eq(2)').omButton({
            onClick:function(){
                hasCliecked=true;
                return false;
            }
        });
        element.omButton('click');
        strictEqual(hasCliecked,true,'click()方法调用后应该可以触发元素为button的按钮onClick事件');
    });
    
    //disable/enable
    test( "disable()和enable()", function() {
        var clickSuccess=[0,0,0,0];
        var time=0;
        var element = $('.disableEnable a').omButton({
            onClick:function(){
                clickSuccess[time]=1;
                return false;
            }
        });
        //开始时没有禁用，点击应该可以成功
        element.omButton('click');
        time++;
        //禁用后点击不应该成功
        element.omButton('disable');
        element.omButton('click');
        time++;
        //启用后应该又可以了
        element.omButton('enable');
        element.omButton('click');
        time++;
        //再禁用应该又不行
        element.omButton('disable');
        element.omButton('click');
        time++;
        equal(clickSuccess.join(''),'1010','元素为a的按钮应该禁用不可点击，禁用后再启用就可点击');
        
        clickSuccess=[0,0,0,0];
        time=0;
        element = $('.disableEnable input').omButton({
            onClick:function(){
                clickSuccess[time]=1;
                return false;
            }
        });
        //开始时没有禁用，点击应该可以成功
        element.omButton('click');
        time++;
        //禁用后点击不应该成功
        element.omButton('disable');
        element.omButton('click');
        time++;
        //启用后应该又可以了
        element.omButton('enable');
        element.omButton('click');
        time++;
        //再禁用应该又不行
        element.omButton('disable');
        element.omButton('click');
        time++;
        equal(clickSuccess.join(''),'1010','元素为input的按钮应该禁用不可点击，禁用后再启用就可点击');
        
        clickSuccess=[0,0,0,0];
        time=0;
        element = $('.disableEnable button').omButton({
            onClick:function(){
                clickSuccess[time]=1;
                return false;
            }
        });
        //开始时没有禁用，点击应该可以成功
        element.omButton('click');
        time++;
        //禁用后点击不应该成功
        element.omButton('disable');
        element.omButton('click');
        time++;
        //启用后应该又可以了
        element.omButton('enable');
        element.omButton('click');
        time++;
        //再禁用应该又不行
        element.omButton('disable');
        element.omButton('click');
        time++;
        equal(clickSuccess.join(''),'1010','元素为button的按钮应该禁用不可点击，禁用后再启用就可点击');
    });
}(jQuery));