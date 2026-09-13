import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Styles
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/landing.css';
import './styles/citizen.css';
import './styles/government.css';
import './styles/operations.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SchemeProvider } from './context/SchemeContext';
import { ToastProvider } from './components/common/ToastNotification';

// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary';

// Main App
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <SchemeProvider>
              <App />
            </SchemeProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
