import React, { useState } from 'react';
import { Upload, Camera, X, AlertCircle } from 'lucide-react';
import Loader from '../shared/Loader';

const ImageTicketForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    admin_solution: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.body.trim()) newErrors.body = 'Description is required';
    if (!formData.image) newErrors.image = 'Screenshot is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('body', formData.body);
      if (formData.admin_solution) {
        formDataToSend.append('admin_solution', formData.admin_solution);
      }
      formDataToSend.append('image', formData.image);
      onSubmit(formDataToSend);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <Loader size="lg" text="Processing OCR and analyzing..." />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl shadow-xl p-8 border border-purple-100/50 backdrop-blur-sm">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
          <Camera className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-800">Submit Ticket with Screenshot</h2>
          <p className="text-gray-600">Upload an image for AI-powered OCR analysis</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 bg-white/80 backdrop-blur-sm ${
                errors.subject ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
              }`}
              placeholder="Issue summary"
            />
            {errors.subject && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.subject}</div>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description *</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 resize-none bg-white/80 backdrop-blur-sm ${
                errors.body ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
              }`}
              placeholder="Describe the issue"
            />
            {errors.body && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.body}</div>}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Screenshot *</label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
              dragActive 
                ? 'border-purple-400 bg-purple-50' 
                : errors.image
                  ? 'border-red-300 bg-red-50/50'
                  : 'border-gray-300 hover:border-purple-400 bg-gray-50/50'
            }`}
          >
            {preview ? (
              <div className="relative p-6">
                <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg shadow-md" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Upload className={`h-16 w-16 mb-4 ${dragActive ? 'text-purple-500' : 'text-gray-400'}`} />
                <div className="text-center">
                  <label className="cursor-pointer">
                    <span className="text-lg font-semibold text-purple-600 hover:text-purple-700">
                      Choose file
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 mt-2">or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
          </div>
          {errors.image && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.image}</div>}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Additional Notes</label>
          <textarea
            name="admin_solution"
            value={formData.admin_solution}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm"
            placeholder="Any additional context..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Upload className="h-5 w-5 mr-3" />
          Submit with Image
        </button>
      </form>
    </div>
  );
};

export default ImageTicketForm;
