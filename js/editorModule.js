// Estado global do editor
const state = {
    headerElements: [],
    menuItems: [],
    galleryItems: [],
    formFields: [],
    interactiveApiData: null,
    multiApiData: [],
    counters: {
        header: 0,
        menu: 0,
        gallery: 0,
        form: 0
    }
};

// Inicializa o editor
export function initEditor() {
    // Adiciona elementos iniciais
    addHeaderElement();
    addMenuItem();
    addGalleryItem();
    addFormField();
    
    // Atualiza a visualização
    updatePreview();
}

// Alterna entre as tabs
export function switchTab(panelId) {
    // Remove classe ativa de todas as guias
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Adiciona classe ativa à guia clicada
    document.querySelector(`.tab[data-panel="${panelId}"]`).classList.add('active');
    
    // Esconde todos os painéis
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Mostra o painel correspondente
    document.getElementById(panelId).classList.add('active');
}

// Funções para adicionar elementos
export function addHeaderElement() {
    if (state.headerElements.length >= 3) {
        alert('Limite de 3 elementos no cabeçalho atingido.');
        return;
    }
    
    const id = 'header-element-' + state.counters.header++;
    const element = {
        id,
        type: 'text',
        content: 'Novo Elemento',
        textColor: '#333333',
        fontSize: 18
    };
    
    state.headerElements.push(element);
    renderHeaderElements();
    updatePreview();
}

export function addMenuItem() {
    const id = 'menu-item-' + state.counters.menu++;
    const item = {
        id,
        text: 'Item ' + (state.menuItems.length + 1),
        link: '#'
    };
    
    state.menuItems.push(item);
    renderMenuItems();
    updatePreview();
}

export function addGalleryItem() {
    const id = 'gallery-item-' + state.counters.gallery++;
    const item = {
        id,
        title: 'Item ' + (state.galleryItems.length + 1),
        description: 'Descrição do item'
    };
    
    state.galleryItems.push(item);
    renderGalleryItems();
    updatePreview();
}

export function addFormField() {
    const id = 'form-field-' + state.counters.form++;
    const field = {
        id,
        label: 'Campo ' + (state.formFields.length + 1),
        type: 'text',
        required: false
    };
    
    state.formFields.push(field);
    renderFormFields();
    updatePreview();
}

// Funções de renderização
function renderHeaderElements() {
    const container = document.getElementById('header-elements');
    if (!container) return;
    
    container.innerHTML = '';
    
    state.headerElements.forEach((element, index) => {
        const div = document.createElement('div');
        div.className = 'header-element';
        div.innerHTML = `
            <h4>Elemento ${index + 1}</h4>
            <label>Conteúdo:</label>
            <input type="text" value="${element.content}" onchange="updateHeaderElement('${element.id}', 'content', this.value)">
            <label>Cor do Texto:</label>
            <input type="color" value="${element.textColor}" onchange="updateHeaderElement('${element.id}', 'textColor', this.value)">
            <label>Tamanho da Fonte:</label>
            <input type="number" value="${element.fontSize}" min="10" max="50" onchange="updateHeaderElement('${element.id}', 'fontSize', this.value)">
            <button type="button" onclick="removeHeaderElement('${element.id}')" class="btn-remove">Remover Elemento</button>
        `;
        container.appendChild(div);
    });
}

function renderMenuItems() {
    const container = document.getElementById('menu-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    state.menuItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <h4>Item ${index + 1}</h4>
            <label>Texto:</label>
            <input type="text" value="${item.text}" onchange="updateMenuItem('${item.id}', 'text', this.value)">
            <label>Link:</label>
            <input type="text" value="${item.link}" onchange="updateMenuItem('${item.id}', 'link', this.value)">
            <button type="button" onclick="removeMenuItem('${item.id}')" class="btn-remove">Remover Item</button>
        `;
        container.appendChild(div);
    });
}

function renderGalleryItems() {
    const container = document.getElementById('gallery-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    state.galleryItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <h4>Item ${index + 1}</h4>
            <label>Título:</label>
            <input type="text" value="${item.title}" onchange="updateGalleryItem('${item.id}', 'title', this.value)">
            <label>Descrição:</label>
            <textarea onchange="updateGalleryItem('${item.id}', 'description', this.value)">${item.description}</textarea>
            <button type="button" onclick="removeGalleryItem('${item.id}')" class="btn-remove">Remover Item</button>
        `;
        container.appendChild(div);
    });
}

function renderFormFields() {
    const container = document.getElementById('form-fields');
    if (!container) return;
    
    container.innerHTML = '';
    
    state.formFields.forEach((field, index) => {
        const div = document.createElement('div');
        div.className = 'form-item';
        div.innerHTML = `
            <h4>Campo ${index + 1}</h4>
            <label>Rótulo:</label>
            <input type="text" value="${field.label}" onchange="updateFormField('${field.id}', 'label', this.value)">
            <label>Tipo:</label>
            <select onchange="updateFormField('${field.id}', 'type', this.value)">
                <option value="text" ${field.type === 'text' ? 'selected' : ''}>Texto</option>
                <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
                <option value="tel" ${field.type === 'tel' ? 'selected' : ''}>Telefone</option>
                <option value="textarea" ${field.type === 'textarea' ? 'selected' : ''}>Área de Texto</option>
            </select>
            <label>
                <input type="checkbox" ${field.required ? 'checked' : ''} onchange="updateFormField('${field.id}', 'required', this.checked)">
                Obrigatório
            </label>
            <button type="button" onclick="removeFormField('${field.id}')" class="btn-remove">Remover</button>
        `;
        container.appendChild(div);
    });
}

