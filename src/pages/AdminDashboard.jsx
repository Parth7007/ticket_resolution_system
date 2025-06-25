import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import TicketCard from '../components/dashboard/TicketCard';
import Loader from '../components/shared/Loader';
import { ticketAPI } from '../services/api';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    software: 0,
    hardware: 0
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, filterPriority, filterType]);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ticketAPI.getAllTickets();
      setTickets(response);
      calculateStats(response);
    } catch (err) {
      setError('Failed to fetch tickets. Please try again.');
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (ticketList) => {
    const stats = {
      total: ticketList.length,
      high: ticketList.filter(t => t.priority === 'high').length,
      medium: ticketList.filter(t => t.priority === 'medium').length,
      low: ticketList.filter(t => t.priority === 'low').length,
      software: ticketList.filter(t => t.ticket_type === 'software').length,
      hardware: ticketList.filter(t => t.ticket_type === 'hardware').length
    };
    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = tickets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.body?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(ticket => ticket.ticket_type === filterType);
    }

    setFilteredTickets(filtered);
  };

  const handleUpdateAdminSolution = async (ticketId, adminSolution) => {
    try {
      await ticketAPI.updateAdminSolution(ticketId, adminSolution);
      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, admin_solution: adminSolution }
          : ticket
      ));
    } catch (err) {
      console.error('Error updating admin solution:', err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="xl" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and monitor IT support tickets</p>
          </div>
          <button
            onClick={fetchTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tickets"
            value={stats.total}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="High Priority"
            value={stats.high}
            icon={AlertCircle}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <StatCard
            title="Software Issues"
            value={stats.software}
            icon={TrendingUp}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            title="Hardware Issues"
            value={stats.hardware}
            icon={Clock}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
            </select>
          </div>
        </div>

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tickets found</h3>
            <p className="text-gray-500">
              {tickets.length === 0 ? 'No tickets have been submitted yet.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id || index}
                ticket={ticket}
                showAdminActions={true}
                onUpdateAdminSolution={handleUpdateAdminSolution}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
