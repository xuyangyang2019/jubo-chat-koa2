// MVC Controllers

// 原始语法
let fn_hello = async (ctx, next) => {
    ctx.response.type = 'text/html';
    let name = ctx.request.query.name || 'world';
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
};

// Nunjucks 模板方法
let fn_index = async (ctx, next) => {
    ctx.render('index.html', {
        title: 'Welcome'
    });
};

/**
 * 异步读取文件
 * @param {*} url 
 */
function read(url) {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', function (err, data) {
            if (err) return reject(err);
            resolve({ status: 200, body: data })
        })
    })
}

let fn_vue = async (ctx, next) => {
    let path = './views/indexVue.html'
    // 构造解析 异步读取
    const { status, body } = await read(path);
    // 同步读取
    // let status = 200
    // let body = fs.readFileSync(path, 'utf-8');
    ctx.state = status;
    ctx.type = 'text/html';
    ctx.body = body;
}

module.exports = {
    'GET /': fn_index,
    'GET /vue': fn_vue,
    'GET /hello/:name': fn_hello
};
