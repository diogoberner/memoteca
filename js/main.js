import api from "./api.js"
import state from "./state.js"
import thoughtsUI from "./thoughtsUI.js";

const form = document.getElementById("pensamento-form")
const quoteInput = document.getElementById("pensamento-conteudo")
const autorInput = document.getElementById("pensamento-autoria")
const thoughtsUL = document.getElementById("lista-pensamentos")
const cancelBtn = document.getElementById("botao-cancelar")

let thoughtsArray = []

try {
    thoughtsArray = await api.getThoughts()
    thoughtsUI.renderThoughtsList(thoughtsArray)
} catch (error) {
    console.log("Erro ao carregar pensamentos: ", error)
}

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    thoughtsUI.addOrEditThought(quoteInput, autorInput)
})

thoughtsUL.addEventListener("click", async (e) => {
    const btn = e.target.closest("button")

    if (!btn) return

    const li = btn.closest("li")
    const id = li.dataset.id

    if (btn.classList.contains("botao-excluir")) {
        api.deleteThought(id)
    }

    if (btn.classList.contains("botao-editar")) {
        const thought = thoughtsArray.find(thought => thought.id === id)

        if (thought) {
            quoteInput.value = thought.conteudo
            autorInput.value = thought.autoria
        }

        state.setIsEditing(true)
        state.setID(id)
        quoteInput.focus()
    }
})

cancelBtn.addEventListener("click", () => {
    state.reset()
    thoughtsUI.clearForm(quoteInput, autorInput)
})



