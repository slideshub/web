import APIUtils from "../common/APIUtils.js"
import { API_URL } from "../env.js"


export default class SlidesAPI {

    static loadedSlides = []

    static module = "slides"

    static async getSlide(id, refresh = false){
        if(!refresh){
            const loaded = SlidesAPI.loadedSlides.find(slide => id == slide.id)
            if(loaded){
                return loaded
            }
        }
        const response = await APIUtils.GET(`${API_URL}/${SlidesAPI.module}/${id}`)

        if(response.ok){
            let slide = await response.json()
            SlidesAPI.loadedSlides.push(slide)
            slide.detalles = JSON.parse(slide.detalles)
            return slide
        }
        else if (response.status == 404){
            Toast.open((await response.json()).message, 'error')
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }

        return undefined
    }


    static async modifySlide(id, {nombre, detalles}){
        const response = await APIUtils.PATCH(`${API_URL}/${SlidesAPI.module}/${id}`, {nombre, detalles: JSON.stringify(detalles)})

        if(response.ok){
            SlidesAPI.loadedSlides = SlidesAPI.loadedSlides.filter(item => item.id != id)
            let slide = await response.json()
            SlidesAPI.loadedSlides.push(slide)
            return slide
        }
        else if (response.status == 404){
            Toast.open((await response.json()).message, 'error')
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }

        return undefined
    }

    static async getSlideReferences(id){
        const response = await APIUtils.GET(`${API_URL}/${SlidesAPI.module}/${id}/references`)

        if(response.ok){
            return await response.json()
        }
        else if (response.status == 404){
            Toast.open((await response.json()).message, 'error')
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }

        return undefined
    }

    static async addSlideReferences(id, idReference){
        const response = await APIUtils.POST(`${API_URL}/${SlidesAPI.module}/${id}/references/${idReference}`)

        if(response.ok){
            return await response.json()
        }
        else if (response.status == 400){
            Toast.open((await response.json()).message, 'error')
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }

        return undefined
    }

    static async deleteSlideReference(id, idReference){
        const response = await APIUtils.DELETE(`${API_URL}/${SlidesAPI.module}/${id}/references/${idReference}`)

        if(response.ok){
            return await response.json()
        }
        else {
            Toast.open((await response.json()).message, 'error')
        }

        return undefined
    }

}