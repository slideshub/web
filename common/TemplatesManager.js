let templates = {}

export default class TemplatesManager {
    
    static async get(name, object = {}){
        if(templates[name] === undefined){
            const template = await (await fetch(`./${name}/${name}.html`)).text()

            templates[name] = template
        }
        const node = document.createElement('render')
        
        let text = templates[name]
        if(object)
            text = text.patch(object)
        
        node.innerHTML = text
        return node
    }
}