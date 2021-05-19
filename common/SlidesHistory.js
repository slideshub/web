

/**
 * Contiene el historial de la reproducción de las diferentes presentaciónes
 * Funciona por medio de hilos, cada hilo es el id de la presentación inicial de una reproducción
 */
export default class SlidesHistory {


    static getPresentationSlide(id) {
        if (SlidesHistory.presentations[String(id)] != undefined && SlidesHistory.presentations[String(id)] != []) {
            return SlidesHistory.presentations[String(id)][SlidesHistory.presentations[String(id)].length - 1]
        }
        return undefined
    }

    static setPresentationSlide(id, slide, presentation = id) {
        if (SlidesHistory.presentations[String(id)] == undefined) {
            SlidesHistory.presentations[String(id)] = [{slide, presentation}]
        }
        else {
            SlidesHistory.presentations[String(id)].push({slide, presentation})
        }
    }

    static getPresentationBackSlide(id, pop = false) {
        if (SlidesHistory.presentations[String(id)] != undefined && SlidesHistory.presentations[String(id)].length > 1) {
            if(pop){
                SlidesHistory.presentations[String(id)].pop()
                return SlidesHistory.presentations[String(id)][SlidesHistory.presentations[String(id)].length - 1]
            }
            return SlidesHistory.presentations[String(id)][SlidesHistory.presentations[String(id)].length - 2]
        }
        return undefined
    }

    static restartPresentation(id) {
        SlidesHistory.presentations[String(id)] = []
    }
}

SlidesHistory.presentations = {}

// Cada vez que se refresque o cierre la aplicación guarda la última información del historial
window.addEventListener('beforeunload', (event) => {
    localStorage.setItem('slidesHistory', JSON.stringify(SlidesHistory.presentations))
})

// Cada vez que se cargue la aplicación carga la información del historial que estaba guardada
window.addEventListener('load', () => {
    if (localStorage.getItem('slidesHistory')) {
        SlidesHistory.presentations = JSON.parse(localStorage.getItem('slidesHistory'))
    }
})