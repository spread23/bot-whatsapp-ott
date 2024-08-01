import { addKeyword } from '@builderbot/bot'

//const { processFlow } = require('./processFlow.flow')
import { botFlow } from './botFlow.flow.js'
import { processFlow } from './process.flow.js'

const secondFlow = addKeyword('Si acepto')
.addAnswer('Presiona *PROCESO* si quieres continuar en el proceso de selección, o presiona *BOT* si quieres recibir consejos de como puedes mejorar tu CV y mejorar tus habilidades blandas para aumentar tus posibilidades de ser seleccionado. 😊',
    {
        buttons: [{body: 'Proceso'}, {body: 'Bot'}]
    },[processFlow, botFlow]
)

const denyFlow = addKeyword('No acepto').addAnswer('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')

export {
    secondFlow,
    denyFlow
}