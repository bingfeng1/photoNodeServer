// 获取图片相关的路由
const Router = require('koa2-router');
const router = new Router();
const fs = require('fs')
const path = require('path')
const {
    INSERT,
    SELECT,
    UPDATE
} = require('../mysql/sqlData')

// 走马灯图片路由
router.get('/carousel', async ctx => {
    let filePath = path.resolve(__dirname,'../../photoVue/src/assets/image')
    let fileList = await getImgPath(filePath)

    ctx.body = fileList
})
    .get('/allImage', async ctx => {
        let imgList = await SELECT([["image_url"],'product_image']).then(data=>data)
        console.log(imgList)
        ctx.body = imgList
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