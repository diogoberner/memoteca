import api from "./api.js"
import state from "./state.js"
import thoughtsUI from "./thoughtsUI.js";
import { debounce } from "./utils.js";

const form = document.getElementById("pensamento-form")
const quoteInput = document.getElementById("pensamento-conteudo")
const autorInput = document.getElementById("pensamento-autoria")
const thoughtsUL = document.getElementById("lista-pensamentos")
const cancelBtn = document.getElementById("botao-cancelar")
const saveBtn = document.getElementById("botao-salvar")
const searchInput = document.getElementById("campo-busca")

let thoughtsArray = []

try {
    thoughtsArray = await api.getThoughts()
    thoughtsUI.renderThoughtsList(thoughtsArray)
} catch (error) {
    console.error("Erro ao carregar pensamentos: ", error)
}

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    thoughtsUI.addOrEditThought(quoteInput, autorInput)
    saveBtn.textContent = "Adicionar"
})

thoughtsUL.addEventListener("click", async (e) => {
    const btn = e.target.closest("button")

    if (!btn) return

    const li = btn.closest("li")
    const id = li.dataset.id

    if (btn.classList.contains("botao-excluir")) {
        api.deleteThought(id)
        thoughtsUI.deleteThought(id)
    }

    if (btn.classList.contains("botao-editar")) {
        const thought = thoughtsArray.find(thought => thought.id === id)

        if (thought) {
            quoteInput.value = thought.conteudo
            autorInput.value = thought.autoria
            saveBtn.textContent = "Salvar"
            state.setIsEditing(true)
            state.setID(id)
            quoteInput.focus()
        } else {
            console.error(`Pensamento com ID ${id} não encontrado.`)
        }
    }

    if (btn.classList.contains("botao-favorito")) {
        const favoriteThought = thoughtsArray.find((t) => t.id === id)
        thoughtsUI.toggleFavoriteThought(favoriteThought, btn)
    }
})

cancelBtn.addEventListener("click", () => {
    state.reset()
    thoughtsUI.clearForm(quoteInput, autorInput)
    saveBtn.textContent = "Adicionar"
})

searchInput.addEventListener("input", debounce((e) => {
    e.preventDefault()

    const searchValue = e.target.value.trim()
    thoughtsUI.showSearchedItems(searchValue)
}, 500))

