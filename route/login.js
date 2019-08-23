// 登录等用户信息路由
const Router = require('koa2-router');
const router = new Router();
const dealSql = require('../mysql/sqlData') //封装的promise数据库方法
const mysql = require('mysql')  //使用mysql.format 进行sql拼接
const { addToken } = require('../token/token') //使用token加密
const path = require('path')

// image上传解析问题，直接使用buffer方式解析失败
const multer = require('koa-multer')

let storage = multer.diskStorage({
    destination:
        path.resolve(__dirname, '..', 'portrait')
    ,
    filename: function (req, file, cb) {
        // 通过uuid生成几乎唯一的名字（应该可以增加年月日）
        cb(null, file.originalname)
    }
})
const upload = multer({ storage });

// 检测登录信息
router.post('/login', async ctx => {
    let { account, pass } = ctx.request.body;
    // 这里拼接sql语句
    let sql = mysql.format('SELECT nickname,portrait FROM `users` where ? and ?', [{ account }, { pass }])
    let result = await dealSql(sql)
        .then(
            ({ results }) =>
                results[0]
        )
        .catch(
            err => {
                return { message: err.message }
            }
        )
    // 如果没有错误信息，那么添加token
    if (!result.message) {
        result.token = await addToken({ account }).then(data => data)
    }
    ctx.body = result;
})
    // 注册信息入库
    .post('/signup', upload.single('portrait'), async ctx => {
        let { account, nickname, pass, birthday, hobbies, sex, imageType } = ctx.req.body;
        let portrait;
        if (ctx.req.file) {
            portrait = ctx.req.file.filename;
        }
        hobbies = hobbies == "undefined" ? null : hobbies.toString()
        // 这里拼接sql语句
        let sql = mysql.format('INSERT INTO `users` SET ?', [{ account, nickname, pass, birthday, hobbies, portrait, sex, imageType }])
        let result = await dealSql(sql)
            .then(
                ({ results }) => {
                    return { results }
                }
            )
            .catch(
                err => {
                    return { message: err.message }
                }
            )
        ctx.body = result;
    })

module.exports = router;