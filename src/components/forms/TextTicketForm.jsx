import React, { useState } from 'react';
import { Send, FileText, AlertCircle } from 'lucide-react';
import Loader from '../shared/Loader';

const TextTicketForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    admin_solution: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Description is required';
    } else if (formData.body.length < 10) {
      newErrors.body = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <Loader size="lg" text="Analyzing your ticket..." />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl p-8 border border-blue-100/50 backdrop-blur-sm">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-800">Submit Text Ticket</h2>
          <p className="text-gray-600">Describe your issue in detail</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
              focus:outline-none focus:ring-4 bg-white/80 backdrop-blur-sm
              ${errors.subject 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
            placeholder="Brief summary of your issue"
          />
          {errors.subject && (
            <div className="flex items-center text-red-600 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.subject}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Detailed Description *
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={6}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none
              focus:outline-none focus:ring-4 bg-white/80 backdrop-blur-sm
              ${errors.body 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
            placeholder="Please provide detailed information about the problem you're experiencing..."
          />
          {errors.body && (
            <div className="flex items-center text-red-600 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.body}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            name="admin_solution"
            value={formData.admin_solution}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm"
            placeholder="Any additional context or solutions you've already tried..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Send className="h-5 w-5 mr-3" />
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TextTicketForm;