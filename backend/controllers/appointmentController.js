import { supabase } from '../config/supabase.js';
import { sendAppointmentEmail } from '../services/emailService.js';

/**
 * Book a new appointment
 */
export const bookAppointment = async (req, res, next) => {
  try {
    const {
      patient_name,
      patient_phone,
      patient_email,
      patient_age,
      patient_gender,
      membership_number,
      doctor_id,
      doctor_name,
      department,
      appointment_date,
      appointment_type,
      reason,
      medical_history,
      address,
      user_type,
      user_id
    } = req.body;

    // Validate required fields
    if (!patient_name || !patient_phone || !doctor_id || !doctor_name ||
        !appointment_date || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    console.log('📝 Creating appointment:', {
      patient_name,
      doctor_name,
      appointment_date
    });

    // Insert appointment into database
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_name,
          patient_phone,
          patient_email: patient_email || null,
          patient_age: patient_age || null,
          patient_gender: patient_gender || null,
          membership_number: membership_number || null,
          doctor_id,
          doctor_name,
          department: department || null,
          appointment_date,
          appointment_type: appointment_type || 'General Consultation',
          reason,
          medical_history: medical_history || null,
          address: address || null,
          user_type: user_type || null,
          user_id: user_id || null,
          status: 'Pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Appointment created successfully:', appointment.id);

    // Send confirmation email
    try {
      await sendAppointmentEmail({
        to: 'thermal.aig@gmail.com',
        patientName: patient_name,
        patientPhone: patient_phone,
        patientEmail: patient_email || 'Not provided',
        doctorName: doctor_name,
        department: department || 'Not specified',
        appointmentDate: appointment_date,
        appointmentType: appointment_type || 'General Consultation',
        reason: reason,
        appointmentId: appointment.id
      });
      console.log('📧 Confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      // Don't fail the entire request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });

  } catch (error) {
    console.error('❌ Error booking appointment:', error);
    next(error);
  }
};

/**
 * Get appointments by user phone
 */
export const getUserAppointments = async (req, res, next) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_phone', phone)
      .order('appointment_date', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.error('❌ Error fetching user appointments:', error);
    next(error);
  }
};

/**
 * Get all appointments (admin)
 */
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;

    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    const { data: appointments, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    next(error);
  }
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('❌ Error fetching appointment:', error);
    next(error);
  }
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });

  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    next(error);
  }
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ 
        status: 'Cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });

  } catch (error) {
    console.error('❌ Error cancelling appointment:', error);
    next(error);
  }
};

/**
 * Delete appointment
 */
export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting appointment:', error);
    next(error);
  }
};

/**
 * Generate time slots from time range string for a specific day
 */
