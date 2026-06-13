import { VolunteerRole, SkillsPassport } from "../types";

export interface ProposalSection {
  id: string;
  title: string;
  icon: string;
  summary: string;
  contentMarkdown: string;
}

export const proposalSections: ProposalSection[] = [
  {
    id: "architecture",
    title: "1. Program Architecture & Modalities",
    icon: "LayoutGrid",
    summary: "Types of remote volunteering roles and balanced task structures (micro-volunteering vs project-based) designed to accommodate energy and cognitive diversity.",
    contentMarkdown: `### 1. Program Architecture & Modalities

Remote volunteering provides an extraordinary bridge to professional opportunities, especially for individuals with disabilities. By focusing on **Universal Design (Inclusive Design)**, we accommodate diverse physical, sensory, and cognitive capacities from the ground up rather than as an afterthought.

#### A. Highly Effective Remote Volunteer Roles
The program offers specialized modalities matching different skills and technological setups:

1. **Accessibility UX & Digital Product Testers**
   * *The Work*: Volunteers test partner organizations' websites, apps, or documents, providing firsthand accessibility reports. They evaluate heading structures, forms, keyboard navigability, and screen reader announcements.
   * *Fit for visually impaired/disabled individuals*: Visually impaired assistive technology experts possess unique, expert user-level knowledge of screen readers (NVDA, JAWS, VoiceOver). This translates directly into highly valued software testing consultancies.
2. **Digital Storytellers & Document Writers**
   * *The Work*: Creating written blogs, interviewing program members, writing newsletter features, or drafting social media copy for non-profit and educational partners.
   * *Fit*: Leverages writing and creative thinking. Speech-to-text tools or braille displays make typing and text composition highly efficient and independent.
3. **Audio Description & Sound Content Editors**
   * *The Work*: Editing voice recordings, adding alt text descriptors, recording verbal transcriptions (describing silent videos for blind viewers), or trimming audio files for podcasts and audiobooks.
   * *Fit*: Visually impaired individuals often possess keen acoustic abilities, making sound editing, podcast hosting, or spoken audio narration natural avenues for high-impact participation.
4. **Virtual Mentors & Peer Support Experts**
   * *The Work*: Providing school tutoring, text-based counseling, language practice, or digital literacy support to junior learners.
   * *Fit*: Purely connection-driven, requiring only communication platforms (Zoom, Teams, Slack) using keyboard commands and screen reader shortcuts.

---

#### B. Flexible Task Structuring: Accommodating Biological & Energy Systems
To prevent burnout, physical fatigue, or neurodivergent cognitive overload, we dual-track our volunteering tasks:

* **Micro-Volunteering Track (Low Physical/Cognitive Load)**
  * *Characteristics*: Under 2 hours per task; self-contained; asynchronous; low cognitive friction.
  * *Examples*: Alt-text writing for 5 images; proofreading a short text block; running a quick keyboard accessibility check on a single web page.
  * *Aesthetic & Energy Fit*: Ideal for volunteers managing chronic illness, variable fatigue levels, or limited cognitive windows. It grants rapid gratification and builds regular, stress-free engagement.
* **Project-Based Track (Structured Professional Development)**
  * *Characteristics*: 15–40 hours over 4–8 weeks; modular milestones; collaborative; requires ongoing feedback loop.
  * *Examples*: Full accessibility audit of an organization's intake form; scripting and recording a 5-minute promo podcast; compiling an entire monthly email campaign.
  * *Career Fit*: Recreates real-world workplace workflows, teaching deadlines, file structures, and team communications. This track serves as the pillar of professional portfolio building.`
  },
  {
    id: "accessibility",
    title: "2. Accessibility-First Platform Requirements",
    icon: "ShieldAlert",
    summary: "Strict technical requirements adhering to WCAG 2.2 AA standards, ensuring full screen reader, keyboard-only, and high-contrast usability.",
    contentMarkdown: `### 2. Accessibility-First Platform Requirements

To ensure zero bar-to-entry, our platform is developed in strict accordance with **WCAG 2.2 Level AA Standards**. We consider accessibility not as an edge case, but as our core product design driver.

#### A. Essential Assistive Screen Reader Requirements (JAWS, NVDA, VoiceOver)
* **Semantic Anchor Points**: Must use direct semantic markings (\`<main>\`, \`<header>\`, \`<nav>\`, \`<section>\`, \`<aside>\`). Visually impaired screen reader users navigate by landing on these structural landmarks using hotkeys.
* **Aria-Live Dynamic Announcements**: Standard screens update content without refreshing the browser (e.g., error validations, success toast popups, opening a dialogue box). If we don't declare \`aria-live=\"polite\"\` or \`aria-live=\"assertive\"\`, blind users remain completely unaware of these changes.
* **Accessible Form Control Association**: Every single text input, file upload, or toggle switch must have its HTML \`<label>\` explicitly bound via the \`id\` parameter, allowing the screen reader to vocalize the exact field name and instructions immediately upon focus.

#### B. Rigorous Keyboard Navigation & Focus Standards
* **Visible High-Contrast Focus Indicator**: A common designer mistake is hiding outline borders (\`outline: none\`). For motor-disabled or partially sighted keyboard users, an outline is their cursor! Our portal enforces a **vivid amber outline border (4px size with an offset spacing)** so it is unmistakably highlighted.
* **Logical Tabbing Sequence**: Structural elements flow in standard left-to-right, top-to-bottom reading orders (index 0). Disordered layouts are avoided.
* **Skip to Main Content Link**: Located as the absolute first item in the HTML. Keyboard users can press \`Tab\` and press \`Enter\` to bypass the global header menu, jumping straight into the primary dashboard cards safely.

#### C. Visual Adaptability & High-Contrast Layouts
* **Sufficient Contrast Ratios**: Enforces WCAG's **4.5:1 ratio for standard text** and **7:1 ratio for enhanced readability**. 
* **Dynamic Contrast Profiles**: Offers an in-app toggle for instant theme switches: Custom Warm Light, Dark Cosmic Slate, and standard **High-Contrast Yellow-on-Black (the gold standard for extreme low-vision and tunnel vision users)**.
* **200% Text Scaling Resiliency**: Using relative sizing scale factors (\`rem\`, \`em\`, flexible CSS Gri/Flexbox) instead of rigid pixels, allowing the layout to expand cleanly without overflowing text borders or causing overlap overlap.`
  },
  {
    id: "pipeline",
    title: "3. The Application & Onboarding Pipeline",
    icon: "FileCheck",
    summary: "Inclusive, low-barrier multi-modal application workflows and structured onboarding training modules that double as assistive technology tests.",
    contentMarkdown: `### 3. The Application & Onboarding Pipeline

Traditional long, complex PDF job applications and text-heavy portals systematically filter out talented candidates with disabilities. We reconstruct this gateway.

#### A. Multi-Modal, Low-Barrier Applications
We strip away rigid formats, allowing applicants to showcase their potential using their strongest communication modality:
* **Audio Submission Support**: Users can record an audio file directly in the app or upload a verbal audio file recording of up to 3 minutes, bypassing the strain of keyboard typing.
* **Video Submission Support**: Option for applicants to paste a short cell-phone or webcam link sharing their goals.
* **Text / Rich Content**: Standard simple text form inputs that are fully compatible with speech-to-text native software.

#### B. Assistive Technology Diagnostic Onboarding
Rather than standard, dry compliance readings, the onboarding module consists of an interactive "System Configuration Verification" sandbox. This teaches the volunteer how to interact with our platform while ensuring their assistive tools are running at peak performance:

* **Step 1: Audio Cue Sync**: Triggering visual and sound prompts synchronously to calibrate screen-reading speeds and headphone balances.
* **Step 2: Interactive Focus Verification**: An interactive board where the user tabs through numbered indicators, validating that their screen-reader correctly vocalizes logical numbers.
* **Step 3: Keyboard Command Safe-Test**: Inputting simple hotkey strokes (e.g., testing \`Alt + S\` or custom navigation triggers) to verify that background application layouts do not clash with the user's host operating system system-commands.`
  },
  {
    id: "pathway",
    title: "4. Career Pathway & Skills Passport Integration",
    icon: "UserCheck",
    summary: "Securing professional advancement by translating volunteer milestones into verified job portfolios and Skill Passports.",
    contentMarkdown: `### 4. Career Pathway & Skills Passport Integration

Volunteering is highly altruistic, but for individuals facing systematic structural barriers to employment, it must serve as a launchpad for economic independence.

#### A. The verified "Skills Passport"
To replace standard unverified hour logs, the platform auto-generates a dynamic, verified **Skills Passport**. This passport structures accomplishments into categories highly valued by employers:
* **Digital Literacy & Cloud Collaboration**: Evidence of working independently with Github, Google Workspace, remote CMS systems, and digital markup tools.
* **Human-Centered UX Design & Quality Testing**: Verifies real testing hours on partner interfaces, illustrating expert-level understanding of accessibility guidelines (Section 508 / WGAG Compliance metrics).
* **Self-Governance & Remote Mastery**: Demonstrates high discipline, self-scheduling, and delivery of asynchronous task blocks.

#### B. Verified Reference Letter / Certificate Template (NGO & Corporate Standards)
The platform compiles a professional, screen-reader-compliant PDF/HTML certificate incorporating verification barcodes and a text statement structured as follows:

> **To Whom It May Concern:**
> 
> Visually impaired learners and people with disabilities represent one of the most underutilized reservoirs of technical expertise globally. 
> 
> [Volunteer Name] has successfully completed **[Total Hours] Verified Hours** of Inclusive Digital Volunteering with us. In this role, they managed critical engineering and digital design deliverables, specializing in:
> * **Assurance Testing**: Creating accessibility issue logs and performing expert user tests with screen readers.
> * **Digital Product Stewardship**: Coordinating with cross-functional project teams to deliver content audit assets.
>
> We strongly endorse [Volunteer Name] for professional roles in modern technology firms, NGOs, and public institutions where inclusive design digital operations are prioritized.`
  },
  {
    id: "roadmap",
    title: "5. Structured Implementation & Launch Roadmap",
    icon: "Milestone",
    summary: "A realistic, four-phase operational blueprint designed to co-develop, pilot, launch, and continually refine the inclusive platform.",
    contentMarkdown: `### 5. Structured Implementation & Launch Roadmap

We implement a rigorous, consultative methodology to rollout the Online Volunteering Portal, working alongside advocacy organizations representing the visually impaired.

\`\`\`
  [ Phase 1: Co-Design ] ---> [ Phase 2: Sandbox Pilot ]
                                        |
  [ Phase 4: Long-Term scale ] <--- [ Phase 3: Launch & Onboard ]
\`\`\`

#### Phase 1: Planning & Co-Design (Weeks 1-8)
* **Goal**: Establish the advisory board with 50% representation from blind and disabled youth advocates.
* **Milestones**: Consolidate primary WCAG 2.2 platform wireframes; conduct focus-group reviews of the onboarding testing sandbox; secure first batch of 5 non-profit digital partners needing UX audits or content writing.

#### Phase 2: The Sandbox Pilot (Weeks 9-16)
* **Goal**: Run a closed-beta cohort of 15 visually impaired student testers.
* **Milestones**: Refine the audio-application submission tool; fix high-contrast CSS bugs based on real low-vision feedback; finalize integration of screen reader simulators for platform administrators.

#### Phase 3: Public Launch & Intake (Weeks 17-24)
* **Goal**: Open the platform to national sign-ups, targeting 150 active volunteers.
* **Milestones**: Deploy verified Skills Passport auto-generators; launch the virtual onboarding system; host a remote "Accessibility Hackathon" where volunteers perform accelerated audits for local NGOs.

#### Phase 4: Scaling & Employment Bridges (Weeks 25+)
* **Goal**: Forge direct pathways linking top volunteers with commercial internship partners.
* **Milestones**: Integrate the "Talent Passport" API with corporate HR recruiting databases; launch a virtual career panel linking blind graduates directly to inclusive hiring managers in major tech firms and international development agencies.`
  }
];

