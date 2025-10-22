const API_BASE_URL = 'http://localhost:3000/api/v1';

// Função para fazer requisições com autenticação
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse da resposta JSON:', parseError);
      throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
      console.error('❌ Erro na requisição:', data);
      throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Erro na requisição fetch:', error);
    throw error;
  }
};

// API de Autenticação
export const authAPI = {
  register: async (userData) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  me: async () => {
    return fetchWithAuth('/auth/me');
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
    
    return fetchWithAuth(url);
  },

  criar: async (vendaData) => {
    return fetchWithAuth('/vendas', {
      method: 'POST',
      body: JSON.stringify(vendaData),
    });
  },

  importar: async (vendas) => {
    return fetchWithAuth('/vendas/importar', {
      method: 'POST',
      body: JSON.stringify({ vendas }),
    });
  },
};

// API de Clientes
export const clientesAPI = {
  listar: async () => {
    return fetchWithAuth('/clientes');
  },
  
  criar: async (clienteData) => {
    return fetchWithAuth('/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData),
    });
  },
};

// API de Produtos
export const produtosAPI = {
  listar: async () => {
    return fetchWithAuth('/produtos');
  },
  
  criar: async (produtoData) => {
    return fetchWithAuth('/produtos', {
      method: 'POST',
      body: JSON.stringify(produtoData),
    });
  },
};

// API de Categorias
export const categoriasAPI = {
  listar: async () => {
    return fetchWithAuth('/categorias');
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
    
    return fetchWithAuth(url);
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

