import React, { useState } from 'react';
import { loginUser, registerUser } from '../../services/authApi';

interface AuthModalProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUsername: (username: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ setIsLoggedIn, setUsername }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setError('');
  };

  const closeModal = () => {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    // Reset form
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      if (response.success && response.user) {
        setIsLoggedIn(true);
        setUsername(response.user.name);
        closeModal();
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(name, email, password);
      if (response.success && response.user) {
        setIsLoggedIn(true);
        setUsername(response.user.name);
        closeModal();
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal" className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        
        <div className="auth-tabs">
          <button 
            id="login-tab"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button 
            id="signup-tab"
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`} 
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Login Form */}
        <div className={`auth-form ${activeTab === 'login' ? 'active' : ''}`}>
          <h2>Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input 
                type="email" 
                id="login-email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input 
                type="password" 
                id="login-password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn primary-btn" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        
        {/* Signup Form */}
        <div className={`auth-form ${activeTab === 'signup' ? 'active' : ''}`}>
          <h2>Create Account</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="signup-name">Name</label>
              <input 
                type="text" 
                id="signup-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input 
                type="email" 
                id="signup-email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input 
                type="password" 
                id="signup-password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input 
                type="password" 
                id="signup-confirm-password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn primary-btn" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;