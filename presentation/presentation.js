import Auth from "../auth/Auth.js";
import Component from "../common/Component.js";
import SlidesHistory from "../common/SlidesHistory.js";
import TemplatesManager from "../common/TemplatesManager.js";
import Toast from "../common/Toast.js";
import PresentationsAPI from "../presentations/presentationsAPI.js";
import Router from "../router.js";
import SlidesAPI from "../slide/slidesAPI.js";
export default class Presentation extends Component {

    node = null

    id = null

    presentation = null

    constructor(querys) {
        super()
        this.id = querys.id
        this.slide_id = querys.slide
        this.presentation_thread = querys.thread || querys.id

        if (querys.restart == 'true') {
            SlidesHistory.restartPresentation(this.presentation_thread)
        }
    }

    async getPresentation() {
        this.presentation = await PresentationsAPI.getPresentation(this.id)
        if(this.presentation == undefined) {
            Router.goTo('presentations')
        }
    }

    async getPresentationSlides() {
        let history = SlidesHistory.getPresentationSlide(this.presentation_thread)
        let presentation_id = this.id
        if (history == undefined) {
            this.presentation.slides = await PresentationsAPI.getPresentationSlides(this.id, false)
            if (this.presentation.slides.length > 0) {
                history = { slide: this.presentation.slides[0].id }
            }
            else {
                Toast.open("Esta presentación no tiene láminas", 'info')
                return
            }
        }
        else {
            presentation_id = history.presentation
        }
        this.goToSlide(presentation_id, history.slide, this.presentation_thread)
    }

    async getSlide() {
        if (this.slide_id == undefined) {
            await this.getPresentationSlides()
            return
        }
        this.slide = await SlidesAPI.getSlide(this.slide_id)

        if (this.slide != undefined) {


            if (SlidesHistory.getPresentationSlide(this.presentation_thread) == undefined
                || (SlidesHistory.getPresentationSlide(this.presentation_thread) != undefined
                    && SlidesHistory.getPresentationSlide(this.presentation_thread).slide != this.slide_id))
                SlidesHistory.setPresentationSlide(this.presentation_thread, this.slide_id, this.id)

            try {
                this.slide.detalles.borde = typeof this.slide.detalles.borde == 'string' ? JSON.parse(this.slide.detalles.borde) : this.slide.detalles.borde
                this.slide.detalles.fondo = typeof this.slide.detalles.fondo == 'string' ? JSON.parse(this.slide.detalles.fondo) : this.slide.detalles.fondo
                this.slide.detalles.contenido = this.slide.detalles.contenido == undefined ? this.slide.detalles.content : this.slide.detalles.contenido
            }
            catch (e) {

            }

            this.chargeSlide(
                this.slide.detalles.tamanno,
                this.slide.detalles.borde,
                this.slide.detalles.fondo,
                this.slide.detalles.contenido)
            this.chargeReferences()
        }
        else {
            Toast.open("La lámina no existe", 'error')
            //Router.goTo('presentations')
        }

        if (this.presentation.slides == undefined) {
            PresentationsAPI.getPresentationSlides(this.id, false).then((response) => this.presentation.slides = response)
        }
    }

    chargeSlide(
        tamanno = "800x600",
        borde = { color: "#0f0f0f", ancho: '5px', redondeo: '10px' },
        fondo = { color: "#ffffff" },
        contenido = "") {
        const slide_container = this.node.querySelector('#presentation_slide')

        slide_container.style.width = tamanno.split('x')[0] + 'px'
        slide_container.style.height = tamanno.split('x')[1] + 'px'

        slide_container.innerHTML = contenido

        slide_container.style.border = 'solid 5px gray'
        slide_container.style.borderWidth = borde.ancho
        slide_container.style.borderColor = borde.color
        slide_container.style.borderRadius = borde.redondeo

        if (fondo.color2 == undefined)
            slide_container.style.backgroundColor = fondo.color
        else
            slide_container.style.background = `linear-gradient(to right, ${borde.color}, ${borde.color2})`

        this.node.querySelector('.button-prev').addEventListener('click', (async () => {
            const prev = SlidesHistory.getPresentationBackSlide(this.presentation_thread, true)
            if (prev != undefined) {
                this.goToSlide(prev.presentation, prev.slide, this.presentation_thread, this.presentation_thread)
            }
            else {
                if (this.presentation.slides == undefined) {
                    this.presentation.slides = await PresentationsAPI.getPresentationSlides(this.id, false)
                }

                if (this.presentation.slides != undefined && this.presentation.slides.length > 2) {
                    const myIndex = this.presentation.slides.findIndex(slide => slide.id == this.slide_id)
                    if (myIndex && myIndex != 0 && this.presentation.slides[myIndex - 1]) {
                        this.goToSlide(this.id, this.presentation.slides[myIndex - 1].id, this.presentation_thread)
                    }
                    else {
                        Toast.open("Inicio de la presentación", 'info')
                    }
                }
                else {
                    Toast.open("No existen láminas anteriores", 'info')
                }
            }
        }).bind(this))

        //PRELOAD NEXT AND PREVIOUS SLIDE

        const precharge = async () => {
            if (this.presentation.slides == undefined) {
                this.presentation.slides = await PresentationsAPI.getPresentationSlides(this.id, false)
            }

            //PREVIOUS
            if (this.presentation.slides != undefined && this.presentation.slides.length > 2) {
                const myIndex = this.presentation.slides.findIndex(slide => slide.id == this.slide_id)
                if (myIndex && myIndex != 0 && this.presentation.slides[myIndex - 1]) {
                    SlidesAPI.getSlide(this.presentation.slides[myIndex - 1].id)
                }
            }

            //NEXT
            if (this.presentation.slides != undefined && this.presentation.slides.length > 2) {
                const myIndex = this.presentation.slides.findIndex(slide => slide.id == this.slide_id)
                if (myIndex != null && myIndex < this.presentation.slides.length - 1 && this.presentation.slides[myIndex + 1]) {
                    SlidesAPI.getSlide(this.presentation.slides[myIndex + 1].id)
                }
            }

        }

        precharge()

        this.node.querySelector('.button-next').addEventListener('click', (async () => {
            if (this.presentation.slides == undefined) {
                this.presentation.slides = await PresentationsAPI.getPresentationSlides(this.id, false)
            }

            if (this.presentation.slides != undefined && this.presentation.slides.length > 2) {
                const myIndex = this.presentation.slides.findIndex(slide => slide.id == this.slide_id)
                if (myIndex != null && myIndex < this.presentation.slides.length - 1 && this.presentation.slides[myIndex + 1]) {
                    this.goToSlide(this.id, this.presentation.slides[myIndex + 1].id, this.presentation_thread)
                }
                else {
                    Toast.open("Final de la presentación", 'info')
                }
            }
            else {
                Toast.open("No existen láminas siguientes", 'info')
            }
        }).bind(this))

    }

