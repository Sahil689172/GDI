import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/responsive.css';
import './styles/scroll.css';
import './styles/motion.css';
import './styles/auth.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: false,
  onNeedRefresh() {
    // install prompt is handled by UI; keep silent for now
  },
  onOfflineReady() {
    // offline ready foundation
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
