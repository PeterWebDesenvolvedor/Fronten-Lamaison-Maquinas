import api from './axios';

export const capturaService = {
  listar: async () => {
    const response = await api.get('/capturas');
    return response.data;
  },
  criar: async (data) => {
    const response = await api.post('/capturas', data);
    return response.data;
  },
  atualizar: async (id, data) => {
    const response = await api.put(`/capturas/${id}`, data);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/capturas/${id}`);
    return response.data;
  },
  aprovar: async (id) => {
    const response = await api.patch(`/capturas/${id}/aprovar`);
    return response.data;
  },
  recusar: async (id) => {
    const response = await api.patch(`/capturas/${id}/recusar`);
    return response.data;
  },
  listarPendentes: async () => {
    const response = await api.get('/capturas/pendentes');
    return response.data;
  },
  listarPorUsuario: async (usuarioId) => {
    const response = await api.get(`/capturas/usuario/${usuarioId}`);
    return response.data;
  }
};