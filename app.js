// 创建app实例
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); // 解析原始request请求

const rest = require('./middleware/rest'); // rest中间件
const controller = require('./middleware/controller'); // 扫描注册Controller，并添加router:
const templating = require('./middleware/templating'); // 扫描注册Controller，并添加router:
const { historyApiFallback } = require('koa2-connect-history-api-fallback');

// const websocketServer = require('./websocket/websocketServer'); // websocket中间件
// let parseUser = websocketServer.parseUser
// let createWebSocketServer = websocketServer.createWebSocketServer

// 判断当前环境是否是production环境 production development
const config = require('./config')
const isProduction = config.mode === 'prod';

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }))

// 第一个middleware是记录URL以及页面执行时间：
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// 测试环境下 解析静态文件；线上用ngix反向代理
if (!isProduction) {
    console.log('测试环境，使用static-files')
    let staticFiles = require('./middleware/static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
    app.use(staticFiles('/dist/', __dirname + '/dist'));
}

// parse user from cookie:
// app.use(async (ctx, next) => {
//     console.log('parse user from cookie')
//     ctx.state.user = parseUser(ctx.cookies.get('name') || '');
//     await next();
// });

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
// templating('views', {
templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}, app);

// bind .rest() for ctx:
app.use(rest.restify());

// controller中间件
// 自动扫描controllers文件夹中的js文件 
// controllers中的js文件 导出模块方法{'GET /login':async (ctx,next)=>{},...}
// 自动require js文件到 mapping = {'GET /login':async (ctx,next)=>{}}
// 遍历每个mapping 自动添加router router.get(path, mapping[url])
app.use(controller(__dirname + '/controllers'));

// ================websocket=========================
// let server = app.listen(3000);
// app.wss = createWebSocketServer(server);

// module.exports = app;
app.listen(3000)
console.log('app started at port 3000...');

