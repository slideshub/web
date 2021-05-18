import Auth from "../auth/Auth.js";
import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js";
import Toast from "../common/Toast.js";
import PresentationsAPI from "../presentations/presentationsAPI.js";
import Router from "../router.js";
import Slide from "../slide/slide.js";


export default class PresentationEdit extends Component {

    node = null

    id = null

    presentation = null

    slides = []

    current_slide_id = null

    constructor(querys) {
        super()
        this.id = querys.id
    }

    async getPresentation() {
        this.presentation = await PresentationsAPI.getPresentation(this.id)

        console.log(this.presentation)
    }

    async configLogout() {
        this.node.querySelector("#logout").addEventListener('click', () => Auth.logout())
    }

    configureAddEventListener() {
        this.node.querySelector("#slides_add_new").addEventListener('click', this.addSlide.bind(this))
    }

    async addSlide() {
        const response = await PresentationsAPI.createSlide(this.id)
        if (response.ok) {
            const slide = await response.json()
            this.renderSlides().then(() =>
                this.chargeSlide(slide.id, slide)
            )
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }
    }

    async chargeSlide(slide_id = null, slide = null) {
        console.log(slide_id)
        if (!slide_id && this.slides.length > 0) {
            slide_id = this.slides[0].id
        }

        if (slide_id) {
            let slideItems = this.node.querySelectorAll(".slides-list-item")
            slideItems.forEach(slideItem =>
                slideItem.getAttribute('data-id') == slide_id ? slideItem.classList.add("active") : slideItem.classList.remove("active"))

            this.current_slide_id = slide_id
            const container = this.node.querySelector('#slide_container')
            container.innerHTML = ''
            container.appendChild(await (new Slide({ slide_id, slide, presentation_id: this.id, refresh: this.refreshSlides.bind(this) })).render())
        }
    }

    async refreshSlides(focus_on_id) {
        await this.renderSlides()
        let slideItems = this.node.querySelectorAll(".slides-list-item")
        slideItems.forEach(slideItem =>
            slideItem.getAttribute('data-id') == focus_on_id ? slideItem.classList.add("active") : slideItem.classList.remove("active"))

        this.current_slide_id = focus_on_id
    }

    async renderSlides() {
        this.slides = await PresentationsAPI.getPresentationSlides(this.id)
        if (this.slides) {

            const container = this.node.querySelector('#slides_list_container')
            container.innerHTML = ''

            if (this.slides.length > 0) {
                for (const item of this.slides) {
                    const child = await TemplatesManager.get('presentation-edit/presentation-edit-slide-item', item)
                    if (item.nombre) {
                        const nameTag = document.createElement("div")
                        nameTag.innerHTML = item.nombre
                        nameTag.classList.add("slides-list-item-name")
                        child.children[0].appendChild(nameTag)
                    }
                    child.addEventListener('click', this.chargeSlide.bind(this, item.id, item))
                    container.appendChild(child)
                }
            }
            else {
                container.innerHTML = "<div style='padding: 20px; text-align: center; color: gray'>No tienes diapositivas todavía</div>"
            }
        }
    }

    async render() {
        loading.setAttribute("active", "true")
        await this.getPresentation()
        if (this.presentation) {

            title.innerHTML = `${this.presentation.nombre} - Slideshub`

            let vars = {}
            vars.presentation = this.presentation

            this.node = await TemplatesManager.get('presentation-edit/presentation-edit', vars)

            this.renderSlides().then(i => this.chargeSlide())
            this.configureAddEventListener()
            this.configLogout()

            loading.setAttribute("active", "false")
            return this.node;
        }
        loading.setAttribute("active", "false")
        return null
    }
}