import APIUtils from "../common/APIUtils.js"
import { API_URL } from "../env.js"


export default class LoginAPI {

    static module = "auth"

    static login(email, password) {
        const body = {email, password}

        return APIUtils.POST(`${API_URL}/${LoginAPI.module}/login`, body)
    }
}