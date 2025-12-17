import React, { useState, useEffect } from 'react';
import { guidanceService, userService } from '../services/api';
import '../styles/Guidance.css';

const PregnancyGuidance = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [guidance, setGuidance] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (currentWeek) {
      fetchGuidance(currentWeek);
    }
  }, [currentWeek]);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      setUserProfile(response.data);

      if (response.data.dueDate) {
        calculateCurrentWeek(response.data.dueDate);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  // ✅ FIXED — This function was missing!
  const calculateCurrentWeek = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const weeksLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24 * 7));
    const currentWeekNum = Math.max(1, 40 - weeksLeft);
    setCurrentWeek(Math.min(currentWeekNum, 40));
  };

  const fetchGuidance = async (week) => {
    try {
      const response = await guidanceService.getCurrent(week);
      setGuidance(response.data);
    } catch (error) {
      console.error('Failed to fetch guidance:', error);
      setGuidance(getDefaultGuidance(week));
    }
  };

  const getDefaultGuidance = (week) => {
    const guidelines = {
      1: {
        week: 1,
        symptoms: ['Missed period', 'Breast tenderness', 'Fatigue'],
        activities: ['Rest', 'Eat healthy', 'Take prenatal vitamins'],
        nutrition: {
          recommendations: ['Folic acid foods', 'Iron-rich foods', 'Calcium'],
          foodToAvoid: ['Raw fish', 'Unpasteurized dairy', 'High mercury fish'],
          supplements: ['Prenatal vitamins', 'Folic acid'],
        },
        exercises: ['Walking', 'Stretching', 'Pelvic floor exercises'],
        precautions: ['Avoid alcohol', 'Avoid smoking', 'Avoid hot baths'],
        medicalTips: ['Schedule first prenatal visit', 'Get blood tests'],
      },
    };

    return guidelines[week] || {
      week,
      symptoms: [],
      activities: [],
      nutrition: { recommendations: [], foodToAvoid: [], supplements: [] },
      exercises: [],
      precautions: [],
      medicalTips: [],
    };
  };

  return (
    <div className="guidance-container">
      <h2>Personalized Pregnancy Guidance</h2>

      {userProfile && (
        <div className="pregnancy-progress">
          <h3>Your Pregnancy Progress</h3>
          <p>
            Current Week: <strong>{currentWeek}/40</strong>
          </p>
          <p>
            Due Date:{' '}
            <strong>{new Date(userProfile.dueDate).toLocaleDateString()}</strong>
          </p>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(currentWeek / 40) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="week-selector">
        <label htmlFor="week">Select Week:</label>
        <input
          type="number"
          id="week"
          min="1"
          max="40"
          value={currentWeek}
          onChange={(e) =>
            setCurrentWeek(Math.min(40, Math.max(1, parseInt(e.target.value))))
          }
        />
      </div>

      {guidance && (
        <div className="guidance-content">
          <section className="guidance-section">
            <h3>Expected Symptoms</h3>
            <ul>
              {guidance.symptoms?.map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
          </section>

          <section className="guidance-section">
            <h3>Recommended Activities</h3>
            <ul>
              {guidance.activities?.map((activity, idx) => (
                <li key={idx}>{activity}</li>
              ))}
            </ul>
          </section>

          <section className="guidance-section">
            <h3>Nutrition</h3>
            <h4>Recommended Foods</h4>
            <ul>
              {guidance.nutrition?.recommendations?.map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
            <h4>Foods to Avoid</h4>
            <ul>
              {guidance.nutrition?.foodToAvoid?.map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
            <h4>Supplements</h4>
            <ul>
              {guidance.nutrition?.supplements?.map((supp, idx) => (
                <li key={idx}>{supp}</li>
              ))}
            </ul>
          </section>

          <section className="guidance-section">
            <h3>Safe Exercises</h3>
            <ul>
              {guidance.exercises?.map((exercise, idx) => (
                <li key={idx}>{exercise}</li>
              ))}
            </ul>
          </section>

          <section className="guidance-section">
            <h3>Precautions</h3>
            <ul>
              {guidance.precautions?.map((precaution, idx) => (
                <li key={idx}>{precaution}</li>
              ))}
            </ul>
          </section>

          <section className="guidance-section">
            <h3>Medical Tips</h3>
            <ul>
              {guidance.medicalTips?.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default PregnancyGuidance;
