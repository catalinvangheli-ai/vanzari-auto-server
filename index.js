
// Încarcă variabilele din .env
require('dotenv').config();
// server/index.js

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { Resend } = require('resend');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const resend = new Resend(process.env.RESEND_API_KEY);

// PostgreSQL imports
const { CarSaleAd: CarSaleAdPG, CarRentalAd: CarRentalAdPG, testConnection, syncDatabase } = require('./models');

// Global database status flags
let postgresqlReady = false;

// -------------------------
// CORS CONFIGURATION
// -------------------------
// Permite toate originile pentru aplicația mobilă și web
app.use(cors({
  origin: '*', // Permite toate originile (necesar pentru aplicații mobile)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Parsing JSON și URL-encoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} de la ${req.ip}`);
  next();
});

// Conectare la MongoDB Atlas - cu fallback la MongoDB local pentru testing
const mongoAtlasUri = process.env.MONGODB_URI || 'mongodb+srv://catalinvangheli_db_user:eanoagDnz9LrvNgr@cluster0.qgzanu4.mongodb.net/vanzariAutoApp?retryWrites=true&w=majority&appName=VanzariAutoApp';
const mongoLocalUri = 'mongodb://localhost:27017/vanzariAutoApp';

console.log('🔍 Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('Railway ENV vars:', Object.keys(process.env).filter(k => k.includes('RAILWAY')));

// Funcție pentru a încerca conectarea MongoDB (cu retry pentru clustere re-activate)
async function connectToMongoDB() {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 10000; // 10 secunde între încercări

  // Încearcă MongoDB Atlas cu retry (util când clusterul tocmai s-a re-activat)
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Încercare conectare la MongoDB Atlas (${attempt}/${MAX_RETRIES})...`);
      console.log('🌐 Mongo Atlas URI (hidden password):', mongoAtlasUri.replace(/:[^@]+@/, ':***@'));

      // Deconectează dacă există o conexiune anterioară eșuată
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      await mongoose.connect(mongoAtlasUri, {
        serverSelectionTimeoutMS: 30000, // 30s - clusterele re-activate au nevoie de mai mult timp
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 5,
        bufferCommands: true,
      });

      console.log("✅ SUCCES! Conectat la MongoDB Atlas");
      console.log("🔌 Connection state:", mongoose.connection.readyState);
      return 'atlas';
    } catch (atlasErr) {
      console.error(`❌ EROARE MongoDB Atlas (încercarea ${attempt}):`, atlasErr.message);
      console.error("🔍 Atlas Error details:", atlasErr.code, atlasErr.codeName);

      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Aștept ${RETRY_DELAY_MS / 1000}s înainte de următoarea încercare...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  console.error("❌ Toate încercările Atlas au eșuat.");

  // Fallback: MongoDB local (doar pentru development)
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('🔄 Încercare conectare la MongoDB local...');
      await mongoose.connect(mongoLocalUri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: true,
      });
      console.log("✅ SUCCES! Conectat la MongoDB local pentru testing");
      return 'local';
    } catch (localErr) {
      console.error("❌ EROARE MongoDB local:", localErr.message);
    }
  }

  console.log("⚠️ ATENȚIE: Server va rula fără bază de date!");
  console.log("🔧 Verifică: 1) Cluster Atlas rezumat  2) Network Access → 0.0.0.0/0  3) MONGODB_URI în Railway");
  return 'none';
}


// Async IIFE pentru inițializări asincrone
(async () => {
  // Pornește conexiunea MongoDB asincron
  const mongoResult = await connectToMongoDB();
  console.log(`📊 MongoDB connection result: ${mongoResult}`);

  // -------------------------
  // POSTGRESQL INITIALIZATION
  // -------------------------
  console.log('🐘 Initializing PostgreSQL connection...');
  console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

  // Inițializează PostgreSQL
  async function initializePostgreSQL() {
    try {
      console.log('🔄 Testing PostgreSQL connection...');
      const isConnected = await testConnection();
      if (isConnected) {
        console.log('✅ PostgreSQL connected, syncing database...');
        await syncDatabase();
        console.log('🚀 PostgreSQL initialized successfully!');
        return true;
      } else {
        console.log('❌ PostgreSQL connection failed');
        return false;
      }
    } catch (error) {
      console.error('❌ PostgreSQL initialization failed:', error.message);
      console.error('🔍 Full error:', error);
      return false;
    }
  }

  // Pornește PostgreSQL
  postgresqlReady = await initializePostgreSQL();
  console.log(`📊 PostgreSQL initialization result: ${postgresqlReady ? 'SUCCESS' : 'FAILED'}`);
  if (!postgresqlReady) {
    console.log('⚠️ Server will run without PostgreSQL - usando MongoDB fallback');
  }
})();
  

// -------------------------
// MODELE MONGOOSE (LEGACY)
// -------------------------
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  fullName: String,
  role: String,
  skills: [String],
  photo: String,
  telefon: String,
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false }
}));

const Offer = mongoose.model('Offer', new mongoose.Schema({
  nume: String,
  email: String,
  service: String,
  telefon: String,
}));

const Request = mongoose.model('Request', new mongoose.Schema({
  nume: String,
  email: String,
  need: String,
  telefon: String,
}));

const Message = mongoose.model("Message", new mongoose.Schema({
  from: String,
  to: String,
  text: String,
  date: { type: Date, default: Date.now },
  listingId: String,  // ID-ul anunțului despre care e conversația
  listingType: String // 'vanzari' sau 'inchirieri'
}));

const Review = mongoose.model("Review", new mongoose.Schema({
  from: String,
  to: String,
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now }
}));

const Report = mongoose.model("Report", new mongoose.Schema({
  from: String,
  to: String,
  reason: String,
  description: String,
  date: { type: Date, default: Date.now }
}));

// Model pentru anunturi auto vânzare
const CarSaleAd = mongoose.model('CarSaleAd', new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  marca: { type: String, required: true },
  model: { type: String, required: true },
  anFabricatie: { type: Number, required: true },
  km: { type: Number, required: true },
  pret: { type: Number, required: true },
  culoare: String,
  carburant: String,
  transmisie: String,
  putere: Number,
  capacitateCilindrica: Number,
  descriere: String,
  locatie: String,
  telefon: String,
  photos: [String],
  dateCreated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  deletesAt: { type: Date, default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) }
}));

// Model pentru anunturi auto închiriere
const CarRentalAd = mongoose.model('CarRentalAd', new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  marca: { type: String, required: true },
  model: { type: String, required: true },
  anFabricatie: { type: Number, required: true },
  pret: { type: Number, required: true },
  culoare: String,
  carburant: String,
  transmisie: String,
  putere: Number,
  capacitateCilindrica: Number,
  descriere: String,
  locatie: String,
  telefon: String,
  photos: [String],
  dateCreated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  deletesAt: { type: Date, default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) }
}));

// -------------------------
// CLOUDINARY CONFIGURATION
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('☁️ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌ Missing credentials');

// -------------------------
// MULTER (upload poze) - CLOUDINARY STORAGE
// -------------------------
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'carxsell', // Folder în Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit' }], // Resize automat
  }
});

const upload = multer({ storage: cloudinaryStorage });

// Legacy: servire fișiere din uploads local (fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------------
// MIDDLEWARE autentificare
// -------------------------
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.sendStatus(401);
  }
}

// -------------------------
// MIDDLEWARE ADMIN
// -------------------------
async function adminMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const adminUser = await User.findOne({ username: payload.username });
    if (!adminUser || !adminUser.isAdmin) return res.sendStatus(403);
    req.user = payload;
    next();
  } catch {
    res.sendStatus(401);
  }
}

// -------------------------
// RUTE
// -------------------------

// Înregistrare
app.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role, skills } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email și parolă sunt obligatorii' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const nameValue = typeof fullName === 'string' ? fullName.trim() : '';
    const requestedUsername = typeof req.body.username === 'string' ? req.body.username.trim().toLowerCase() : '';
    const baseFromEmail = normalizedEmail.split('@')[0]?.replace(/[^a-z0-9]/gi, '') || '';
    let baseUsername = (requestedUsername || baseFromEmail || 'utilizator').toLowerCase();

    if (!baseUsername) {
      baseUsername = 'utilizator';
    }

    const existingEmailUser = await User.findOne({ email: normalizedEmail });
    if (existingEmailUser) {
      return res.status(409).json({ error: 'Email deja folosit' });
    }

    let uniqueUsername = baseUsername;
    let suffix = 1;
    while (await User.findOne({ username: uniqueUsername })) {
      uniqueUsername = `${baseUsername}${suffix}`;
      suffix += 1;
      if (suffix > 999) {
        uniqueUsername = `${baseUsername}${Date.now()}`;
        break;
      }
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username: uniqueUsername,
      password: hash,
      email: normalizedEmail,
      fullName: nameValue,
      role: role || 'beneficiar',
      skills: skills || [],
      photo: '',
      telefon: req.body.telefon || ''
    });
    await user.save();
    
    const token = jwt.sign({ username: user.username, email: user.email }, JWT_SECRET);
    res.status(201).json({ 
      token, 
      username: user.username,
      email: user.email,
      fullName: user.fullName
    });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Eroare server la înregistrare' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, username, password } = req.body;

  if (!password || !(email || username)) {
    return res.status(400).json({ error: 'Email și parolă sunt obligatorii' });
  }

  const identifierRaw = (email || username || '').trim();
  const identifierLower = identifierRaw.toLowerCase();

  const usernameQueries = [{ username: identifierLower }];
  if (identifierRaw !== identifierLower) {
    usernameQueries.push({ username: identifierRaw });
  }

  const user = await User.findOne({
    $or: [
      { email: identifierLower },
      ...usernameQueries
    ]
  });

  if (!user) {
    return res.status(401).json({ error: 'Email sau parolă incorecte' });
  }

  if (user.isBanned) {
    return res.status(403).json({ error: 'Contul tău a fost suspendat. Contactează administratorul.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Email sau parolă incorecte' });
  }

  const token = jwt.sign({ username: user.username, email: user.email }, JWT_SECRET);
  res.json({ 
    token, 
    username: user.username,
    email: user.email,
    fullName: user.fullName
  });
});

// Resetare parolă - cere resetare
app.post('/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email-ul este obligatoriu' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    // Răspuns identic indiferent dacă emailul există sau nu (previne enumerarea conturilor)
    if (!user) {
      return res.json({ message: 'Dacă există un cont cu acest email, vei primi un link de resetare.' });
    }

    // Generează token securizat pentru resetare (valabil 1 oră)
    const resetToken = jwt.sign(
      { username: user.username, purpose: 'reset-password' }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    const appUrl = process.env.APP_URL || 'https://carxsell-production-9d359.up.railway.app';
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    await resend.emails.send({
      from: `CarXSell <${fromEmail}>`,
      to: normalizedEmail,
      subject: 'Resetare parolă CarXSell',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Resetare parolă CarXSell</h2>
          <p>Ai solicitat resetarea parolei pentru contul tău.</p>
          <p>Apasă butonul de mai jos pentru a seta o parolă nouă. Linkul este valabil <strong>1 oră</strong>.</p>
          <a href="${resetLink}" style="display:inline-block; background:#2563eb; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; margin:16px 0;">Resetează parola</a>
          <p style="color:#666; font-size:13px;">Dacă nu ai solicitat resetarea parolei, ignoră acest email. Parola ta nu va fi modificată.</p>
          <hr style="border:none; border-top:1px solid #eee; margin-top:24px;">
          <p style="color:#999; font-size:12px;">CarXSell — Vânzări și închirieri auto</p>
        </div>
      `
    });

    console.log(`📧 Email resetare trimis la: ${normalizedEmail}`);
    res.json({ message: 'Dacă există un cont cu acest email, vei primi un link de resetare.' });
  } catch (e) {
    console.error('Reset password request error:', e);
    res.status(500).json({ error: 'Eroare la trimiterea emailului. Încearcă din nou.' });
  }
});

