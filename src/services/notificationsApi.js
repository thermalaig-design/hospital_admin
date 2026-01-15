import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLE_NAME = 'marquee_updates';

// Get all notifications
export const getAllNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Get active notifications
export const getActiveNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active notifications:', error);
    throw error;
  }
};

// Create notification
export const createNotification = async (message, priority = 0, createdBy = 'admin') => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          message,
          priority,
          is_active: true,
          created_by: createdBy,
          updated_by: createdBy,
        },
      ])
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Update notification
export const updateNotification = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...updates,
        updated_at: new Date(),
        updated_by: updates.updated_by || 'admin',
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (id) => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Toggle notification active status
export const toggleNotificationStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        is_active: isActive,
        updated_at: new Date(),
        updated_by: 'admin',
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error toggling notification status:', error);
    throw error;
  }
};
