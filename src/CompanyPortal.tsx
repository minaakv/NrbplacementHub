import { useState } from 'react';
import CompanyLogin from './pages/CompanyLogin';
import CompanyDashboard from './pages/CompanyDashboard';
import { CompanyCredential } from './data/companyCredentials';

/**
 * CompanyPortal
 * Manages the company-facing session: shows login until credentials
 * are verified, then hands off to the full dashboard.
 */
export default function CompanyPortal() {
  const [activeCompany, setActiveCompany] = useState<CompanyCredential | null>(null);

  if (!activeCompany) {
    return <CompanyLogin onLoginSuccess={setActiveCompany} />;
  }

  return (
    <CompanyDashboard
      company={activeCompany}
      onLogout={() => setActiveCompany(null)}
    />
  );
}
