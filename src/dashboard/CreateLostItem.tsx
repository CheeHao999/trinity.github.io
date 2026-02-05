import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../shared/api/client';
import { ArrowLeft } from 'lucide-react';

const CreateLostItem: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Device',
    color: '',
    description: '',
    location: '',
    lostDate: '',
    contactInfo: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await client.post('/lost-items', formData);
      navigate('/lost-items');
    } catch (err: any) {
      setError(err.message || 'Failed to create lost item report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 mb-8 hover:text-white transition font-bold uppercase tracking-widest text-sm group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="border-2 border-white bg-surface p-10 relative">
        <div className="absolute top-0 left-0 bg-white text-black px-4 py-1 font-bold uppercase tracking-widest text-xs">
          New Report
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase mb-10 tracking-tighter text-white">Report Lost Item</h1>
        
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 border-l-4 border-red-500 mb-8 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium appearance-none"
              >
                <option value="Device">Device</option>
                <option value="Bag">Bag</option>
                <option value="Keys">Keys</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
                Color (Optional)
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium"
                placeholder="e.g. Black"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium"
              required
              placeholder="e.g. Blue Backpack"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium resize-none"
              required
              placeholder="Describe the item in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
                Location Lost
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium"
                required
                placeholder="e.g. Library 2nd Floor"
              />
            </div>
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
                Date Lost
              </label>
              <input
                type="date"
                name="lostDate"
                value={formData.lostDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
              Contact Information
            </label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium"
              required
              placeholder="Email or Phone Number"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex-1 btn-mappa-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-mappa"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLostItem;
