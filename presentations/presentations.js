import Auth from "../auth/Auth.js";
import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js";
import PresentationsAPI from "./presentationsAPI.js";


export default class Presentations extends Component {

    myPresentations = []

    publicPresentations = []

    constructor(querys){
        super()
    }

    async configLogout(node){
        node.querySelector("#logout").addEventListener('click', ()=> Auth.logout())
    }

    async getPresentations(){
        this.myPresentations = await PresentationsAPI.getMyPresentations(8)
        this.publicPresentations = await PresentationsAPI.getPresentations(8)
    }

    configureAddEventListener(node){
        const button = node.querySelector('#addNewPresentation')

        button.addEventListener('click', (e)=> {
            e.stopPropagation()
            button.setAttribute('active', 'true')
        })

        node.addEventListener('click', ()=> {
            button.setAttribute('active', 'false')
        })

        const form = node.querySelector('#addNewPresentationForm')

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            e.stopPropagation()

            console.log(
                new_presentation_name.value,
                new_presentation_public.checked
            )
        })
    }


    async render(){
        await this.getPresentations()
        
        title.innerHTML = "Presentaciones - Slideshub"

        let vars = {}
        vars.toolbar = (await TemplatesManager.get('common/views/toolbar')).outerHTML

        const node = await TemplatesManager.get('presentations/presentations', vars)

        this.publicPresentations.forEach(item => {
            TemplatesManager.get('presentations/presentation_item', item).then(child => {
                node.querySelector('#public_presentation_items_container').appendChild(child)
            })
        })

        this.myPresentations.forEach(item => {
            TemplatesManager.get('presentations/presentation_item', item).then(child => {
                node.querySelector('#my_presentation_items_container').appendChild(child)
            })
        })

        this.configureAddEventListener(node)
        this.configLogout(node)

        return node;
    }
}