import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from './Profile';

const click = (el) => fireEvent.click(el);

// Helper: reliably close the modal even if there are two "Close" buttons
const closeModal = () => {
  // Prefer the "×" button which has aria-label="Close"
  const closeX = screen.queryByLabelText(/close/i);
  if (closeX) return fireEvent.click(closeX);

  // Fallback: last visible "Close" button in footer
  const closes = screen.getAllByRole('button', { name: /close/i });
  return fireEvent.click(closes[closes.length - 1]);
};

test('renders and toggles between Position and Patient modes', () => {
  render(<Profile />);

  // default is position mode
  expect(screen.getByRole('button', { name: /by position/i })).toHaveClass('active');

  // switch to patient mode
  click(screen.getByRole('button', { name: /by patient/i }));
  expect(screen.getByRole('button', { name: /by patient/i })).toHaveClass('active');
});

test('search filters items', () => {
  render(<Profile />);
  const search = screen.getByPlaceholderText(/search staff or position/i);
  fireEvent.change(search, { target: { value: 'Ada' } });
  expect(screen.getByText(/dr\. ada lovelace/i)).toBeInTheDocument();
});

test('opens Contact modal with phone and email', () => {
  render(<Profile />);
  // find a "Contact" button in staff cards
  const contactBtns = screen.getAllByRole('button', { name: /contact/i });
  click(contactBtns[0]);

  // modal shows heading and contact lines
  expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
  expect(screen.getByText(/phone:/i)).toBeInTheDocument();
  expect(screen.getByText(/email:/i)).toBeInTheDocument();

  // close the modal safely
  closeModal();
});

test('opens Schedule modal', () => {
  render(<Profile />);
  const scheduleBtns = screen.getAllByRole('button', { name: /schedule|view schedule/i });
  click(scheduleBtns[0]);

  expect(screen.getByRole('heading', { name: /schedule/i })).toBeInTheDocument();

  // close the modal safely
  closeModal();
});

test('patient mode: open chart modal', () => {
  render(<Profile />);
  click(screen.getByRole('button', { name: /by patient/i }));

  const openChartBtn = screen.getAllByRole('button', { name: /open chart/i })[0];
  click(openChartBtn);

  expect(screen.getByRole('heading', { name: /patient chart/i })).toBeInTheDocument();
  expect(screen.getByText(/patient:/i)).toBeInTheDocument();
  expect(screen.getByText(/id:/i)).toBeInTheDocument();

  // close the modal safely
  closeModal();
});

