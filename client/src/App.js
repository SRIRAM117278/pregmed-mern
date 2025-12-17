import React from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import PregnancyGuidance from './components/PregnancyGuidance';
import Appointments from './components/Appointments';
import HealthRecords from './components/HealthRecords';
import Community from './components/Community';
import { useAuth } from './context/AuthContext';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="spinner" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-content">
          <NavLink className="navbar-brand" to={user ? '/guidance' : '/login'}>
            Pregmed
          </NavLink>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li><NavLink to="/guidance">Guidance</NavLink></li>
                <li><NavLink to="/appointments">Appointments</NavLink></li>
                <li><NavLink to="/health-records">Health Records</NavLink></li>
                <li><NavLink to="/community">Community</NavLink></li>
              </>
            ) : (
              <>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
              </>
            )}
          </ul>

          <div className="navbar-user">
            {!loading && user ? (
              <>
                <span>{user.firstName}</span>
                <button type="button" className="btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/guidance' : '/login'} replace />} />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/guidance" replace />
              ) : (
                <Login onSuccess={() => navigate('/guidance')} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/guidance" replace />
              ) : (
                <Register onSuccess={() => navigate('/guidance')} />
              )
            }
          />

          <Route
            path="/guidance"
            element={
              <RequireAuth>
                <PregnancyGuidance />
              </RequireAuth>
            }
          />
          <Route
            path="/appointments"
            element={
              <RequireAuth>
                <Appointments />
              </RequireAuth>
            }
          />
          <Route
            path="/health-records"
            element={
              <RequireAuth>
                <HealthRecords />
              </RequireAuth>
            }
          />
          <Route
            path="/community"
            element={
              <RequireAuth>
                <Community />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
