import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, setDoc, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { 
  LayoutGrid, 
  ShieldAlert, 
  CheckSquare, 
  Briefcase, 
  Award, 
  Milestone, 
  UserCheck, 
  Check, 
  X, 
  Volume2, 
  Ear, 
  Eye, 
  BookOpen, 
  Sparkles, 
  Copy, 
  Plus, 
  Trash2, 
  Play, 
  Home, 
  Info,
  Search,
  Sliders,
  Navigation,
  Globe,
  MapPin,
  Flame,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  Building2
} from "lucide-react";
import { proposalSections, defaultRoles, defaultSkillsPassports } from "./data/programFramework";
import { VolunteerRole, ApplicationSubmission, A11ySettings, SkillsPassport, UserProfile } from "./types";

// Mapping of Nairobi inclusive placements to corresponding verified photo galleries to represent each site
const roleImages: Record<string, string> = {
  "role-safaricom-qa": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600&h=300",
  "role-amaica-relations": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600&h=300",
  "role-hi-advocacy": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600&h=300",
  "role-usiu-ods": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600&h=300",
  "role-kise-tactile": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600&h=300",
  "role-this-ability": "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=600&h=300",
  "role-sense-international": "https://images.unsplash.com/photo-1516534775068-ba3e84589b90?auto=format&fit=crop&q=80&w=600&h=300",
  "role-cheshire-disability": "https://images.unsplash.com/photo-1508847154043-be12a72b56ff?auto=format&fit=crop&q=80&w=600&h=300",
  "role-nfdk-charity": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=300",
  "role-udpk-advocacy": "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=600&h=300"
};

// Import modular accessibility & coordinate components
import AccessibilityPanel from "./components/AccessibilityPanel";
import CommuteAdvisor from "./components/CommuteAdvisor";
import InclusiveGuidanceModal from "./components/InclusiveGuidanceModal";
import ProfilePage from "./pages/ProfilePage";

// Native Web Audio Synthesizer for accessible acoustic feedback
function playSound(type: 'beep' | 'success' | 'click' | 'error', soundEnabled: boolean) {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'click') {
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'beep') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Fail silently to prevent console chatter if blocked or unsupported
  }
}

