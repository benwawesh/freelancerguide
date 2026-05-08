import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import GuideDetail from './pages/GuideDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateGuide from './pages/admin/CreateGuide';
import EditGuide from './pages/admin/EditGuide';
import HeroSettings from './pages/admin/HeroSettings';
import SocialSettings from './pages/admin/SocialSettings';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/guide/:id" element={<GuideDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/guides/create" element={<CreateGuide />} />
        <Route path="/admin/guides/edit/:id" element={<EditGuide />} />
        <Route path="/admin/settings" element={<HeroSettings />} />
        <Route path="/admin/social-settings" element={<SocialSettings />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;