import { getState, setState, updatePreview } from './editorModule.js';

// Configura a API interativa
export function setupInteractiveApi() {
    const apiType = document.getElementById('apiType');
    const fetchButton = document.getElementById('fetch-api-data');
    
    apiType.innerHTML = `
        <option value="fipe">Tabela FIPE</option>
        <option value="cep">Consulta CEP</option>
        <option value="placeholder">JSONPlaceholder</option>
        <option value="brasilapi">BrasilAPI</option>
        <option value="randomuser">Usuário Aleatório</option>
        <option value="joke">Piada Aleatória</option>
    `;
    
    apiType.addEventListener('change', loadApiParams);
    fetchButton.addEventListener('click', fetchInteractiveApiData);
    loadApiParams();
}

// Configura as múltiplas APIs
export function setupMultipleApis() {
    document.getElementById('fetch-multiple-apis').addEventListener('click', fetchMultipleApisData);
}

// Carrega os parâmetros da API selecionada
function loadApiParams() {
    const apiType = document.getElementById('apiType').value;
    const apiParamsContainer = document.getElementById('api-params');
    
    apiParamsContainer.innerHTML = '';
    
    switch(apiType) {
        case 'fipe':
            apiParamsContainer.innerHTML = `
                <div class="api-param">
                    <label>Tipo de Veículo:</label>
                    <select id="fipe-tipo">
                        <option value="carros">Carros</option>
                        <option value="motos">Motos</option>
                        <option value="caminhoes">Caminhões</option>
                    </select>
                </div>
                <div class="api-param">
                    <label>Código FIPE:</label>
                    <input type="text" id="fipe-codigo" placeholder="Ex: 001004-9">
                </div>
            `;
            break;
            
        case 'cep':
            apiParamsContainer.innerHTML = `
                <div class="api-param">
                    <label>CEP:</label>
                    <input type="text" id="cep" placeholder="Digite o CEP" maxlength="8">
                </div>
            `;
            break;
            
        case 'placeholder':
            apiParamsContainer.innerHTML = `
                <div class="api-param">
                    <label>Endpoint:</label>
                    <select id="placeholder-endpoint">
                        <option value="posts">Posts</option>
                        <option value="comments">Comentários</option>
                        <option value="albums">Álbuns</option>
                        <option value="photos">Fotos</option>
                        <option value="todos">Tarefas</option>
                        <option value="users">Usuários</option>
                    </select>
                </div>
                <div class="api-param">
                    <label>ID (1-100):</label>
                    <input type="number" id="placeholder-id" placeholder="1-100" min="1" max="100">
                </div>
            `;
            break;
            
        case 'brasilapi':
            apiParamsContainer.innerHTML = `
                <div class="api-param">
                    <label>Serviço:</label>
                    <select id="brasilapi-service">
                        <option value="cep/v2">CEP</option>
                        <option value="ddd/v1">DDD</option>
                        <option value="banks/v1">Bancos</option>
                    </select>
                </div>
                <div class="api-param">
                    <label>Parâmetro:</label>
                    <input type="text" id="brasilapi-param" placeholder="Depende do serviço">
                </div>
            `;
            break;
            
        case 'randomuser':
            apiParamsContainer.innerHTML = `
                <div class="api-param">
                    <label>Nacionalidade:</label>
                    <input type="text" id="user-nationality" placeholder="Ex: br" value="br">
                </div>
            `;
            break;
            
        case 'joke':
            apiParamsContainer.innerHTML = `
                <div class="api-param">
                    <label>Categoria:</label>
                    <select id="joke-category">
                        <option value="any">Qualquer</option>
                        <option value="programming">Programação</option>
                        <option value="misc">Diversos</option>
                    </select>
                </div>
            `;
            break;
    }
}

// Busca dados da API interativa
async function fetchInteractiveApiData() {
    const apiType = document.getElementById('apiType').value;
    const responseContainer = document.getElementById('api-response-content');
    responseContainer.innerHTML = '<div class="loader">Carregando...</div>';
    
    try {
        let data;
        let title;
        
        switch(apiType) {
            case 'fipe':
                data = await fetchFipeData();
                title = 'Consulta FIPE';
                break;
                
            case 'cep':
                data = await fetchCepData();
                title = 'Consulta de CEP';
                break;
                
            case 'placeholder':
                data = await fetchPlaceholderData();
                title = 'JSONPlaceholder';
                break;
                
            case 'brasilapi':
                data = await fetchBrasilApiData();
                title = 'BrasilAPI';
                break;
                
            case 'randomuser':
                data = await fetchRandomUser();
                title = 'Usuário Aleatório';
                break;
                
            case 'joke':
                data = await fetchJoke();
                title = 'Piada Aleatória';
                break;
        }
        
        if (data && data.error) {
            throw new Error(data.error);
        }

        const state = getState();
        state.interactiveApiData = { title, data };
        setState(state);
        
        displayApiResponse(data, responseContainer);
    } catch (error) {
        responseContainer.innerHTML = `
            <p class="error">Erro ao buscar dados: ${error.message}</p>
            <p>Tente novamente mais tarde ou verifique os parâmetros.</p>
        `;
        console.error('Erro na API interativa:', error);
    }
}

