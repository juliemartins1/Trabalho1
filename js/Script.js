// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let menuItems = []; // Array para armazenar os itens do menu
    let uploadedImageData = null; // Variável para armazenar a imagem carregada
    
    // Função de inicialização do editor
    function init() {
        addInitialMenuItems(); // Adiciona itens iniciais ao menu
        setupEventListeners(); // Configura os ouvintes de evento
        updateMenuPreview(); // Atualiza a visualização do menu
    }
    
    // Adiciona itens iniciais ao menu (exemplos)
    function addInitialMenuItems() {
        menuItems = ['Página Inicial', 'Produtos', 'Sobre Nós', 'Contato'];
        updateMenuItemsControls(); // Atualiza os controles dos itens
    }
    
    // Configura todos os ouvintes de evento da interface
    function setupEventListeners() {
        // Evento para upload de imagem
        document.getElementById('menuImageUpload').addEventListener('change', handleImageUpload);
        
        // Eventos para os botões principais
        document.getElementById('addMenuItem').addEventListener('click', handleAddMenuItem);
        document.getElementById('clearAllItems').addEventListener('click', handleClearAllItems);
        
        // Eventos para os controles de posição da imagem
        document.querySelectorAll('input[name="imagePosition"]').forEach(radio => {
            radio.addEventListener('change', updateMenuPreview);
        });
        
        // Eventos para os controles de orientação do menu
        document.querySelectorAll('input[name="menuOrientation"]').forEach(radio => {
            radio.addEventListener('change', updateMenuPreview);
        });
        
        /*/ Eventos para os seletores de cor  
        menuBackgroundColor: Seletor de cor para o fundo do menu
        menuItemBackgroundColor: Seletor de cor para o fundo dos itens do menu
        menuTextColor: Seletor de cor para o texto dos itens
        menuBorderColor: Seletor de cor para as bordas
        'input': O evento é disparado sempre que o valor do seletor de cor muda, seja por:
        Seleção de uma nova cor no popup
        Digitação manual de um valor hexadecimal
        Qualquer outra alteração no valor*/
        document.getElementById('menuBackgroundColor').addEventListener('input', updateMenuPreview);
        document.getElementById('menuItemBackgroundColor').addEventListener('input', updateMenuPreview);
        document.getElementById('menuTextColor').addEventListener('input', updateMenuPreview);
        document.getElementById('menuBorderColor').addEventListener('input', updateMenuPreview);
        
        // Eventos para controles de tamanho e espaçamento
        /* updateMenuPreview: Função que será executada quando o evento ocorrer
        Esta função é responsável por:
        Pegar os novos valores dos seletores
        Aplicar as cores ao menu de pré-visualização
        Redesenhar a visualização com as novas cores*/
        document.getElementById('menuFontSize').addEventListener('input', function(e) {
            document.getElementById('menuFontSizeValue').textContent = e.target.value + 'px';
            updateMenuPreview();
        });
        
        document.getElementById('menuItemPadding').addEventListener('input', function(e) {
            document.getElementById('menuItemPaddingValue').textContent = e.target.value + 'px';
            updateMenuPreview();
        });
        
        document.getElementById('menuItemMargin').addEventListener('input', function(e) {
            document.getElementById('menuItemMarginValue').textContent = e.target.value + 'px';
            updateMenuPreview();
        });
        
        // Eventos para controles de borda
        document.getElementById('menuBorderWidth').addEventListener('input', function(e) {
            document.getElementById('menuBorderWidthValue').textContent = e.target.value + 'px';
            updateMenuPreview();
        });
        
        document.getElementById('menuBorderRadius').addEventListener('input', function(e) {
            document.getElementById('menuBorderRadiusValue').textContent = e.target.value + 'px';
            updateMenuPreview();
        });
        
        document.getElementById('menuBorderStyle').addEventListener('change', updateMenuPreview);
    }
    
    // Manipula o upload de imagens
    function handleImageUpload(event) {
        const file = event.target.files[0]; // Obtém o arquivo selecionado
        if (file) {
            const reader = new FileReader(); // Cria um leitor de arquivos
            
            // Callback quando a imagem é carregada
            reader.onload = function(e) {
                uploadedImageData = e.target.result; // Armazena a imagem como URL de dados
                updateMenuPreview(); // Atualiza a visualização
            };
            
            // Callback para tratamento de erros
            reader.onerror = function() {
                alert('Erro ao carregar a imagem. Por favor, tente novamente.');
            };
            
            // Lê o arquivo como URL de dados
            reader.readAsDataURL(file);
        }
    }
    
    // Adiciona um novo item ao menu
    function handleAddMenuItem() {
        menuItems.push('Novo Item'); // Adiciona um item padrão
        updateMenuItemsControls(); // Atualiza os controles
        updateMenuPreview(); // Atualiza a visualização
    }
    
    // Remove todos os itens do menu (com confirmação)
    function handleClearAllItems() {
        if (confirm('Tem certeza que deseja remover todos os itens do menu?')) {
            menuItems = []; // Limpa o array
            updateMenuItemsControls(); // Atualiza os controles
            updateMenuPreview(); // Atualiza a visualização
        }
    }
    
    // Remove um item específico do menu
    function handleRemoveMenuItem(index) {
        menuItems.splice(index, 1); // Remove o item do array
        updateMenuItemsControls(); // Atualiza os controles
        updateMenuPreview(); // Atualiza a visualização
    }
    
    // Atualiza os controles de edição dos itens do menu
    function updateMenuItemsControls() {
        const menuItemsContainer = document.getElementById('menuItems');
        menuItemsContainer.innerHTML = ''; // Limpa o container
        
        // Para cada item no array, cria um controle de edição
        menuItems.forEach((item, index) => {
            // Cria o container do controle
            const itemControl = document.createElement('div');
            itemControl.className = 'menu-item-control';
            
            // Cria o input de texto para editar o item
            const itemInput = document.createElement('input');
            itemInput.type = 'text';
            itemInput.className = 'form-control';
            itemInput.value = item;
            itemInput.dataset.index = index; // Armazena o índice como atributo
            
            // Evento para atualizar o item quando editado
            itemInput.addEventListener('input', function() {
                menuItems[this.dataset.index] = this.value;
                updateMenuPreview();
            });
            
            // Cria o botão para remover o item
            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-sm btn-danger ms-2';
            removeButton.innerHTML = '&times;'; // Ícone "X"
            removeButton.addEventListener('click', function() {
                handleRemoveMenuItem(index);
            });
            
            // Adiciona os elementos ao DOM
            itemControl.appendChild(itemInput);
            itemControl.appendChild(removeButton);
            menuItemsContainer.appendChild(itemControl);
        });
    }
    
    // Atualiza a visualização do menu
    function updateMenuPreview() {
        const previewContainer = document.getElementById('menuPreview');
        // Obtém a posição da imagem selecionada
        const imagePosition = document.querySelector('input[name="imagePosition"]:checked').value;
        // Obtém a orientação do menu selecionada
        const menuOrientation = document.querySelector('input[name="menuOrientation"]:checked').value;
        
        // Limpa o container de visualização
        previewContainer.innerHTML = '';
        
        // Cria a lista do menu
        const menuList = createMenuList(menuOrientation);
        
        // Se não há imagem, mostra apenas o menu
        if (!uploadedImageData) {
            previewContainer.appendChild(menuList);
            return;
        }
        
        // Cria o elemento de imagem
        const imageElement = document.createElement('img');
        imageElement.className = 'preview-image';
        imageElement.src = uploadedImageData;
        imageElement.alt = 'Imagem do Menu';
        
        // Verifica a posição da imagem
        if (imagePosition === 'left') {
            // Cria um layout com imagem à esquerda e menu à direita
            const sideContainer = document.createElement('div');
            sideContainer.className = 'menu-with-image-side';
            
            // Container para a imagem
            const imageContainer = document.createElement('div');
            imageContainer.className = 'menu-image-side';
            imageContainer.appendChild(imageElement);
            
            // Container para o menu
            const menuContainer = document.createElement('div');
            menuContainer.className = 'menu-content-side';
            menuContainer.appendChild(menuList);
            
            // Monta a estrutura
            sideContainer.appendChild(imageContainer);
            sideContainer.appendChild(menuContainer);
            previewContainer.appendChild(sideContainer);
        } else {
            // Posiciona a imagem acima do menu
            const imageContainer = document.createElement('div');
            imageContainer.className = 'preview-image-container';
            imageContainer.appendChild(imageElement);
            
            previewContainer.appendChild(imageContainer);
            previewContainer.appendChild(menuList);
        }
    }
    
    // Cria a lista de menu com os estilos aplicados
    function createMenuList(orientation) {
        const menuList = document.createElement('ul');
        // Define a classe base e a orientação
        menuList.className = 'menu-list ' + (orientation === 'vertical' ? 'vertical' : 'horizontal');
        
        // Aplica os estilos do menu
        menuList.style.backgroundColor = document.getElementById('menuBackgroundColor').value;
        menuList.style.border = `${document.getElementById('menuBorderWidth').value}px ${document.getElementById('menuBorderStyle').value} ${document.getElementById('menuBorderColor').value}`;
        menuList.style.borderRadius = `${document.getElementById('menuBorderRadius').value}px`;
        menuList.style.padding = '10px';
        
        // Se não há itens, mostra uma mensagem
        if (menuItems.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Adicione itens ao menu usando os controles.';
            emptyMessage.style.fontStyle = 'italic';
            emptyMessage.style.color = '#999';
            menuList.appendChild(emptyMessage);
        } else {
            // Para cada item, cria um elemento de lista
            menuItems.forEach(item => {
                const menuItem = document.createElement('li');
                menuItem.className = 'menu-item';
                menuItem.textContent = item;
                
                // Aplica os estilos ao item
                menuItem.style.backgroundColor = document.getElementById('menuItemBackgroundColor').value;
                menuItem.style.color = document.getElementById('menuTextColor').value;
                menuItem.style.fontSize = `${document.getElementById('menuFontSize').value}px`;
                menuItem.style.padding = `${document.getElementById('menuItemPadding').value}px`;
                menuItem.style.margin = `${document.getElementById('menuItemMargin').value}px`;
                menuItem.style.border = `${document.getElementById('menuBorderWidth').value}px ${document.getElementById('menuBorderStyle').value} ${document.getElementById('menuBorderColor').value}`;
                menuItem.style.borderRadius = `${document.getElementById('menuBorderRadius').value}px`;
                
                // Efeitos de hover
                menuItem.addEventListener('mouseover', function() {
                    this.style.opacity = '0.8';
                });
                menuItem.addEventListener('mouseout', function() {
                    this.style.opacity = '1';
                });
                
                // Adiciona o item à lista
                menuList.appendChild(menuItem);
            });
        }
        
        return menuList;
    }
    
    // Inicializa o editor
    init();
});