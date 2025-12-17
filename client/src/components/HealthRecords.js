import React, { useState, useEffect } from 'react';
import { healthRecordService } from '../services/api';
import '../styles/HealthRecords.css';

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recordType: 'blood_pressure',
    date: '',
    value: '',
    unit: '',
    notes: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await healthRecordService.getAll();
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch health records:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await healthRecordService.create(formData);
      setFormData({ recordType: 'blood_pressure', date: '', value: '', unit: '', notes: '' });
      setShowForm(false);
      fetchRecords();
    } catch (error) {
      console.error('Failed to create health record:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await healthRecordService.delete(id);
      fetchRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  return (
    <div className="health-records-container">
      <h2>Health Records</h2>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Record</button>
      ) : (
        <form onSubmit={handleSubmit} className="record-form">
          <h3>Add Health Record</h3>
          <div className="form-group">
            <label htmlFor="recordType">Record Type</label>
            <select name="recordType" id="recordType" value={formData.recordType} onChange={handleChange}>
              <option value="blood_pressure">Blood Pressure</option>
              <option value="weight">Weight</option>
              <option value="glucose">Glucose</option>
              <option value="ultrasound">Ultrasound</option>
              <option value="blood_test">Blood Test</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="value">Value</label>
            <input
              type="text"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., mg/dL, kg, mmHg"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Record</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="records-list">
        {records.length === 0 ? (
          <p>No health records found</p>
        ) : (
          records.map(record => (
            <div key={record._id} className="record-card">
              <div className="record-header">
                <h4>{record.recordType.replace('_', ' ').toUpperCase()}</h4>
                <span className="date">{new Date(record.date).toLocaleDateString()}</span>
              </div>
              <p><strong>Value:</strong> {record.value} {record.unit}</p>
              {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
              <button onClick={() => handleDelete(record._id)} className="btn-danger">Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthRecords;
