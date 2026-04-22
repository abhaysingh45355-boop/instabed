import { randomUUID } from 'crypto';
import { FALLBACK_HOSPITALS, type FallbackHospital } from './fallback-data';

type BedRecord = {
  total_general: number;
  available_general: number;
  total_icu: number;
  available_icu: number;
  total_ventilator: number;
  available_ventilator: number;
  last_updated: string;
  updated_by?: string | null;
};

type OxygenRecord = {
  total_cylinders: number;
  cylinders_available: number;
  flow_rate_lpm: number;
  pipeline_status: boolean;
  last_updated: string;
  updated_by?: string | null;
};

type BloodRecord = {
  blood_group: string;
  units_available: number;
  last_updated: string;
  updated_by?: string | null;
};

export type HospitalRecord = {
  id: string;
  name: string;
  registration_number: string;
  address: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  contact_number: string;
  is_verified: boolean;
  subscription_plan: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
  beds: BedRecord | null;
  oxygen: OxygenRecord | null;
  blood: BloodRecord[];
};

type HospitalInput = Partial<HospitalRecord> & {
  beds?: any;
  oxygen?: any;
  blood?: any;
};

type SupplyInput = {
  beds?: {
    general?: { total?: number; available?: number };
    icu?: { total?: number; available?: number };
    ventilator?: { total?: number; available?: number };
  } | null;
  oxygen?: {
    cylinders?: number;
    available?: number;
    litersPerMin?: number;
  } | null;
  blood?: Record<string, number> | null;
  updatedBy?: string | null;
};

const hospitals = new Map<string, HospitalRecord>();
const registrationNumbers = new Set<string>();

function nowIso() {
  return new Date().toISOString();
}

function cloneBeds(beds: BedRecord | null | undefined): BedRecord | null {
  if (!beds) return null;
  return { ...beds };
}

function cloneOxygen(oxygen: OxygenRecord | null | undefined): OxygenRecord | null {
  if (!oxygen) return null;
  return { ...oxygen };
}

function cloneBlood(blood: BloodRecord[] | undefined): BloodRecord[] {
  return (blood ?? []).map((entry) => ({ ...entry }));
}

function toBedRecord(value: any, updatedBy: string | null = null): BedRecord | null {
  if (value == null) return null;
  return {
    total_general: Number(value.total_general ?? 0),
    available_general: Number(value.available_general ?? 0),
    total_icu: Number(value.total_icu ?? 0),
    available_icu: Number(value.available_icu ?? 0),
    total_ventilator: Number(value.total_ventilator ?? 0),
    available_ventilator: Number(value.available_ventilator ?? 0),
    last_updated: value.last_updated ? String(value.last_updated) : nowIso(),
    updated_by: value.updated_by ?? updatedBy,
  };
}

function toOxygenRecord(value: any, updatedBy: string | null = null): OxygenRecord | null {
  if (value == null) return null;
  return {
    total_cylinders: Number(value.total_cylinders ?? value.cylinders ?? 0),
    cylinders_available: Number(value.cylinders_available ?? value.available ?? 0),
    flow_rate_lpm: Number(value.flow_rate_lpm ?? value.litersPerMin ?? 0),
    pipeline_status: Boolean(value.pipeline_status ?? true),
    last_updated: value.last_updated ? String(value.last_updated) : nowIso(),
    updated_by: value.updated_by ?? updatedBy,
  };
}

function toBloodRecords(value: any, updatedBy: string | null = null): BloodRecord[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .filter((entry) => entry && entry.blood_group)
      .map((entry) => ({
        blood_group: String(entry.blood_group),
        units_available: Number(entry.units_available ?? 0),
        last_updated: entry.last_updated ? String(entry.last_updated) : nowIso(),
        updated_by: entry.updated_by ?? updatedBy,
      }));
  }

  return Object.entries(value).map(([bloodGroup, units]) => ({
    blood_group: bloodGroup,
    units_available: Number(units ?? 0),
    last_updated: nowIso(),
    updated_by: updatedBy,
  }));
}

function cloneHospital(hospital: HospitalRecord): HospitalRecord {
  return {
    ...hospital,
    beds: cloneBeds(hospital.beds),
    oxygen: cloneOxygen(hospital.oxygen),
    blood: cloneBlood(hospital.blood),
  };
}

