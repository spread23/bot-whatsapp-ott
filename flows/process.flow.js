import { addKeyword } from '@builderbot/bot'
import fetch from 'node-fetch'
import fs from 'fs'
import * as dotenv from 'dotenv'
import FormData from 'form-data'

import { vacantsFlow } from './vacantsFlow.flow.js'
import { sayByeFlow } from './sayByeFlow.js'
import { supermarketFlow } from './supermarketFlow.flow.js'

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
    .addAnswer('¿Podrías indicarme cuales son tus talentos? aqui te muestro un ejemplo: ("Finanzas, Mercadeo, Tecnologia, Manejo de redes"), indicame al menos 4 talentos 😁, separados por: ","(coma)', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
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
    .addAnswer('¿Podrías indicarme tu correo electronico por favor? 😊', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ email: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias ${myState.name} ya tengo tu email 😁`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer('Ahora, indicame el pais en el que vives, por favor 😁', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ country: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias por indicarme tu pais ${myState.name} 👌`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer('Ahora, indicame el distrito en el que vives, por favor 😁', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ city: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias por indicarme tu distrito ${myState.name} 😊`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer('Ahora, indicame el corregimiento en el que vives, por favor 😁', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ region: ctx.body })
        const myState = state.getMyState()

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias por indicarme tu corregimiento ${myState.name}`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
    .addAnswer('¿Cuentas con permiso de trabajo vigente para este pais?', { capture: true, buttons: [{ body: 'Cuento con él' }, { body: 'No' }] }, async (ctx, { flowDynamic, state }) => {
        await state.update({ permission: ctx.body })
        const myState = state.getMyState()

        await flowDynamic(`Gracias tu respuesta ${myState.name} 🙌`)
    })
    .addAnswer('¿Hablas  algún otro idioma, a parte del Español?. Si es así, escribe cual o cuales, en caso de que no hables otro idioma, responde con "ninguno" 👍', { capture: true }, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ languaje: ctx.body })

        if (ctx.body.toUpperCase() !== 'NO') {
            await flowDynamic(`Gracias por tu respuesta 😊`)
        } else {
            return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
        }
    })
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
                console.log(ctx)

                //Llamada a la api externa, para guardar todos los datos
                const myHeaders = new Headers();
                myHeaders.append("Authorization", process.env.JWTAPI);
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                const urlencoded = new URLSearchParams();
                urlencoded.append("name", myState.name);
                urlencoded.append("talents", myState.talents);
                urlencoded.append("experience", myState.experience);
                urlencoded.append("availability", myState.availability);
                urlencoded.append("email", myState.email);
                urlencoded.append("tel", ctx.from);
                urlencoded.append("country", myState.country);
                urlencoded.append("city", myState.city);
                urlencoded.append("region", myState.region);
                urlencoded.append("languaje", myState.languaje);
                urlencoded.append("permission", myState.permission)

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: "follow"
                };

                try {
                    const response = await fetch('https://dashboard-ofrecetutalento.com:3100/api/user/register', requestOptions)
                    data = await response.json()

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
                    console.log(data)
                    const id = data.user._id
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

                    const responseFile = await fetch(`https://dashboard-ofrecetutalento.com:3100/api/user/upload-pdf/${id}`, requestOptionsFile)
                    const dataFile = await responseFile.json()

                    console.log(dataFile)


                } catch (error) {
                    console.error('Error: el error es:', error)
                }
            } else {
                return endFlow('Ok, Escribeme cuando quieras iniciar tu proceso de selección 😊, aca te estaré esperando')
            }

        }
    )
    .addAnswer('Ya tengo todos tus datos para el proceso de selección, muchas gracias👌')
    .addAnswer('Una ultima pregunta, vas a postular a vacantes relacionadas con el area de supermercados? si es así presiona *SUPERMERCADOS* en caso contrario, presiona *OTRO GREMIO*', {capture: true, buttons: [{ body: 'Supermercados' }, { body: 'Otro gremio' }]}, async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body === 'Supermercados') {
            return gotoFlow(supermarketFlow)
        }

        await flowDynamic('Ok 😁, continuemos')
    } )
    .addAnswer('Si quieres ver las vacantes relacionadas con tus talentos, presiona *Vacantes*, Si quieres terminar tu proceso de selección aquí, presiona *Terminar*',
        {
            buttons: [{ body: 'Vacantes' }, { body: 'Terminar' }]
        }, [sayByeFlow, vacantsFlow]
    )

export {
    processFlow,
}