import React, { useState, useEffect } from "react";
import {
  Building2, LogOut, ChevronDown, ChevronUp, CheckCircle,
  XCircle, Clock, Eye, Users, Briefcase, Filter,
  Mail, Phone, Calendar, FileText, Headphones,
  Video, AlertTriangle, Search, Star, X, Layers
} from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { ApplicationSubmission } from "../types";
import { CompanyCredential } from "../data/companyCredentials";

interface CompanyDashboardProps {
  company: CompanyCredential;
  onLogout: () => void;
}

type AppStatus = "In Review" | "Accepted" | "Rejected" | "Received" | "Withdrawn";

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  Accepted:  { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", icon: CheckCircle },
  Rejected:  { bg: "bg-red-100",     text: "text-red-800",     border: "border-red-300",     icon: XCircle     },
  "In Review": { bg: "bg-blue-100",  text: "text-blue-800",    border: "border-blue-300",    icon: Clock       },
  Received:  { bg: "bg-amber-100",   text: "text-amber-800",   border: "border-amber-300",   icon: AlertTriangle },
  Withdrawn: { bg: "bg-slate-100",   text: "text-slate-500",   border: "border-slate-300",   icon: X           },
};

const FORMAT_ICONS: Record<string, React.ElementType> = {
  audio: Headphones,
  video: Video,
  text:  FileText,
};

