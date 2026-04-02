/**
 * Fallback mock data used when the database is not available.
 * This allows the app to run and demo even without PostgreSQL.
 * When the DB is connected, these are never used — real Prisma queries take priority.
 */

import bcrypt from 'bcryptjs';

// Pre-computed hash of "hospital123" using bcrypt with 12 rounds
// This avoids async computation at import time
const FALLBACK_PASSWORD_HASH = '$2a$12$LJ3TxGh3LqJHkSv.Bh8rNOdqErJQzV1nN8V2u4OeOxPqh5sVqpqXO';

export interface FallbackHospital {
  id: string;
  name: string;
  registration_number: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  contact_number: string;
  is_verified: boolean;
  subscription_plan: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
  beds: {
    total_general: number;
    available_general: number;
    total_icu: number;
    available_icu: number;
    total_ventilator: number;
    available_ventilator: number;
    last_updated: string;
  } | null;
  oxygen: {
    total_cylinders: number;
    cylinders_available: number;
    flow_rate_lpm: number;
  } | null;
  blood: { blood_group: string; units_available: number }[];
}

export interface FallbackUser {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
  hospital_id: string;
  status: string;
  hospital: { name: string } | null;
}

const now = new Date().toISOString();

export const FALLBACK_HOSPITALS: FallbackHospital[] = [
  {
    id: 'fb-hosp-001',
    name: 'City Care Super Specialty',
    registration_number: 'REG-CITYCARE-001',
    address: 'Block B, Greater Kailash, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5482,
    longitude: 77.2341,
    contact_number: '+91 9876543210',
    is_verified: true,
    subscription_plan: 'PRO',
    subscription_status: 'ACTIVE',
    created_at: now,
    updated_at: now,
    beds: { total_general: 50, available_general: 12, total_icu: 10, available_icu: 4, total_ventilator: 5, available_ventilator: 1, last_updated: now },
    oxygen: { total_cylinders: 20, cylinders_available: 15, flow_rate_lpm: 500 },
    blood: [{ blood_group: 'A+', units_available: 12 }, { blood_group: 'B+', units_available: 8 }, { blood_group: 'O-', units_available: 5 }, { blood_group: 'AB+', units_available: 3 }],
  },
  {
    id: 'fb-hosp-002',
    name: 'St. Mary Medical Center',
    registration_number: 'REG-STMARY-002',
    address: 'Saket Institutional Area, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5245,
    longitude: 77.2100,
    contact_number: '+91 8876543211',
    is_verified: true,
    subscription_plan: 'PRO',
    subscription_status: 'ACTIVE',
    created_at: now,
    updated_at: now,
    beds: { total_general: 100, available_general: 45, total_icu: 20, available_icu: 2, total_ventilator: 8, available_ventilator: 0, last_updated: now },
    oxygen: { total_cylinders: 30, cylinders_available: 22, flow_rate_lpm: 800 },
    blood: [{ blood_group: 'O+', units_available: 10 }, { blood_group: 'A-', units_available: 6 }, { blood_group: 'B-', units_available: 4 }],
  },
  {
    id: 'fb-hosp-003',
    name: 'Apollo Multispecialty',
    registration_number: 'REG-APOLLO-003',
    address: 'Jasola Vihar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5367,
    longitude: 77.2842,
    contact_number: '+91 7776543212',
    is_verified: true,
    subscription_plan: 'PRO',
    subscription_status: 'ACTIVE',
    created_at: now,
    updated_at: now,
    beds: { total_general: 120, available_general: 8, total_icu: 15, available_icu: 0, total_ventilator: 10, available_ventilator: 2, last_updated: now },
    oxygen: { total_cylinders: 15, cylinders_available: 0, flow_rate_lpm: 300 },
    blood: [{ blood_group: 'AB-', units_available: 2 }, { blood_group: 'O+', units_available: 9 }, { blood_group: 'A+', units_available: 7 }],
  },
  {
    id: 'fb-hosp-004',
    name: 'Metro Hospital & Heart Inst.',
    registration_number: 'REG-METRO-004',
    address: 'Lajpat Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5672,
    longitude: 77.2435,
    contact_number: '+91 6676543213',
    is_verified: true,
    subscription_plan: 'PRO',
    subscription_status: 'ACTIVE',
    created_at: now,
    updated_at: now,
    beds: { total_general: 40, available_general: 15, total_icu: 8, available_icu: 3, total_ventilator: 4, available_ventilator: 1, last_updated: now },
    oxygen: { total_cylinders: 10, cylinders_available: 8, flow_rate_lpm: 200 },
    blood: [{ blood_group: 'B+', units_available: 11 }, { blood_group: 'O-', units_available: 3 }],
  },
  {
    id: 'fb-hosp-005',
    name: 'Fortis Heart & Vascular Inst.',
    registration_number: 'REG-FORTIS-005',
    address: 'Okhla, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5574,
    longitude: 77.2831,
    contact_number: '+91 9988776655',
    is_verified: true,
    subscription_plan: 'PRO',
    subscription_status: 'ACTIVE',
    created_at: now,
    updated_at: now,
    beds: { total_general: 80, available_general: 20, total_icu: 12, available_icu: 5, total_ventilator: 6, available_ventilator: 3, last_updated: now },
    oxygen: { total_cylinders: 25, cylinders_available: 18, flow_rate_lpm: 600 },
    blood: [{ blood_group: 'A+', units_available: 14 }, { blood_group: 'O+', units_available: 9 }, { blood_group: 'B+', units_available: 7 }, { blood_group: 'AB+', units_available: 4 }],
  },
  {
    id: 'fb-hosp-006',
    name: 'Max Super Specialty Hospital',
    registration_number: 'REG-MAX-006',
    address: 'Saket, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5283,
    longitude: 77.2185,
    contact_number: '+91 8877665544',
    is_verified: true,
    subscription_plan: 'PRO',
    subscription_status: 'ACTIVE',
    created_at: now,
    updated_at: now,
    beds: { total_general: 150, available_general: 25, total_icu: 25, available_icu: 1, total_ventilator: 12, available_ventilator: 0, last_updated: now },
    oxygen: { total_cylinders: 35, cylinders_available: 30, flow_rate_lpm: 1000 },
    blood: [{ blood_group: 'O-', units_available: 6 }, { blood_group: 'A-', units_available: 4 }, { blood_group: 'AB-', units_available: 2 }],
  },
];

