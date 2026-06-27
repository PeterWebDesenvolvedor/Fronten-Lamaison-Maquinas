import React, { useState, useEffect } from 'react';
import { Edit2, Search, Plus, Trash2, X } from 'lucide-react';
import { produtoService } from '../../api';
import './Produtos.css';

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    preco: '',
    descricao: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await produtoService.listar();
      setProducts(response.data || response || []);
    } catch (err) {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Excluir ${selectedProducts.length} produto(s)?`)) return;
    setLoading(true);
    try {
      await Promise.all(selectedProducts.map(id => produtoService.deletar(id)));
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    } catch (err) {
      setError('Erro ao excluir produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      nome: formData.nome,
      categoria: formData.categoria,
      preco: parseFloat(formData.preco),
      descricao: formData.descricao
    };

    try {
      if (editingProduct) {
        await produtoService.atualizar(editingProduct.id, payload);
      } else {
        await produtoService.criar(payload);
      }
      await loadProducts();
      setShowModal(false);
    } catch (err) {
      setError('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="produtos-container">
      <div className="page-header">
        <h2>Gerenciar Produtos</h2>
        <button onClick={() => setShowModal(true)} className="btn-add">
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <div className="search-input-group">
          <Search size={20} />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedProducts.length > 0 && (
          <button onClick={handleDeleteSelected} className="btn-delete-selected">
            <Trash2 size={18} /> Excluir ({selectedProducts.length})
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Carregando...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-checkbox">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => setSelectedProducts(prev =>
                    prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
                  )}
                />
              </div>
              <div className="product-content">
                <h3>{product.nome}</h3>
                <span className="product-category">{product.categoria}</span>
                <p className="product-description">{product.descricao}</p>
                <div className="product-footer">
                  <span className="product-price">
                    R$ {product.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button onClick={() => {
                    setEditingProduct(product);
                    setFormData(product);
                    setShowModal(true);
                  }} className="btn-edit">
                    <Edit2 size={16} /> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Salvando...' : editingProduct ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;