import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, RefreshCw, Users, TrendingUp, Clock,
  AlertCircle, ChevronDown, ChevronUp, Download,
  CheckCircle, Circle, FileText, Edit3, Save, X
} from 'lucide-react';
import Loader from '../components/shared/Loader';
import { ticketAPI } from '../services/api';

// Utility: Download large text as .txt file
const downloadTextFile = (filename, text) => {
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedTickets, setExpandedTickets] = useState(new Set());
  const [editingTickets, setEditingTickets] = useState(new Set());
  const [adminSolutions, setAdminSolutions] = useState({});
  const [stats, setStats] = useState({
    total: 0, high: 0, medium: 0, low: 0, software: 0, hardware: 0, resolved: 0, pending: 0
  });

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  const optimizeTicketData = (ticketList) => {
    return ticketList.map(ticket => ({
      ...ticket,
      body_preview: truncateText(ticket.body, 200),
      body_full: ticket.body,
      body: truncateText(ticket.body, 200),
      is_resolved: ticket.is_resolved || false,
      admin_solution: ticket.admin_solution || '',
      gen_ai_solution: ticket.resolution || '' // Map resolution to gen_ai_solution
    }));
  };

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => { applyFilters(); }, [tickets, searchTerm, filterPriority, filterType, filterStatus]);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await ticketAPI.getAllTickets();
      console.log("✅ Raw API Response:", response);
    
      const combinedTickets = [...response.text_tickets, ...response.ocr_tickets];
      console.log("✅ Combined Tickets:", combinedTickets);
      const optimizedTickets = optimizeTicketData(combinedTickets);
      setTickets(optimizedTickets);
      calculateStats(optimizedTickets);
      
      const solutions = {};
      optimizedTickets.forEach(ticket => {
        solutions[ticket.id] = ticket.admin_solution || '';
      });
      setAdminSolutions(solutions);
    } catch (err) {
      console.error("❌ Error fetching tickets:", err);
      setError("Failed to fetch tickets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (list) => {
    setStats({
      total: list.length,
      high: list.filter(t => t.priority === 'high').length,
      medium: list.filter(t => t.priority === 'medium').length,
      low: list.filter(t => t.priority === 'low').length,
      software: list.filter(t => t.ticket_type === 'software').length,
      hardware: list.filter(t => t.ticket_type === 'hardware').length,
      resolved: list.filter(t => t.is_resolved).length,
      pending: list.filter(t => !t.is_resolved).length
    });
  };

  const applyFilters = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.body_full?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.admin_solution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.gen_ai_solution?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(ticket => ticket.ticket_type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => 
        filterStatus === 'resolved' ? ticket.is_resolved : !ticket.is_resolved
      );
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  };

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const toggleTicketExpansion = (ticketId) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) newExpanded.delete(ticketId);
    else newExpanded.add(ticketId);
    setExpandedTickets(newExpanded);

    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const isExpanded = newExpanded.has(ticketId);
        return {
          ...ticket,
          body: isExpanded ? ticket.body_full : ticket.body_preview
        };
      }
      return ticket;
    }));
  };

  const handleToggleResolution = async (ticketId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      setTickets(prev => {
        const updatedTickets = prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, is_resolved: newStatus }
            : ticket
        );
        calculateStats(updatedTickets);
        return updatedTickets;
      });
      
      console.log(`Ticket ${ticketId} marked as ${newStatus ? 'resolved' : 'pending'}`);
    } catch (err) {
      console.error('Error updating resolution status:', err);
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, is_resolved: currentStatus }
            : ticket
        )
      );
    }
  };

  const startEditingAdminSolution = (ticketId) => {
    setEditingTickets(prev => new Set(prev).add(ticketId));
  };

  const cancelEditingAdminSolution = (ticketId) => {
    setEditingTickets(prev => {
      const newSet = new Set(prev);
      newSet.delete(ticketId);
      return newSet;
    });
    const originalTicket = tickets.find(t => t.id === ticketId);
    if (originalTicket) {
      setAdminSolutions(prev => ({
        ...prev,
        [ticketId]: originalTicket.admin_solution || ''
      }));
    }
  };

  const saveAdminSolution = async (ticketId) => {
    try {
      const solution = adminSolutions[ticketId] || '';
      
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, admin_solution: solution }
            : ticket
        )
      );
      
      setEditingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });

      await ticketAPI.updateAdminSolution(ticketId, solution);
      console.log(`Admin solution updated for ticket ${ticketId}`);
    } catch (err) {
      console.error('Error updating admin solution:', err);
    }
  };

  const handleAdminSolutionChange = (ticketId, value) => {
    setAdminSolutions(prev => ({
      ...prev,
      [ticketId]: value
    }));
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

  const EnhancedTicketCard = ({ ticket }) => {
    const isExpanded = expandedTickets.has(ticket.id);
    const isEditing = editingTickets.has(ticket.id);
    const hasLongContent = ticket.body_full?.length > 200;
    const hasGenAISolution = ticket.gen_ai_solution && ticket.gen_ai_solution.trim().length > 0;

    const handleDownload = () => {
      const content = `TICKET ID: ${ticket.id}\nSUBJECT: ${ticket.subject}\nUSER: ${ticket.user_email || ticket.email}\nDATE: ${new Date(ticket.created_at).toLocaleDateString()}\n\nPROBLEM DESCRIPTION:\n${ticket.body_full || ticket.body}\n\n${'='.repeat(50)}\nAI-GENERATED SOLUTION:\n${'='.repeat(50)}\n\n${ticket.gen_ai_solution || 'No AI-generated solution available.'}`;
      console.log("✅ Download Content:", content);
      downloadTextFile(
        `AI_Solution_Ticket_${ticket.id}_${new Date().toISOString().split('T')[0]}.txt`,
        content
      );
    };

    const handleCompleteDownload = () => {
      const content = `COMPLETE TICKET INFORMATION\n${'='.repeat(50)}\n\nTICKET ID: ${ticket.id}\nSUBJECT: ${ticket.subject}\nUSER: ${ticket.user_email || ticket.email}\nPRIORITY: ${ticket.priority}\nTYPE: ${ticket.ticket_type}\nSTATUS: ${ticket.is_resolved ? 'RESOLVED' : 'PENDING'}\nCREATED: ${new Date(ticket.created_at).toLocaleDateString()}\n\nPROBLEM DESCRIPTION:\n${'-'.repeat(30)}\n${ticket.body_full || ticket.body}\n\nAI-GENERATED SOLUTION:\n${'-'.repeat(30)}\n${ticket.gen_ai_solution || 'No AI-generated solution available.'}\n\nADMIN SOLUTION:\n${'-'.repeat(30)}\n${ticket.admin_solution || 'No admin solution provided yet.'}`;
      console.log("✅ Complete Download Content:", content);
      downloadTextFile(
        `Complete_Ticket_${ticket.id}_${new Date().toISOString().split('T')[0]}.txt`,
        content
      );
    };

    return (
      <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 ${
        ticket.is_resolved 
          ? 'border-green-200 bg-green-50/30' 
          : 'border-gray-100 hover:shadow-xl'
      }`}>
        {ticket.is_resolved && (
          <div className="bg-green-100 px-6 py-2 rounded-t-xl border-b border-green-200">
            <div className="flex items-center text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Issue Resolved</span>
            </div>
          </div>
        )}
        
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleToggleResolution(ticket.id, ticket.is_resolved)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  ticket.is_resolved
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ticket.is_resolved ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
                <span>{ticket.is_resolved ? 'Mark as Pending' : 'Mark as Resolved'}</span>
              </button>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {ticket.priority?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{ticket.subject}</h3>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span><strong>User:</strong> ${ticket.user_email || ticket.email}</span>
              <span><strong>Type:</strong> ${ticket.ticket_type}</span>
              <span><strong>Created:</strong> ${new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
              <p className="text-gray-600 leading-relaxed">${ticket.body}</p>
            </div>
          </div>
        </div>

        {hasGenAISolution && (
          <div className="mx-6 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="px-4 py-3 bg-blue-100 border-b border-blue-200 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-blue-900 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  AI-Generated Solution Available
                </h4>
                <button
                  onClick={handleDownload}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Solution
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-700 text-sm">
                An AI-generated solution is available for this ticket. Click the download button above to get the complete solution as a text file.
              </p>
            </div>
          </div>
        )}

        <div className="mx-6 mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="px-4 py-3 bg-green-100 border-b border-green-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-green-900 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Admin Solution
              </h4>
              {!isEditing && (
                <button
                  onClick={() => startEditingAdminSolution(ticket.id)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>
          </div>
          <div className="p-4">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={adminSolutions[ticket.id] || ''}
                  onChange={(e) => handleAdminSolutionChange(ticket.id, e.target.value)}
                  placeholder="Enter your solution for this ticket..."
                  className="w-full h-32 p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => saveAdminSolution(ticket.id)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Solution
                  </button>
                  <button
                    onClick={() => cancelEditingAdminSolution(ticket.id)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed">
                {ticket.admin_solution ? (
                  <p className="whitespace-pre-wrap">{ticket.admin_solution}</p>
                ) : (
                  <p className="text-gray-500 italic">No admin solution provided yet. Click Edit to add one.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-4 flex flex-wrap gap-4 items-center border-t border-gray-100 pt-4">
          {hasLongContent && (
            <button
              onClick={() => toggleTicketExpansion(ticket.id)}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show More
                </>
              )}
            </button>
          )}

          <button
            onClick={handleCompleteDownload}
            className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
          >
            <FileText className="h-4 w-4 mr-1" />
            Download Complete Info
          </button>
        </div>
      </div>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md transition-colors ${currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and monitor IT support tickets</p>
          </div>
          <button
            onClick={fetchTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Total Tickets" value={stats.total} icon={Users} color="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="text-orange-600" bgColor="bg-orange-50" />
          <StatCard title="High Priority" value={stats.high} icon={AlertCircle} color="text-red-600" bgColor="bg-red-50" />
          <StatCard title="Software" value={stats.software} icon={TrendingUp} color="text-purple-600" bgColor="bg-purple-50" />
          <StatCard title="Hardware" value={stats.hardware} icon={Clock} color="text-indigo-600" bgColor="bg-indigo-50" />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Found {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
          {filteredTickets.length !== tickets.length && ` (filtered from ${tickets.length} total)`}
        </div>

        {paginatedTickets.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tickets found</h3>
            <p className="text-gray-500">
              {tickets.length === 0 ? 'No tickets have been submitted yet.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedTickets.map((ticket, index) => (
                <EnhancedTicketCard
                  key={ticket.id || index}
                  ticket={ticket}
                />
              ))}
            </div>
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;