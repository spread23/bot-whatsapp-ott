import { addKeyword } from '@builderbot/bot'

import { feedFlow } from './feedFlow.flow.js'
import { vacantsFlow } from './vacantsFlow.flow.js'

const processFlow = addKeyword('proceso')
    .addAnswer('Gracias por continuar en el proceso 😁, podemos proceder con la recopilación de tu información 👍')
    .addAnswer('Para comenzar, necesito algunos datos personales, para identificarte en nuestro sistema, si en algun momento quieres cancelar el proceso, escribe *NO* 🙌')
    .addAnswer('¿Podrías indicarme tu nombre completo?', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ name: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias ${myState.name}`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }

    })
    .addAnswer('¿Podrías indicarme tu numero de documento?', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ document: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Muchas gracias por el documento ${myState.name}`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer('Perfecto👍 ¿Podrías indicarme tu numero de whatsapp, para mantener una comunicación fluida contigo?😁',
        {
            capture: true
        },
        async (ctx, { flowDynamic, state, endFlow }) => {
            await state.update({ cel: ctx.body })

            if (ctx.body.toUpperCase() !== 'NO') {
                await flowDynamic(`Muchas gracias por tu whatsapp 😊`)
            } else {
                return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
            }
        }
    )
    .addAnswer('continuemos ya falta poco, ¿Podrías indicarme cual es tu correo electrónico? (Introduce por favor un formato tipo: *mail@mail.com*)',
        {
            capture: true
        },
        async (ctx, { flowDynamic, state, endFlow }) => {
            await state.update({ email: ctx.body })
            const myState = state.getMyState()

            if (ctx.body.toUpperCase() !== 'NO') {
                await flowDynamic(`Gracias por tu correo ${myState.name} 😁`)
            } else {
                return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
            }
        }
    )
    .addAnswer('¿Podrías indicarme la region en la que vives', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ region: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias ${myState.name} ya tengo tu region`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer('Ahora, indicame la ciudad en la que vives, por favor 😁', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ city: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias por indicarme tu ciudad ${myState.name}`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer(`a continuación puedes adjuntar tu CV en los siguientes formatos. (PDF, DOC)`,
        {
            capture: true
        },
        async (ctx, { flowDynamic, state, endFlow }) => {
            await state.update({ cv: ctx.body })
            const myState = state.getMyState()

            if (ctx.body.toUpperCase() !== 'NO') {
                await flowDynamic(`Felicidades si llegaste a este paso ${myState.name} tus datos son:\n nombre: ${myState.name} \n documento: ${myState.document} \n whatsapp: ${myState.cel} \n correo: ${myState.email} \n region: ${myState.region} \n ciudad: ${myState.city}`)
            } else {
                return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
            }

        }
    )
    .addAnswer('Ya tengo todos tus datos para el proceso de selección, muchas gracias👌')
    .addAnswer('Si quieres recibir un feedback de tu CV, presiona *Feedback*, si quieres ver las vacantes relacionadas con tus talentos, presiona *Vacantes*',
        {
            buttons: [{body: 'Feedback'}, {body: 'Vacantes'}]
        }, [feedFlow, vacantsFlow]
    )


export {
    processFlow,
}