// Resetare parolă - setează parola nouă
app.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token și parola nouă sunt obligatorii' });
    }

    // Verifică tokenul
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Token invalid sau expirat' });
    }

    if (decoded.purpose !== 'reset-password') {
      return res.status(401).json({ error: 'Token nu este pentru resetarea parolei' });
    }

    // Găsește utilizatorul
    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).json({ error: 'Utilizator inexistent' });
    }

    // Actualizează parola
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    res.json({ message: 'Parola a fost resetată cu succes' });
  } catch (e) {
    console.error('Reset password error:', e);
    res.status(500).json({ error: 'Eroare server la resetarea parolei' });
  }
});

// Cereri
app.get('/requests', async (req, res) => {
  const requests = await Request.find({});
  res.json(requests);
});
app.post('/requests', authMiddleware, async (req, res) => {
  const request = new Request(req.body);
  await request.save();
  res.sendStatus(201);
});
app.put('/requests/:id', authMiddleware, async (req, res) => {
  await Request.findByIdAndUpdate(req.params.id, req.body);
  res.sendStatus(200);
});
app.delete('/requests/:id', authMiddleware, async (req, res) => {
  await Request.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Oferte
app.get('/offers', async (req, res) => {
  const offers = await Offer.find({});
  res.json(offers);
});
app.post('/offers', authMiddleware, async (req, res) => {
  const offer = new Offer(req.body);
  await offer.save();
  res.sendStatus(201);
});
app.put('/offers/:id', authMiddleware, async (req, res) => {
  await Offer.findByIdAndUpdate(req.params.id, req.body);
  res.sendStatus(200);
});
app.delete('/offers/:id', authMiddleware, async (req, res) => {
  await Offer.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Mesaje
app.post('/messages', authMiddleware, async (req, res) => {
  try {
    console.log('💬 POST /messages - User:', req.user.username, req.user.email);
    console.log('📝 Body:', req.body);
    
    // Găsește destinatarul pentru a normaliza identificatorul
    const toUser = await User.findOne({
      $or: [{ email: req.body.to }, { username: req.body.to }]
    });
    
    // Folosește username consistent pentru ambii utilizatori
    const fromIdentifier = req.user.username;
    const toIdentifier = toUser?.username || req.body.to;
    
    console.log('🔄 Normalizat:', { 
      from: fromIdentifier, 
      to: toIdentifier 
    });
    
    const message = new Message({
      from: fromIdentifier,
      to: toIdentifier,
      text: req.body.text,
      date: new Date(),
      listingId: req.body.listingId || null,
      listingType: req.body.listingType || null
    });
    
    await message.save();
    console.log('✅ Mesaj salvat:', message._id);
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('❌ Eroare salvare mesaj:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/messages/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const { listingId } = req.query; // Adaugă suport pentru filtrare după listing
    
    console.log('📧 GET /messages/:user1/:user2 - Params:', { user1, user2, listingId });
    
    // Găsește utilizatorii și convertește la email/username
    const user1Doc = await User.findOne({ 
      $or: [{ email: user1 }, { username: user1 }] 
    });
    const user2Doc = await User.findOne({ 
      $or: [{ email: user2 }, { username: user2 }] 
    });
    
    // Creează array cu toate variantele posibile (email + username)
    const user1Identifiers = [
      user1, 
      user1Doc?.email, 
      user1Doc?.username
    ].filter(Boolean);
    
    const user2Identifiers = [
      user2, 
      user2Doc?.email, 
      user2Doc?.username
    ].filter(Boolean);
    
    console.log('🔍 User identifiers:', { 
      user1Identifiers, 
      user2Identifiers 
    });
    
    // Query pentru a găsi mesaje între cei 2 utilizatori
    const query = {
      $or: [
        { 
          from: { $in: user1Identifiers }, 
          to: { $in: user2Identifiers } 
        },
        { 
          from: { $in: user2Identifiers }, 
          to: { $in: user1Identifiers } 
        }
      ]
    };
    
    // Filtrare opțională după listingId
    if (listingId) {
      query.listingId = listingId;
    }
    
    const messages = await Message.find(query).sort({ date: 1 });
    
    console.log(`✅ Găsite ${messages.length} mesaje`);
    res.json(messages);
  } catch (error) {
    console.error('❌ Eroare la încărcarea mesajelor:', error);
    res.status(500).json({ error: error.message });
  }
});

// Recenzii
app.post('/reviews', authMiddleware, async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.sendStatus(201);
});
app.get('/reviews/:username', async (req, res) => {
  const reviews = await Review.find({ to: req.params.username });
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : null;
  res.json({ reviews, avgRating });
});

// Raportări
app.post('/reports', authMiddleware, async (req, res) => {
  const report = new Report({ ...req.body, from: req.user.username });
  await report.save();
  res.sendStatus(201);
});
app.get('/reports/:username', async (req, res) => {
  const reports = await Report.find({ to: req.params.username });
  res.json({ count: reports.length, reports });
});

// Profil
app.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.sendStatus(404);
  res.json(user);
});
app.put('/me', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    console.log("Body primit:", req.body);
    console.log("File primit:", req.file);

    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.sendStatus(404);

    if (req.body.email) user.email = req.body.email;
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.role) user.role = req.body.role;
    if (req.body.skills) {
      if (Array.isArray(req.body.skills)) {
        user.skills = req.body.skills;
      } else {
        user.skills = req.body.skills.split(',').map(s => s.trim());
      }
    }
    if (req.body.telefon) user.telefon = req.body.telefon;
    if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);
    if (req.file) user.photo = '/uploads/' + req.file.filename;

    await user.save();
    res.sendStatus(200);
  } catch (err) {
    console.error("Eroare la actualizare profil:", err);
    res.status(500).json({ error: "Eroare la actualizare profil" });
  }
});

