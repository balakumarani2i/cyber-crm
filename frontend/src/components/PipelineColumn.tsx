import { useDroppable } from '@dnd-kit/core';
import DealCard from './DealCard';

interface Deal {
  id: string;
  title: string;
  value: number;
  customer: { name: string; company: string };
  probability: number;
  expectedCloseDate: string;
}

interface PipelineColumnProps {
  id: string;
  title: string;
  color: string;
  deals: Deal[];
}

export default function PipelineColumn({ id, title, color, deals }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`${color} rounded-2xl p-5 mb-4 shadow-lg border border-white/30`}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <span className="bg-white/50 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">({deals.length})</span>
        </div>
        <div className="text-sm font-semibold text-gray-700 mt-2 bg-white/30 rounded-lg px-3 py-1 inline-block">
          💰 ${totalValue.toLocaleString()}
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className={`min-h-96 space-y-4 p-4 rounded-2xl transition-all duration-300 ${
          isOver ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-400 border-dashed shadow-lg scale-105' : 'bg-gradient-to-b from-white/50 to-gray-50/50 border border-gray-200'
        }`}
      >
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-300 rounded-xl bg-white/30">
            <div className="text-4xl mb-2">🎯</div>
            <div className="font-medium">Drop deals here</div>
          </div>
        )}
      </div>
    </div>
  );
}