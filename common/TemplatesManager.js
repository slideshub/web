let templates = {}

/**
 * Maneja la obtención de los diferentes archivos HTML del proyecto, guarda los archivos ya obtenidos para automatizar un proceso de
 * repetitivo
 */
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

// Configura una nueva función para los string que parcha un string con un objeto de
// Ejemplo: "{hello} mundo".patch({hello: "hola"}) será igual a "hola mundo"
String.prototype.patch = function (o) {
    return Strings.patch(this, o);
}