// Busca dados de múltiplas APIs
async function fetchMultipleApisData() {
    const responseContainer = document.getElementById('multi-api-content');
    responseContainer.innerHTML = '<div class="loader">Carregando dados de múltiplas APIs...</div>';
    
    try {
        const results = await Promise.all([
            fetchRandomUser().catch(e => ({ title: 'Usuário Aleatório', error: e.message })),
            fetchJoke().catch(e => ({ title: 'Piada Aleatória', error: e.message })),
            fetchCepData('01001000').catch(e => ({ title: 'CEP Exemplo', error: e.message }))
        ]);
        
        const state = getState();
        state.multiApiData = results.map((result, index) => ({
            title: ['Usuário Aleatório', 'Piada Aleatória', 'CEP Exemplo'][index],
            data: result
        }));
        
        setState(state);
        displayMultiApiResponses(state.multiApiData, responseContainer);
    } catch (error) {
        responseContainer.innerHTML = `
            <p class="error">Erro ao buscar dados: ${error.message}</p>
            <p>Algumas APIs podem estar temporariamente indisponíveis.</p>
        `;
        console.error('Erro nas múltiplas APIs:', error);
    }
}

// Implementações das APIs

async function fetchFipeData() {
    const tipo = document.getElementById('fipe-tipo').value;
    const codigo = document.getElementById('fipe-codigo').value;
    
    if (!codigo) {
        return { error: "Por favor, insira um código FIPE válido" };
    }

    try {
        const response = await fetchWithTimeout(`https://brasilapi.com.br/api/fipe/preco/v1/${codigo}`);
        if (!response.ok) throw new Error('Dados FIPE não encontrados');
        return await response.json();
    } catch (error) {
        console.error("Erro na API FIPE:", error);
        return { 
            error: "Não foi possível acessar os dados da FIPE",
            suggestion: "Verifique o código e tente novamente"
        };
    }
}

async function fetchCepData(cep = null) {
    cep = cep || document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        return { error: "CEP deve conter 8 dígitos" };
    }

    try {
        const response = await fetchWithTimeout(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error('CEP não encontrado');
        
        const data = await response.json();
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }
        return data;
    } catch (error) {
        console.error("Erro na API de CEP:", error);
        return { error: error.message };
    }
}

async function fetchPlaceholderData() {
    const endpoint = document.getElementById('placeholder-endpoint').value;
    const id = document.getElementById('placeholder-id').value;
    
    try {
        let url = `https://jsonplaceholder.typicode.com/${endpoint}`;
        if (id) url += `/${id}`;
        
        const response = await fetchWithTimeout(url);
        if (!response.ok) throw new Error('Dados não encontrados');
        return await response.json();
    } catch (error) {
        console.error("Erro no JSONPlaceholder:", error);
        return { error: error.message };
    }
}

async function fetchBrasilApiData() {
    const service = document.getElementById('brasilapi-service').value;
    const param = document.getElementById('brasilapi-param').value;
    
    try {
        let url = `https://brasilapi.com.br/api/${service}`;
        if (param) url += `/${param}`;
        
        const response = await fetchWithTimeout(url);
        if (!response.ok) throw new Error('Serviço indisponível');
        return await response.json();
    } catch (error) {
        console.error("Erro na BrasilAPI:", error);
        return { error: error.message };
    }
}

async function fetchRandomUser() {
    const nationality = document.getElementById('user-nationality')?.value || 'br';
    
    try {
        const response = await fetchWithTimeout(`https://randomuser.me/api/?nat=${nationality}`);
        if (!response.ok) throw new Error('Erro ao gerar usuário');
        
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error("Erro na API RandomUser:", error);
        return { 
            error: "Não foi possível gerar um usuário aleatório",
            name: { first: "Usuário", last: "Fictício" },
            picture: { large: "https://randomuser.me/api/portraits/lego/1.jpg" }
        };
    }
}

async function fetchJoke() {
    const category = document.getElementById('joke-category')?.value || 'any';
    
    try {
        const response = await fetchWithTimeout(`https://v2.jokeapi.dev/joke/${category}?lang=pt`);
        if (!response.ok) throw new Error('API de piadas indisponível');
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.message);
        }
        
        return data;
    } catch (error) {
        console.error("Erro na API de piadas:", error);
        
        // Fallback local com algumas piadas
        const localJokes = {
            programming: [
                {
                    setup: "Por que o JavaScript foi ao psicólogo?",
                    delivery: "Porque tinha muitos problemas não resolvidos!"
                }
            ],
            any: [
                {
                    joke: "Por que o livro de matemática estava triste? Porque tinha muitos problemas."
                }
            ]
        };
        
        const jokes = localJokes[category] || localJokes.any;
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        
        return randomJoke || {
            error: "Não foi possível carregar uma piada",
            message: error.message
        };
    }
}

// Função auxiliar para fetch com timeout
async function fetchWithTimeout(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('A requisição demorou muito - tempo esgotado');
        }
        throw error;
    }
}

// Funções de exibição
function displayApiResponse(data, container) {
    container.innerHTML = `
        <div class="api-response">
            <h4>Dados Recebidos</h4>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;
}

function displayMultiApiResponses(apisData, container) {
    container.innerHTML = `
        <div class="multi-api-grid">
            ${apisData.map(api => `
                <div class="api-card">
                    <h3>${api.title}</h3>
                    ${api.data.error ? 
                        `<p class="error">${api.data.error}</p>` : 
                        `<pre>${JSON.stringify(api.data, null, 2)}</pre>`
                    }
                </div>
            `).join('')}
        </div>
    `;
}