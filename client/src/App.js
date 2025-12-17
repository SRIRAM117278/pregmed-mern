import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Appointments from './components/Appointments';
import HealthRecords from './components/HealthRecords';
import Community from './components/Community';
import PregnancyGuidance from './components/PregnancyGuidance';
import './index.css';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (!user) {
    return isRegistering ? (
      <Register onSuccess={() => setIsRegistering(false)} />
    ) : (
      <div>
        <Login onSuccess={() => {}} />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => setIsRegistering(true)} 
            className="btn-secondary"
            style={{ marginTop: '10px' }}
          >
            Don't have an account? Register here
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">Pregmed</Link>
          <ul className="navbar-nav">
            <li><Link to="/guidance">Guidance</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/health-records">Health Records</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li className="navbar-user">
              <span>Welcome, {user.firstName}!</span>
              <button onClick={logout} className="btn-secondary">Logout</button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/guidance" element={<PregnancyGuidance />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Welcome to Pregmed</h1>
      <p>Your healthcare companion for a healthy pregnancy</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <DashboardCard 
          title="Pregnancy Guidance" 
          description="Get week-by-week guidance for your pregnancy journey"
          link="/guidance"
        />
        <DashboardCard 
          title="Appointments" 
          description="Schedule and manage your healthcare appointments"
          link="/appointments"
        />
        <DashboardCard 
          title="Health Records" 
          description="Keep track of your health metrics and reports"
          link="/health-records"
        />
        <DashboardCard 
          title="Community" 
          description="Connect with other expectant mothers and share experiences"
          link="/community"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, link }) => {
  return (
    <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        border: '1px solid #eee',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
