import Component from "../common/Component.js"
import TemplatesManager from "../common/TemplatesManager.js"
import Router from "../router.js"
import AuthAPI from "../auth/AuthAPI.js"
import Toast from "../common/Toast.js"


export default class Signup extends Component {

    constructor(querys) {
        super()

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        loading.setAttribute("active", "true")
        e.preventDefault()
        e.stopPropagation()


        AuthAPI.signup(name_input.value, email_input.value, password_input.value).then(
            response => {
                if (response.ok) {
                    Toast.open("Se ha registrado el usuario!", 'success')
                }
                else if (response.status == 400) {
                    Toast.open("Error al crear el usuario", 'error')
                }
                else {
                    Toast.open("Error al conectarse con el servidor", 'error')
                }
                loading.setAttribute("active", "false")
            }
        )
    }


    async render() {
        title.innerHTML = "Registro - Slideshub"

        const node = await TemplatesManager.get('signup/signup')

        node.querySelector("#signup_form").addEventListener("submit", this.onSubmit)

        return node
    }
}