// Funções de atualização
window.updateHeaderElement = function(id, property, value) {
    const element = state.headerElements.find(el => el.id === id);
    if (element) {
        element[property] = value;
        updatePreview();
    }
};

window.updateMenuItem = function(id, property, value) {
    const item = state.menuItems.find(el => el.id === id);
    if (item) {
        item[property] = value;
        updatePreview();
    }
};

window.updateGalleryItem = function(id, property, value) {
    const item = state.galleryItems.find(el => el.id === id);
    if (item) {
        item[property] = value;
        updatePreview();
    }
};

window.updateFormField = function(id, property, value) {
    const field = state.formFields.find(el => el.id === id);
    if (field) {
        field[property] = value;
        updatePreview();
    }
};

// Funções de remoção
window.removeHeaderElement = function(id) {
    state.headerElements = state.headerElements.filter(el => el.id !== id);
    renderHeaderElements();
    updatePreview();
};

window.removeMenuItem = function(id) {
    state.menuItems = state.menuItems.filter(el => el.id !== id);
    renderMenuItems();
    updatePreview();
};

window.removeGalleryItem = function(id) {
    state.galleryItems = state.galleryItems.filter(el => el.id !== id);
    renderGalleryItems();
    updatePreview();
};

window.removeFormField = function(id) {
    state.formFields = state.formFields.filter(el => el.id !== id);
    renderFormFields();
    updatePreview();
};
// Atualiza a visualização
export function updatePreview() {
    const preview = document.getElementById('preview');
    if (!preview) return;
    
    // Obter valores dos controles
    const headerBgColor = document.getElementById('headerBgColor')?.value || '#f8f8f8';
    const menuBgColor = document.getElementById('menuBgColor')?.value || '#333333';
    const menuTextColor = document.getElementById('menuTextColor')?.value || '#ffffff';
    const galleryBgColor = document.getElementById('galleryBgColor')?.value || '#f0f0f0';
    const galleryColumns = document.getElementById('galleryColumns')?.value || 3;
    const formTitle = document.getElementById('formTitle')?.value || 'Entre em Contato';
    const formBgColor = document.getElementById('formBgColor')?.value || '#f8f8f8';
    const formBorderColor = document.getElementById('formBorderColor')?.value || '#dddddd';
    const footerBgColor = document.getElementById('footerBgColor')?.value || '#333333';
    const footerTextColor = document.getElementById('footerTextColor')?.value || '#ffffff';
    const footerText = document.getElementById('footerText')?.value || '© 2025 Minha Empresa';
    const footerFontSize = document.getElementById('footerFontSize')?.value || 14;
    const pageBgColor = document.getElementById('pageBgColor')?.value || '#ffffff';
    const pageFont = document.getElementById('pageFont')?.value || 'Arial, sans-serif';
    
    // Gerar HTML
    let html = `
        <div class="generated-page" style="background-color: ${pageBgColor}; font-family: ${pageFont}; margin: 0; padding: 0;">
            <!-- Cabeçalho -->
            <header style="background-color: ${headerBgColor}; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                ${state.headerElements.map(el => `
                    <div style="color: ${el.textColor}; font-size: ${el.fontSize}px; margin: 5px;">
                        ${el.content}
                    </div>
                `).join('')}
            </header>
            
            <!-- Menu -->
            <nav style="background-color: ${menuBgColor}; padding: 10px 0;">
                <ul style="list-style: none; margin: 0; padding: 0; display: flex; justify-content: center; flex-wrap: wrap;">
                    ${state.menuItems.map(item => `
                        <li style="margin: 0 15px;">
                            <a href="${item.link}" style="color: ${menuTextColor}; text-decoration: none; padding: 10px 15px;">
                                ${item.text}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
            
            <!-- Formulário -->
            <section style="padding: 40px 20px; background-color: ${formBgColor}; border: 1px solid ${formBorderColor}; margin: 20px;">
                <h2 style="text-align: center; margin-bottom: 30px;">${formTitle}</h2>
                <form style="max-width: 600px; margin: 0 auto;">
                    ${state.formFields.map(field => {
                        if (field.type === 'textarea') {
                            return `
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                                        ${field.label}${field.required ? ' *' : ''}
                                    </label>
                                    <textarea ${field.required ? 'required' : ''} style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                                </div>
                            `;
                        } else {
                            return `
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                                        ${field.label}${field.required ? ' *' : ''}
                                    </label>
                                    <input type="${field.type}" ${field.required ? 'required' : ''} style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                            `;
                        }
                    }).join('')}
                    <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Enviar</button>
                </form>
            </section>
            
            <!-- Galeria -->
            <section style="padding: 40px 20px; background-color: ${galleryBgColor};">
                <div style="display: grid; grid-template-columns: repeat(${galleryColumns}, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto;">
                    ${state.galleryItems.map(item => `
                        <div style="background-color: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h3 style="margin-top: 0;">${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <!-- API Interativa -->
            ${state.interactiveApiData ? `
                <section style="padding: 40px 20px; background-color: #f5f5f5;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <h2 style="text-align: center; margin-bottom: 30px;">${state.interactiveApiData.title}</h2>
                        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <pre style="overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
                                ${JSON.stringify(state.interactiveApiData.data, null, 2)}
                            </pre>
                        </div>
                    </div>
                </section>
            ` : ''}
            
            <!-- Múltiplas APIs -->
            ${state.multiApiData.length > 0 ? `
                <section style="padding: 40px 20px; background-color: #e9f5ff;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <h2 style="text-align: center; margin-bottom: 30px;">Dados de Múltiplas APIs</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                            ${state.multiApiData.map(api => `
                                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <h3 style="margin-top: 0;">${api.title}</h3>
                                    <pre style="overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
                                        ${JSON.stringify(api.data, null, 2)}
                                    </pre>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            ` : ''}
            
            <!-- Rodapé -->
            <footer style="background-color: ${footerBgColor}; color: ${footerTextColor}; padding: 20px; text-align: center; font-size: ${footerFontSize}px;">
                ${footerText}
            </footer>
        </div>
    `;
    
    preview.innerHTML = html;
}
// Mostra o código HTML gerado
export function showGeneratedCode() {
    const preview = document.getElementById('preview');
    const generatedCode = document.getElementById('generatedCode');
    
    if (!preview || !generatedCode) return;

    // Obter o HTML completo formatado
    const html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Gerada</title>
    <style>
        /* Estilos básicos para manter a estrutura */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .generated-page {
            max-width: 1200px;
            margin: 0 auto;
        }
        header, nav, section, footer {
            margin: 10px 0;
            padding: 20px;
        }
        pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    ${preview.innerHTML}
</body>
</html>
    `;

    // Formatar o HTML para exibição
    const formattedHtml = formatHTML(html);
    generatedCode.value = formattedHtml;
}

// Função auxiliar para formatar o HTML
function formatHTML(html) {
    // Implementação básica de formatação
    let indent = 0;
    const lines = html.split('\n');
    let result = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (line.includes('</')) {
            indent--;
        }
        
        result.push('    '.repeat(indent) + line);
        
        if (line.includes('<') && !line.includes('</') && !line.includes('/>')) {
            indent++;
        }
    });
    
    return result.join('\n');
}
/*Mostra o código HTML gerado
export function showGeneratedCode() {
    try {
        const preview = document.getElementById('preview');
        const generatedCode = document.getElementById('generatedCode');
        
        if (!preview || !generatedCode) {
            console.error('Elementos não encontrados: #preview ou #generatedCode');
            return;
        }

        const html = preview.innerHTML;
        
        if (!html) {
            generatedCode.value = 'Nenhum conteúdo gerado ainda. Adicione elementos e atualize a visualização.';
            return;
        }

        // Formatação básica do HTML para exibição
        const formattedHtml = html
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '\n')
            .replace(/\t/g, '    ');

        generatedCode.value = formattedHtml;
    } catch (error) {
        console.error('Erro ao gerar código:', error);
        const generatedCode = document.getElementById('generatedCode');
        if (generatedCode) {
            generatedCode.value = `Erro ao gerar código: ${error.message}`;
        }
    }
}*/

// Funções de armazenamento local
export function saveToStorage() {
    try {
        localStorage.setItem('htmlEditorState', JSON.stringify(state));
        alert('Configurações salvas com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        alert('Erro ao salvar as configurações. O localStorage pode estar cheio ou desabilitado.');
    }
}

export function loadFromStorage() {
    try {
        const savedState = localStorage.getItem('htmlEditorState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            
            Object.assign(state, parsedState);
            
            // Atualiza os contadores
            state.counters.header = state.headerElements.length;
            state.counters.menu = state.menuItems.length;
            state.counters.gallery = state.galleryItems.length;
            state.counters.form = state.formFields.length;
            
            // Re-renderiza todos os elementos
            renderHeaderElements();
            renderMenuItems();
            renderGalleryItems();
            renderFormFields();
            
            updatePreview();
            
            alert('Configurações carregadas com sucesso!');
        } else {
            alert('Nenhuma configuração salva encontrada.');
        }
    } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
        alert('Erro ao carregar as configurações. Os dados podem estar corrompidos.');
    }
}

export function clearStorage() {
    try {
        localStorage.removeItem('htmlEditorState');
        alert('Configurações locais foram removidas.');
    } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
        alert('Erro ao limpar as configurações locais.');
    }
}

// Exporta o estado para uso em outros módulos
export function getState() {
    return state;
}

export function setState(newState) {
    Object.assign(state, newState);
    updatePreview();
}

// Debug (opcional)
console.log('editorModule.js carregado');
window.__editorState = state;