import { addKeyword } from '@builderbot/bot'
import { PdfReader } from "pdfreader"
import { ChatGPTClass } from '../chatgpt.class.js'

import { videoFlow } from './videoFlow.flow.js'

const chatGptInstance = new ChatGPTClass()

const deny = addKeyword('no').addAnswer('Ok,te entiendo, ya has culminado tu proceso, muchas gracias 😊')

const feedFlow = addKeyword('feedback')
    .addAnswer('Muy pronto te daremos feedback de tu cv...', null, async (ctx, { state, flowDynamic }) => {

        const myState = state.getMyState()
        let result = ''

        new PdfReader().parseFileItems(myState.path, (err, item) => {
            if (err) console.error("error:", err);
            else if (!item) {
                console.warn("end of file")
            }
            else if (item.text) {

                result += item.text
            }
        })

        await chatGptInstance.handleMsgChatGPT(`Eres un experimentado coach  de una empresa llamada 'Ofrecetutalento' 
            de recursos humanos especializado en ayudar a las personas a mejorar 
            sus currículums y desarrollar sus habilidades blandas 
            para aumentar sus posibilidades de ser seleccionadas para 
            un puesto de trabajo. Tu objetivo es guiar a los usuarios a 
            través de estrategias efectivas para destacar en el mercado 
            laboral. Ofrece consejos prácticos y detallados sobre cómo 
            estructurar un CV atractivo, resaltar experiencias relevantes y 
            mejorar habilidades blandas como la comunicación, el trabajo en equipo 
            y la adaptabilidad. Asegúrate de responder preguntas y proporcionar ejemplos 
            concretos cuando sea necesario, fomentando siempre una actitud positiva 
            y proactiva. Te voy a mandar un texto con mi hoja de vida, para que me des feedback  y consejos
            de como mejorarla, no te preocupes que todo te lo voy a pasar en texto, respondeme en un solo bloque
            de texto, dime que opinas de mi curriculum`)

        const response = await chatGptInstance.handleMsgChatGPT(`Este es mi curriculum: ${result}`)

        console.log(result)

        const message = response.text
        await flowDynamic(message)
    })
    .addAnswer('😁Espero que te haya sido util el feedback, ahora, si quieres aumentar tus posibilidades de ser contratado, puedes enviar un video de 30 segundos, con una breve presentacion sobre ti, que dices?', 
        { buttons: [{body: 'Si'}, {body: 'No'}] }, null, [deny, videoFlow])

export {
    feedFlow,
    deny
} 