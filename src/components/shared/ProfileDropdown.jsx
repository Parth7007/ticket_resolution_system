// src/components/shared/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 shadow border"
      >
        <UserCircle className="w-5 h-5" />
        <span>{user?.role === 'admin' ? 'Admin' : 'User'}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
