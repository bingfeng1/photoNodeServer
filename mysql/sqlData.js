// 对于数据库操作比较薄弱，所以这里简单写一下
const mysql = require('mysql');
// 使用配置文件配置数据库
const { database } = require('../config.json')
const pool = mysql.createPool(
    // 这里请使用自己的数据库地址，此地址为本地虚拟机默认设置
    database
);

/**
 * 
 * @param {*} params 将封装的sql语句直接导入
 * 这里使用promise返回结果
 */
const dealSql = sql => {
    return new Promise((resolve, reject) => {
        pool.query(sql, function (error, results, fileds) {
            if (error) reject(error);
            resolve({ results, fileds });
        });
    })
}

module.exports = dealSql