import api from './axios';

export const vendaService = {
  listar: async () => {
    const response = await api.get('/vendas');
    return response.data;
  },
  criar: async (data) => {
    const response = await api.post('/vendas', data);
    return response.data;
  },
  atualizar: async (id, data) => {
    const response = await api.put(`/vendas/${id}`, data);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/vendas/${id}`);
    return response.data;
  },
  aprovar: async (id) => {
    const response = await api.patch(`/vendas/${id}/aprovar`);
    return response.data;
  },
  recusar: async (id) => {
    const response = await api.patch(`/vendas/${id}/recusar`);
    return response.data;
  },
  listarPendentes: async () => {
    const response = await api.get('/vendas/pendentes');
    return response.data;
  },
  listarPorUsuario: async (usuarioId) => {
    const response = await api.get(`/vendas/usuario/${usuarioId}`);
    return response.data;
  }
};