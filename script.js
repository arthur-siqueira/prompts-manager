// Seleciona elementos por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  sidebar: document.querySelector(".sidebar"),
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
  elements.sidebar.style.display = "flex"
  elements.btnOpen.style.display = "none"
}

// Função para fechar a sidebar
function closeSidebar() {
  elements.sidebar.style.display = "none"
  elements.btnOpen.style.display = "block"
}

// Função de inicialização
function init() {
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
