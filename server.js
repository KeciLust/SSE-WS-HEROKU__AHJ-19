const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 7070;
const Router = require('koa-router');
const router = new Router();
const WS = require('ws');
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });

const contacts = [];





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
        contacts.push({...ctx.request.body});
        ctx.response.status = 204;
        
        
    });
    router.delete('/contacts/:name', async ctx => {
        const index = contacts.findIndex(({ name }) => name === ctx.params.name);
        if (index !== -1) {
            contacts.splice(index, 1);
         };
        ctx.response.status = 204;

    });
                           
        

    
             app.use(router.routes());
             app.use(router.allowedMethods());
             
     wsServer.on('connection', (ws, req) => {
            const errCallback = (err) => {
            if (err) {
               console.log(err);
            }
            }
            ws.on('message', msg => {
                Array.from(wsServer.clients)
                    .filter(o => o.readyState === WS.OPEN)
                    .forEach(o => o.send(msg, errCallback));
                });
            ws.on('close', () => {
                  console.log('close');
            });    
                       });
                
             

server.listen(port);

