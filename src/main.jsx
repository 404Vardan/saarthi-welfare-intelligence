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
import { OpsAuthProvider } from './context/OpsAuthContext';
import { SchemeProvider } from './context/SchemeContext';

// Main App
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OpsAuthProvider>
          <SchemeProvider>
            <App />
          </SchemeProvider>
        </OpsAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
