import React, { useState } from 'react';
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import TextTicketForm from '../components/forms/TextTicketForm';
import ImageTicketForm from '../components/forms/ImageTicketForm';
import TicketCard from '../components/dashboard/TicketCard';
import { ticketAPI } from '../services/api';
import ProfileDropdown from '../components/shared/ProfileDropdown';

const UserDashboard = () => {
  const [activeForm, setActiveForm] = useState('text');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmitTextTicket = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ticketAPI.submitTextTicket(formData);
      setSubmittedTicket(response);
    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
      console.error('Error submitting text ticket:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitImageTicket = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ticketAPI.submitImageTicket(formData);
      setSubmittedTicket(response);
    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
      console.error('Error submitting image ticket:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar with Profile */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Welcome to the User Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Submit and track your support tickets.
            </p>
          </div>
          <ProfileDropdown />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Submit IT Support Ticket
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant AI-powered resolutions for your hardware and software issues
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {submittedTicket ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ticket Submitted Successfully!
              </h2>
              <p className="text-gray-600">
                Our AI has analyzed your issue and generated a resolution
              </p>
            </div>

            <TicketCard ticket={submittedTicket} />

            <div className="text-center mt-8">
              <button
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center mx-auto"
              >
                Submit Another Ticket
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Form Type Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveForm('text')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      activeForm === 'text'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Text Only
                  </button>
                  <button
                    onClick={() => setActiveForm('image')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      activeForm === 'image'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    With Screenshot
                  </button>
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                {activeForm === 'text' ? (
                  <TextTicketForm
                    onSubmit={handleSubmitTextTicket}
                    isLoading={isLoading}
                  />
                ) : (
                  <ImageTicketForm
                    onSubmit={handleSubmitImageTicket}
                    isLoading={isLoading}
                  />
                )}
              </div>

              {/* Info Panel */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-800">
                      AI-Powered Resolution
                    </h3>
                  </div>
                  <p className="text-blue-700 leading-relaxed">
                    Our advanced AI analyzes your issue and provides instant, personalized
                    solutions based on thousands of resolved tickets.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    {activeForm === 'text' ? 'Text Submission' : 'Image Recognition'}
                  </h3>
                  <ul className="space-y-2 text-purple-700">
                    {activeForm === 'text' ? (
                      <>
                        <li>• Describe your issue in detail</li>
                        <li>• Get instant AI-generated solutions</li>
                        <li>• Automatic categorization and priority</li>
                        <li>• Stored securely in our database</li>
                      </>
                    ) : (
                      <>
                        <li>• Upload screenshots of error messages</li>
                        <li>• Advanced OCR text extraction</li>
                        <li>• Visual context analysis</li>
                        <li>• Combined text and image processing</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    Quick Tips
                  </h3>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• Be specific about when the issue occurs</li>
                    <li>• Include error messages if available</li>
                    <li>• Mention what you were doing when it happened</li>
                    <li>• Screenshots help us understand better</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
