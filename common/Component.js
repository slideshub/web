 export default class Component {

    async render() {

        console.warn(`Render method not overrided for ${this.constructor.name}`)
        const div = document.createElement('div')
        div.innerHTML = `Not view there`

        return div
    }
 }