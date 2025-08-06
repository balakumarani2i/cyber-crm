import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { dealAPI, customerAPI } from '../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DashboardCharts() {
  const [pipelineData, setPipelineData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const [dealsRes, customersRes] = await Promise.all([
        dealAPI.getAll(),
        customerAPI.getAll()
      ]);

      // Pipeline data
      const stages = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
      const pipelineStats = stages.map(stage => ({
        stage: stage.replace('_', ' '),
        count: dealsRes.data.filter((deal: any) => deal.stage === stage).length,
        value: dealsRes.data
          .filter((deal: any) => deal.stage === stage)
          .reduce((sum: number, deal: any) => sum + (deal.value || 0), 0)
      }));

      // Customer status data
      const statuses = ['ACTIVE', 'PROSPECT', 'INACTIVE'];
      const customerStats = statuses.map(status => ({
        name: status,
        value: customersRes.data.filter((customer: any) => customer.status === status).length
      }));

      setPipelineData(pipelineStats);
      setCustomerData(customerStats);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading charts...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-white/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          📈 Pipeline Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Deals' : 'Value ($)']} />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-xl border border-white/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          👥 Customer Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={customerData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {customerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}