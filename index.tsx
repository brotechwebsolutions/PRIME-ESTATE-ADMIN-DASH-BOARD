
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { 
  Building2, PlusCircle, Trash2, RefreshCw, 
  Home, Tag, DollarSign, Search, Loader2, 
  AlertCircle, Layout, Hash, Banknote, Image as ImageIcon, Filter
} from 'lucide-react';

// --- Configuration ---
const API = "https://prime-estates-api.onrender.com/api/flats";

// --- Types ---
enum FlatStatus {
  AVAILABLE = 'Available',
  SOLD = 'Sold'
}

interface Flat {
  _id?: string;
  id?: string;
  flatNo: string;
  type: string;
  price: number | string;
  status: FlatStatus;
  image: string;
}

// --- Sub-Components ---

const Header = ({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Building2 className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">PRIME ESTATES</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Admin Dashboard</p>
        </div>
      </div>
      
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        title="Refresh data"
      >
        <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
      </button>
    </div>
  </header>
);

const FlatForm = ({ onAdd }: { onAdd: (flat: Flat) => Promise<void> }) => {
  const [formData, setFormData] = useState<Flat>({
    flatNo: '',
    type: '',
    price: '',
    status: FlatStatus.AVAILABLE,
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.flatNo || !formData.type || !formData.price) return;
    
    setSubmitting(true);
    try {
      await onAdd({ ...formData, price: Number(formData.price) });
      setFormData({ flatNo: '', type: '', price: '', status: FlatStatus.AVAILABLE, image: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-slate-800">Add New Property</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Hash size={16} /> Flat Number
          </label>
          <input
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. A-101"
            value={formData.flatNo}
            onChange={e => setFormData({...formData, flatNo: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Layout size={16} /> Property Type
          </label>
          <input
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. 3BHK"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Banknote size={16} /> Price (USD)
          </label>
          <input
            required
            type="number"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. 250000"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Status</label>
          <select
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value as FlatStatus})}
          >
            <option value={FlatStatus.AVAILABLE}>Available</option>
            <option value={FlatStatus.SOLD}>Sold</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <ImageIcon size={16} /> Image URL
          </label>
          <input
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
        </div>
        <div className="lg:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full lg:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={22} />}
            Register Property
          </button>
        </div>
      </form>
    </section>
  );
};

const FlatCard = ({ flat, onDelete, onUpdate }: { flat: Flat; onDelete: (id: string) => void; onUpdate: (flat: Flat) => void }) => {
  const isAvailable = flat.status === FlatStatus.AVAILABLE;
  const id = flat._id || flat.id || '';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={flat.image || `https://picsum.photos/seed/${flat.flatNo}/400/300`}
          alt={flat.flatNo}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/error/400/300')}
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
              <Tag size={14} /> {flat.type}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-700 flex items-center">
              <DollarSign size={20} />
              {Number(flat.price).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => onUpdate(flat)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
              isAvailable 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw size={18} />
            {isAvailable ? 'Mark Sold' : 'Available'}
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFlats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API);
      setFlats(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to connect to the live database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlats();
  }, [fetchFlats]);

  const handleAddFlat = async (newFlat: Flat) => {
    try {
      await axios.post(API, newFlat);
      await fetchFlats();
    } catch (err) {
      alert("Error adding property.");
    }
  };

  const handleDeleteFlat = async (id: string) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      await fetchFlats();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleUpdateStatus = async (flat: Flat) => {
    const id = flat._id || flat.id;
    if (!id) return;
    const nextStatus = flat.status === FlatStatus.AVAILABLE ? FlatStatus.SOLD : FlatStatus.AVAILABLE;
    try {
      await axios.put(`${API}/${id}`, { ...flat, status: nextStatus });
      await fetchFlats();
    } catch (err) {
      alert("Status update failed.");
    }
  };

  const filteredFlats = useMemo(() => {
    return flats.filter(f => 
      f.flatNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [flats, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <Header onRefresh={fetchFlats} loading={loading} />
      
      <main className="max-w-7xl w-full mx-auto px-4 pt-8">
        {/* Stats Row */}
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

        <FlatForm onAdd={handleAddFlat} />

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              Property Listings
              <span className="bg-slate-200 text-slate-600 text-xs py-1 px-3 rounded-full">{filteredFlats.length}</span>
            </h2>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-blue-100 transition-all w-full md:w-80">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text"
                placeholder="Search flat no or type..."
                className="bg-transparent border-none outline-none text-slate-700 w-full font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading && flats.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Loader2 size={48} className="animate-spin mb-4 text-blue-600" />
              <p className="text-slate-500 font-medium">Syncing database...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-12 rounded-3xl text-center max-w-2xl mx-auto">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-900 mb-2">Sync Error</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button onClick={fetchFlats} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all">Retry Uplink</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFlats.map(flat => (
                <FlatCard 
                  key={flat._id || flat.id} 
                  flat={flat} 
                  onDelete={handleDeleteFlat} 
                  onUpdate={handleUpdateStatus} 
                />
              ))}
              {filteredFlats.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 font-bold">
                  No matching property records found.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-10 border-t border-slate-200 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Prime Estates Admin • Live Database Mode
      </footer>
    </div>
  );
};

// --- Rendering ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
