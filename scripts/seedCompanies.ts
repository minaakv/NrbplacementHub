/**
 * scripts/seedCompanies.ts
 * ------------------------
 * One-time seed script: pushes all company credentials from
 * src/data/companyCredentials.ts into Firestore under the "companies" collection.
 *
 * Run with:
 *   npx ts-node --esm scripts/seedCompanies.ts
 *   OR (if using vite project):
 *   npx tsx scripts/seedCompanies.ts
 *
 * Requires VITE_ env vars in a .env file at project root.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { companyCredentials } from "../src/data/companyCredentials.js";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log(`\nSeeding ${companyCredentials.length} companies to Firestore...\n`);
  for (const company of companyCredentials) {
    const { password, ...safeFields } = company;
    // Store WITHOUT the plain-text password in Firestore.
    // Auth is done client-side by matching username + password against this local file.
    await setDoc(doc(db, "companies", company.companyId), {
      ...safeFields,
      createdAt: new Date().toISOString(),
    });
    console.log(`  ✓ Seeded: ${company.organizationName} [${company.companyId}]`);
  }
  console.log("\nDone! All companies seeded.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
