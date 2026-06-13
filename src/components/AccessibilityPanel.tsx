import React, { useState } from "react";
import { 
  Eye, 
  Volume2, 
  Ear,
  X,
  Sliders,
  Maximize2,
  Info,
  CheckCircle,
  Clock,
  BookOpen
} from "lucide-react";
import { A11ySettings } from "../types";

interface AccessibilityPanelProps {
  settings: A11ySettings;
  setSettings: React.Dispatch<React.SetStateAction<A11ySettings>>;
  ariaLiveText: string;
  triggerVocalization: (announcement: string) => void;
  triggerSound: (type: 'beep' | 'success' | 'click' | 'error') => void;
  isOnboardingVerified: boolean;
  activeTab: string;
  handleTabChange: (tabId: string) => void;
}

export default function AccessibilityPanel({
  settings,
  setSettings,
  ariaLiveText,
  triggerVocalization,
  triggerSound,
  isOnboardingVerified,
  activeTab,
  handleTabChange
}: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cycleTheme = () => {
    const themes: ('theme-cool-light' | 'theme-cosmic-slate' | 'theme-yellow-black')[] = [
      'theme-cool-light', 'theme-cosmic-slate', 'theme-yellow-black'
    ];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setSettings(prev => ({ ...prev, theme: nextTheme }));
    triggerSound('click');
    
    let description = "";
    if (nextTheme === 'theme-cool-light') {
      description = "UNV Brand Navy & Cream Contrast (Elegant & High Legibility)";
    } else if (nextTheme === 'theme-cosmic-slate') {
      description = "Cosmic Dark Slate Mode (Low-light Screen Relief)";
    } else {
      description = "Extreme Contrast Yellow On Black (Low-Vision Visual Aids)";
    }
    
    triggerVocalization(`Theme adjusted to: ${description}.`);
  };

  const setFontSize = (size: 'text-normal' | 'text-large' | 'text-xlarge') => {
    setSettings(prev => ({ ...prev, fontSize: size }));
    triggerSound('click');
    
    let sizeDesc = size === 'text-normal' ? "Standard 100% zoom" : 
                   size === 'text-large' ? "Enlarged 125% zoom" : 
                   "Maximum 150% visual size";
    
    triggerVocalization(`Font scaling altered to ${sizeDesc}.`);
  };

  const toggleVoice = () => {
    const nextVoice = !settings.simulatedVoice;
    setSettings(prev => ({ ...prev, simulatedVoice: nextVoice }));
    triggerSound('beep');
    if (nextVoice) {
      triggerVocalization("Speech synthesis feedback enabled.");
    }
  };

  const toggleSoundCue = () => {
    const nextCue = !settings.soundCue;
    setSettings(prev => ({ ...prev, soundCue: nextCue }));
    if (nextCue) {
      setTimeout(() => triggerSound('success'), 100);
      triggerVocalization("Acoustic cue tones enabled.");
    } else {
      triggerVocalization("Acoustic signaling disabled.");
    }
  };

  return (
    <>
      {/* Persistent Floating Trigger on the side */}
      <button
        type="button"
        id="a11y-panel-trigger"
        onClick={() => {
          setIsOpen(!isOpen);
          triggerSound('beep');
          triggerVocalization(isOpen ? "Closed accommodations sidebar." : "Opened visual accommodation side consol. Use dynamic adjustments below.");
        }}
        className="fixed top-24 right-0 z-40 bg-[#F2A900] text-[#002F6C] font-black py-3 px-4 rounded-l-xl shadow-xl hover:bg-amber-400 transition-all border-y-2 border-l-2 border-[#002F6C] flex items-center gap-2 accessible-focus"
        aria-label="Toggle visual impairment accommodations panel"
        aria-expanded={isOpen}
      >
        <Sliders className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline text-xs uppercase tracking-widest">Accommodations Panel</span>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white animate-ping absolute top-1 right-1" />
      </button>

      {/* Slide-out Accommodations Console */}
      {isOpen && (
        <div 
          className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-white border-l-4 border-[#005A9C] shadow-2xl flex flex-col justify-between transition-all duration-300"
          style={{
            backgroundColor: settings.theme === 'theme-yellow-black' ? '#000000' : 
                             settings.theme === 'theme-cosmic-slate' ? '#111827' : '#F9FBFC',
            color: settings.theme === 'theme-yellow-black' ? '#ffff00' : 
                   settings.theme === 'theme-cosmic-slate' ? '#F3F4F6' : '#1F2937',
            borderColor: settings.theme === 'theme-yellow-black' ? '#ffff00' : '#005A9C'
          }}
          role="complementary"
          aria-label="Accommodations Panel Draw"
        >
          {/* Panel Header */}
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-[#002F6C] text-white">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#F2A900]" />
              <div>
                <h3 className="font-bold text-sm tracking-widest uppercase">Accommodations Panel</h3>
                <p className="text-[10px] text-slate-300">Custom Visual & Auditory Adaptability controls</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerSound('click');
                triggerVocalization("Accommodations side panel minimized.");
              }}
              className="p-1.5 hover:bg-white hover:text-[#002F6C] rounded-full transition-all accessible-focus"
              aria-label="Close accommodations workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Visual themes controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide block opacity-90">
                Contrast Color Themes:
              </label>
              <p className="text-[11px] opacity-75">Select visual contrast mode tailored for different sight characteristics.</p>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, theme: 'theme-cool-light' }));
                    triggerSound('click');
                    triggerVocalization("Selected UNV Brand Light Contrast Theme.");
                  }}
                  className={`w-full p-2.5 text-xs text-left font-bold border transition-all rounded-lg flex items-center justify-between ${
                    settings.theme === 'theme-cool-light' 
                      ? 'bg-[#002F6C] text-white border-[#002F6C]' 
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  <span>1. UNV Brand Light (Navy & Cream)</span>
                  <div className="flex gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#002F6C] border border-white" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F2A900] border border-white" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, theme: 'theme-cosmic-slate' }));
                    triggerSound('click');
                    triggerVocalization("Selected Cosmic Dark Theme.");
                  }}
                  className={`w-full p-2.5 text-xs text-left font-bold border transition-all rounded-lg flex items-center justify-between ${
                    settings.theme === 'theme-cosmic-slate' 
                      ? 'bg-[#002F6C] text-white border-[#002F6C]' 
                      : 'bg-slate-900 text-slate-200 border-slate-700'
                  }`}
                >
                  <span>2. Cosmic Dark Slate</span>
                  <div className="flex gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1e293b]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, theme: 'theme-yellow-black' }));
                    triggerSound('click');
                    triggerVocalization("Selected Extreme High Contrast Yellow-On-Black Theme.");
                  }}
                  className={`w-full p-2.5 text-xs text-left font-bold border-2 transition-all rounded-lg flex items-center justify-between ${
                    settings.theme === 'theme-yellow-black' 
                      ? 'bg-yellow-400 text-black border-yellow-400' 
                      : 'bg-black text-[#ffff00] border-[#ffff00]'
                  }`}
                >
                  <span>3. High Contrast (Yellow on Black)</span>
                  <div className="flex gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-black border border-yellow-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ffff00]" />
                  </div>
                </button>
              </div>
            </div>

            {/* Layout Zoom */}
            <div className="space-y-2 border-t border-slate-200 pt-4" style={{ borderColor: settings.theme === 'theme-yellow-black' ? '#ffff00' : '#e2e8f0' }}>
              <label className="text-xs font-bold uppercase tracking-wide block opacity-90">Layout Font Zoom:</label>
              <p className="text-[11px] opacity-75 hidden sm:block">Magnify app layouts to support low visual acuity or visual fatigue.</p>
              
              <div className="grid grid-cols-3 gap-2">
                {(['text-normal', 'text-large', 'text-xlarge'] as const).map((sz) => {
                  const label = sz === 'text-normal' ? '100% (Normal)' : sz === 'text-large' ? '125% (Large)' : '150% (Max)';
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`py-2 px-1 text-xs font-bold border rounded-lg transition-all text-center accessible-focus ${
                        settings.fontSize === sz 
                          ? 'bg-[#005A9C] text-white border-[#005A9C]' 
                          : 'bg-transparent border-slate-350 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speaking / Vocal synthesizer helper option */}
            <div className="space-y-4 border-t border-slate-200 pt-4" style={{ borderColor: settings.theme === 'theme-yellow-black' ? '#ffff00' : '#e2e8f0' }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide block opacity-90">Speech Vocalization Assist:</label>
                <p className="text-[11px] opacity-75">Enables simulated text-to-speech feedback for blind users.</p>
              </div>
              <button
                type="button"
                onClick={toggleVoice}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 border accessible-focus ${
                  settings.simulatedVoice 
                    ? 'bg-emerald-600 text-white border-emerald-500' 
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{settings.simulatedVoice ? "Speech Simulator Active (ON)" : "Speech Simulator Muted (OFF)"}</span>
              </button>
            </div>

            {/* Audio notifications */}
            <div className="space-y-4 border-t border-slate-200 pt-4" style={{ borderColor: settings.theme === 'theme-yellow-black' ? '#ffff00' : '#e2e8f0' }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide block opacity-90">Acoustic Tone Notification Cues:</label>
                <p className="text-[11px] opacity-75">Plays helpful sine tones on clicks, errors, and approvals.</p>
              </div>
              <button
                type="button"
                onClick={toggleSoundCue}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 border accessible-focus ${
                  settings.soundCue 
                    ? 'bg-teal-600 text-white border-teal-500' 
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                <Ear className="w-4 h-4" />
                <span>{settings.soundCue ? "Acoustic Tones Active (ON)" : "Acoustic Tones Muted (OFF)"}</span>
              </button>
            </div>

            {/* Keyboard shortcuts helper section */}
            <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2 border border-slate-800 text-[11px]">
              <h4 className="font-bold uppercase tracking-widest text-[#F2A900] flex items-center gap-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Nairobi Student Hotkeys</span>
              </h4>
              <p className="opacity-9 overflow-x-auto leading-relaxed">
                Hold <kbd className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">Alt</kbd> plus a number to jump straight to core features:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <span className="font-bold"><strong className="text-amber-400">Alt + 1:</strong> Opportunities</span>
                <span className="font-bold"><strong className="text-amber-400">Alt + 2:</strong> Program Blueprint</span>
                <span className="font-bold"><strong className="text-amber-400">Alt + 3:</strong> Calibration Test</span>
                <span className="font-bold"><strong className="text-amber-400">Alt + 4:</strong> Passport Generator</span>
              </div>
            </div>

            {/* Onboard diagnostic indicator */}
            <div className="p-4 rounded-lg border border-dashed flex items-center justify-between text-xs font-bold"
                 style={{ 
                   borderColor: settings.theme === 'theme-yellow-black' ? '#ffff00' : '#d1d5db',
                   backgroundColor: settings.theme === 'theme-yellow-black' ? '#000000' : 'rgba(16, 185, 129, 0.05)'
                 }}>
              <div className="space-y-1">
                <span className="opacity-80 block text-[10px] uppercase">DIAGNOSTIC CALIBRATION STATUS</span>
                <span className={isOnboardingVerified ? "text-emerald-500" : "text-amber-500"}>
                  {isOnboardingVerified ? "Verified Priority Student" : "Pending Diagnostic Sync"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleTabChange('onboarding');
                }}
                className="py-1 px-2 text-[10px] bg-[#005A9C] text-white border border-[#005A9C] rounded font-bold hover:bg-blue-700 transition-colors"
              >
                {isOnboardingVerified ? "View" : "Calibrate"}
              </button>
            </div>

          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-100 flex flex-col gap-2 text-center"
               style={{ 
                 backgroundColor: settings.theme === 'theme-yellow-black' ? '#000000' : 
                                  settings.theme === 'theme-cosmic-slate' ? '#1f2937' : '#F3F4F6',
                 borderColor: settings.theme === 'theme-yellow-black' ? '#ffff00' : '#e2e8f0'
               }}>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Aria Live Transcript stream</span>
            <div className="p-2 bg-black text-lime-400 font-mono text-[11.5px] rounded border border-slate-700 min-h-[36px] flex items-center justify-center leading-snug">
              "{ariaLiveText}"
            </div>
          </div>

        </div>
      )}
    </>
  );
}
