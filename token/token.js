// token身份验证
const jwt = require('jsonwebtoken')
const { secret } = require('./secret.json')

/**
 * 
 * @param {*} data 需要加密的数据
 * @param {*} option 加密相关参数，参照jwt
 */
const addToken = (data, option = {}) => {
    return new Promise((resolve, reject) => {
        jwt.sign(data, secret, option, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}

/**
 * 
 * @param {*} token 需要加密的数据
 * @param {*} option 加密相关参数，参照jwt
 */
const checkToken = (token, option = {}) => {
    return new Promise((resolve, reject) => {
        token = token.split(' ')[1];
        jwt.verify(token, secret, option, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}

module.exports = {
    addToken,
    checkToken
}