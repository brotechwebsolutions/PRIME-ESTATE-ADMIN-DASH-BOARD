
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { 
  Building2, PlusCircle, Trash2, RefreshCw, 
  Home, Tag, DollarSign, Search, Loader2, 
  CheckCircle2, AlertCircle, LayoutGrid, Hash, Layout, Banknote, Image as ImageIcon
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000/api/flats';

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

// --- Components ---

const Header = ({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) => (
  <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
          <Building2 className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">PRIME ESTATES</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Management Portal</p>
        </div>
      </div>
      
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm"
      >
        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        <span className="hidden sm:inline">Refresh Data</span>
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
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
          <PlusCircle size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Flat</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Flat Number</label>
          <input
            required
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="e.g. A-101"
            value={formData.flatNo}
            onChange={e => setFormData({...formData, flatNo: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Unit Type</label>
          <input
            required
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="e.g. 2BHK"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price ($)</label>
          <input
            required
            type="number"
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="250000"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status</label>
          <select
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value as FlatStatus})}
          >
            <option value={FlatStatus.AVAILABLE}>Available</option>
            <option value={FlatStatus.SOLD}>Sold</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Image URL</label>
          <input
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
        </div>
        <div className="lg:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full lg:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
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
    <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={flat.image || `https://picsum.photos/seed/${flat.flatNo}/800/600`}
          alt={flat.flatNo}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800')}
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {flat.status}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Unit {flat.flatNo}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{flat.type}</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-blue-600">
              ${Number(flat.price).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => onUpdate(flat)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              isAvailable 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            <RefreshCw size={16} />
            {isAvailable ? 'Mark Sold' : 'Available'}
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
          >
            <Trash2 size={18} />
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
      const { data } = await axios.get(API_BASE_URL);
      setFlats(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Cannot reach backend server at http://localhost:5000");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlats();
  }, [fetchFlats]);

  const handleAddFlat = async (newFlat: Flat) => {
    try {
      await axios.post(API_BASE_URL, newFlat);
      await fetchFlats();
    } catch (err) {
      alert("Error adding flat. Check backend.");
    }
  };

  const handleDeleteFlat = async (id: string) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
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
      await axios.put(`${API_BASE_URL}/${id}`, { ...flat, status: nextStatus });
      await fetchFlats();
    } catch (err) {
      alert("Update failed.");
    }
  };

  const filteredFlats = useMemo(() => {
    return flats.filter(f => 
      f.flatNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [flats, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onRefresh={fetchFlats} loading={loading} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Inventory</h2>
            <p className="text-slate-500 font-medium">Manage and track your property listings in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-4 ring-blue-50 transition-all w-full md:w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text"
              placeholder="Search flats..."
              className="bg-transparent border-none outline-none text-slate-700 w-full font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <FlatForm onAdd={handleAddFlat} />

        {loading && flats.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={48} className="animate-spin mb-4 text-blue-600" />
            <p className="font-bold">Syncing Database...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-12 rounded-[2rem] text-center max-w-2xl mx-auto">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Backend Unavailable</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={fetchFlats}
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              Retry Uplink
            </button>
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
            {filteredFlats.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold">No property records found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-slate-100 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Prime Estates Admin • Built with React 18
      </footer>
    </div>
  );
};

// --- Mount App ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
