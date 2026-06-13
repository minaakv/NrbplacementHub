export type EnergyType = 'Micro-volunteering' | 'Project-based';
export type EnergyLevel = 'Low' | 'Medium' | 'High' | 'Flexible';

export interface VolunteerRole {
  id: string;
  title: string;
  category: string;
  description: string;
  energyType: EnergyType;
  physicalEnergy: EnergyLevel;
  cognitiveEnergy: EnergyLevel;
  skillsAcquired: string[];
  estimatedHours: string;
  tasks: string[];
  accommodationInfo: string;
  impact: string;
  isNew?: boolean;
  
  // USIU-Africa Nairobi Expansion Fields
  organizationName: string;
  location: string; 
  modality: 'Remote' | 'On-site' | 'Hybrid';
  orgType: 'NGO' | 'Company' | 'Restaurant' | 'Public Institution';
  serviceType: 'Community Service' | 'Internship' | 'Both';
  supportedDisabilities: string[];
  accommodationsList: string[];
  usiuApproved: boolean;
  distanceFromUSIU?: string; // Estimated distance from Kasarani Campus e.g. "3.5 km", "12 km"
  routeGuide?: string; // Bus route guide or accessible transport note
  majors?: string[]; // Aligned USIU-Africa undergraduate majors
}

export interface ApplicationSubmission {
  id: string;
  roleId: string;
  roleTitle: string;
  fullName: string;
  email: string;
  submissionType: 'text' | 'audio' | 'video';
  textContent: string;
  audioDuration?: string;
  videoUrl?: string;
  assistiveTech: string[];
  hoursCommitment: string;
  createdAt: string;
  status: 'Received' | 'In Review' | 'Accepted';
}

export interface A11ySettings {
  theme: 'theme-cool-light' | 'theme-cosmic-slate' | 'theme-yellow-black';
  fontSize: 'text-normal' | 'text-large' | 'text-xlarge';
  simulatedVoice: boolean;
  soundCue: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  instruction: string;
  testType: 'focus' | 'input' | 'audio';
  isPassed: boolean;
}

export interface SkillsPassport {
  id: string;
  volunteerName: string;
  rolesCompleted: {
    roleTitle: string;
    hours: number;
    completionDate: string;
    skillsVerified: string[];
    performanceIndicator: string;
  }[];
  totalHours: number;
  verificationId: string;
  isCustomAdded?: boolean;
}
