const BASE_URL = "http://localhost:3000/pensamentos"

const api = {
    async getThoughts(id) {
        return id ? await this.fetchData(BASE_URL + `/${id}`) : await this.fetchData(BASE_URL)
    },

    async createThought(thought) {
        const opt = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(thought)
        }

        this.fetchData(BASE_URL, opt)
    },

    async deleteThought(id) {
        const opt = {
            method: "DELETE"
        }
        const url = BASE_URL + `/${id}`
        this.fetchData(url, opt)
    },

    async updateThought(thought) {

        const url = BASE_URL + `/${thought.id}`
        const opt = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(thought)
        }
        this.fetchData(url, opt)
    },

    async fetchData(url, options) {
        try {
            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            const method = options.method || "GET"
            console.error(`Erro ao fazer a requisição ${method} para a url: ${url}: ${error.message}`)
            return null
        }
    }
}

export default api