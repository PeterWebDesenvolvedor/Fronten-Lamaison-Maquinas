import React, { useState, useEffect } from 'react';
import { UserCheck, Package, TrendingUp, Clock } from 'lucide-react';
import { usuarioService, produtoService, vendaService } from '../../api';
import './Negociacoes.css';

const Negociacoes = () => {
  const [sellers, setSellers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes, salesRes] = await Promise.all([
        usuarioService.listar(),
        produtoService.listar(),
        vendaService.listar()
      ]);

      const users = usersRes.data || usersRes || [];
      const products = productsRes.data || productsRes || [];
      const sales = salesRes.data || salesRes || [];

      const activeSellers = users
        .filter(u => u.ativo !== false && ['V', 'R', 'E'].includes(u.tipo))
        .map(user => ({
          id: user.id,
          name: user.name,
          type: user.tipo,
          activeProducts: products.filter(p => p.vendedorId === user.id).length,
          totalSales: sales.filter(s => s.vendedorId === user.id).length,
          status: 'active'
        }));

      setSellers(activeSellers);

      const activeListings = products
        .filter(p => p.ativo !== false)
        .map(product => ({
          id: product.id,
          product: product.nome,
          seller: product.vendedorNome || 'Desconhecido',
          price: product.preco || 0,
          status: 'active',
          views: product.visualizacoes || 0,
          interested: product.interessados || 0
        }));

      setListings(activeListings);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="negociacoes-container">
      <div className="page-header">
        <h2>Negociações</h2>
        <p>Acompanhe as negociações ativas</p>
      </div>

      {loading ? (
        <div className="loading-state">Carregando...</div>
      ) : (
        <>
          <div className="negotiation-stats">
            <div className="stat-card">
              <UserCheck size={32} color="#a97421" />
              <div>
                <h3>Vendedores Ativos</h3>
                <p className="stat-number">{sellers.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
            <div className="stat-card">
              <Package size={32} color="#C29C6B" />
              <div>
                <h3>Produtos Anunciados</h3>
                <p className="stat-number">{listings.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp size={32} color="#604A35" />
              <div>
                <h3>Total de Interessados</h3>
                <p className="stat-number">{listings.reduce((sum, l) => sum + (l.interested || 0), 0)}</p>
              </div>
            </div>
          </div>

          <div className="sellers-section">
            <h3>Vendedores Ativos</h3>
            <div className="sellers-grid">
              {sellers.filter(s => s.status === 'active').map(seller => (
                <div key={seller.id} className="seller-card">
                  <h4>{seller.name}</h4>
                  <span className="seller-type">{seller.type}</span>
                  <div className="seller-stats">
                    <div><span className="label">Produtos:</span> {seller.activeProducts}</div>
                    <div><span className="label">Vendas:</span> {seller.totalSales}</div>
                  </div>
                  <div className="seller-status active">
                    <Clock size={14} /> Ativo
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="listings-section">
            <h3>Produtos em Anúncio</h3>
            <div className="listings-table">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Vendedor</th>
                    <th>Preço</th>
                    <th>Visualizações</th>
                    <th>Interessados</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id}>
                      <td className="product-name">{listing.product}</td>
                      <td>{listing.seller}</td>
                      <td className="price">R$ {listing.price.toLocaleString()}</td>
                      <td>{listing.views}</td>
                      <td>{listing.interested}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Negociacoes;