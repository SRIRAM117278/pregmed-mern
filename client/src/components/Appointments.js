import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import '../styles/Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    description: '',
    type: 'routine',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create(formData);
      setFormData({ appointmentDate: '', appointmentTime: '', reason: '', description: '', type: 'routine' });
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await appointmentService.cancel(id);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary">Schedule New Appointment</button>
      ) : (
        <form onSubmit={handleSubmit} className="appointment-form">
          <h3>Schedule Appointment</h3>
          <div className="form-group">
            <label htmlFor="appointmentDate">Date</label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="appointmentTime">Time</label>
            <input
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange}>
              <option value="routine">Routine</option>
              <option value="emergency">Emergency</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Schedule</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p>No appointments scheduled</p>
        ) : (
          appointments.map(apt => (
            <div key={apt._id} className="appointment-card">
              <div className="appointment-header">
                <h4>{apt.reason}</h4>
                <span className={`status ${apt.status}`}>{apt.status}</span>
              </div>
              <p><strong>Date:</strong> {new Date(apt.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {apt.appointmentTime}</p>
              <p><strong>Type:</strong> {apt.type}</p>
              <p><strong>Description:</strong> {apt.description}</p>
              {apt.status === 'scheduled' && (
                <button onClick={() => handleCancel(apt._id)} className="btn-danger">Cancel</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
