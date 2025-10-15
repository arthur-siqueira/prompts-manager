// Controle de visibilidade do botão open-toggle
function updateOpenToggleVisibility() {
  const btnOpen = document.getElementById("btn-open")
  const sidebar = document.querySelector(".sidebar")
  if (btnOpen && sidebar) {
    if (sidebar.classList.contains("collapsed")) {
      btnOpen.style.display = "block"
    } else {
      btnOpen.style.display = "none"
    }
  }
}

const btnOpen = document.getElementById("btn-open")
const btnCollapse = document.getElementById("btn-collapse")
const sidebar = document.querySelector(".sidebar")
if (btnOpen && btnCollapse && sidebar) {
  btnOpen.addEventListener("click", () => {
    sidebar.classList.remove("collapsed")
    updateOpenToggleVisibility()
  })
  btnCollapse.addEventListener("click", () => {
    sidebar.classList.add("collapsed")
    updateOpenToggleVisibility()
  })
  // Estado inicial
  updateOpenToggleVisibility()
}
// Chave para identificar os dados salvos pela nossa aplicação no navegador.
const STORAGE_KEY = "prompts_storage"

// Estado carregar os prompts salvos e exibir.
const state = {
  prompts: [],
  selectedId: null,
}

// Seleciona elementos por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  sidebar: document.querySelector(".sidebar"),
  btnSave: document.getElementById("btn-save"),
  list: document.getElementById("prompt-list"),
  search: document.getElementById("search-input"),
  btnNew: document.getElementById("btn-new"),
  btnCopy: document.getElementById("btn-copy"),
}

// Atualiza o estado do wrapper conforme o conteúdo do elemento
function updateEditableWrapperState(element, wrapper) {
  const hasText = element.textContent.trim().length > 0
  wrapper.classList.toggle("is-empty", !hasText)
}

// Atualiza o estado de todos os elementos editáveis
function updateAllEditableStates() {
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
}

// Adiciona ouvintes de evento input para atualização em tempo real
function attachAllEditableHandlers() {
  if (elements.promptTitle && elements.titleWrapper) {
    elements.promptTitle.addEventListener("input", function () {
      updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
    })
  }
  if (elements.promptContent && elements.contentWrapper) {
    elements.promptContent.addEventListener("input", function () {
      updateEditableWrapperState(
        elements.promptContent,
        elements.contentWrapper
      )
    })
  }
  // Atualiza o estado inicial
  updateAllEditableStates()
}

// Função para abrir a sidebar
function openSidebar() {
  elements.sidebar.classList.add("open")
  elements.sidebar.classList.remove("collapsed")
}

// Função para fechar a sidebar
function closeSidebar() {
  elements.sidebar.classList.remove("open")
  elements.sidebar.classList.add("collapsed")
}

function save() {
  const title = elements.promptTitle.textContent.trim()
  const content = elements.promptContent.innerHTML.trim()

  if (!title || !content) {
    alert("Título e conteúdo não podem estar vazios.")
    return
  }

  if (state.selectedId) {
    // Editando um prompt existente
    const idx = state.prompts.findIndex((p) => p.id === state.selectedId)
    if (idx !== -1) {
      state.prompts[idx] = {
        ...state.prompts[idx],
        title: title || "Sem título",
        content: content || "Sem conteúdo",
      }
    }
  } else {
    // Criando um novo prompt
    const newPrompt = {
      id: Date.now().toString(36),
      title,
      content,
    }
    state.prompts.unshift(newPrompt)
    state.selectedId = newPrompt.id
  }

  renderList(elements.search.value)
  persist()
  alert("Prompt salvo com sucesso!")
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts))
  } catch (e) {
    console.log("Erro ao salvar no localStorage:", e)
  }
}

function load() {
  try {
    const storage = localStorage.getItem(STORAGE_KEY)
    state.prompts = storage ? JSON.parse(storage) : []
    state.selectedId = null
  } catch (e) {
    console.log("Erro ao carregar do localStorage:", e)
  }
}

function createPromptItem(prompt) {
  const tmp = document.createElement("div")
  tmp.innerHTML = prompt.content
  return `
    <li class="prompt-item" data-id="${prompt.id}">
      <div class="prompt-item-content" data-action="select">
        <span class="prompt-item-title">${prompt.title}</span>
        <span class="prompt-item-description">${tmp.textContent}</span>
      </div>
      <button class="btn-icon" title="Remover" data-action="remove">
        <img
          src="./assets/remove.svg"
          alt="Remover"
          class="icon icon-trash"
        />
      </button>
    </li>
  `
}

function renderList(filterText = "") {
  const filteredPrompts = state.prompts
    .filter((prompt) =>
      prompt.title.toLowerCase().includes(filterText.toLowerCase().trim())
    )
    .map((p) => createPromptItem(p))
    .join("")

  elements.list.innerHTML = filteredPrompts
}

function newPrompt() {
  state.selectedId = null
  elements.promptTitle.textContent = ""
  elements.promptContent.textContent = ""
  updateAllEditableStates()
  elements.promptTitle.focus()
}

function copySelected() {
  try {
    const content = elements.promptContent

    if (!navigator.clipboard) {
      alert("A API de área de transferência não é suportada neste navegador.")
      return
    }

    navigator.clipboard.writeText(content.innerText)

    alert("Conteúdo copiado para a área de transferência!")
  } catch (e) {
    console.log("Erro ao copiar para a área de transferência:", e)
  }
}

// Eventos
elements.btnSave.addEventListener("click", save)
elements.btnNew.addEventListener("click", newPrompt)
elements.btnCopy.addEventListener("click", copySelected)

elements.search.addEventListener("input", function (e) {
  renderList(e.target.value)
})

elements.list.addEventListener("click", function (e) {
  const removeBtn = e.target.closest("[data-action='remove']")
  const item = e.target.closest("[data-id] ")

  if (!item) return

  const id = item.getAttribute("data-id")
  state.selectedId = id

  if (removeBtn) {
    // Remover prompt.
    state.prompts = state.prompts.filter((p) => p.id !== id)
    renderList(elements.search.value)
    persist()
    return
  }

  if (e.target.closest("[data-action='select']")) {
    const prompt = state.prompts.find((p) => p.id === id)

    if (prompt) {
      elements.promptTitle.textContent = prompt.title
      elements.promptContent.innerHTML = prompt.content
      updateAllEditableStates()
    }
  }
})

// Função de inicialização
function init() {
  load()
  renderList("")
  attachAllEditableHandlers()
  // Estado inicial: sidebar visível, botão open oculto
  const sidebar = document.querySelector(".sidebar")
  if (sidebar && elements.btnOpen) {
    sidebar.style.display = "block"
    elements.btnOpen.style.display = "none"
  }
  // Adiciona eventos para abrir/fechar sidebar
  if (elements.btnOpen) {
    elements.btnOpen.addEventListener("click", openSidebar)
  }
  if (elements.btnCollapse) {
    elements.btnCollapse.addEventListener("click", closeSidebar)
  }
}

// Executa a inicialização ao carregar o script
init()
