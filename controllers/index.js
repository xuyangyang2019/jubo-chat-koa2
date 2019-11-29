// MVC Controllers
const fs = require('fs');

/**
 * 异步读取文件
 * @param {*} url 
 */
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', function (err, data) {
            if (err) return reject(err);
            resolve({ status: 200, body: data })
        })
    })
}

module.exports = {
    'GET /': async (ctx, next) => {
        let path = './dist/index.html'
        // 构造解析 异步读取
        const { status, body } = await read(path);
        // 同步读取
        // let status = 200
        // let body = fs.readFileSync(path, 'utf-8');
        ctx.state = status;
        ctx.type = 'text/html';
        ctx.body = body;
    }
};
