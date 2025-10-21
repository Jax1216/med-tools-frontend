// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock child components BEFORE requiring App so their imports are intercepted
jest.mock('./components/TopBar/TopBar', () => () => <div>TopBar</div>);
jest.mock('./components/Login/Login', () => () => <div>Login Page</div>);
jest.mock('./components/Patient/Patient', () => () => <div>Patient Page</div>);
jest.mock('./components/Practice/Practice', () => () => <div>Practice Page</div>);
jest.mock('./components/Profile/Profile', () => () => <div>Profile Page</div>);

// Now import App after mocks
const App = require('./App').default;

test('redirects "/" to "/login" and renders Login Page', () => {
  // initial URL is "/" => your <Redirect from="/" to="/login" />
  render(<App />);
  expect(screen.getByText(/login page/i)).toBeInTheDocument();
});

test('shows TopBar on non-login routes', () => {
  // simulate navigating to /practice
  window.history.pushState({}, '', '/practice');
  render(<App />);
  expect(screen.getByText(/TopBar/i)).toBeInTheDocument();
  expect(screen.getByText(/practice page/i)).toBeInTheDocument();
});

test('hides TopBar on /login', () => {
  window.history.pushState({}, '', '/login');
  render(<App />);
  expect(screen.queryByText(/TopBar/i)).not.toBeInTheDocument();
  expect(screen.getByText(/login page/i)).toBeInTheDocument();
});

