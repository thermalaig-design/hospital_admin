// appointmentService.js - Frontend service for appointment booking
const API_URL = 'https://hospital-management-3-7z4c.onrender.com/api';

/**
 * Book a new appointment
 */
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_URL}/appointments/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to book appointment');
    }

    return data;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

/**
 * Get user's appointments
 */
export const getUserAppointments = async (phone) => {
  try {
    const response = await fetch(`${API_URL}/appointments/user/${phone}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch appointments');
    }

    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${API_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel appointment');
    }

    return data;
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw error;
  }
};