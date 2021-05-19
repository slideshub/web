import Auth from "./auth/Auth.js"
import Login from "./login/login.js"
import PresentationEdit from "./presentation-edit/presentation-edit.js"
import Presentation from "./presentation/presentation.js"
import Presentations from "./presentations/presentations.js"
import Signup from "./signup/signup.js"

/**
 * Contiene las que son válidas en la aplicación, y los componentes que renderizan la ruta
 */
const routes = {
    'login': Login,
    'signup': Signup,
    'presentations': Presentations,
    'presentation': Presentation,
    'presentation/edit': PresentationEdit
}

/**
 * Contiene las funcionalidades para manejar el enrutamiento de la página (SPA)
 */
export default class Router {

    /**
     * Ruta actual después del # y sin los querys
     */
    static get route() {
        return location.hash.slice(2).split("?")[0]
    }

    /**
     * Obtiene un objeto con los querys o parámetros de la ruta actual
     */
    static get query() {
        const text = location.hash.slice(2).split("?")[1]
        let object = {}
        if (text) {
            let result = text.split("&")

            result = result.map(value => value.split("="))


            result.map(value => object[value[0]] = value[1])
        }

        return object
    }

    /**
     * Configura la ruta inicial, si no existe y configura el event listener para que cada vez que cambie el hash, se cargue la ruta correctamente
     */
    static initialConfig() {
        if (location.hash == "")
            location.assign("./#/presentations")

        Router.loadRoute()
        window.addEventListener("hashchange", Router.loadRoute)
    }

    /**
     * Renderiza el componente de la nueva ruta en el root (html)
     */
    static async loadRoute() {
        if(routes[Router.route] === undefined){
            Router.goTo('presentations')
            return
        }
        const loggedUser = await Auth.getUser()
        if(!loggedUser) {
            Auth.isLogged = false
        }
        else{
            Auth.isLogged = true
        }
        if (!loggedUser && Router.route === 'presentation/edit')
            Router.goTo("presentations")
        else {
            Auth.loggedUser = loggedUser
            const node = await (new routes[Router.route](Router.query)).render()
            if(node !== null){
                document.getElementById('root').innerHTML = ""
                document.getElementById('root').appendChild(node)
            }
        }
    }

    /**
     * redirije a una nueva ruta definida en los parámetros
     * @param {*} route Contiene la ruta
     * @param {*} querys Es un objeto con las querys que se quiere que vayan en la ruta
     */
    static goTo(route, querys) {
        if (!querys)
            location.hash = `#/${route}`
        else {
            location.hash = `#/${route}?${Object.entries(querys).map(value => value.join("=")).join("&")}`
        }
    }
}