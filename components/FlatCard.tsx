
import React from 'react';
import { Trash2, RefreshCw, Home, Tag, DollarSign } from 'lucide-react';
import { Flat, FlatStatus } from '../types';

interface FlatCardProps {
  flat: Flat;
  onDelete: (id: string) => void;
  onToggleStatus: (flat: Flat) => void;
}

const FlatCard: React.FC<FlatCardProps> = ({ flat, onDelete, onToggleStatus }) => {
  const id = flat._id || flat.id || '';
  const isAvailable = flat.status === FlatStatus.AVAILABLE;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={flat.image || 'https://picsum.photos/400/300?random=' + flat.flatNo} 
          alt={`Flat ${flat.flatNo}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/400/300';
          }}
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {flat.status}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Home size={20} className="text-blue-600" />
              Unit {flat.flatNo}
            </h3>
            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
              <Tag size={14} />
              {flat.type}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-700 flex items-center justify-end">
              <DollarSign size={20} />
              {Number(flat.price).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => onToggleStatus(flat)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors duration-200 ${
              isAvailable 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw size={18} />
            {isAvailable ? 'Mark Sold' : 'Make Available'}
          </button>
          
          <button
            onClick={() => onDelete(id)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlatCard;
