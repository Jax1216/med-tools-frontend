import React, { useState, useEffect } from 'react';
import './Patient.css';

const Patient = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDragging, setIsDragging] = useState(false);

  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    patientNumber: '',
  });

  const [patientYearData, setPatientYearData] = useState({ months: [] });

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // auto-upper Patient ID and strip spaces
    if (name === 'patientNumber') {
      const cleaned = value.toUpperCase().replace(/\s+/g, '');
      setPatientForm((p) => ({ ...p, patientNumber: cleaned }));
      return;
    }
    setPatientForm((p) => ({ ...p, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for patient:', patientForm);
    // TODO: call patientService with firstName, lastName, patientNumber
  };

  const onDragStart = (event, biomarkerVal, className) => {
    const dragData = JSON.stringify({ biomarkerVal, className });
    event.dataTransfer.setData('text/plain', dragData);
    setIsDragging(true);
  };
  const onDragEnd = () => setIsDragging(false);
  const onDragOver = (e) => e.preventDefault();

  const onDrop = (event, monthIndex, weekIndex) => {
    event.preventDefault();
    setIsDragging(false);
    const data = event.dataTransfer.getData('text/plain');
    if (!data) return;
    const { biomarkerVal, className } = JSON.parse(data);
    console.log(`Dropped ${biomarkerVal} from ${className} onto week ${weekIndex} of month ${monthIndex}`);
    // TODO: update state + API
  };

  useEffect(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthNumber: i + 1,
      weeks: Array.from({ length: 4 }, (_, j) => ({
        startDate: new Date(selectedYear, i, j * 7 + 1),
        visits: [],
      })),
    }));
    setPatientYearData({ months });
  }, [selectedYear]);

  const getMonthName = (m) =>
    new Date(selectedYear, m - 1, 1).toLocaleString('default', { month: 'long' });

  const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - 10 + i);

  const onDragEnter = (e) => e.currentTarget.classList.add('drag-over');
  const onDragLeave = (e) => e.currentTarget.classList.remove('drag-over');

  return (
    <div className="patient-page">
      <header className="patient-header card">
        <div className="patient-title">
          <h1>Patient</h1>
          <p className="muted">Enter name or ID, then drag biomarkers onto calendar weeks.</p>
        </div>
        <div className="patient-meta">
          <div className="meta-chip">
            Year
            <select
              aria-label="Select year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Search (no date) */}
      <section className="form-container card" aria-label="Patient search">
        <form onSubmit={handleFormSubmit}>
          <div className="input-row input-row--three">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={patientForm.firstName}
              onChange={handleFormChange}
              autoComplete="given-name"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={patientForm.lastName}
              onChange={handleFormChange}
              autoComplete="family-name"
            />
            <input
              type="text"
              name="patientNumber"
              placeholder="Patient ID (e.g., PD10001)"
              value={patientForm.patientNumber}
              onChange={handleFormChange}
              inputMode="text"
              pattern="^PD[0-9]{5,}$"
              title="Format like PD10001"
            />
          </div>
          <button type="submit" className="btn-primary">Search Patient</button>
        </form>
      </section>

      {/* Palettes */}
      <section className="palette-row">
        <div className="card palette bp-panel" aria-label="Blood pressure palette">
          <div className="panel-title">Blood Pressure</div>
          <div className="bp-grid">
            <div className="bp-panel-item-d"><span>Systolic</span></div>
            <div
              style={{ backgroundColor: 'var(--yellow)' }}
              className="bp-panel-item-s"
              draggable
              onDragStart={(e) => onDragStart(e, 90, 'systolic')}
              onDragEnd={onDragEnd}
              title="< 90"
            >&lt;90</div>
            <div
              style={{ backgroundColor: 'var(--bright-green)' }}
              className="bp-panel-item-s"
              draggable
              onDragStart={(e) => onDragStart(e, 120, 'systolic')}
              onDragEnd={onDragEnd}
              title="< 120"
            >&lt;120</div>
          </div>
        </div>

        <div className="card palette bio-panel" aria-label="Biomarker palette">
          <div className="panel-title">Biomarkers</div>
          <div className="bio-grid">
            <div className="bio-panel-item"><span>HBA-1C</span></div>
            <div
              style={{ backgroundColor: 'var(--light-yellow)' }}
              className="bio-panel-item-h"
              draggable
              onDragStart={(e) => onDragStart(e, 3, 'hba1c')}
              onDragEnd={onDragEnd}
              title="A1C 3.0"
            >3.0</div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="legend card">
        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--bright-green)' }} /> In-range
        </div>
        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--yellow)' }} /> Caution
        </div>
        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'lightgray' }} /> Not recorded
        </div>
        {isDragging && <div className="drag-hint">Drop onto a week to record a visit</div>}
      </section>

      {/* Calendar */}
      <section className="calendar card" aria-label="Patient year calendar">
        <div className="grid-wrapper">
          <div className="grid-container">
            {patientYearData.months.map((month, monthIndex) => (
              <div key={month.monthNumber} className="month-column">
                <div className="month-cell">{getMonthName(month.monthNumber)}</div>
                {month.weeks.map((week, weekIndex) => {
                  const start = week.startDate;
                  const label = `${start.getMonth() + 1}/${start.getDate()}`;
                  return (
                    <div
                      key={weekIndex}
                      className="week-cell"
                      onDragEnter={onDragEnter}
                      onDragLeave={onDragLeave}
                      onDragOver={onDragOver}
                      onDrop={(e) => { onDrop(e, monthIndex, weekIndex); onDragLeave(e); }}
                      aria-label={`Week starting ${label}`}
                    >
                      <div className="week-date">{label}</div>
                      <div className="bio-marker-row">
                        <div className="bio-marker-cell">A1C: --</div>
                        <div className="bio-marker-cell">MB: --</div>
                        <div className="bio-marker-cell">G: --</div>
                        <div className="bio-marker-cell">Sys: --</div>
                        <div className="bio-marker-cell">Dia: --</div>
                      </div>
                      <div className="week-empty">No visits yet</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Patient;
