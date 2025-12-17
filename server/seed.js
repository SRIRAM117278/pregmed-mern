require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const User = require('./models/User');
const Appointment = require('./models/Appointment');
const HealthRecord = require('./models/HealthRecord');
const CommunityPost = require('./models/CommunityPost');
const Guidance = require('./models/Guidance');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pregmed';

// Configuration - change counts here if you want a bigger or smaller dataset
const CONFIG = {
  USERS: 230, // excluding demo accounts
  PROVIDERS: 25,
  APPOINTMENTS: 1200,
  HEALTH_RECORDS: 2500,
  COMMUNITY_POSTS: 800,
  COMMENTS_PER_POST: { min: 0, max: 8 },
  LIKES_MAX_PER_POST: 60,
  GUIDANCE_WEEKS_PER_USER: 6 // create guidance for 6 random weeks per user
};

async function connectDB() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB for seeding');
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createUsers() {
  console.log('Creating users...');
  const users = [];
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Add two demo accounts with known credentials so you can log in locally
  users.push({
    firstName: 'Demo',
    lastName: 'Patient',
    email: 'demo.patient@pregmed.local',
    password: passwordHash,
    phone: '+911234567890',
    role: 'patient',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    currentWeek: 12,
  });

  users.push({
    firstName: 'Demo',
    lastName: 'Provider',
    email: 'demo.provider@pregmed.local',
    password: passwordHash,
    phone: '+911234567891',
    role: 'provider',
  });

  for (let i = 0; i < CONFIG.USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    // due date: between 1 and 30 weeks from now
    const dueDate = faker.date.soon(faker.number.int({ min: 7, max: 210 }));

    users.push({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phone: faker.phone.number('+91##########'),
      dueDate,
      currentWeek: faker.number.int({ min: 1, max: 40 }),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
      },
      emergencyContact: {
        name: faker.person.fullName(),
        phone: faker.phone.number('+91##########'),
        relationship: randomFromArray(['Mother', 'Husband', 'Sister', 'Friend']),
      },
      medicalHistory: faker.helpers.arrayElements(['hypertension', 'diabetes', 'asthma', 'none'], 1),
      role: 'patient',
    });
  }

  // Add providers
  for (let i = 0; i < CONFIG.PROVIDERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    users.push({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phone: faker.phone.number('+91##########'),
      role: 'provider',
    });
  }

  const inserted = await User.insertMany(users, { ordered: false });
  console.log(`Inserted ${inserted.length} users (including demo accounts)`);
  console.log('Demo accounts:');
  console.log('  patient -> demo.patient@pregmed.local / Password123!');
  console.log('  provider -> demo.provider@pregmed.local / Password123!');
  return inserted;
}

async function createAppointments(allUsers) {
  console.log('Creating appointments...');
  const patients = allUsers.filter(u => u.role === 'patient');
  const providers = allUsers.filter(u => u.role === 'provider');

  const appointments = [];
  for (let i = 0; i < CONFIG.APPOINTMENTS; i++) {
    const patient = randomFromArray(patients);
    const provider = randomFromArray(providers);

    const appointmentDate = faker.date.between({ from: new Date(), to: faker.date.soon(180) });

    appointments.push({
      userId: patient._id,
      providerId: provider._id,
      appointmentDate,
      appointmentTime: `${faker.number.int({ min: 8, max: 18 })}:00`,
      reason: randomFromArray(['Antenatal checkup', 'Ultrasound review', 'Fever', 'Follow-up']),
      description: faker.lorem.sentence(),
      status: randomFromArray(['scheduled', 'completed', 'cancelled']),
      type: randomFromArray(['routine', 'emergency', 'follow-up']),
    });
  }

  const inserted = await Appointment.insertMany(appointments, { ordered: false });
  console.log(`Inserted ${inserted.length} appointments`);
  return inserted;
}

