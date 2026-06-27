import api from './axios';

export const produtoService = {
  listar: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },
  criar: async (data) => {
    const response = await api.post('/produtos', data);
    return response.data;
  },
  atualizar: async (id, data) => {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  },
  deletarMultiplos: async (ids) => {
    const response = await api.delete('/produtos', { data: { ids } });
    return response.data;
  }
};