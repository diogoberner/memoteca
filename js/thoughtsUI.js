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

    clearForm(quoteInput, autorInput) {
        quoteInput.value = ""
        autorInput.value = ""
    }

}

export default thoughtsUI
