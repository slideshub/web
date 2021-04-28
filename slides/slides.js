import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js"


export default class Slides extends Component {

    slides = []

    constructor(query){
        super()
    }

    getSlides(){

    }

    async render() {
        const node = await TemplatesManager.get('slides/slides')

        return node;
    }

}