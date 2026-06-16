import React, { useState } from "react";
import { Building2, Eye, EyeOff, LogIn, Globe, ShieldCheck } from "lucide-react";
import { companyCredentials, CompanyCredential } from "../data/companyCredentials";

interface CompanyLoginProps {
  onLoginSuccess: (company: CompanyCredential) => void;
}

export default function CompanyLogin({ onLoginSuccess }: CompanyLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate a short delay for UX
    await new Promise(r => setTimeout(r, 600));

    const match = companyCredentials.find(
      c => c.username === username.trim() && c.password === password
    );

    if (match) {
      onLoginSuccess(match);
    } else {
      setError("Invalid username or password. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001A40] via-[#002F6C] to-[#004B99] flex items-center justify-center p-4 font-sans">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative w-full max-w-md space-y-6">

        {/* Logo block */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#F2A900] shadow-xl flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-[#002F6C]" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Globe className="w-3.5 h-3.5 text-[#F2A900]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                USIU-Africa Nairobi Placement Hub
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Company Portal</h1>
            <p className="text-blue-200 text-xs font-semibold mt-1">
              Sign in to review and act on student applications
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">

          {/* Secure badge */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] font-bold text-emerald-700">
              Secure organisation portal — credentials are provided by USIU-Africa ODS
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="co-username" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                Organisation Username
              </label>
              <input
                id="co-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. safaricom.portal"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#002F6C] focus:border-[#002F6C] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="co-password" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="co-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#002F6C] focus:border-[#002F6C] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#002F6C] hover:bg-[#005A9C] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider rounded-xl shadow-md transition-all text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In to Portal
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 font-semibold">
            Student applicant?{" "}
            <a href="/" className="text-[#002F6C] font-black hover:underline">
              Use the main student portal →
            </a>
          </p>
        </div>

        {/* Help text */}
        <p className="text-center text-[11px] text-blue-300 font-semibold">
          Credentials issued by USIU-Africa Office of Disability Services · ods@usiu.ac.ke
        </p>
      </div>
    </div>
  );
}
