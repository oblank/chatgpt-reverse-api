import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import dotenv from 'dotenv-safe'
import koa from 'koa'
import Router from '@koa/router';
import { koaBody } from 'koa-body'
import fetch from 'unfetch'

dotenv.config({
  allowEmptyValues: true
});

const app = new koa({ proxy: true });
const router = new Router()
app
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods())
  
const api = new ChatGPTUnofficialProxyAPI({
  accessToken: process.env.OPENAI_ACCESS_TOKEN,
  // apiReverseProxyUrl: 'https://chat.duti.tech/api/conversation'
  apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation"
})
router.post('/', async (ctx, next) => {
  const params = ctx.request.body || {}
  console.log(`${new Date()}\t::ASK::\t ${params.promt}`)

  let DEFAULT_RES = {
    "role": "assistant",
    "id": null,
    "parentMessageId": params.parentMessageId,
    "conversationId": params.conversationId,
    "text": "hehe~~"
  }
  if(!params || (params.promt == null)) {
    ctx.body = DEFAULT_RES
  }

  let res = null
  try {
    if (params.conversationId) {
      let opts = {
        conversationId: params.conversationId
      }
      if (params.parentMessageId) {
        opts.parentMessageId = params.parentMessageId
      }
      res = await api.sendMessage(params.promt, opts)
    } else {
      res = await api.sendMessage(params.promt)
    }
  } 
  catch (e) {
    DEFAULT_RES.text = "ChatGPT不稳定，请稍后重试，若长时间未恢复请联系OB处理!"
    console.error(e.stack)
  }
  console.log(`${new Date()}\t::ChatGPT::\t ${res ? res.text : "error"}`)
  console.log(`\n\n`)
  ctx.body = res || DEFAULT_RES
});

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
app.listen(3000);