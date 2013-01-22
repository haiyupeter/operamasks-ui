### 概述 ###
OperaMasks-UI是基于Jquery并提供丰富组件的前端UI库,致力降低企业应用的开发成本
### 简单易用 ###
统一的API体系，丰富的业务场景支持，简单的使用模式。
### 面向企业 ###
丰富的业务组件可满足大部分业务场景需求。
### 如何安装 ###
进入build目录，执行

    ant
构建后会生成WebContent/release目录， operamasks-ui文件夹就是最终的产品包。

你只需要将js文件夹和css文件夹拷贝到你自己的项目中，然后引入两个min文件即可。

    <script type="text/javascript" src="js/operamasks-ui.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/default/om-default.css">
请务必先引入jquery，最低版本为1.6

以上你就使用了默认的皮肤，产品包中还有另外一套皮肤 apusic. 若想用该皮肤，请将上面的css文件引用换成如下

    <link rel="stylesheet" type="text/css" href="css/apusic/om-apusic.css">
### 运行示例 ###
构建完成后，在build目录会生成operamasks-ui.war，将其部署在任何一直支持servlet容器的服务器中即可访问示例了。

示例的源码在WebContent/demos中可以找到

### 查看文档 ###
构建完成后，在WebContent/docs目录中可以找到组件的文档。包括组件属性和方法

该文档由[jsDoc](http://code.google.com/p/jsdoc-toolkit/) 生成，向作者表示感谢