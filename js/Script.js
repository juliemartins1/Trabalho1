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
        /* document.getElementById('menuImageUpload') Esta parte busca um elemento HTML específico na página que possui o ID 'menuImageUpload'. 
        Este elemento é um campo de upload de arquivo (<input type="file">) que permite aos usuários selecionar imagens do seu computador.
        addEventListener('change', handleImageUpload); Esta parte adiciona um "ouvinte de evento" ao elemento que acabamos de selecionar:
        O primeiro parâmetro 'change' indica qual tipo de evento estamos monitorando. O evento 'change' ocorre quando o usuário seleciona 
        um arquivo usando o campo de upload.
        O segundo parâmetro handleImageUpload é o nome da função que será executada quando o evento 'change' ocorrer.
        */
        
        // Eventos para os botões principais
        document.getElementById('addMenuItem').addEventListener('click', handleAddMenuItem);
        /*Esta linha de código adiciona um ouvinte de evento (event listener) a um elemento HTML com o ID 'addMenuItem',
       document.getElementById('addMenuItem') - Esta parte busca o elemento HTML que tem o ID 'addMenuItem'.
        É um botão com um texto como "Adicionar Item"*/
        document.getElementById('clearAllItems').addEventListener('click', handleClearAllItems);
        /*document.getElementById('clearAllItems') - Esta parte localiza um elemento HTML específico na página que possui o ID 'clearAllItems'. 
        Este elemento é um botão com texto como "Limpar Tudo*/
        
        // Eventos para os controles de posição da imagem
        document.querySelectorAll('input[name="imagePosition"]').forEach(radio => {
            radio.addEventListener('change', updateMenuPreview);
            /*document.querySelectorAll('input[name="imagePosition"]') - Este método busca todos os elementos <input> na página que têm o atributo name="imagePosition". 
            Estes são botões de opção (radio buttons) que permitem ao usuário escolher onde a imagem deve aparecer no item do menu (por exemplo: à esquerda do menu,acima do menu).
            .forEach(radio => { ... }) - Este método executa a função fornecida para cada elemento encontrado pelo 
            querySelectorAll. A variável radio representa cada botão de opção individual enquanto o código percorre a lista.
             radio.addEventListener('change', updateMenuPreview); - Para cada botão de opção, 
             adiciona um ouvinte para o evento 'change', que é acionado quando o usuário seleciona uma opção diferente. Quando isso acontece, a função updateMenuPreview é chamada.*/
        });
        
        // Eventos para os controles de orientação do menu
        document.querySelectorAll('input[name="menuOrientation"]').forEach(radio => {
            radio.addEventListener('change', updateMenuPreview);
        });
        
        /* Eventos para os seletores de cor
        menuBackgroundColor: Seletor de cor para o fundo do menu
        menuItemBackgroundColor: Seletor de cor para o fundo dos itens do menu
        menuTextColor: Seletor de cor para o texto dos itens
        menuBorderColor: Seletor de cor para as bordas
        'input': O evento é disparado sempre que o valor do seletor de cor muda, seja por:
        Seleção de uma nova cor no pop-up
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
        /*document.getElementById('menuItemPadding') - Seleciona um elemento HTML com o ID 'menuItemPadding'.
        Este provavelmente é um controle deslizante (<input type="range">) ou um campo numérico que permite ao usuário definir o valor do padding.
        .addEventListener('input', function(e) { ... }) - Adiciona um ouvinte para o evento 'input', que é acionado enquanto o usuário está ajustando 
        o valor (movendo o controle deslizante ou digitando no campo numérico).
        O parâmetro e é o objeto do evento que contém informações sobre o evento ocorrido.
    Dentro da função de callback:
    document.getElementById('menuItemPaddingValue').textContent = e.target.value + 'px'; - Esta linha atualiza um elemento com
    ID 'menuItemPaddingValue' para mostrar o valor atual do padding, acrescentando 'px' ao final para indicar a unidade
    de medida. Este elemento provavelmente exibe o valor numérico ao lado do controle deslizante.
    updateMenuPreview(); - Esta linha chama a função updateMenuPreview() para atualizar a pré-visualização do
    menu com o novo valor de padding.*/
        
        // Eventos para controles de borda
        document.getElementById('menuBorderWidth').addEventListener('input', function(e) {
            document.getElementById('menuBorderWidthValue').textContent = e.target.value + 'px';
            updateMenuPreview();
        });
        /*document.getElementById('menuBorderWidth') - Seleciona um elemento HTML com o ID 'menuBorderWidth'.
        Este provavelmente é um controle deslizante (<input type="range">)  definir a largura da borda dos itens do menu.
        .addEventListener('input', function(e) { ... }) - Adiciona um ouvinte para o evento 'input', que é acionado enquanto o usuário está ajustando o valor (movendo o controle deslizante ou digitando no campo). O parâmetro e contém informações sobre o evento.
    Dentro da função de callback:
document.getElementById('menuBorderWidthValue').textContent = e.target.value + 'px'; -
Esta linha atualiza um elemento com ID 'menuBorderWidthValue' para mostrar o valor atual da largura da borda, 
acrescentando 'px' ao final. Este elemento exibe o valor numérico na interface.
updateMenuPreview(); - Esta linha chama a função updateMenuPreview() para atualizar a pré-visualização do menu com
a nova largura de borda.*/
        document.getElementById('menuBorderRadius').addEventListener('input', function(e) {
            document.getElementById('menuBorderRadiusValue').textContent = e.target.value + 'px';
            updateMenuPreview();

            /* este código realiza duas ações quando o usuário ajusta o raio de borda:
            Atualiza um texto na interface mostrando o valor atual (por exemplo: "8px")
                Atualiza a pré-visualização do menu para mostrar como ficarão os cantos arredondados com o novo valor*/
        });
        
        document.getElementById('menuBorderStyle').addEventListener('change', updateMenuPreview);
        /*este código garante que sempre que o usuário escolher um estilo de borda diferente na lista suspensa
        (por exemplo, mudar de borda sólida para tracejada), 
        a função updateMenuPreview() será chamada para atualizar a pré-visualização do menu com o novo estilo de borda.*/
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
            /*adiciona o campo de texto (itemInput) ao container de controle do item (itemControl). O itemInput é um elemento <input> que
            permite ao usuário editar o texto de um item do menu. Usando o método appendChild(), 
            este campo de texto se torna um elemento filho dentro do container.*/
            itemControl.appendChild(removeButton);
            /*itemControl.appendChild(removeButton);
Esta linha adiciona o botão de remoção (removeButton) ao mesmo container de controle (itemControl), colocando-o logo após o campo de texto. 
Este botão tem o símbolo "×" e permite ao usuário excluir o item específico do menu. 
Ele também é adicionado como um elemento filho do container de controle.*/
            menuItemsContainer.appendChild(itemControl);
            /*Esta última linha adiciona todo o conjunto de controle de item (que agora contém tanto o campo de texto quanto o botão de remoção) ao 
            container principal de itens do menu (menuItemsContainer). 
            O menuItemsContainer é o elemento na interface que contém todos os controles de itens do menu.*/
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
        const imageElement = document.createElement('img');/* novo elemento é criado dinamicamente no documento usando o 
        document.createElement('img')*/
        imageElement.className = 'preview-image';/*define a classe CSS do elemento como preview-image permitindo ele ser estilizado
        posteriormente pelo CSS*/
        imageElement.src = uploadedImageData;/*Aqui a origem da imagem é definida*/
        imageElement.alt = 'Imagem do Menu';/*o atributo alt é configuradopara imagem menu*/
        
        // Verifica a posição da imagem
        if (imagePosition === 'left') {
            // Cria um layout com imagem à esquerda e menu à direita
            const sideContainer = document.createElement('div');
            sideContainer.className = 'menu-with-image-side';
            
            // Container para a imagem
            const imageContainer = document.createElement('div');/*Cria dinamicamente um novo div no documento*/
            imageContainer.className = 'menu-image-side';/* define a classeName como menu-image-side para ser estilizado pelo Css*/
            imageContainer.appendChild(imageElement);/*adiciona a imagem dentro da <div> imageContainer*/
            
            // Container para o menu
            const menuContainer = document.createElement('div');/*Cria dinamicamente um novo div no documento*/
            menuContainer.className = 'menu-content-side'; /* define a classeName como menu-content-side para ser estilizado pelo Css*/
            menuContainer.appendChild(menuList);/*adiciona a lista dentro da <div> menuContainer*/
            
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
