import APIUtils from "../common/APIUtils.js"
import { API_URL } from "../env.js"


export default class PresentationsAPI {

    static module = "presentation"

    static async getPresentations(quantity = 0) {
        return APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/`, {mine: false, quantity})
    }
    
    static async getMyPresentations(quantity){
        return APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/`, {mine: true, quantity})
    }

    static async create(name, publicB) {
        return APIUtils.POST(`${API_URL}/${PresentationsAPI.module}/`, {name, public: String(publicB)})
    }
}