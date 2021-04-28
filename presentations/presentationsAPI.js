

export default class PresentationsAPI {

    static module = "presentation"

    static async getPresentations(quantity) {
        return [...Array(quantity).keys()].map(i =>
        ({
            id: i,
            nombre: `Presentación ${i}`,
            id_usuario: JSON.parse(sessionStorage.getItem('u')).id,
            publico: true
        }))
    }

    static async getMyPresentations(quantity){
        const id_user = JSON.parse(sessionStorage.getItem('u')).id

        return [...Array(quantity).keys()].map(i =>
            ({
                id: i,
                nombre: `Mi presentación ${i}`,
                id_usuario: JSON.parse(sessionStorage.getItem('u')).id,
                publico: true
            }))
    }
}