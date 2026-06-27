import React, { useState, useEffect } from 'react';
import { Package, Users, TrendingUp, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { produtoService, vendaService, capturaService } from '../../api';
import SellerForm from '../Common/SellerForm';
import BuyerForm from '../Common/BuyerForm';
import './UserDashboard.css';

const UserDashboard = ({ user }) => {
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [mySales, setMySales] = useState([]);
  const [myCaptures, setMyCaptures] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('sales');
  const [showCatalog, setShowCatalog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesRes, capturesRes, productsRes] = await Promise.all([
        vendaService.listarPorUsuario(user.id),
        capturaService.listarPorUsuario(user.id),
        produtoService.listar()
      ]);

      setMySales(salesRes.data || salesRes || []);
      setMyCaptures(capturesRes.data || capturesRes || []);
      setProducts(productsRes.data || productsRes || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSale = async (data) => {
    try {
      await vendaService.criar({ ...data, userId: user.id, userName: user.name });
      await loadData();
      setShowSellerModal(false);
      alert('Máquina anunciada! Aguardando aprovação.');
    } catch (err) {
      alert('Erro ao anunciar máquina');
    }
  };

  const handleNewCapture = async (data) => {
    try {
      await capturaService.criar({ ...data, userId: user.id, userName: user.name });
      await loadData();
      setShowBuyerModal(false);
      alert('Cliente cadastrado! Aguardando aprovação.');
    } catch (err) {
      alert('Erro ao cadastrar cliente');
    }
  };

  if (showCatalog) {
    return (
      <div className="user-dashboard">
        <div className="welcome-section">
          <button onClick={() => setShowCatalog(false)} className="back-btn">← Voltar</button>
          <h2>Catálogo de Máquinas</h2>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card-catalog">
              <h3>{product.nome}</h3>
              <span className="category">{product.categoria}</span>
              <p className="description">{product.descricao}</p>
              <div className="product-footer">
                <span className="price">R$ {product.preco?.toLocaleString()}</span>
                <button className="btn-interest">Tenho Interesse</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="welcome-section">
        <h2>Olá, {user.name}!</h2>
        <p>Bem-vindo ao sistema Lamaison Máquinas</p>
      </div>

      <div className="action-cards">
        <div className="action-card sell-card" onClick={() => setShowSellerModal(true)}>
          <Package size={32} />
          <h3>Quero Vender</h3>
          <p>Anuncie sua máquina</p>
        </div>
        <div className="action-card capture-card" onClick={() => setShowBuyerModal(true)}>
          <Users size={32} />
          <h3>Tenho um Comprador</h3>
          <p>Indique um cliente</p>
        </div>
        <div className="action-card catalog-card" onClick={() => setShowCatalog(true)}>
          <Eye size={32} />
          <h3>Ver Catálogo</h3>
          <p>Consulte máquinas</p>
        </div>
      </div>

      <div className="my-activities">
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
            <Package size={16} /> Minhas Vendas
          </button>
          <button className={`tab-btn ${activeTab === 'captures' ? 'active' : ''}`} onClick={() => setActiveTab('captures')}>
            <Users size={16} /> Meus Clientes
          </button>
        </div>

        <div className="activities-list">
          {loading ? (
            <div className="loading-state">Carregando...</div>
          ) : activeTab === 'sales' ? (
            mySales.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>Nenhuma máquina anunciada</p>
                <button onClick={() => setShowSellerModal(true)} className="btn-empty">Anunciar Máquina</button>
              </div>
            ) : (
              mySales.map(sale => (
                <div key={sale.id} className="activity-card">
                  <div className="activity-header">
                    <h4>{sale.nomeMaquina}</h4>
                    <span className={`status-badge status-${sale.status}`}>
                      {sale.status === 'pendente' ? 'Aguardando' : sale.status === 'ativo' ? 'Aprovado' : 'Recusado'}
                    </span>
                  </div>
                  <div className="activity-details">
                    <div><span className="label">Modelo:</span> {sale.modelo}</div>
                    <div><span className="label">Ano:</span> {sale.anoFabricacao}</div>
                    <div><span className="label">Preço:</span> <span className="price">R$ {sale.preco?.toLocaleString()}</span></div>
                  </div>
                </div>
              ))
            )
          ) : (
            myCaptures.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>Nenhum cliente cadastrado</p>
                <button onClick={() => setShowBuyerModal(true)} className="btn-empty">Cadastrar Cliente</button>
              </div>
            ) : (
              myCaptures.map(capture => (
                <div key={capture.id} className="activity-card">
                  <div className="activity-header">
                    <h4>{capture.nomeContato}</h4>
                    <span className={`status-badge status-${capture.status}`}>
                      {capture.status === 'pendente' ? 'Aguardando' : capture.status === 'ativo' ? 'Aprovado' : 'Recusado'}
                    </span>
                  </div>
                  <div className="activity-details">
                    <div><span className="label">Empresa:</span> {capture.nomeEmpresa}</div>
                    <div><span className="label">Localização:</span> {capture.cidade}/{capture.estado}</div>
                    <div><span className="label">Telefone:</span> {capture.telefone}</div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {showSellerModal && <SellerForm onClose={() => setShowSellerModal(false)} onSubmit={handleNewSale} />}
      {showBuyerModal && <BuyerForm onClose={() => setShowBuyerModal(false)} onSubmit={handleNewCapture} />}
    </div>
  );
};

export default UserDashboard;