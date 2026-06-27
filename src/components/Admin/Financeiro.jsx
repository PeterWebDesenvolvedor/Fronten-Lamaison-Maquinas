import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Package } from 'lucide-react';
import { transacaoService } from '../../api';
import './Financeiro.css';

const Financeiro = () => {
  const [transactions, setTransactions] = useState([]);
  const [commissionStats, setCommissionStats] = useState({
    totalCommissions: 0,
    machineBringer: 0,
    buyerBringer: 0,
    seller: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await transacaoService.listar();
      const data = response.data || response || [];
      setTransactions(data);

      const totalCommissions = data.reduce((sum, t) => sum + (t.comissao || 0), 0);
      const machineBringer = data.reduce((sum, t) => sum + (t.comissaoMachineBringer || 0), 0);
      const buyerBringer = data.reduce((sum, t) => sum + (t.comissaoBuyerBringer || 0), 0);
      const seller = data.reduce((sum, t) => sum + (t.comissaoSeller || 0), 0);

      setCommissionStats({ totalCommissions, machineBringer, buyerBringer, seller });
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financeiro-container">
      <div className="page-header">
        <h2>Financeiro</h2>
        <p>Visão geral de transações e comissões</p>
      </div>

      {loading ? (
        <div className="loading-state">Carregando...</div>
      ) : (
        <>
          <div className="commission-stats">
            <div className="stat-card-total">
              <div className="stat-icon-total">
                <DollarSign size={32} />
              </div>
              <div>
                <h3>Total em Comissões</h3>
                <p className="stat-value-total">R$ {commissionStats.totalCommissions.toLocaleString()}</p>
              </div>
            </div>

            <div className="commission-breakdown">
              <h3>Distribuição de Comissões (5% do valor total)</h3>
              <div className="breakdown-grid">
                <div className="breakdown-card" style={{ background: '#a97421' }}>
                  <h4>Quem trouxe a máquina</h4>
                  <p className="percentage">20%</p>
                  <p className="amount">R$ {commissionStats.machineBringer.toLocaleString()}</p>
                </div>
                <div className="breakdown-card" style={{ background: '#C29C6B' }}>
                  <h4>Quem trouxe o comprador</h4>
                  <p className="percentage">30%</p>
                  <p className="amount">R$ {commissionStats.buyerBringer.toLocaleString()}</p>
                </div>
                <div className="breakdown-card" style={{ background: '#604A35' }}>
                  <h4>Quem vendeu</h4>
                  <p className="percentage">50%</p>
                  <p className="amount">R$ {commissionStats.seller.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="transactions-section">
            <h3>Histórico de Transações</h3>
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <h5>{transaction.produto}</h5>
                  <span className="transaction-value">R$ {transaction.valor?.toLocaleString()}</span>
                </div>
                <div className="transaction-details">
                  <div><strong>Vendedor:</strong> {transaction.vendedor}</div>
                  <div><strong>Comprador:</strong> {transaction.comprador}</div>
                  <div><strong>Data:</strong> {new Date(transaction.data).toLocaleDateString('pt-BR')}</div>
                </div>
                <div className="transaction-commission">
                  <span>Comissão: R$ {transaction.comissao?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Financeiro;