async function createHealthRecords(allUsers) {
  console.log('Creating health records...');
  const patients = allUsers.filter(u => u.role === 'patient');
  const recordTypes = ['blood_pressure', 'weight', 'glucose', 'ultrasound', 'blood_test', 'other'];

  const records = [];
  for (let i = 0; i < CONFIG.HEALTH_RECORDS; i++) {
    const patient = randomFromArray(patients);
    const type = randomFromArray(recordTypes);
    let value = '';
    let unit = '';

    if (type === 'blood_pressure') { value = `${faker.number.int({ min: 90, max: 140 })}/${faker.number.int({ min: 60, max: 95 })}`; unit = 'mmHg'; }
    else if (type === 'weight') { value = `${faker.number.int({ min: 45, max: 100 })}`; unit = 'kg'; }
    else if (type === 'glucose') { value = `${faker.number.int({ min: 70, max: 180 })}`; unit = 'mg/dL'; }
    else if (type === 'ultrasound') { value = 'Ultrasound image'; unit = ''; }
    else if (type === 'blood_test') { value = 'Normal'; unit = ''; }
    else { value = faker.lorem.words(3); unit = ''; }

    records.push({
      userId: patient._id,
      recordType: type,
      date: faker.date.past({ years: 1 }),
      value,
      unit,
      notes: faker.lorem.sentence(),
      providerId: null,
    });
  }

  const inserted = await HealthRecord.insertMany(records, { ordered: false });
  console.log(`Inserted ${inserted.length} health records`);
  return inserted;
}

async function createCommunity(allUsers) {
  console.log('Creating community posts...');
  const patients = allUsers.filter(u => u.role === 'patient');
  const posts = [];

  for (let i = 0; i < CONFIG.COMMUNITY_POSTS; i++) {
    const author = randomFromArray(patients);
    const likesCount = faker.number.int({ min: 0, max: CONFIG.LIKES_MAX_PER_POST });

    const likes = new Array(likesCount).fill(null).map(() => randomFromArray(patients)._id);

    const comments = [];
    const commentsCount = faker.number.int({ min: CONFIG.COMMENTS_PER_POST.min, max: CONFIG.COMMENTS_PER_POST.max });
    for (let j = 0; j < commentsCount; j++) {
      const commenter = randomFromArray(patients);
      comments.push({ userId: commenter._id, text: faker.lorem.sentence() });
    }

    posts.push({
      userId: author._id,
      title: faker.lorem.sentence({ min: 3, max: 6 }),
      content: faker.lorem.paragraphs({ min: 1, max: 2 }),
      category: randomFromArray(['experience', 'question', 'advice', 'announcement']),
      likes,
      comments,
    });
  }

  const inserted = await CommunityPost.insertMany(posts, { ordered: false });
  console.log(`Inserted ${inserted.length} community posts`);
  return inserted;
}

async function createGuidance(allUsers) {
  console.log('Creating guidance entries...');
  const patients = allUsers.filter(u => u.role === 'patient');
  const entries = [];

  for (const p of patients) {
    // pick a few random weeks for which we create guidance
    const weeks = faker.helpers.arrayElements(Array.from({ length: 40 }, (_, i) => i + 1), CONFIG.GUIDANCE_WEEKS_PER_USER);
    for (const w of weeks) {
      entries.push({
        userId: p._id,
        week: w,
        symptoms: faker.helpers.arrayElements(['nausea', 'fatigue', 'breast tenderness', 'back pain', 'headache'], 3),
        activities: faker.helpers.arrayElements(['walking', 'light stretching', 'rest', 'appointments'], 3),
        nutrition: {
          recommendations: faker.helpers.arrayElements(['iron-rich foods', 'leafy greens', 'dairy', 'lean meat', 'fruits'], 3),
          foodToAvoid: faker.helpers.arrayElements(['raw fish', 'unpasteurized dairy', 'high mercury fish'], 2),
          supplements: faker.helpers.arrayElements(['Prenatal vitamins', 'Folic acid', 'Iron supplement'], 2),
        },
        exercises: faker.helpers.arrayElements(['walking', 'pelvic floor', 'prenatal yoga'], 2),
        precautions: faker.helpers.arrayElements(['avoid smoking', 'avoid alcohol', 'avoid certain medications'], 2),
        medicalTips: faker.helpers.arrayElements(['schedule checkup', 'take prescribed supplements', 'contact provider if bleeding'], 2),
      });
    }
  }

  const inserted = await Guidance.insertMany(entries, { ordered: false });
  console.log(`Inserted ${inserted.length} guidance entries`);
  return inserted;
}

async function run() {
  try {
    await connectDB();

    // Cleanup existing
    console.log('Cleaning existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Appointment.deleteMany({}),
      HealthRecord.deleteMany({}),
      CommunityPost.deleteMany({}),
      Guidance.deleteMany({}),
    ]);

    const users = await createUsers();
    await createAppointments(users);
    await createHealthRecords(users);
    await createCommunity(users);
    await createGuidance(users);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

run();
