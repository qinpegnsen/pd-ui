ie9兼容解决办法

项目开发完成，打包前：
1、根路由添加{useHash: true}，即： RouterModule.forRoot(routes, {useHash: true})

打包完成后：
1、copy文件shim.min.js，zone.min.js,classList.js到打包的根目录
2、修改index.html代码如下
    head添加代码：
    <!--[if IE 9]>
    <script type="text/javascript" src="shim.min.js"></script>
    <script type="text/javascript" src="classList.min.js"></script>
    <![endif]-->
    body中script引入代码改为（注意，添加了if ie9的判断）：
    <script type="text/javascript" src="inline.bundle.js"></script>
    <script type="text/javascript" src="polyfills.bundle.js"></script>
    <script type="text/javascript" src="scripts.bundle.js"></script>
    <!--[if IE 9]>
    <script type="text/javascript" src="zone.min.js"></script>
    <![endif]-->
    <script type="text/javascript" src="styles.bundle.js"></script>
    <script type="text/javascript" src="vendor.bundle.js"></script>
    <script type="text/javascript" src="main.bundle.js"></script>