export default function App() {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserApplications(user.uid);
        try {
          const profileDoc = await getDoc(doc(db, "users", user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
        // Reset to initial dummy data if logged out
        setSubmissions([{
          id: "usiu-cs-01",
          roleId: "role-amaica-relations",
          roleTitle: "Inclusive Hospitality Guest Relations & Accessibility Lead",
          fullName: "Almasi Mwangi",
          email: "almasi.mwangi@usiu.ac.ke",
          submissionType: "audio",
          textContent: "Simulated audio voice recording successfully transcribed: Speech pacing balanced. Confirmed 90-hour graduation community service interest with visual aid requests.",
          assistiveTech: ["Tactile Switch Navigation", "Screen Magnifier"],
          hoursCommitment: "5 hours per week",
          createdAt: "2026-06-02",
          status: "Accepted"
        }]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserApplications = async (uid: string) => {
    try {
      const q = query(collection(db, "applications"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const userSubs: ApplicationSubmission[] = [];
      querySnapshot.forEach((document) => {
        userSubs.push({ id: document.id, ...document.data() } as ApplicationSubmission);
      });
      // Sort by newest first
      userSubs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSubmissions(userSubs.length > 0 ? userSubs : []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Accessibility state presets
  // Default is "theme-cool-light" -> UNV Blue & Cream elegant contrasting default, gorgeous for sighted and low-vision alike
  const [settings, setSettings] = useState<A11ySettings>({
    theme: 'theme-cool-light',
    fontSize: 'text-normal',
    simulatedVoice: true, // Auto vocalization assist on by default
    soundCue: true
  });

  // Flow Tabs State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedProposalId, setSelectedProposalId] = useState<string>("architecture");
  const [roles, setRoles] = useState<VolunteerRole[]>(defaultRoles);
  
  // Custom submissions log
  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([
    {
      id: "usiu-cs-01",
      roleId: "role-amaica-relations",
      roleTitle: "Inclusive Hospitality Guest Relations & Accessibility Lead",
      fullName: "Almasi Mwangi",
      email: "almasi.mwangi@usiu.ac.ke",
      submissionType: "audio",
      textContent: "Simulated audio voice recording successfully transcribed: Speech pacing balanced. Confirmed 90-hour graduation community service interest with visual aid requests.",
      assistiveTech: ["Tactile Switch Navigation", "Screen Magnifier"],
      hoursCommitment: "5 hours per week",
      createdAt: "2026-06-02",
      status: "Accepted"
    }
  ]);
  const [passports, setPassports] = useState<SkillsPassport[]>(defaultSkillsPassports);

  // Search and Advanced Filters State (Nairobi)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModality, setFilterModality] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterServiceType, setFilterServiceType] = useState("all");
  const [filterDisability, setFilterDisability] = useState("all");
  const [filterOrgType, setFilterOrgType] = useState("all");
  const [filterMajor, setFilterMajor] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedRoleIds, setExpandedRoleIds] = useState<string[]>([]);

  // Multi-modal modal overlays
  const [selectedApplyRole, setSelectedApplyRole] = useState<VolunteerRole | null>(null);
  const [selectedGuidanceRole, setSelectedGuidanceRole] = useState<VolunteerRole | null>(null);

  // Form Field States for Applications
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState<'text' | 'audio' | 'video'>('text');
  const [formText, setFormText] = useState("");
  const [formTech, setFormTech] = useState<string[]>([]);
  const [formCommitment, setFormCommitment] = useState("3 hours per week");
  const [formAudioRecording, setFormAudioRecording] = useState(false);
  const [formAudioDone, setFormAudioDone] = useState(false);
  const [formVideoLink, setFormVideoLink] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form States for custom passport cert generator
  const [passportFormName, setPassportFormName] = useState("");
  const [passportFormRole, setPassportFormRole] = useState(defaultRoles[0].title);
  const [passportFormHours, setPassportFormHours] = useState("90");
  const [passportFormSkills, setPassportFormSkills] = useState("Spatial Auditing, Braille Translation Formatting, Alt-Text Structuring");
  const [passportFormFeedback, setPassportFormFeedback] = useState("Superb commitment. Jeremy finished his full 90-hour USIU obligations beautifully.");

  // Onboarding Diagnostic Simulation checks
  const [isPassedContrastTest, setIsPassedContrastTest] = useState(false);
  const [onboardingTabCount, setOnboardingTabCount] = useState(0);
  const [onboardingKeyboardComplete, setOnboardingKeyboardComplete] = useState(false);
  const [onboardingAudioTested, setOnboardingAudioTested] = useState(false);
  const [isOnboardingVerified, setIsOnboardingVerified] = useState(false);
  const [audioTestTriggered, setAudioTestTriggered] = useState(false);

  // Focus Restore References
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Screen Reader simulation Live vocal logs
  const [ariaLiveText, setAriaLiveText] = useState<string>("USIU-Africa Inclusive Volunteer Portal initialized. Defaulting to UNV Brand Light Contrast Canvas.");
  const [recentVocalizations, setRecentVocalizations] = useState<string[]>([
    "System Initialized: Welcome to the USIU-Africa Inclusive Volunteering Portal.",
    "Accessibility status: Light contrast theme active, normal text scaling selected."
  ]);

  const triggerVocalization = (announcement: string) => {
    setAriaLiveText(announcement);
    setRecentVocalizations(prev => [announcement, ...prev.slice(0, 14)]);
    
    if (settings.simulatedVoice && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.volume = 0.85;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerSound = (type: 'beep' | 'success' | 'click' | 'error') => {
    playSound(type, settings.soundCue);
  };

  // Keyboard Shortcuts (Alt + key) for Accessible Jumps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        let key = e.key.toLowerCase();
        if (key === 'd' || key === '1') {
          e.preventDefault();
          handleTabChange('dashboard');
        } else if (key === 'o' || key === '2') {
          e.preventDefault();
          handleTabChange('onboarding');
        } else if (key === 's' || key === '3') {
          e.preventDefault();
          handleTabChange('passport');
        } else if (key === 'l' || key === '4') {
          e.preventDefault();
          handleTabChange('applications');
        } else if (key === 'c') {
          e.preventDefault();
          cycleThemeShortcut();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings]);

  const handleWithdrawApplication = async (submissionId: string, roleTitle: string) => {
    try {
      // Mark as Withdrawn in Firestore if user is logged in
      if (currentUser) {
        const appRef = doc(db, "applications", submissionId);
        await updateDoc(appRef, { status: "Withdrawn" });
      }
      // Update local state
      setSubmissions(prev =>
        prev.map(s => s.id === submissionId ? { ...s, status: "Withdrawn" as const } : s)
      );
    } catch (error) {
      console.error("Error withdrawing application:", error);
      throw error;
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    triggerSound('click');
    let tabName = "";
    if (tabId === 'dashboard') tabName = "UNV-Style Nairobi Inclusive Spaces Search Hub";
    if (tabId === 'onboarding') tabName = "Diagnostic Screen Reader & Sound Sandbox";
    if (tabId === 'passport') tabName = "USIU Skills Passport hour certifier";
    if (tabId === 'applications') tabName = "My Submitted Portfolios Log";
    if (tabId === 'profile') tabName = "My Student Profile & Applications";
    
    triggerVocalization(`switched context to: ${tabName}. All commands mapped to Alt hotkeys.`);
  };

  const cycleThemeShortcut = () => {
    const themes: ('theme-cool-light' | 'theme-cosmic-slate' | 'theme-yellow-black')[] = [
      'theme-cool-light', 'theme-cosmic-slate', 'theme-yellow-black'
    ];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setSettings(prev => ({ ...prev, theme: nextTheme }));
    triggerSound('click');
    let desc = nextTheme === 'theme-cool-light' ? "Navy UNV Default" : nextTheme === 'theme-cosmic-slate' ? "Cosmic Dark Slate" : "Extreme Yellow On Black";
    triggerVocalization(`Theme adjusted to: ${desc}`);
  };

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRoleIds(prev => 
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
    triggerSound('click');
  };

  // Filter logic for Nairobi opportunities
  const filteredRoles = defaultRoles.filter(role => {
    const matchesSearch = searchQuery === "" || 
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModality = filterModality === "all" || role.modality === filterModality;
    const matchesLocation = filterLocation === "all" || role.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesServiceType = filterServiceType === "all" || role.serviceType === "Both" || role.serviceType === filterServiceType;
    const matchesDisability = filterDisability === "all" || role.supportedDisabilities.includes(filterDisability);
    const matchesOrgType = filterOrgType === "all" || role.orgType === filterOrgType;
    const matchesMajor = filterMajor === "all" || (role.majors && role.majors.includes(filterMajor));

    return matchesSearch && matchesModality && matchesLocation && matchesServiceType && matchesDisability && matchesOrgType && matchesMajor;
  });

  // Open Application dialog form
  const openApplyModal = (role: VolunteerRole, btnElement: HTMLButtonElement) => {
    triggerButtonRef.current = btnElement;
    setSelectedApplyRole(role);
    setFormName(userProfile ? userProfile.fullName : "");
    setFormEmail(userProfile ? userProfile.email : "");
    setFormText("");
    setFormVideoLink("");
    setFormTech([]);
    setFormAudioDone(false);
    setFormAudioRecording(false);
    setFormErrors({});
    triggerSound('beep');
    triggerVocalization(`Opened application form for ${role.title}. Use text transcript inputs, recorded audio streams, or folder shared storage files.`);
    
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 150);
  };

  const closeApplyModal = () => {
    setSelectedApplyRole(null);
    triggerSound('click');
    triggerVocalization("Application dialogue closed. Focus restored safely.");
    
    setTimeout(() => {
      if (triggerButtonRef.current) {
        triggerButtonRef.current.focus();
      }
    }, 100);
  };

  const toggleTechChoice = (tech: string) => {
    triggerSound('click');
    setFormTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const startSimulatedRecording = () => {
    setFormAudioRecording(true);
    setFormAudioDone(false);
    triggerSound('beep');
    triggerVocalization("Dictation mic channel active. Share your skills now. Speak into the microphone.");
    
    setTimeout(() => {
      setFormAudioRecording(false);
      setFormAudioDone(true);
      triggerSound('success');
      triggerVocalization("Transcribing speech buffer: Complete. 90-second voice intro successfully stored in submission form.");
    }, 3800);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplyRole) return;

    const errors: Record<string, string> = {};
    if (!formName.trim()) {
      errors.fullName = "Full student name is required for USIU files.";
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      errors.email = "Please supply a valid USIU or personal contact email.";
    }
    if (formType === 'text' && !formText.trim()) {
      errors.textContent = "Please draft a brief statement explaining your accommodation preferences.";
    }
    if (formType === 'audio' && !formAudioDone) {
      errors.audioContent = "Please record a voice dictation statement.";
    }
    if (formType === 'video' && (!formVideoLink.trim() || !formVideoLink.startsWith('http'))) {
      errors.videoUrl = "Please provide a valid file link (e.g., Google Drive link).";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      triggerSound('error');
      triggerVocalization("Validation failed. Review the red highlighted alert log.");
      
      const summaryDiv = document.getElementById("form-error-summary");
      if (summaryDiv) summaryDiv.focus();
      return;
    }

    const newSub: ApplicationSubmission = {
      id: "usiu-auto-" + Date.now().toString().slice(-6),
      roleId: selectedApplyRole.id,
      roleTitle: selectedApplyRole.title,
      fullName: formName,
      email: formEmail,
      submissionType: formType,
      textContent: formType === 'text' ? formText : 
                   formType === 'audio' ? "Audio verbal file verified: statement_audio_capture.mp3 (Speech transcription matches USIU compliance)." : 
                   `Drive presentation link: ${formVideoLink}`,
      assistiveTech: formTech.length > 0 ? formTech : ["No special technology specified"],
      hoursCommitment: formCommitment,
      createdAt: new Date().toISOString().split('T')[0],
      status: "In Review",
      userId: currentUser?.uid || ""
    };

    try {
      if (currentUser) {
        await setDoc(doc(collection(db, "applications"), newSub.id), newSub);
      }
      setSubmissions(prev => [newSub, ...prev]);
      triggerSound('success');
      triggerVocalization(`Congratulations ${formName}! Portfolio received for ${selectedApplyRole.title}. Host organization notified.`);
      setSelectedApplyRole(null);
    } catch (error) {
      console.error("Error saving application: ", error);
      triggerSound('error');
      triggerVocalization("Error saving application. Please try again.");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const user = userCredential.user;
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          fullName: authName,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", user.uid), newProfile);
        // Set profile immediately — onAuthStateChanged may fire before setDoc resolves
        setUserProfile(newProfile);
        triggerSound('success');
        triggerVocalization("Account created successfully. You are now logged in.");
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        triggerSound('success');
        triggerVocalization("Logged in successfully.");
      }
      setAuthModalOpen(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
    } catch (error: any) {
      setAuthError(error.message);
      triggerSound('error');
      triggerVocalization("Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      triggerSound('click');
      triggerVocalization("Logged out successfully.");
      handleTabChange('dashboard');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), userProfile);
      triggerSound('success');
      triggerVocalization("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      triggerSound('error');
      triggerVocalization("Error updating profile.");
    }
  };

  // Accepts a UserProfile directly — used by ProfilePage (not a form event handler)
  const saveProfile = async (profile: UserProfile) => {
    if (!currentUser) return;
    await setDoc(doc(db, "users", currentUser.uid), profile);
    setUserProfile(profile);
  };

  const handleAddCustomPassport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportFormName.trim()) {
      triggerSound('error');
      triggerVocalization("Please enter a student name to issue verified hours.");
      return;
    }

    const newPass: SkillsPassport = {
      id: "pass-custom-" + Date.now().toString().slice(-4),
      volunteerName: passportFormName,
      rolesCompleted: [
        {
          roleTitle: passportFormRole,
          hours: parseInt(passportFormHours) || 90,
          completionDate: new Date().toISOString().split('T')[0],
          skillsVerified: passportFormSkills.split(',').map(s => s.trim()),
          performanceIndicator: passportFormFeedback
        }
      ],
      totalHours: parseInt(passportFormHours) || 90,
      verificationId: `VERIFY-USIU-${passportFormName.replace(/\s+/g, '').toUpperCase().slice(0,6)}-2026`,
      isCustomAdded: true
    };

    setPassports(prev => [newPass, ...prev]);
    triggerSound('success');
    triggerVocalization(`Hours successfully certified! Verification Code: ${newPass.verificationId}. Letter is print-ready.`);
    setPassportFormName("");
  };

  // Typography zoom sizing helper maps
  const sizeMap = {
    'text-normal': {
      title: "text-2xl md:text-3xl font-extrabold tracking-tight",
      subtitle: "text-sm",
      body: "text-sm leading-relaxed",
      heading: "text-base md:text-lg font-bold",
      badge: "text-[11px] px-2 py-0.5",
      meta: "text-xs"
    },
    'text-large': {
      title: "text-3xl md:text-4xl font-extrabold tracking-tight",
      subtitle: "text-base font-semibold",
      body: "text-base leading-relaxed font-semibold",
      heading: "text-lg md:text-xl font-bold",
      badge: "text-xs px-2.5 py-1 font-bold",
      meta: "text-sm font-semibold"
    },
    'text-xlarge': {
      title: "text-4xl md:text-5xl font-black tracking-tight",
      subtitle: "text-lg font-bold",
      body: "text-lg md:text-xl leading-relaxed font-bold",
      heading: "text-xl md:text-2xl font-black",
      badge: "text-sm px-3 py-1.5 font-black",
      meta: "text-base font-bold"
    }
  };

  const textStyles = sizeMap[settings.fontSize];

  // Colors & Themes mappings (incorporating UNV signature palette)
  // Default structure: High contrast elegant UNV light theme
  const getThemeClass = () => {
    if (settings.theme === 'theme-cool-light') return 'bg-[#F4F7F9] text-[#1E293B] min-h-screen font-sans';
    if (settings.theme === 'theme-cosmic-slate') return 'bg-[#0B101D] text-slate-100 min-h-screen font-sans border-slate-800';
    return 'bg-black text-[#ffff00] min-h-screen font-mono border-[#ffff00]';
  };

  const getCardClass = () => {
    if (settings.theme === 'theme-cool-light') return 'bg-white border border-blue-100 rounded-xl p-6 shadow-sm transition-all hover:shadow-md';
    if (settings.theme === 'theme-cosmic-slate') return 'bg-[#151C2E] border border-slate-800 rounded-xl p-6 transition-all shadow-inner';
    return 'bg-black border-4 border-[#ffff00] p-6 rounded-none';
  };

  const getButtonClass = (variant: 'primary' | 'secondary' | 'accent' | 'danger') => {
    const isYOnB = settings.theme === 'theme-yellow-black';
    if (isYOnB) {
      if (variant === 'primary' || variant === 'accent') {
        return 'bg-[#ffff00] text-black border-4 border-[#ffff00] font-black py-3 px-5 hover:bg-black hover:text-[#ffff00] transition-colors uppercase tracking-widest text-center text-xs';
      }
      if (variant === 'danger') {
        return 'bg-black text-[#ffff00] border-4 border-[#ffff00] hover:bg-[#ffff00] hover:text-black py-3 px-5 transition-colors uppercase tracking-widest text-center text-xs';
      }
      return 'bg-black text-[#ffff00] border-2 border-[#ffff00] font-black py-2 px-4 hover:bg-[#ffff00] hover:text-black transition-colors text-xs';
    }

    if (settings.theme === 'theme-cosmic-slate') {
      if (variant === 'primary') return 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-5 rounded-lg shadow-md transition-all text-center text-xs';
      if (variant === 'accent') return 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all text-center text-xs';
      if (variant === 'danger') return 'bg-red-650 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-center text-xs';
      return 'bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-lg border border-slate-700 transition-all text-center text-xs';
    }

    // Default light UNV Brand theme (Marine Blue & Amber Gold)
    if (variant === 'primary') return 'bg-[#002F6C] hover:bg-[#005A9C] text-white font-extrabold py-3 px-6 rounded-lg shadow-sm transition-all text-center text-xs uppercase tracking-wider border-2 border-[#002F6C]';
    if (variant === 'accent') return 'bg-[#F2A900] hover:bg-amber-400 text-[#002F6C] font-black py-3 px-6 rounded-lg shadow-sm transition-all text-center text-xs uppercase tracking-wider border-2 border-[#F2A900]';
    if (variant === 'danger') return 'bg-red-600 hover:bg-red-750 text-white font-bold py-2.5 px-4 rounded-lg transition-all text-center text-xs';
    return 'bg-slate-100 hover:bg-slate-200 text-[#002F6C] font-bold py-2.5 px-5 rounded-lg border border-slate-300 transition-all text-center text-xs';
  };

  const getBorderColor = () => {
    if (settings.theme === 'theme-cool-light') return 'border-blue-100';
    if (settings.theme === 'theme-cosmic-slate') return 'border-slate-800';
    return 'border-[#ffff00] border-2';
  };

  return (
    <div className={getThemeClass()}>
      
      {/* 1. Skip to Main content access tool for screen-readers & keyboards */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-[#F2A900] focus:text-[#002F6C] focus:font-black focus:outline-none focus:ring-4 focus:ring-[#002F6C]"
        onClick={() => {
          triggerSound('click');
          triggerVocalization("Jumping menus, straight to Nairobi opportunities workspace.");
        }}
      >
        Skip to Opportunities Board
      </a>

      {/* 2. Unified Persistent Right-Side Accommodations Drawer Widget */}
      <AccessibilityPanel 
        settings={settings}
        setSettings={setSettings}
        ariaLiveText={ariaLiveText}
        triggerVocalization={triggerVocalization}
        triggerSound={triggerSound}
        isOnboardingVerified={isOnboardingVerified}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      {/* 3. Top UNV & USIU Dual Brand Header Banner */}
      <header className={`border-b ${getBorderColor()} pb-6 pt-5 px-4 md:px-8 bg-white`}>
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            
            {/* Elegant UNV-style Branding block */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#002F6C] rounded-lg text-white font-black hover:bg-[#005A9C] transition-colors" aria-hidden="true">
                <Globe className="w-8 h-8 text-[#F2A900] animate-spin" style={{ animationDuration: '30s' }} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#F2A900] text-[#002F6C] font-black text-[9px] uppercase tracking-widest rounded-sm">USIU-Africa Partner Portal</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#002F6C] mt-1 leading-none">
                  Nairobi Inclusive Spaces Placement Hub
                </h1>
                <p className="text-slate-500 text-xs font-semibold mt-1">
                  Professional Placement & Volunteering for USIU Students with Visual & Physical Impairments
                </p>
              </div>
            </div>

            {/* Quick Action: Open Accessibility Controls Guide */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Profile Icon / Login Button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    id="profile-trigger"
                    onClick={() => {
                      setProfileDropdownOpen(prev => !prev);
                      if (!profileDropdownOpen) setProfileEditMode(false);
                      triggerSound('click');
                    }}
                    className="w-9 h-9 rounded-full bg-[#002F6C] hover:bg-[#005A9C] text-white flex items-center justify-center transition-all shadow-md border-2 border-[#F2A900]"
                    aria-label="Open profile menu"
                    aria-expanded={profileDropdownOpen}
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>

                  {profileDropdownOpen && (
                    <>
                      {/* Overlay to close dropdown on outside click */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileDropdownOpen(false)}
                        aria-hidden="true"
                      />
                      <div
                        className="absolute right-0 top-11 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden"
                        role="dialog"
                        aria-label="Profile Menu"
                      >
                        {/* Header */}
                        <div className="bg-[#002F6C] px-4 py-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#F2A900] flex items-center justify-center shrink-0">
                            <UserCheck className="w-4 h-4 text-[#002F6C]" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-white font-black text-xs truncate">{userProfile?.fullName || "Student"}</p>
                            <p className="text-blue-200 text-[10px] truncate">{userProfile?.email || currentUser.email}</p>
                          </div>
                        </div>

                        {/* Profile Details */}
                        <div className="p-4 space-y-3">
                          {!profileEditMode ? (
                            <>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Full Name</p>
                                  <p className="text-sm font-bold text-[#002F6C]">{userProfile?.fullName || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                                  <p className="text-sm font-bold text-[#002F6C]">{userProfile?.email || currentUser.email}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setProfileEditMode(true)}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#002F6C] rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                              >
                                Edit Profile
                              </button>
                            </>
                          ) : (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await handleUpdateProfile(e);
                                setProfileEditMode(false);
                              }}
                              className="space-y-3"
                            >
                              <div>
                                <label htmlFor="dd-profileName" className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Name</label>
                                <input
                                  id="dd-profileName"
                                  type="text"
                                  value={userProfile?.fullName || ""}
                                  onChange={(e) => userProfile && setUserProfile({ ...userProfile, fullName: e.target.value })}
                                  required
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label htmlFor="dd-profileEmail" className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Email (read-only)</label>
                                <input
                                  id="dd-profileEmail"
                                  type="email"
                                  value={userProfile?.email || ""}
                                  readOnly
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-400 bg-slate-100 cursor-not-allowed"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="flex-1 py-2 bg-[#002F6C] hover:bg-[#005A9C] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProfileEditMode(false)}
                                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-[#002F6C] rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}

                          <hr className="border-slate-100" />
                          <button
                            onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
                            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setAuthModalOpen(true);
                    triggerSound('click');
                    triggerVocalization("Authentication modal opened.");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#002F6C] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none"
                  aria-label="Login or Sign up"
                >
                  <Users className="w-4 h-4 text-[#F2A900]" />
                  <span>Account Login</span>
                </button>
              )}

              <button 
                onClick={() => {
                  const trigger = document.getElementById("a11y-panel-trigger");
                  if (trigger) trigger.click();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#002F6C] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none"
                aria-label="Direct settings adjusters"
              >
                <Sliders className="w-4 h-4 text-[#F2A900]" />
                <span>Accommodation Controls</span>
              </button>

              <button 
                onClick={() => handleTabChange('onboarding')}
                className="px-4 py-2 bg-[#F2A900] text-[#002F6C] font-black hover:bg-amber-400 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                aria-label="Calibrate student screening logs"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isOnboardingVerified ? "✓ Calibration Verified" : "Calibrate Screen Settings"}</span>
              </button>
              <a
                href="/company"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#002F6C] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none"
                aria-label="Go to company portal"
              >
                <Building2 className="w-4 h-4 text-[#F2A900]" />
                <span>Company Portal</span>
              </a>
            </div>

          </div>

          {/* Real-time speech simulator ticker line */}
          {/* Friendly Screen Reader Audio Status Indicator */}
          <div 
            className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between text-xs transition-all"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5 font-semibold text-[#002F6C]">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Assistive Voice-Over Feedback:</span>
                <span className="text-slate-700 italic">"{ariaLiveText || "System ready. Press Alt + [1-4] to navigate sections."}"</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[10.5px] font-semibold text-[#002F6C]">
              <span>🔊 Web-Speech Enabled</span>
            </div>
          </div>

        </div>
      </header>

      {/* 4. Primary App Container */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 py-8" tabIndex={-1}>
            {/* UNV Ribbon style global tab navigation */}
        <nav aria-label="Portal Navigation" className="mb-8 select-none">
          <ul className="flex flex-wrap gap-2 border-b-2 border-[#002F6C] pb-2">
            <li>
              <button 
                onClick={() => handleTabChange('dashboard')}
                className={`px-5 py-3.5 font-bold transition-all flex items-center gap-2 border-b-4 ${
                  activeTab === 'dashboard' 
                    ? 'border-[#F2A900] text-[#002F6C] bg-white font-extrabold shadow-sm' 
                    : 'border-transparent text-slate-500 hover:text-[#002F6C]'
                } ${textStyles.body}`}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
              >
                <LayoutGrid className="w-5 h-5 text-[#005A9C]" />
                <span>Nairobi Placements Board</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('onboarding')}
                className={`px-5 py-3.5 font-bold transition-all flex items-center gap-2 border-b-4 relative ${
                  activeTab === 'onboarding' 
                    ? 'border-[#F2A900] text-[#002F6C] bg-white font-extrabold shadow-sm' 
                    : 'border-transparent text-slate-500 hover:text-[#005A9C]'
                } ${textStyles.body}`}
                aria-current={activeTab === 'onboarding' ? 'page' : undefined}
                aria-label="Calibrate Screen reader, auditory and tabbing controls"
              >
                <ShieldAlert className="w-5 h-5 text-[#005A9C]" />
                <span>Onboarding Diagnostic</span>
                {isOnboardingVerified && (
                  <span className="ml-1 px-1 bg-green-500 text-white rounded-full text-[10px] font-black" aria-label="Calibration Verified">✓</span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('passport')}
                className={`px-5 py-3.5 font-bold transition-all flex items-center gap-2 border-b-4 ${
                  activeTab === 'passport' 
                    ? 'border-[#F2A900] text-[#002F6C] bg-white font-extrabold shadow-sm' 
                    : 'border-transparent text-slate-500 hover:text-[#005A9C]'
                } ${textStyles.body}`}
                aria-current={activeTab === 'passport' ? 'page' : undefined}
              >
                <Award className="w-5 h-5 text-[#005A9C]" />
                <span>USIU Academic Hour Certifier</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('applications')}
                className={`px-5 py-3.5 font-bold transition-all flex items-center gap-2 border-b-4 ${
                  activeTab === 'applications' 
                    ? 'border-[#F2A900] text-[#002F6C] bg-white font-extrabold shadow-sm' 
                    : 'border-transparent text-slate-500 hover:text-[#005A9C]'
                } ${textStyles.body}`}
                aria-current={activeTab === 'applications' ? 'page' : undefined}
              >
                <CheckSquare className="w-5 h-5 text-[#005A9C]" />
                <span>Application Logs ({submissions.length})</span>
              </button>
            </li>

            {/* Profile tab – only visible when logged in */}
            {currentUser && (
              <li>
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`px-5 py-3.5 font-bold transition-all flex items-center gap-2 border-b-4 ${
                    activeTab === 'profile'
                      ? 'border-[#F2A900] text-[#002F6C] bg-white font-extrabold shadow-sm'
                      : 'border-transparent text-slate-500 hover:text-[#005A9C]'
                  } ${textStyles.body}`}
                  aria-current={activeTab === 'profile' ? 'page' : undefined}
                >
                  <UserCheck className="w-5 h-5 text-[#005A9C]" />
                  <span>My Profile</span>
                </button>
              </li>
            )}

          </ul>
        </nav>

        {/* ==================== TAB 1: BROWSE OPPORTUNITIES ==================== */}
        {activeTab === 'dashboard' && (
          <section aria-labelledby="roles-heading" className="space-y-6">
            
            {/* Visual Hero Banner: USIU-Africa Scenic Nairobi Campus */}
            <div className="relative w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-xs border border-blue-100 flex flex-col justify-end">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=85&w=1400&h=500" 
                alt="USIU-Africa Scenic Nairobi Campus Courtyard" 
                className="absolute inset-0 w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002F6C] via-[#002F6C]/50 to-transparent" />
              <div className="relative p-6 md:p-8 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F2A900] text-[#002F6C] font-extrabold text-[9px] uppercase tracking-widest rounded shadow-xs border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5" /> USIU-Africa Academic Partnerships
                </span>
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  Nairobi Placements Board & Opportunity Registry
                </h2>
                <p className="text-white text-xs font-semibold max-w-2xl opacity-90 leading-relaxed drop-shadow-sm">
                  Connecting undergraduate candidates of all physical, visual, and hearing backgrounds with verified inclusive company offices and community service placement partners around Nairobi (Kasarani, Westlands, and CBD).
                </p>
              </div>
            </div>

            {/* Structured 3-Step Walkthrough Journey */}
            <div className="bg-gradient-to-r from-blue-50/40 to-amber-50/40 rounded-2xl p-5 border border-slate-150 space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900] animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#002F6C]">How to find your placement in 3 steps:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white/95 shadow-xs rounded-xl border border-blue-50/50 text-[11px] font-bold text-[#002F6C] space-y-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100/80 text-[#002F6C] font-bold inline-flex items-center justify-center mb-1 text-[10px]">1</span>
                  <p className="font-extrabold text-[#002F6C]">Select Your Major</p>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Filter matches based on USIU undergraduate requirements.</p>
                </div>
                <div className="p-3 bg-white/90 shadow-xs rounded-xl border border-blue-50/50 text-[11px] font-bold text-[#002F6C] space-y-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100/80 text-[#002F6C] font-bold inline-flex items-center justify-center mb-1 text-[10px]">2</span>
                  <p className="font-extrabold text-[#002F6C]">Unfold Commute Info</p>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Check exact doors, tactile paths, and transit metrics.</p>
                </div>
                <div className="p-3 bg-white/90 shadow-xs rounded-xl border border-blue-50/50 text-[11px] font-bold text-[#002F6C] space-y-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100/80 text-[#002F6C] font-bold inline-flex items-center justify-center mb-1 text-[10px]">3</span>
                  <p className="font-extrabold text-[#002F6C]">Intake & Apply</p>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Submit reference requests or record easy audio logs.</p>
                </div>
              </div>
            </div>

            {/* Header statement with title & reset option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3 mt-4">
              <div>
                <h2 id="roles-heading" className="text-sm font-black text-[#002F6C] uppercase tracking-wider block">
                  Interactive Listings Dashboard
                </h2>
              </div>

              {/* Reset filter trigger */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterModality("all");
                  setFilterLocation("all");
                  setFilterServiceType("all");
                  setFilterDisability("all");
                  setFilterOrgType("all");
                  setFilterMajor("all");
                  triggerSound('beep');
                  triggerVocalization("All search and advanced filter fields restored to default state.");
                }}
                className="px-3 py-1.5 text-xs font-bold text-[#005A9C] hover:text-[#002F6C] border border-blue-100 hover:border-blue-200 bg-white rounded-lg transition-all"
              >
                Clear Active Filters
              </button>
            </div>

            {/* Powerful Nairobi filtering block */}
            <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#005A9C]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#002F6C]">Search and Placement Refinement</span>
                </div>
                
                {/* Advanced filter toggling action for clean view disclosure */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvancedFilters(!showAdvancedFilters);
                    triggerSound('click');
                    triggerVocalization(showAdvancedFilters ? "Advanced filters collapsed." : "Additional filter selectors unfolded.");
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#002F6C] rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all outline-none"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters (Modality, Location, Credit Type)"}</span>
                  {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Row 1: Search and USIU Majors tailoring - ALWAYS SHOWN */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Search query box */}
                  <div className="md:col-span-6 relative">
                    <label htmlFor="searchInp" className="text-[10px] font-black uppercase text-slate-500 block mb-1">Search Placements or Companies</label>
                    <div className="relative">
                      <input
                        id="searchInp"
                        type="text"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 text-xs font-bold rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        placeholder="Type keywords e.g. Safaricom, Amaica, Westlands..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          triggerVocalization(`Searching for ${e.target.value}`);
                        }}
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* USIU Major Alignment selector */}
                  <div className="md:col-span-6">
                    <label htmlFor="majorFilter" className="text-[10px] font-black uppercase text-[#005A9C] block mb-1">Align with your USIU Undergraduate Major</label>
                    <select
                      id="majorFilter"
                      aria-label="Filter by USIU-Africa Undergraduate Major"
                      className="w-full p-2.5 border-2 border-[#005A9C] text-xs font-bold rounded-lg text-slate-800 bg-white shadow-xs focus:outline-none"
                      value={filterMajor}
                      onChange={(e) => {
                        setFilterMajor(e.target.value);
                        triggerSound('click');
                        triggerVocalization(`Filtering for typical placements aligned with ${e.target.value} major.`);
                      }}
                    >
                      <option value="all">🎓 All Majors (Show Everything / Equal Opportunity)</option>
                      <option value="Applied Computer Technology (APT)">Applied Computer Technology (APT)</option>
                      <option value="Information Systems & Technology (IST)">Information Systems & Technology (IST)</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Science & Analytics">Data Science & Analytics</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="International Business Administration (IBA)">International Business Administration (IBA)</option>
                      <option value="Accounting / Finance">Accounting & Finance</option>
                      <option value="Hotel & Restaurant Management">Hotel & Restaurant Management</option>
                      <option value="Tourism Management">Tourism Management</option>
                      <option value="International Relations (IR)">International Relations (IR)</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Criminal & Forensic Studies">Criminal & Forensic Studies</option>
                      <option value="Journalism / Communication">Journalism & Communication</option>
                      <option value="Pharmacy & Health Sciences">Pharmacy & Health Sciences</option>
                    </select>
                  </div>
                </div>

                {/* Collapsible Advanced Filters Row */}
                {showAdvancedFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-dashed border-slate-100 animate-fadeIn">
                    {/* Modality */}
                    <div>
                      <label htmlFor="modalityFilter" className="text-[10px] font-black uppercase text-slate-500 block mb-1">Work Modality</label>
                      <select
                        id="modalityFilter"
                        aria-label="Work Modality"
                        className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-700 bg-white"
                        value={filterModality}
                        onChange={(e) => {
                          setFilterModality(e.target.value);
                          triggerSound('click');
                          triggerVocalization(`Modality filter adjusted to ${e.target.value}`);
                        }}
                      >
                        <option value="all">All Modalities</option>
                        <option value="Remote">Fully Remote</option>
                        <option value="Hybrid">Hybrid Workspace</option>
                        <option value="On-site">On-Site Only</option>
                      </select>
                    </div>

                    {/* Location commutes */}
                    <div>
                      <label htmlFor="locationFilter" className="text-[10px] font-black uppercase text-slate-500 block mb-1">Nairobi District</label>
                      <select
                        id="locationFilter"
                        aria-label="Commute Area in Nairobi"
                        className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-700 bg-white"
                        value={filterLocation}
                        onChange={(e) => {
                          setFilterLocation(e.target.value);
                          triggerSound('click');
                          triggerVocalization(`Location filter adjusted to ${e.target.value}`);
                        }}
                      >
                        <option value="all">All Nairobi Districts</option>
                        <option value="Kasarani">Kasarani (Near USIU)</option>
                        <option value="Westlands">Westlands Area</option>
                        <option value="Lavington">Lavington / Kilimani</option>
                      </select>
                    </div>

                    {/* Disability Accommodations Available */}
                    <div>
                      <label htmlFor="disabilityFilter" className="text-[10px] font-black uppercase text-slate-500 block mb-1">Support Features</label>
                      <select
                        id="disabilityFilter"
                        aria-label="Disability Accommodations"
                        className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-700 bg-white"
                        value={filterDisability}
                        onChange={(e) => {
                          setFilterDisability(e.target.value);
                          triggerSound('click');
                          triggerVocalization(`Accommodations focus changed to ${e.target.value}`);
                        }}
                      >
                        <option value="all">All Access Matches</option>
                        <option value="Visual Impairment">Visual Accommodations</option>
                        <option value="Physical Disability">Physical Mobility</option>
                        <option value="Hearing Impairment">Hearing Support</option>
                        <option value="Neurodiversity">Neurodiversity Pacing</option>
                      </select>
                    </div>

                    {/* USIU Credit */}
                    <div>
                      <label htmlFor="serviceFilter" className="text-[10px] font-black uppercase text-slate-500 block mb-1">Academic Credit Track</label>
                      <select
                        id="serviceFilter"
                        aria-label="USIU Credit Category"
                        className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-700 bg-white"
                        value={filterServiceType}
                        onChange={(e) => {
                          setFilterServiceType(e.target.value);
                          triggerSound('click');
                          triggerVocalization(`Credit track adjusted to ${e.target.value}`);
                        }}
                      >
                        <option value="all">All Academic Tracks</option>
                        <option value="Community Service">90-Hr Community Service</option>
                        <option value="Internship">Academic Internship</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Tag filters visual summary bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Placements Status:</span>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#005A9C] border border-blue-200 rounded text-[10.5px]">
                    {filteredRoles.length} Matching Opportunities Found
                  </span>
                  {filterModality !== "all" && <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Model: {filterModality}</span>}
                  {filterLocation !== "all" && <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Area: {filterLocation}</span>}
                  {filterDisability !== "all" && <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Support: {filterDisability}</span>}
                  {filterMajor !== "all" && <span className="bg-[#002F6C] text-white px-2 py-0.5 rounded text-[10px]">Major: {filterMajor}</span>}
                </div>
              </div>

            </div>

            {/* Positions Display Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRoles.map((role) => {
                const isExpanded = expandedRoleIds.includes(role.id);
                return (
                  <article 
                    key={role.id}
                    className={getCardClass() + " flex flex-col justify-between h-full border-t-4 transition-all hover:shadow-md"}
                    style={{ borderTopColor: '#005A9C' }}
                    aria-labelledby={`role-tab-title-${role.id}`}
                  >
                    <div className="space-y-4">
                      
                      {/* Organization visual graphic header */}
                      {roleImages[role.id] && (
                        <div className="relative w-full h-[140px] rounded-xl overflow-hidden border border-blue-50/50 shadow-xs select-none group/img">
                          <img 
                            src={roleImages[role.id]} 
                            alt={`${role.organizationName} workspace preview`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                            <span className="px-2 py-0.5 bg-[#002F6C]/90 text-white font-extrabold text-[9px] uppercase tracking-wider rounded backdrop-blur-xs shadow-xs">
                              {role.modality}
                            </span>
                            {role.usiuApproved && (
                              <span className="px-2 py-0.5 bg-emerald-700/90 text-white font-extrabold text-[9px] uppercase tracking-wider rounded backdrop-blur-xs shadow-xs">
                                ✓ Verified Path
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Organization and Title Headers */}
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <div>
                          <p className="text-xs font-bold text-[#005A9C] uppercase flex items-center gap-1">
                            <span>{role.organizationName}</span>
                            {role.usiuApproved && <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[9px] lowercase font-semibold">✓ approved placement</span>}
                          </p>
                          <h3 id={`role-tab-title-${role.id}`} className="text-md md:text-lg font-black text-[#002F6C] tracking-tight mt-1 leading-snug">
                            {role.title}
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-[#002F6C] border border-blue-200 font-bold text-[10px] uppercase rounded-sm shrink-0">
                          {role.serviceType === 'Both' ? 'Internship & CS' : role.serviceType}
                        </span>
                      </div>

                      {/* Aligned USIU Majors list (Prominent as it matches user academic track) */}
                      {role.majors && role.majors.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#005A9C] block">Best Aligned USIU Major:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {role.majors.map((major, key) => (
                              <span 
                                key={key}
                                className="bg-blue-50/70 text-[#002F6C] border border-blue-100 px-2 py-0.5 text-[10px] font-bold rounded-md inline-flex items-center gap-1"
                              >
                                <span>🎓</span> {major}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Short Description */}
                      <p className="text-xs leading-relaxed opacity-95 font-medium text-slate-705">
                        {role.description}
                      </p>

                      {/* Expandable trigger button */}
                      <button
                        type="button"
                        onClick={() => toggleRoleExpansion(role.id)}
                        className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-[#005A9C] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all outline-none"
                      >
                        <span>{isExpanded ? "Hide Requirements & Commute Guide" : "Show Requirements & Commute Guide"}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#005A9C]" /> : <ChevronDown className="w-4 h-4 text-[#005A9C]" />}
                      </button>

                      {/* Collapsible Content */}
                      {isExpanded && (
                        <div className="space-y-4 pt-2 border-t border-dashed border-slate-100 animate-fadeIn">
                          
                          {/* Accommodation tags indicators */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Accommodations Pledge Matrix:</span>
                            <div className="flex flex-wrap gap-1">
                              {role.accommodationsList.map((acc, key) => (
                                <span 
                                  key={key}
                                  className="bg-emerald-50 text-emerald-800 border border-emerald-150 px-2 py-0.5 text-[10px] font-bold rounded-sm"
                                >
                                  ✓ {acc}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Structural requirements info block */}
                          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-[11px] font-bold border border-slate-100">
                            <div>
                              <span className="opacity-75 block text-[9px] uppercase">COGNITIVE LEVEL:</span>
                              <span className="text-slate-800">{role.cognitiveEnergy} Attention</span>
                            </div>
                            <div>
                              <span className="opacity-75 block text-[9px] uppercase">PHYSICAL STRAIN:</span>
                              <span className="text-slate-800">{role.physicalEnergy} Demands</span>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-slate-100">
                              <span className="opacity-75 block text-[9px] uppercase">ESTIMATED PACING:</span>
                              <span className="text-[#005A9C] font-semibold">{role.estimatedHours}</span>
                            </div>
                          </div>

                          {/* Integrated commute routing layout helper */}
                          <div className="pt-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Transit & Commute Advisor:</span>
                            <CommuteAdvisor role={role} theme={settings.theme} />
                          </div>

                        </div>
                      )}

                    </div>

                    {/* Operational controls row (Always visible for easy access) */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGuidanceRole(role);
                          triggerSound('beep');
                          triggerVocalization(`Opened adaptability guide for ${role.organizationName}.`);
                        }}
                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#002F6C] font-bold rounded-lg text-xs transition-all uppercase tracking-wider border border-slate-200"
                      >
                        Guide to Adapt
                      </button>

                      <button
                        type="button"
                        onClick={(e) => openApplyModal(role, e.currentTarget)}
                        className={getButtonClass('primary') + " flex-1"}
                        aria-label={`Apply directly for ${role.title} at ${role.organizationName}`}
                      >
                        <span>Onboard & Apply</span>
                      </button>
                    </div>

                  </article>
                );
              })}

              {filteredRoles.length === 0 && (
                <div className="col-span-full p-12 text-center bg-white border border-dashed border-slate-300 rounded-xl space-y-3 font-semibold">
                  <p className="text-slate-500">No inclusive opportunities in Nairobi currently match your unique filter criteria.</p>
                  <p className="text-xs text-[#005A9C]">Try loosening filters or searching broader words like 'Safaricom' or 'Kasarani' for flexible remote setups.</p>
                </div>
              )}
            </div>

          </section>
        )}



        {/* ==================== TAB 3: DIAGNOSTIC ONBOARDING ==================== */}
        {activeTab === 'onboarding' && (
          <section aria-labelledby="onboard-heading" className="space-y-6">
            <div className="border-l-4 border-[#005A9C] pl-3">
              <h2 id="onboard-heading" className="text-xl md:text-2xl font-black text-[#002F6C] uppercase">
                Diagnostic Screen & Sound Calibration
              </h2>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Before commencing placement applications, test your equipment, visual zooms, and stereo headphone cues below to certify your profile status for immediate review.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Visual Adaptation Checks */}
              <div className={getCardClass() + " space-y-5"}>
                <h3 className="text-sm font-black uppercase text-[#002F6C] border-b border-blue-500 pb-2">
                  1. Visual Zoom & Contrast Legibility Calibration
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 font-medium">
                  Visually impaired students require highly responsive screen enlargement. Try clicking Layout Zoom metrics (100%, 125%, 150%) on the side widget, then confirm if paragraphs scale cleanly.
                </p>

                <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                  <p className="text-xs leading-relaxed font-semibold italic text-slate-700">
                    "I verify that typography pairings correspond to clean contrast boundaries and characters scale without causing overlapping blocks."
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPassedContrastTest(!isPassedContrastTest);
                      triggerSound('success');
                      triggerVocalization(isPassedContrastTest ? "Cancelled visual verification test." : "Visual zoom check successfully cleared!");
                    }}
                    className={`w-full py-2.5 px-4 font-bold border rounded-lg transition-all text-xs uppercase tracking-wide flex items-center justify-center gap-2 accessible-focus ${
                      isPassedContrastTest 
                        ? 'bg-emerald-900 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="w-4.5 h-4.5 rounded border border-current flex items-center justify-center font-black">
                      {isPassedContrastTest && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span>Confirm Visual Layout holds excellent legibility</span>
                  </button>
                </div>

                <h3 className="text-sm font-black uppercase text-[#002F6C] border-b border-blue-500 pb-2 pt-4">
                  2. Audio cue synchronics calibration
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 font-medium">
                  Click below to trigger a pure geometric audio frequency test. Verify if headphones transmit tones clearly to sync with automated Live speech alerts.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAudioTestTriggered(true);
                      triggerSound('success');
                      triggerVocalization("Triggering test tone. Sine wave 523 Hertz successfully transmitted to local speakers.");
                    }}
                    className="w-full py-3 px-4 bg-[#002F6C] hover:bg-[#005A9C] text-white font-extrabold uppercase tracking-wider rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Volume2 className="w-4 h-4 text-[#F2A900]" />
                    <span>Trigger Sound Frequency Test</span>
                  </button>

                  {audioTestTriggered && (
                    <div className="flex gap-2 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setOnboardingAudioTested(true);
                          triggerSound('success');
                          triggerVocalization("Auditory feedback successfully verified!");
                        }}
                        className="flex-1 py-2 px-3 bg-emerald-950 text-emerald-400 border border-emerald-500 font-bold text-xs uppercase tracking-wider text-center rounded-lg"
                      >
                        ✓ I heard tone cues clearly
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOnboardingAudioTested(false);
                          triggerSound('error');
                          triggerVocalization("Audio logged as failed. Please inspect your volume sliders.");
                        }}
                        className="flex-1 py-2 px-3 bg-red-950 text-red-400 border border-red-500 font-bold text-xs uppercase tracking-wider text-center rounded-lg"
                      >
                        ✗ Audio is not working
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Tactile Keyboard Navigation Board */}
              <div className={getCardClass() + " space-y-5"}>
                <h3 className="text-sm font-black uppercase text-[#002F6C] border-b border-blue-500 pb-2">
                  3. Keyboard focus sequence validation board
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 font-medium">
                  We verify that students with physical upper-limb limitations can map navigation blocks. Press <kbd className="bg-slate-100 px-1 py-0.5 border rounded text-slate-800 font-mono">TAB</kbd> and hit space or click nodes 1 through 4 sequentially:
                </p>

                <div className="grid grid-cols-4 gap-2.5 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        triggerSound('beep');
                        if (num === 1 && onboardingTabCount === 0) setOnboardingTabCount(1);
                        else if (num === 2 && onboardingTabCount === 1) setOnboardingTabCount(2);
                        else if (num === 3 && onboardingTabCount === 2) setOnboardingTabCount(3);
                        else if (num === 4 && onboardingTabCount === 3) {
                          setOnboardingTabCount(4);
                          setOnboardingKeyboardComplete(true);
                          triggerSound('success');
                          triggerVocalization("Excellent coordination! Pavement keyboard pathways fully calibrated.");
                        } else {
                          triggerVocalization(`Oops. Node ${num} clicked out of order. Begin with Node ${onboardingTabCount + 1}.`);
                        }
                      }}
                      className={`py-3 text-xs font-black uppercase border rounded-lg transition-all accessible-focus text-center ${
                        onboardingTabCount >= num 
                          ? 'bg-[#F2A900] text-[#002F6C] border-[#F2A900]' 
                          : 'bg-white text-slate-705 border-slate-300 hover:bg-slate-50'
                      }`}
                      aria-label={`Onboarding interactive focus node ${num}`}
                    >
                      Node {num}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-slate-900 text-[#ffff03] font-mono text-[11px] rounded-lg">
                  <p className="font-extrabold flex items-center justify-between">
                    <span>Validation Tally:</span>
                    <span>{onboardingTabCount} / 4 nodes successfully aligned</span>
                  </p>
                  <p className="opacity-80 text-[10px] mt-1 font-semibold">
                    {onboardingKeyboardComplete ? "Tabbing check successfully completed!" : "Use key commands to click nodes 1 to 4 in order."}
                  </p>
                </div>

                {/* Overarching credential verifier button */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400">Onboarding validation checklist</span>
                  
                  <div className="space-y-1.5 text-xs font-bold text-slate-600">
                    <div className="flex justify-between items-center">
                      <span>1. Visual Zoom Test Legible:</span>
                      <span className={isPassedContrastTest ? "text-emerald-600" : "text-amber-500"}>
                        {isPassedContrastTest ? "PASS" : "PENDING"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>2. Sound Calibration Frequency Sync:</span>
                      <span className={onboardingAudioTested ? "text-emerald-600" : "text-amber-500"}>
                        {onboardingAudioTested ? "PASS" : "PENDING"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>3. Keyboard Tabbing Order Confirmed:</span>
                      <span className={onboardingKeyboardComplete ? "text-emerald-600" : "text-amber-500"}>
                        {onboardingKeyboardComplete ? "PASS" : "PENDING"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!(isPassedContrastTest && onboardingAudioTested && onboardingKeyboardComplete)}
                    onClick={() => {
                      setIsOnboardingVerified(true);
                      triggerSound('success');
                      triggerVocalization("Academic calibration complete! Student profile marked as Verified on opportunities lists.");
                    }}
                    className={`w-full py-3.5 px-6 font-extrabold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 rounded-lg accessible-focus ${
                      (isPassedContrastTest && onboardingAudioTested && onboardingKeyboardComplete)
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50 border border-slate-300'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>Authorize USIU Verified Placement Badge</span>
                  </button>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* ==================== TAB 4: SKILLS PASSPORT / CERT GENERATOR ==================== */}
        {activeTab === 'passport' && (
          <section aria-labelledby="passport-heading" className="space-y-6">
            <div className="border-l-4 border-[#005A9C] pl-3">
              <h2 id="passport-heading" className="text-xl md:text-2xl font-black text-[#002F6C] uppercase">
                USIU-Africa Skills Passport Hours Certifier
              </h2>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Academic advisors from the Office of Disability Services (ODS) and coordinators use this workspace to file completed hours, generating verified credentials for resumes.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Input fields */}
              <div className="lg:col-span-5 p-5 bg-white rounded-xl border border-blue-105 shadow-sm space-y-5">
                <span className="text-xs font-black uppercase tracking-widest text-[#002F6C] block">Certify student hour logs</span>
                <p className="text-[11px] text-slate-500 leading-snug">Input evaluated hours to instantly produce a screen-reader friendly digital credential.</p>

                <form onSubmit={handleAddCustomPassport} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="passStudentName" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                      USIU Student Full Name:
                    </label>
                    <input 
                      id="passStudentName"
                      type="text"
                      className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-800"
                      placeholder="e.g. Jeremy Mutua"
                      value={passportFormName}
                      onChange={(e) => setPassportFormName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="passCompletedRole" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                      Nairobi Placement Role:
                    </label>
                    <select 
                      id="passCompletedRole"
                      className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-850"
                      value={passportFormRole}
                      onChange={(e) => setPassportFormRole(e.target.value)}
                    >
                      {defaultRoles.map((role) => (
                        <option key={role.id} value={role.title}>{role.title} ({role.organizationName})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="passHoursCount" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                        Certified Hours:
                      </label>
                      <input 
                        id="passHoursCount"
                        type="number"
                        className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-800"
                        value={passportFormHours}
                        onChange={(e) => setPassportFormHours(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="passStatusTag" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                        Verification Status:
                      </label>
                      <input
                        id="passStatusTag"
                        type="text"
                        disabled
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg text-emerald-600 cursor-not-allowed"
                        value="ODS APPROVED"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="passSkillsAcq" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                      Acquired Competencies (Comma split):
                    </label>
                    <input 
                      id="passSkillsAcq"
                      type="text"
                      className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-800"
                      value={passportFormSkills}
                      onChange={(e) => setPassportFormSkills(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="passAdvisorsNotes" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                      ODS Coordinator Commentary:
                    </label>
                    <textarea 
                      id="passAdvisorsNotes"
                      rows={2}
                      className="w-full p-2 border border-slate-300 text-xs font-bold rounded-lg text-slate-800"
                      value={passportFormFeedback}
                      onChange={(e) => setPassportFormFeedback(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className={getButtonClass('primary') + " w-full flex items-center justify-center gap-1.5 pt-3 mt-4"}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Authorize & Print Passport</span>
                  </button>
                </form>
              </div>

              {/* Display Certified Passports List */}
              <div className="lg:col-span-7 space-y-6">
                {passports.map((pass) => (
                  <article 
                    key={pass.id}
                    className="p-6 bg-white border border-blue-150 rounded-xl relative shadow-sm overflow-hidden"
                    aria-labelledby={`pass-card-name-${pass.id}`}
                  >
                    
                    {/* Visual Stamp Ribbon */}
                    <div className="absolute top-4 right-4 bg-[#002F6C] text-[#F2A900] border-2 border-[#F2A900] font-mono font-bold text-[9px] px-2.5 py-0.5 uppercase tracking-widest rounded select-none shadow-sm">
                      USIU ODS Certified
                    </div>

                    <div className="space-y-4">
                      
                      {/* Institutional header branding */}
                      <div className="flex items-center gap-2 border-b border-blue-100 pb-3">
                        <Award className="w-8 h-8 text-[#005A9C] shrink-0" />
                        <div>
                          <h4 id={`pass-card-name-${pass.id}`} className="text-sm font-black text-[#002F6C] uppercase tracking-wide">
                            INCLUSIVE PLACEMENT PASSPORT
                          </h4>
                          <p className="text-[9px] uppercase tracking-widest text-[#005A9C] font-extrabold">
                            United States International University - Africa
                          </p>
                        </div>
                      </div>

                      {/* Main statement details */}
                      <div className="space-y-2 text-xs font-semibold leading-relaxed text-slate-700">
                        <p>
                          This official record declares that <strong className="text-[#002F6C] underline">{pass.volunteerName}</strong> has logged a verified total of <strong className="text-[#005A9C] font-extrabold">{pass.totalHours} hours</strong> completing academic obligations.
                        </p>
                      </div>

                      {/* Log grid breakdown */}
                      <div className="overflow-x-auto text-[11px] font-bold py-2 border-y border-blue-100" role="table" aria-label="Placement history">
                        <div className="grid grid-cols-12 gap-2 text-slate-500 pb-1.5 border-b border-blue-105 uppercase text-[9px]">
                          <span className="col-span-7" role="columnheader">placement Assignment</span>
                          <span className="col-span-2 text-center" role="columnheader">Hours</span>
                          <span className="col-span-3 text-right" role="columnheader">Log Date</span>
                        </div>
                        {pass.rolesCompleted.map((roleInfo, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 py-2 border-b border-dashed border-slate-100 items-baseline">
                            <span className="col-span-7 font-black text-slate-755" role="cell">{roleInfo.roleTitle}</span>
                            <span className="col-span-2 text-center text-amber-600" role="cell">{roleInfo.hours} hrs</span>
                            <span className="col-span-3 text-right text-slate-500 font-mono italic" role="cell">{roleInfo.completionDate}</span>
                          </div>
                        ))}
                      </div>

                      {/* Accomplishments checklist */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-500 block">Demonstrated Skills Portfolio:</span>
                        <div className="flex flex-wrap gap-1">
                          {pass.rolesCompleted[0].skillsVerified.map((sk, skIdx) => (
                            <span 
                              key={skIdx}
                              className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[10px] font-mono font-bold"
                            >
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Coordinator recommendations check */}
                      <div className="p-3 bg-amber-50 bg-opacity-70 border-l-4 border-[#F2A900] rounded-r text-xs leading-relaxed text-[#002F6C]">
                        <span className="font-black text-[9px] uppercase tracking-wider block mb-1">ODS Evaluation commentary:</span>
                        <p className="italic font-medium">" {pass.rolesCompleted[0].performanceIndicator} "</p>
                      </div>

                      {/* Barcode security verification row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100 text-[10px] font-mono font-bold text-slate-400">
                        <span>[ USIU ODS Barcode Hash: {pass.verificationId} ]</span>
                        
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`USIU SKILLS PASSPORT - ${pass.volunteerName}\nHours completed: ${pass.totalHours}\nSystem Code: ${pass.verificationId}\nCoordinator review: ${pass.rolesCompleted[0].performanceIndicator}`);
                              triggerSound('success');
                              triggerVocalization(`Acquired student link for ${pass.volunteerName}. Copy successful.`);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#002F6C] border border-slate-250 rounded text-[10px] font-extrabold uppercase transition-all"
                          >
                            Copy resume portfolio Link
                          </button>

                          {pass.isCustomAdded && (
                            <button
                              type="button"
                              onClick={() => {
                                setPassports(prev => prev.filter(p => p.id !== pass.id));
                                triggerSound('error');
                                triggerVocalization(`Certificate for ${pass.volunteerName} removed.`);
                              }}
                              className="px-2.5 py-1 text-red-650 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-[10px] font-extrabold uppercase transition-all"
                              aria-label={`Remove cert for ${pass.volunteerName}`}
                            >
                              Delete Log
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </article>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ==================== TAB 5: REGISTERED APPLICATION LOGS ==================== */}
        {activeTab === 'applications' && (
          <section aria-labelledby="applications-heading" className="space-y-6">
            <div className="border-l-4 border-[#005A9C] pl-3">
              <h2 id="applications-heading" className="text-xl md:text-2xl font-black text-[#002F6C] uppercase">
                Active Placement Portfolios
              </h2>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Keep track of submitted internship requests, coordinator evaluation notes, and disability accessory records.
              </p>
            </div>

            <div className="space-y-4">
              {submissions.map((sub) => (
                <article key={sub.id} className={getCardClass()}>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-150 pb-3 mb-4 text-xs font-bold">
                    <div>
                      <span className="px-1.5 py-0.5 bg-slate-900 text-[#F2A900] font-mono uppercase text-[9px] rounded-sm mr-2">[ Log ID: {sub.id} ]</span>
                      <h4 className="text-sm font-black text-[#002F6C] tracking-tight inline-block mt-1 sm:mt-0">
                        {sub.roleTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="opacity-75">Status:</span>
                      <span className={`px-2.5 py-1 text-[9px] tracking-widest font-black uppercase rounded-sm border ${
                        sub.status === 'Accepted' ? 'bg-emerald-950 text-emerald-400 border-emerald-500 animate-pulse' :
                        sub.status === 'In Review' ? 'bg-blue-950 text-blue-400 border-blue-500' :
                        'bg-amber-950 text-amber-400 border-amber-500'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold text-slate-600 mb-4">
                    <div>
                      <span className="opacity-75 block text-[10px] uppercase">Student applicant:</span>
                      <span className="text-[#002F6C] font-bold text-sm block">{sub.fullName}</span>
                    </div>
                    <div>
                      <span className="opacity-75 block text-[10px] uppercase">registered Email:</span>
                      <span className="text-[#002F6C] font-semibold text-sm block">{sub.email}</span>
                    </div>
                    <div>
                      <span className="opacity-75 block text-[10px] uppercase">submission type:</span>
                      <span className="text-amber-550 capitalize text-sm block">{sub.submissionType} Format</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg text-xs leading-relaxed space-y-3 font-semibold border border-slate-100 text-slate-700">
                    <div>
                      <span className="font-bold opacity-75 block text-slate-500 uppercase tracking-widest mb-1">Portfolio Text statement:</span>
                      <p className="opacity-100 font-medium">{sub.textContent}</p>
                    </div>

                    {/* Tech details */}
                    <div>
                      <span className="font-bold opacity-75 block text-slate-500 uppercase tracking-widest mb-1">Registered Assistive Aids:</span>
                      <div className="flex flex-wrap gap-1">
                        {sub.assistiveTech.map((tech, i) => (
                          <span key={i} className="bg-slate-900 text-white border border-slate-910 px-2 py-0.5 rounded text-[10px] font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <p className="italic">Registered on {sub.createdAt}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmissions(prev => prev.filter(s => s.id !== sub.id));
                        triggerSound('error');
                        triggerVocalization(`Withdrawn placement submission ID ${sub.id}.`);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-red-650 border border-red-200 rounded text-xs transition-colors"
                    >
                      Withdraw Request
                    </button>
                  </div>

                </article>
              ))}

              {submissions.length === 0 && (
                <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-205 font-bold">
                  No active vacancy proposals currently logged in this workspace session. Select an opportunity to begin.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ==================== TAB: STUDENT PROFILE ==================== */}
        {activeTab === 'profile' && currentUser && (
          <ProfilePage
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            submissions={submissions}
            onWithdraw={handleWithdrawApplication}
            onSaveProfile={saveProfile}
            triggerSound={triggerSound}
            triggerVocalization={triggerVocalization}
            settings={settings}
          />
        )}

      </main>

      {/* ==================== THE APPLICATION FORM POPUP MODAL ==================== */}
      {selectedApplyRole && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-modal-title"
        >
          <div 
            className="bg-white border-2 border-blue-200 p-6 md:p-8 rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-5 relative shadow-2xl"
            tabIndex={-1}
          >
            {/* Header row */}
            <div className="flex justify-between items-start border-b border-blue-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#F2A900] block">placement Request Intake</span>
                <h2 id="form-modal-title" className="text-md md:text-lg font-black text-[#002F6C] tracking-tight mt-0.5">
                  Apply: {selectedApplyRole.title}
                </h2>
                <p className="text-slate-500 text-[10px] uppercase">{selectedApplyRole.organizationName} ({selectedApplyRole.location})</p>
              </div>
              <button
                type="button"
                onClick={closeApplyModal}
                className="p-1 hover:bg-slate-100 rounded-full transition-all accessible-focus"
                aria-label="Close application drawer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Application validation logs */}
            {Object.keys(formErrors).length > 0 && (
              <div 
                id="form-error-summary"
                className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs space-y-1.5 focus:outline-none"
                role="alert"
                tabIndex={0}
              >
                <span className="font-extrabold block">Please correct the following highlighted errors ({Object.keys(formErrors).length}):</span>
                <ul className="list-disc pl-5 font-semibold space-y-1">
                  {Object.values(formErrors).map((v, i) => <li key={i}>{v}</li>)}
                </ul>
              </div>
            )}

            {/* Input form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {userProfile && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-xs text-[#002F6C]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#005A9C]" />
                  <p>
                    <strong>Using Profile Defaults:</strong> We've pre-filled your application with your saved profile name and email. You can edit them below if you'd like to use different details for this specific application.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                    USIU Student Full Name: <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input 
                    ref={textInputRef}
                    id="fullName"
                    type="text"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg"
                    placeholder="e.g. Jeremy Mutua"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="emailAddress" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                    Student Email Address: <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input 
                    id="emailAddress"
                    type="email"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg"
                    placeholder="e.g. jmutua@usiu.ac.ke"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Commitment Pacing Choices */}
              <div className="space-y-1">
                <label htmlFor="formWeeklyCommit" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                  Select Pacing Structure Strategy:
                </label>
                <select 
                  id="formWeeklyCommit"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 text-xs font-bold rounded-lg"
                  value={formCommitment}
                  onChange={(e) => setFormCommitment(e.target.value)}
                >
                  <option value="5 hours per week">5 hours per week (Balanced Micro track)</option>
                  <option value="15-20 hours per week">15-20 hours per week (USIU Graduation internship obligation)</option>
                  <option value="Flexible (pacing based on visual fatigue levels)">Flexible (energy/fatigue variable pacing)</option>
                </select>
              </div>

              {/* Portfolio transmission category selectors */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black uppercase tracking-wider block text-[#002F6C]" id="formTypeRadioGroup">
                  Select Portfolio Communication Mode:
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">Choose the format that respects your visual of speech characteristics best. Text screen layouts, audio voice recording dictation, or cloud drive links are fully validated.</p>

                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="formTypeRadioGroup">
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('text');
                      triggerSound('click');
                      triggerVocalization("Traditional text feedback selected. Write your statements into the edit box below.");
                    }}
                    className={`py-2 px-3 text-xs font-extrabold uppercase rounded-lg border transition-all ${
                      formType === 'text' ? 'bg-[#002F6C] text-white border-[#002F6C]' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    1. Text Writeup
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormType('audio');
                      triggerSound('click');
                      triggerVocalization("Acoustic voice recording simulation active. Click simulator record to capture speech.");
                    }}
                    className={`py-2 px-3 text-xs font-extrabold uppercase rounded-lg border transition-all ${
                      formType === 'audio' ? 'bg-[#002F6C] text-white border-[#002F6C]' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    2. Dictation Mic
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormType('video');
                      triggerSound('click');
                      triggerVocalization("Visual folder external Drive file link active. Paste your URL into the edit box.");
                    }}
                    className={`py-2 px-3 text-xs font-extrabold uppercase rounded-lg border transition-all ${
                      formType === 'video' ? 'bg-[#002F6C] text-white border-[#002F6C]' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    3. Cloud Share
                  </button>
                </div>
              </div>

              {/* Multi-modal inputs conditional renders */}
              {formType === 'text' && (
                <div className="space-y-1">
                  <label htmlFor="formTextStatement" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                    Statement of Interest & Accommodations Guidance: <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <textarea 
                    id="formTextStatement"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg"
                    rows={4}
                    placeholder="Share how this placement aligns with your physical or sensory requirements and what modifications you require..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                  />
                </div>
              )}

              {formType === 'audio' && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <span className="text-xs font-black uppercase text-[#002F6C] block">Voice Dictation Stream Simulator</span>
                  <p className="text-[11px] text-slate-600 leading-snug">Speak clearly outlining your skills. Ideal for students with mobility restrictions or extreme visual constraints.</p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={startSimulatedRecording}
                      disabled={formAudioRecording}
                      className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                        formAudioRecording ? 'bg-red-650 text-white animate-pulse' : 'bg-slate-200 text-[#002F6C] hover:bg-slate-300'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{formAudioRecording ? "Speaking Now..." : "Simulate Mic On"}</span>
                    </button>

                    {formAudioDone && (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-350 rounded-lg font-bold text-xs">
                        ✓ Voice Dictation buffer successfully transcribing ( Length: 1:30 )
                      </span>
                    )}
                  </div>
                </div>
              )}

              {formType === 'video' && (
                <div className="space-y-1">
                  <label htmlFor="formVideoDriveLink" className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                    Direct Cloud Link (Google Drive / OneDrive / Dropbox): <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input 
                    id="formVideoDriveLink"
                    type="url"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-850 text-xs font-bold rounded-lg"
                    placeholder="e.g. https://drive.google.com/file/d/your-id-here"
                    value={formVideoLink}
                    onChange={(e) => setFormVideoLink(e.target.value)}
                  />
                  <p className="text-[9px] text-slate-400 font-semibold italic">Ensure you grant 'Anyone with Link' view access to let recruiters analyze.</p>
                </div>
              )}

              {/* Assistive technology choices */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black uppercase tracking-wider block text-slate-500">Register Assistive Technologies in Portfolio (Optional):</span>
                <p className="text-[10px] text-slate-400">Specify current accessibility aids to ensure assignments match software profiles.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["NVDA Screen Reader", "TalkBack Android Reader", "VoiceOver macOS", "Tabbing Switches", "Head-pointer inputs", "Braille Terminal"].map((tech) => {
                    const chosen = formTech.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTechChoice(tech)}
                        className={`p-2 border rounded-lg text-left transition-all text-xs font-bold flex items-center justify-between ${
                          chosen ? 'bg-amber-50 border-[#F2A900] text-[#002F6C]' : 'bg-slate-50 border-slate-300 text-slate-600'
                        }`}
                      >
                        <span>{tech}</span>
                        <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center">
                          {chosen && <Check className="w-3.5 h-3.5 text-[#002F6C]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit triggers */}
              <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={closeApplyModal}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs uppercase tracking-wider rounded-lg text-[#002F6C] text-center"
                >
                  Cancel & Return
                </button>
                <button
                  type="submit"
                  className={getButtonClass('primary') + " flex-1 font-black"}
                >
                  Authorize Intake Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================== AUTHENTICATION MODAL ==================== */}
      {authModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 id="auth-modal-title" className="text-xl font-black text-[#002F6C] uppercase tracking-tight">
                  {isSignUp ? "Create Account" : "Student Login"}
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  {isSignUp ? "Join the Nairobi Placement Registry" : "Access your registered opportunities"}
                </p>
              </div>
              <button 
                onClick={() => {
                  setAuthModalOpen(false);
                  triggerSound('click');
                  triggerVocalization("Authentication modal closed.");
                }}
                className="p-2 bg-slate-100 hover:bg-red-50 text-[#002F6C] hover:text-red-600 rounded-lg transition-colors focus:ring-2 focus:ring-[#002F6C]"
                aria-label="Close authentication form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-bold" role="alert">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="authName" className="block text-xs font-black text-[#002F6C] uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="authName"
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required={isSignUp}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="authEmail" className="block text-xs font-black text-[#002F6C] uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="authEmail"
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="authPassword" className="block text-xs font-black text-[#002F6C] uppercase tracking-wider mb-1.5">
                  Password <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="authPassword"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#002F6C] hover:bg-[#005A9C] text-white font-extrabold py-3 px-4 rounded-lg shadow-sm transition-all text-sm uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError("");
                  triggerSound('click');
                }}
                className="text-xs font-bold text-[#005A9C] hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== THE GUIDANCE ADVISOR DRAWER / MODAL ==================== */}
      <InclusiveGuidanceModal 
        role={selectedGuidanceRole || defaultRoles[0]}
        isOpen={selectedGuidanceRole !== null}
        onClose={() => setSelectedGuidanceRole(null)}
        theme={settings.theme}
      />

      {/* 5. Minimalist Accessible Print-friendly Footer */}
      <footer className="border-t pb-8 pt-8 mt-12 bg-white text-slate-500 font-bold" style={{ borderColor: getBorderColor() }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs select-none">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            <span aria-hidden="true" className="text-[#005A9C]">●</span>
            <span>USIU-Africa Nairobi Placement Registry. Styled following UNV and WCAG 2.2 AA.</span>
          </p>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="hover:underline text-[#005A9C] bg-transparent border-0 font-bold text-xs" aria-label="Format interface for print outputs">
              Print Passport Certificate
            </button>
            <span>•</span>
            <a href="#main-content" className="hover:underline text-[#002F6C]">Back to Top</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
