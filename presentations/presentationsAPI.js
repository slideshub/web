import APIUtils from "../common/APIUtils.js";
import Toast from "../common/Toast.js";
import { API_URL } from "../env.js";
import Router from "../router.js";

export default class PresentationsAPI {
    static loadedPresentations = {};

    static loadedPresentationsSlides = {}

    static module = "presentations";

    static async getPresentations(quantity = 0, filter = "") {
        return APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/`, {
            mine: false,
            quantity,
            filter
        });
    }

    static async getMyPresentations(quantity = 0, filter = "") {
        return APIUtils.GET(`${API_URL}/${PresentationsAPI.module}/`, {
            mine: true,
            quantity,
            filter
        });
    }

    static async create(name, publicB) {
        return APIUtils.POST(`${API_URL}/${PresentationsAPI.module}/`, {
            name,
            public: String(publicB),
        });
    }

    static async getPresentation(id = 0, refresh) {
        if (!refresh && PresentationsAPI.loadedPresentations[String(id)] != undefined) {
            return PresentationsAPI.loadedPresentations[String(id)];
        }
        const response = await APIUtils.GET(
            `${API_URL}/${PresentationsAPI.module}/${id}`
        );

        if (response.ok) {
            let presentation = await response.json();
            PresentationsAPI.loadedPresentations[String(id)] = presentation;
            return presentation;
        } else if (response.status == 404) {
            Toast.open((await response.json()).message, "error");
            Router.goTo("presentations");
        } else {
            Toast.open((await response.json()).message, "error");
        }

        return undefined;
    }

    static async getPresentationSlides(id = 0, refresh = true) {
        if (!refresh && PresentationsAPI.loadedPresentationsSlides[String(id)] != undefined) {
            return PresentationsAPI.loadedPresentationsSlides[String(id)];
        }

        const response = await APIUtils.GET(
            `${API_URL}/${PresentationsAPI.module}/${id}/slides`
        );

        if (response.ok) {
            let presentationSlides = await response.json();
            PresentationsAPI.loadedPresentationsSlides[String(id)] = presentationSlides
            presentationSlides.forEach(
                (element) =>
                (element.detalles =
                    element.detalles == null ? {} : JSON.parse(element.detalles))
            );
            return presentationSlides;
        } else if (response.status == 404) {
            Toast.open((await response.json()).message, "error");
        } else {
            Toast.open((await response.json()).message, "error");
        }

        return undefined;
    }

    static async createSlide(id_presentation = 0, name = null) {
        return APIUtils.POST(
            `${API_URL}/${PresentationsAPI.module}/${id_presentation}/slides`,
            { name }
        );
    }
}
