import { initEditor, switchTab, saveToStorage, loadFromStorage, clearStorage, showGeneratedCode } from './editorModule.js';
import { setupInteractiveApi, setupMultipleApis } from './apiModule.js';

// Inicializa o editor quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Configura o core do editor
    initEditor();
    
    // Configura os listeners de tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const panelId = e.currentTarget.getAttribute('data-panel');
            switchTab(panelId);
        });
    });
    
    // Configura os listeners de elementos do editor
    setupEditorElements();
    
    // Configura as APIs
    setupInteractiveApi();
    setupMultipleApis();
});

// Configura todos os elementos do editor
function setupEditorElements() {
    // Botões de adicionar elementos
    document.getElementById('add-header-element').addEventListener('click', () => {
        import('./editorModule.js').then(module => module.addHeaderElement());
    });
    
    document.getElementById('add-menu-item').addEventListener('click', () => {
        import('./editorModule.js').then(module => module.addMenuItem());
    });
    
    document.getElementById('add-gallery-item').addEventListener('click', () => {
        import('./editorModule.js').then(module => module.addGalleryItem());
    });
    
    document.getElementById('add-form-field').addEventListener('click', () => {
        import('./editorModule.js').then(module => module.addFormField());
    });
    
    // Listeners para cores
    setupColorPickers();
    
    // Listeners para outros elementos
    setupGeneralControls();
}

function setupColorPickers() {
    const colorInputs = [
        'headerBgColor', 'menuBgColor', 'menuTextColor',
        'galleryBgColor', 'formBgColor', 'formBorderColor', 
        'footerBgColor', 'footerTextColor', 'pageBgColor'
    ];
    
    colorInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const span = document.getElementById(inputId + 'Value');
        
        if (input && span) {
            input.addEventListener('input', (e) => {
                span.textContent = e.target.value;
                import('./editorModule.js').then(module => module.updatePreview());
            });
        }
    });
}
function setupGeneralControls() {
    // Botão para mostrar código HTML
    document.getElementById('show-generated-code').addEventListener('click', async () => {
        try {
            const editorModule = await import('./editorModule.js');
            editorModule.showGeneratedCode();
        } catch (error) {
            console.error('Erro ao carregar módulo:', error);
            document.getElementById('generatedCode').value = 'Erro ao carregar o editor';
        }
    });
    
    // Botão para mostrar código HTML
    document.getElementById('show-generated-code').addEventListener('click', showGeneratedCode);
    
    // Botões de storage
    document.getElementById('save-to-storage').addEventListener('click', saveToStorage);
    document.getElementById('load-from-storage').addEventListener('click', loadFromStorage);
    document.getElementById('clear-storage').addEventListener('click', clearStorage);
    
    // Outros controles
    ['formTitle', 'footerText', 'footerFontSize', 'galleryColumns', 'pageFont'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                import('./editorModule.js').then(module => module.updatePreview());
            });
        }
    });
}