function normalizeHospital(input: HospitalInput, existing?: HospitalRecord): HospitalRecord {
  const now = nowIso();
  const id = existing?.id ?? input.id ?? randomUUID();
  const registrationNumber = String(input.registration_number ?? existing?.registration_number ?? '').trim();

  if (!existing) {
    const requiredFields = ['name', 'registration_number', 'address', 'city', 'state', 'contact_number'] as const;
    for (const field of requiredFields) {
      const value = input[field];
      if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  return {
    id,
    name: String(input.name ?? existing?.name ?? '').trim(),
    registration_number: registrationNumber,
    address: String(input.address ?? existing?.address ?? '').trim(),
    city: String(input.city ?? existing?.city ?? '').trim(),
    state: String(input.state ?? existing?.state ?? '').trim(),
    latitude: input.latitude ?? existing?.latitude ?? null,
    longitude: input.longitude ?? existing?.longitude ?? null,
    contact_number: String(input.contact_number ?? existing?.contact_number ?? '').trim(),
    is_verified: input.is_verified ?? existing?.is_verified ?? false,
    subscription_plan: String(input.subscription_plan ?? existing?.subscription_plan ?? 'BASIC'),
    subscription_status: String(input.subscription_status ?? existing?.subscription_status ?? 'PENDING'),
    created_at: existing?.created_at ?? String(input.created_at ?? now),
    updated_at: now,
    beds: input.beds !== undefined ? toBedRecord(input.beds, input.beds?.updated_by ?? null) : cloneBeds(existing?.beds),
    oxygen: input.oxygen !== undefined ? toOxygenRecord(input.oxygen, input.oxygen?.updated_by ?? null) : cloneOxygen(existing?.oxygen),
    blood: input.blood !== undefined ? toBloodRecords(input.blood) : cloneBlood(existing?.blood),
  };
}

function upsertHospital(hospital: HospitalRecord) {
  const existing = hospitals.get(hospital.id);
  if (existing) {
    registrationNumbers.delete(existing.registration_number);
  }

  hospitals.set(hospital.id, hospital);
  registrationNumbers.add(hospital.registration_number);
}

function seedStore() {
  if (hospitals.size > 0) return;

  for (const hospital of FALLBACK_HOSPITALS) {
    const record = normalizeHospital(hospital as HospitalInput);
    hospitals.set(record.id, record);
    registrationNumbers.add(record.registration_number);
  }
}

seedStore();

export function listHospitals() {
  return Array.from(hospitals.values()).map(cloneHospital);
}

export function getHospitalById(id: string) {
  const hospital = hospitals.get(id);
  return hospital ? cloneHospital(hospital) : undefined;
}

export function searchHospitals(params: { city?: string | null; bloodGroup?: string | null; minBeds?: number | null }) {
  const city = params.city?.trim().toLowerCase() ?? '';
  const bloodGroup = params.bloodGroup?.trim().toLowerCase() ?? '';
  const minBeds = typeof params.minBeds === 'number' && Number.isFinite(params.minBeds) ? params.minBeds : null;

  return listHospitals().filter((hospital) => {
    if (city && hospital.city.toLowerCase() !== city) {
      return false;
    }

    if (minBeds !== null && (hospital.beds?.available_general ?? 0) < minBeds) {
      return false;
    }

    if (bloodGroup) {
      const hasBlood = hospital.blood.some(
        (entry) => entry.blood_group.toLowerCase() === bloodGroup && entry.units_available > 0
      );

      if (!hasBlood) {
        return false;
      }
    }

    return true;
  });
}

export function createHospital(input: HospitalInput) {
  const record = normalizeHospital(input);

  if (registrationNumbers.has(record.registration_number)) {
    throw new Error('Registration number already exists');
  }

  upsertHospital(record);
  return cloneHospital(record);
}

export function updateHospital(id: string, input: HospitalInput) {
  const existing = hospitals.get(id);
  if (!existing) {
    return undefined;
  }

  const record = normalizeHospital({ ...existing, ...input, id }, existing);

  if (record.registration_number !== existing.registration_number && registrationNumbers.has(record.registration_number)) {
    throw new Error('Registration number already exists');
  }

  upsertHospital(record);
  return cloneHospital(record);
}

export function deleteHospital(id: string) {
  const existing = hospitals.get(id);
  if (!existing) {
    return false;
  }

  hospitals.delete(id);
  registrationNumbers.delete(existing.registration_number);
  return true;
}

export function updateHospitalSupply(id: string, input: SupplyInput) {
  const existing = hospitals.get(id);
  if (!existing) {
    return undefined;
  }

  const now = nowIso();
  let nextBeds = cloneBeds(existing.beds);
  let nextOxygen = cloneOxygen(existing.oxygen);
  let nextBlood = cloneBlood(existing.blood);

  if (input.beds !== undefined) {
    if (input.beds === null) {
      nextBeds = null;
    } else {
      const bedTypes = ['general', 'icu', 'ventilator'] as const;
      for (const type of bedTypes) {
        const total = Number(input.beds[type]?.total ?? 0);
        const available = Number(input.beds[type]?.available ?? 0);

        if (total < 0 || available < 0) {
          throw new Error('Bed counts cannot be negative');
        }

        if (available > total) {
          throw new Error(`Available ${type} beds cannot exceed total capacity`);
        }
      }

      const updatedBeds = nextBeds ?? {
        total_general: 0,
        available_general: 0,
        total_icu: 0,
        available_icu: 0,
        total_ventilator: 0,
        available_ventilator: 0,
        last_updated: now,
      };

      updatedBeds.total_general = Number(input.beds.general?.total ?? 0);
      updatedBeds.available_general = Number(input.beds.general?.available ?? 0);
      updatedBeds.total_icu = Number(input.beds.icu?.total ?? 0);
      updatedBeds.available_icu = Number(input.beds.icu?.available ?? 0);
      updatedBeds.total_ventilator = Number(input.beds.ventilator?.total ?? 0);
      updatedBeds.available_ventilator = Number(input.beds.ventilator?.available ?? 0);
      updatedBeds.last_updated = now;
      updatedBeds.updated_by = input.updatedBy ?? updatedBeds.updated_by ?? null;

      nextBeds = updatedBeds;
    }
  }

  if (input.oxygen !== undefined) {
    if (input.oxygen === null) {
      nextOxygen = null;
    } else {
      const updatedOxygen = nextOxygen ?? {
        total_cylinders: 0,
        cylinders_available: 0,
        flow_rate_lpm: 0,
        pipeline_status: true,
        last_updated: now,
      };

      updatedOxygen.total_cylinders = Number(input.oxygen.cylinders ?? 0);
      updatedOxygen.cylinders_available = Number(input.oxygen.available ?? 0);
      updatedOxygen.flow_rate_lpm = Number(input.oxygen.litersPerMin ?? 0);
      updatedOxygen.last_updated = now;
      updatedOxygen.updated_by = input.updatedBy ?? updatedOxygen.updated_by ?? null;

      nextOxygen = updatedOxygen;
    }
  }

  if (input.blood !== undefined) {
    nextBlood = toBloodRecords(input.blood, input.updatedBy ?? null);
  }

  const record: HospitalRecord = {
    ...existing,
    ...input,
    id,
    beds: nextBeds,
    oxygen: nextOxygen,
    blood: nextBlood,
    updated_at: now,
  };

  upsertHospital(record);
  return cloneHospital(record);
}

export function toSupplyShape(hospital: HospitalRecord) {
  return {
    beds: {
      general: {
        total: hospital.beds?.total_general ?? 0,
        available: hospital.beds?.available_general ?? 0,
      },
      icu: {
        total: hospital.beds?.total_icu ?? 0,
        available: hospital.beds?.available_icu ?? 0,
      },
      ventilator: {
        total: hospital.beds?.total_ventilator ?? 0,
        available: hospital.beds?.available_ventilator ?? 0,
      },
    },
    oxygen: {
      cylinders: hospital.oxygen?.total_cylinders ?? 0,
      available: hospital.oxygen?.cylinders_available ?? 0,
      litersPerMin: hospital.oxygen?.flow_rate_lpm ?? 0,
    },
    blood: hospital.blood.reduce((acc, entry) => {
      acc[entry.blood_group] = entry.units_available;
      return acc;
    }, {} as Record<string, number>),
    lastUpdated: hospital.beds?.last_updated || hospital.updated_at || nowIso(),
  };
}
