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
      <div className="patient-container">
        {/* Header */}
        <header className="card patient-header">
          <div>
            <h1>Patient</h1>
            <p className="patient-subtitle">
              Search for a patient and drag biomarkers onto calendar weeks to record visits
            </p>
          </div>
          <div className="patient-meta">
            <div className="year-selector">
              <label htmlFor="year-select">Year</label>
              <select
                id="year-select"
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

        {/* Search Form */}
        <section className="card search-section" aria-label="Patient search">
          <div className="card-content">
            <form onSubmit={handleFormSubmit} className="search-form">
              <div className="form-inputs">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={patientForm.firstName}
                    onChange={handleFormChange}
                    autoComplete="given-name"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={patientForm.lastName}
                    onChange={handleFormChange}
                    autoComplete="family-name"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="patientNumber">Patient ID</label>
                  <input
                    id="patientNumber"
                    type="text"
                    name="patientNumber"
                    placeholder="e.g., PD10001"
                    value={patientForm.patientNumber}
                    onChange={handleFormChange}
                    inputMode="text"
                    pattern="^PD[0-9]{5,}$"
                    title="Format: PD10001"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Search Patient
              </button>
            </form>
          </div>
        </section>

        {/* Palettes */}
        <div className="palettes-section">
          <div className="palettes-grid">
            {/* Blood Pressure Palette */}
            <div className="palette-card" aria-label="Blood pressure palette">
              <h2 className="palette-title">Blood Pressure</h2>
              <div className="palette-grid bp-palette-grid">
                <div className="palette-label">Systolic</div>
                <div
                  className="palette-item bp-caution"
                  draggable
                  onDragStart={(e) => onDragStart(e, 90, 'systolic')}
                  onDragEnd={onDragEnd}
                  title="Systolic < 90"
                >
                  &lt; 90
                </div>
                <div
                  className="palette-item bp-normal"
                  draggable
                  onDragStart={(e) => onDragStart(e, 120, 'systolic')}
                  onDragEnd={onDragEnd}
                  title="Systolic < 120"
                >
                  &lt; 120
                </div>
              </div>
            </div>

            {/* Biomarkers Palette */}
            <div className="palette-card" aria-label="Biomarker palette">
              <h2 className="palette-title">Biomarkers</h2>
              <div className="palette-grid bio-palette-grid">
                <div className="palette-label">HbA1c</div>
                <div
                  className="palette-item bio-good"
                  draggable
                  onDragStart={(e) => onDragStart(e, 5.0, 'hba1c')}
                  onDragEnd={onDragEnd}
                  title="HbA1c 5.0%"
                >
                  5.0%
                </div>
                <div
                  className="palette-item bio-warning"
                  draggable
                  onDragStart={(e) => onDragStart(e, 6.0, 'hba1c')}
                  onDragEnd={onDragEnd}
                  title="HbA1c 6.0%"
                >
                  6.0%
                </div>
                <div
                  className="palette-item bio-high"
                  draggable
                  onDragStart={(e) => onDragStart(e, 7.5, 'hba1c')}
                  onDragEnd={onDragEnd}
                  title="HbA1c 7.5%"
                >
                  7.5%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <section className="card legend-section" aria-label="Legend">
          <div className="legend">
            <div className="legend-item">
              <span className="legend-swatch green" />
              <span>Normal range</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch yellow" />
              <span>Caution</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch red" />
              <span>High risk</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch gray" />
              <span>Not recorded</span>
            </div>
            {isDragging && (
              <div className="drag-hint">
                Drop onto a week to record a visit
              </div>
            )}
          </div>
        </section>

        {/* Calendar */}
        <section className="calendar-section" aria-label="Patient year calendar">
          <div className="calendar-wrapper">
            <div className="calendar-grid">
              {patientYearData.months.map((month, monthIndex) => (
                <div key={month.monthNumber} className="month-column">
                  <div className="month-header">
                    {getMonthName(month.monthNumber)}
                  </div>
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
                        onDrop={(e) => {
                          onDrop(e, monthIndex, weekIndex);
                          onDragLeave(e);
                        }}
                        aria-label={`Week starting ${label}`}
                      >
                        <div className="week-date">{label}</div>
                        <div className="biomarkers-row">
                          <div className="biomarker-chip">A1C: --</div>
                          <div className="biomarker-chip">Sys: --</div>
                          <div className="biomarker-chip">Dia: --</div>
                          <div className="biomarker-chip">Glu: --</div>
                          <div className="biomarker-chip">BP: --</div>
                        </div>
                        <div className="week-empty">No visits recorded</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Patient;