import APIUtils from "../common/APIUtils.js"
import Toast from "../common/Toast.js"
import { API_URL } from "../env.js"
import Router from "../router.js"


export default class PresentationsAPI {

    static loadedPresentations = []

    static module = "presentations"

    static async getPresentations(quantity = 0) {
        return APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/`, {mine: false, quantity})
    }
    
    static async getMyPresentations(quantity = 0){
        return APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/`, {mine: true, quantity})
    }

    static async create(name, publicB) {
        return APIUtils.POST(`${API_URL}/${PresentationsAPI.module}/`, {name, public: String(publicB)})
    }

    static async getPresentation(id = 0, refresh) {
        if(!refresh){
            const loaded = PresentationsAPI.loadedPresentations.find(presentation => id == presentation.id)
            if(loaded){
                return loaded
            }
        }
        const response = await APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/${id}`)

        if(response.ok){
            let presentation = await response.json()
            PresentationsAPI.loadedPresentations.push(presentation)
            return presentation
        }
        else if (response.status == 404){
            Toast.open((await response.json()).message, 'error')
            Router.goTo('presentations')
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }

        return undefined
    }

    static async getPresentationSlides(id = 0) {
        const response = await APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/${id}/slides`)

        if(response.ok){
            let presentation = await response.json()
            PresentationsAPI.loadedPresentations.push(presentation)
            return presentation
        }
        else if (response.status == 404){
            Toast.open((await response.json()).message, 'error')
            Router.goTo('presentations')
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }

        return undefined
    }
}