import React from 'react';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';

const AppRoutes = ({ activeTab, setActiveTab }) => {
  const handleNavigateHome = () => {
    setActiveTab('user');
  };

  switch (activeTab) {
    case 'user':
      return <UserDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <NotFound onNavigateHome={handleNavigateHome} />;
  }
};

export default AppRoutes;