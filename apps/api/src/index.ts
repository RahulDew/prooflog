import { Hono } from "hono";
const app = new Hono();

app.get('/health', (c) => {
return c.json({
    status: 'ok',
    service: 'prooflog-api',
    version: '0.0.1',
    timestamp: new Date().toISOString()
})
})

app.post('/v1/ingest', async (c) => {
  const body = await c.req.json()
  return c.json({ received: true }, 202)
})

export default app