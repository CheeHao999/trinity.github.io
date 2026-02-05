import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../shared/api/client';
import { LostItem } from '../shared/types';
import { MapPin, Calendar, Phone, Plus, Search, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '../login/AuthContext';

const LostItems: React.FC = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await client.get('/lost-items');
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching lost items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await client.delete(`/lost-items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleResolve = async (id: string) => {
    if (!window.confirm('Mark this item as resolved?')) return;
    try {
      await client.put(`/lost-items/${id}`, { status: 'RESOLVED' });
      // Update local state to reflect change
      setItems(items.map(item => 
        item.id === id ? { ...item, status: 'RESOLVED' } : item
      ));
    } catch (error) {
      console.error('Error resolving item:', error);
      alert('Failed to resolve item');
    }
  };

  const handleNotifyOwner = async (id: string) => {
    if (!window.confirm('Notify owner that their item has been found?')) return;
    try {
      await client.post(`/lost-items/${id}/notify-owner`);
      alert('Owner notified successfully!');
    } catch (error) {
      console.error('Error notifying owner:', error);
      alert('Failed to notify owner');
    }
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-white pb-8 gap-6">
        <div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2 text-white">Lost</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Items reported missing</p>
        </div>
        <Link
          to="/create-lost"
          className="btn-mappa flex items-center gap-2"
        >
          <Plus size={18} />
          Report Item
        </Link>
      </div>

      <div className="mb-12 relative group">
        <input
          type="text"
          placeholder="SEARCH BY CATEGORY..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 pl-12 border-2 border-white bg-background text-white focus:bg-white focus:text-black outline-none transition-all placeholder:text-gray-600 font-bold uppercase tracking-wider text-lg"
        />
        <Search className="absolute left-4 top-5 text-gray-600 group-focus-within:text-black transition-colors" size={24} />
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold uppercase tracking-widest text-xl text-white">Loading data...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-800">
          <p className="text-gray-500 font-bold uppercase tracking-widest">No items match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group border-2 border-white bg-surface hover:bg-white transition-colors duration-300 relative">
              {item.status === 'RESOLVED' && (
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-3 py-1 font-bold uppercase tracking-widest border border-white z-20">
                  Resolved
                </div>
              )}

              {/* Only show Image if Admin */}
              {isAdmin && (
                <div className="relative overflow-hidden aspect-video border-b-2 border-white">
                  {(user?.id === item.userId || user?.role === 'ADMIN') && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      {item.status !== 'RESOLVED' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleResolve(item.id);
                          }}
                          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors shadow-lg"
                          title="Mark as Resolved"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(item.id);
                        }}
                        className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors shadow-lg"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  
                  {/* Admin Notify Owner Action */}
                  {user?.role === 'ADMIN' && item.status !== 'RESOLVED' && (
                    <div className="absolute top-2 left-2 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleNotifyOwner(item.id);
                        }}
                        className="bg-blue-600 text-white font-bold uppercase tracking-wider text-xs px-3 py-2 rounded hover:bg-blue-500 transition-colors shadow-lg"
                      >
                        Notify Owner
                      </button>
                    </div>
                  )}

                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-400 transition-colors">
                      <span className="font-bold uppercase tracking-widest text-xs">No Image</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                {/* Simplified View for Normal Users */}
                {!isAdmin ? (
                  <>
                    <h3 className="text-2xl font-black uppercase mb-3 leading-tight text-white group-hover:text-black transition-colors">
                      {item.category} <span className="text-base font-medium text-gray-500 ml-2">({item.color || 'N/A'})</span>
                    </h3>
                    
                    <div className="space-y-3 border-t-2 border-gray-800 group-hover:border-gray-200 pt-4">
                      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-800">
                        <Calendar size={16} />
                        <span>{new Date(item.lostDate || item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Full Details for Admin */
                  <>
                    <h3 className="text-2xl font-black uppercase mb-3 leading-tight text-white group-hover:text-black transition-colors">{item.name}</h3>
                    <p className="text-gray-400 mb-6 text-sm line-clamp-2 group-hover:text-gray-600 transition-colors font-medium">{item.description}</p>
                    
                    <div className="space-y-3 border-t-2 border-gray-800 group-hover:border-gray-200 pt-4">
                      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-800">
                        <span className="w-4 h-4 rounded-full border border-gray-500" style={{ backgroundColor: item.color || 'transparent' }}></span>
                        <span>Color: {item.color || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-800">
                        <MapPin size={16} />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-800">
                        <Calendar size={16} />
                        <span>{new Date(item.lostDate || item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-800">
                        <Phone size={16} />
                        <span>{item.contactInfo}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostItems;
