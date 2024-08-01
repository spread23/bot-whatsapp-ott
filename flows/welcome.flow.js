import { addKeyword, EVENTS } from '@builderbot/bot'

import { secondFlow, denyFlow } from './secondFlow.flow.js'

const flowWelcome = addKeyword(EVENTS.WELCOME)
.addAnswer(`Hola, y bienvenido/a al proceso de selección de OFRECETUTALENTO 🙌, Estoy aquí para ayudarte a postular a una vacante y guiarte a través del proceso de manera sencilla 👌`)
.addAnswer('*ACUERDO DE POLITICA DE PRIVACIDAD*')
.addAnswer(`Antes de continuar, es importante que leas y aceptes nuestra política de privacidad, puedes encontrarla en https://bit.ly/politicadeprivacidad-gu`)
.addAnswer('¿Aceptas nuestra politica de privacidad?\n', { buttons: [{body: 'Si acepto'}, {body: 'No acepto'}] }, [secondFlow, denyFlow])

export {
    flowWelcome
}