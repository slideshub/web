import Auth from "./auth/Auth.js"
import Login from "./login/login.js"
import Main from "./main/main.js"
import PresentationEdit from "./presentation-edit/presentation-edit.js"
import Presentation from "./presentation/presentation.js"
import Presentations from "./presentations/presentations.js"


const routes = {
    'login': Login,
    'main': Main,
    'presentations': Presentations,
    'presentation': Presentation,
    'presentation/edit': PresentationEdit
}


export default class Router {

    static get route() {
        return location.hash.slice(2).split("?")[0]
    }

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

    static initialConfig() {
        if (location.hash == "")
            location.assign("./#/presentations")

        Router.loadRoute()
        window.addEventListener("hashchange", Router.loadRoute)
    }

    static async loadRoute() {
        const loggedUser = await Auth.getUser()
        if (!loggedUser && Router.route !== 'login')
            Router.goTo("login")
        else {
            Auth.loggedUser = loggedUser
            const node = await (new routes[Router.route](Router.query)).render()
            if(node !== null){
                document.getElementById('root').innerHTML = ""
                document.getElementById('root').appendChild(node)
            }
        }
    }


    static goTo(route, querys) {
        if (!querys)
            location.hash = `#/${route}`
        else {
            location.hash = `#/${route}?${Object.entries(querys).map(value => value.join("=")).join("&")}`
        }
    }
}