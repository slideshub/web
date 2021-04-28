import Auth from "./auth/Auth.js"
import Login from "./login/login.js"
import Main from "./main/main.js"
import Presentations from "./presentations/presentations.js"
import Slides from "./slides/slides.js"


const routes = {
    'login': Login,
    'main': Main,
    'slides': Slides,
    'presentations': Presentations,
}


export default class Router {

    static get route() {
        return location.hash.slice(2).split("?")[0]
    }

    static get query() {
        const text = location.hash.slice(2).split("?")[1]
        let object = {}
        if(text){
            let result = text.split("&")
            
            result = result.map(value => value.split("="))
            
            
            result.map(value => object[value[0]] = value[1])
        }
        
        return object
    }

    static initialConfig() {
        if (location.hash == "")
            location.assign("./#/presentations")

        if (!Auth.logged)
            Router.goTo("login")
        
        Router.loadRoute().then(
            () => window.addEventListener("hashchange", Router.loadRoute)
        )
    }

    static async loadRoute() {
        const node = new routes[Router.route](Router.query)

        document.getElementById('root').innerHTML = ""
        document.getElementById('root').appendChild(await node.render())
    }


    static goTo(route, querys) {
        if(!querys)
            location.hash = `#/${route}`
        else{
            location.hash = `#/${route}?${Object.entries(querys).map(value => value.join("=")).join("&")}`
        }
    }
}