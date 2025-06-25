import React, { useState } from 'react';
import Navbar from './components/shared/Navbar';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('user');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <AppRoutes activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
