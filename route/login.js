// 登录等用户信息路由
const Router = require('koa2-router');
const router = new Router();
const dealSql = require('../mysql/sqlData') //封装的promise数据库方法
const mysql = require('mysql')  //使用mysql.format 进行sql拼接
const { addToken } = require('../token/token') //使用token加密

// image上传解析问题，直接使用buffer方式解析失败
const multer = require('koa-multer')
const upload = multer();

// 检测登录信息
router.post('/login', async ctx => {
    let { account, pass } = ctx.request.body;
    // 这里拼接sql语句
    let sql = mysql.format('SELECT nickname,imageBase64,imageType FROM `users` where ? and ?', [{ account }, { pass }])
    let result = await dealSql(sql)
        .then(
            ({ results }) => {
                return {
                    imageBase64: results[0].imageBase64.toString('base64'),
                    imageType: results[0].imageType,
                    nickname: results[0].nickname,
                }
            }
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
    .post('/signup', upload.single('imageBase64'), async ctx => {
        let { account, nickname, pass, birthday, hobbies, sex, imageType } = ctx.req.body;
        let imageBase64 = ctx.req.file.buffer;
        hobbies = hobbies.toString()
        // 这里拼接sql语句
        let sql = mysql.format('INSERT INTO `users` SET ?', [{ account, nickname, pass, birthday, hobbies, imageBase64, sex, imageType }])
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