import Router from "../router.js";
import AuthAPI from "./AuthAPI.js";

export default class Auth {

    static async isLogged(){
        const response = await AuthAPI.getLoggedUser()
        if(response.ok){
            response.json().then(v => console.log(v))
            return true
        }
        else{
            return false
        }
    }

    static async logout(){
        await AuthAPI.logout()
        Router.goTo('login')
    }

}

window.isLogged = Auth.isLogged