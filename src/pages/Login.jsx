import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/shared/Navbar';
// import Loader from '../components/shared/Loader';
import { ticketAPI } from '../services/api';
import { useAuth } from '../context/AuthContext'; 
import { Eye, EyeOff, Mail, Lock, Shield, HelpCircle, Zap } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => (
  <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <HelpCircle className="h-8 w-8 text-blue-400" />
        <span className="text-xl font-bold text-white">IT HelpDesk</span>
      </div>
    </div>
  </nav>
);

const Loader = ({ size = "md", variant = "white", text = "Loading..." }) => (
  <div className="flex items-center space-x-2">
    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
    <span className="text-sm">{text}</span>
  </div>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await ticketAPI.login(email, password);
      console.log('Login full response:', response);

      const { access_token, role, username } = response;

      if (!access_token || !role || !username) {
        throw new Error("Missing required login fields in response");
      }

      const userData = { access_token, role, username };
      login(userData); // from AuthContext

      const roleLower = role.trim().toLowerCase();
      if (roleLower === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (roleLower === 'user') {
        navigate('/user-dashboard', { replace: true });
      } else {
        throw new Error(`Invalid role received: ${role}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Main login card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-300">Sign in to your IT Help Desk account</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                    required
                    placeholder="Enter your password"
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
              </div>

              {/* Submit button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader size="md" variant="white" text="Signing in..." />
                ) : (
                  <>
                    <span>Sign In</span>
                    <Zap className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Additional options */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <button className="text-gray-300 hover:text-white transition-colors duration-200">
                  Forgot password?
                </button>
                <button className="text-gray-300 hover:text-white transition-colors duration-200">
                  Need help?
                </button>
              </div>
            </div>
          </div>

                  {/* Signup redirect */}
          <div className="mt-4 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-white font-medium transition-colors duration-200 underline"
              >
                Sign Up
              </button>
            </p>
          </div>


          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Secure login powered by modern encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;