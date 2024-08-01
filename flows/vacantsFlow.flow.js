import { addKeyword } from '@builderbot/bot'

const vacantsFlow = addKeyword('vacantes')
.addAnswer('En unos segundos te mostraremos las vacantes que tenemos para ti')

export {
    vacantsFlow
}