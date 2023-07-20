const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const Router = require('@koa/router');

const app = new Koa();

app.use(static(path.join(__dirname, 'public')));

const router = new Router();
app.use(router.routes());

router.get('/api/endpoint', ctx => {
  ctx.body = {ok: true};
});

router.post('/api/endpoint', ctx => {
  ctx.body = {ok: true};
});

router.post('/api/the-not-found', ctx => {
  ctx.status = 404;
  ctx.body = 'Not Found';
});

router.post('/api/the-forbidden', ctx => {
  ctx.status = 403;
  ctx.body = 'Forbidden';
});

app.listen(3000);