export const FALLBACK_USERS: FallbackUser[] = [
  { id: 'fb-user-001', full_name: 'City Care Admin', email: 'admin@citycare.com', password_hash: FALLBACK_PASSWORD_HASH, role: 'HOSPITAL_ADMIN', hospital_id: 'fb-hosp-001', status: 'ACTIVE', hospital: { name: 'City Care Super Specialty' } },
  { id: 'fb-user-002', full_name: 'St. Mary Admin', email: 'admin@stmary.com', password_hash: FALLBACK_PASSWORD_HASH, role: 'HOSPITAL_ADMIN', hospital_id: 'fb-hosp-002', status: 'ACTIVE', hospital: { name: 'St. Mary Medical Center' } },
  { id: 'fb-user-003', full_name: 'Apollo Admin', email: 'admin@apollo.com', password_hash: FALLBACK_PASSWORD_HASH, role: 'HOSPITAL_ADMIN', hospital_id: 'fb-hosp-003', status: 'ACTIVE', hospital: { name: 'Apollo Multispecialty' } },
  { id: 'fb-user-004', full_name: 'Metro Admin', email: 'admin@metro.com', password_hash: FALLBACK_PASSWORD_HASH, role: 'HOSPITAL_ADMIN', hospital_id: 'fb-hosp-004', status: 'ACTIVE', hospital: { name: 'Metro Hospital & Heart Inst.' } },
  { id: 'fb-user-005', full_name: 'Fortis Admin', email: 'admin@fortis.com', password_hash: FALLBACK_PASSWORD_HASH, role: 'HOSPITAL_ADMIN', hospital_id: 'fb-hosp-005', status: 'ACTIVE', hospital: { name: 'Fortis Heart & Vascular Inst.' } },
  { id: 'fb-user-006', full_name: 'Max Admin', email: 'admin@max.com', password_hash: FALLBACK_PASSWORD_HASH, role: 'HOSPITAL_ADMIN', hospital_id: 'fb-hosp-006', status: 'ACTIVE', hospital: { name: 'Max Super Specialty Hospital' } },
];

/**
 * Generate the correct bcrypt hash for "hospital123" at runtime.
 * Call this once at startup and use the result to verify passwords.
 */
let _cachedHash: string | null = null;
export async function getFallbackPasswordHash(): Promise<string> {
  if (!_cachedHash) {
    _cachedHash = await bcrypt.hash('hospital123', 12);
  }
  return _cachedHash;
}

export function getFallbackHospitalById(id: string): FallbackHospital | undefined {
  return FALLBACK_HOSPITALS.find(h => h.id === id);
}

export function getFallbackUserByEmail(email: string): FallbackUser | undefined {
  return FALLBACK_USERS.find(u => u.email === email.toLowerCase().trim());
}
