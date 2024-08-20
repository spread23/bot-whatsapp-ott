import { addKeyword } from '@builderbot/bot'

const videoFlow = addKeyword('Enviar video')
.addAnswer('Envianos un video de 30 segundos, haciendo una breve peresentación sobre ti 😁')

export {
    videoFlow
} 