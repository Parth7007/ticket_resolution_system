import React, { useState } from 'react';
import { 
  Clock, AlertTriangle, CheckCircle, Settings, 
  Bot, User, Edit3, Save, X, ExternalLink 
} from 'lucide-react';

const TicketCard = ({ ticket, showAdminActions = false, onUpdateAdminSolution }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminSolution, setAdminSolution] = useState(ticket.admin_solution || '');

  const getPriorityConfig = (priority) => {
    const configs = {
      high: {
        color: 'text-red-700 bg-red-100 border-red-200',
        icon: AlertTriangle,
        pulse: 'animate-pulse'
      },
      medium: {
        color: 'text-yellow-700 bg-yellow-100 border-yellow-200',
        icon: Clock,
        pulse: ''
      },
      low: {
        color: 'text-green-700 bg-green-100 border-green-200',
        icon: CheckCircle,
        pulse: ''
      }
    };
    return configs[priority?.toLowerCase()] || configs.medium;
  };

  const getTypeConfig = (type) => {
    const configs = {
      software: {
        color: 'text-blue-700 bg-blue-100 border-blue-200',
        icon: Bot,
        label: 'Software'
      },
      hardware: {
        color: 'text-red-700 bg-red-100 border-red-200',
        icon: Settings,
        label: 'Hardware'
      }
    };
    return configs[type?.toLowerCase()] || { 
      color: 'text-gray-700 bg-gray-100 border-gray-200', 
      icon: Settings, 
      label: 'General' 
    };
  };

  const handleSaveAdminSolution = () => {
    if (onUpdateAdminSolution) {
      onUpdateAdminSolution(ticket.id, adminSolution);
    }
    setIsEditing(false);
  };

  const priorityConfig = getPriorityConfig(ticket.priority);
  const typeConfig = getTypeConfig(ticket.ticket_type);
  const PriorityIcon = priorityConfig.icon;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            {ticket.subject}
          </h3>
          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${priorityConfig.color} ${priorityConfig.pulse}`}>
              <PriorityIcon className="w-3 h-3 mr-1" />
              {ticket.priority?.toUpperCase() || 'MEDIUM'}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${typeConfig.color}`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeConfig.label}
            </span>
          </div>
        </div>
        {ticket.id && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            ID: {ticket.id}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <User className="w-4 h-4 mr-1" />
          Description
        </h4>
        <p className="text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">
          {ticket.body}
        </p>
      </div>

      {/* AI Resolution */}
      {ticket.resolution && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Bot className="w-4 h-4 mr-1 text-blue-600" />
            AI-Generated Resolution
          </h4>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <p className="text-gray-700 leading-relaxed">{ticket.resolution}</p>
          </div>
        </div>
      )}

      {/* Admin Solution */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <Settings className="w-4 h-4 mr-1 text-purple-600" />
            Admin Notes
          </h4>
          {showAdminActions && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={adminSolution}
              onChange={(e) => setAdminSolution(e.target.value)}
              className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Add admin notes or additional solutions..."
            />
            <button
              onClick={handleSaveAdminSolution}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        ) : (
          <div className={`p-4 rounded-xl ${
            ticket.admin_solution 
              ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className="text-gray-700">
              {ticket.admin_solution || 'No admin notes available'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Submitted {new Date().toLocaleDateString()}
        </div>
        {ticket.resolution && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-1" />
            Resolved
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;