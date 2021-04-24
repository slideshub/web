import Router from "./router.js";

window.addEventListener('load', Router.initialConfig)



function configStringPatch() {
    let Strings = {
        patch: (function () {
            var regexp = /{([^{]+)}/g;

            return (str, o) => str.replace(regexp, (ignore, key) => eval(`o.${key}`))
        })()
    };

    String.prototype.patch = function (o) {
        return Strings.patch(this, o);
    }
}

configStringPatch()

console.log("{hello} {world}".patch({hello: "Hola", world: "Mundo"}))