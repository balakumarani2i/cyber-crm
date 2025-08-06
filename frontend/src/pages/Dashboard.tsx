import { useEffect, useState } from 'react';
import { Users, DollarSign, CheckSquare, TrendingUp, Zap, Target, Rocket, Activity } from 'lucide-react';
import { customerAPI, dealAPI, taskAPI } from '../utils/api';
import DashboardCharts from '../components/DashboardCharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    deals: 0,
    tasks: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, dealsRes, tasksRes] = await Promise.all([
          customerAPI.getAll(),
          dealAPI.getAll(),
          taskAPI.getAll()
        ]);
        
        const revenue = dealsRes.data
          .filter((deal: any) => deal.stage === 'CLOSED_WON')
          .reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
        
        setStats({
          customers: customersRes.data.length,
          deals: dealsRes.data.length,
          tasks: tasksRes.data.filter((task: any) => task.status !== 'COMPLETED').length,
          revenue
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      name: 'Total Customers', 
      value: stats.customers, 
      icon: Users, 
      color: 'neon-blue',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-300',
      emoji: '👥'
    },
    { 
      name: 'Active Deals', 
      value: stats.deals, 
      icon: Target, 
      color: 'neon-green',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-300',
      emoji: '🎯'
    },
    { 
      name: 'Pending Tasks', 
      value: stats.tasks, 
      icon: Zap, 
      color: 'neon-purple',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-300',
      emoji: '⚡'
    },
    { 
      name: 'Revenue', 
      value: `$${stats.revenue.toLocaleString()}`, 
      icon: Rocket, 
      color: 'neon-pink',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-300',
      emoji: '🚀'
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Cyber Header */}
      <div className="relative holographic rounded-2xl p-8 mb-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold flex items-center glitch">
            <Activity className="w-8 h-8 mr-3 animate-pulse" />
            NEURAL DASHBOARD
          </h3>
          <p className="mt-2 text-cyan-200 text-lg">
            Real-time quantum insights into your business matrix
          </p>
        </div>
        <div className="absolute top-4 right-4 text-6xl opacity-20 float">🌐</div>
      </div>

      {/* Cyber Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.name} 
              className={`${item.color} ${item.bgColor} rounded-2xl p-6 backdrop-blur-xl border border-white/10 hover:scale-105 transition-all duration-300 float`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{item.emoji}</span>
                    <Icon className={`h-6 w-6 ${item.textColor}`} />
                  </div>
                  <dt className={`text-sm font-bold ${item.textColor} uppercase tracking-wider`}>
                    {item.name}
                  </dt>
                  <dd className="text-3xl font-bold text-white mt-2 pulse-glow">
                    {item.value}
                  </dd>
                </div>
                <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`h-8 w-8 ${item.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="neon-purple bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 mb-8">
        <h4 className="text-2xl font-bold text-purple-300 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 animate-pulse" />
          NEURAL ACTIVITY STREAM
        </h4>
        <div className="space-y-4">
          {[
            { type: 'success', icon: '✅', message: 'New customer "John Doe" synchronized to the matrix', color: 'border-green-400 bg-green-500/10' },
            { type: 'info', icon: '🔄', message: 'Deal "Software License" quantum-shifted to Proposal stage', color: 'border-blue-400 bg-blue-500/10' },
            { type: 'warning', icon: '⚠️', message: 'Task "Follow up call" requires immediate attention', color: 'border-yellow-400 bg-yellow-500/10' }
          ].map((activity, index) => (
            <div 
              key={index}
              className={`flex items-center p-4 rounded-xl border-l-4 ${activity.color} backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <div className="text-2xl mr-4 animate-bounce" style={{ animationDelay: `${index * 0.5}s` }}>
                {activity.icon}
              </div>
              <span className="text-gray-300 font-medium">{activity.message}</span>
              <div className="ml-auto text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts />
    </div>
  );
}