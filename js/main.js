import api from "./api.js"
import state from "./state.js"
import thoughtsUI from "./thoughtsUI.js";
import { debounce, contentValidation, autorValidation, uid } from "./utils.js";

const form = document.getElementById("pensamento-form")
const quoteInput = document.getElementById("pensamento-conteudo")
const autorInput = document.getElementById("pensamento-autoria")
const dateInput = document.getElementById("pensamento-data")
const thoughtsUL = document.getElementById("lista-pensamentos")
const cancelBtn = document.getElementById("botao-cancelar")
const saveBtn = document.getElementById("botao-salvar")
const searchInput = document.getElementById("campo-busca")

let thoughtsArray = []
const thoughtsSet = new Set()

try {
    thoughtsArray = await api.getThoughts()
    thoughtsArray.forEach(thought => {
        const thoughtKey = `${thought.conteudo}-${thought.autoria}`.toLowerCase().trim();
        thoughtsSet.add(thoughtKey)
    });
    thoughtsUI.renderThoughtsList(thoughtsArray)
} catch (error) {
    console.error("Erro ao carregar pensamentos: ", error)
}

form.addEventListener("submit", async (e) => {
    e.preventDefault()


    if (!contentValidation(quoteInput.value)) {
        alert("O pensamento precisa ter pelo menos 10 caracteres.")
        return
    }

    if (!autorValidation(autorInput.value)) {
        alert("O autor precisa ter entre 3 e 15 caracteres, e começar com letra maiúscula.")
        return
    }



    const newThoughtKey = `${quoteInput.value}-${autorInput.value}`.trim().toLowerCase()

    if (thoughtsSet.has(newThoughtKey)) {
        alert("Pensamento já cadastrado!")
        return
    }

    const thought = {
        conteudo: quoteInput.value,
        autoria: autorInput.value,
        data: dateToUTC(dateInput.value),
        id: state.getIsEditing() ? state.getID() : uid(),
        favorite: false
    }

    thoughtsSet.add(newThoughtKey)
    thoughtsUI.addOrEditThought(thought)
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
            dateInput.value = thoughtsUI.formatDateString(thought.data)
            saveBtn.textContent = "Salvar"
            state.setIsEditing(true)
            state.setID(id)
            quoteInput.focus()
        } else {
            console.error(`Pensamento com ID ${id} não encontrado.`)
        }
    }

    if (btn.classList.contains("botao-favorito")) {
        let selectedThought = thoughtsArray.find((t) => t.id === id)
        thoughtsUI.toggleFavoriteThought(selectedThought, btn)
    }
})

cancelBtn.addEventListener("click", () => {
    state.reset()
    thoughtsUI.clearForm()
    saveBtn.textContent = "Adicionar"
})

searchInput.addEventListener("input", debounce((e) => {
    e.preventDefault()

    const searchValue = e.target.value.trim()
    thoughtsUI.showSearchedItems(searchValue)
}, 500))

