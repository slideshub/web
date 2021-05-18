import Router from "../router.js";
import AuthAPI from "./AuthAPI.js";

export default class Auth {

    static loggedUser = null;

    static isLogged = false;

    static async getUser(){
        const response = await AuthAPI.getLoggedUser()
        if(response.ok){
            return await response.json()
        }
        else{
            return undefined
        }
    }

    static async logout(){
        Auth.loggedUser = undefined
        Auth.isLogged = false
        await AuthAPI.logout()
        Router.goTo('login')
    }

}

window.isLogged = Auth.isLogged