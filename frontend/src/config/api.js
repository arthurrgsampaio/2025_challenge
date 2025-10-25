const API_BASE_URL = 'http://localhost:3000/api/v1';

// Função para fazer requisições à API
const fetchAPI = async (url, options = {}) => {
  const silent = options.silent || false; // Não mostrar erros no console
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: 'include', // Importante para enviar cookies de sessão
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      if (!silent) {
        console.error('❌ Erro ao fazer parse da resposta JSON:', parseError);
      }
      throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
      if (!silent) {
        console.error('❌ Erro na requisição:', data);
      }
      throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (!silent) {
      console.error('❌ Erro na requisição fetch:', error);
    }
    throw error;
  }
};

// API de Autenticação
export const authAPI = {
  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, senha) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  },

  logout: async () => {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return fetchAPI('/auth/me', { silent: true }); // Não mostrar erros no console
  },
};

// API de Vendas
export const vendasAPI = {
  listar: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.idProduto) params.append('idProduto', filtros.idProduto);
    if (filtros.idCliente) params.append('idCliente', filtros.idCliente);
    if (filtros.idCategoria) params.append('idCategoria', filtros.idCategoria);
    
    const queryString = params.toString();
    const url = `/vendas${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI(url);
  },

  criar: async (vendaData) => {
    return fetchAPI('/vendas', {
      method: 'POST',
      body: JSON.stringify(vendaData),
    });
  },

  importar: async (vendas) => {
    return fetchAPI('/vendas/importar', {
      method: 'POST',
      body: JSON.stringify({ vendas }),
    });
  },
};

// API de Clientes
export const clientesAPI = {
  listar: async () => {
    return fetchAPI('/clientes');
  },
  
  criar: async (clienteData) => {
    return fetchAPI('/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData),
    });
  },
};

// API de Produtos
export const produtosAPI = {
  listar: async () => {
    return fetchAPI('/produtos');
  },
  
  criar: async (produtoData) => {
    return fetchAPI('/produtos', {
      method: 'POST',
      body: JSON.stringify(produtoData),
    });
  },
};

// API de Categorias
export const categoriasAPI = {
  listar: async () => {
    return fetchAPI('/categorias');
  },
};

// API de Analytics
export const analyticsAPI = {
  overview: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    
    const queryString = params.toString();
    const url = `/analytics/overview${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI(url);
  },
};

export default {
  authAPI,
  vendasAPI,
  clientesAPI,
  produtosAPI,
  categoriasAPI,
  analyticsAPI,
};

