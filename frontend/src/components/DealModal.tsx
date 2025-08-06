import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { dealAPI, customerAPI } from '../utils/api';
import { useToast } from '../contexts/ToastContext';

interface Deal {
  id?: string;
  title: string;
  value: number;
  stage: string;
  customerId: string;
  description: string;
}

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal | null;
  onSave: () => void;
}

export default function DealModal({ isOpen, onClose, deal, onSave }: DealModalProps) {
  const [formData, setFormData] = useState<Deal>({
    title: '',
    value: 0,
    stage: 'LEAD',
    customerId: '',
    description: ''
  });
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (deal) {
      setFormData(deal);
    } else {
      setFormData({
        title: '',
        value: 0,
        stage: 'LEAD',
        customerId: '',
        description: ''
      });
    }
  }, [deal]);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data || response);
    } catch (error: any) {
      showError(error.message || 'Failed to load customers.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (deal?.id) {
        const response = await dealAPI.update(deal.id, formData);
        showSuccess(response.message || 'Deal updated successfully!');
      } else {
        const response = await dealAPI.create(formData);
        showSuccess(response.message || 'Deal created successfully!');
      }
      onSave();
      onClose();
    } catch (error: any) {
      showError(error.message || 'Failed to save deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[9999]">
      <div className="relative top-20 mx-auto p-6 w-96 shadow-2xl rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-white/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {deal ? 'Edit Deal' : 'Add Deal'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 text-black block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              className="mt-1 text-black block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer *</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="mt-1 text-black block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="mt-1 text-black block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="LEAD">Lead</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="CLOSED_WON">Closed Won</option>
              <option value="CLOSED_LOST">Closed Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 text-black block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all duration-300"
            >
              {loading ? '⏳ Saving...' : '✨ Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}