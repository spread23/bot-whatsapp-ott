import { addKeyword } from '@builderbot/bot'

const sayByeFlow = addKeyword('Terminar')
.addAnswer(`Gracias por enviarnos tus datos y hoja de vida 😁 Le vamos a pasar la información al reclutador y de mantener afinidad, se estarán poniendo en contacto contigo 😊. Muchas gracias por tu paciencia y quedamos a tus ordenes 👌`)

export {
    sayByeFlow,
}