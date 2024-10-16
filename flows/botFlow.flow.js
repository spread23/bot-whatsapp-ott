import { addKeyword } from '@builderbot/bot'
import fs from 'fs'
import { PdfReader } from "pdfreader"
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'

import { ChatGPTClass } from '../chatgpt.class.js'

dotenv.config()

const exitFlow = addKeyword('quiero salir').addAnswer('Ok, escribeme cuando quieras iniciar tu proceso de selección 😊 Vuelve pronto')

const chatGptInstance = new ChatGPTClass()

const botFlow = addKeyword('bot')
    .addAnswer('Hola, bienvenid@ a Ofrece Tu Talento. Estoy aquí para ayudarte a mejorar tu CV y tus habilidades blandas 😁, Si en algún momento quieres salir de esta conversación y volver al menú principal escribe *QUIERO SALIR* 👌. Recuerda que puedes adjuntar tu CV en un formato PDF para que lo revise.👌',
        {
            capture: true
        },
        async (ctx, { fallBack, state }) => {
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
                                                y proactiva. Recuerdale al usuario que si quiere salir de la conversacion
                                                debe escribir "QUIERO SALIR"`)

            if (ctx.body.toUpperCase() !== 'QUIERO SALIR') {

                if (ctx.body.includes('_event_document')) {
                    //Funcion para guardar archivo enviado por WPP
                    let result = ''
                    const url = ctx.url
                    const token = process.env.jwtToken
                    const destino = `${process.cwd()}/tmp/pdfs/filePdf-${Date.now()}.pdf`
                    await state.update({ path: destino })

                    console.log(ctx)

                    try {
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        });

                        if (!response.ok) {
                            throw new Error(`Error al descargar el archivo: ${response.statusText}`)
                        }

                        const buffer = await response.buffer();

                        fs.writeFile(destino, buffer, async (err) => {
                            if (err) {
                                throw new Error(`Error al guardar el archivo: ${err.message}`)

                            }
                            console.log('Descarga completada')

                             //Pasarle el archivo PDF a la IA
                            const myState = state.getMyState()

                            new PdfReader().parseFileItems(myState.path, (err, item) => {
                                if (err) console.error("error:", err);
                                else if (!item) {
                                    console.warn("end of file")
                                }
                                else if (item.text) {

                                    result += item.text
                                }
                            })
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

                        const responseTwo = await chatGptInstance.handleMsgChatGPT(`Este es mi curriculum: ${result}`)

                        const message = responseTwo.text
                        return fallBack(message)

                    } catch (error) {
                        console.error('Error: el error es:', error)
                    }

                } else {
                    const response = await chatGptInstance.handleMsgChatGPT(ctx.body)
                    const message = response.text

                    return fallBack(message)
                }
            }
        }, [exitFlow]
    )

export {
    botFlow,
    exitFlow
}