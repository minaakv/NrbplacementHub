/**
 * Company Portal Credentials
 * --------------------------
 * Source-of-truth for all organisation logins on the Nairobi Placement Hub.
 * These are ALSO seeded to Firestore under the "companies" collection by the
 * seed script (scripts/seedCompanies.ts).  Never store real secrets here in
 * production — this file is for development/demo purposes only.
 */

export interface CompanyCredential {
  /** Firestore document ID and unique login username */
  companyId: string;
  username: string;
  /** Plain-text password for seeding only – stored as bcrypt hash in prod */
  password: string;
  organizationName: string;
  /** Must match the role id(s) in programFramework.ts this company owns */
  roleIds: string[];
  orgType: 'NGO' | 'Company' | 'Restaurant' | 'Public Institution';
  location: string;
  contactEmail: string;
}

export const companyCredentials: CompanyCredential[] = [
  {
    companyId: "safaricom-plc",
    username: "safaricom.portal",
    password: "Saf@2026!Hub",
    organizationName: "Safaricom PLC",
    roleIds: ["role-safaricom-qa"],
    orgType: "Company",
    location: "Westlands, Nairobi",
    contactEmail: "inclusive@safaricom.co.ke"
  },
  {
    companyId: "amaica-restaurant",
    username: "amaica.portal",
    password: "Amaica@2026",
    organizationName: "Amaica Cultural Restaurant & Conference Centre",
    roleIds: ["role-amaica-relations"],
    orgType: "Restaurant",
    location: "Westlands, Nairobi",
    contactEmail: "hr@amaica.co.ke"
  },
  {
    companyId: "humanity-inclusion",
    username: "hi.kenya.portal",
    password: "HIKenya@2026",
    organizationName: "Humanity & Inclusion (HI) Kenya Office",
    roleIds: ["role-hi-advocacy"],
    orgType: "NGO",
    location: "Lavington, Nairobi",
    contactEmail: "kenya@hi-international.org"
  },
  {
    companyId: "usiu-ods",
    username: "usiu.ods.portal",
    password: "USIU_ODS@2026",
    organizationName: "USIU-Africa Office of Disability Services",
    roleIds: ["role-usiu-ods"],
    orgType: "Public Institution",
    location: "Kasarani, Nairobi",
    contactEmail: "ods@usiu.ac.ke"
  },
  {
    companyId: "kise-education",
    username: "kise.portal",
    password: "KISE@2026Hub",
    organizationName: "Kenya Institute of Special Education (KISE)",
    roleIds: ["role-kise-tactile"],
    orgType: "Public Institution",
    location: "Kasarani, Nairobi",
    contactEmail: "placements@kise.go.ke"
  },
  {
    companyId: "this-ability-trust",
    username: "thisability.portal",
    password: "ThisAbility@26",
    organizationName: "This Ability Trust",
    roleIds: ["role-this-ability"],
    orgType: "NGO",
    location: "Kilimani, Nairobi",
    contactEmail: "internships@thisability.org"
  },
  {
    companyId: "sense-international",
    username: "sense.kenya.portal",
    password: "Sense@Kenya26",
    organizationName: "Sense International - Kenya",
    roleIds: ["role-sense-international"],
    orgType: "NGO",
    location: "Nairobi (Off Ngong Road)",
    contactEmail: "kenya@senseinternational.org.uk"
  },
  {
    companyId: "cheshire-disability",
    username: "cheshire.portal",
    password: "Cheshire@2026",
    organizationName: "Cheshire Disability Services Kenya",
    roleIds: ["role-cheshire-disability"],
    orgType: "NGO",
    location: "Kasarani, Nairobi",
    contactEmail: "programs@cheshirekenya.org"
  },
  {
    companyId: "nfdk-charity",
    username: "nfdk.portal",
    password: "NFDK@Hub2026",
    organizationName: "National Fund for the Disabled of Kenya",
    roleIds: ["role-nfdk-charity"],
    orgType: "Public Institution",
    location: "Nairobi CBD (Reinsurance Plaza)",
    contactEmail: "grants@nfdk.go.ke"
  },
  {
    companyId: "udpk-federation",
    username: "udpk.portal",
    password: "UDPK@2026!",
    organizationName: "United Disabled Persons of Kenya (UDPK)",
    roleIds: ["role-udpk-advocacy"],
    orgType: "NGO",
    location: "Westlands, Nairobi",
    contactEmail: "hub@udpk.or.ke"
  },
  {
    companyId: "path-kenya",
    username: "path.kenya.portal",
    password: "PATH@Kenya26",
    organizationName: "PATH Kenya Office",
    roleIds: ["role-path-data"],
    orgType: "NGO",
    location: "Lavington, Nairobi",
    contactEmail: "kenya@path.org"
  },
  {
    companyId: "irc-kenya",
    username: "irc.kenya.portal",
    password: "IRC@Nairobi26",
    organizationName: "International Rescue Committee",
    roleIds: ["role-irc-humanitarian"],
    orgType: "NGO",
    location: "Kilimani, Nairobi",
    contactEmail: "internships@rescue.org"
  },
  {
    companyId: "care-international",
    username: "care.kenya.portal",
    password: "CARE@2026Hub",
    organizationName: "Care International - Kenya",
    roleIds: ["role-care-intl"],
    orgType: "NGO",
    location: "Lavington, Nairobi",
    contactEmail: "kenya@care.org"
  },
  {
    companyId: "plan-international",
    username: "plan.kenya.portal",
    password: "Plan@Kenya26",
    organizationName: "Plan International Kenya",
    roleIds: ["role-plan-intl"],
    orgType: "NGO",
    location: "Lavington, Nairobi",
    contactEmail: "kenya@plan-international.org"
  },
  {
    companyId: "inable-africa",
    username: "inable.portal",
    password: "inABLE@2026",
    organizationName: "inABLE Africa",
    roleIds: ["role-inable-accessibility"],
    orgType: "NGO",
    location: "Westlands, Nairobi",
    contactEmail: "portal@inable.org"
  },
  {
    companyId: "nairobits-trust",
    username: "nairobits.portal",
    password: "NairoBits@26",
    organizationName: "NairoBits Trust",
    roleIds: ["role-nairobits-digital"],
    orgType: "NGO",
    location: "Nairobi CBD / Ngara",
    contactEmail: "internships@nairobits.com"
  },
  {
    companyId: "tech-for-development",
    username: "t4d.portal",
    password: "T4D@Hub2026",
    organizationName: "Tech For Development",
    roleIds: ["role-t4d-social"],
    orgType: "NGO",
    location: "Kileleshwa, Nairobi",
    contactEmail: "programs@t4d.or.ke"
  },
  {
    companyId: "amnesty-kenya",
    username: "amnesty.portal",
    password: "Amnesty@26KE",
    organizationName: "Amnesty International Kenya",
    roleIds: ["role-amnesty-rights"],
    orgType: "NGO",
    location: "Kilimani, Nairobi",
    contactEmail: "kenya@amnesty.org"
  }
];
