
import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Search, Filter, Loader2, RefreshCw, PlusCircle } from 'lucide-react';
import FlatForm from './components/FlatForm';
import FlatCard from './components/FlatCard';
import { Flat, FlatStatus } from './types';
import * as apiService from './services/api';

const App: React.FC = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFlats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getFlats();
      setFlats(data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend server. Make sure it's running at http://localhost:5000");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFlat = async (newFlat: Flat) => {
    try {
      await apiService.createFlat(newFlat);
      await fetchFlats();
    } catch (err) {
      alert("Error adding flat. Please try again.");
    }
  };

  const handleDeleteFlat = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await apiService.deleteFlat(id);
      await fetchFlats();
    } catch (err) {
      alert("Error deleting flat.");
    }
  };

  const handleToggleStatus = async (flat: Flat) => {
    const id = flat._id || flat.id;
    if (!id) return;
    
    const newStatus = flat.status === FlatStatus.AVAILABLE ? FlatStatus.SOLD : FlatStatus.AVAILABLE;
    try {
      await apiService.updateFlat(id, { status: newStatus });
      await fetchFlats();
    } catch (err) {
      alert("Error updating status.");
    }
  };

  const filteredFlats = flats.filter(f => 
    f.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Building2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">PRIME ESTATES</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 focus-within:ring-2 ring-blue-100 transition-all">
            <Search className="text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by flat no or type..." 
              className="bg-transparent border-none outline-none text-slate-700 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={fetchFlats}
            className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        {/* Statistics & Intro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-1">Total Properties</p>
            <h2 className="text-4xl font-bold">{flats.length}</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Available Units</p>
            <h2 className="text-4xl font-bold text-green-600">
              {flats.filter(f => f.status === FlatStatus.AVAILABLE).length}
            </h2>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Sold Units</p>
            <h2 className="text-4xl font-bold text-red-500">
              {flats.filter(f => f.status === FlatStatus.SOLD).length}
            </h2>
          </div>
        </div>

        <FlatForm onSubmit={handleAddFlat} />

        {/* List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              Property Listings
              <span className="bg-slate-200 text-slate-600 text-xs py-1 px-3 rounded-full">{filteredFlats.length}</span>
            </h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Filter size={16} />
              Sort: Newest First
            </div>
          </div>

          {loading && flats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-slate-500 font-medium text-lg">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center">
              <h3 className="text-xl font-bold mb-2">Backend Connection Error</h3>
              <p className="mb-4">{error}</p>
              <button 
                onClick={fetchFlats}
                className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 font-bold"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredFlats.length === 0 ? (
            <div className="bg-white py-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No properties found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search or add a new listing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFlats.map(flat => (
                <FlatCard 
                  key={flat._id || flat.id} 
                  flat={flat} 
                  onDelete={handleDeleteFlat}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl shadow-blue-400 flex items-center justify-center"
        >
          <PlusCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
