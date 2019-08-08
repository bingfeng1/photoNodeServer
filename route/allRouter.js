// 所有路由管理
const Router = require('koa2-router');
const router = new Router();
const Login = require('./login')
const Image = require('./image')

router.use('/',Login)
router.use('/image',Image)

module.exports = router;