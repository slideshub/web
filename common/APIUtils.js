export default class APIUtils {

    static async GET(url, query) {
        let response = undefined
        
        let options = {
            method: 'GET',
            referrerPolicy: 'no-referrer',
            mode: 'cors',
            headers: {}
        }

        try {
            response = await fetch(query ? `${url}?${APIUtils.createQuery(query)}` : url, options)
        } catch (error) {
            return error
        }
        return response
    }

    static async POST(url, body) {
        let options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        let response = undefined;
        try {
            response = await fetch(url, options)
        } catch (error) {
            return error
        }
        return response
    }

    static async PATCH(url, body) {
        let options = {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        let response = undefined;
        try {
            response = await fetch(url, options)
        } catch (error) {
            return error
        }
        return response
    }

    static async DELETE(url, query, auth = true) {
        let response = undefined
        
        let options = {
            method: 'DELETE',
            referrerPolicy: 'no-referrer',
            mode: 'cors',
            headers: {}
        }

        try {
            response = await fetch(query ? `${url}?${APIUtils.createQuery(query)}` : url, options)
        } catch (error) {
            return error
        }
        return response
    }

    static createQuery(json) {
        const query = Object.entries(json).filter((item) => item[1] !== undefined && item[1] !== "" && item[1] !== null).map(item => item.join("=")).join("&")
        return query
    }
}