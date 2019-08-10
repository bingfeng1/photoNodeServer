// 登录等用户信息路由
const Router = require('koa2-router');
const router = new Router();
const {
    INSERT,
    SELECT,
    UPDATE
} = require('../mysql/sqlData')

// 检测登录信息
router.post('/login', async ctx => {
    return ctx.body = {
        sessionId: true
    }
})

    // 获取上传资料
    .post('/headImg', async ctx => {
        await dealImg(ctx).then(
            data =>
                ctx.body = data
        )
    })

    // 注册信息入库
    .post('/signup', async ctx => {
        let { account, nickname, pass, birthday, hobbies, imageBase64, sex } = ctx.request.body;
        hobbies = hobbies.toString()
        ctx.body = await INSERT(["users", { account, nickname, pass, birthday, hobbies, imageBase64, sex }]).then(
            data => data
        ).catch(
            err => err
        )
    })

// 这里处理图片信息，转为base64
function dealImg(ctx) {
    return new Promise(resolve => {
        let buffer = []
        ctx.req.on('data', function (data) {
            buffer.push(data);
        });
        //监听 end 事件 用于处理接收完成的数据
        ctx.req.on('end', function () {
            resolve(buffer.toString('base64'))
        });
    })
}

module.exports = router;