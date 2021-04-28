
export default class Auth {

    static get logged(){
        return sessionStorage.getItem('u') !== null
    }
}