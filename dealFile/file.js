// 用于删除静态文件
const fs = require('fs')
const path = require('path')

const deleteImg = (filename) => {
    let filepath = path.resolve(__dirname, '..', 'uploads', filename)
    fs.unlink(filepath, (err) => {
        if (err) {
            throw new Error("图片删除失败，原因：" + err.message + err)
        }
    })
}

module.exports = {
    deleteImg
}