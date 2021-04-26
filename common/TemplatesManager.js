let templates = {}

export default class TemplatesManager {

    static async get(name, object = {}) {
        if (templates[name] === undefined) {
            const template = await (await fetch(`./${name}.html`)).text()

            templates[name] = template
        }
        const node = document.createElement('render')

        let text = templates[name]
        if (object)
            text = text.patch(object)

        node.innerHTML = text
        return node
    }
}


let Strings = {
    patch: (function () {
        var regexp = /{([^{]+)}/g;

        return (str, o) => str.replace(regexp, (ignore, key) => eval(`o.${key}`))
    })()
};

String.prototype.patch = function (o) {
    return Strings.patch(this, o);
}