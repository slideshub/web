import Auth from "../auth/Auth.js";
import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js";
import Toast from "../common/Toast.js";
import Router from "../router.js";
import PresentationsAPI from "./presentationsAPI.js";


export default class Presentations extends Component {

    myPresentations = []

    publicPresentations = []

    node = null

    constructor(querys) {
        super()
    }

    async configLogout() {
        this.node.querySelector("#logout").addEventListener('click', () => Auth.logout())
    }

    async getPresentations(quantity, filter) {
        const container = this.node.querySelector('#public_presentation_items_container')
        container.innerHTML = `<div class="presentation_item loading"></div>
        <div class="presentation_item loading"></div>
        <div class="presentation_item loading"></div>
        <div class="presentation_item loading"></div>`
        const response2 = await PresentationsAPI.getPresentations(quantity, filter)
        container.innerHTML = ''
        if (response2.ok) {
            this.publicPresentations = await response2.json()


            if (this.publicPresentations.length > 0) {

                this.publicPresentations.forEach(item => {
                    TemplatesManager.get('presentations/presentation_item', item).then(async child => {
                        if (Auth.isLogged && item.id_usuario == Auth.loggedUser.id) {
                            const editButton = document.createElement('button')
                            editButton.innerHTML = "<i class='far fa-edit'></i>Editar"
                            editButton.addEventListener('click', () => Router.goTo('presentation/edit', { id: item.id }))

                            child.querySelector('.presentation_item-button-container').appendChild(editButton)
                        }


                        const presentButton = document.createElement('button')
                        presentButton.innerHTML = "<i class='fas fa-play'></i>Presentar"
                        presentButton.addEventListener('click',
                            () => Router.goTo('presentation', { id: item.id }))

                        child.querySelector('.presentation_item-button-container').appendChild(presentButton)

                        container.appendChild(child)
                    })
                })
            }
            else {
                container.innerHTML = "No existen presentaciones públicas todavía"
            }
        }
        else {
            Toast.open("Error al obtener las presentaciones públicas", 'error')
        }
    }

    async getMyPresentations(quantity, filter) {
        if (Auth.isLogged) {
            const container = this.node.querySelector('#my_presentation_items_container')
            container.innerHTML = `<div class="presentation_item loading"></div>
            <div class="presentation_item loading"></div>
            <div class="presentation_item loading"></div>
            <div class="presentation_item loading"></div>`
            const response = await PresentationsAPI.getMyPresentations(quantity, filter)
            container.innerHTML = ''
            if (response.ok) {
                this.myPresentations = await response.json()



                if (this.myPresentations.length > 0) {

                    this.myPresentations.forEach(item => {
                        TemplatesManager.get('presentations/presentation_item', item).then(child => {
                            const editButton = document.createElement('button')
                            editButton.innerHTML = "<i class='far fa-edit'></i>Editar"
                            editButton.addEventListener('click', () => Router.goTo('presentation/edit', { id: item.id }))

                            const presentButton = document.createElement('button')
                            presentButton.innerHTML = "<i class='fas fa-play'></i>Presentar"
                            presentButton.addEventListener('click',
                                () => Router.goTo('presentation', { id: item.id }))

                            child.querySelector('.presentation_item-button-container').appendChild(editButton)
                            child.querySelector('.presentation_item-button-container').appendChild(presentButton)

                            container.appendChild(child)
                        })
                    })
                }
                else {
                    container.innerHTML = "No tienes presentaciones todavía"
                }
            }
        }
        else {
            this.node.querySelector('#myPresentationsContained').innerHTML = ''
        }


    }

    configureAddEventListener() {
        if (Auth.isLogged) {

            const button = this.node.querySelector('#addNewPresentation')

            button.addEventListener('click', (e) => {
                e.stopPropagation()
                button.setAttribute('active', 'true')
            })

            this.node.addEventListener('click', () => {
                button.setAttribute('active', 'false')
            })

            const form = this.node.querySelector('#addNewPresentationForm')

            form.addEventListener('submit', (e) => {
                e.preventDefault()
                e.stopPropagation()

                PresentationsAPI.create(
                    new_presentation_name.value,
                    new_presentation_public.checked
                ).then(
                    async response => {
                        if (response.ok) {
                            this.getPresentations()
                            console.log("Se ha creado la presentación")
                            Toast.open("Se ha creado la presentación", 'success')
                            new_presentation_name.value = ''
                            new_presentation_public.checked = false
                            this.node.click()
                        }
                        else {
                            console.log(await response.json())
                            Toast.open("Ocurrió un error al crear la presentación", 'error')
                            alert("Error al crear presentación")
                        }
                    }
                )
            })

            this.node.querySelector("#input_filter_my_presentations").addEventListener("change", ((e) => {
                this.getMyPresentations(4, e.target.value)
            }).bind(this))
        }

        this.node.querySelector("#input_filter_presentations").addEventListener("change", ((e) => {
            this.getPresentations(12, e.target.value)
        }).bind(this))

    }

    async render() {

        title.innerHTML = "Presentaciones - Slideshub"

        let vars = {}
        vars.toolbar = (await TemplatesManager.get('common/views/toolbar', { actionName: Auth.isLogged ? 'Cerrar sesión' : 'Iniciar sesión' })).outerHTML

        this.node = await TemplatesManager.get('presentations/presentations', vars)

        this.getMyPresentations(4)
        this.getPresentations(12)
        this.configureAddEventListener()
        this.configLogout()

        return this.node;
    }
}