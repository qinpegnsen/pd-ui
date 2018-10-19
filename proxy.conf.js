const PROXY_CONFIG = [
    {
        context: [
            "/login",
            "/elder",
			"/staff",
			"/statis",
            "/classroom",
            "/timetable", //课表信息
            "/tutor", //教师信息
            "/student", // 学生信息
            "/goods", //商品信息
            "/classroom", //课堂信息
            "/course", //课程信息
            "/order", //订单信息
            "/classroomQuestionnaireContent", //获取问卷调查表
            "/classroomQuestionnaireRecord", //留言
            "/message" //记录问卷调查表
        ],
        target: "http://192.168.10.182:8086",                 //拦截 context配置路径，经过此地址  开发环境  万鹏
        // target: "http://192.168.10.109:8086",                 //拦截 context配置路径，经过此地址  开发环境  万鹏      连的是主业务，所以在服务器打印容器的日志  可以查看到信息
        secure: false
    },
    {
        context: [
            "/res", //枚举获取
            "/setting", //系统设置
            "/upload" //文件上传
        ],
        target: "http://192.168.10.182:8084",                 //拦截 context配置路径，经过此地址   开发环境  连的是后台的support-api  项目支撑需要的东西，比如说图片上传
        // target: "http://192.168.10.109:8084",                 //拦截 context配置路径，经过此地址   开发环境
        secure: false
    }
];

module.exports = PROXY_CONFIG;
