import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Home from './Home';
import AdminPanel from './admin/AdminPanel';

const HospitalTrusteeApp = () => {
  const navigate = useNavigate();

  // Navigation handler for admin panel
  const handleNavigate = (screen) => {
    const routeMap = {
      'home': '/',
      'admin': '/admin'
    };
    const route = routeMap[screen] || '/';
    navigate(route);
  };

  return (
    <div className={`max-w-[430px] mx-auto bg-white shadow-2xl min-h-screen w-full overflow-y-auto`}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onNavigate={handleNavigate}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminPanel 
              onNavigate={handleNavigate}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default HospitalTrusteeApp;
