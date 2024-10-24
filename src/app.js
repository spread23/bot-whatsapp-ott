import * as dotenv from 'dotenv'
import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

//Welcome flows import
import { flowWelcome } from '../flows/welcome.flow.js'

//sub flows import
import { secondFlow, denyFlow } from '../flows/secondFlow.flow.js'
import { botFlow, exitFlow } from '../flows/botFlow.flow.js'
import { processFlow } from '../flows/process.flow.js'
import { feedFlow } from '../flows/feedFlow.flow.js'
import { vacantsFlow } from '../flows/vacantsFlow.flow.js'
import { sayByeFlow } from '../flows/sayByeFlow.js'
import { supermarketFlow } from '../flows/supermarketFlow.flow.js'

dotenv.config()

const PORT = process.env.PORT ?? 3008

const main = async () => {
    const adapterFlow = createFlow([flowWelcome, secondFlow, botFlow, processFlow, feedFlow, vacantsFlow, exitFlow, denyFlow, sayByeFlow, supermarketFlow])
    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.jwtToken,
        numberId: process.env.numberId,
        verifyToken: process.env.verifyToken,
        version: process.env.version
    })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