export const defaultRoles: VolunteerRole[] = [
  {
    id: "role-safaricom-qa",
    title: "Digital Accessibility QA & Usability Auditor",
    category: "Technical & Accessibility Testing",
    description: "Audit Safaricom's client-facing mobile applications and dashboard screens using assistive screen readers (NVDA, TalkBack). You'll identify accessibility barriers in registration steps, payment processes, and diagnostic screens to ensure visual compliance.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["WCAG 2.2 Audits", "M-PESA Accessibility Hooks", "UX Issue Mapping", "Corporate Compliance Systems"],
    estimatedHours: "40 hours over 8 weeks",
    tasks: [
      "Test consumer onboarding screens purely using sequential keyboard navigation or TalkBack gestures.",
      "Document visual contrast violations using automated color inspectors and screen-magnification criteria.",
      "Submit structural bug logs outlining focus trap blocks and screen reader verbal label mismatches."
    ],
    accommodationInfo: "Highly optimized for screen-reader workflows. Periodic reviews are conducted asynchronously over written memos or structured spreadsheets. Supported by a designated Safaricom inclusive tech mentor.",
    impact: "Impacts over 22 million mobile active consumers in Kenya, allowing blind and low-vision individuals to manage financial transactions with full confidence.",
    isNew: true,
    organizationName: "Safaricom PLC",
    location: "Westlands, Nairobi",
    modality: "Remote",
    orgType: "Company",
    serviceType: "Internship",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Speech-to-text translators", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "Asynchronous (Headquarters: 14 km)",
    routeGuide: "Fully work-from-home tasks. Physical coordination sessions can be attended online. Campus-to-headquarters path follows Thika Superhighway to Waiyaki Way.",
    majors: ["Software Engineering", "Applied Computer Technology (APT)", "Information Systems & Technology (IST)", "Data Science & Analytics"]
  },
  {
    id: "role-amaica-relations",
    title: "Inclusive Hospitality Guest Relations & Accessibility Lead",
    category: "Culinary & Guest Services",
    description: "Support Amaica's service desk in organizing inclusive culinary tours, designing large-print or tactile menu structures, and advising hospitality mentors on creating supportive, highly physical step-free experiences for deaf or physically impaired patrons.",
    energyType: "Project-based",
    physicalEnergy: "Medium",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Tactile Menus Design", "Accessible Space Organization", "Inclusive Event Operations", "Customer Support"],
    estimatedHours: "90 hours (USIU-Africa Community Service requirement)",
    tasks: [
      "Review spatial flow and step-free layout pathways at the Westlands conference venue, advising on guide-dog service paths.",
      "Design large-print and high-contrast digital hospitality menu QR-codes to facilitate screen-reader ordering.",
      "Conduct soft-skills peer buddy sessions to orient newly hired physical or auditory impaired trainees."
    ],
    accommodationInfo: "On-site facility equipped with step-free entrance thresholds, spacious level dining blocks, designated quiet sensory spaces, and visual-spatial helpers.",
    impact: "Builds a highly inclusive culinary destination in Nairobi, fostering economic inclusion and proving physical hospitality venues can adapt to physical limitations seamlessly.",
    isNew: true,
    organizationName: "Amaica Cultural Restaurant & Conference Centre",
    location: "Westlands, Nairobi",
    modality: "On-site",
    orgType: "Restaurant",
    serviceType: "Community Service",
    supportedDisabilities: ["Physical Disability", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Wheelchair ramps", "Barrier-free flat thresholds", "Quiet sensory rooms", "On-site physical assistant"],
    usiuApproved: true,
    distanceFromUSIU: "16 km",
    routeGuide: "Take Matatu 44 or 145 from Kasarani to CBD, connect to Route 118 Westlands Matatu. Taxis are recommended with wheelchair luggage capacity.",
    majors: ["Hotel & Restaurant Management", "Tourism Management", "Business Administration", "International Business Administration (IBA)"]
  },
  {
    id: "role-hi-advocacy",
    title: "Disability Rights Advocacy Content Writer & Researcher",
    category: "Writing & Content Creation",
    description: "Draft high-impact advocacy updates, policy briefs, and story archives describing inclusive education pathways across East Africa. You'll transcribe audio testimonials from disabled youth and draft social campaigns.",
    energyType: "Micro-volunteering",
    physicalEnergy: "Flexible",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Advocacy Journalism", "Public Policy Synthesis", "Social Campaign Planning", "Text Transcription"],
    estimatedHours: "15 hours total (Highly modular pacing)",
    tasks: [
      "Transcribe audio interviews of primary school teachers promoting inclusive education models in Kenya.",
      "Formulate short social updates sharing policy reports, complete with descriptive context image alt-texts.",
      "Write concise 400-word newsletter profiles showcasing inclusive digital tools used in East African schools."
    ],
    accommodationInfo: "Fully digital tasks. Volunteers can dictate text using voice-to-text software or utilize refreshable braille terminals. Timelines are highly flexible with generous padding.",
    impact: "Amplifies local grassroots efforts to secure accessible classroom financing, presenting tangible evidence directly to East African community development bureaus.",
    isNew: false,
    organizationName: "Humanity & Inclusion (HI) Kenya Office",
    location: "Lavington, Nairobi",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Hearing Impairment"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Flexible pacing", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "18 km",
    routeGuide: "Hybrid position with 90% digital tasks. For physical group onboarding in Lavington, lift-equipped shuttle options can be requested from the USIU-Africa Office of Disability Services.",
    majors: ["Journalism / Communication", "International Relations (IR)", "Psychology", "Criminal & Forensic Studies"]
  },
  {
    id: "role-usiu-ods",
    title: "USIU-Africa Campus Audio-Map Guidebook Creator",
    category: "Technical & Accessibility Testing",
    description: "Help build the official USIU-Africa Campus Audio Map Handbook. You will map accessible curb-cuts, step-free shortcuts, elevator locations, and tactile markers across campus buildings, writing easy-to-follow verbal audio routes for newly incoming blind and wheelchair-using students.",
    energyType: "Project-based",
    physicalEnergy: "Medium",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Campus Accessibility Audit", "Verbal Spatial Mapping", "Peer Mentorship", "Technical Communication"],
    estimatedHours: "45 hours (Community Service / Internship track)",
    tasks: [
      "Walk/roll campus paths to verify wheelchair-ramp conditions and note any visual or physical construction obstacles.",
      "Write precise verbal directions ('From the library door, walk 10 meters forward with the tactile railing on your right to reach the Student Centre elevator').",
      "Upload recordings of routes into the USIU digital campus repository."
    ],
    accommodationInfo: "USIU-Africa's campus offers wide ramps, spacious elevators in all main blocks, and dedicated support staff located at the Student Centre office. Buddy assistants can accompany you.",
    impact: "Transforms USIU-Africa into Kenya's leading accessible university campus, drastically reducing navigational anxiety for incoming freshmen with mobility or visual needs.",
    isNew: true,
    organizationName: "USIU-Africa Office of Disability Services",
    location: "Kasarani, Nairobi",
    modality: "On-site",
    orgType: "Public Institution",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Wheelchair ramps", "Barrier-free flat thresholds", "On-site physical assistant", "Braille output devices", "Quiet sensory rooms"],
    usiuApproved: true,
    distanceFromUSIU: "0 km (On-Campus)",
    routeGuide: "Primary office located on the Ground Floor of the Student Centre. Fully step-free walkway with smooth paved stone paths.",
    majors: ["Applied Computer Technology (APT)", "Information Systems & Technology (IST)", "Software Engineering", "Psychology", "Journalism / Communication", "Criminal & Forensic Studies"]
  },
  {
    id: "role-kise-tactile",
    title: "Tactile Learning Resource Developer",
    category: "Writing & Content Creation",
    description: "Collaborate with Kenya Institute of Special Education (KISE) specialists to audit, index, and organize physical tactile maps, math boards, and sensory items. You can also research and translate standard teaching sheets into basic screen-reader friendly digital texts.",
    energyType: "Micro-volunteering",
    physicalEnergy: "Low",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Tactile Pedagogy", "Inclusive Material Architecture", "Asynchronous Lesson Plan Structuring"],
    estimatedHours: "20 hours over 4 weeks",
    tasks: [
      "Review learning materials to check if charts and graphs can be described acoustically or converted to tactile vector lines.",
      "Proofread Braille translation sheets using digital Braille character maps.",
      "Participate in online focus groups with special education teachers from around Nairobi region."
    ],
    accommodationInfo: "KISE has state-of-the-art assistive laboratories, specialized tactile output peripherals, auditory loop systems, and accessible staff bathrooms.",
    impact: "Supplies crucial classroom-enriching visual guides and materials for visually impaired primary schoolers throughout public classrooms in Nairobi.",
    isNew: false,
    organizationName: "Kenya Institute of Special Education (KISE)",
    location: "Kasarani, Nairobi",
    modality: "Hybrid",
    orgType: "Public Institution",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Physical Disability"],
    accommodationsList: ["Wheelchair ramps", "Braille output devices", "Screen-reader compatible tasks", "On-site physical assistant"],
    usiuApproved: true,
    distanceFromUSIU: "3.2 km",
    routeGuide: "KISE is located just off Kasarani Road. Tuk-tuks or local Uber rides from USIU campus take under 10 minutes and cost approximately KES 200.",
    majors: ["Psychology", "Journalism / Communication", "Applied Computer Technology (APT)"]
  },
  {
    id: "role-this-ability",
    title: "Digital Accessibility & Inclusion Intern",
    category: "Technical & Accessibility Testing",
    description: "Join a vibrant disability-led trust to test assistive tech workflows, advocate for women with disabilities in digital programs, and compile community accessibility feedback reports. This Ability Trust focuses on physical, visual, and sensory inclusion strategies.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Assistive Tech Innovation", "Web Accessibility", "Inclusive Research", "Advocacy Tech Systems"],
    estimatedHours: "90 hours (Approved USIU Community Service & Internship)",
    tasks: [
      "Review accessible mobile interface flows for digital tech projects.",
      "Create high-contrast layout feedback reports under guidance of lead program managers.",
      "Compile research on modern screen readers and tactile switches for mobile testing."
    ],
    accommodationInfo: "Offices are step-free. Support for blind users via high-volume audio guides and Braille materials. Contact: 0748 263763.",
    impact: "Empowers visually and physically impaired youth with real-world digital careers in Kenya.",
    isNew: true,
    organizationName: "This Ability Trust",
    location: "Kilimani, Nairobi (Off Ngong Road)",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Hearing Impairment"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Quiet sensory rooms", "On-site physical assistant"],
    usiuApproved: true,
    distanceFromUSIU: "17.5 km",
    routeGuide: "Board Matatu 44 to CBD, transfer to Ngong Road line. Taxi dispatch supported for peer syncs.",
    majors: ["Software Engineering", "Applied Computer Technology (APT)", "Journalism / Communication", "Psychology"]
  },
  {
    id: "role-sense-international",
    title: "Inclusive Communications & Program Support Assistant",
    category: "Writing & Content Creation",
    description: "Help draft newsletters, program reviews, and inclusive educational media to support children and youth with deafblindness and multi-sensory challenges across Kenya. Coordinate documentation and compile social outreach folders.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Deafblindness Advocacy", "Inclusive Documentation", "Accessible Media Copywriting"],
    estimatedHours: "40 hours over 8 weeks",
    tasks: [
      "Edit written success briefs ensuring screen-reader friendly formatting.",
      "Transcribe audio clips and draft clear captions for multi-sensory advocacy posts.",
      "Audit incoming project feedback reports to organize digital project trackers."
    ],
    accommodationInfo: "Accepts fully remote, flexible-pacing work with regular text briefs. Screen reader formats prioritized. Inquiries: 020 3755129.",
    impact: "Provides a critical voice and visibility for deafblind learners, advocating for inclusive educational reforms in East Africa.",
    isNew: true,
    organizationName: "Sense International - Kenya",
    location: "Nairobi (Off Ngong Road)",
    modality: "Remote",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Hearing Impairment", "Physical Disability", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Flexible pacing"],
    usiuApproved: true,
    distanceFromUSIU: "16.0 km",
    routeGuide: "Online asynchronous tasks. Visual/auditory buddy support accessible on-call for onboarding sessions.",
    majors: ["Journalism / Communication", "Psychology", "International Relations (IR)", "Applied Computer Technology (APT)"]
  },
  {
    id: "role-cheshire-disability",
    title: "Volunteer Coordinator & Program Assistant",
    category: "Writing & Content Creation",
    description: "Empower people with physical and visual disabilities by supporting local community-based rehabilitation programs. Assist the team in scheduling volunteer outreach, organizing database logs, and reviewing field reports.",
    energyType: "Project-based",
    physicalEnergy: "Medium",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Community Mobilization", "Rehabilitation Logistics", "Advocacy Program Scheduling", "Data Archival"],
    estimatedHours: "90 hours (USIU-Africa Community Service pre-approved)",
    tasks: [
      "Coordinate placement timetables for local PWD advocacy events around Nairobi.",
      "Draft clean, screen-reader-compliant spreadsheet registers of volunteer schedules.",
      "Draft call reminders to ensure community partners receive visual equipment shipments."
    ],
    accommodationInfo: "Cheshire offices feature standardized accessibility ramp thresholds, wheelchair-wide gates, and a buddy structure for on-site meetings. Hotline: 0724 637323.",
    impact: "Directly impacts thousands of children and adults seeking physical rehabilitation and assistive technologies.",
    isNew: true,
    organizationName: "Cheshire Disability Services Kenya",
    location: "Kasarani, Nairobi (Near Sports Club)",
    modality: "On-site",
    orgType: "NGO",
    serviceType: "Community Service",
    supportedDisabilities: ["Physical Disability", "Visual Impairment", "Hearing Impairment"],
    accommodationsList: ["Wheelchair ramps", "Barrier-free flat thresholds", "On-site physical assistant", "Flexible pacing"],
    usiuApproved: true,
    distanceFromUSIU: "4.5 km",
    routeGuide: "Direct taxi or tuk-tuk route from USIU Kasarani main gate is only KES 150-200. Secure paved walkways available upon arrival.",
    majors: ["Psychology", "Pharmacy & Health Sciences", "Business Administration", "International Relations (IR)"]
  },
  {
    id: "role-nfdk-charity",
    title: "Grants Administration & Research Assistant",
    category: "Writing & Content Creation",
    description: "Help analyze grant programs, process requests for assistive tools (wheelchairs, white canes, sewing machines), and draft impact stories. Work within NFDK's extensive network supporting Kenyan individuals with developmental and physical impairment challenges.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Grant Evaluation", "Disability Sector Networking", "Public Administration", "Impact Reporting"],
    estimatedHours: "45 hours over 6 weeks",
    tasks: [
      "Review request portfolios from disabled self-help groups, compiling summaries.",
      "Draft descriptive text stories highlighting beneficiaries who received mobility kits.",
      "Conduct telephone feedback sessions to document the functional safety of distributed tools."
    ],
    accommodationInfo: "Government-supported charity headquarter has level flooring, high-contrast visual signages, and physical assistants on call. Phone: 020 2251791.",
    impact: "Fosters direct community wealth-building, enabling disabled micro-entrepreneurs across Kenya to gain self-reliance.",
    isNew: true,
    organizationName: "National Fund for the Disabled of Kenya",
    location: "Nairobi CBD (Reinsurance Plaza)",
    modality: "Hybrid",
    orgType: "Public Institution",
    serviceType: "Both",
    supportedDisabilities: ["Physical Disability", "Visual Impairment", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Barrier-free flat thresholds", "Flexible remote status", "On-site physical assistant"],
    usiuApproved: true,
    distanceFromUSIU: "12.5 km",
    routeGuide: "Take Matatu 44 to CBD, alight on Moi Avenue. HQ is a 3-minute step-free walk with pedestrian guide paths.",
    majors: ["Accounting / Finance", "Business Administration", "International Business Administration (IBA)", "International Relations (IR)"]
  },
  {
    id: "role-udpk-advocacy",
    title: "Disability Policy Research & Advocacy Assistant",
    category: "Writing & Content Creation",
    description: "Help research national policy updates, write summaries of Kenya's disability acts, and assist in compiling community outreach campaign flyers. UDPK is Kenya's apex federation for organizations of persons with disabilities.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Policy Review", "Legislative Drafting Analysis", "Federation Coordinator Systems", "Disability Law"],
    estimatedHours: "90 hours (USIU Academic Internship & CS approved)",
    tasks: [
      "Summarize complex public policy initiatives into screen-reader readable text formats.",
      "Assist in developing digital surveys for blind voters to check accessibility at polling stations.",
      "Synthesize visual graphics into text write-ups for policy distribution folders."
    ],
    accommodationInfo: "Fully optimized for digital work-from-home using zoom interfaces or speech-to-text software. Dedicated peer mentorship support. Phone: 0722 126197.",
    impact: "Strengthens the civil and political rights of over 1.5 million PWDs in Kenya by feeding direct field data to policymakers.",
    isNew: true,
    organizationName: "United Disabled Persons of Kenya (UDPK)",
    location: "Westlands, Nairobi",
    modality: "Remote",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Flexible pacing", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "15.0 km",
    routeGuide: "Asynchronous tasks requiring no commute. Bi-weekly syncs are conducted over accessible Zoom calls.",
    majors: ["International Relations (IR)", "Criminal & Forensic Studies", "Journalism / Communication", "Psychology"]
  },
  {
    id: "role-path-data",
    title: "Inclusive Health Tech Research & Data Assistant",
    category: "Technical & Accessibility Testing",
    description: "Analyze global health innovations, format sensory-friendly reports, and participate in monitoring digital health access tools. Perfect for students interested in technology-for-good, data architecture, and humanitarian impact.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Health Resource Mapping", "Data Integrity", "Global NGO Protocols", "Sensory-Friendly Formatting"],
    estimatedHours: "40 hours over 8 weeks",
    tasks: [
      "Inspect digital data tables to ensure fully descriptive labels and rows for screen reader navigation.",
      "Compile literature reviews regarding digital health apps used by low-vision patients in rural clinics.",
      "Document web system errors to support programmers aiming for full WCAG healthcare web compliance."
    ],
    accommodationInfo: "PATH has visual high-contrast offices with adaptive ICT software, offering premium remote access channels. Phone: 020 3877177.",
    impact: "Improves access to vital healthcare info for marginalized families across East Africa.",
    isNew: true,
    organizationName: "PATH Kenya Office",
    location: "Lavington, Nairobi",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Internship",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Quiet sensory rooms", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "18.2 km",
    routeGuide: "Accessible rideshare packages or remote schedules available. Follows Thika Superhighway to Ring Road Westlands and James Gichuru.",
    majors: ["Pharmacy & Health Sciences", "Data Science & Analytics", "Information Systems & Technology (IST)", "Applied Computer Technology (APT)"]
  },
  {
    id: "role-irc-humanitarian",
    title: "Humanitarian Program Support & Monitoring Intern",
    category: "Writing & Content Creation",
    description: "Engage with global humanitarian program logs, formatting accessible field guides, and assisting refugee-inclusion projects. Prepares candidates for potential careers in the United Nations.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Humanitarian Case Logging", "UN-Style Report Formatting", "Program Quality Monitoring"],
    estimatedHours: "90 hours (Approved Academic Internship)",
    tasks: [
      "Format field program updates into screen-reader compliant, well-structured text templates.",
      "Create audio narration clips explaining basic educational materials for refugee youth with visual impairments.",
      "Review inclusion registers to monitor the distribution of sensory tools in refugee camps."
    ],
    accommodationInfo: "Premium digital coordinate support with a peer visual assistant. Flexible deadlines and a positive learning ecosystem. Contact: 020 2727730.",
    impact: "Assists thousands of historically excluded persons in securing humanitarian care and digital inclusion.",
    isNew: true,
    organizationName: "International Rescue Committee",
    location: "Kilimani, Nairobi (Galana Road)",
    modality: "Remote",
    orgType: "NGO",
    serviceType: "Internship",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Quiet sensory rooms", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "17.0 km",
    routeGuide: "Fully work-from-home setup. Coordinates synced weekly via Slack and accessible Teams channels.",
    majors: ["International Relations (IR)", "International Business Administration (IBA)", "Psychology"]
  },
  {
    id: "role-care-intl",
    title: "Gender & Community Projects Resource Assistant",
    category: "Writing & Content Creation",
    description: "Participate in gender-inclusion initiatives by preparing accessible training guides, reviewing community statistics, and compiling program reviews. Excellent for getting international NGO exposure.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Gender Program Logistics", "Asymmetric Project Management", "Accessible Training Design"],
    estimatedHours: "45 hours over 5 weeks",
    tasks: [
      "Audit outreach handbooks to ensure formatting allows text-to-speech reading.",
      "Synthesize group reports into plain-text summaries detailing regional program impacts.",
      "Conduct remote visual tests on Care's local educational drive repositories."
    ],
    accommodationInfo: "Flexible scheduling, visual-contrast adjustments for digital interfaces, and helpful mentor-mediated onboarding. Office contact: 020 2585381.",
    impact: "Empowers marginalized women with disabilities in achieving safety, education, and livelihood security.",
    isNew: true,
    organizationName: "Care International - Kenya",
    location: "Lavington, Nairobi",
    modality: "Remote",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Flexible pacing"],
    usiuApproved: true,
    distanceFromUSIU: "18.0 km",
    routeGuide: "No physical commuting needed. Mentors utilize email, written transcripts, and adaptive software channels.",
    majors: ["International Relations (IR)", "International Business Administration (IBA)", "Journalism / Communication"]
  },
  {
    id: "role-plan-intl",
    title: "Youth Development & Inclusive Education Intern",
    category: "Writing & Content Creation",
    description: "Support SDG-related educational programs focusing on youth development and gender equality. Assist the advocacy team by conducting database reviews and sorting inclusive education materials.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["SDG Tracking", "Inclusive Educational Methods", "Disability Outreach Logistics"],
    estimatedHours: "90 hours (Pre-approved USIU Internship)",
    tasks: [
      "Prepare large-print visual training sheets using Microsoft Word layout parameters.",
      "Review local educational dashboards for compliance with assistive technology scripts.",
      "Write youth engagement templates used for inclusive leadership workshops."
    ],
    accommodationInfo: "Offices are step-free. Screen reader guides are embedded, along with helpful staff and on-site companion coordination. Contact: 0792 692006.",
    impact: "Ensures visual and physical constraints don't stop youth from taking charge of educational development.",
    isNew: true,
    organizationName: "Plan International Kenya",
    location: "Lavington, Nairobi",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Internship",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Neurodiversity"],
    accommodationsList: ["Wheelchair ramps", "Screen-reader compatible tasks", "Flexible remote status", "On-site physical assistant"],
    usiuApproved: true,
    distanceFromUSIU: "18.0 km",
    routeGuide: "Take Matatu 44 to CBD, connect to Kawangware Matatu via Lavington. Accessible parking stalls available on campus.",
    majors: ["Psychology", "International Relations (IR)", "Journalism / Communication"]
  },
  {
    id: "role-amnesty-rights",
    title: "Human Rights & Disability Advocacy Intern",
    category: "Writing & Content Creation",
    description: "Collaborate on high-profile human rights campaigns, perform policy research on disability rights legislation in Kenya, and write accessible campaign materials. Highly respected advocacy experience.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Human Rights Law Foundations", "Advocacy Writing", "Policy Synthesis", "Legal Communication"],
    estimatedHours: "90 hours (Approved USIU Community Service & Internship)",
    tasks: [
      "Audit public advocacy PDFs to compile fully searchable, screen-reader-compliant DOCX text counterparts.",
      "Synthesize physical court transcripts regarding disability litigation into brief written summaries.",
      "Draft high-contrast informational web articles for international human rights day."
    ],
    accommodationInfo: "Fully optimized digital environment. Keyboard navigation controls and custom software setup supported enthusiastically. Hotline: 0759 464346.",
    impact: "Protects the civil rights of vulnerable groups, ensuring that Kenyan laws execute visual and physical inclusion metrics.",
    isNew: true,
    organizationName: "Amnesty International Kenya",
    location: "Kilimani, Nairobi (Ring Road)",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Hearing Impairment", "Physical Disability", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Quiet sensory rooms", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "16.5 km",
    routeGuide: "Hybrid workspace. Physical meeting space is equipped with wide ramps and wide-door restrooms.",
    majors: ["Criminal & Forensic Studies", "International Relations (IR)", "Journalism / Communication"]
  },
  {
    id: "role-inable-accessibility",
    title: "Digital Accessibility & Assistive Tech Specialist",
    category: "Technical & Accessibility Testing",
    description: "Directly assist in empowering visually impaired youth in Kenya through ICT. Review screen-reader training files, assist in software accessibility checks, and support the build of adaptive computer lab interfaces.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Assistive Tech Instruction", "Screen-Reader Auditing", "Inclusive Web Engineering", "Braille-ICT Systems"],
    estimatedHours: "90 hours (Highly pre-approved for USIU Computer/Software Students)",
    tasks: [
      "Create digital accessibility guide modules for blind youth learning python or HTML.",
      "Run user compatibility tests using JAWS/NVDA on cloud learning tools.",
      "Develop high-contrast accessible layout templates for digital training workshops."
    ],
    accommodationInfo: "A premier disability-inclusion leader in Africa. Fully integrated tactile signs, braille note-takers, auditory screen readers, and adaptive technology coaches on-site.",
    impact: "Empowers visually impaired students with digital skills, breaking the cycle of digital isolation in Africa.",
    isNew: true,
    organizationName: "inABLE Africa",
    location: "Westlands, Nairobi",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Braille output devices", "Flexible remote status", "On-site physical assistant", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "14.2 km",
    routeGuide: "Accessible via Westlands commercial bus lines. Direct corporate coordination available for inclusive shuttle services.",
    majors: ["Software Engineering", "Applied Computer Technology (APT)", "Information Systems & Technology (IST)", "Data Science & Analytics"]
  },
  {
    id: "role-nairobits-digital",
    title: "Digital Skills Educational Mentor & Assistant",
    category: "Technical & Accessibility Testing",
    description: "Support youth empowerment through technology by assisting in digital design workshops, checking lesson file accessibility, and providing remote mentorship for junior multimedia students. Pre-approved for IT/Comms track.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "Medium",
    skillsAcquired: ["Digital Literacy Instruction", "Accessible Design Principles", "Community Mentorship"],
    estimatedHours: "45 hours over 6 weeks",
    tasks: [
      "Audit multimedia design modules for color contrast and text alternative checks.",
      "Review incoming student portfolios to log feedback sheets using screen-magnification helpers.",
      "Provide text-chat based academic support to tech students with physical limitations."
    ],
    accommodationInfo: "Accessible office with physical step-free entries and supportive tutors. Adaptive design principles actively trained in other programs. Hotline: 0797 561818.",
    impact: "Bridges the digital divide, equipping needy youth with lucrative programming and multimedia jobs.",
    isNew: true,
    organizationName: "NairoBits Trust",
    location: "Nairobi CBD / Ngara",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Both",
    supportedDisabilities: ["Physical Disability", "Visual Impairment", "Hearing Impairment", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Barrier-free flat thresholds", "Flexible remote status", "Quiet sensory rooms"],
    usiuApproved: true,
    distanceFromUSIU: "11.5 km",
    routeGuide: "Short commute path to Ngara. Fully step-free training labs inside the complex building.",
    majors: ["Applied Computer Technology (APT)", "Information Systems & Technology (IST)", "Software Engineering", "Journalism / Communication"]
  },
  {
    id: "role-t4d-social",
    title: "Technology-for-Good Project Management Assistant",
    category: "Technical & Accessibility Testing",
    description: "Coordinate technology-for-good programs, research social impact initiatives, and draft inclusive training files. Excellent fit for students wanting to combine project management with digital innovation.",
    energyType: "Project-based",
    physicalEnergy: "Low",
    cognitiveEnergy: "High",
    skillsAcquired: ["Social Impact Metrics", "Agile Inclusion Frameworks", "Inclusive Digital Training Coordination"],
    estimatedHours: "90 hours (USIU Academic Internship accredited)",
    tasks: [
      "Prepare dynamic program templates with screen-reader friendly formatting.",
      "Conduct user satisfaction surveys over remote audio formats for charity projects.",
      "Log and track software quality bug files for accessible mobile learning apps."
    ],
    accommodationInfo: "T4D offers premium digital collaboration interfaces. Level floor spaces, adaptive screen readers, and adjustable desk configurations. Contact: 0790 824179.",
    impact: "Empowers East African community leaders to deploy tech-for-good solutions directly combating extreme poverty and visual isolation.",
    isNew: true,
    organizationName: "Tech For Development",
    location: "Kileleshwa, Nairobi",
    modality: "Hybrid",
    orgType: "NGO",
    serviceType: "Internship",
    supportedDisabilities: ["Visual Impairment", "Physical Disability", "Neurodiversity"],
    accommodationsList: ["Screen-reader compatible tasks", "Flexible remote status", "Quiet sensory rooms", "Adaptive software support"],
    usiuApproved: true,
    distanceFromUSIU: "15.8 km",
    routeGuide: "Bi-weekly hybrid attendance. Easily navigated lanes from Thika Superhighway to Ring Road and Kileleshwa.",
    majors: ["Software Engineering", "Applied Computer Technology (APT)", "Information Systems & Technology (IST)", "Business Administration"]
  }
];

