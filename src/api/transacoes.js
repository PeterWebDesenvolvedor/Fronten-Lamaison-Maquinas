import api from './axios';

export const transacaoService = {
  listar: async () => {
    const response = await api.get('/transacoes');
    return response.data;
  },
  listarComissoes: async () => {
    const response = await api.get('/transacoes/comissoes');
    return response.data;
  },
  listarComissoesPorUsuario: async (usuarioId) => {
    const response = await api.get(`/transacoes/comissoes/${usuarioId}`);
    return response.data;
  }
};