// Listă utilizatori
app.get('/users', async (req, res) => {
  const { role, skill } = req.query;
  let filter = {};
  if (role) filter.role = role;
  if (skill) filter.skills = { $regex: skill, $options: 'i' };

  const users = await User.find(filter, 'username fullName role skills photo email telefon');
  res.json(users);
});

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    postgresql: postgresqlReady ? 'Connected' : 'Disconnected',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Missing',
    timestamp: new Date().toISOString()
  });
});

// Test MongoDB connection
app.get('/test-db', async (req, res) => {
  try {
    console.log('🧪 Testing MongoDB connection...');
    
    // Încearcă să creeze o colecție de test simplă
    const TestModel = mongoose.model('Test', new mongoose.Schema({ 
      test: String, 
      timestamp: Date 
    }, { collection: 'test_connection' }));
    
    const testDoc = { test: 'connection_test', timestamp: new Date() };
    
    // Test cu timeout explicit
    const result = await Promise.race([
      TestModel.create(testDoc),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout after 10s')), 10000)
      )
    ]);
    
    console.log('✅ MongoDB test successful:', result._id);
    res.json({ 
      status: 'MongoDB OK', 
      testId: result._id,
      timestamp: new Date().toISOString(),
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    res.status(500).json({ 
      status: 'MongoDB FAILED', 
      error: error.message,
      timestamp: new Date().toISOString(),
      connectionState: mongoose.connection.readyState
    });
  }
});

// Test simple MongoDB write
app.post('/test-write', async (req, res) => {
  try {
    console.log('🧪 Testing MongoDB WRITE operation...');
    
    // Model simplu pentru test
    const TestWrite = mongoose.model('TestWrite', new mongoose.Schema({ 
      message: String, 
      timestamp: Date,
      fromIp: String
    }, { collection: 'test_writes' }));
    
    const testData = { 
      message: 'Test write from Railway', 
      timestamp: new Date(),
      fromIp: req.ip
    };
    
    console.log('📝 Attempt to write:', testData);
    
    // Timeout explicit pentru write
    const startTime = Date.now();
    const result = await Promise.race([
      TestWrite.create(testData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Write timeout after 15s')), 15000)
      )
    ]);
    
    const endTime = Date.now();
    console.log(`✅ MongoDB write successful in ${endTime - startTime}ms:`, result._id);
    
    res.json({ 
      status: 'Write SUCCESS', 
      id: result._id,
      duration: `${endTime - startTime}ms`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    const errorTime = Date.now();
    console.error('❌ MongoDB write failed:', error.message);
    res.status(500).json({ 
      status: 'Write FAILED', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Retry MongoDB connection
app.get('/retry-db', async (req, res) => {
  try {
    console.log('🔄 Manual retry MongoDB connection...');
    const result = await connectToMongoDB();
    res.json({ 
      status: 'Retry completed', 
      result: result,
      connectionState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Retry failed', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug MongoDB info
app.get('/db-info', (req, res) => {
  res.json({
    connectionState: mongoose.connection.readyState,
    readyStates: {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    },
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    mongoUri: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set'
  });
});

// -------------------------
// RUTE PENTRU ANUNTURI AUTO
// -------------------------

// Vânzări auto - Creare anunt cu poze (PostgreSQL cu MongoDB fallback)
app.post('/api/car-sales', authMiddleware, upload.array('poze', 10), async (req, res) => {
  try {
    console.log('🔥 CERERE PRIMITĂ pentru salvarea anunțului!');
    console.log('📡 IP client:', req.ip);
    console.log('📸 Fișiere primite:', req.files?.length || 0);
    console.log('🔍 PostgreSQL ready:', postgresqlReady);
    console.log('🔍 MongoDB connection state:', mongoose.connection.readyState);
    
    // VERIFICĂ CONEXIUNEA MONGODB ÎNAINTE DE SALVARE
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB nu este conectat! State:', mongoose.connection.readyState);
      return res.status(500).json({ 
        error: 'Database connection not ready',
        connectionState: mongoose.connection.readyState,
        success: false 
      });
    }
    
    console.log('�📡 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📝 Body primit:', JSON.stringify(req.body, null, 2));
    
    // Caută utilizatorul pentru a obține fullName și telefon
    const user = await User.findOne({ username: req.user.username });
    console.log('👤 User găsit:', user?.fullName, user?.telefon);
    
    // NU bloca dacă user nu e găsit - folosește datele din req.body
    // Normalizează marca la formatul cu prima literă mare, restul mici
    let marcaNormalizata = req.body.marca;
    if (marcaNormalizata && typeof marcaNormalizata === 'string') {
      marcaNormalizata = marcaNormalizata.charAt(0).toUpperCase() + marcaNormalizata.slice(1).toLowerCase();
    }
    const now = new Date();
    const adData = {
      ...req.body,
      marca: marcaNormalizata,
      userId: req.user.username,
      username: req.user.username,
      email: req.user.email,
      userEmail: req.user.email,
      fullName: user?.fullName || req.body.fullName || req.user.username || 'User',
      telefon: req.body.telefon || user?.telefon || '',
      createdAt: now,
      dataCrearii: now,
      expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      deletesAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
    };
    
    // Adaugă URL-urile pozelor din Cloudinary
    if (req.files && req.files.length > 0) {
      adData.photos = req.files.map(file => file.path); // URL Cloudinary
      adData.poze = req.files.map(file => file.path); // Pentru MongoDB
      console.log('📸 Cloudinary URLs salvate:', adData.photos);
    }
    
    console.log('📝 Salvez anunt nou:', JSON.stringify(adData, null, 2));
    
    // Încearcă PostgreSQL mai întâi, apoi MongoDB fallback
    const startTime = Date.now();
    let savedAd, database;
    
    if (postgresqlReady) {
      try {
        console.log('⏱️ START PostgreSQL save operation...');
        savedAd = await CarSaleAdPG.create(adData);
        database = 'PostgreSQL';
        console.log(`✅ SUCCES! Anunt salvat în PostgreSQL cu ID:`, savedAd.id);
      } catch (pgError) {
        console.error('❌ PostgreSQL failed, using MongoDB fallback:', pgError.message);
        adData.dataCrearii = new Date();
        const ad = new CarSaleAd(adData);
        savedAd = await ad.save();
        database = 'MongoDB';
        console.log(`✅ FALLBACK! Anunt salvat în MongoDB cu ID:`, savedAd._id);
      }
    } else {
      // Folosește MongoDB direct
      console.log('⏱️ START MongoDB save operation (PostgreSQL not ready)...');
      adData.dataCrearii = new Date();
      const ad = new CarSaleAd(adData);
      savedAd = await ad.save();
      database = 'MongoDB';
      console.log(`✅ SUCCES! Anunt salvat în MongoDB cu ID:`, savedAd._id);
    }
    const endTime = Date.now();
    res.status(201).json({ 
      message: `Anunt creat cu succes în ${database}!`, 
      id: savedAd.id || savedAd._id,
      duration: `${endTime - startTime}ms`,
      database: database,
      success: true 
    });
  } catch (error) {
    console.error('❌ EROARE la salvarea anunțului:', error);
    res.status(500).json({ 
      error: 'Eroare la salvarea anuntului: ' + error.message,
      postgresqlReady: postgresqlReady,
      success: false 
    });
  }
});

// Vânzări auto - Listă toate anunțurile
app.get('/api/car-sales', async (req, res) => {
  try {
    console.log("🔎 Query primit:", req.query);
    console.log("🔍 postgresqlReady:", postgresqlReady);
    console.log("🔍 MongoDB state:", mongoose.connection.readyState);

    // Loghează valorile distincte pentru marca din baza de date MongoDB (doar pentru debug)
    try {
      const CarSaleAd = require('./models/CarSaleAd');
      const distinctMarci = await CarSaleAd.distinct('marca');
      console.log('🔍 Marci distincte în MongoDB:', distinctMarci);
    } catch (e) {
      console.warn('⚠️ Nu s-au putut extrage marcile distincte din MongoDB:', e.message);
    }

    const {
      marca,
      model,
      pretMin,
      pretMax,
      anMin,
      anMax,
      combustibil,
      transmisie,
      putereMin,
      putereMax,
      capacitateMin,
      capacitateMax
    } = req.query;


    const { Op } = require('sequelize');
    const pgWhere = {}; // Temporar: NU filtrez după isActive pentru debug
    let mongoQuery = {};

    // Filtrare după marcă (folosește exact valoarea din DB, de obicei lowercase)
    let marcaFiltru = marca;
    if (marcaFiltru && typeof marcaFiltru === 'string') {
      marcaFiltru = marcaFiltru.toLowerCase();
    }
    // Loghează toate mărcile distincte din DB pentru debug
    try {
      const mongoose = require('mongoose');
      const CarSaleAdMongo = mongoose.model('CarSaleAd');
      const allMarci = await CarSaleAdMongo.distinct('marca');
      console.log('🟨 DEBUG: Toate marcile din DB:', allMarci);
    } catch (e) {}
    console.log('🟨 DEBUG: marca primit din query:', marca, '| marcaFiltru folosit:', marcaFiltru);
    if (marcaFiltru) {
      pgWhere.marca = { [Op.iLike]: marcaFiltru };
      mongoQuery.marca = marcaFiltru;
    }
    // Loghează query-ul complet și rezultatele brute pentru debug
    console.log('🟨 DEBUG: mongoQuery folosit:', JSON.stringify(mongoQuery));
    if (model) {
      pgWhere.model = { [Op.iLike]: `%${model}%` };
      mongoQuery.model = { $regex: new RegExp(`^${model}$`, 'i') };
    }
    if (combustibil) {
      pgWhere.carburant = { [Op.iLike]: `%${combustibil}%` };
      mongoQuery.carburant = { $regex: new RegExp(combustibil, 'i') };
    }
    if (transmisie) {
      pgWhere.transmisie = { [Op.iLike]: `%${transmisie}%` };
      mongoQuery.transmisie = { $regex: new RegExp(transmisie, 'i') };
    }
    if (pretMin || pretMax) {
      pgWhere.pret = {};
      mongoQuery.pret = {};
      if (pretMin) {
        pgWhere.pret[Op.gte] = Number(pretMin);
        mongoQuery.pret.$gte = Number(pretMin);
      }
      if (pretMax) {
        pgWhere.pret[Op.lte] = Number(pretMax);
        mongoQuery.pret.$lte = Number(pretMax);
      }
    }
    if (anMin || anMax) {
      pgWhere.anFabricatie = {};
      mongoQuery.anFabricatie = {};
      if (anMin) {
        pgWhere.anFabricatie[Op.gte] = Number(anMin);
        mongoQuery.anFabricatie.$gte = Number(anMin);
      }
      if (anMax) {
        pgWhere.anFabricatie[Op.lte] = Number(anMax);
        mongoQuery.anFabricatie.$lte = Number(anMax);
      }
    }
    if (putereMin || putereMax) {
      pgWhere.putere = {};
      mongoQuery.putere = {};
      if (putereMin) {
        pgWhere.putere[Op.gte] = Number(putereMin);
        mongoQuery.putere.$gte = Number(putereMin);
      }
      if (putereMax) {
        pgWhere.putere[Op.lte] = Number(putereMax);
        mongoQuery.putere.$lte = Number(putereMax);
      }
    }
    if (capacitateMin || capacitateMax) {
      pgWhere.capacitateCilindrica = {};
      mongoQuery.capacitateCilindrica = {};
      if (capacitateMin) {
        pgWhere.capacitateCilindrica[Op.gte] = Number(capacitateMin);
        mongoQuery.capacitateCilindrica.$gte = Number(capacitateMin);
      }
      if (capacitateMax) {
        pgWhere.capacitateCilindrica[Op.lte] = Number(capacitateMax);
        mongoQuery.capacitateCilindrica.$lte = Number(capacitateMax);
      }
    }

    // LOGGING: Filtru și SQL generat
    console.log("🔧 Filtru final trimis la PostgreSQL:", JSON.stringify(pgWhere, null, 2));
    console.log("🔧 Filtru final trimis la MongoDB:", JSON.stringify(mongoQuery, null, 2));

    let ads = [];
    if (postgresqlReady) {
      // Loghează SQL-ul generat de Sequelize
      ads = await CarSaleAdPG.findAll({
        where: pgWhere,
        order: [['createdAt', 'DESC']],
        logging: (sql, timing) => {
          console.log('🟦 SQL generat de Sequelize:', sql);
          if (timing) console.log('⏱️ Query timing:', timing, 'ms');
        }
      });
    } else {
      // Fallback MongoDB cu query direct
      const mongoose = require('mongoose');
      const CarSaleAdMongo = mongoose.model('CarSaleAd');
      ads = await CarSaleAdMongo.find(mongoQuery).sort({ dateCreated: -1 });
      // Loghează primele 10 rezultate pentru debug
      if (ads.length > 0) {
        console.log('🟨 DEBUG: Primele 10 rezultate:', ads.slice(0, 10).map(ad => ({ marca: ad.marca, model: ad.model })));
      }
    }


    console.log(`📋 Găsite ${ads.length} anunțuri după filtrare`);
    if (ads.length > 0) {
      console.log('🟨 DEBUG: Primele 5 rezultate - marci:', ads.slice(0, 5).map(ad => ad.marca));
    }

    res.json(ads);

  } catch (error) {
    console.error("❌ Eroare /api/car-sales:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vânzări auto - Obține un singur anunț după ID
app.get('/api/car-sales/:id', async (req, res) => {
  try {
    let ad, database;
    
    if (postgresqlReady) {
      try {
        console.log(`📋 Încărcare anunț ${req.params.id} din PostgreSQL...`);
        ad = await CarSaleAdPG.findByPk(req.params.id);
        database = 'PostgreSQL';
      } catch (pgError) {
        console.error('❌ PostgreSQL get-one failed, using MongoDB fallback:', pgError.message);
        ad = await CarSaleAd.findById(req.params.id);
        database = 'MongoDB';
      }
    } else {
      console.log(`📋 Încărcare anunț ${req.params.id} din MongoDB...`);
      ad = await CarSaleAd.findById(req.params.id);
      database = 'MongoDB';
    }
    
    if (!ad) {
      console.log(`❌ Anunț ${req.params.id} nu a fost găsit`);
      return res.status(404).json({ error: 'Anunțul nu a fost găsit' });
    }
    
    console.log(`✅ Anunț găsit în ${database}:`, ad.marca, ad.model);
    res.json(ad);
  } catch (error) {
    console.error('❌ Eroare la încărcarea anuntului:', error);
    res.status(500).json({ 
      error: 'Eroare la încărcarea anuntului: ' + error.message,
      success: false 
    });
  }
});

// Vânzări auto - Anunturile mele (TEMP: fără autentificare, cu fallback MongoDB)
app.get('/api/my-car-sales', authMiddleware, async (req, res) => {
  try {
    let ads, database;
    const userId = req.user.username; // User din JWT token, nu hardcodat
    const userEmail = req.user.email; // Email din JWT token
    
    console.log('📋 User autentificat - username:', userId, ', email:', userEmail);
    console.log('📋 JWT payload complet:', req.user);
    
    if (postgresqlReady) {
      try {
        console.log('📋 Încărcare TOATE anunțurile utilizator din PostgreSQL...');
        ads = await CarSaleAdPG.findAll({ 
          where: { userId: userId }, // Fără filtru isActive - returnează TOATE
          order: [['createdAt', 'DESC']]
        });
        database = 'PostgreSQL';
        console.log(`📋 Găsite ${ads.length} anunțuri utilizator în PostgreSQL`);
      } catch (pgError) {
        console.error('❌ PostgreSQL my-sales failed, using MongoDB fallback:', pgError.message);
        ads = await CarSaleAd.find({ userId: userId }).sort({ dateCreated: -1 }); // TOATE
        database = 'MongoDB';
        console.log(`📋 FALLBACK: Găsite ${ads.length} anunțuri utilizator în MongoDB`);
      }
    } else {
      console.log('📋 Încărcare TOATE anunțurile utilizator din MongoDB...');
      // Caută după userId SAU email (pentru anunțuri vechi create fără email)
      ads = await CarSaleAd.find({ 
        $or: [
          { userId: userId },
          { email: userEmail },
          { userEmail: userEmail }
        ]
      }).sort({ dateCreated: -1 }); // TOATE
      database = 'MongoDB';
      console.log(`📋 Găsite ${ads.length} anunțuri utilizator în MongoDB`);
      
      // DEBUG: Să vedem ce userId au anunțurile existente
      const allAds = await CarSaleAd.find({}).limit(10);
      console.log('🔍 DEBUG - Primele 10 anunțuri din DB cu userId:', 
        allAds.map(ad => ({ id: ad._id, userId: ad.userId, email: ad.email, marca: ad.marca, model: ad.model }))
      );
    }
    
    // Convertește isActive (boolean) → status (string) pentru frontend
    const adsWithStatus = ads.map(ad => {
      const adObj = ad.toJSON ? ad.toJSON() : ad.get({ plain: true });
      adObj.status = adObj.isActive ? 'activ' : 'inactiv';
      return adObj;
    });
    
    res.json(adsWithStatus);
  } catch (error) {
    console.error('❌ Eroare la încărcarea anunturilor utilizator:', error);
    res.status(500).json({ 
      error: 'Eroare la încărcarea anunturilor: ' + error.message,
      success: false 
    });
  }
});

// Vânzări auto - Editare anunt
app.put('/api/car-sales/:id', authMiddleware, async (req, res) => {
  try {
    console.log('🔄 PUT /api/car-sales/:id - Update anunt');
    console.log('📋 req.body:', req.body);
    console.log('🔍 PostgreSQL ready:', postgresqlReady);
    
    const updateData = { ...req.body };
    
    // Convertește status (string) în isActive (boolean)
    if (updateData.status) {
      updateData.isActive = updateData.status === 'activ';
      delete updateData.status;
      console.log('🔄 Status convertit → isActive:', updateData.isActive);
      // Dacă anunțul este reactivat, resetează termenele de expirare
      if (updateData.isActive) {
        const now = new Date();
        updateData.expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        updateData.deletesAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
        console.log('🔄 Termenele resetate - expiresAt:', updateData.expiresAt);
      }
    }
    
    let updatedAd;
    
    if (postgresqlReady) {
      // PostgreSQL Update
      const ad = await CarSaleAdPG.findOne({ 
        where: { 
          id: req.params.id, 
          userId: req.user.username 
        } 
      });
      
      if (!ad) {
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
      }
      
      await ad.update(updateData);
      updatedAd = ad;
      console.log('✅ PostgreSQL: Anunt actualizat:', updatedAd.id, 'isActive:', updatedAd.isActive);
    } else {
      // MongoDB Fallback
      const ad = await CarSaleAd.findOne({ _id: req.params.id, userId: req.user.username });
      if (!ad) {
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
      }
      
      updatedAd = await CarSaleAd.findByIdAndUpdate(
        req.params.id, 
        updateData,
        { new: true }
      );
      console.log('✅ MongoDB: Anunt actualizat:', updatedAd._id, 'isActive:', updatedAd.isActive);
    }
    
    res.json({ message: 'Anunt actualizat cu succes!', ad: updatedAd });
  } catch (error) {
    console.error('❌ Eroare PUT car-sales:', error);
    res.status(500).json({ error: 'Eroare la actualizarea anuntului' });
  }
});

// Vânzări auto - Ștergere anunt
app.delete('/api/car-sales/:id', authMiddleware, async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/car-sales/:id - Ștergere anunt');
    console.log('📋 ID anunt:', req.params.id);
    console.log('👤 User:', req.user.username);
    console.log('🔍 PostgreSQL ready:', postgresqlReady);
    
    if (postgresqlReady) {
      // PostgreSQL Delete
      const ad = await CarSaleAdPG.findOne({ 
        where: { 
          id: req.params.id, 
          userId: req.user.username 
        } 
      });
      
      if (!ad) {
        console.log('❌ PostgreSQL: Anunt nu a fost gasit sau user fara permisiune');
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
      }
      
      await ad.destroy();
      console.log('✅ PostgreSQL: Anunt șters cu succes:', req.params.id);
    } else {
      // MongoDB Fallback
      const ad = await CarSaleAd.findOne({ _id: req.params.id, userId: req.user.username });
      if (!ad) {
        console.log('❌ MongoDB: Anunt nu a fost gasit sau user fara permisiune');
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
      }
      
      await CarSaleAd.findByIdAndDelete(req.params.id);
      console.log('✅ MongoDB: Anunt șters cu succes:', req.params.id);
    }
    
    res.json({ message: 'Anunt șters cu succes!' });
  } catch (error) {
    console.error('❌ Eroare DELETE car-sales:', error);
    res.status(500).json({ error: 'Eroare la ștergerea anuntului' });
  }
});

// Închirieri auto - Creare anunt (PostgreSQL cu MongoDB fallback)
app.post('/api/car-rentals', authMiddleware, upload.array('poze'), async (req, res) => {
  try {
    console.log('🟢 POST /api/car-rentals - Începe procesarea...');
    console.log('🔍 PostgreSQL ready:', postgresqlReady);
    console.log('� User autentificat:', req.user.username);
    console.log('�📋 req.body:', req.body);
    console.log('📋 req.files:', req.files);
    
    // Caută utilizatorul pentru a obține fullName și telefon
    const user = await User.findOne({ username: req.user.username });
    console.log('👤 User găsit (rentals):', user?.fullName, user?.telefon);
    
    const rentalNow = new Date();
    const adData = {
      ...req.body,
      userId: req.user.username, // User din JWT token
      username: req.user.username, // User din JWT token
      email: req.user.email, // Email din JWT token
      userEmail: req.user.email, // Email din JWT token (alias pentru compatibilitate)
      fullName: user?.fullName || req.body.fullName || req.user.username || 'User', // Nume complet
      telefon: req.body.telefon || user?.telefon || '', // Telefon
      createdAt: rentalNow, // Data creării
      expiresAt: new Date(rentalNow.getTime() + 30 * 24 * 60 * 60 * 1000),
      deletesAt: new Date(rentalNow.getTime() + 60 * 24 * 60 * 60 * 1000)
    };
    
    // Adaugă calea pozelor în DB - URL-uri Cloudinary
    if (req.files && req.files.length > 0) {
      // Cloudinary returnează URL-ul complet în file.path
      adData.photos = req.files.map(file => file.path);
      // Pentru MongoDB, folosește 'poze' în loc de 'photos'
      adData.poze = req.files.map(file => file.path);
      console.log('📸 Cloudinary URLs salvate:', adData.photos);
    }
    
    console.log('💾 adData înainte de salvare:', adData);
    
    // Încearcă PostgreSQL mai întâi, apoi MongoDB fallback
    const startTime = Date.now();
    let savedAd, database;
    
    if (postgresqlReady) {
      try {
        console.log('⏱️ START rental PostgreSQL save operation...');
        savedAd = await CarRentalAdPG.create(adData);
        database = 'PostgreSQL';
        console.log(`✅ SUCCES! Rental salvat în PostgreSQL cu ID:`, savedAd.id);
      } catch (pgError) {
        console.error('❌ PostgreSQL rental failed, using MongoDB fallback:', pgError.message);
        adData.dateCreated = new Date();
        const ad = new CarRentalAd(adData);
        savedAd = await ad.save();
        database = 'MongoDB';
        console.log(`✅ FALLBACK! Rental salvat în MongoDB cu ID:`, savedAd._id);
      }
    } else {
      // Folosește MongoDB direct pentru rentals
      console.log('⏱️ START rental MongoDB save operation (PostgreSQL not ready)...');
      adData.dateCreated = new Date();
      const ad = new CarRentalAd(adData);
      savedAd = await ad.save();
      database = 'MongoDB';
      console.log(`✅ SUCCES! Rental salvat în MongoDB cu ID:`, savedAd._id);
    }
    
    const endTime = Date.now();
    
    res.status(201).json({ 
      message: `Anunt rental creat cu succes în ${database}!`, 
      id: savedAd.id || savedAd._id,
      duration: `${endTime - startTime}ms`,
      database: database,
      success: true 
    });
  } catch (error) {
    console.error('❌ EROARE la salvarea anunțului rental:', error);
    res.status(500).json({ 
      error: 'Eroare la salvarea anuntului rental: ' + error.message,
      postgresqlReady: postgresqlReady,
      success: false 
    });
  }
});

// Închirieri auto - Listă toate anunturile (PostgreSQL cu MongoDB fallback)
app.get('/api/car-rentals', async (req, res) => {
  try {
    let ads, database;
    
    if (postgresqlReady) {
      try {
        console.log('📋 Încărcare anunțuri rental din PostgreSQL...');
        ads = await CarRentalAdPG.findAll({ 
          where: { isActive: true },
          order: [['createdAt', 'DESC']]
        });
        database = 'PostgreSQL';
        console.log(`📋 Găsite ${ads.length} anunțuri închiriere în PostgreSQL`);
      } catch (pgError) {
        console.error('❌ PostgreSQL rental GET failed, using MongoDB fallback:', pgError.message);
        ads = await CarRentalAd.find({ isActive: true }).sort({ dateCreated: -1 });
        database = 'MongoDB';
        console.log(`📋 FALLBACK: Găsite ${ads.length} anunțuri închiriere în MongoDB`);
      }
    } else {
      console.log('📋 Încărcare anunțuri rental din MongoDB (PostgreSQL not ready)...');
      ads = await CarRentalAd.find({ isActive: true }).sort({ dateCreated: -1 });
      database = 'MongoDB';
      console.log(`📋 Găsite ${ads.length} anunțuri închiriere în MongoDB`);
    }
    
    res.json(ads); // Returnează direct array-ul pentru compatibilitate cu aplicația mobilă
  } catch (error) {
    console.error('❌ Eroare la încărcarea anunturilor rental:', error);
    res.status(500).json({ 
      error: 'Eroare la încărcarea anunturilor rental: ' + error.message,
      postgresqlReady: postgresqlReady,
      success: false 
    });
  }
});

// Închirieri auto - Obține un singur anunț după ID
app.get('/api/car-rentals/:id', async (req, res) => {
  try {
    let ad, database;
    
    if (postgresqlReady) {
      try {
        console.log(`📋 Încărcare anunț rental ${req.params.id} din PostgreSQL...`);
        ad = await CarRentalAdPG.findByPk(req.params.id);
        database = 'PostgreSQL';
      } catch (pgError) {
        console.error('❌ PostgreSQL get-one rental failed, using MongoDB fallback:', pgError.message);
        ad = await CarRentalAd.findById(req.params.id);
        database = 'MongoDB';
      }
    } else {
      console.log(`📋 Încărcare anunț rental ${req.params.id} din MongoDB...`);
      ad = await CarRentalAd.findById(req.params.id);
      database = 'MongoDB';
    }
    
    if (!ad) {
      console.log(`❌ Anunț rental ${req.params.id} nu a fost găsit`);
      return res.status(404).json({ error: 'Anunțul nu a fost găsit' });
    }
    
    console.log(`✅ Anunț rental găsit în ${database}:`, ad.marca, ad.model);
    res.json(ad);
  } catch (error) {
    console.error('❌ Eroare la încărcarea anuntului rental:', error);
    res.status(500).json({ 
      error: 'Eroare la încărcarea anuntului: ' + error.message,
      success: false 
    });
  }
});

// Închirieri auto - Anunturile mele (cu autentificare JWT)
app.get('/api/my-car-rentals', authMiddleware, async (req, res) => {
  try {
    let ads, database;
    const userId = req.user.username; // User din JWT token, nu hardcodat
    const userEmail = req.user.email; // Email din JWT token
    
    console.log('📋 User autentificat (rentals) - username:', userId, ', email:', userEmail);
    
    if (postgresqlReady) {
      try {
        console.log('📋 Încărcare TOATE anunțurile rental utilizator din PostgreSQL...');
        ads = await CarRentalAdPG.findAll({ 
          where: { userId: userId }, // Fără filtru isActive - returnează TOATE
          order: [['createdAt', 'DESC']]
        });
        database = 'PostgreSQL';
        console.log(`📋 Găsite ${ads.length} anunțuri rental utilizator în PostgreSQL`);
      } catch (pgError) {
        console.error('❌ PostgreSQL my-rentals failed, using MongoDB fallback:', pgError.message);
        // Caută după userId SAU email
        ads = await CarRentalAd.find({ 
          $or: [
            { userId: userId },
            { email: userEmail },
            { userEmail: userEmail }
          ]
        }).sort({ dateCreated: -1 });
        database = 'MongoDB';
        console.log(`📋 FALLBACK: Găsite ${ads.length} anunțuri rental utilizator în MongoDB`);
      }
    } else {
      console.log('📋 Încărcare TOATE anunțurile rental utilizator din MongoDB...');
      // Caută după userId SAU email
      ads = await CarRentalAd.find({ 
        $or: [
          { userId: userId },
          { email: userEmail },
          { userEmail: userEmail }
        ]
      }).sort({ dateCreated: -1 });
      database = 'MongoDB';
      console.log(`📋 Găsite ${ads.length} anunțuri rental utilizator în MongoDB`);
    }
    
    // Convertește isActive (boolean) → status (string) pentru frontend
    const adsWithStatus = ads.map(ad => {
      const adObj = ad.toJSON ? ad.toJSON() : ad.get({ plain: true });
      adObj.status = adObj.isActive ? 'activ' : 'inactiv';
      return adObj;
    });
    
    res.json(adsWithStatus);
  } catch (error) {
    console.error('❌ Eroare la încărcarea anunturilor rental utilizator:', error);
    res.status(500).json({ 
      error: 'Eroare la încărcarea anunturilor rental: ' + error.message,
      success: false 
    });
  }
});

// Închirieri auto - Editare anunt
app.put('/api/car-rentals/:id', authMiddleware, async (req, res) => {
  try {
    console.log('🔄 PUT /api/car-rentals/:id - Update anunt');
    console.log('📋 req.body:', req.body);
    console.log('🔍 PostgreSQL ready:', postgresqlReady);
    
    const updateData = { ...req.body };
    
    // Convertește status (string) în isActive (boolean)
    if (updateData.status) {
      updateData.isActive = updateData.status === 'activ';
      delete updateData.status;
      console.log('🔄 Status convertit → isActive:', updateData.isActive);
      // Dacă anunțul este reactivat, resetează termenele de expirare
      if (updateData.isActive) {
        const now = new Date();
        updateData.expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        updateData.deletesAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
        console.log('🔄 Termenele resetate - expiresAt:', updateData.expiresAt);
      }
    }
    
    let updatedAd;
    
    if (postgresqlReady) {
      // PostgreSQL Update
      const ad = await CarRentalAdPG.findOne({ 
        where: { 
          id: req.params.id, 
          userId: req.user.username 
        } 
      });
      
      if (!ad) {
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
      }
      
      await ad.update(updateData);
      updatedAd = ad;
      console.log('✅ PostgreSQL: Anunt actualizat:', updatedAd.id, 'isActive:', updatedAd.isActive);
    } else {
      // MongoDB Fallback
      const ad = await CarRentalAd.findOne({ _id: req.params.id, userId: req.user.username });
      if (!ad) {
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
      }
      
      updatedAd = await CarRentalAd.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      console.log('✅ MongoDB: Anunt actualizat:', updatedAd._id, 'isActive:', updatedAd.isActive);
    }
    
    res.json({ message: 'Anunt actualizat cu succes!', ad: updatedAd });
  } catch (error) {
    console.error('❌ Eroare PUT car-rentals:', error);
    res.status(500).json({ error: 'Eroare la actualizarea anuntului' });
  }
});

// Închirieri auto - Ștergere anunt
app.delete('/api/car-rentals/:id', authMiddleware, async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/car-rentals/:id - Ștergere anunt');
    console.log('📋 ID anunt:', req.params.id);
    console.log('👤 User:', req.user.username);
    console.log('🔍 PostgreSQL ready:', postgresqlReady);
    
    if (postgresqlReady) {
      // PostgreSQL Delete
      const ad = await CarRentalAdPG.findOne({ 
        where: { 
          id: req.params.id, 
          userId: req.user.username 
        } 
      });
      
      if (!ad) {
        console.log('❌ PostgreSQL: Anunt nu a fost gasit sau user fara permisiune');
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
      }
      
      await ad.destroy();
      console.log('✅ PostgreSQL: Anunt șters cu succes:', req.params.id);
    } else {
      // MongoDB Fallback
      const ad = await CarRentalAd.findOne({ _id: req.params.id, userId: req.user.username });
      if (!ad) {
        console.log('❌ MongoDB: Anunt nu a fost gasit sau user fara permisiune');
        return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
      }
      
      await CarRentalAd.findByIdAndDelete(req.params.id);
      console.log('✅ MongoDB: Anunt șters cu succes:', req.params.id);
    }
    
    res.json({ message: 'Anunt șters cu succes!' });
  } catch (error) {
    console.error('❌ Eroare DELETE car-rentals:', error);
    res.status(500).json({ error: 'Eroare la ștergerea anuntului' });
  }
});

// Conversații - Listă pentru utilizatorul logat
app.get('/api/my-conversations', authMiddleware, async (req, res) => {
  try {
    // Folosește username consistent
    const userIdentifier = req.user.username;
    console.log('📋 GET /api/my-conversations - User:', userIdentifier);
    
    // Găsește utilizatorul pentru toate identificatorii posibili
    const currentUser = await User.findOne({ username: userIdentifier });
    const allIdentifiers = [
      userIdentifier,
      currentUser?.email
    ].filter(Boolean);
    
    console.log('🔍 Căutare conversații pentru:', allIdentifiers);
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: { $in: allIdentifiers } },
            { to: { $in: allIdentifiers } }
          ]
        }
      },
      {
        $sort: { date: -1 }
      },
      {
        $group: {
          _id: {
            otherUser: {
              $cond: [
                { $in: ['$from', allIdentifiers] },
                '$to',
                '$from'
              ]
            },
            listingId: '$listingId'
          },
          lastMessage: { $first: '$text' },
          lastDate: { $first: '$date' },
          listingType: { $first: '$listingType' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { lastDate: -1 }
      },
      {
        $project: {
          _id: 0,
          otherUser: '$_id.otherUser',
          listingId: '$_id.listingId',
          lastMessage: 1,
          lastDate: 1,
          listingType: 1,
          count: 1
        }
      }
    ]);
    
    console.log(`✅ Găsite ${conversations.length} conversații`);
    res.json(conversations);
  } catch (error) {
    console.error('❌ Eroare la încărcarea conversațiilor:', error);
    res.status(500).json({ error: 'Eroare la încărcarea conversațiilor' });
  }
});

// -------------------------
// JOB CURĂȚARE AUTOMATĂ ANUNȚURI EXPIRATE
// -------------------------

async function runAdCleanupJob() {
  console.log('🧹 [CLEANUP] Pornire job curățare anunțuri expirate...');
  const now = new Date();
  const { Op } = require('sequelize');

  try {
    // --- PostgreSQL ---
    if (postgresqlReady) {
      // 1. Dezactivează anunțurile de vânzare care au expirat (expiresAt <= now, isActive = true)
      const [deactivatedSales] = await CarSaleAdPG.update(
        { isActive: false },
        { where: { isActive: true, expiresAt: { [Op.lte]: now } } }
      );
      if (deactivatedSales > 0) console.log(`🧹 [CLEANUP] Dezactivate ${deactivatedSales} anunțuri vânzare expirate (PostgreSQL)`);

      // 2. Dezactivează anunțurile de închiriere care au expirat
      const [deactivatedRentals] = await CarRentalAdPG.update(
        { isActive: false },
        { where: { isActive: true, expiresAt: { [Op.lte]: now } } }
      );
      if (deactivatedRentals > 0) console.log(`🧹 [CLEANUP] Dezactivate ${deactivatedRentals} anunțuri închiriere expirate (PostgreSQL)`);

      // 3. Șterge definitiv anunțurile de vânzare unde deletesAt <= now
      const deletedSales = await CarSaleAdPG.destroy(
        { where: { deletesAt: { [Op.lte]: now } } }
      );
      if (deletedSales > 0) console.log(`🧹 [CLEANUP] Șterse definitiv ${deletedSales} anunțuri vânzare (PostgreSQL)`);

      // 4. Șterge definitiv anunțurile de închiriere unde deletesAt <= now
      const deletedRentals = await CarRentalAdPG.destroy(
        { where: { deletesAt: { [Op.lte]: now } } }
      );
      if (deletedRentals > 0) console.log(`🧹 [CLEANUP] Șterse definitiv ${deletedRentals} anunțuri închiriere (PostgreSQL)`);
    }

    // --- MongoDB ---
    if (mongoose.connection.readyState === 1) {
      // 1. Dezactivează anunțuri vânzare expirate
      const resSalesDeact = await CarSaleAd.updateMany(
        { isActive: true, expiresAt: { $lte: now } },
        { $set: { isActive: false } }
      );
      if (resSalesDeact.modifiedCount > 0) console.log(`🧹 [CLEANUP] Dezactivate ${resSalesDeact.modifiedCount} anunțuri vânzare expirate (MongoDB)`);

      // 2. Dezactivează anunțuri închiriere expirate
      const resRentalsDeact = await CarRentalAd.updateMany(
        { isActive: true, expiresAt: { $lte: now } },
        { $set: { isActive: false } }
      );
      if (resRentalsDeact.modifiedCount > 0) console.log(`🧹 [CLEANUP] Dezactivate ${resRentalsDeact.modifiedCount} anunțuri închiriere expirate (MongoDB)`);

      // 3. Șterge definitiv anunțuri vânzare cu deletesAt <= now
      const resSalesDel = await CarSaleAd.deleteMany({ deletesAt: { $lte: now } });
      if (resSalesDel.deletedCount > 0) console.log(`🧹 [CLEANUP] Șterse definitiv ${resSalesDel.deletedCount} anunțuri vânzare (MongoDB)`);

      // 4. Șterge definitiv anunțuri închiriere cu deletesAt <= now
      const resRentalsDel = await CarRentalAd.deleteMany({ deletesAt: { $lte: now } });
      if (resRentalsDel.deletedCount > 0) console.log(`🧹 [CLEANUP] Șterse definitiv ${resRentalsDel.deletedCount} anunțuri închiriere (MongoDB)`);
    }

    console.log('🧹 [CLEANUP] Job finalizat.');
  } catch (err) {
    console.error('❌ [CLEANUP] Eroare în job-ul de curățare:', err.message);
  }
}

// Rulează la fiecare 6 ore (6 * 60 * 60 * 1000 ms)
setInterval(runAdCleanupJob, 6 * 60 * 60 * 1000);
// Rulează și la 5 minute după pornirea serverului (pentru a prinde anunțuri deja expirate)
setTimeout(runAdCleanupJob, 5 * 60 * 1000);

// -------------------------
// RUTE ADMIN
// -------------------------

// Promovare cont la admin (setup inițial - necesită ADMIN_SECRET din .env)
app.post('/admin/promote', async (req, res) => {
  try {
    const { username, secret } = req.body;
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Secret incorect' });
    }
    const user = await User.findOne({
      $or: [{ username }, { email: username?.trim().toLowerCase() }]
    });
    if (!user) return res.status(404).json({ error: 'Utilizator negăsit' });
    user.isAdmin = true;
    await user.save();
    res.json({ message: `Utilizatorul "${user.username}" este acum admin.` });
  } catch (e) {
    res.status(500).json({ error: 'Eroare server' });
  }
});

// Admin - lista utilizatori
app.get('/admin/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'username email fullName isAdmin isBanned telefon role');
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Eroare la încărcarea utilizatorilor' });
  }
});

// Admin - ștergere utilizator
app.delete('/admin/users/:username', adminMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    if (username === req.user.username) {
      return res.status(400).json({ error: 'Nu poți șterge propriul cont de admin' });
    }
    await User.findOneAndDelete({ username });
    res.json({ message: 'Utilizator șters' });
  } catch (e) {
    res.status(500).json({ error: 'Eroare la ștergere' });
  }
});

// Admin - ban/unban utilizator
app.put('/admin/users/:username/ban', adminMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    if (username === req.user.username) {
      return res.status(400).json({ error: 'Nu poți suspenda propriul cont' });
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Utilizator negăsit' });
    user.isBanned = req.body.ban === true;
    await user.save();
    res.json({ message: `Utilizator ${user.isBanned ? 'suspendat' : 'reactivat'}`, isBanned: user.isBanned });
  } catch (e) {
    res.status(500).json({ error: 'Eroare server' });
  }
});

// Admin - lista anunțuri vânzări
app.get('/admin/ads/vanzari', adminMiddleware, async (req, res) => {
  try {
    if (postgresqlReady) {
      const ads = await CarSaleAdPG.findAll({ order: [['createdAt', 'DESC']] });
      return res.json(ads);
    }
    const ads = await CarSaleAd.find({}).sort({ _id: -1 }).limit(500);
    res.json(ads);
  } catch (e) {
    res.status(500).json({ error: 'Eroare la încărcarea anunțurilor' });
  }
});

// Admin - ștergere anunț vânzare
app.delete('/admin/ads/vanzari/:id', adminMiddleware, async (req, res) => {
  try {
    if (postgresqlReady) {
      const ad = await CarSaleAdPG.findOne({ where: { id: req.params.id } });
      if (!ad) return res.status(404).json({ error: 'Anunț negăsit' });
      await ad.destroy();
    } else {
      await CarSaleAd.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Anunț șters' });
  } catch (e) {
    res.status(500).json({ error: 'Eroare la ștergere' });
  }
});

// Admin - lista anunțuri închirieri
app.get('/admin/ads/inchirieri', adminMiddleware, async (req, res) => {
  try {
    if (postgresqlReady) {
      const ads = await CarRentalAdPG.findAll({ order: [['createdAt', 'DESC']] });
      return res.json(ads);
    }
    const ads = await CarRentalAd.find({}).sort({ _id: -1 }).limit(500);
    res.json(ads);
  } catch (e) {
    res.status(500).json({ error: 'Eroare la încărcarea anunțurilor' });
  }
});

// Admin - ștergere anunț închiriere
app.delete('/admin/ads/inchirieri/:id', adminMiddleware, async (req, res) => {
  try {
    if (postgresqlReady) {
      const ad = await CarRentalAdPG.findOne({ where: { id: req.params.id } });
      if (!ad) return res.status(404).json({ error: 'Anunț negăsit' });
      await ad.destroy();
    } else {
      await CarRentalAd.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Anunț șters' });
  } catch (e) {
    res.status(500).json({ error: 'Eroare la ștergere' });
  }
});

// -------------------------
// SERVIRE REACT APP (SPA fallback)
// -------------------------
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all: toate rutele necunoscute returnează index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// -------------------------
// PORNIRE SERVER
// -------------------------

// Start server
const PORT = process.env.PORT || 3001; // Pentru dezvoltare locală folosește 3001
const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Eroare la pornirea serverului:', err);
    process.exit(1);
  }
  console.log(`🚀 Server pornit pe PORT: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.RAILWAY_ENVIRONMENT) {
    console.log(`🚄 Rulează pe Railway!`);
  }
  
  // Test automat intern pentru a verifica că serverul funcționează
  setTimeout(() => {
    const http = require('http');
    const req = http.get(`http://localhost:${PORT}/health`, (res) => {
      console.log('✅ Server confirmat funcțional - health check OK');
    });
    req.on('error', (e) => {
      console.error('⚠️ Health check intern eșuat:', e.message);
    });
    req.setTimeout(2000);
  }, 500);
});

// Handler pentru erori neașteptate
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});