const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 7070;
const Router = require('koa-router');
const router = new Router();
const contacts = [
    {name: 'qwe',id:123},
    {name:'123', id:23}
];





app.use(koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
    }));
    




app.use(async (ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
    return await next();
    }
    const headers = { 'Access-Control-Allow-Origin': '*', };
    if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
    return await next();
    } catch (e) {
    e.headers = { ...e.headers, ...headers };
    throw e;
    }
    }
    if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
    ...headers,
    'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
    ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
    
    }
    });
    
    router.get('/contacts', async ctx => {
        ctx.response.body = contacts;
    });
    
    router.post('/contacts', async ctx => {
        contacts.push({...ctx.request.body, id: uuidv4()});
        ctx.response.status = 204;
        
    });
    router.delete('/contacts', async ctx => {
        const index = contacts.findIndex(({ id }) => id === ctx.params.id);
        if (index !== -1) {
            contacts.splice(index, 1);
         };
        ctx.response.status = 204;

    });
                           
        

    
             app.use(router.routes());
             app.use(router.allowedMethods());
             
const server = http.createServer(app.callback()).listen(port);

