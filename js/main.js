import api from "./api.js"
import state from "./state.js"
import thoughtsUI from "./thoughtsUI.js";

const form = document.getElementById("pensamento-form")
const quoteInput = document.getElementById("pensamento-conteudo")
const autorInput = document.getElementById("pensamento-autoria")
const thoughtsUL = document.getElementById("lista-pensamentos")
const cancelBtn = document.getElementById("botao-cancelar")

window.api = api;

const thoughtsArray = await api.getThoughts()

thoughtsUI.renderThoughtsList(thoughtsArray)

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const quote = quoteInput.value
    const autor = autorInput.value

    if (state.getIsEditing()) {
        api.updateThought(state.getID(), quote, autor)
        state.setID("")
        state.setIsEditing(false)
        return
    }

    api.createThought(quote, autor)
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
        const editThought = await api.getThoughts(id)
        quoteInput.value = editThought.conteudo
        autorInput.value = editThought.autoria
        state.setIsEditing(true)
        state.setID(id)
        quoteInput.focus()
    }

})

cancelBtn.addEventListener("click", () => {
    quoteInput.value = ""
    autorInput.value = ""
    state.setIsEditing(false)
    state.setID("")
})



