import state from "./state.js"
import { uid, formatDate, capitalize, dateToUTC } from "./utils.js"
import api from "./api.js"

const thoughtsUl = document.getElementById("lista-pensamentos")
const emptyMsg = document.getElementById("mensagem-vazia")

const thoughtsUI = {
    createThoughtItem(thought) {
        const li = document.createElement("li")
        li.classList.add("li-pensamento")
        li.dataset.id = thought.id

        li.innerHTML = `
            <img src="./assets/imagens/aspas-azuis.png" alt="ícone de aspas azuis" class="icone-aspas">
            <p class="pensamento-conteudo">${thought.conteudo}</p>
            <p class="pensamento-autoria">${thought.autoria}</p>
            <p class="pensamento-data">${thought.data ? capitalize(formatDate(thought.data)) : ""}</p>
            <div class="icones">
            <button class="botao-favorito">
                    <img src=${thought.favorite ? "./assets/imagens/icone-favorito.png" :
                "./assets/imagens/icone-favorito_outline.png"} alt="Favoritar">
                </button>
                <button class="botao-editar">
                    <img src="./assets/imagens/icone-editar.png" alt="Editar">
                </button>
                <button class="botao-excluir">
                    <img src="./assets/imagens/icone-excluir.png" alt="Excluir">
                </button>
            </div>
        `

        return li
    },

    renderThoughtsList(thoughtsArray) {
        const thoughtsUl = document.getElementById("lista-pensamentos")

        thoughtsUl.innerHTML = ""

        if (!thoughtsArray || thoughtsArray.length === 0) {
            emptyMsg.style.display = "block"
            return
        }

        emptyMsg.style.display = "none"

        thoughtsArray.forEach(thought => {
            const li = thoughtsUI.createThoughtItem(thought)
            thoughtsUl.appendChild(li)
        })
    },

    async addOrEditThought(quoteInput, autorInput, dateInput) {

        const thought = {
            conteudo: quoteInput.value,
            autoria: autorInput.value,
            data: dateToUTC(dateInput.value),
            id: state.getIsEditing() ? state.getID() : uid(),
            favorite: false
        }

        if (thought.conteudo.trim() === "" || thought.autoria.trim() === "") {
            alert("Você precisa preencher os campos de Pensamento e Autor.")
            return
        }

        if (thought.conteudo.length < 3) {
            alert("Escreva o pensamento.")
            return
        }

        try {
            if (state.getIsEditing()) {
                this.editThought(thought)
                await api.updateThought(thought)
            } else {
                this.addThought(thought)
                await api.createThought(thought)
            }
        } catch (error) {
            console.error("Erro ao criar ou editar pensamento.\nTente novamente depois.", error)
        }


        state.reset()
        thoughtsUI.clearForm(quoteInput, autorInput, dateInput)

    },

    addThought(thought) {
        const li = this.createThoughtItem(thought)
        thoughtsUl.appendChild(li)
    },

    editThought(thought) {
        const li = thoughtsUl.querySelector(`li[data-id="${thought.id}"]`)
        li.querySelector(".pensamento-conteudo").textContent = thought.conteudo
        li.querySelector(".pensamento-autoria").textContent = thought.autoria
        li.querySelector(".pensamento-data").textContent = thought.data
    },

    deleteThought(id) {
        thoughtsUl.querySelector(`li[data-id="${id}"]`).remove()
    },

    clearForm(quoteInput, autorInput, dateInput) {
        quoteInput.value = ""
        autorInput.value = ""
        dateInput.value = ""
    },

    async showSearchedItems(searchValue) {
        const searchedThoughts = await api.searchThoughs(searchValue.toLowerCase())
        this.renderThoughtsList(searchedThoughts)
    },

    async toggleFavoriteThought(selectedThought, btn) {
        selectedThought.favorite = !selectedThought.favorite

        selectedThought.favorite ? btn.children[0].src = "./assets/imagens/icone-favorito.png" :
            btn.children[0].src = "./assets/imagens/icone-favorito_outline.png"

        await api.updateFavorite(selectedThought.id, selectedThought.favorite)
    },

    formatDateString(date) {
        return date.slice(0, 10)
    }
}

export default thoughtsUI

