import React, { useMemo, useState, useEffect } from 'react';
import './Profile.css';

const DUMMY_STAFF = [
  { id: 'U100', name: 'Dr. Ada Lovelace', position: 'Physician', patients: 86, a1cAvg: 6.8, upcoming: 7, phone: '(405) 555-0100', email: 'ada.lovelace@clinic.example' },
  { id: 'U101', name: 'Dr. Alan Turing', position: 'Physician', patients: 73, a1cAvg: 7.1, upcoming: 4, phone: '(405) 555-0101', email: 'alan.turing@clinic.example' },
  { id: 'U102', name: 'Grace Hopper', position: 'Nurse', patients: 58, a1cAvg: 7.4, upcoming: 5, phone: '(405) 555-0102', email: 'grace.hopper@clinic.example' },
  { id: 'U103', name: 'Margaret Hamilton', position: 'Admin', patients: 0, a1cAvg: null, upcoming: 12, phone: '(405) 555-0103', email: 'margaret.hamilton@clinic.example' },
  { id: 'U104', name: 'Katherine Johnson', position: 'Nurse', patients: 61, a1cAvg: 7.0, upcoming: 6, phone: '(405) 555-0104', email: 'katherine.johnson@clinic.example' },
  { id: 'U105', name: 'Linus Torvalds', position: 'MA', patients: 34, a1cAvg: 7.6, upcoming: 3, phone: '(405) 555-0105', email: 'linus.torvalds@clinic.example' },
];

const DUMMY_PATIENTS = [
  { id: 'PD10001', name: 'John Carter', primary: 'Dr. Ada Lovelace', lastA1C: 7.3, lastVisit: '2025-09-28', phone: '(405) 555-1101', email: 'john.carter@patient.example' },
  { id: 'PD10002', name: 'Dana Scully', primary: 'Dr. Alan Turing', lastA1C: 6.5, lastVisit: '2025-10-01', phone: '(405) 555-1102', email: 'dana.scully@patient.example' },
  { id: 'PD10003', name: 'Fox Mulder', primary: 'Dr. Alan Turing', lastA1C: 8.1, lastVisit: '2025-09-12', phone: '(405) 555-1103', email: 'fox.mulder@patient.example' },
  { id: 'PD10004', name: 'Sarah Connor', primary: 'Dr. Ada Lovelace', lastA1C: 6.9, lastVisit: '2025-10-05', phone: '(405) 555-1104', email: 'sarah.connor@patient.example' },
  { id: 'PD10005', name: 'Leeloo Dallas', primary: 'Dr. Ada Lovelace', lastA1C: 7.9, lastVisit: '2025-09-18', phone: '(405) 555-1105', email: 'leeloo.dallas@patient.example' },
];

const POSITIONS = ['Physician', 'Nurse', 'MA', 'Admin'];

