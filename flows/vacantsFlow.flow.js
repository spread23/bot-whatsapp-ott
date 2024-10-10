import { addKeyword } from '@builderbot/bot'

const vacantsFlow = addKeyword('vacantes')
    .addAnswer('En unos segundos te mostraremos las vacantes que tenemos para ti...', null, async (ctx, { flowDynamic, state, endFlow }) => {
        await state.update({ name: ctx.body })
        //const myState = state.getMyState()
        //const jobOffers = []
        let data = null

        const myHeaders = new Headers();
        myHeaders.append("Authorization", process.env.JWTAPI);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://dashboard-ofrecetutalento.com:3100/api/offer/get-all-offers", requestOptions)
            data = await response.json()
            //const newOffers = data.offers.filter(offer => offer.area.includes(myState.talents))

            await state.update({ offers: data.offers })

            if (data.offers.length >= 1) {
                // Recorremos el arreglo data.offers
                let ofertasTexto = "Estas son las ofertas para ti:\n";
                data.offers.forEach((oferta, index) => {
                    ofertasTexto += `${index + 1}. ${oferta.title}: ${oferta.description}\n`; // Ajusta los campos a tu estructura de datos
                });

                await flowDynamic(`${ofertasTexto}`)
            } else {
                return endFlow('Lo sentimos en el momento no hay vacantes que se ajusten a tus talentos')
            }


        } catch (error) {
            console.log(error.message)
        }

    })
    .addAnswer(`Si deseas postular a alguna de las vacantes que te haya interesado, lo puedes hacer a través de los numeros,  ejemplo: (1, 2, 7, 9), puedes postular a una o más vacantes 😁`,
        {
            capture: true
        }, async (ctx, { endFlow, state }) => {

            const myState = state.getMyState()
            const idUser = myState.id
            const offers = myState.offers

            const areasClave = ctx.body.split(',').map(area => Number(area.trim()));
            console.log(areasClave)

            //Llamada a la api externa, para guardar todos los datos
            const myHeaders = new Headers();
            myHeaders.append("Authorization", process.env.JWTAPI);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                redirect: "follow"
            };

            try {

                areasClave.map(async (index) => {
                    const idOffer = offers[index - 1]._id
                    const response = await fetch(`https://dashboard-ofrecetutalento.com:3100/api/offer/post-offer/${idOffer}/${idUser}`, requestOptions)
                    const data = await response.json()
                    console.log(data)
                })

            } catch (error) {
                console.log(error.message)
            }

            return endFlow(`Postulaste de manera exitosa a las ofertas!!👌, gracias por enviarnos tus datos y hoja de vida 😁 Le vamos a pasar la información al reclutador y de mantener afinidad, se estarán poniendo en contacto contigo 😊. Muchas gracias por tu paciencia y quedamos a tus ordenes 👌`)
        }
    )

export {
    vacantsFlow
}