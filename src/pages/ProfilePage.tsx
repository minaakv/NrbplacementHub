import React, { useState } from "react";
import {
  UserCheck, Mail, Phone, BookOpen, CreditCard, FileText,
  Accessibility, Edit3, Save, X, CheckCircle, Clock,
  AlertCircle, Briefcase, Trash2, ChevronDown, ChevronUp,
  Star, Calendar, Layers
} from "lucide-react";
import { UserProfile, ApplicationSubmission, A11ySettings } from "../types";

interface ProfilePageProps {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  submissions: ApplicationSubmission[];
  onWithdraw: (submissionId: string, roleTitle: string) => Promise<void>;
  onSaveProfile: (profile: UserProfile) => Promise<void>;
  triggerSound: (type: 'beep' | 'success' | 'click' | 'error') => void;
  triggerVocalization: (text: string) => void;
  settings: A11ySettings;
}

const STATUS_CONFIG = {
  Accepted:  { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle,  dot: "bg-emerald-500" },
  "In Review": { color: "bg-blue-100 text-blue-800 border-blue-300",       icon: Clock,        dot: "bg-blue-500"    },
  Received:  { color: "bg-amber-100 text-amber-800 border-amber-300",      icon: AlertCircle,  dot: "bg-amber-500"   },
  Withdrawn: { color: "bg-slate-100 text-slate-500 border-slate-300",      icon: X,            dot: "bg-slate-400"   },
  Rejected:  { color: "bg-red-100 text-red-700 border-red-300",            icon: X,            dot: "bg-red-500"     },
} as const;

const MAJORS = [
  "Business Administration", "Computer Science", "Journalism & Media Studies",
  "International Relations", "Psychology", "Nursing", "Law",
  "Communication & PR", "Finance", "Entrepreneurship", "Other"
];

const DISABILITIES = [
  "Visual Impairment (Low Vision)", "Visual Impairment (Blind)",
  "Physical / Mobility Impairment", "Hearing Impairment",
  "Learning Disability", "Speech Impairment", "Multiple Disabilities", "Prefer not to say"
];

