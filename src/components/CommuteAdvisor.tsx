import React, { useState } from "react";
import { 
  Navigation, 
  MapPin, 
  Bus, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Laptop,
  Check,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { VolunteerRole } from "../types";

interface CommuteAdvisorProps {
  role: VolunteerRole;
  theme: string;
}

export default function CommuteAdvisor({ role, theme }: CommuteAdvisorProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Custom Nairobi public transport warning tips
  const nairobiTrafficTips = [
    {
      title: "Superhighway Access (Thika Road)",
      description: "Fast-moving express lanes. Overpasses near USIU-Africa are equipped with concrete ramps, though visual pavement guides are worn. Support assistance is recommended for manual wheelchair users.",
      type: "transport"
    },
    {
      title: "Nairobi CBD Matatus & Terminal Ramps",
      description: "High sensory overload / physical congestion. Matatus do not have motorized lifts. Private hailing cabs or UberAssist (which supports folding wheelchairs and guides) provide superior dignity of transport.",
      type: "caution"
    },
    {
      title: "USIU-Africa Campus Gateways",
      description: "Fully paved. Ramp thresholds are smooth and well-graded from the Kasarani-Mwiki gate to the Library and Student Centre. Office staff are readily available to assist.",
      type: "access"
    }
  ];

  const getThemeCardClass = () => {
    if (theme === 'theme-yellow-black') {
      return 'bg-black border-2 border-yellow-450 p-4 space-y-4 text-[#ffff00]';
    }
    if (theme === 'theme-cosmic-slate') {
      return 'bg-[#151c2e] border border-slate-800 p-5 rounded-xl space-y-4 text-slate-100';
    }
    return 'bg-[#F4F7F9] border border-blue-100 p-5 rounded-xl space-y-4 text-slate-800';
  };

  const getDistrictAccent = () => {
    if (theme === 'theme-yellow-black') return 'border-[#ffff00] text-[#ffff00]';
    return 'border-blue-500 text-[#005A9C] bg-blue-50';
  };

  return (
    <div className={getThemeCardClass()} role="region" aria-label="Nairobi Commuting & Transportation Guide">
      <div className="flex items-center justify-between border-b border-slate-755 pb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <h4 className="font-bold text-sm tracking-wide uppercase">USIU Commuter Path Guide</h4>
            <p className="text-[10px] opacity-75">Nairobi Infrastructure & Accessibility Route Map</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded border uppercase ${getDistrictAccent()}`}>
          {role.modality} Location
        </div>
      </div>

      {/* Main distance coordinates indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-neutral-900 bg-opacity-25 border border-slate-205 rounded-lg font-bold">
          <span className="opacity-75 block text-[10px] uppercase">Est. Campus Distance:</span>
          <span className="text-sm text-amber-500">{role.distanceFromUSIU || "0 km (On-Campus)"}</span>
        </div>
        <div className="p-3 bg-neutral-900 bg-opacity-25 border border-slate-250 rounded-lg font-bold">
          <span className="opacity-75 block text-[10px] uppercase">Commute Location:</span>
          <span className="text-sm">{role.location}</span>
        </div>
        <div className="p-3 bg-neutral-900 bg-opacity-25 border border-slate-250 rounded-lg font-bold">
          <span className="opacity-75 block text-[10px] uppercase">Commuter Area:</span>
          <span className="text-sm text-green-500 font-semibold">{role.orgType} Sector</span>
        </div>
      </div>

      {/* Virtual/Remote workflow check */}
      {role.modality === 'Remote' ? (
        <div className="p-4 bg-emerald-950 bg-opacity-34 border border-emerald-500 rounded-lg text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <Laptop className="w-4 h-4 shrink-0" />
            <span>Fully Virtual & Digital Workflow</span>
          </div>
          <p className="opacity-90 leading-relaxed font-medium">
            Excellent! This opportunity with <strong className="text-white">{role.organizationName}</strong> requires zero physical commuting in Nairobi. Students can work completely asynchronously from the USIU-Africa library, computer complexes, or residential halls on adaptive software or sensory setups.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase block tracking-wider">On-Site Commute Milestones (USIU to Venue):</span>
            <p className="text-[11px] opacity-80 italic">Suggested physical transfer steps for students with impairment:</p>
          </div>

          <div className="relative border-l-2 border-slate-350 pl-4 space-y-4 text-xs font-semibold">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-amber-500 border-2 border-white" />
              <p className="font-bold text-amber-500 uppercase text-[9px] tracking-widest">STARTING POINT: CAMPUS</p>
              <p className="opacity-95 mt-0.5">Depart USIU-Africa offices (Student Centre). Path is step-free to parking lots.</p>
            </div>
            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#005A9C] border-2 border-white" />
              <p className="font-bold text-[#005A9C] uppercase text-[9px] tracking-widest">TRANSIT STAGE</p>
              <p className="opacity-95 mt-0.5">{role.routeGuide || "Board designated transit vehicles outbound via Thika Highway. Private hailed cabs are highly recommended with accessible trunks."}</p>
            </div>
            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              <p className="font-bold text-emerald-500 uppercase text-[9px] tracking-widest">ARRIVING PATH</p>
              <p className="opacity-95 mt-0.5">Arrive in {role.location}. Host accommodations: <span className="text-emerald-400 underline">{role.accommodationInfo}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Infrastructure Alert Bullet list */}
      <div className="p-3 bg-neutral-950 bg-opacity-25 rounded-md space-y-2 text-[11px]">
        <span className="font-bold text-yellow-500 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Local Impairment Commuting Warnings:</span>
        </span>
        <ul className="list-disc pl-4 space-y-1 font-medium select-none">
          {nairobiTrafficTips.map((tip, idx) => (
            <li key={idx} className="opacity-90">
              <strong className="opacity-100">{tip.title}:</strong> {tip.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Approval indicators */}
      {role.usiuApproved && (
        <div className="flex items-center justify-between bg-neutral-900 bg-opacity-40 p-2.5 rounded-lg border border-slate-755 text-[11px] font-bold">
          <div className="flex items-center gap-1 text-emerald-450">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-emerald-500">USIU ODS Pre-Approved Host</span>
          </div>
          <span className="opacity-75">90-Hour CS / Academic Credits Match</span>
        </div>
      )}

    </div>
  );
}
