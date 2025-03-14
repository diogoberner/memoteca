const BASE_URL = "http://localhost:3000/pensamentos"

const api = {
    async getThoughts(id) {
        const data = await this.fetchData(BASE_URL + (id ? `/${id}` : ""))
        return data ?? []
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
        return await this.fetchData(url, opt)
    },

    async searchThoughs(input) {
        try {
            const thoughtsArray = await this.getThoughts()
            return thoughtsArray.filter((thought) => thought.conteudo.toLowerCase().includes(input) ||
                thought.autoria.toLowerCase().includes(input))
        } catch (error) {
            console.error("Falha ao buscar pensamentos: ", error.message)
            return []
        }
    },

    async updateFavorite(id, favorite) {
        const url = `${BASE_URL}/${id}`
        const opt = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ favorite })
        }

        return await this.fetchData(url, opt)

    },

    async fetchData(url, options) {
        try {
            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            const method = options ? options.method : "GET"
            console.error(`Erro ao fazer a requisição ${method} para a url: ${url}: ${error.message}`)
            return null
        }
    }
}

export default api