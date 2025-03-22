import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth
import '../styles/Login.css';
import logo from '../img/logo.png';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  // Prefill email if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setCredentials((prev) => ({ ...prev, email: rememberedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        login(token, rememberMe); // Call login with token and rememberMe
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', credentials.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <img src={logo} alt="SanctionGuard Logo" className="logo" />
              <div className="brand-text">
                <h1>SanctionGuard</h1>
                <p>Enterprise Edition</p>
              </div>
            </div>
            <h2 className="welcome-text">Welcome Back</h2>
            <p className="login-subtitle">Sign in to access your secure dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#forgot-password" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2025 SanctionGuard. All rights reserved.</p>
            <p className="support-link">
              Need help? <a href="#contact-support">Contact Support</a>
            </p>
          </div>
        </div>

        <div className="login-info-panel">
          <div className="info-card">
            <h3>Protecting Global Finance</h3>
            <p>SanctionGuard helps financial institutions maintain compliance with international sanctions and regulatory requirements.</p>
          </div>
          <div className="info-card">
            <h3>Advanced Screening Technology</h3>
            <p>Our system processes millions of transactions daily with real-time screening against global watchlists.</p>
          </div>
          <div className="info-card">
            <h3>Secure & Compliant</h3>
            <p>Enterprise-grade security with SOC 2 Type II certification and GDPR compliance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;