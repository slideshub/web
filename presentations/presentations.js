import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js";
import PresentationsAPI from "./presentationsAPI.js";


export default class Presentations extends Component {

    myPresentations = []

    publicPresentations = []

    constructor(querys){
        super()
    }

    async getPresentations(){
        this.myPresentations = await PresentationsAPI.getMyPresentations(8)
        this.publicPresentations = await PresentationsAPI.getPresentations(8)
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

        return node;
    }
}