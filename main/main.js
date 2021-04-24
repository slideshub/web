import TemplatesManager from "../common/TemplatesManager.js"

export default class Main {


    async render() {
        const node = await TemplatesManager.get('main')

        return node
    }
}