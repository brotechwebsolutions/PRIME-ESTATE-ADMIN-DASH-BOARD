import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { 
  Building2, PlusCircle, Trash2, RefreshCw, 
  Home, Tag, DollarSign, Search, Loader2, 
  AlertCircle, Layout, Hash, Banknote, Image as ImageIcon
} from 'lucide-react';

/** 
 * CONFIGURATION & TYPES
 */
const API = "https://prime-estates-api.onrender.com/api/flats";

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

/**
 * UI COMPONENTS
 */

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
        className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
      </button>
    </div>
  </header>
);

const FlatForm = ({ onAdd }: { onAdd: (flat: Flat) => Promise<void> }) => {
  const [formData, setFormData] = useState<Flat>({
    flatNo: '', type: '', price: '', status: FlatStatus.AVAILABLE, image: ''
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
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Property</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Hash size={16} /> Flat Number</label>
          <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all" placeholder="A-101" value={formData.flatNo} onChange={e => setFormData({...formData, flatNo: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Layout size={16} /> Type</label>
          <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all" placeholder="3BHK" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Banknote size={16} /> Price</label>
          <input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all" placeholder="250000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Status</label>
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as FlatStatus})}>
            <option value={FlatStatus.AVAILABLE}>Available</option>
            <option value={FlatStatus.SOLD}>Sold</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2"><ImageIcon size={16} /> Image URL</label>
          <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
        </div>
        <div className="lg:col-span-3 flex justify-end">
          <button type="submit" disabled={submitting} className="w-full lg:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-lg shadow-blue-100">
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
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={flat.image || `https://picsum.photos/seed/${flat.flatNo}/400/300`} 
          className="w-full h-full object-cover" 
          alt={flat.flatNo}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&h=300&auto=format&fit=crop'; }}
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{flat.status}</div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-800 leading-tight truncate">Unit {flat.flatNo}</h3>
            <p className="text-slate-500 text-sm truncate">{flat.type}</p>
          </div>
          <span className="text-2xl font-bold text-blue-700 flex items-center ml-2">
            <DollarSign size={18} />
            {Number(flat.price).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onUpdate(flat)} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all text-sm ${isAvailable ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            <RefreshCw size={16} /> {isAvailable ? 'Mark Sold' : 'Available'}
          </button>
          <button onClick={() => onDelete(id)} className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN APP
 */
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
      setError("Database connection error. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFlats(); }, [fetchFlats]);

  const handleAddFlat = async (newFlat: Flat) => {
    try { await axios.post(API, newFlat); await fetchFlats(); } catch (err) { alert("Error adding flat."); }
  };

  const handleDeleteFlat = async (id: string) => {
    if (!window.confirm("Delete listing permanently?")) return;
    try { await axios.delete(`${API}/${id}`); await fetchFlats(); } catch (err) { alert("Delete failed."); }
  };

  const handleUpdateStatus = async (flat: Flat) => {
    const id = flat._id || flat.id; if (!id) return;
    const nextStatus = flat.status === FlatStatus.AVAILABLE ? FlatStatus.SOLD : FlatStatus.AVAILABLE;
    try { await axios.put(`${API}/${id}`, { ...flat, status: nextStatus }); await fetchFlats(); } catch (err) { alert("Update failed."); }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-1">Total Units</p>
            <h2 className="text-4xl font-bold">{flats.length}</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Available</p>
            <h2 className="text-4xl font-bold text-green-600">{flats.filter(f => f.status === FlatStatus.AVAILABLE).length}</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Sold</p>
            <h2 className="text-4xl font-bold text-red-500">{flats.filter(f => f.status === FlatStatus.SOLD).length}</h2>
          </div>
        </div>

        <FlatForm onAdd={handleAddFlat} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Inventory Listing
            <span className="bg-blue-100 text-blue-700 text-xs font-bold py-1 px-3 rounded-full">{filteredFlats.length}</span>
          </h2>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 w-full md:w-80 shadow-sm focus-within:ring-2 ring-blue-100">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="bg-transparent outline-none w-full font-medium text-slate-700" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {loading && flats.length === 0 ? (
          <div className="py-20 text-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto" />
            <p className="text-slate-500 mt-4 font-medium">Syncing with server...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-12 rounded-3xl text-center border border-red-100 max-w-xl mx-auto">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-bold mb-4">{error}</p>
            <button onClick={fetchFlats} className="bg-red-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-red-700">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFlats.map(flat => (
              <FlatCard key={flat._id || flat.id} flat={flat} onDelete={handleDeleteFlat} onUpdate={handleUpdateStatus} />
            ))}
            {filteredFlats.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                No properties found in the current view.
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="mt-auto py-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        &copy; {new Date().getFullYear()} Prime Estates Management Portal • Powered by React 18
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