export const defaultSkillsPassports: SkillsPassport[] = [
  {
    id: "passport-1",
    volunteerName: "Jeremy Mutua",
    rolesCompleted: [
      {
        roleTitle: "Digital Accessibility Champion - Safaricom PLC",
        hours: 40,
        completionDate: "2026-05-30",
        skillsVerified: ["WCAG 2.2 Auditing", "TalkBack Usability Testing", "Report Writing"],
        performanceIndicator: "Outstanding analytical work. Jeremy discovered 8 visual contrast traps and helped redesign M-PESA onboarding screens."
      },
      {
        roleTitle: "USIU-Africa Campus Audio-Map Creator",
        hours: 50,
        completionDate: "2026-06-02",
        skillsVerified: ["Spatial Navigation Writing", "Community Audits", "Physical Risk Assessment"],
        performanceIndicator: "Highly detailed coordinates, compiling 5 major campus wheelchair-accessible routes."
      }
    ],
    totalHours: 90,
    verificationId: "VERIFY-USIU-JEREMY-2026"
  },
  {
    id: "passport-2",
    volunteerName: "Almasi Mwangi",
    rolesCompleted: [
      {
        roleTitle: "Hospitality Liaison - Amaica Cultural Restaurant",
        hours: 90,
        completionDate: "2026-05-15",
        skillsVerified: ["Inclusive Service Logistics", "Large-Print Menu Structuring", "Auditory Buddy Guides"],
        performanceIndicator: "Completed full 90-hour USIU community service obligation beautifully. Superb customer care advocacy."
      }
    ],
    totalHours: 90,
    verificationId: "VERIFY-USIU-ALMASI-44810"
  }
];
