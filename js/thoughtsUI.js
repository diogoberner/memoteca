import state from "./state.js"
import uid from "./generateID.js"
import api from "./api.js"

const thoughtsUL = document.getElementById("lista-pensamentos")

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
            thoughtsUl.innerHTML = `<p class="mensagem-vazia">Nenhum pensamento encontrado.</p>`
            return
        }

        thoughtsArray.forEach(thought => {
            const li = thoughtsUI.createThoughtItem(thought)
            thoughtsUl.appendChild(li)
        })
    },

    async addOrEditThought(quoteInput, autorInput) {

        const thought = {
            conteudo: quoteInput.value,
            autoria: autorInput.value,
            id: uid()
        }

        if (thought.conteudo.trim() === "" || thought.autoria.trim() === "") {
            alert("Você precisa preencher os campos de Pensamento e Autor.")
            return
        }

        if (thought.conteudo.length < 3) {
            alert("Escreva o pensamento.")
            return
        }

        if (state.getIsEditing()) {
            await api.updateThought(state.getID(), quote, autor)
        } else {
            await api.createThought(thought)
            const li = this.createThoughtItem(thought)
            this.addThought(li)
        }

        state.reset()
        thoughtsUI.clearForm(quoteInput, autorInput)

    },

    addThought(li) {
        thoughtsUL.appendChild(li)
    },

    clearForm(quoteInput, autorInput) {
        quoteInput.value = ""
        autorInput.value = ""
    }

}

export default thoughtsUI
