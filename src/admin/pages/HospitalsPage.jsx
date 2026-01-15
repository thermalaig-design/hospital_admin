import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Search, Plus, Edit2, Trash2, X, Save, Loader, ChevronLeft } from 'lucide-react';
import Pagination from '../components/Pagination';
import { 
  getAllHospitalsAdmin, 
  createHospital, 
  updateHospital, 
  deleteHospital 
} from '../services/adminApi';

const HospitalsPage = ({ onNavigate }) => {
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllHospitalsAdmin();
      setHospitals(response?.data || []);
    } catch (err) {
      console.error('Error loading hospitals:', err);
      setError(`Failed to load hospitals: ${err.message || 'Please make sure backend server is running'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return hospitals;
    
    return hospitals.filter(item => {
      try {
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(q)
        );
      } catch {
        return false;
      }
    });
  }, [searchQuery, hospitals]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowAddForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) {
      return;
    }

    try {
      const id = item.id || item.hospital_id || item['S. No.'];
      await deleteHospital(id);
      setHospitals(hospitals.filter(h => (h.id || h.hospital_id || h['S. No.']) !== id));
      alert('Hospital deleted successfully!');
    } catch (err) {
      console.error('Error deleting hospital:', err);
      alert(`Failed to delete: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const id = editingItem?.id || editingItem?.hospital_id || editingItem?.['S. No.'];

      if (id) {
        await updateHospital(id, formData);
        setHospitals(hospitals.map(h => 
          (h.id || h.hospital_id || h['S. No.']) === id ? { ...h, ...formData } : h
        ));
      } else {
        const newHospital = await createHospital(formData);
        setHospitals([...hospitals, newHospital.data]);
      }
      
      setShowAddForm(false);
      setEditingItem(null);
      setFormData({});
      alert(editingItem ? 'Hospital updated successfully!' : 'Hospital added successfully!');
    } catch (err) {
      console.error('Error saving hospital:', err);
      alert(`Failed to save: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    const fields = [
      { key: 'hospital_name', label: 'Hospital Name', required: true },
      { key: 'trust_name', label: 'Trust Name' },
      { key: 'hospital_type', label: 'Hospital Type' },
      { key: 'address', label: 'Address', fullWidth: true },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'pincode', label: 'Pincode' },
      { key: 'contact_phone', label: 'Contact Phone' },
      { key: 'contact_email', label: 'Contact Email' },
      { key: 'bed_strength', label: 'Bed Strength' },
      { key: 'established_year', label: 'Established Year' },
      { key: 'accreditation', label: 'Accreditation' },
      { key: 'facilities', label: 'Facilities', type: 'textarea', fullWidth: true },
      { key: 'departments', label: 'Departments', type: 'textarea', fullWidth: true },
    ];
    
    return (
      <div className="px-6 mt-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingItem ? 'Edit' : 'Add'} Hospital
            </h2>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                setFormData({});
              }}
              className="p-2 rounded-xl hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                setFormData({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHospitalCard = (item) => {
    const displayName = item.hospital_name || item.Name || 'N/A';
    const id = item.id || item.hospital_id || item['S. No.'];

    return (
      <div key={id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-base mb-2">{displayName}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {item.hospital_type && (
                <p><span className="font-medium">Type:</span> {item.hospital_type}</p>
              )}
              {item.trust_name && (
                <p><span className="font-medium">Trust:</span> {item.trust_name}</p>
              )}
              {item.city && (
                <p><span className="font-medium">City:</span> {item.city}</p>
              )}
              {item.state && (
                <p><span className="font-medium">State:</span> {item.state}</p>
              )}
              {item.contact_phone && (
                <p><span className="font-medium">Phone:</span> {item.contact_phone}</p>
              )}
              {item.bed_strength && (
                <p><span className="font-medium">Beds:</span> {item.bed_strength}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleEdit(item)}
            className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg font-medium hover:bg-indigo-100 flex items-center justify-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 pb-10">
      {/* Header */}
      <div className="px-6 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('main')}
            className="bg-gray-100 text-gray-700 p-2 rounded-xl font-medium hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Hospitals</h2>
            <p className="text-gray-600 text-sm mt-1">Manage hospitals and their details</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-6 mt-4">
        <div className="bg-gray-50 rounded-2xl p-2 flex items-center gap-3 border border-gray-200 focus-within:border-indigo-300 transition-all shadow-sm">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 ml-1">
            <Search className="h-5 w-5 text-indigo-600" />
          </div>
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-medium text-sm py-2"
          />
        </div>
      </div>

      {/* Add Button */}
      <div className="px-6 mt-4">
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Hospital
        </button>
      </div>

      {/* Form */}
      {(showAddForm || editingItem) && renderForm()}

      {/* Error Message */}
      {error && !showAddForm && !editingItem && (
        <div className="px-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !filteredData.length && !showAddForm && !editingItem && (
        <div className="px-6 mt-4 text-center py-20">
          <Loader className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-600 mt-2">Loading hospitals...</p>
        </div>
      )}

      {/* Content List */}
      {!showAddForm && !editingItem && (
        <div className="px-6 mt-4 space-y-4">
          {!loading && filteredData.length > 0 ? (
            paginatedData.map(item => renderHospitalCard(item))
          ) : !loading ? (
            <div className="text-center py-20">
              <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-300">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-gray-800 font-bold">No hospitals found</h3>
              <p className="text-gray-500 text-sm mt-1">Try adding a new hospital or searching with different keywords</p>
            </div>
          ) : null}
          
          {filteredData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      )}

      {/* Form Modal - removed */}
    </div>
  );
};

export default HospitalsPage;