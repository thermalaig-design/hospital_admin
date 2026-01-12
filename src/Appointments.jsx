import React, { useState, useEffect } from 'react';
import { User, Phone, ChevronRight, ChevronLeft, Calendar, Stethoscope, Home as HomeIcon, Mail, AlertCircle, Clock } from 'lucide-react';
import { getDoctors } from './services/api';
import { bookAppointment } from './services/appointmentService';

const Appointments = ({ onNavigate, appointmentForm, setAppointmentForm }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dateError, setDateError] = useState('');

  // Load user data from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        
        // Auto-populate form with user data
        setAppointmentForm({
          ...appointmentForm,
          patientName: parsedUser['Name'] || parsedUser.name || '',
          phone: (parsedUser['Mobile'] || parsedUser.mobile || '').substring(0, 15), // Limit to 15 characters
          email: parsedUser['Email'] || parsedUser.email || '',
          membershipNumber: parsedUser['Membership number'] || parsedUser.membership_number || '',
          address: parsedUser['Address Home'] || parsedUser.address || ''
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await getDoctors();
        console.log('✅ Fetched doctors:', response);
        setDoctors(response.data || []);
        setError('');
      } catch (error) {
        console.error('❌ Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again.');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => String(d.original_id) === String(doctorId) || String(d.id) === String(doctorId) || String(d['S. No.']) === String(doctorId));
    setSelectedDoctor(doctor);
    setAppointmentForm({
      ...appointmentForm,
      doctor: doctorId,
      doctorName: doctor?.consultant_name || '',
      department: doctor?.department || '',
      opdType: ''
    });
    setDateError('');
  };

  const handleDateChange = (e) => {
    const selectedDateValue = e.target.value;
    if (!selectedDateValue) {
      setAppointmentForm({...appointmentForm, date: '', time: ''});
      setDateError('');
      return;
    }

    const selectedDate = new Date(selectedDateValue);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayShort = dayName.substring(0, 3).toLowerCase();

    let availableDays = '';
    if (appointmentForm.opdType === 'General OPD') {
      availableDays = (selectedDoctor?.general_opd_days || selectedDoctor?.general_opd)?.toLowerCase() || '';
    } else if (appointmentForm.opdType === 'Private OPD') {
      availableDays = (selectedDoctor?.private_opd_days || selectedDoctor?.private_opd)?.toLowerCase() || '';
    }

    if (selectedDoctor && appointmentForm.opdType && !availableDays.includes(dayShort) && !availableDays.includes('daily')) {
      setDateError('This date is not available for the selected doctor and OPD type.');
      setAppointmentForm({...appointmentForm, date: ''});
    } else {
      setDateError('');
      setAppointmentForm({...appointmentForm, date: selectedDateValue});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    // Find selected doctor
    const selectedDoc = doctors.find(d => String(d.original_id) === String(appointmentForm.doctor) || String(d.id) === String(appointmentForm.doctor) || String(d['S. No.']) === String(appointmentForm.doctor));

    try {
      // Validate required fields
      const hasOpdTypes = selectedDoc && ((selectedDoc?.general_opd_days || selectedDoc?.general_opd) || (selectedDoc?.private_opd_days || selectedDoc?.private_opd));
      
      // Validate phone number length
      if (appointmentForm.phone && appointmentForm.phone.length > 15) {
        setError('Phone number must not exceed 15 characters');
        setSubmitting(false);
        return;
      }
      
      if (!appointmentForm.patientName || !appointmentForm.phone || !appointmentForm.doctor || 
          (hasOpdTypes && !appointmentForm.opdType) || !appointmentForm.date || !appointmentForm.reason) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Prepare appointment data
      const appointmentData = {
        patient_name: appointmentForm.patientName,
        patient_phone: appointmentForm.phone,
        patient_email: appointmentForm.email || '',
        patient_age: appointmentForm.age || null,
        patient_gender: appointmentForm.gender || '',
        membership_number: appointmentForm.membershipNumber || '',
        doctor_id: appointmentForm.doctor,
        doctor_name: appointmentForm.doctorName,
        department: appointmentForm.department,
        opd_type: hasOpdTypes ? appointmentForm.opdType : 'General OPD', // Default to General OPD if no OPD types available
        appointment_date: appointmentForm.date,
        appointment_type: appointmentForm.appointmentType || 'General Consultation',
        reason: appointmentForm.reason,
        medical_history: appointmentForm.medicalHistory || '',
        address: appointmentForm.address || '',
        user_type: userData?.type || '',
        user_id: userData?.[' S. No.'] || userData?.id || null
      };

      console.log('📤 Submitting appointment:', appointmentData);

      // Submit appointment
      const response = await bookAppointment(appointmentData);
      
      console.log('✅ Appointment booked successfully:', response);
      
      setSuccess(true);
      
      // Show success message
      setTimeout(() => {
        alert('Appointment booked successfully! You will receive a confirmation email shortly.');
        onNavigate('home');
      }, 1000);

    } catch (error) {
      console.error('❌ Error booking appointment:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-10 relative">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => onNavigate('home')}
          className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <ChevronLeft className="h-5 w-5 text-indigo-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Book Appointment</h1>
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center text-indigo-600"
        >
          <HomeIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <Clock className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
            <p className="text-gray-500 text-sm font-medium">Book your Schedule your visit</p>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 text-sm font-semibold">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mx-6 mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
          <p className="text-green-800 text-sm font-semibold">✅ Appointment booked successfully!</p>
        </div>
      )}

      {/* Appointment Form */}
      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name - Auto-populated, Read-only */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={appointmentForm.patientName}
                readOnly
                placeholder="Enter full name"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 cursor-not-allowed text-sm font-medium"
                title="This field is auto-filled from your profile"
              />
            </div>
          </div>

          {/* Phone Number - Auto-populated, Read-only */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                required
                value={appointmentForm.phone}
                readOnly
                placeholder="10 digit mobile number"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 cursor-not-allowed text-sm font-medium"
                title="This field is auto-filled from your profile"
              />
            </div>
          </div>

          {/* Email - Auto-populated if available, otherwise editable */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Email Address {appointmentForm.email ? '' : '(Optional)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={appointmentForm.email || ''}
                onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                placeholder="your.email@example.com"
                className={`block w-full pl-11 pr-4 py-3.5 border rounded-2xl placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium ${
                  userData?.Email ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white'
                }`}
                readOnly={!!userData?.Email}
              />
            </div>
          </div>

          {/* Select Doctor - Fetched from database */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Stethoscope className="h-5 w-5 text-gray-400" />
              </div>
              <select
                required
                name="doctor"
                value={appointmentForm.doctor}
                onChange={handleDoctorChange}
                disabled={loading}
                className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option key="default-doctor" value="">
                  {loading ? 'Loading doctors...' : 'Choose a doctor'}
                </option>
                {doctors.map((doc, index) => (
                  <option key={`${doc.id || doc.original_id || doc['S. No.'] || index}`} value={String(doc.original_id || doc.id || doc['S. No.'] || '')}>
                    {doc.consultant_name} - {doc.department || 'General'}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
              </div>
            </div>
            {selectedDoctor && (
              <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-xs font-semibold text-indigo-900">
                  {selectedDoctor.designation || selectedDoctor.specialization || 'Consultant'}
                </p>
                <p className="text-xs text-indigo-700 mt-1">
                  <strong>Department:</strong> {selectedDoctor.department || selectedDoctor['Company Name'] || 'N/A'}
                </p>
                <div className="mt-2 space-y-2">
                  {(selectedDoctor?.general_opd_days || selectedDoctor?.general_opd) && (
                    <div className="text-xs">
                      <strong className="text-indigo-900">General OPD:</strong>
                      <p className="text-indigo-700 mt-1">{selectedDoctor?.general_opd_days || selectedDoctor?.general_opd || 'N/A'}</p>
                    </div>
                  )}
                  {(selectedDoctor?.private_opd_days || selectedDoctor?.private_opd) && (
                    <div className="text-xs">
                      <strong className="text-indigo-900">Private OPD:</strong>
                      <p className="text-indigo-700 mt-1">{selectedDoctor?.private_opd_days || selectedDoctor?.private_opd || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* OPD Type Selection */}
          {selectedDoctor && ((selectedDoctor?.general_opd_days || selectedDoctor?.general_opd) || (selectedDoctor?.private_opd_days || selectedDoctor?.private_opd)) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                Available OPD Types <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {(selectedDoctor?.general_opd_days || selectedDoctor?.general_opd) && (
                  <div 
                    onClick={() => {
                      setAppointmentForm({...appointmentForm, opdType: 'General OPD'});
                      setDateError('');
                    }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      appointmentForm.opdType === 'General OPD' 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">General OPD</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedDoctor?.general_opd_days || selectedDoctor?.general_opd}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        appointmentForm.opdType === 'General OPD' 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-gray-300'
                      }`}>
                        {appointmentForm.opdType === 'General OPD' && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {(selectedDoctor?.private_opd_days || selectedDoctor?.private_opd) && (
                  <div 
                    onClick={() => {
                      setAppointmentForm({...appointmentForm, opdType: 'Private OPD'});
                      setDateError('');
                    }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      appointmentForm.opdType === 'Private OPD' 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Private OPD</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedDoctor?.private_opd_days || selectedDoctor?.private_opd}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        appointmentForm.opdType === 'Private OPD' 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-gray-300'
                      }`}>
                        {appointmentForm.opdType === 'Private OPD' && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OPD Type (Hidden Select for Form Validation) */}
          <div className="hidden">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              OPD Type <span className="text-red-500">*</span>
            </label>
            <select
              required={selectedDoctor && ((selectedDoctor?.general_opd_days || selectedDoctor?.general_opd) || (selectedDoctor?.private_opd_days || selectedDoctor?.private_opd))}
              name="opdType"
              value={appointmentForm.opdType || ''}
              onChange={(e) => {
                setAppointmentForm({...appointmentForm, opdType: e.target.value});
                setDateError('');
              }}
              disabled={!selectedDoctor}
              className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option key="default-opd-type" value="">
                {!selectedDoctor ? 'Select doctor first' : 'Select OPD type'}
              </option>
              {(selectedDoctor?.general_opd_days || selectedDoctor?.general_opd) && (
                <option key="general-opd" value="General OPD">General OPD ({selectedDoctor?.general_opd_days || selectedDoctor?.general_opd})</option>
              )}
              {(selectedDoctor?.private_opd_days || selectedDoctor?.private_opd) && (
                <option key="private-opd" value="Private OPD">Private OPD ({selectedDoctor?.private_opd_days || selectedDoctor?.private_opd})</option>
              )}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={appointmentForm.date}
                onChange={handleDateChange}
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            {dateError && (
              <p className="text-red-600 text-xs mt-1 ml-1">{dateError}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="1"
                max="120"
                value={appointmentForm.age || ''}
                onChange={(e) => setAppointmentForm({...appointmentForm, age: e.target.value})}
                placeholder="Enter age"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Gender</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="gender"
                value={appointmentForm.gender || ''}
                onChange={(e) => setAppointmentForm({...appointmentForm, gender: e.target.value})}
                className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Appointment Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="appointmentType"
                value={appointmentForm.appointmentType || 'General Consultation'}
                onChange={(e) => setAppointmentForm({...appointmentForm, appointmentType: e.target.value})}
                className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              >
                <option value="General Consultation">General Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
                <option value="Routine Checkup">Routine Checkup</option>
                <option value="Specialist Consultation">Specialist Consultation</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Reason for Visit <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={appointmentForm.reason}
              onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
              placeholder="Briefly describe your symptoms or reason for visit..."
              rows="3"
              className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
            />
          </div>

          {/* Medical History */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Previous Medical History (Optional)
            </label>
            <textarea
              value={appointmentForm.medicalHistory || ''}
              onChange={(e) => setAppointmentForm({...appointmentForm, medicalHistory: e.target.value})}
              placeholder="Any previous medical conditions, allergies, or medications..."
              rows="2"
              className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Booking Appointment...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointments;