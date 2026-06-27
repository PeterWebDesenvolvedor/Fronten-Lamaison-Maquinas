import React, { useState } from 'react';
import { X } from 'lucide-react';
import './CommonForms.css';

const SellerForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nomeMaquina: '',
    pais: '',
    modelo: '',
    anoFabricacao: '',
    observacoes: '',
    preco: '',
    nomeEmpresa: '',
    telefone: '',
    divulgacao: 'site'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      preco: parseFloat(formData.preco),
      status: 'pendente'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Anunciar Máquina para Venda</h3>
          <button onClick={onClose} className="modal-close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome da Máquina *</label>
              <input type="text" value={formData.nomeMaquina} onChange={(e) => setFormData({...formData, nomeMaquina: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>País de Origem *</label>
              <input type="text" value={formData.pais} onChange={(e) => setFormData({...formData, pais: e.target.value})} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Modelo *</label>
              <input type="text" value={formData.modelo} onChange={(e) => setFormData({...formData, modelo: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Ano de Fabricação *</label>
              <input type="number" value={formData.anoFabricacao} onChange={(e) => setFormData({...formData, anoFabricacao: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label>Preço de Venda (R$) *</label>
            <input type="number" step="0.01" value={formData.preco} onChange={(e) => setFormData({...formData, preco: e.target.value})} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nome da Empresa *</label>
              <input type="text" value={formData.nomeEmpresa} onChange={(e) => setFormData({...formData, nomeEmpresa: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Telefone *</label>
              <input type="tel" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} rows="3" />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">Anunciar Máquina</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerForm;