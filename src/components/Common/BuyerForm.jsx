import React, { useState } from 'react';
import { X } from 'lucide-react';
import './CommonForms.css';

const BuyerForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nomeContato: '',
    tipoPessoa: 'empresa',
    nomeEmpresa: '',
    cidade: '',
    estado: '',
    telefone: '',
    email: '',
    divulgacao: 'site'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'pendente'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cadastrar Cliente Interessado</h3>
          <button onClick={onClose} className="modal-close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome do Contato *</label>
            <input type="text" value={formData.nomeContato} onChange={(e) => setFormData({...formData, nomeContato: e.target.value})} required />
          </div>

          <div className="form-group">
            <label>Nome da Empresa *</label>
            <input type="text" value={formData.nomeEmpresa} onChange={(e) => setFormData({...formData, nomeEmpresa: e.target.value})} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cidade *</label>
              <input type="text" value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} required>
                <option value="">Selecione</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
                <option value="PR">PR</option>
                <option value="RS">RS</option>
                <option value="SC">SC</option>
                <option value="BA">BA</option>
                <option value="DF">DF</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telefone *</label>
              <input type="tel" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">Cadastrar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerForm;