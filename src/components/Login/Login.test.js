import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// Mock the logo asset so Jest doesn't try to load an image
jest.mock('../../assets/logo.png', () => 'logo.png');

// Mock authService with success & failure capabilities
jest.mock('../../services/authService', () => {
  return {
    __esModule: true,
    default: {
      login: jest.fn(),
    },
  };
});

const authService = require('../../services/authService').default;

describe('Login', () => {
  // Provide a reload mock so the success path can call window.location.reload()
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

    expect(screen.getByAltText(/candidate tools/i)).toBeInTheDocument(); // logo
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email or phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('successful login redirects to /practice and reloads', async () => {
    // make login resolve
    authService.login.mockResolvedValueOnce({ token: 'ok' });

    // Spy on history.push by capturing calls to it indirectly:
    // We can't easily intercept useHistory() internals here, so we assert indirectly:
    // 1) button shows "Signing in..." (loading)
    // 2) window.location.reload is called (your code does this after push)
    renderPage();

    fireEvent.change(screen.getByLabelText(/email or phone/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // shows loading state
    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();

    // waits for login promise to resolve and then reload to be called
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('user@example.com', 'secret');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test('failed login shows error message', async () => {
    // make login reject with an axios-like error shape
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

    // Wait for error message to render
    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid credentials/i);

    // button returns to non-loading state
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });
});
