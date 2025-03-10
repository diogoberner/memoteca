import state from "./state.js"
import { uid } from "./utils.js"
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
            <div class="icones">
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

    async addOrEditThought(quoteInput, autorInput) {

        const thought = {
            conteudo: quoteInput.value,
            autoria: autorInput.value,
            id: state.getIsEditing() ? state.getID() : uid()
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
        thoughtsUI.clearForm(quoteInput, autorInput)

    },

    addThought(thought) {
        const li = this.createThoughtItem(thought)
        thoughtsUl.appendChild(li)
    },

    editThought(thought) {
        const li = thoughtsUl.querySelector(`li[data-id="${thought.id}"]`)
        li.querySelector(".pensamento-conteudo").textContent = thought.conteudo
        li.querySelector(".pensamento-autoria").textContent = thought.autoria
    },

    deleteThought(id) {
        thoughtsUl.querySelector(`li[data-id="${id}"]`).remove()
    },

    clearForm(quoteInput, autorInput) {
        quoteInput.value = ""
        autorInput.value = ""
    },

    async showSearchedItems(searchValue) {
        const searchedThoughts = await api.searchThoughs(searchValue.toLowerCase())
        this.renderThoughtsList(searchedThoughts)
    }

}

export default thoughtsUI

