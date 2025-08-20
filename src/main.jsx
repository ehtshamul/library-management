// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './server/AuthContext.jsx'; // Fixed import

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App /> {/* App is wrapped inside AuthProvider */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);