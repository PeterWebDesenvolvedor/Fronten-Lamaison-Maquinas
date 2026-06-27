import React, { useState, useEffect } from 'react';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';
import { usuarioService, produtoService, transacaoService } from '../../api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    activeNegotiations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [users, products, transactions] = await Promise.all([
        usuarioService.listar(),
        produtoService.listar(),
        transacaoService.listar()
      ]);

      const usersData = users.data || users || [];
      const productsData = products.data || products || [];
      const transactionsData = transactions.data || transactions || [];

      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalRevenue: transactionsData.reduce((sum, t) => sum + (t.valor || 0), 0),
        activeNegotiations: transactionsData.filter(t => t.status === 'ativo').length
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { icon: Users, title: 'Total Usuários', value: stats.totalUsers, color: '#a97421' },
    { icon: Package, title: 'Total Produtos', value: stats.totalProducts, color: '#C29C6B' },
    { icon: DollarSign, title: 'Faturamento', value: `R$ ${stats.totalRevenue.toLocaleString()}`, color: '#604A35' },
    { icon: TrendingUp, title: 'Negociações Ativas', value: stats.activeNegotiations, color: '#302F32' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Visão geral do sistema</p>
      </div>

      {loading ? (
        <div className="loading-state">Carregando dados...</div>
      ) : (
        <div className="stats-grid">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ color: card.color }}>
                  <Icon size={32} />
                </div>
                <div className="stat-info">
                  <h3>{card.title}</h3>
                  <p className="stat-value">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;