export default function ProfilePage({
  userProfile, setUserProfile, submissions,
  onWithdraw, onSaveProfile, triggerSound, triggerVocalization
}: ProfilePageProps) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const startEdit = () => {
    if (!userProfile) return;
    setDraft({ ...userProfile });
    setEditMode(true);
    setSaveSuccess(false);
    triggerSound('click');
    triggerVocalization("Profile edit mode activated. Update your details and click Save Changes.");
  };

  const cancelEdit = () => {
    setEditMode(false);
    setDraft(null);
    triggerSound('click');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    try {
      await onSaveProfile(draft);
      setUserProfile(draft);
      setEditMode(false);
      setDraft(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      triggerSound('success');
      triggerVocalization("Profile saved successfully!");
    } catch {
      triggerSound('error');
      triggerVocalization("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async (sub: ApplicationSubmission) => {
    if (!window.confirm(`Withdraw your application for "${sub.roleTitle}"? This cannot be undone.`)) return;
    setWithdrawingId(sub.id);
    try {
      await onWithdraw(sub.id, sub.roleTitle);
      triggerSound('click');
      triggerVocalization(`Application for ${sub.roleTitle} has been withdrawn.`);
    } catch {
      triggerSound('error');
    } finally {
      setWithdrawingId(null);
    }
  };

  const profile = editMode ? draft : userProfile;
  const filteredSubs = filterStatus === "all"
    ? submissions
    : submissions.filter(s => s.status === filterStatus);

  const statusCounts = submissions.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#002F6C] focus:border-[#002F6C] focus:outline-none bg-white transition-all";
  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";

  return (
    <section aria-labelledby="profile-page-heading" className="space-y-8 pb-12">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-blue-100 h-40">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002F6C] via-[#005A9C] to-[#0077CC]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative h-full flex items-end p-6 md:p-8 gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-[#F2A900] border-4 border-white shadow-lg flex items-center justify-center shrink-0">
            <span className="text-3xl font-black text-[#002F6C]">
              {(userProfile?.fullName || "S").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="pb-1">
            <h2 id="profile-page-heading" className="text-2xl font-black text-white leading-tight">
              {userProfile?.fullName || "Student Profile"}
            </h2>
            <p className="text-blue-200 text-xs font-semibold mt-0.5">
              {userProfile?.major || "USIU-Africa"} · {userProfile?.email}
            </p>
          </div>
        </div>
      </div>

      {/* ── Save Success Toast ── */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-bold animate-pulse">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Profile updated successfully!
        </div>
      )}

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Profile Card ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#002F6C] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#F2A900]" />
                <span className="text-white font-black text-sm uppercase tracking-wider">My Profile</span>
              </div>
              {!editMode && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2A900] hover:bg-amber-400 text-[#002F6C] rounded-lg text-xs font-black uppercase tracking-wider transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="p-5">
              {editMode ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label htmlFor="prof-fullName" className={labelClass}>Full Name *</label>
                    <input id="prof-fullName" type="text" required className={inputClass}
                      value={draft?.fullName || ""}
                      onChange={e => draft && setDraft({ ...draft, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="prof-email" className={labelClass}>Email (read-only)</label>
                    <input id="prof-email" type="email" readOnly className={inputClass + " bg-slate-100 text-slate-400 cursor-not-allowed"}
                      value={draft?.email || ""} />
                  </div>
                  <div>
                    <label htmlFor="prof-phone" className={labelClass}>Phone Number</label>
                    <input id="prof-phone" type="tel" className={inputClass}
                      placeholder="+254 7XX XXX XXX"
                      value={draft?.phone || ""}
                      onChange={e => draft && setDraft({ ...draft, phone: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="prof-studentId" className={labelClass}>Student ID</label>
                    <input id="prof-studentId" type="text" className={inputClass}
                      placeholder="e.g. 649521"
                      value={draft?.studentId || ""}
                      onChange={e => draft && setDraft({ ...draft, studentId: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="prof-major" className={labelClass}>Undergraduate Major</label>
                    <select id="prof-major" className={inputClass}
                      value={draft?.major || ""}
                      onChange={e => draft && setDraft({ ...draft, major: e.target.value })}>
                      <option value="">Select your major…</option>
                      {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="prof-disability" className={labelClass}>Disability / Access Need</label>
                    <select id="prof-disability" className={inputClass}
                      value={draft?.disability || ""}
                      onChange={e => draft && setDraft({ ...draft, disability: e.target.value })}>
                      <option value="">Select…</option>
                      {DISABILITIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="prof-bio" className={labelClass}>Short Bio</label>
                    <textarea id="prof-bio" rows={3} className={inputClass}
                      placeholder="Tell organisations a bit about yourself…"
                      value={draft?.bio || ""}
                      onChange={e => draft && setDraft({ ...draft, bio: e.target.value })} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#002F6C] hover:bg-[#005A9C] disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                      <Save className="w-3.5 h-3.5" />
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button type="button" onClick={cancelEdit}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {[
                    { icon: Mail,        label: "Email",         value: profile?.email },
                    { icon: Phone,       label: "Phone",         value: profile?.phone },
                    { icon: CreditCard,  label: "Student ID",    value: profile?.studentId },
                    { icon: BookOpen,    label: "Major",         value: profile?.major },
                    { icon: Accessibility, label: "Access Need", value: profile?.disability },
                    { icon: Calendar,    label: "Member Since",  value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long" }) : undefined },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-[#005A9C]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                        <p className="text-sm font-bold text-[#002F6C] mt-0.5">{value || <span className="text-slate-300 italic font-normal text-xs">Not set</span>}</p>
                      </div>
                    </div>
                  ))}
                  {profile?.bio && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mt-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bio</p>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Applications ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total",     count: submissions.length,               color: "bg-[#002F6C]",   text: "text-white" },
              { label: "Accepted",  count: statusCounts["Accepted"] || 0,    color: "bg-emerald-600", text: "text-white" },
              { label: "In Review", count: statusCounts["In Review"] || 0,   color: "bg-blue-600",    text: "text-white" },
              { label: "Withdrawn", count: statusCounts["Withdrawn"] || 0,   color: "bg-slate-400",   text: "text-white" },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-xl p-4 text-center shadow-sm`}>
                <p className={`text-2xl font-black ${s.text}`}>{s.count}</p>
                <p className={`text-[10px] font-black uppercase tracking-wider ${s.text} opacity-80 mt-0.5`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="bg-[#002F6C] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#F2A900]" />
                <span className="text-white font-black text-sm uppercase tracking-wider">
                  My Applications ({submissions.length})
                </span>
              </div>
              {/* Status Filter */}
              <select
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F2A900]"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                aria-label="Filter applications by status"
              >
                <option value="all">All Statuses</option>
                <option value="Accepted">Accepted</option>
                <option value="In Review">In Review</option>
                <option value="Received">Received</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredSubs.length === 0 ? (
                <div className="py-16 text-center">
                  <Layers className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold text-sm">No applications found</p>
                  <p className="text-slate-300 text-xs font-semibold mt-1">
                    {filterStatus === "all" ? "Browse the Placements Board to apply for opportunities." : `No ${filterStatus} applications yet.`}
                  </p>
                </div>
              ) : (
                filteredSubs.map(sub => {
                  const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG["Received"];
                  const StatusIcon = cfg.icon;
                  const isExpanded = expandedAppId === sub.id;
                  const isWithdrawing = withdrawingId === sub.id;
                  const canWithdraw = sub.status !== "Withdrawn" && sub.status !== "Accepted";

                  return (
                    <div key={sub.id} className="p-5 hover:bg-slate-50 transition-colors">
                      {/* Top row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {sub.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold font-mono">{sub.id}</span>
                          </div>
                          <h4 className="text-sm font-black text-[#002F6C] leading-snug">{sub.roleTitle}</h4>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Applied {sub.createdAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {canWithdraw && (
                            <button
                              onClick={() => handleWithdraw(sub)}
                              disabled={isWithdrawing}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                              aria-label={`Withdraw application for ${sub.roleTitle}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {isWithdrawing ? "Withdrawing…" : "Withdraw"}
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedAppId(isExpanded ? null : sub.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                            aria-label={isExpanded ? "Collapse details" : "Expand details"}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Format</p>
                              <p className="font-bold text-[#002F6C] capitalize">{sub.submissionType}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Commitment</p>
                              <p className="font-bold text-[#002F6C]">{sub.hoursCommitment}</p>
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Statement</p>
                            <p className="text-xs text-slate-700 font-semibold leading-relaxed">{sub.textContent}</p>
                          </div>
                          {sub.assistiveTech?.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Assistive Tech Declared</p>
                              <div className="flex flex-wrap gap-1">
                                {sub.assistiveTech.map((t, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-mono rounded">{t}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {sub.status === "Accepted" && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                              <Star className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-emerald-700">
                                Congratulations! Your application has been accepted. The organisation will contact you at <strong>{sub.email}</strong>.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
