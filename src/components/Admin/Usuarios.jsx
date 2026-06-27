import React, { useState, useEffect } from 'react';
import { Edit2, Search, Plus, Trash2, X } from 'lucide-react';
import { usuarioService } from '../../api';
import './Usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    senha: '',
    role: 'USER',
    tipo: 'V'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usuarioService.listar();
      setUsers(response.data || response || []);
    } catch (err) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Excluir ${selectedUsers.length} usuário(s)?`)) return;
    setLoading(true);
    try {
      await usuarioService.deletarMultiplos(selectedUsers);
      setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    } catch (err) {
      setError('Erro ao excluir usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingUser) {
        await usuarioService.atualizar(editingUser.id, formData);
      } else {
        await usuarioService.criar(formData);
      }
      await loadUsers();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <div className="page-header">
        <h2>Gerenciar Usuários</h2>
        <button onClick={() => setShowModal(true)} className="btn-add">
          <Plus size={18} /> Novo Usuário
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
        {selectedUsers.length > 0 && (
          <button onClick={handleDeleteSelected} className="btn-delete-selected">
            <Trash2 size={18} /> Excluir ({selectedUsers.length})
          </button>
        )}
      </div>

      <div className="users-table">
        {loading ? (
          <div className="loading-state">Carregando...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={(e) => setSelectedUsers(e.target.checked ? users.map(u => u.id) : [])}
                  />
                </th>
                <th>Nome</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => setSelectedUsers(prev =>
                        prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                      )}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge status-${user.role?.toLowerCase()}`}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Comum'}
                    </span>
                  </td>
                  <td>
                    <span className="tipo-badge">{user.tipo}</span>
                  </td>
                  <td>
                    <button onClick={() => {
                      setEditingUser(user);
                      setFormData({ ...user, senha: '' });
                      setShowModal(true);
                    }} className="btn-edit">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha {!editingUser && '*'}</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? 'Deixe em branco para manter' : ''}
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">Comum</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                >
                  <option value="V">Vendedor</option>
                  <option value="R">Representante</option>
                  <option value="E">Empresa</option>
                  <option value="A">Apontador</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Salvando...' : editingUser ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;