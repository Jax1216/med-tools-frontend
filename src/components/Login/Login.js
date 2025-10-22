import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../../services/authService';
import logo from '../../assets/logo.png';
import './Login.css';

const LOGIN_STATE = {
  USERNAME_PASSWORD: 'username_password',
  AWAITING_MFA: 'awaiting_mfa',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [loginState, setLoginState] = useState(LOGIN_STATE.USERNAME_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (loginState === LOGIN_STATE.USERNAME_PASSWORD) {
      authService.login(email, password).then(
        (response) => {
          setLoading(false);
          // With the bypass, this will immediately be 'password_ok_awaiting_mfa'
          if (response.data.message === 'password_ok_awaiting_mfa') {
            setLoginState(LOGIN_STATE.AWAITING_MFA);
          } else {
            setMessage('Unexpected login response.');
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.error) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else if (loginState === LOGIN_STATE.AWAITING_MFA) {
      authService.loginMFA(email, mfaCode).then(
        () => {
          // With the bypass, this resolves instantly and redirects
          history.push('/practice');
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.error) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    }
  };

  const renderForm = () => {
    if (loginState === LOGIN_STATE.USERNAME_PASSWORD) {
      return (
        <>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </>
      );
    } else if (loginState === LOGIN_STATE.AWAITING_MFA) {
      return (
        <>
          <p className="login-subtitle" style={{marginBottom: '20px'}}>
            MFA Required. Enter the TOTP code from your authenticator app.
          </p>
          <div className="form-group">
            <label htmlFor="mfaCode">MFA Code</label>
            <input
              id="mfaCode"
              type="text"
              className="form-control"
              placeholder="TOTP Code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              required
              autoComplete="one-time-code"
              autoFocus
              disabled={loading}
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo">
            <img src={logo} alt="Candidate Tools" />
          </div>
          <h2>{loginState === LOGIN_STATE.USERNAME_PASSWORD ? 'Sign in' : 'Verify MFA'}</h2>
          <p className="login-subtitle">to continue to MedTools</p>
        </div>

        <div className="login-right">
          <form onSubmit={handleLogin}>
            {renderForm()}

            <div className="form-actions">
              <button 
                type="button" 
                className="forgot-password" 
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </button>
            </div>

            {message && (
              <div className="alert-danger" role="alert">
                {message}
              </div>
            )}

            <div className="button-group">
              {loginState === LOGIN_STATE.USERNAME_PASSWORD && (
                <button 
                  type="button" 
                  className="create-account-link" 
                  onClick={(e) => e.preventDefault()}
                >
                  Create account
                </button>
              )}
              <button type="submit" className="login-button" disabled={loading}>
                {loading && <span className="spinner-border"></span>}
                <span>{loading ? 'Processing...' : (loginState === LOGIN_STATE.USERNAME_PASSWORD ? 'Sign in' : 'Verify')}</span>
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