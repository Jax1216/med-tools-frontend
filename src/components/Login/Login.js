import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../../services/authService';
import logo from '../../assets/logo.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    authService.login(email, password).then(
      () => {
        history.push('/practice');
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo">
            <img src={logo} alt="Candidate Tools" />
          </div>
          <h2>Sign in</h2>
          <p className="login-subtitle">to continue to MedTools</p>
        </div>

        <div className="login-right">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email or phone</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-actions">
              <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            {message && (
              <div className="alert-danger" role="alert">
                {message}
              </div>
            )}

            <div className="button-group">
              <a href="#" className="create-account-link" onClick={(e) => e.preventDefault()}>
                Create account
              </a>
              <button type="submit" className="login-button" disabled={loading}>
                {loading && <span className="spinner-border"></span>}
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="login-footer">
        <div className="language-selector">
          <select defaultValue="en" aria-label="Select language">
            <option value="en">English (United States)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div className="footer-links">
          <a href="#" onClick={(e) => e.preventDefault()}>Help</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
        </div>
      </div>
    </div>
  );
};

export default Login;