const generateTimeSlots = (timeRange, dayShort) => {
  if (!timeRange) {
    console.log('No time range provided');
    return [];
  }

  console.log('Processing time range:', timeRange, 'for day:', dayShort);

  const slots = [];
  const parts = timeRange.split(',').map(p => p.trim());

  console.log('Split parts:', parts);

  let currentDays = [];
  for (const part of parts) {
    const match = part.match(/^([\w,\s]*)\s*(.+)?$/);
    if (match) {
      const dayPart = match[1].trim();
      const timePart = match[2] ? match[2].trim() : '';

      console.log('Part:', part, 'Day part:', dayPart, 'Time part:', timePart);

      if (dayPart) {
        currentDays.push(...dayPart.split(',').map(d => d.trim().toLowerCase()));
      }

      if (timePart) {
        console.log('Processing time part:', timePart, 'for days:', currentDays);

        // Apply time to currentDays
        for (const day of currentDays) {
          const dayLower = day.toLowerCase();
          const dayShortLower = dayShort.toLowerCase();

          // Check various matching conditions
          const dayMatches = dayLower.includes(dayShortLower) ||
                            dayLower === 'daily' ||
                            dayLower === 'all' ||
                            (dayLower === 'mon' && dayShortLower === 'mon') ||
                            (dayLower === 'tue' && dayShortLower === 'tue') ||
                            (dayLower === 'wed' && dayShortLower === 'wed') ||
                            (dayLower === 'thu' && dayShortLower === 'thu') ||
                            (dayLower === 'fri' && dayShortLower === 'fri') ||
                            (dayLower === 'sat' && dayShortLower === 'sat') ||
                            (dayLower === 'sun' && dayShortLower === 'sun') ||
                            (dayLower.includes('monday') && dayShortLower === 'mon') ||
                            (dayLower.includes('tuesday') && dayShortLower === 'tue') ||
                            (dayLower.includes('wednesday') && dayShortLower === 'wed') ||
                            (dayLower.includes('thursday') && dayShortLower === 'thu') ||
                            (dayLower.includes('friday') && dayShortLower === 'fri') ||
                            (dayLower.includes('saturday') && dayShortLower === 'sat') ||
                            (dayLower.includes('sunday') && dayShortLower === 'sun');

          if (dayMatches) {
            console.log('Day matches:', day, 'Processing time:', timePart);

            const subparts = timePart.split('&').map(p => p.trim());
            for (const sub of subparts) {
              console.log('Processing subpart:', sub);

              const timeMatch = sub.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/);
              if (timeMatch) {
                const start = parseFloat(timeMatch[1]);
                const end = parseFloat(timeMatch[2]);

                console.log('Time range:', start, 'to', end);

                const startHour = Math.floor(start);
                const startMin = (start % 1) * 60;
                const endHour = Math.floor(end);
                const endMin = (end % 1) * 60;

                for (let h = startHour; h <= endHour; h++) {
                  const minStart = (h === startHour) ? startMin : 0;
                  const minEnd = (h === endHour) ? endMin : 60;

                  for (let m = minStart; m < minEnd; m += 30) {
                    const hour12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const time = `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
                    if (!slots.includes(time)) {
                      slots.push(time);
                      console.log('Added slot:', time);
                    }
                  }
                }
              } else {
                console.log('No time match for subpart:', sub);
              }
            }
          } else {
            console.log('Day does not match:', day, 'vs', dayShort);
          }
        }
        currentDays = []; // Reset for next group
      }
    }
  }

  console.log('Final slots generated:', slots);
  return slots.sort();
};

/**
 * Get available time slots for a doctor on a specific date and OPD type
 */
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date, opdType } = req.params;
    
    console.log('🔍 Getting slots for:', { doctorId, date, opdType });

    // Get doctor details
    const { data: doctor, error: doctorError } = await supabase
      .from('opd_schedule')
      .select('*')
      .eq('id', parseInt(doctorId))
      .single();

    if (doctorError || !doctor) {
      console.log('❌ Doctor not found:', doctorError);
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    console.log('👨‍⚕️ Doctor found:', doctor);

    // Get time range for the OPD type
    const timeRange = opdType === 'General OPD' ? doctor.general_opd_days : doctor.private_opd_days;
    console.log('⏰ Time range for', opdType, ':', timeRange);

    // If no time range, provide default slots
    if (!timeRange) {
      console.log('No time range found, using default slots');
      const defaultSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
      ];

      // Since we no longer track appointment times, we can't filter based on booked times
      const availableSlots = defaultSlots;

      return res.status(200).json({
        success: true,
        data: availableSlots
      });
    }

    // Get day short
    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayShort = dayName.substring(0, 3).toLowerCase();
    console.log('📅 Selected date:', date, 'Day:', dayName, 'Short:', dayShort);

    // Generate time slots from the time range for the selected day
    const slots = generateTimeSlots(timeRange, dayShort);
    console.log('🎯 Generated slots:', slots);

    if (slots.length === 0) {
      console.log('⚠️ No slots generated. Time range may be invalid or day not matching.');
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No available time slots for the selected date and OPD type'
      });
    }

    // Since we no longer track appointment times, we can't filter based on booked times
    const availableSlots = slots;
    console.log('✅ Available slots after filtering:', availableSlots);

    res.status(200).json({
      success: true,
      data: availableSlots
    });

  } catch (error) {
    console.error('❌ Error getting available slots:', error);
    next(error);
  }
}; // End of getAvailableSlots function

// Approve and reject functions removed as per requirement