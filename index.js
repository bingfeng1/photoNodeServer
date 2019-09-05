const Koa = require('koa')
const handleError = require("koa-handle-error")
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const app = new Koa();

const route = require('./route/allRouter')
const serve = require('koa-static');

// 这一块作为正式发布的错误处理部分，应该是类似邮件提示的东西
const onError = err => {
    console.error(err)
}

const basePath = __dirname;

app.use(logger())   // 路由相关路径
    .use(handleError(onError))  // 错误处理
    // 这个multipart可能并没有用，因为文档中没有这一块东西。只是百度说可以解决文件上传的问题。后面可能用了其他方式解决了
    .use(bodyParser({ multipart: true })) 
    // 跨域处理，这个可以自己配置
    .use(cors())
    // 上传图片的静态资源路径
    .use(serve(__dirname + '/uploads'))
    // 上传头像的静态资源路径
    .use(serve(__dirname + '/portrait'))
    .use(async (ctx, next) => {
        // 将所有路由分部绑入当前主入口文件的路径
        ctx.basePath = basePath;
        await next();
    })
    // 所有自定义的路由放在最后，保证上面的中间件可以全部获取
    .use(route)

    // 监听3000端口
    .listen(3000, '0.0.0.0', () => {
        console.log('成功启动服务')
    })