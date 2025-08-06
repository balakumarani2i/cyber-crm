import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Navigate } from 'react-router-dom';
import { Zap, Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const { showSuccess, showError } = useToast();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      await login(email, password);
      showSuccess('Neural link established successfully! Welcome to the matrix.');
    } catch (err: any) {
      console.log('Login error:', err);
      showError(err.message || 'Access Denied - Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 cyber-grid relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 px-4">
        {/* Cyber Logo */}
        <div className="text-center">
          <div className="neon-blue bg-black/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-cyan-500/30">
            <div className="holographic rounded-xl p-4 mb-4">
              <h1 className="text-5xl font-bold text-white mb-2 glitch flex items-center justify-center">
                <Zap className="w-12 h-12 mr-3 animate-spin" />
                CYBER CRM
              </h1>
            </div>
            <p className="text-cyan-300 text-lg font-medium">Neural Network Access Portal</p>
            <div className="flex justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            🔐 SECURE ACCESS REQUIRED
          </h2>
          <p className="text-gray-400">Initialize neural connection to the matrix</p>
        </div>
        
        {/* Cyber Login Form */}
        <form className="neon-purple bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 space-y-6" onSubmit={handleSubmit}>

          
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-cyan-400 text-lg">👤</span>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-cyan-500/30 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300"
                placeholder="Neural ID (Email)"
              />
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-purple-400 text-lg">🔑</span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-black/50 border border-purple-500/30 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all duration-300"
                placeholder="Access Code (Password)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl disabled:opacity-50 transition-all duration-300 hover:scale-105 neon-blue"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                CONNECTING TO MATRIX...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                INITIATE NEURAL LINK
              </span>
            )}
          </button>
          
          {/* Demo Credentials */}
          <div className="neon-green bg-green-500/10 border border-green-400/30 text-green-300 text-sm text-center p-4 rounded-xl backdrop-blur-sm">
            <div className="font-bold mb-2">🧪 DEMO ACCESS CODES</div>
            <div className="space-y-1">
              <div>Neural ID: <span className="font-mono">admin@crm.com</span></div>
              <div>Access Code: <span className="font-mono">test@123</span></div>
            </div>
          </div>
        </form>

        {/* Floating elements */}
        <div className="absolute -top-10 -right-10 text-6xl opacity-20 animate-spin">⚡</div>
        <div className="absolute -bottom-10 -left-10 text-4xl opacity-20 animate-bounce">🌐</div>
      </div>
    </div>
  );
}