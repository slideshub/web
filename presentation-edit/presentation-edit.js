import Auth from "../auth/Auth.js";
import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js";
import Toast from "../common/Toast.js";
import PresentationsAPI from "../presentations/presentationsAPI.js";
import Router from "../router.js";


export default class PresentationEdit extends Component {

    node = null

    id = null

    presentation = null

    slides = []

    constructor(querys) {
        super()
        this.id = querys.id
    }

    async getPresentation() {
        this.presentation = await PresentationsAPI.getPresentation(this.id)
    }

    async configLogout() {
        this.node.querySelector("#logout").addEventListener('click', () => Auth.logout())
    }

    async render() {
        loading.setAttribute("active", "true")
        await this.getPresentation()
        if (this.presentation) {

            title.innerHTML = `${this.presentation.nombre} - Slideshub`

            let vars = {}
            vars.presentation = this.presentation

            this.node = await TemplatesManager.get('presentation-edit/presentation-edit', vars)

            //this.configureAddEventListener()
            this.configLogout()

            loading.setAttribute("active", "false")
            return this.node;
        }
        loading.setAttribute("active", "false")
        return null
    }
}