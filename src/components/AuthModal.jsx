import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ isOpen, initialTab, onClose, onLoginSuccess }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'login');
      // Clear forms and error states
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      setLoading(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = activeTab === 'login' 
        ? { email, password }
        : { name, email, password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-tabs">
          <div
            className={`modal-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
          >
            {t('login')}
          </div>
          <div
            className={`modal-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('signup');
              setError('');
            }}
          >
            {t('signUp')}
          </div>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{
              color: 'var(--accent-red, #ff453a)',
              backgroundColor: 'rgba(255, 69, 58, 0.1)',
              border: '1px solid rgba(255, 69, 58, 0.2)',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form className="modal-form" onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <div className="form-group">
                <label className="form-label">{t('auth.nameLabel')}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{t('auth.emailLabel')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.passwordLabel')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (activeTab === 'login' ? t('auth.loginBtn') : t('auth.signUpBtn'))}
            </button>
          </form>

          <div className="modal-footer">
            {activeTab === 'login' ? (
              <>
                {t('auth.noAccount')}
                <span className="modal-link" onClick={() => setActiveTab('signup')}>
                  {t('signUp')}
                </span>
              </>
            ) : (
              <>
                {t('auth.hasAccount')}
                <span className="modal-link" onClick={() => setActiveTab('login')}>
                  {t('login')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
