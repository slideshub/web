import Component from "../common/Component.js"
import TemplatesManager from "../common/TemplatesManager.js"
import Router from "../router.js"
import LoginAPI from "./loginAPI.js"


export default class Login extends Component {

    constructor(querys) {
        super()

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        loading.setAttribute("active", "true")
        e.preventDefault()
        e.stopPropagation()


        LoginAPI.login(email_input.value, password_input.value).then(
            response => {
                if (response.ok) {
                    response.json().then(
                        userData => {
                            sessionStorage.setItem('u', JSON.stringify(userData))
                            Router.goTo('presentations')
                        }
                    )
                }
                else if (response.status == 401) {
                    alert("Credenciales inválidas")
                }
                else {
                    alert("Error al conectarse con el servidor")
                }
                loading.setAttribute("active", "false")
            }
        )
    }


    async render() {
        sessionStorage.removeItem('u')
        title.innerHTML = "Login - Slideshub"

        const node = await TemplatesManager.get('login/login', { title: "Mi título bonito" })

        node.querySelector("#login_form").addEventListener("submit", this.onSubmit)

        return node
    }
}