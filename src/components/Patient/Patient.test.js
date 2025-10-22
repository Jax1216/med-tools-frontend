import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Patient from './Patient';
import '@testing-library/jest-dom';


function selectYear(y) {
  const yearSelect = screen.getByRole('combobox', { name: /year/i });
  fireEvent.change(yearSelect, { target: { value: String(y) } });
  return yearSelect;
}

test('renders patient page header and form', () => {
  render(<Patient />);
  expect(screen.getByRole('heading', { name: /patient/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search patient/i })).toBeInTheDocument();
});

test('patient id auto formats to uppercase and removes spaces', () => {
  render(<Patient />);
  const input = screen.getByPlaceholderText(/patient id/i); // "Patient ID (e.g., PD10001)"
  fireEvent.change(input, { target: { name: 'patientNumber', value: '  pd 10001  ' } });
  expect(input).toHaveValue('PD10001'); // uppercase + stripped spaces
});

test('year selector changes and calendar shows 12 month columns', () => {
  render(<Patient />);
  const thisYear = new Date().getFullYear();
  const nextYear = thisYear + 1;
  const select = selectYear(nextYear);
  expect(select).toHaveValue(String(nextYear));

  // 12 month headers exist (January..December)
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  months.forEach(m => {
    expect(screen.getByText(new RegExp(`^${m}$`, 'i'))).toBeInTheDocument();
  });

  // a week cell includes biomarker placeholders like "A1C:" / "Sys:"
  expect(screen.getAllByText(/a1c:/i).length).toBeGreaterThan(0);
});
