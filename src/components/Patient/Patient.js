import React, { useState, useEffect } from 'react';
import './Patient.css';
// NOTE: The PatientYear class and SampleVisitData would need to be converted to JavaScript helpers.
// This example uses a simplified, hardcoded structure for demonstration.

const Patient = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    patientNumber: '',
    lastVisit: '',
  });

  const [patientYearData, setPatientYearData] = useState({ months: [] });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPatientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for patient:", patientForm);
    // Here you would call your patientService to find the patient
  };

  const onDragStart = (event, biomarkerVal, className) => {
    const dragData = JSON.stringify({ biomarkerVal, className });
    event.dataTransfer.setData('text/plain', dragData);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event, monthIndex, weekIndex) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    if (data) {
      const { biomarkerVal, className } = JSON.parse(data);
      console.log(`Dropped ${biomarkerVal} from ${className} onto week ${weekIndex} of month ${monthIndex}`);
      // Here you would update the state for the specific week and make an API call to save the visit.
    }
  };

  useEffect(() => {
    // In a real app, you would fetch patient visit data here and build the calendar.
    // This is a simplified version using dummy data.
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthNumber: i + 1,
      weeks: Array.from({ length: 4 }, (_, j) => ({ // Simplified to 4 weeks per month
        startDate: new Date(selectedYear, i, j * 7 + 1),
        visits: [] // This would be populated with real visit data
      }))
    }));
    setPatientYearData({ months });
  }, [selectedYear]);

  const getMonthName = (monthNumber) => {
    return new Date(selectedYear, monthNumber - 1, 1).toLocaleString('default', { month: 'long' });
  };
  
  // Dummy year range for the dropdown
  const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - 10 + i);

  return (
    <div className="patient-view-container">
      <div className="form-container">
        <form onSubmit={handleFormSubmit}>
          <div className="input-row">
            <input type="text" name="firstName" placeholder="First Name" value={patientForm.firstName} onChange={handleFormChange} />
            <input type="text" name="lastName" placeholder="Last Name" value={patientForm.lastName} onChange={handleFormChange} />
            <input type="text" name="patientNumber" placeholder="Patient Number" value={patientForm.patientNumber} onChange={handleFormChange} />
            <input type="date" name="lastVisit" placeholder="Last Visit" value={patientForm.lastVisit} onChange={handleFormChange} />
          </div>
          <button type="submit">Search Patient</button>
        </form>
      </div>

      <div className="panel-container">
        {/* Simplified biomarker panels for demonstration. You would map over your data to generate these. */}
        <div className="bp-panel">
            <div className="bp-panel-item-d"><span>Systolic</span></div>
            <div style={{backgroundColor: "var(--yellow)"}} className="bp-panel-item-s" draggable onDragStart={(e) => onDragStart(e, 90, 'systolic')}> &lt;90 </div>
            <div style={{backgroundColor: "var(--bright-green)"}} className="bp-panel-item-s" draggable onDragStart={(e) => onDragStart(e, 120, 'systolic')}> &lt;120 </div>
             {/* ... more items */}
        </div>
        <div className="bio-panel">
             <div className="bio-panel-item"><span>HBA-1C</span></div>
             <div style={{backgroundColor: "var(--light-yellow)"}} className="bio-panel-item-h" draggable onDragStart={(e) => onDragStart(e, 3, 'hba1c')}> 3.0 </div>
             {/* ... more items */}
        </div>
      </div>
      
      <div className="center-header">
        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>

      <div className="grid-container">
        {patientYearData.months.map((month, monthIndex) => (
          <div key={month.monthNumber} className="month-column">
            <div className="month-cell">{getMonthName(month.monthNumber)}</div>
            {month.weeks.map((week, weekIndex) => (
              <div 
                key={weekIndex} 
                className="week-cell"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, monthIndex, weekIndex)}
              >
                {/* This section would render actual visit data if it exists */}
                <div className="bio-marker-cell">A1C: --</div>
                <div className="bio-marker-cell">MB: --</div>
                <div className="bio-marker-cell">G: --</div>
                <div className="bio-marker-cell">Sys: --</div>
                <div className="bio-marker-cell">Dia: --</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patient;