    async chargeReferences() {
        if (this.slide.references == undefined)
            this.slide.references = await SlidesAPI.getSlideReferences(this.slide.id)

        const container = this.node.querySelector('.references-container')
        if (this.slide.references.length > 0) {
            this.slide.references.forEach(reference => {
                const a = document.createElement('a')
                PresentationsAPI.getPresentation(reference.id_presentacion_referenciada).then(presentation => {
                    if (!presentation) {
                        Toast.open("Una presentación referenciada no fue encontrada o es inaccesible", 'info')
                        a.classList.add('notfound')
                        a.replaceWith(a.cloneNode(true))
                    }
                })
                SlidesAPI.getSlide(reference.id_lamina_referenciada).then((slide) => {
                    if (!slide) {
                        Toast.open("Una diapositiva referenciada no fue encontrada o es inaccesible", 'info')
                        a.classList.add('notfound')
                        a.replaceWith(a.cloneNode())
                    }
                })   
                a.addEventListener('click', (() => this.goToSlide(reference.id_presentacion_referenciada, reference.id_lamina_referenciada, this.presentation_thread)).bind(this))
                
                a.innerHTML = `${reference.nombre_referencia} | ${reference.nombre_presentacion_referenciada}`
                container.appendChild(a)
            })
        }
        else {
            container.innerHTML = 'No hay hipervículos en esta lámina'
        }
    }

    async configLogout() {
        this.node.querySelector("#logout").addEventListener('click', () => Auth.logout())
    }

    async goToSlide(presentation, slide_id, thread) {
        const slide = await SlidesAPI.getSlide(slide_id)

        const nextSlideContainerClass = this.node.querySelector('.next-presentation-slide')

        try {
            slide.detalles.borde = typeof slide.detalles.borde == 'string' ? JSON.parse(slide.detalles.borde) : slide.detalles.borde
            slide.detalles.fondo = typeof slide.detalles.fondo == 'string' ? JSON.parse(slide.detalles.fondo) : slide.detalles.fondo
            slide.detalles.contenido = slide.detalles.contenido == undefined ? slide.detalles.content : slide.detalles.contenido
        }
        catch (e) {

        }

        this.chargeNextSlideProps(slide.detalles.tamanno, slide.detalles.borde, slide.detalles.fondo, slide.detalles.contenido)

        const transicion = slide.detalles.transicion || 4

        nextSlideContainerClass.classList.add(`transition${transicion}`)
        nextSlideContainerClass.style.zIndex = '2'

        setTimeout(() => Router.goTo(Router.route, { id: presentation, slide: slide_id, thread }), 1000)
    }

    chargeNextSlideProps(tamanno = "800x600",
        borde = { color: "#0f0f0f", ancho: '5px', redondeo: '10px' },
        fondo = { color: "#ffffff" },
        contenido = "") {

        const nextSlideContainer = this.node.querySelector('#next_presentation_slide')

        nextSlideContainer.style.width = tamanno.split('x')[0] + 'px'
        nextSlideContainer.style.height = tamanno.split('x')[1] + 'px'


        nextSlideContainer.innerHTML = contenido

        nextSlideContainer.style.border = 'solid 5px gray'
        nextSlideContainer.style.borderWidth = borde.ancho
        nextSlideContainer.style.borderColor = borde.color
        nextSlideContainer.style.borderRadius = borde.redondeo

        if (fondo.color2 == undefined)
            nextSlideContainer.style.backgroundColor = fondo.color
        else
            nextSlideContainer.style.background = `linear-gradient(to right, ${borde.color}, ${borde.color2})`
    }

    async render() {
        loading.setAttribute("active", "true")
        await this.getPresentation()
        if (this.presentation) {

            title.innerHTML = `${this.presentation.nombre} - Slideshub`

            let vars = { presentation: this.presentation, actionName: Auth.isLogged ? 'Cerrar sesión' : 'Iniciar sesión' }

            this.node = await TemplatesManager.get('presentation/presentation', vars)

            //this.configureAddEventListener()
            this.configLogout()

            await this.getSlide()
            loading.setAttribute("active", "false")

            return this.node;
        }
        loading.setAttribute("active", "false")
        return null
    }
}