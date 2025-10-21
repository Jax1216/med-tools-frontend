// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// 1) Mock first (these must run before Login is loaded)
jest.mock('../../assets/logo.png', () => 'logo.png');
jest.mock('../../services/authService', () => {
  return {
    __esModule: true,
    default: {
      login: jest.fn(),
    },
  };
});

// 2) Now that mocks exist, require modules that depend on them
const authService = require('../../services/authService').default;
const Login = require('./Login').default;

describe('Login', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  function renderPage() {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    );
  }

  test('renders login form fields and submit button', () => {
    renderPage();
    expect(screen.getByAltText(/candidate tools/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email or phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('successful login redirects to /practice and reloads', async () => {
    authService.login.mockResolvedValueOnce({ token: 'ok' });

    renderPage();

    fireEvent.change(screen.getByLabelText(/email or phone/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('user@example.com', 'secret');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test('failed login shows error message', async () => {
    authService.login.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderPage();

    fireEvent.change(screen.getByLabelText(/email or phone/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid credentials/i);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });
});
