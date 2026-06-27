import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Package, Users } from 'lucide-react';
import { vendaService, capturaService } from '../../api';
import './Aprovacoes.css';

const Aprovacoes = () => {
  const [pendingSales, setPendingSales] = useState([]);
  const [pendingCaptures, setPendingCaptures] = useState([]);
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setLoading(true);
    try {
      const [salesRes, capturesRes] = await Promise.all([
        vendaService.listarPendentes(),
        capturaService.listarPendentes()
      ]);

      setPendingSales(salesRes.data || salesRes || []);
      setPendingCaptures(capturesRes.data || capturesRes || []);
    } catch (err) {
      setError('Erro ao carregar pendentes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item, type) => {
    try {
      if (type === 'sale') {
        await vendaService.aprovar(item.id);
      } else {
        await capturaService.aprovar(item.id);
      }
      await loadPending();
      alert('Item aprovado com sucesso!');
    } catch (err) {
      alert('Erro ao aprovar item');
    }
  };

  const handleReject = async (item, type) => {
    if (!window.confirm('Recusar este item?')) return;
    try {
      if (type === 'sale') {
        await vendaService.recusar(item.id);
      } else {
        await capturaService.recusar(item.id);
      }
      await loadPending();
      alert('Item recusado!');
    } catch (err) {
      alert('Erro ao recusar item');
    }
  };

  return (
    <div className="aprovacoes-container">
      <div className="page-header">
        <h2>Aprovações Pendentes</h2>
        <p>Revise os itens cadastrados pelos usuários</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="approval-tabs">
        <button
          className={`approval-tab ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <Package size={18} />
          Máquinas ({pendingSales.length})
        </button>
        <button
          className={`approval-tab ${activeTab === 'captures' ? 'active' : ''}`}
          onClick={() => setActiveTab('captures')}
        >
          <Users size={18} />
          Clientes ({pendingCaptures.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Carregando...</div>
      ) : activeTab === 'sales' ? (
        pendingSales.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} />
            <p>Nenhuma máquina aguardando aprovação</p>
          </div>
        ) : (
          pendingSales.map(sale => (
            <div key={sale.id} className="approval-card">
              <div className="approval-header">
                <h3>{sale.nomeMaquina}</h3>
                <span className="user-name">Por: {sale.userName}</span>
              </div>
              <div className="approval-details">
                <div className="detail-grid">
                  <div><strong>Modelo:</strong> {sale.modelo}</div>
                  <div><strong>Ano:</strong> {sale.anoFabricacao}</div>
                  <div><strong>Preço:</strong> R$ {sale.preco?.toLocaleString()}</div>
                  <div><strong>Empresa:</strong> {sale.nomeEmpresa}</div>
                  <div><strong>Telefone:</strong> {sale.telefone}</div>
                </div>
                {sale.observacoes && (
                  <div className="observations">
                    <strong>Observações:</strong>
                    <p>{sale.observacoes}</p>
                  </div>
                )}
              </div>
              <div className="approval-actions">
                <button onClick={() => handleApprove(sale, 'sale')} className="btn-approve">
                  <CheckCircle size={18} /> Aprovar
                </button>
                <button onClick={() => handleReject(sale, 'sale')} className="btn-reject">
                  <XCircle size={18} /> Recusar
                </button>
              </div>
            </div>
          ))
        )
      ) : (
        pendingCaptures.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} />
            <p>Nenhum cliente aguardando aprovação</p>
          </div>
        ) : (
          pendingCaptures.map(capture => (
            <div key={capture.id} className="approval-card">
              <div className="approval-header">
                <h3>{capture.nomeContato}</h3>
                <span className="user-name">Por: {capture.userName}</span>
              </div>
              <div className="approval-details">
                <div className="detail-grid">
                  <div><strong>Empresa:</strong> {capture.nomeEmpresa}</div>
                  <div><strong>Cidade/UF:</strong> {capture.cidade}/{capture.estado}</div>
                  <div><strong>Telefone:</strong> {capture.telefone}</div>
                  <div><strong>Email:</strong> {capture.email || 'Não informado'}</div>
                </div>
              </div>
              <div className="approval-actions">
                <button onClick={() => handleApprove(capture, 'capture')} className="btn-approve">
                  <CheckCircle size={18} /> Aprovar
                </button>
                <button onClick={() => handleReject(capture, 'capture')} className="btn-reject">
                  <XCircle size={18} /> Recusar
                </button>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default Aprovacoes;