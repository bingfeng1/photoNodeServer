// 个人相关信息业务
// 获取图片相关的路由
const Router = require('koa2-router');
const router = new Router();
const dealSql = require('../mysql/sqlData') //封装的promise数据库方法
const mysql = require('mysql')  //使用mysql.format 进行sql拼接
// 生成随机码
const nanoid = require('nanoid')
const multer = require('koa-multer')
const path = require('path')
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname,'..','uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage });

// 走马灯图片路由
router.get('/imgType', async ctx => {
    // 这里拼接sql语句
    let params = ctx.query

    let sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [params])
    let treeList = await dealSql(sql).then((
        { results }) => results)
    ctx.body = treeList

})
    // 增加数据，并返回
    .post('/addImgType', async ctx => {
        let params = ctx.request.body;
        params.id = nanoid();
        // 这里拼接sql语句
        let sql = mysql.format('INSERT INTO `userImgType` SET ? ', [params])
        await dealSql(sql).then((
            { results }) => results)

        sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [{ account: params.account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })
    .delete('/deleteImgType', async ctx => {
        let { account } = ctx.request.body;
        let id = ctx.query['id[]'];
        // 这里拼接sql语句
        let sql = mysql.format('DELETE FROM `userImgType` WHERE id IN (?) ', [id])
        await dealSql(sql).then((
            { results }) => results)

        sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })
    .put('/updateImgType', async ctx => {
        let { account } = ctx.request.body;
        let { id, typename } = ctx.query;
        // 这里拼接sql语句
        let sql = mysql.format('UPDATE `userImgType` SET ? WHERE id = ? ', [{ typename }, id])
        await dealSql(sql).then((
            { results }) => results)
        sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })

    // 用户上传图片
    .post('/upload', upload.array('file', 10), async ctx => {
        ctx.body = "success"
    })

module.exports = router;