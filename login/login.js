import Component from "../common/Component.js"
import TemplatesManager from "../common/TemplatesManager.js"
import Router from "../router.js"
import AuthAPI from "../auth/AuthAPI.js"
import Toast from "../common/Toast.js"
import Auth from "../auth/Auth.js"


/**
 * Componente que renderiza y controla la vista del login
 */
export default class Login extends Component {

    constructor(querys) {
        super()

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        loading.setAttribute("active", "true")
        e.preventDefault()
        e.stopPropagation()


        AuthAPI.login(email_input.value, password_input.value).then(
            response => {
                if (response.ok) {
                    response.json().then(
                        userData => {
                            Auth.loggedUser = userData
                            Router.goTo('presentations')
                        }
                    )
                }
                else if (response.status == 401) {
                    Toast.open("Credenciales inválidas", 'error')
                }
                else {
                    Toast.open("Error al conectarse con el servidor", 'error')
                }
                loading.setAttribute("active", "false")
            }
        )
    }


    async render() {
        Auth.logout()
        sessionStorage.removeItem('u')
        title.innerHTML = "Login - Slideshub"

        const node = await TemplatesManager.get('login/login')

        node.querySelector("#login_form").addEventListener("submit", this.onSubmit)

        return node
    }
}