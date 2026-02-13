import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { 
  Building2, PlusCircle, Trash2, RefreshCw, 
  Search, Loader2, AlertCircle, Layout, Hash, Banknote, Image as ImageIcon, Tag, Info
} from 'lucide-react';

const h = React.createElement;
const API = "https://prime-estates-api.onrender.com/api/flats";

const FlatStatus = {
  AVAILABLE: 'Available',
  SOLD: 'Sold'
};

const MOCK_DATA = [
  { id: 'demo-1', flatNo: '101', type: '2BHK Luxury', price: 150000, status: FlatStatus.AVAILABLE, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=400' },
  { id: 'demo-2', flatNo: '204', type: '3BHK Penthouse', price: 320000, status: FlatStatus.SOLD, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&h=400' },
  { id: 'demo-3', flatNo: '405', type: 'Studio Suite', price: 95000, status: FlatStatus.AVAILABLE, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&h=400' }
];

const Header = ({ onRefresh, loading, searchTerm, onSearchChange, demoMode }) => {
  return h('header', { className: "bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" },
    h('div', { className: "max-w-7xl mx-auto px-4 h-20 flex items-center justify-between" },
      h('div', { className: "flex items-center gap-3" },
        h('div', { className: "bg-blue-600 p-2 rounded-xl" },
          h(Building2, { className: "text-white", size: 28 })
        ),
        h('div', null,
          h('div', { className: "flex items-center gap-2" },
            h('h1', { className: "text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none" }, "PRIME ESTATES"),
            demoMode && h('span', { className: "bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-orange-200" }, "DEMO MODE")
          ),
          h('p', { className: "text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1" }, "Admin Dashboard")
        )
      ),
      h('div', { className: "hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 w-80 shadow-inner" },
        h(Search, { size: 18, className: "text-slate-400" }),
        h('input', {
          type: "text",
          placeholder: "Search properties...",
          className: "bg-transparent outline-none w-full font-medium text-slate-700",
          value: String(searchTerm || ''),
          onChange: e => onSearchChange(e.target.value)
        })
      ),
      h('button', {
        onClick: onRefresh,
        disabled: loading,
        className: "p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors active:scale-90"
      },
        h(RefreshCw, { size: 22, className: loading ? 'animate-spin text-blue-600' : '' })
      )
    )
  );
};

const FlatForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({ flatNo: '', type: '', price: '', status: FlatStatus.AVAILABLE, image: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.flatNo || !formData.type || !formData.price) return;
    setSubmitting(true);
    try {
      await onAdd({ ...formData, price: Number(formData.price) });
      setFormData({ flatNo: '', type: '', price: '', status: FlatStatus.AVAILABLE, image: '' });
    } finally { setSubmitting(false); }
  };

  return h('section', { className: "bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-10" },
    h('div', { className: "flex items-center gap-3 mb-6" },
      h('div', { className: "bg-blue-50 p-2 rounded-lg" }, h(PlusCircle, { className: "text-blue-600", size: 24 })),
      h('h2', { className: "text-2xl font-bold text-slate-800 tracking-tight" }, "Add New Property")
    ),
    h('form', { onSubmit: handleSubmit, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
      h('div', { className: "space-y-2" },
        h('label', { className: "text-sm font-semibold text-slate-600 flex items-center gap-2" }, h(Hash, { size: 16 }), " Flat Number"),
        h('input', { required: true, className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500", placeholder: "e.g. A-101", value: String(formData.flatNo), onChange: e => setFormData({ ...formData, flatNo: e.target.value }) })
      ),
      h('div', { className: "space-y-2" },
        h('label', { className: "text-sm font-semibold text-slate-600 flex items-center gap-2" }, h(Layout, { size: 16 }), " Type"),
        h('input', { required: true, className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500", placeholder: "e.g. 3BHK Apartment", value: String(formData.type), onChange: e => setFormData({ ...formData, type: e.target.value }) })
      ),
      h('div', { className: "space-y-2" },
        h('label', { className: "text-sm font-semibold text-slate-600 flex items-center gap-2" }, h(Banknote, { size: 16 }), " Price (USD)"),
        h('input', { required: true, type: "number", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500", placeholder: "e.g. 250000", value: String(formData.price), onChange: e => setFormData({ ...formData, price: e.target.value }) })
      ),
      h('div', { className: "space-y-2" },
        h('label', { className: "text-sm font-semibold text-slate-600" }, "Status"),
        h('select', { className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 bg-white", value: formData.status, onChange: e => setFormData({ ...formData, status: e.target.value }) },
          h('option', { value: FlatStatus.AVAILABLE }, "Available"),
          h('option', { value: FlatStatus.SOLD }, "Sold")
        )
      ),
      h('div', { className: "md:col-span-2 space-y-2" },
        h('label', { className: "text-sm font-semibold text-slate-600 flex items-center gap-2" }, h(ImageIcon, { size: 16 }), " Image URL"),
        h('input', { className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500", placeholder: "https://images.unsplash.com/...", value: String(formData.image), onChange: e => setFormData({ ...formData, image: e.target.value }) })
      ),
      h('div', { className: "lg:col-span-3 flex justify-end" },
        h('button', { type: "submit", disabled: submitting, className: "w-full lg:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-100 active:scale-95" },
          submitting ? h(Loader2, { size: 20, className: "animate-spin" }) : h(PlusCircle, { size: 22 }),
          "Register Property"
        )
      )
    )
  );
};

const FlatCard = ({ flat, onDelete, onUpdate }) => {
  const isAvailable = flat.status === FlatStatus.AVAILABLE;
  const id = String(flat._id || flat.id || '');
  return h('div', { className: "bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all group" },
    h('div', { className: "relative h-56 overflow-hidden bg-slate-100" },
      h('img', {
        src: flat.image || `https://picsum.photos/seed/${flat.flatNo}/600/400`,
        className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
        alt: String(flat.flatNo || 'Unit'),
        onError: (e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&h=400&auto=format&fit=crop'; }
      }),
      h('div', { className: `absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}` }, String(flat.status))
    ),
    h('div', { className: "p-6" },
      h('div', { className: "flex justify-between items-start mb-4" },
        h('div', { className: "flex-1 min-w-0" },
          h('h3', { className: "text-xl font-bold text-slate-800 truncate" }, `Unit ${String(flat.flatNo || '')}`),
          h('p', { className: "text-slate-500 font-medium flex items-center gap-1.5 mt-1" }, h(Tag, { size: 14, className: "text-blue-500" }), String(flat.type || ''))
        ),
        h('span', { className: "text-2xl font-black text-blue-700 flex items-center ml-2" },
          h('span', { className: "text-sm mr-0.5" }, "$"),
          Number(flat.price || 0).toLocaleString()
        )
      ),
      h('div', { className: "grid grid-cols-2 gap-3 pt-2" },
        h('button', { onClick: () => onUpdate(flat), className: `flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all text-sm shadow-sm active:scale-95 ${isAvailable ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'}` },
          h(RefreshCw, { size: 16 }), isAvailable ? 'Mark Sold' : 'Available'
        ),
        h('button', { onClick: () => onDelete(id), className: "flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 text-sm shadow-sm active:scale-95" },
          h(Trash2, { size: 16 }), " Delete"
        )
      )
    )
  );
};

const App = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  const fetchFlats = useCallback(async (isManual = false) => {
    if (demoMode && !isManual) return;
    setLoading(true);
    try {
      const { data } = await axios.get(API, { timeout: 15000 });
      setFlats(Array.isArray(data) ? data : []);
      setError(null);
      setDemoMode(false);
    } catch (err) {
      if (!demoMode) {
        setError(`The live API at Render is likely sleeping. Free-tier servers take 50-60 seconds to start up.`);
      }
    } finally { setLoading(false); }
  }, [demoMode]);

  useEffect(() => { fetchFlats(); }, [fetchFlats]);

  const enableDemoMode = () => {
    setFlats(MOCK_DATA);
    setDemoMode(true);
    setError(null);
    setLoading(false);
  };

  const handleAddFlat = async (newFlat) => {
    if (demoMode) {
      setFlats(prev => [...prev, { ...newFlat, id: 'demo-' + Date.now().toString() }]);
      return;
    }
    try { await axios.post(API, newFlat); await fetchFlats(); } 
    catch (err) { alert("Error adding flat."); }
  };

  const handleDeleteFlat = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    if (demoMode) {
      setFlats(prev => prev.filter(f => (f.id || f._id) !== id));
      return;
    }
    try { await axios.delete(`${API}/${id}`); await fetchFlats(); } 
    catch (err) { alert("Action failed."); }
  };

  const handleUpdateStatus = async (flat) => {
    const id = flat._id || flat.id;
    const nextStatus = flat.status === FlatStatus.AVAILABLE ? FlatStatus.SOLD : FlatStatus.AVAILABLE;
    if (demoMode) {
      setFlats(prev => prev.map(f => (f.id || f._id) === id ? { ...f, status: nextStatus } : f));
      return;
    }
    try { await axios.put(`${API}/${id}`, { ...flat, status: nextStatus }); await fetchFlats(); } 
    catch (err) { alert("Update failed."); }
  };

  const filteredFlats = useMemo(() => {
    return flats.filter(f => 
      String(f.flatNo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      String(f.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [flats, searchTerm]);

  const stats = [
    h('div', { key: 'total', className: "bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200" },
      h('p', { className: "text-blue-100 text-xs font-bold uppercase tracking-widest mb-2" }, "Total Units"),
      h('h2', { className: "text-5xl font-black" }, flats.length)
    ),
    h('div', { key: 'avail', className: "bg-white rounded-3xl p-8 border border-slate-200 shadow-sm" },
      h('p', { className: "text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" }, "Available"),
      h('h2', { className: "text-5xl font-black text-green-600" }, flats.filter(f => f.status === FlatStatus.AVAILABLE).length)
    ),
    h('div', { key: 'sold', className: "bg-white rounded-3xl p-8 border border-slate-200 shadow-sm" },
      h('p', { className: "text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" }, "Sold"),
      h('h2', { className: "text-5xl font-black text-red-500" }, flats.filter(f => f.status === FlatStatus.SOLD).length)
    )
  ];

  const mainContent = loading && flats.length === 0 ? 
    h('div', { className: "py-24 text-center" }, h(Loader2, { size: 56, className: "animate-spin text-blue-600 mx-auto" })) : 
    error ? 
    h('div', { className: "bg-white p-12 rounded-[2rem] text-center border border-slate-200 max-w-2xl mx-auto shadow-sm" }, 
      h(AlertCircle, { size: 48, className: "text-orange-500 mx-auto mb-4" }), 
      h('p', { className: "text-slate-800 font-bold text-xl mb-2" }, "API Is Waking Up"),
      h('p', { className: "text-slate-500 text-sm mb-8 leading-relaxed" }, String(error)),
      h('div', { className: "flex flex-col sm:flex-row gap-4 justify-center" },
        h('button', { onClick: () => fetchFlats(true), className: "px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95" }, "Retry Connection"),
        h('button', { onClick: enableDemoMode, className: "px-8 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-95" }, "Explore Demo Mode")
      )
    ) : 
    h('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, 
      filteredFlats.map(flat => h(FlatCard, { 
        key: String(flat._id || flat.id), 
        flat, 
        onDelete: handleDeleteFlat, 
        onUpdate: handleUpdateStatus 
      }))
    );

  return h('div', { className: "min-h-screen bg-slate-50 flex flex-col pb-20" },
    h(Header, { onRefresh: () => fetchFlats(true), loading, searchTerm, onSearchChange: setSearchTerm, demoMode }),
    h('main', { className: "max-w-7xl w-full mx-auto px-4 pt-8" },
      demoMode && h('div', { className: "bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-8 flex items-center justify-between shadow-sm" },
        h('div', { className: "flex items-center gap-3 text-orange-800" },
          h(Info, { size: 20 }),
          h('p', { className: "text-sm font-medium" }, "Running in Demo Mode. Your changes are local only.")
        ),
        h('button', { onClick: () => window.location.reload(), className: "text-xs font-bold text-orange-600 hover:underline" }, "Try Reconnect")
      ),
      h('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" }, ...stats),
      h(FlatForm, { onAdd: handleAddFlat }),
      mainContent
    ),
    h('footer', { className: "mt-auto py-12 text-center" }, 
      h('p', { className: "text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]" }, `PRIME ESTATES © ${new Date().getFullYear()} • DASHBOARD ENGINE`)
    )
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { 
  createRoot(rootElement).render(h(App, null)); 
}