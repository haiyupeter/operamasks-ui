 var navdata = [{
            "text": "搜索",
            "expanded": true,
            "children":[{
                "text": "百度",
                "nav":"www.baidu.com"
            }, {
                "text": "搜狗",
                "nav": "www.sogou.com"
            }]
        }, {
            "text": "本地页面",
            "expanded": true,
            "children": [{
                    "page":"nav1.html",
                    "text": "nav1"
                },{
                    "text":"nav2",
                    "page":"inprogress.html"
            }]
        }];
 var citydata = [{
     "text": "国内",
     "expanded": true,
     "children":[{
         "text": "河南省"
     }, {
         "text": "广东省"
     }, {
         "text": "陕西省"
     }, {
         "text": "福建省"
     },{
         "text": "广西"
     }, {
         "text": "北京"
     }]
 }, {
     "text": "国外",
     "expanded": true,
     "children":[{
         "text":"澳大利亚"
     },{
         "text":"印度"
     },{
         "text":"日本"
     }]
 }];
 var cities =[
            {text:"直辖市(不响应右键菜单)", expanded:true, children:[
			    {text:"北京"},
				{text:"天津"},
				{text:"上海"}
            ]},
  			{text:"河北省", expanded:true, children:[
  				{text:"石家庄"},
  	  			{text:"保定"},
  	  			{text:"承德"}
  			]},
  			{text:"广东省(不可删除)", expanded:true, children:[
			    {text:"广州"},
				{text:"深圳"},
				{text:"东莞"}
  			]},
  			{text:"福建省", expanded:true, children:[
			    {text:"福州"},
				{text:"厦门"},
				{text:"泉州"}
  			]},
  		 ];