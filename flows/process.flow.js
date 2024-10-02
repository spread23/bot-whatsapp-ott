import { addKeyword } from '@builderbot/bot'
import fetch from 'node-fetch'
import fs from 'fs'
import * as dotenv from 'dotenv'
import FormData from 'form-data'

import { feedFlow } from './feedFlow.flow.js'
import { vacantsFlow } from './vacantsFlow.flow.js'

dotenv.config()

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
    .addAnswer('¿Podrías indicarme cuales son tus talentos? aqui te muestro un ejemplo: ("copywriting, manejo de redes, diseño"), indicame al menos 4 talentos 😁, separados por: ","(coma)', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ talents: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Muchas gracias por indicarme tus talentos 😊 ${myState.name}`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer('Perfecto👍 ¿Podrías decirme tu experiencia en total?😁 por ejemplo:("4 años") indicame el tiempo que tienes de experiencia en general',
        {
            capture: true
        },
        async (ctx, { flowDynamic, state, endFlow }) => {
            await state.update({ experience: ctx.body })

            if (ctx.body.toUpperCase() !== 'NO') {
                await flowDynamic(`Muchas gracias por indicarme el tiempo de experiencia que tienes😊`)
            } else {
                return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
            }
        }
    )
    .addAnswer('continuemos ya falta poco, ¿Me podrias decir por favor, como te sientes más comodo a la hora de trabajar? ("Trabajo presencial o trabajo remoto")',
        {
            capture: true,
            buttons: [
                { body: 'Presencial' },
                { body: 'Remoto' }
            ]
        },
        async (ctx, { flowDynamic, state, endFlow }) => {
            await state.update({ availability: ctx.body })
            const myState = state.getMyState()

            if (ctx.body.toUpperCase() !== 'NO') {
                await flowDynamic(`Gracias por tu respuesta ${myState.name} 😁`)
            } else {
                return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
            }
        }
    )
    /*.addAnswer('¿Podrías indicarme la region en la que vives', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
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
    })*/
    .addAnswer(`a continuación puedes adjuntar tu CV en los siguientes formatos. (PDF)`,
        {
            capture: true
        },
        async (ctx, { flowDynamic, state, endFlow, fallBack }) => {
            await state.update({ cv: ctx.body })
            const myState = state.getMyState()

            if (ctx.body.toUpperCase() !== 'NO') {
                if (!ctx.body.includes('_event_document')) {
                    return fallBack('Recuerda que debes enviar un documento PDF')
                }
                await flowDynamic(`Felicidades si llegaste a este paso ${myState.name} tus datos son:\n nombre: ${myState.name} \n talentos: ${myState.talents} \n experiencia: ${myState.experience} \n Disponibilidad: ${myState.availability}`)
                let data = null

                //Llamada a la api externa, para guardar todos los datos
                const myHeaders = new Headers();
                myHeaders.append("Authorization", process.env.JWTAPI);
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                const urlencoded = new URLSearchParams();
                urlencoded.append("name", myState.name);
                urlencoded.append("talents", myState.talents);
                urlencoded.append("experience", myState.experience);
                urlencoded.append("availability", myState.availability);

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: "follow"
                };

                try {
                    const response = await fetch('http://localhost:3000/api/user/save-form', requestOptions)
                    data = await response.json()

                    console.log(data)

                } catch (error) {
                    console.log(error.message)
                }


                //Funcion para guardar archivo enviado por WPP
                const url = ctx.url
                const token = process.env.jwtToken
                const destino = `${process.cwd()}/tmp/pdfs/filePdf-${Date.now()}.pdf`
                await state.update({ path: destino })

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
                    })

                    //Llamar api externa para guardar CV PDF
                    const id = data.form._id
                    const myHeadersFile = new Headers();
                    myHeadersFile.append("Authorization", process.env.JWTAPI);
                    await state.update({ id: id }) 

                    const formdataFile = new FormData();
                    const filePath = destino
                    const fileStream = fs.createReadStream(filePath);

                    formdataFile.append('file0', fileStream, 'archivo.pdf')

                    const requestOptionsFile = {
                        method: "POST",
                        headers: myHeadersFile,
                        body: formdataFile,
                        redirect: "follow"
                    };

                    const responseFile = await fetch(`http://localhost:3000/api/user/upload-cv/${id}`, requestOptionsFile)
                    const dataFile = await responseFile.json()

                    console.log(dataFile)


                } catch (error) {
                    console.error('Error:', error)
                }
            } else {
                return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
            }

        }
    )
    .addAnswer('Ya tengo todos tus datos para el proceso de selección, muchas gracias👌')
    .addAnswer('Si quieres recibir un feedback de tu CV, presiona *Feedback*, si quieres ver las vacantes relacionadas con tus talentos, presiona *Vacantes*.',
        {
            buttons: [{ body: 'Feedback' }, { body: 'Vacantes' }]
        }, [feedFlow, vacantsFlow]
    )

export {
    processFlow,
}