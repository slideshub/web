import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js";
import Toast from "../common/Toast.js";
import PresentationsAPI from "../presentations/presentationsAPI.js";
import Router from "../router.js";


export default class Presentation extends Component {

    node = null

    id = null

    presentation = null

    constructor(querys){
        super()
        this.id = querys.id
    }
    
    async getPresentation(){
        this.presentation = await PresentationsAPI.getPresentation(this.id)
    }

    async configLogout(){
        this.node.querySelector("#logout").addEventListener('click', ()=> Auth.logout())
    }
    
    async render(){
        loading.setAttribute("active", "true")
        await this.getPresentation()
        title.innerHTML = `${this.presentation.nombre} - Slideshub`
        
        let vars = {}
        vars.toolbar = (await TemplatesManager.get('common/views/toolbar')).outerHTML
        
        this.node = await TemplatesManager.get('presentation/presentation', vars)
        
        //this.configureAddEventListener()
        this.configLogout()

        loading.setAttribute("active", "false")
        return this.node;
        
        

    }
}