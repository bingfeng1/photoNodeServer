// 获取图片相关的路由
const Router = require('koa2-router');
const router = new Router();
const fs = require('fs')
const path = require('path')
const dealSql = require('../mysql/sqlData') //封装的promise数据库方法
const mysql = require('mysql')  //使用mysql.format 进行sql拼接

const send = require('koa-send')

// 走马灯图片路由
router.get('/carousel', async ctx => {
    let filePath = path.resolve(__dirname, '../../photoVue/src/assets/image')
    let fileList = await getImgPath(filePath)

    ctx.body = fileList
})
    .get('/allImage', async ctx => {
        // 这里拼接sql语句
        let sql = mysql.format('SELECT c.* FROM `userImgType` a LEFT JOIN `imgforuser` b ON a.id = b.usertypeid LEFT JOIN `imagelist` c ON b.picid = c.id WHERE (a.islock IS NULL OR a.islock = FALSE) AND c.id IS NOT NULL')
        let imgList = await dealSql(sql).then((
            { results }) => results)
        ctx.body = imgList
    })
    // 下载时使用
    .get("/downloads",async ctx=>{
        let {filename} = ctx.query;
        await send(ctx,filename,{
            root: path.resolve(__dirname,'..','uploads')
        })
    })

module.exports = router;

// 获取图片地址（这个以后从数据库获取）
const getImgPath = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(filePath, async (err, files) => {
            if (err) reject(new Error('读取文件失败' + err))
            resolve(files)
        })
    })
}