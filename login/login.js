import TemplatesManager from "../common/TemplatesManager.js"
import Router from "../router.js"


export default class Login {

    constructor(querys){
        console.log(querys)


    }


    async render(){

        const node = await TemplatesManager.get('login/login', {title: "Mi título bonito"})

        node.querySelector("#hola").addEventListener("click", ()=> Router.goTo('main'))

        return node
    }
}