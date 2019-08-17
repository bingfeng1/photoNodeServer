// 个人相关信息业务
// 获取图片相关的路由
const Router = require('koa2-router');
const router = new Router();
const dealSql = require('../mysql/sqlData') //封装的promise数据库方法
const mysql = require('mysql')  //使用mysql.format 进行sql拼接
// 生成随机码
const nanoid = require('nanoid')
// 文件系统
const multer = require('koa-multer')
const path = require('path')
// 生成日期
const dateTime = require('date-time');
// 上次文件的配置
let storage = multer.diskStorage({
    destination:
        path.resolve(__dirname, '..', 'uploads')
    ,
    filename: function (req, file, cb) {
        let [name, ext] = file.originalname.split('.')
        // 通过uuid生成几乎唯一的名字（应该可以增加年月日）
        name = nanoid()
        cb(null, [name, ext].join('.'))
    }
})
const upload = multer({ storage });
// 解析token的方法
const { checkToken } = require('../token/token')

// 删除文件
const { deleteImg } = require('../dealFile/file')

router
    // 路由中间件，所有和用户相关的都要经过token解密
    .use(async (ctx, next) => {
        let param = ctx.request.header.authorization;

        // 解密token
        ctx.token = await checkToken(param).then(data => data)

        await next();
    })
    // 获取图片类型（tree）
    .get('/imgType', async ctx => {
        // 这里拼接sql语句
        let { account } = ctx.token;
        let sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList

    })
    // 增加数据，并返回
    .post('/addImgType', async ctx => {
        let params = ctx.request.body;
        let { account } = ctx.token;
        params.id = nanoid();
        params.account = account;
        // 这里拼接sql语句
        let sql = mysql.format('INSERT INTO `userImgType` SET ? ', [params])
        await dealSql(sql).then((
            { results }) => results)

        sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })
    // 删除图片信息
    .delete('/deleteImgType', async ctx => {
        let { account } = ctx.token;
        let id = ctx.query;
        // 这里拼接sql语句
        let sql = mysql.format('DELETE FROM `userImgType` WHERE ? ', [id])
        await dealSql(sql).then((
            { results }) => results)

        sql = mysql.format('SELECT * FROM `userImgType` WHERE ? ORDER BY orderId', [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })
    // 修改图片信息
    .put('/updateImgType', async ctx => {
        let { account } = ctx.token;
        let { id, typename } = ctx.request.body;
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
    .post('/upload', upload.array('file', 9), async ctx => {
        // 循环获取图片信息（已保存完毕）
        let { account } = ctx.token;
        let sql = mysql.format('INSERT INTO `imagelist` (id,account,path,originalname,destination,relativepath,filename,createtime,size,ext,mimetype) VALUES ')
        let temparr = [];
        let _path = path;
        for (let v of ctx.req.files) {
            let { destination, filename, mimetype, originalname, path, size } = v;
            let [id, ext] = filename.split('.')
            let createtime = dateTime()
            let relativepath = _path.relative(ctx.basePath, path)
            temparr.push(mysql.format('(?,?,?,?,?,?,?,?,?,?,?)', [id, account, path, originalname, destination, relativepath, filename, createtime, size, ext, mimetype]))
        }
        sql += temparr.join(',')
        await dealSql(sql).then((
            { results }) => results)
        ctx.body = "success"
    })

    // 获取当前用户已上传的图片
    .get('/selfImg', async ctx => {
        let { account } = ctx.token;
        let sql = mysql.format('SELECT id,filename,originalname FROM `imagelist` WHERE ? ', [{ account }])
        let result = await dealSql(sql).then(
            ({ results }) => results
        )
        ctx.body = result
    })
    // 删除用户上传的图片
    .delete('/deleteImg', async ctx => {
        let { account } = ctx.token;
        let { id, filename } = ctx.query;
        let sql = mysql.format('DELETE FROM `imagelist` WHERE ? AND ? ', [{ account }, { id }])
        let result = await dealSql(sql).then(
            ({ results }) => results
        )
        let data;
        if (result.affectedRows == 1) {
            data = "success";
            // 进行文件删除操作
            deleteImg(filename)
        } else {
            data = "error"
        }
        ctx.body = data;
    })

module.exports = router;