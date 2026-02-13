
import React, { useState } from 'react';
import { PlusCircle, Image as ImageIcon, Hash, Layout, Banknote } from 'lucide-react';
import { Flat, FlatStatus } from '../types';

interface FlatFormProps {
  onSubmit: (flat: Flat) => Promise<void>;
}

const FlatForm: React.FC<FlatFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Flat>({
    flatNo: '',
    type: '',
    price: '',
    status: FlatStatus.AVAILABLE,
    image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.flatNo || !formData.type || !formData.price) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price)
      });
      setFormData({
        flatNo: '',
        type: '',
        price: '',
        status: FlatStatus.AVAILABLE,
        image: ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
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
            type="text"
            name="flatNo"
            value={formData.flatNo}
            onChange={handleChange}
            placeholder="e.g. A-101"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Layout size={16} /> Property Type
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g. 3BHK Apartment"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Banknote size={16} /> Price (USD)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 250000"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value={FlatStatus.AVAILABLE}>Available</option>
            <option value={FlatStatus.SOLD}>Sold</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <ImageIcon size={16} /> Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="lg:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full lg:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <PlusCircle size={22} />
                Register Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlatForm;
