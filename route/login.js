// 登录等用户信息路由
const Router = require('koa2-router');
const router = new Router();
const dealSql = require('../mysql/sqlData') //封装的promise数据库方法
const mysql = require('mysql')  //使用mysql.format 进行sql拼接

// image上传解析问题，直接使用buffer方式解析失败
const multer = require('koa-multer')
const upload = multer();

// 检测登录信息
router.post('/login', async ctx => {
    let { account, pass } = ctx.request.body;
    // 这里拼接sql语句
    let sql = mysql.format('SELECT imageBase64,imgtype FROM `users` where ? and ?', [{ account }, { pass }])
    let result = await dealSql(sql)
        .then(
            ({ results }) => {
                return {
                    imageBase64: results[0].imageBase64.toString('base64'),
                    imgtype: results[0].imgtype
                }
            }
        )
        .catch(
            err => {
                return { message: err.message }
            }
        )
    ctx.body = result;
})

    // 获取上传资料
    .post('/headImg', upload.single('file'), async ctx => {
        ctx.body = ctx.req.file
    })

    // 注册信息入库
    .post('/signup', async ctx => {
        let { account, nickname, pass, birthday, hobbies, imageBase64, sex, imgtype } = ctx.request.body;
        hobbies = hobbies.toString()
        imageBase64 = Buffer.from(imageBase64);
        // 这里拼接sql语句
        let sql = mysql.format('INSERT INTO `users` SET ?', [{ account, nickname, pass, birthday, hobbies, imageBase64, sex, imgtype }])
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