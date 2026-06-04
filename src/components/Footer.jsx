import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'fr', label: 'Français' }
  ];

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'English';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2 className="logo-text">
            {t('appName')}<span className="logo-dot"></span>
          </h2>
          <p className="footer-desc">
            Your premium destination for curated technology, modern fashion, and premium lifestyle accessories. Designed with excellence.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Shop</h4>
          <ul className="footer-links">
            <li className="footer-link-item">{t('categories.electronics')}</li>
            <li className="footer-link-item">{t('categories.fashion')}</li>
            <li className="footer-link-item">{t('categories.home')}</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Legal</h4>
          <ul className="footer-links">
            <li className="footer-link-item" onClick={() => setShowTermsModal(true)}>
              {t('footer.terms')}
            </li>
            <li className="footer-link-item" onClick={() => setShowTermsModal(true)}>
              {t('footer.privacy')}
            </li>
            <li className="footer-link-item" onClick={() => setShowTermsModal(true)}>
              {t('footer.cookies')}
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">{t('footer.language')}</h4>
          <div className="footer-settings">
            <div className="setting-selector">
              <span className="setting-label">Select Shop Language:</span>
              <div className="lang-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="lang-select-btn"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={16} style={{ color: 'var(--accent-red)' }} />
                    {currentLangLabel}
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                </button>

                {showLangDropdown && (
                  <div className="lang-dropdown-options">
                    {languages.map((lang) => (
                      <div
                        key={lang.code}
                        className={`lang-option ${language === lang.code ? 'active' : ''}`}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangDropdown(false);
                        }}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="copyright-text">{t('footer.copyright')}</p>
          <div className="footer-legal-links">
            <span
              className="footer-link-item"
              style={{ fontSize: '0.8rem' }}
              onClick={() => setShowTermsModal(true)}
            >
              {t('footer.terms')}
            </span>
            <span
              className="footer-link-item"
              style={{ fontSize: '0.8rem' }}
              onClick={() => setShowTermsModal(true)}
            >
              {t('footer.privacy')}
            </span>
          </div>
        </div>
      </div>

      {/* Simulated Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTermsModal(false)} aria-label="Close modal">
              <X size={18} />
            </button>
            <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-red)', fontSize: '1.5rem', fontWeight: '800' }}>
                {t('footer.terms')} & Privacy Policy
              </h3>
              
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.6' }}>
                <p><strong>1. Welcome to shopifyy</strong></p>
                <p>By accessing our frontend-only application, you agree to comply with and be bound by these terms. This is a mockup designed for visual evaluation. All data, accounts, and checkout options are simulated.</p>
                
                <p><strong>2. User Agreement & Privacy</strong></p>
                <p>We respect your privacy. No personal registration data is stored on remote servers; all actions occur locally in the user's active session. Simulated logins are destroyed upon page reload.</p>
                
                <p><strong>3. Accent Red Theme & Layout Licensing</strong></p>
                <p>The code layout, red-accent highlight styles, custom scrollbars, and animations are properties of shopifyy visual design guidelines. Reproduction for real-world commerce is permitted under the MIT License.</p>
                
                <p><strong>4. Disclaimer of Liability</strong></p>
                <p>All items displayed (e.g. Wireless headphones, leather jackets, etc.) are mockups utilizing royalty-free high-fidelity photography. Prices are illustrative. No actual transactions or financial information will ever be processed.</p>
              </div>
              
              <button
                className="form-submit-btn"
                style={{ width: '100%', marginTop: '1.5rem' }}
                onClick={() => setShowTermsModal(false)}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
