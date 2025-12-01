// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import {Provider} from 'react-redux';
import { store } from './store/store';
import '@fortawesome/fontawesome-free/css/all.min.css';


// Fixed import

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    
        <App /> {/* App is wrapped inside AuthProvider */}
     </Provider>
     
    </BrowserRouter>
  </StrictMode>
);