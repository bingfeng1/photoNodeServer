// 登录等用户信息路由
const Router = require('koa2-router');
const router = new Router();

// 检测登录信息
router.post('/login', async ctx => {
    return ctx.body = {
        sessionId : true
    }
})

module.exports = router;