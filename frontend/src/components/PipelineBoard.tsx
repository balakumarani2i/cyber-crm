import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { dealAPI } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import PipelineColumn from './PipelineColumn';
import DealCard from './DealCard';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  customer: { name: string; company: string };
  probability: number;
  expectedCloseDate: string;
}

const STAGES = [
  { id: 'LEAD', title: 'Lead', color: 'bg-gray-100' },
  { id: 'QUALIFIED', title: 'Qualified', color: 'bg-blue-100' },
  { id: 'PROPOSAL', title: 'Proposal', color: 'bg-yellow-100' },
  { id: 'NEGOTIATION', title: 'Negotiation', color: 'bg-orange-100' },
  { id: 'CLOSED_WON', title: 'Closed Won', color: 'bg-green-100' },
  { id: 'CLOSED_LOST', title: 'Closed Lost', color: 'bg-red-100' },
];

export default function PipelineBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await dealAPI.getAll();
      setDeals(response.data || response);
    } catch (error: any) {
      showError(error.message || 'Failed to load deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const dealId = active.id as string;
    const newStage = over.id as string;

    // Update local state immediately
    setDeals(deals.map(deal => 
      deal.id === dealId ? { ...deal, stage: newStage } : deal
    ));

    // Update backend
    try {
      const response = await dealAPI.update(dealId, { stage: newStage });
      showSuccess('Deal moved successfully!');
    } catch (error: any) {
      showError(error.message || 'Failed to update deal. Please try again.');
      // Revert on error
      fetchDeals();
    }

    setActiveId(null);
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const activeDeal = deals.find(deal => deal.id === activeId);

  if (loading) {
    return <div className="flex justify-center py-8">Loading pipeline...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <SortableContext
            key={stage.id}
            id={stage.id}
            items={getDealsByStage(stage.id).map(deal => deal.id)}
            strategy={verticalListSortingStrategy}
          >
            <PipelineColumn
              id={stage.id}
              title={stage.title}
              color={stage.color}
              deals={getDealsByStage(stage.id)}
            />
          </SortableContext>
        ))}
      </div>
      
      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}