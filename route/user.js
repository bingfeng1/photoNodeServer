// 个人相关信息业务
// 获取图片相关的路由
const Router = require('koa2-router');
const router = new Router();
const dealSql = require('../mysql/sqlData') //封装的promise数据库方法
const mysql = require('mysql')  //使用mysql.format 进行sql拼接

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
        let {account} = ctx.request.body;
        let orderId = ctx.query['orderId[]'];
        // 这里拼接sql语句
        let sql = mysql.format('DELETE FROM `userImgType` WHERE account = ? and orderId IN (?) ', [account,orderId])
        await dealSql(sql).then((
            { results }) => results)

        sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })
    .put('/updateImgType', async ctx => {
        let {account} = ctx.request.body;
        let {orderId,typename} = ctx.query;
        // 这里拼接sql语句
        let sql = mysql.format('UPDATE `userImgType` SET ? WHERE account = ? and orderId = ? ', [{typename},account,orderId])
        let result = await dealSql(sql).then((
            { results }) => results)
        ctx.body = result
    })

module.exports = router;