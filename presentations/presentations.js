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

    constructor(querys){
        super()
    }

    async configLogout(){
        this.node.querySelector("#logout").addEventListener('click', ()=> Auth.logout())
    }

    async getPresentations(){
        const response = await PresentationsAPI.getMyPresentations(8)
        if(response.ok){
            this.myPresentations = await response.json()

            const container = this.node.querySelector('#my_presentation_items_container')
            container.innerHTML = ''
            
            if(this.myPresentations.length > 0){
                
                this.myPresentations.forEach(item => {
                    TemplatesManager.get('presentations/presentation_item', item).then(child => {
                        child.addEventListener('click', ()=> Router.goTo('presentation/edit', {id: item.id}))
                        container.appendChild(child)
                    })
                })
            }
            else{
                container.innerHTML = "No tienes presentaciones todavía"
            }
        }
        
        const response2 = await PresentationsAPI.getPresentations(8)
        if(response2.ok){
            this.publicPresentations = await response2.json()

            const container = this.node.querySelector('#public_presentation_items_container')
            container.innerHTML = ''

            if(this.publicPresentations.length > 0){

                this.publicPresentations.forEach(item => {
                    TemplatesManager.get('presentations/presentation_item', item).then(child => {
                        child.addEventListener('click', 
                        ()=> Router.goTo(item.id_usuario === Auth.loggedUser.id? 'presentation/edit': 'presentation', {id: item.id}))
                        container.appendChild(child)
                    })
                })
            }
            else{
                container.innerHTML = "No existen presentaciones públicas todavía"
            }
        }
        else{
            Toast.open("Error al obtener las presentaciones públicas", 'error')
        }
    }

    configureAddEventListener(){
        const button = this.node.querySelector('#addNewPresentation')

        button.addEventListener('click', (e)=> {
            e.stopPropagation()
            button.setAttribute('active', 'true')
        })

        this.node.addEventListener('click', ()=> {
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
                    if(response.ok){
                        this.getPresentations()
                        console.log("Se ha creado la presentación")
                        Toast.open("Se ha creado la presentación", 'success')
                        new_presentation_name.value = ''
                        new_presentation_public.checked = false
                        this.node.click()
                    }   
                    else{
                        console.log(await response.json())
                        Toast.open("Ocurrió un error al crear la presentación", 'error')
                        alert("Error al crear presentación")
                    }
                }
            )
        })
    }


    async render(){
        
        title.innerHTML = "Presentaciones - Slideshub"
        
        let vars = {}
        vars.toolbar = (await TemplatesManager.get('common/views/toolbar')).outerHTML
        
        this.node = await TemplatesManager.get('presentations/presentations', vars)
        
        this.getPresentations()
        this.configureAddEventListener()
        this.configLogout()

        return this.node;
    }
}