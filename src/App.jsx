import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './styles/global.css';

const Login = lazy(() => import('./components/Login/Login'));
const Layout = lazy(() => import('./components/Layout/Layout'));
const Dashboard = lazy(() => import('./components/Admin/Dashboard'));
const Usuarios = lazy(() => import('./components/Admin/Usuarios'));
const Produtos = lazy(() => import('./components/Admin/Produtos'));
const Financeiro = lazy(() => import('./components/Admin/Financeiro'));
const Negociacoes = lazy(() => import('./components/Admin/Negociacoes'));
const Aprovacoes = lazy(() => import('./components/Admin/Aprovacoes'));
const UserDashboard = lazy(() => import('./components/User/UserDashboard'));

function App() {
  const { user, logout, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return <div className="loading-state">Carregando...</div>;
  }

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (isAdmin) {
      navigate(`/admin/${page}`);
    } else {
      navigate(`/app/${page}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Suspense fallback={<div className="loading-state">Carregando página...</div>}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        <Route
          path="/admin/*"
          element={
            user && isAdmin ? (
              <Layout
                user={user}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                currentPage={currentPage}
                isAdmin={true}
              >
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="usuarios" element={<Usuarios />} />
                  <Route path="produtos" element={<Produtos />} />
                  <Route path="financeiro" element={<Financeiro />} />
                  <Route path="negociacoes" element={<Negociacoes />} />
                  <Route path="aprovacoes" element={<Aprovacoes />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/app/*"
          element={
            user && !isAdmin ? (
              <Layout
                user={user}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                currentPage={currentPage}
                isAdmin={false}
              >
                <Routes>
                  <Route path="dashboard" element={<UserDashboard user={user} />} />
                  <Route path="produtos" element={<UserDashboard user={user} />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/"
          element={
            user ? (
              isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/app/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;