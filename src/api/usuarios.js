import api from './axios';

export const usuarioService = {
  listar: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },
  criar: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },
  atualizar: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
  deletarMultiplos: async (ids) => {
    const response = await api.delete('/usuarios', { data: { ids } });
    return response.data;
  }
};