function Profile() {
  const h = React.createElement;

  const [mode, setMode] = useState('position'); // 'position' | 'patient'
  const [query, setQuery] = useState('');
  const [posFilter, setPosFilter] = useState(new Set());
  const [sortKey, setSortKey] = useState('name');

  // Modal state: { type: 'contact'|'schedule'|'chart', entity: 'staff'|'patient', item: {...} } | null
  const [modal, setModal] = useState(null);

  // Lock page scroll when modal is open
  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  const openModal = (type, entity, item) => setModal({ type, entity, item });
  const closeModal = () => setModal(null);

  const togglePos = (p) => {
    setPosFilter(prev => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  };

  const staffView = useMemo(() => {
    let rows = DUMMY_STAFF.slice();
    if (posFilter.size) rows = rows.filter(r => posFilter.has(r.position));
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(r => r.name.toLowerCase().includes(q) || r.position.toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'patients') return b.patients - a.patients;
      if (sortKey === 'a1c') return (a.a1cAvg ?? 99) - (b.a1cAvg ?? 99);
      if (sortKey === 'upcoming') return b.upcoming - a.upcoming;
      return 0;
    });
    return rows;
  }, [query, posFilter, sortKey]);

  const patientView = useMemo(() => {
    let rows = DUMMY_PATIENTS.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.primary.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'a1c') return a.lastA1C - b.lastA1C;
      if (sortKey === 'upcoming') return (b.lastVisit || '').localeCompare(a.lastVisit || '');
      return 0;
    });
    return rows;
  }, [query, sortKey]);

  const Segmented = h('div', { className: 'segmented' }, [
    h('button', {
      key: 'pos',
      className: mode === 'position' ? 'active' : '',
      onClick: () => setMode('position'),
      'aria-pressed': mode === 'position'
    }, 'By Position'),
    h('button', {
      key: 'pat',
      className: mode === 'patient' ? 'active' : '',
      onClick: () => setMode('patient'),
      'aria-pressed': mode === 'patient'
    }, 'By Patient')
  ]);

  const Controls = h('div', { className: 'profile-controls' }, [
    Segmented,
    h('input', {
      key: 'search',
      className: 'search',
      placeholder: mode === 'position' ? 'Search staff or position' : 'Search patient, PCP, or ID',
      value: query,
      onChange: (e) => setQuery(e.target.value)
    }),
    h('select', {
      key: 'sort',
      className: 'sort',
      value: sortKey,
      onChange: (e) => setSortKey(e.target.value)
    }, [
      h('option', { key: 'name', value: 'name' }, 'Sort: Name'),
      h('option', { key: 'patients', value: 'patients' }, 'Sort: # Patients'),
      h('option', { key: 'a1c', value: 'a1c' }, mode === 'position' ? 'Sort: Avg A1C' : 'Sort: A1C'),
      h('option', { key: 'upcoming', value: 'upcoming' }, mode === 'position' ? 'Sort: Upcoming appts' : 'Sort: Recent visit')
    ])
  ]);

  const Header = h('header', { className: 'profile-header card' }, [
    h('div', { className: 'profile-title' }, [
      h('h1', null, 'Profile'),
      h('p', { className: 'muted' },
        ['Explore staff & patients. Switch between filtering by ',
         h('strong', { key: 's1' }, 'Position'),
         ' or by ',
         h('strong', { key: 's2' }, 'Patient'),
         '.']
      )
    ]),
    Controls
  ]);

  const ChipRow = h('section', { className: 'chip-row' }, [
    ...POSITIONS.map(p =>
      h('button', {
        key: p,
        className: `chip ${posFilter.has(p) ? 'chip--on' : ''}`,
        onClick: () => togglePos(p),
        'aria-pressed': posFilter.has(p)
      }, p)
    ),
    posFilter.size > 0
      ? h('button', { key: 'clear', className: 'chip chip--clear', onClick: () => setPosFilter(new Set()) }, 'Clear')
      : null
  ]);

  const StaffGrid = h('section', { className: 'card grid staff-grid', 'aria-label': 'Staff profiles' },
    staffView.length
      ? staffView.map(s =>
          h('article', { key: s.id, className: 'staff-card' }, [
            h('header', null, [
              h('div', { className: 'avatar' }, s.name.split(' ').map(x => x[0]).slice(0,2).join('')),
              h('div', { className: 'meta' }, [
                h('h3', null, s.name),
                h('span', { className: 'role' }, s.position)
              ])
            ]),
            h('dl', { className: 'kpis' }, [
              h('div', null, [h('dt', null, 'Patients'), h('dd', null, String(s.patients))]),
              h('div', null, [h('dt', null, 'Avg A1C'), h('dd', null, s.a1cAvg == null ? '—' : String(s.a1cAvg))]),
              h('div', null, [h('dt', null, 'Upcoming'), h('dd', null, String(s.upcoming))]),
            ]),
            h('footer', null, [
              h('button', { className: 'btn-action', onClick: () => openModal('schedule', 'staff', s) }, 'View schedule'),
              h('button', { className: 'btn-secondary', onClick: () => openModal('contact', 'staff', s) }, 'Contact')
            ])
          ])
        )
      : h('div', { className: 'empty' }, 'No staff match your filters.')
  );

  const PatientGrid = h('section', { className: 'card grid patient-grid', 'aria-label': 'Patient profiles' },
    patientView.length
      ? patientView.map(p =>
          h('article', { key: p.id, className: 'patient-card' }, [
            h('header', null, [
              h('div', { className: 'badge' }, p.id),
              h('h3', null, p.name),
              h('span', { className: 'muted' }, `PCP: ${p.primary}`)
            ]),
            h('dl', { className: 'kpis' }, [
              h('div', null, [h('dt', null, 'Last A1C'), h('dd', null, String(p.lastA1C))]),
              h('div', null, [h('dt', null, 'Last Visit'), h('dd', null, p.lastVisit)])
            ]),
            h('footer', null, [
              h('button', { className: 'btn-action', onClick: () => openModal('chart', 'patient', p) }, 'Open chart'),
              h('button', { className: 'btn-secondary', onClick: () => openModal('schedule', 'patient', p) }, 'Schedule')
            ])
          ])
        )
      : h('div', { className: 'empty' }, 'No patients match your search.')
  );

  // --- Modal renderer ---
  const Modal = modal ? h('div', {
      className: 'modal-backdrop',
      onClick: (e) => { if (e.target === e.currentTarget) closeModal(); }
    }, [
      h('div', { className: 'modal card' }, [
        h('div', { className: 'modal-header' }, [
          h('h3', null,
            modal.type === 'contact' ? (modal.entity === 'staff' ? 'Contact Staff' : 'Contact Patient')
            : modal.type === 'schedule' ? 'Schedule'
            : 'Patient Chart'
          ),
          h('button', { className: 'modal-close', onClick: closeModal, 'aria-label': 'Close' }, '×')
        ]),
        h('div', { className: 'modal-body' },
          modal.type === 'contact'
            ? [
                h('div', { key: 'name', className: 'modal-line' }, [h('strong', null, 'Name: '), modal.item.name]),
                h('div', { key: 'phone', className: 'modal-line' }, [h('strong', null, 'Phone: '), modal.item.phone || '(not provided)']),
                h('div', { key: 'email', className: 'modal-line' }, [h('strong', null, 'Email: '), modal.item.email || '(not provided)'])
              ]
            : modal.type === 'schedule'
              ? [
                  h('div', { key: 'who', className: 'modal-line' }, [
                    h('strong', null, 'Who: '),
                    `${modal.item.name} ${modal.entity === 'staff' ? `(${modal.item.position})` : `(${modal.item.id})`}`
                  ]),
                  h('div', { key: 'hint', className: 'modal-hint' }, 'This is placeholder UI — wire to your scheduler or calendar picker later.')
                ]
              : [
                  h('div', { key: 'pname', className: 'modal-line' }, [h('strong', null, 'Patient: '), modal.item.name]),
                  h('div', { key: 'pid', className: 'modal-line' }, [h('strong', null, 'ID: '), modal.item.id]),
                  h('div', { key: 'pcp', className: 'modal-line' }, [h('strong', null, 'PCP: '), modal.item.primary]),
                  h('div', { key: 'a1c', className: 'modal-line' }, [h('strong', null, 'Last A1C: '), String(modal.item.lastA1C)]),
                  h('div', { key: 'visit', className: 'modal-line' }, [h('strong', null, 'Last Visit: '), modal.item.lastVisit])
                ]
        ),
        h('div', { className: 'modal-actions' }, [
          modal.type === 'contact'
            ? h('a', { className: 'btn-action', href: `mailto:${modal.item.email}`, onClick: (e) => { if (!modal.item.email) e.preventDefault(); } }, 'Email')
            : null,
          modal.type === 'contact'
            ? h('a', { className: 'btn-secondary', href: `tel:${(modal.item.phone || '').replace(/[^\d+]/g,'')}`, onClick: (e) => { if (!modal.item.phone) e.preventDefault(); } }, 'Call')
            : null,
          h('button', { className: 'btn-secondary', onClick: closeModal }, 'Close')
        ])
      ])
    ]) : null;

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return h('div', { className: 'profile-page' }, [
    Header,
    mode === 'position' ? ChipRow : null,
    mode === 'position' ? StaffGrid : PatientGrid,
    Modal
  ]);
}

export default Profile;
