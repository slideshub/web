

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

window.addEventListener('beforeunload', (event) => {
    localStorage.setItem('slidesHistory', JSON.stringify(SlidesHistory.presentations))
})

window.addEventListener('load', () => {
    console.log(JSON.parse(localStorage.getItem('slidesHistory')))
    if (localStorage.getItem('slidesHistory')) {
        SlidesHistory.presentations = JSON.parse(localStorage.getItem('slidesHistory'))
    }
})