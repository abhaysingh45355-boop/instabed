import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Instabed database...\n');

  // 1. Create 6 hospitals matching the demo credentials listed on the login page
  const hospitals = [
    {
      name: 'City Care Super Specialty',
      registration_number: 'REG-CITYCARE-001',
      address: 'Block B, Greater Kailash, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      latitude: 28.5482,
      longitude: 77.2341,
      contact_number: '+91 9876543210',
      is_verified: true,
    },
    {
      name: 'St. Mary Medical Center',
      registration_number: 'REG-STMARY-002',
      address: 'Saket Institutional Area, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      latitude: 28.5245,
      longitude: 77.2100,
      contact_number: '+91 8876543211',
      is_verified: true,
    },
    {
      name: 'Apollo Multispecialty',
      registration_number: 'REG-APOLLO-003',
      address: 'Jasola Vihar, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      latitude: 28.5367,
      longitude: 77.2842,
      contact_number: '+91 7776543212',
      is_verified: true,
    },
    {
      name: 'Metro Hospital & Heart Inst.',
      registration_number: 'REG-METRO-004',
      address: 'Lajpat Nagar, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      latitude: 28.5672,
      longitude: 77.2435,
      contact_number: '+91 6676543213',
      is_verified: true,
    },
    {
      name: 'Fortis Heart & Vascular Inst.',
      registration_number: 'REG-FORTIS-005',
      address: 'Okhla, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      latitude: 28.5574,
      longitude: 77.2831,
      contact_number: '+91 9988776655',
      is_verified: true,
    },
    {
      name: 'Max Super Specialty Hospital',
      registration_number: 'REG-MAX-006',
      address: 'Saket, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      latitude: 28.5283,
      longitude: 77.2185,
      contact_number: '+91 8877665544',
      is_verified: true,
    },
  ];

  // Corresponding admin emails shown on the login page
  const adminEmails = [
    'admin@citycare.com',
    'admin@stmary.com',
    'admin@apollo.com',
    'admin@metro.com',
    'admin@fortis.com',
    'admin@max.com',
  ];

  const adminNames = [
    'City Care Admin',
    'St. Mary Admin',
    'Apollo Admin',
    'Metro Admin',
    'Fortis Admin',
    'Max Admin',
  ];

  // Default password: hospital123
  const passwordHash = await bcrypt.hash('hospital123', 12);

  // Bed data for each hospital (General, ICU, Ventilator)
  const bedData = [
    { tg: 50, ag: 12, ti: 10, ai: 4, tv: 5, av: 1 },
    { tg: 100, ag: 45, ti: 20, ai: 2, tv: 8, av: 0 },
    { tg: 120, ag: 8, ti: 15, ai: 0, tv: 10, av: 2 },
    { tg: 40, ag: 15, ti: 8, ai: 3, tv: 4, av: 1 },
    { tg: 80, ag: 20, ti: 12, ai: 5, tv: 6, av: 3 },
    { tg: 150, ag: 25, ti: 25, ai: 1, tv: 12, av: 0 },
  ];

  // Blood inventory per hospital
  const bloodData = [
    ['A+', 'B+', 'O-', 'AB+'],
    ['O+', 'A-', 'B-'],
    ['AB-', 'O+', 'A+'],
    ['B+', 'O-'],
    ['A+', 'O+', 'B+', 'AB+'],
    ['O-', 'A-', 'AB-'],
  ];

  // Oxygen data
  const oxygenData = [
    { tc: 20, ca: 15, fr: 500 },
    { tc: 30, ca: 22, fr: 800 },
    { tc: 15, ca: 0, fr: 300 },
    { tc: 10, ca: 8, fr: 200 },
    { tc: 25, ca: 18, fr: 600 },
    { tc: 35, ca: 30, fr: 1000 },
  ];

  for (let i = 0; i < hospitals.length; i++) {
    console.log(`  Creating hospital: ${hospitals[i].name}`);

    // Upsert hospital
    const hospital = await prisma.hospital.upsert({
      where: { registration_number: hospitals[i].registration_number },
      update: hospitals[i],
      create: {
        ...hospitals[i],
        subscription_plan: 'PRO',
        subscription_status: 'ACTIVE',
      },
    });

    // Upsert admin user
    await prisma.user.upsert({
      where: { email: adminEmails[i] },
      update: {
        full_name: adminNames[i],
        password_hash: passwordHash,
        role: 'HOSPITAL_ADMIN',
        hospital_id: hospital.id,
        status: 'ACTIVE',
      },
      create: {
        full_name: adminNames[i],
        email: adminEmails[i],
        password_hash: passwordHash,
        role: 'HOSPITAL_ADMIN',
        hospital_id: hospital.id,
        status: 'ACTIVE',
      },
    });

    // Upsert bed availability
    const bed = bedData[i];
    await prisma.bedAvailability.upsert({
      where: { hospital_id: hospital.id },
      update: {
        total_general: bed.tg,
        available_general: bed.ag,
        total_icu: bed.ti,
        available_icu: bed.ai,
        total_ventilator: bed.tv,
        available_ventilator: bed.av,
        last_updated: new Date(),
      },
      create: {
        hospital_id: hospital.id,
        total_general: bed.tg,
        available_general: bed.ag,
        total_icu: bed.ti,
        available_icu: bed.ai,
        total_ventilator: bed.tv,
        available_ventilator: bed.av,
        last_updated: new Date(),
      },
    });

    // Upsert oxygen inventory
    const oxy = oxygenData[i];
    await prisma.oxygenInventory.upsert({
      where: { hospital_id: hospital.id },
      update: {
        total_cylinders: oxy.tc,
        cylinders_available: oxy.ca,
        flow_rate_lpm: oxy.fr,
        last_updated: new Date(),
      },
      create: {
        hospital_id: hospital.id,
        total_cylinders: oxy.tc,
        cylinders_available: oxy.ca,
        flow_rate_lpm: oxy.fr,
        last_updated: new Date(),
      },
    });

    // Upsert blood inventory
    for (const group of bloodData[i]) {
      const units = Math.floor(Math.random() * 15) + 3; // 3–17 random units
      await prisma.bloodInventory.upsert({
        where: {
          hospital_id_blood_group: { hospital_id: hospital.id, blood_group: group },
        },
        update: { units_available: units, last_updated: new Date() },
        create: {
          hospital_id: hospital.id,
          blood_group: group,
          units_available: units,
          last_updated: new Date(),
        },
      });
    }

    console.log(`  ✅ ${hospitals[i].name} — admin: ${adminEmails[i]}\n`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('📋 Demo Credentials (password: hospital123):');
  adminEmails.forEach((email, i) => {
    console.log(`   ${adminNames[i].padEnd(20)} → ${email}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
