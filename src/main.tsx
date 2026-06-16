import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import CompanyPortal from './CompanyPortal.tsx';
import './index.css';

/**
 * Lightweight path-based routing (no external router needed).
 * /company  → Company login + dashboard
 * /*        → Student placement portal
 */
function Root() {
  const isCompanyRoute = window.location.pathname.startsWith('/company');
  return isCompanyRoute ? <CompanyPortal /> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
