const Koa = require('koa')
const handleError = require("koa-handle-error")
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const app = new Koa();

const route = require('./route/allRouter')
const serve = require('koa-static');
app.use(serve(__dirname + '/uploads'));

const onError = err => {
    console.error(err)
}

const basePath = __dirname;

app.use(logger())
    .use(handleError(onError))
    .use(bodyParser({multipart: true}))
    .use(cors())
    .use(async (ctx,next)=>{
        ctx.basePath = basePath;
        await next();
    })
    .use(route)

    .listen(3000, '0.0.0.0', () => {
        console.log('成功启动服务')
    })