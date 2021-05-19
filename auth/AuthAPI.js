import APIUtils from "../common/APIUtils.js"
import { API_URL } from "../env.js"


/**
 * Contiene funciones para la conexión con el módulo de Auth del API
 */
export default class AuthAPI {

    static module = "auth"

    static login(email, password) {
        const body = {email, password}

        return APIUtils.POST(`${API_URL}/${AuthAPI.module}/login`, body)
    }

    static logout(){
        return APIUtils.POST(`${API_URL}/${AuthAPI.module}/logout`)
    }

    static getLoggedUser(){
        return APIUtils.GET(`${API_URL}/${AuthAPI.module}/`)
    }

    static signup(name, email, password) {
        const body = {name, email, password}

        return APIUtils.POST(`${API_URL}/${AuthAPI.module}/signup`, body)
    }
}