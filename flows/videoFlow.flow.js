import { addKeyword } from '@builderbot/bot'
import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

const videoFlow = addKeyword('si')
.addAnswer('Envianos un video de 30 segundos, haciendo una breve peresentación sobre ti 😁, recuerda que debe ser en formato .mp4', { capture: true },
    async  (ctx, { flowDynamic, fallBack, state }) => {

        const myState = state.getMyState()

        if (ctx.type !== 'video') {
            return fallBack('Recuerda que debes enviar un video formato mp4')
        }

        await flowDynamic('Muchas gracias por llegar hasta aqui 😁 ya completaste tu proceso de registro, felicitaciones')

        const url = ctx.url
        const token = process.env.jwtToken
        const destino = `${process.cwd()}/tmp/videos/video-${Date.now()}.mp4`
        await state.update({ pathVideo: destino })

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

            //Llamar api externa para guardar el video
            const id = myState.id
            const myHeadersFile = new Headers();
            myHeadersFile.append("Authorization", process.env.JWTAPI);

            const formdataFile = new FormData();
            const filePath = destino
            const fileStream = fs.createReadStream(filePath);

            formdataFile.append('file0', fileStream, 'archivo.mp4')

            const requestOptionsFile = {
                method: "POST",
                headers: myHeadersFile,
                body: formdataFile,
                redirect: "follow"
            };

            const responseFile = await fetch(`https://dashboard-ofrecetutalento.com:3100/api/user/upload-video/${id}`, requestOptionsFile)
            const dataFile = await responseFile.json()

            console.log(dataFile)


        } catch (error) {
            console.error('Error:', error)
        }

    }
)

export {
    videoFlow
} 