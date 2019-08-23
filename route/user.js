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

// 查询图片类型
const SELECT_IMAGE_TYPE = 'SELECT * FROM `userImgType` WHERE ? ORDER BY `orderId`';

router
    // 路由中间件，所有和用户相关的都要经过token解密
    .use(async (ctx, next) => {
        let param = ctx.request.header.authorization;

        // 解密token
        ctx.token = await checkToken(param).then(data => data)

        await next();
    })
    // 获取获取所有可查看的图片
    .get('/allImage', async ctx => {
        let { account } = ctx.token;
        // 这里拼接sql语句
        let sql = mysql.format('SELECT c.*, IF(d.picid IS NULL,FALSE,TRUE) AS collected FROM `userImgType` a LEFT JOIN `imgforuser` b ON a.id = b.usertypeid LEFT JOIN `imagelist` c ON b.picid = c.id LEFT JOIN ( SELECT * FROM `privateCollection` WHERE ?) d ON c.`id` = d.`picid` WHERE (a.islock IS NULL OR a.islock = FALSE) AND c.id IS NOT NULL ', [{ account }])
        let imgList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = imgList
    })

    // 增加或者删除收藏
    .put('/updatecollect', async ctx => {
        let { account } = ctx.token;
        let { isconllect, picid } = ctx.request.body;
        let sql;
        // 这里拼接sql语句
        if (isconllect) {
            // 代表已拥有收藏
            sql = mysql.format('DELETE FROM `privateCollection` WHERE ? and ? ', [{ account }, { picid }])
        } else {
            sql = mysql.format('INSERT INTO `privateCollection` SET ?', [{ account, picid }])
        }
        let result = await dealSql(sql).then((
            { results }) => results)
        ctx.body = result
    })

    // 获取相册（tree）
    .get('/imgType', async ctx => {
        // 这里拼接sql语句
        let { account } = ctx.token;
        let sql = mysql.format(SELECT_IMAGE_TYPE, [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList

    })
    // 增加相册
    .post('/addImgType', async ctx => {
        let params = ctx.request.body;
        let { account } = ctx.token;
        params.id = nanoid();
        params.account = account;
        // 这里拼接sql语句
        let sql = mysql.format('INSERT INTO `userImgType` SET ? ', [params])
        await dealSql(sql).then((
            { results }) => results)

        sql = mysql.format(SELECT_IMAGE_TYPE, [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })
    // 删除相册
    .delete('/deleteImgType', async ctx => {
        let { account } = ctx.token;
        let id = ctx.query;
        // 这里拼接sql语句
        // 首先需要查询一下，该种类中是否有图片，如果有，那么删除失败
        let sql = mysql.format('SELECT COUNT(*) AS num FROM imgforuser a LEFT JOIN imagelist b ON a.picid = b.id WHERE a.account = ? and a.usertypeid = ?', [account, id.id])
        let num = await dealSql(sql).then((
            { results }) => results[0].num)
        if (num > 0) {
            ctx.body = "未清空"
        } else {
            sql = mysql.format('DELETE FROM `userImgType` WHERE ? ', [id])
            await dealSql(sql).then((
                { results }) => results)

            sql = mysql.format(SELECT_IMAGE_TYPE, [{ account }])
            let treeList = await dealSql(sql).then((
                { results }) => results)
            ctx.body = treeList
        }

    })
    // 修改相册
    .put('/updateImgType', async ctx => {
        let { account } = ctx.token;
        let { id, typename } = ctx.request.body;
        // 这里拼接sql语句
        let sql = mysql.format('UPDATE `userImgType` SET ? WHERE id = ? ', [{ typename }, id])
        await dealSql(sql).then((
            { results }) => results)
        sql = mysql.format(SELECT_IMAGE_TYPE, [{ account }])
        let treeList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = treeList
    })
    // 是否变为私有相册
    .put('/islock', async ctx => {
        let { account } = ctx.token;
        let { id, islock } = ctx.request.body;
        // 这里拼接sql语句
        let sql = mysql.format('UPDATE `userImgType` SET ? WHERE ? and ? ', [{ islock }, { id }, { account }])
        let result = await dealSql(sql).then((
            { results }) => results)
        if (result.affectedRows == 1) {
            ctx.body = 'success'
        } else {
            ctx.body = 'error'
        }
    })

    // 用户上传图片
    .post('/upload', upload.array('file', 9), async ctx => {
        // 循环获取图片信息（已保存完毕）
        let { account } = ctx.token;
        let { type } = ctx.req.body;
        let sql = mysql.format('INSERT INTO `imagelist` (id,account,path,originalname,destination,relativepath,filename,createtime,size,ext,mimetype) VALUES ')
        let sql2 = mysql.format('INSERT INTO `imgforuser` (account,picid,usertypeid) VALUES ')
        let temparr = [];
        let temparr2 = [];
        let _path = path;
        for (let v of ctx.req.files) {
            let { destination, filename, mimetype, originalname, path, size } = v;
            let [id, ext] = filename.split('.')
            let createtime = dateTime()
            let relativepath = _path.relative(ctx.basePath, path)
            temparr.push(mysql.format('(?,?,?,?,?,?,?,?,?,?,?)', [id, account, path, originalname, destination, relativepath, filename, createtime, size, ext, mimetype]))
            temparr2.push(mysql.format('(?,?,?)', [account, id, type]))
        }
        sql += temparr.join(',')
        sql2 += temparr2.join(',')
        await dealSql(sql).then((
            { results }) => results)
        await dealSql(sql2).then((
            { results }) => results)
        ctx.body = "success"
    })

    // 获取当前用户已上传的图片
    .get('/selfImg', async ctx => {
        let { account } = ctx.token;
        let params = ctx.query;
        let id = params['checkedKeys[]']
        // flag用来判断是否是第一次进入，如果是第一次进入，那么直接显示所有
        let sql = mysql.format('SELECT c.id,c.filename,c.originalname,c.ext FROM `userImgType` a LEFT JOIN `imgforuser` b on a.id = b.usertypeid LEFT JOIN `imagelist` c on b.picid = c.id WHERE a.account = ? AND c.id IS NOT NULL', [account])
        if (id) {
            sql += mysql.format(' AND a.id in (?)', [id])
        }
        let result = await dealSql(sql).then(
            ({ results }) => results
        )
        ctx.body = result
    })
    // 删除用户上传的图片
    .delete('/deleteImg', async ctx => {
        let { account } = ctx.token;
        let { id, filename } = ctx.query;


        // 个人收藏
        let sql = mysql.format('DELETE FROM `privateCollection` WHERE ?  ', [{ picid: id }])
        let result = await dealSql(sql).then(
            ({ results }) => results
        )

        // 图片分组信息
        sql = mysql.format('DELETE FROM `imgforuser` WHERE ? AND ? ', [{ account }, { picid: id }])
        result = await dealSql(sql).then(
            ({ results }) => results
        )

        // 删除图片列表
        sql = mysql.format('DELETE FROM `imagelist` WHERE ? AND ? ', [{ account }, { id }])
        result = await dealSql(sql).then(
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
    // 修改图片名字
    .put('/updateImgName', async ctx => {
        let { account } = ctx.token;
        let { originalname, id } = ctx.request.body;
        // 这里拼接sql语句
        let sql = mysql.format('UPDATE `imagelist` SET ? WHERE account = ? and id = ? ', [{ originalname }, account, id])
        let result = await dealSql(sql).then((
            { results }) => results)

        ctx.body = result
    })
    // 获取用户收藏的图片
    // 获取获取所有可查看的图片
    .get('/collect', async ctx => {
        let { account } = ctx.token;
        // 这里拼接sql语句
        let sql = mysql.format('SELECT b.*,TRUE as collected  FROM `privateCollection` a  LEFT JOIN `imagelist` b ON a.picid = b.id WHERE a.?', [{ account }])
        let imgList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = imgList
    })


module.exports = router;