import React from 'react';
import { HelpCircle, User, Settings, Bot } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'user',
      label: 'Submit Ticket',
      icon: User,
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: Settings,
      gradient: 'from-purple-600 to-purple-700'
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 shadow-2xl border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-10 w-10 text-blue-400" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Helpdesk
              </h1>
              <p className="text-xs text-gray-400">Intelligent IT Support</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    relative inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-300 transform hover:scale-105
                    ${isActive 
                      ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 shadow-lg' 
                      : 'text-white hover:bg-white/10 hover:backdrop-blur-sm'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-blue-600' : 'text-current'}`} />
                  {item.label}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
