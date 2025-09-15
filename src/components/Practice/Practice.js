import React, { useState, useEffect } from 'react';
import './Practice.css';
// import patientService from '../../services/patientService'; // Uncomment when ready to use API

const Practice = () => {
  const searchModes = [
    { value: 'a1c', display: 'Search by A1C Range' },
    { value: 'visit', display: 'Search by Last Visit' }
  ];

  const [currentMode, setCurrentMode] = useState('a1c');
  const [formData, setFormData] = useState({
    a1cMin: '',
    a1cMax: '',
    visitStart: '',
    visitEnd: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = patients.length;
  const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

  useEffect(() => {
    // Reset form when switching modes
    setFormData({ a1cMin: '', a1cMax: '', visitStart: '', visitEnd: '' });
  }, [currentMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMockPatients = () => {
    const mockPatients = [];
    for (let i = 1; i <= 75; i++) {
      mockPatients.push({
        id: i,
        firstName: `Patient${i}`,
        lastName: `Lastname${i}`,
        patientNumber: `PN${10000 + i}`,
        mostRecentA1C: +(4 + Math.random() * 6).toFixed(1),
        lastVisitDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365)
      });
    }
    return mockPatients;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentPage(1);

    // Replace this with your actual API call using patientService
    // For now, we use mock data
    setTimeout(() => {
      setPatients(generateMockPatients());
      setIsLoading(false);
    }, 800);
  };

  const paginatedPatients = patients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="practice-container">
      <div className="mode-selector">
        <label>Search Mode:</label>
        <select value={currentMode} onChange={(e) => setCurrentMode(e.target.value)}>
          {searchModes.map(mode => (
            <option key={mode.value} value={mode.value}>{mode.display}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        {currentMode === 'a1c' && (
          <div className="form-group a1c-group">
            <div className="input-group">
              <label htmlFor="a1cMin">Min A1C (%)</label>
              <input type="number" id="a1cMin" name="a1cMin" value={formData.a1cMin} onChange={handleInputChange} step="0.1" min="0" max="20" />
            </div>
            <div className="input-group">
              <label htmlFor="a1cMax">Max A1C (%)</label>
              <input type="number" id="a1cMax" name="a1cMax" value={formData.a1cMax} onChange={handleInputChange} step="0.1" min="0" max="20" />
            </div>
          </div>
        )}

        {currentMode === 'visit' && (
          <div className="form-group visit-group">
            <div className="input-group">
              <label htmlFor="visitStart">No Visits Since</label>
              <input type="date" id="visitStart" name="visitStart" value={formData.visitStart} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="visitEnd">No Visits Before</label>
              <input type="date" id="visitEnd" name="visitEnd" value={formData.visitEnd} onChange={handleInputChange} required />
            </div>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="search-btn">
          {isLoading ? 'Searching...' : 'Search Patients'}
        </button>
      </form>

      {patients.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h2>Results ({totalItems} found)</h2>
            <div className="pagination-controls">
              <span>Page {currentPage} of {totalPages}</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
              </select>
            </div>
          </div>

          <div className="patient-list">
            {paginatedPatients.map(patient => (
              <div key={patient.id} className="patient-card">
                <div className="patient-info">
                  <h3>{patient.lastName}, {patient.firstName}</h3>
                  <div className="patient-meta">
                    <span className="patient-id">ID: {patient.patientNumber}</span>
                    <span className="a1c-value">A1C: {patient.mostRecentA1C}%</span>
                    <span className="last-visit">Last Visit: {new Date(patient.lastVisitDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>Previous</button>
            <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;