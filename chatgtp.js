import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import dotenv from 'dotenv-safe'
import koa from 'koa'
import router from '@koa/router';

dotenv.config({
  allowEmptyValues: true
});
// console.log(process.env.OPENAI_ACCESS_TOKEN)

const app = new koa({ proxy: true });


const api = new ChatGPTUnofficialProxyAPI({
  accessToken: process.env.OPENAI_ACCESS_TOKEN,
  apiReverseProxyUrl: 'https://chat.duti.tech/api/conversation'
})

router.post('/', async (ctx, next) => {
  // ctx.router available
  console.log(ctx.post)
  const res = await api.sendMessage('你是什么？')

  // const res = await api.sendMessage('Hello World!', {
  //   conversationId: 
  // })
  console.log("response:", res, res.text)
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
app.listen(3000);