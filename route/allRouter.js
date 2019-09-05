// 所有路由管理
const Router = require('koa2-router');
const router = new Router();
const Login = require('./login')
const Image = require('./image')
const User = require('./user')

router.use('/',Login)   // 登录注册相关路由
router.use('/image',Image)  // 图片相关的路由
router.use('/user',User)    //个人中心相关路由

module.exports = router;    // 在主程序中，引入，使用app.use(router)方式导入这个文件