import React, { useState, useEffect } from 'react';
import './Practice.css';

const Practice = () => {
  const searchModes = [
    { value: 'a1c', display: 'Find by A1C' },
    { value: 'visit', display: 'Find by Last Visit' }
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
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = patients.length;
  const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

  useEffect(() => {
    setFormData({ a1cMin: '', a1cMax: '', visitStart: '', visitEnd: '' });
    setCurrentPage(1);
    setPatients([]);
    setExpandedId(null);
  }, [currentMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const randomPhone = () =>
    `(${Math.floor(200 + Math.random()*700)}) ${Math.floor(200 + Math.random()*700)}-${String(Math.floor(Math.random()*9000)+1000).padStart(4,'0')}`;

  const generateMockPatients = () => {
    const mock = [];
    for (let i = 1; i <= 75; i++) {
      const firstName = `Patient${i}`;
      const lastName = `Lastname${i}`;
      const mostRecentA1C = +(4 + Math.random() * 6).toFixed(1);
      mock.push({
        id: i,
        firstName,
        lastName,
        patientNumber: `PN${10000 + i}`,
        mostRecentA1C,
        lastVisitDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365),
        phone: randomPhone(),
        email: `${firstName}.${lastName}@exampleclinic.org`.toLowerCase(),
        address: `${Math.floor(100 + Math.random()*900)} Health Ave, Suite ${Math.floor(100 + Math.random()*900)}, OK 73${Math.floor(100 + Math.random()*900)}`
      });
    }
    return mock;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentPage(1);
    setExpandedId(null);

    setTimeout(() => {
      let results = generateMockPatients();

      if (currentMode === 'a1c') {
        const min = formData.a1cMin ? parseFloat(formData.a1cMin) : -Infinity;
        const max = formData.a1cMax ? parseFloat(formData.a1cMax) : Infinity;
        results = results.filter(p => p.mostRecentA1C >= min && p.mostRecentA1C <= max);
      } else if (currentMode === 'visit') {
        const start = formData.visitStart ? new Date(formData.visitStart) : null;
        const end = formData.visitEnd ? new Date(formData.visitEnd) : null;
        results = results.filter(p => {
          const d = new Date(p.lastVisitDate);
          if (start && d < start) return false;
          if (end && d > end) return false;
          return true;
        });
      }

      setPatients(results);
      setIsLoading(false);
    }, 600);
  };

  const levelForA1C = (v) => {
    if (v < 5.7) return { label: 'Normal', cls: 'level-normal' };
    if (v < 6.5) return { label: 'Pre-diabetes', cls: 'level-pre' };
    return { label: 'High', cls: 'level-high' };
  };

  const paginated = patients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="practice-page">
      <div className="practice-container">
        <header className="card practice-header">
          <div>
            <h1>Practice</h1>
            <p className="practice-subtitle">
              Search and manage patient records by A1C levels or visit dates
            </p>
          </div>
          <div className="mode-selector">
            <label htmlFor="mode">Search mode</label>
            <select 
              id="mode" 
              value={currentMode} 
              onChange={(e) => setCurrentMode(e.target.value)}
            >
              {searchModes.map(m => (
                <option key={m.value} value={m.value}>{m.display}</option>
              ))}
            </select>
          </div>
        </header>

        <section className="card search-card" aria-label="Search patients">
          <div className="card-content">
            <form onSubmit={handleSearch} className="search-form">
              {currentMode === 'a1c' && (
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="a1cMin">Minimum A1C (%)</label>
                    <input 
                      type="number" 
                      id="a1cMin" 
                      name="a1cMin" 
                      step="0.1" 
                      min="0" 
                      max="20"
                      placeholder="e.g., 5.0"
                      value={formData.a1cMin} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="a1cMax">Maximum A1C (%)</label>
                    <input 
                      type="number" 
                      id="a1cMax" 
                      name="a1cMax" 
                      step="0.1" 
                      min="0" 
                      max="20"
                      placeholder="e.g., 7.0"
                      value={formData.a1cMax} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              )}

              {currentMode === 'visit' && (
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="visitStart">Visit date from</label>
                    <input 
                      type="date" 
                      id="visitStart" 
                      name="visitStart"
                      value={formData.visitStart} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="visitEnd">Visit date to</label>
                    <input 
                      type="date" 
                      id="visitEnd" 
                      name="visitEnd"
                      value={formData.visitEnd} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </section>

        {patients.length > 0 && (
          <section className="card results-card">
            <div className="card-content">
              <div className="results-header">
                <h2>
                  Results <span className="results-count">({totalItems})</span>
                </h2>
                <div className="pagination-controls">
                  <span>Page {currentPage} of {totalPages || 1}</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { 
                      setItemsPerPage(Number(e.target.value)); 
                      setCurrentPage(1); 
                    }}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                  </select>
                </div>
              </div>

              <div className="results-list">
                {paginated.map((p) => {
                  const lvl = levelForA1C(p.mostRecentA1C);
                  const isOpen = expandedId === p.id;
                  return (
                    <div key={p.id} className="patient-row">
                      <div className="patient-row-main">
                        <div className="patient-info">
                          <span className="patient-name">
                            {p.lastName}, {p.firstName}
                            <span className="patient-id">{p.patientNumber}</span>
                          </span>
                          <div className={`level-badge ${lvl.cls}`}>
                            {lvl.label} · {p.mostRecentA1C}%
                          </div>
                        </div>
                        <button
                          className="btn-outline"
                          onClick={() => setExpandedId(isOpen ? null : p.id)}
                          aria-expanded={isOpen}
                          aria-controls={`details-${p.id}`}
                        >
                          {isOpen ? 'Hide details' : 'Show details'}
                        </button>
                      </div>

                      {isOpen && (
                        <div id={`details-${p.id}`} className="patient-details">
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span className="detail-label">Patient ID</span>
                              <span className="detail-value">{p.patientNumber}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Last Visit</span>
                              <span className="detail-value">
                                {new Date(p.lastVisitDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone</span>
                              <span className="detail-value">{p.phone}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Email</span>
                              <span className="detail-value">{p.email}</span>
                            </div>
                            <div className="detail-item full">
                              <span className="detail-label">Address</span>
                              <span className="detail-value">{p.address}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {!isLoading && patients.length === 0 && (
          <div className="card">
            <div className="card-content empty-state">
              <p>No results yet. Use the search form above to find patients.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;