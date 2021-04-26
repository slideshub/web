import Component from "../common/Component.js"
import TemplatesManager from "../common/TemplatesManager.js"

export default class Main extends Component {

    constructor(){
        super()
    }


    async render() {
        const node = await TemplatesManager.get('main/main')

        return node
    }
}