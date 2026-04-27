import React from 'react';
import { Siren } from 'lucide-react';

interface Ticket {
  ticket_id: string;
  category: string;
  priority_score: number;
  description: string;
}

interface TicketListProps {
  district: string | null;
  tickets: Ticket[];
  onAssign: (ticketId: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({ district, tickets, onAssign }) => {
  if (!district) {
    return (
      <div className="absolute top-6 right-6 w-80 glass-strong bg-white/60 rounded-3xl p-6 z-[1000] shadow-sm border border-white flex flex-col items-center justify-center h-64 text-text-secondary italic text-center">
        <p>Select a district on the map</p>
        <p className="text-xs mt-2">to view active tickets</p>
      </div>
    );
  }

  return (
    <div className="absolute top-6 right-6 w-80 glass-strong bg-white/60 rounded-3xl p-5 z-[1000] shadow-sm border border-white flex flex-col max-h-[calc(100%-3rem)] reveal reveal-d2">
      <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] flex items-center gap-2 mb-4">
        <Siren className="w-4 h-4 text-red-500" />
        Active Tickets: {district}
      </h3>
      
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {tickets.length > 0 ? (
          [...tickets].sort((a, b) => b.priority_score - a.priority_score).map((ticket) => (
            <div 
              key={ticket.ticket_id} 
              className="p-4 bg-white/80 border border-slate-200 rounded-2xl hover:border-accent/50 transition-all shadow-sm group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-slate-500">#{ticket.ticket_id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  ticket.priority_score > 7 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  PRIORITY {ticket.priority_score}
                </span>
              </div>
              <p className="text-[13px] text-text-primary leading-relaxed font-medium">
                {ticket.description}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] uppercase text-text-secondary font-bold">{ticket.category || 'General'}</span>
                <button 
                  onClick={() => onAssign(ticket.ticket_id)}
                  className="text-[10px] text-accent font-bold hover:underline cursor-pointer"
                >
                  ASSIGN VOLUNTEER →
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-sm italic text-center py-4">No open unassigned tickets in this region.</p>
        )}
      </div>
    </div>
  );
};

export default TicketList;
