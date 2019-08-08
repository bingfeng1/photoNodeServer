// 获取图片相关的路由
const Router = require('koa2-router');
const router = new Router();
const fs = require('fs')

// 走马灯图片路由
router.get('/carousel', async ctx => {
    let filePath = 'F:/learn/photoItem/photovue/src/assets/image';
    let fileList = await getImgPath(filePath)
    
    ctx.body = fileList
})

module.exports = router;

// 获取图片地址（这个以后从数据库获取）
const getImgPath = (filePath)=>{
    return new Promise((resolve,reject)=>{
        fs.readdir(filePath, async (err, files) => {
            if (err) reject(new Error('读取文件失败' + err))
            resolve(files)
        })
    })
}