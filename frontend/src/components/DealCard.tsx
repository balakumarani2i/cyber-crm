import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  value: number;
  customer: { name: string; company: string };
  probability: number;
  expectedCloseDate: string;
}

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export default function DealCard({ deal, isDragging = false }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-white/50 p-5 cursor-grab hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-gray-900 text-sm leading-tight">{deal.title}</h4>
        <div className="flex items-center bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
          <DollarSign className="w-3 h-3 mr-1" />
          {deal.value ? `${deal.value.toLocaleString()}` : 'N/A'}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 mb-3 border-l-4 border-blue-400">
        <div className="text-sm font-semibold text-gray-800">👤 {deal.customer.name}</div>
        {deal.customer.company && (
          <div className="text-xs text-gray-600 mt-1">🏢 {deal.customer.company}</div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" />
          {deal.probability}%
        </div>
        <div className="flex items-center bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(deal.expectedCloseDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}