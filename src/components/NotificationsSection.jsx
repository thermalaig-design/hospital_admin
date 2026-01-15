import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  toggleNotificationStatus,
} from '../services/notificationsApi';

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ message: '', priority: 0 });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getAllNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updateNotification(editingId, {
          message: formData.message,
          priority: parseInt(formData.priority),
        });
        setSuccess('Notification updated successfully');
      } else {
        await createNotification(formData.message, parseInt(formData.priority));
        setSuccess('Notification created successfully');
      }
      await fetchNotifications();
      setFormData({ message: '', priority: 0 });
      setEditingId(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to save notification');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNotification = (notification) => {
    setFormData({
      message: notification.message,
      priority: notification.priority || 0,
    });
    setEditingId(notification.id);
    setShowForm(true);
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        setLoading(true);
        await deleteNotification(id);
        setSuccess('Notification deleted successfully');
        await fetchNotifications();
        setError(null);
      } catch (err) {
        setError('Failed to delete notification');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (notification) => {
    try {
      setLoading(true);
      await toggleNotificationStatus(notification.id, !notification.is_active);
      await fetchNotifications();
      setSuccess(
        `Notification ${!notification.is_active ? 'activated' : 'deactivated'}`
      );
      setError(null);
    } catch (err) {
      setError('Failed to update notification status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ message: '', priority: 0 });
  };

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 lg:p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
            <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-white">Notifications</h2>
            <p className="text-slate-400 text-xs lg:text-sm">Manage system announcements</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 lg:p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 lg:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
          <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-400 text-sm">{success}</p>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 lg:p-5 bg-white/5 border border-white/10 rounded-xl">
          <h3 className="text-base font-bold text-white mb-4">
            {editingId ? 'Edit Notification' : 'Create New Notification'}
          </h3>
          <form onSubmit={handleAddNotification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Enter notification message..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority (0 = Low, 10 = High)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 lg:px-6 py-2 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-colors duration-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 lg:px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm && (
        <div className="text-center py-10">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
          <p className="mt-4 text-slate-400 text-sm">Loading notifications...</p>
        </div>
      )}

      {!loading && notifications.length === 0 && !showForm && (
        <div className="text-center py-10">
          <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No notifications yet</p>
          <p className="text-slate-500 text-sm">
            Create your first notification to get started
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-xl transition-all duration-300 ${
                notification.is_active
                  ? 'bg-amber-500/10 border-amber-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="text-white text-sm font-medium flex-1 break-words">
                      {notification.message}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                        notification.is_active
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {notification.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Priority: {notification.priority}</span>
                    <span>
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleToggleStatus(notification)}
                    title={
                      notification.is_active ? 'Deactivate' : 'Activate'
                    }
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      notification.is_active
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30'
                    }`}
                  >
                    {notification.is_active ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleEditNotification(notification)}
                    title="Edit"
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteNotification(notification.id)
                    }
                    title="Delete"
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
