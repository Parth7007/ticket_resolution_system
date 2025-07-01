import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';
import { ticketAPI } from '../services/api';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  HelpCircle, 
  UserPlus,
  CheckCircle,
  Crown
} from 'lucide-react';

// Enhanced Navbar component with modern styling
const ModernNavbar = ({ activeTab, setActiveTab }) => (
  <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <HelpCircle className="h-8 w-8 text-blue-400" />
        <span className="text-xl font-bold text-white">IT HelpDesk</span>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setActiveTab('login')}
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          Sign In
        </button>
        <button 
          onClick={() => setActiveTab('signup')}
          className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200"
        >
          Sign Up
        </button>
      </div>
    </div>
  </nav>
);

// Enhanced Loader component
const ModernLoader = ({ size = "md", variant = "white", text = "Loading..." }) => (
  <div className="flex items-center space-x-2">
    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
    <span className="text-sm">{text}</span>
  </div>
);

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('Signup payload:', { username, email, password, role });
    
    try {
      const response = await ticketAPI.signup({ username, email, password, role });
      console.log('Signup response:', response);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('username', response.username);
      console.log('Stored in localStorage:', {
        token: response.access_token,
        role: response.role,
        username: response.username,
      });
      
      const normalizedRole = response.role.trim().toLowerCase();
      if (normalizedRole === 'admin') {
        console.log('Navigating to /admin-dashboard');
        navigate('/admin-dashboard', { replace: true });
      } else if (normalizedRole === 'user') {
        console.log('Navigating to /user-dashboard');
        navigate('/user-dashboard', { replace: true });
      } else {
        console.error('Unexpected role:', response.role);
        setError(`Invalid user role: ${response.role}`);
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <ModernNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Main signup card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mb-4 shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Join Our Team</h2>
              <p className="text-gray-300">Create your IT Help Desk account</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm animate-shake">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'username' ? 'text-emerald-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-200"
                    required
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-emerald-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-200"
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password field with strength indicator */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-emerald-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-200"
                    required
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Password Strength</span>
                      <span className={`font-medium ${passwordStrength >= 75 ? 'text-green-400' : passwordStrength >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Role selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200" htmlFor="role">
                  Account Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {role === 'admin' ? (
                      <Crown className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <Shield className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="user" className="bg-slate-800 text-white">
                      👤 Standard User
                    </option>
                    <option value="admin" className="bg-slate-800 text-white">
                      👑 Administrator
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {role === 'admin' 
                    ? '🔐 Full system access with administrative privileges' 
                    : '📋 Access to create and manage your support tickets'
                  }
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ModernLoader size="md" variant="white" text="Creating account..." />
                ) : (
                  <>
                    <span>Create Account</span>
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Additional options */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-gray-300 text-sm">
                  Already have an account?{' '}
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              🔒 Your data is protected with enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;  