export default function CompanyDashboard({ company, onLogout }: CompanyDashboardProps) {
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch applications for all roleIds this company owns
  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const all: ApplicationSubmission[] = [];
        for (const roleId of company.roleIds) {
          const q = query(collection(db, "applications"), where("roleId", "==", roleId));
          const snap = await getDocs(q);
          snap.forEach(d => all.push({ id: d.id, ...d.data() } as ApplicationSubmission));
        }
        all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setApplications(all);
      } catch (err) {
        console.error("Error fetching applications:", err);
        showToast("Failed to load applications.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [company.roleIds]);

  const updateStatus = async (appId: string, newStatus: AppStatus, studentName: string) => {
    setActionLoading(appId + newStatus);
    try {
      await updateDoc(doc(db, "applications", appId), { status: newStatus });
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
      const verb = newStatus === "Accepted" ? "shortlisted" : "rejected";
      showToast(`${studentName} has been ${verb}.`, newStatus === "Accepted" ? "success" : "error");
    } catch {
      showToast("Action failed. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Derived counts
  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter + search
  const filtered = applications.filter(a => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.roleTitle.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const actionable = applications.filter(
    a => a.status !== "Accepted" && a.status !== "Rejected" && a.status !== "Withdrawn"
  ).length;

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-xl text-sm font-bold transition-all ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#002F6C] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#F2A900]" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Company Portal</p>
              <h1 className="text-sm font-black text-[#002F6C] leading-tight truncate max-w-[220px] md:max-w-none">
                {company.organizationName}
              </h1>
            </div>
          </div>

          {/* Meta + logout */}
          <div className="flex items-center gap-3">
            {actionable > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                {actionable} pending review
              </span>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total",     value: applications.length,         color: "bg-[#002F6C]" },
            { label: "Received",  value: counts["Received"]  || 0,    color: "bg-amber-500"  },
            { label: "In Review", value: counts["In Review"] || 0,    color: "bg-blue-500"   },
            { label: "Shortlisted", value: counts["Accepted"] || 0,   color: "bg-emerald-600"},
            { label: "Rejected",  value: counts["Rejected"]  || 0,    color: "bg-red-500"    },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center shadow-sm`}>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Role badges ── */}
        <div className="flex flex-wrap gap-2">
          {company.roleIds.map(rid => {
            const roleApps = applications.filter(a => a.roleId === rid);
            const sample = roleApps[0];
            return (
              <span key={rid} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-100 rounded-full text-xs font-bold text-[#002F6C] shadow-sm">
                <Briefcase className="w-3.5 h-3.5 text-[#F2A900]" />
                {sample?.roleTitle || rid}
                <span className="ml-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black">{roleApps.length}</span>
              </span>
            );
          })}
        </div>

        {/* ── Search + Filter bar ── */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or role…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#002F6C] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#002F6C] focus:outline-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Received">Received</option>
              <option value="In Review">In Review</option>
              <option value="Accepted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* ── Applications List ── */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="bg-[#002F6C] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F2A900]" />
              <span className="text-white font-black text-sm uppercase tracking-wider">
                Student Applications ({filtered.length})
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-[#002F6C] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-sm font-bold">Loading applications…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Layers className="w-10 h-10 text-slate-200 mx-auto" />
              <p className="text-slate-400 font-bold text-sm">No applications found</p>
              <p className="text-slate-300 text-xs font-semibold">
                {applications.length === 0
                  ? "No students have applied to your opportunities yet."
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(app => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG["Received"];
                const StatusIcon = cfg.icon;
                const FormatIcon = FORMAT_ICONS[app.submissionType] || FileText;
                const isExpanded = expandedId === app.id;
                const isPending = app.status !== "Accepted" && app.status !== "Rejected" && app.status !== "Withdrawn";
                const isActing = actionLoading?.startsWith(app.id);

                return (
                  <div key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Main row */}
                    <div className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">

                      {/* Avatar + Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#002F6C] to-[#005A9C] flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-lg font-black text-white">
                            {app.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-black text-[#002F6C]">{app.fullName}</h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                              <StatusIcon className="w-3 h-3" />
                              {app.status === "Accepted" ? "Shortlisted" : app.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{app.createdAt}</span>
                            <span className="flex items-center gap-1"><FormatIcon className="w-3 h-3" />{app.submissionType} format</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-semibold mt-1 truncate">{app.roleTitle}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isPending && (
                          <>
                            <button
                              onClick={() => updateStatus(app.id, "Accepted", app.fullName)}
                              disabled={!!isActing}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                              aria-label={`Shortlist ${app.fullName}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "Rejected", app.fullName)}
                              disabled={!!isActing}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50 text-red-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                              aria-label={`Reject ${app.fullName}`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}

                        {app.status === "Accepted" && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold">
                            <Star className="w-3.5 h-3.5" /> Shortlisted
                          </span>
                        )}
                        {app.status === "Rejected" && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Rejected
                          </span>
                        )}

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : app.id)}
                          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                          aria-label={isExpanded ? "Collapse" : "View details"}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-0 space-y-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                          <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Commitment</p>
                            <p className="text-sm font-bold text-[#002F6C]">{app.hoursCommitment}</p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Submission Format</p>
                            <p className="text-sm font-bold text-[#002F6C] capitalize">{app.submissionType}</p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Application ID</p>
                            <p className="text-xs font-mono font-bold text-slate-500">{app.id}</p>
                          </div>
                        </div>

                        {/* Statement */}
                        <div className="p-4 bg-white rounded-xl border border-blue-100">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                            Student Statement / Portfolio
                          </p>
                          <p className="text-sm text-slate-700 font-semibold leading-relaxed">{app.textContent}</p>
                        </div>

                        {/* Assistive tech */}
                        {app.assistiveTech?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                              Assistive Technology Declared
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {app.assistiveTech.map((t, i) => (
                                <span key={i} className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-mono font-bold rounded-lg">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick action repeat */}
                        {isPending && (
                          <div className="flex gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => updateStatus(app.id, "Accepted", app.fullName)}
                              disabled={!!isActing}
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Shortlist This Applicant
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "Rejected", app.fullName)}
                              disabled={!!isActing}
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50 text-red-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                              Decline Application
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white mt-12 py-5 text-center text-xs text-slate-400 font-semibold">
        USIU-Africa Nairobi Placement Hub · Company Portal · {company.organizationName}
      </footer>
    </div>
  );
}
