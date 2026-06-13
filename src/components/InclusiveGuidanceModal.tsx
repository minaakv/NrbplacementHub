import React from "react";
import { 
  ShieldCheck, 
  Eye, 
  MapPin, 
  Clock, 
  BookOpen, 
  Check, 
  X,
  Volume2,
  Ear,
  Server
} from "lucide-react";
import { VolunteerRole } from "../types";

interface InclusiveGuidanceModalProps {
  role: VolunteerRole;
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

export default function InclusiveGuidanceModal({
  role,
  isOpen,
  onClose,
  theme
}: InclusiveGuidanceModalProps) {
  if (!isOpen) return null;

  const getThemeClass = () => {
    if (theme === 'theme-yellow-black') return 'bg-black text-[#ffff00] border-4 border-[#ffff00]';
    if (theme === 'theme-cosmic-slate') return 'bg-[#151c2e] text-slate-100 border border-slate-800';
    return 'bg-white text-slate-800 border border-slate-200';
  };

  const getTitleStyle = () => {
    if (theme === 'theme-yellow-black') return 'text-[#ffff00]';
    return 'text-[#005A9C]';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guidance-title"
    >
      <div className={`p-6 md:p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 relative shadow-2xl ${getThemeClass()}`}>
        
        {/* Upper Close row */}
        <div className="flex justify-between items-start border-b border-slate-700 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block">Organizational Inclusivity Strategy</span>
            <h3 id="guidance-title" className={`text-xl font-bold tracking-tight mt-0.5 ${getTitleStyle()}`}>
              Pledge to Be Inclusive: {role.organizationName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-300 hover:text-black rounded-full transition-all accessible-focus"
            aria-label="Close guidance details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Introduction block */}
        <p className="text-xs leading-relaxed opacity-90 font-medium">
          Whether {role.organizationName} is already fully adapted or seeking to pivot, this guide details practical, low-cost modifications to support students with physical and sensory needs beautifully.
        </p>

        {/* Section 1: Digital adaptation for visual impairment */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase text-amber-500 tracking-wide flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Eye className="w-4 h-4 shrink-0" />
            <span>Digital Adaptations (Blind / Visual Needs)</span>
          </h4>
          
          <ul className="list-none pl-0 space-y-2 text-xs font-medium">
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Accessible Document Formats:</strong> Avoid distributing tasks in flattened scanned PDF images. Instead, distribute text in standard DOCX, HTML, or structured plain text compatible with digital reader voices (JAWS/NVDA).</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Descriptive Image Labels:</strong> Prioritize providing written alt-tags or plain-text captions for visual aids used in reports, campaigns, and training files.</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Screen-Magnification Comfort:</strong> Support standard text zoom in cloud workspaces. Tasks must allow volunteers to scale web browser forms to 200% magnification cleanly.</span>
            </li>
          </ul>
        </div>

        {/* Section 2: Physical & mobility coordinates */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase text-amber-500 tracking-wide flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>On-Site Adaptations (Physical & Mobility Access)</span>
          </h4>
          
          <ul className="list-none pl-0 space-y-2 text-xs font-medium">
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Barrier-Free Thresholds:</strong> Secure physical step-free entries to workspace spaces (racks, tables, and conference blocks). Threshold lips should be graded to under 1.5 cm.</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Organized Sensory Pathways:</strong> Keep cords or temporary signage clear from critical pathways, ensuring safety for blind white-cane walkers and wheelchair navigators.</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Buddy Coordination Systems:</strong> Connect the student with an on-site 'Peer Buddy' for structural orientations (locating restrooms, navigating Matatu boarding bays/Uber collection spots, and retrieving shared catering boxes).</span>
            </li>
          </ul>
        </div>

        {/* Section 3: Neurodiversity & flexible pacing */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase text-amber-500 tracking-wide flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Cognitive & Energy Management Adaptations</span>
          </h4>
          
          <ul className="list-none pl-0 space-y-2 text-xs font-medium">
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Modular Energy Pacing:</strong> Support dividing complex tasks into rapid micro-tasks taking under 2 hours, accommodating students managing sensory overload or variable medical exhaustion cycles.</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Quiet Low-Stimulus Workstations:</strong> Offer access to low-noise sensory isolation corners, especially for neurodivergent individuals or individuals with visual impairments needing screen acoustic listening silence.</span>
            </li>
          </ul>
        </div>

        {/* ODS recommendation seal */}
        <div className="p-4 bg-emerald-950 bg-opacity-25 border border-emerald-500 rounded-lg text-xs flex gap-3 items-start font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span>USIU-Africa Office of Disability Services Endorsement</span>
            <p className="opacity-90 font-medium font-sans">
              "We provide custom advice and templates directly to companies in Nairobi wanting to onboard USIU students. Any local corporate, restaurant, or NGO that pledges can request free disability audit accessories from our Kasarani campus office."
            </p>
          </div>
        </div>

        {/* Close triggers */}
        <div className="pt-4 border-t border-slate-705 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 font-bold text-xs uppercase bg-[#005A9C] hover:bg-blue-700 text-white rounded-lg transition-all accessible-focus"
          >
            I Understand, Return to Roles
          </button>
        </div>

      </div>
    </div>
  );
}
