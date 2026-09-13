import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Global Error Boundary
 * Catches unhandled React errors and displays a fallback UI.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[Saarthi] Unhandled error caught by ErrorBoundary:', error, errorInfo);
    // Future: send to error tracking service (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFDF9',
          padding: '2rem',
          fontFamily: "'Inter', -apple-system, sans-serif"
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '2.5rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(11, 31, 58, 0.08)',
            border: '1px solid #E8DCC8'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(193, 68, 45, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <AlertTriangle size={24} color="#C1442D" />
            </div>

            <h2 style={{
              fontFamily: "'Source Serif 4', serif",
              color: '#0B1F3A',
              margin: '0 0 0.5rem 0',
              fontSize: '1.5rem'
            }}>
              Something went wrong
            </h2>

            <p style={{ color: '#6B7A8D', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              An unexpected error occurred in the application. This has been logged and will be investigated.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(193, 68, 45, 0.06)',
                border: '1px solid rgba(193, 68, 45, 0.15)',
                borderRadius: '6px',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                fontSize: '0.8rem',
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#C1442D',
                wordBreak: 'break-word'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  background: '#C4983B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} /> Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  background: 'white',
                  color: '#0B1F3A',
                  border: '1px solid #E8DCC8',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Home size={14} /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
