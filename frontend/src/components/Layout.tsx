import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  CheckSquare, 
  LogOut,
  Zap,
  Activity
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Deals', href: '/deals', icon: DollarSign },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 cyber-grid">
      {/* Cyber Navigation */}
      <nav className="relative bg-black/80 backdrop-blur-xl border-b border-cyan-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="neon-blue rounded-lg px-4 py-2 bg-black/50 backdrop-blur-sm">
                  <h1 className="text-xl font-bold text-cyan-400 flex items-center glitch">
                    <Zap className="w-5 h-5 mr-2" />
                    CYBER CRM
                  </h1>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'neon-purple bg-purple-500/20 text-purple-300'
                          : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10'
                      } inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="neon-green rounded-full px-4 py-2 bg-black/50 backdrop-blur-sm">
                <span className="text-sm text-green-400 font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2 animate-pulse" />
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="neon-pink bg-black/50 hover:bg-pink-500/20 text-pink-300 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 neon-blue">
          {children}
        </div>
      </main>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}