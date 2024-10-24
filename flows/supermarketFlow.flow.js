import { addKeyword } from '@builderbot/bot'

import { vacantsFlow } from './vacantsFlow.flow.js'
import { sayByeFlow } from './sayByeFlow.js'

const supermarketFlow = addKeyword('Supermercados')
.addAnswer(`¿Tiene disponibilidad de laborar turnos rotativos y 24 horas? 😊`, {capture:true, buttons: [{ body: 'SI' }, { body: 'NO' }]}, async (ctx, {flowDynamic, state}) => {
    await state.update({ turnos: ctx.body })

    await flowDynamic('Gracias por tu respuesta 😁')
})
.addAnswer(`¿Tiene disponibilidad de laborar de lunes a domingos? 😊`, {capture:true, buttons: [{ body: 'SI' }, { body: 'NO' }]}, async (ctx, {flowDynamic, state}) => {
    await state.update({ sundays: ctx.body })

    await flowDynamic('Gracias 👌')
})
.addAnswer(`¿Tiene disponibilidad de laborar dia feriados nacionales? 😁`, {capture:true, buttons: [{ body: 'SI' }, { body: 'NO' }]}, async (ctx, {flowDynamic, state}) => {
    await state.update({ holydays: ctx.body })

    await flowDynamic('Ok 😊')
})
.addAnswer(`¿Cuénta con carnet blanco vigente? 😁`, {capture:true, buttons: [{ body: 'SI' }, { body: 'NO' }]}, async (ctx, {flowDynamic, state}) => {
    await state.update({ whiteCard: ctx.body })

    await flowDynamic('Gracia por tu respuesta 😊')
})
.addAnswer(`¿Cuénta con carnet verde vigente? 😁`, {capture:true, buttons: [{ body: 'SI' }, { body: 'NO' }]}, async (ctx, {flowDynamic, state}) => {
    await state.update({ greenCard: ctx.body })

    await flowDynamic('Gracia por tu respuesta 👍')
})
.addAnswer('Si quieres ver las vacantes relacionadas con tus talentos, presiona *Vacantes*, Si quieres terminar tu proceso de selección aquí, presiona *Terminar*',
    {
        buttons: [{ body: 'Vacantes' }, { body: 'Terminar' }]
    }, [sayByeFlow, vacantsFlow]
)

export {
    supermarketFlow,
}