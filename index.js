// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// PostgreSQL imports
const { CarSaleAd: CarSaleAdPG, CarRentalAd: CarRentalAdPG, testConnection, syncDatabase } = require('./models');

// Global flag pentru PostgreSQL status
let postgresqlReady = false;

const app = express();

// -------------------------
// CLOUDINARY CONFIGURATION
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'db0htnrxf',
  api_key: process.env.CLOUDINARY_API_KEY || '533557596816111',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'HXWkfZ1FStsuEqlhky1nUWwDJKA'
});

console.log('☁️ Cloudinary configured:', cloudinary.config().cloud_name);

// Asigur că folderul uploads există (legacy fallback)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Folder uploads creat');
}

// Middleware
app.use(cors({
  origin: '*', // Permite toate originile pentru testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Schimbat în false pentru origine *
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servire fișiere statice (politică de confidențialitate, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Logging middleware
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

// Funcție pentru a încerca conectarea MongoDB
async function connectToMongoDB() {
  // Prima încercare: MongoDB Atlas
  try {
    console.log('🔄 Încercare conectare la MongoDB Atlas...');
    console.log('🌐 Mongo Atlas URI (hidden password):', mongoAtlasUri.replace(/:[^@]+@/, ':***@'));
    
    await mongoose.connect(mongoAtlasUri, {
      serverSelectionTimeoutMS: 15000, // Timeout redus pentru Atlas
      socketTimeoutMS: 30000,
      connectTimeoutMS: 15000,
      maxPoolSize: 5,
      bufferCommands: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ SUCCES! Conectat la MongoDB Atlas");
    console.log("🔌 Connection state:", mongoose.connection.readyState);
    return 'atlas';
  } catch (atlasErr) {
    console.error("❌ EROARE MongoDB Atlas:", atlasErr.message);
    console.error("🔍 Atlas Error details:", atlasErr.code, atlasErr.codeName);
    
    // A doua încercare: MongoDB local (doar pentru development)
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
    console.log("🔧 Pentru a rezolva: Verifică MongoDB Atlas Network Access pentru Railway IP");
    console.log("🌐 Railway region: europe-west4");
    return 'none';
  }
}

// Pornește conexiunea MongoDB asincron
connectToMongoDB().then(result => {
  console.log(`📊 MongoDB connection result: ${result}`);
});

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
initializePostgreSQL().then(success => {
  postgresqlReady = success;
  console.log(`📊 PostgreSQL initialization result: ${success ? 'SUCCESS' : 'FAILED'}`);
  if (!success) {
    console.log('⚠️ Server will run without PostgreSQL - usando MongoDB fallback');
  }
});
  

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
  telefon: String
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
  date: { type: Date, default: Date.now }
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
  descriere: String,
  locatie: String,
  telefon: String,
  photos: [String],
  dateCreated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
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
  descriere: String,
  locatie: String,
  telefon: String,
  photos: [String],
  dateCreated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}));

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
    const payload = jwt.verify(token, 'secret');
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
    
    const token = jwt.sign({ username: user.username }, 'secret');
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

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Email sau parolă incorecte' });
  }

  const token = jwt.sign({ username: user.username }, 'secret');
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
    if (!user) {
      return res.status(404).json({ error: 'Nu există un cont cu acest email' });
    }

    // Generează un token temporar pentru resetare (valabil 1 oră)
    const resetToken = jwt.sign(
      { username: user.username, purpose: 'reset-password' }, 
      'secret', 
      { expiresIn: '1h' }
    );

  console.log(`🔑 Token resetare parolă pentru ${normalizedEmail}: ${resetToken}`);
    
    // În producție, ar trebui trimis pe email
    // Pentru dezvoltare, returnează tokenul în răspuns
    res.json({ 
      message: 'Token de resetare generat', 
      resetToken: resetToken,
      info: 'În producție, acest token ar fi trimis pe email'
    });
  } catch (e) {
    console.error('Reset password request error:', e);
    res.status(500).json({ error: 'Eroare server la cererea de resetare' });
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
      decoded = jwt.verify(token, 'secret');
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
  const message = new Message(req.body);
  await message.save();
  res.sendStatus(201);
});
app.get('/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { from: user1, to: user2 },
      { from: user2, to: user1 }
    ]
  }).sort({ date: 1 });
  res.json(messages);
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
app.post('/api/car-sales', upload.array('poze', 10), async (req, res) => {
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
    
    const adData = {
      ...req.body,
      userId: 'test-user', // Default user pentru testare
      username: 'test-user',
      dataCrearii: new Date()
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

// Vânzări auto - Listă toate anunturile (PostgreSQL cu MongoDB fallback)
app.get('/api/car-sales', async (req, res) => {
  try {
    let ads, database;
    
    if (postgresqlReady) {
      try {
        console.log('📋 Încărcare anunțuri din PostgreSQL...');
        ads = await CarSaleAdPG.findAll({ 
          where: { isActive: true },
          order: [['createdAt', 'DESC']]
        });
        database = 'PostgreSQL';
        console.log(`📋 Găsite ${ads.length} anunțuri vânzare în PostgreSQL`);
      } catch (pgError) {
        console.error('❌ PostgreSQL GET failed, using MongoDB fallback:', pgError.message);
        ads = await CarSaleAd.find({ isActive: true }).sort({ dateCreated: -1 });
        database = 'MongoDB';
        console.log(`📋 FALLBACK: Găsite ${ads.length} anunțuri vânzare în MongoDB`);
      }
    } else {
      console.log('📋 Încărcare anunțuri din MongoDB (PostgreSQL not ready)...');
      ads = await CarSaleAd.find({ isActive: true }).sort({ dateCreated: -1 });
      database = 'MongoDB';
      console.log(`📋 Găsite ${ads.length} anunțuri vânzare în MongoDB`);
    }
    
    res.json(ads); // Returnează direct array-ul pentru compatibilitate cu aplicația mobilă
  } catch (error) {
    console.error('❌ Eroare la încărcarea anunturilor:', error);
    res.status(500).json({ 
      error: 'Eroare la încărcarea anunturilor: ' + error.message,
      postgresqlReady: postgresqlReady,
      success: false 
    });
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
    
    console.log('📋 User autentificat:', userId);
    
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
      ads = await CarSaleAd.find({ userId: userId }).sort({ dateCreated: -1 }); // TOATE
      database = 'MongoDB';
      console.log(`📋 Găsite ${ads.length} anunțuri utilizator în MongoDB`);
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
    
    const ad = await CarSaleAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
    }
    
    // Convertește status (string) în isActive (boolean)
    const updateData = { ...req.body };
    if (updateData.status) {
      updateData.isActive = updateData.status === 'activ';
      delete updateData.status; // Șterge câmpul status pentru că folosim isActive în DB
      console.log('🔄 Status convertit:', updateData.status, '→ isActive:', updateData.isActive);
    }
    
    const updatedAd = await CarSaleAd.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true } // Returnează documentul actualizat
    );
    
    console.log('✅ Anunt actualizat:', updatedAd._id, 'isActive:', updatedAd.isActive);
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
    
    const ad = await CarSaleAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      console.log('❌ Anunt nu a fost gasit sau user fara permisiune');
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
    }
    
    await CarSaleAd.findByIdAndDelete(req.params.id);
    console.log('✅ Anunt șters cu succes:', req.params.id);
    res.json({ message: 'Anunt șters cu succes!' });
  } catch (error) {
    console.error('❌ Eroare DELETE car-sales:', error);
    res.status(500).json({ error: 'Eroare la ștergerea anuntului' });
  }
});

// Închirieri auto - Creare anunt (PostgreSQL cu MongoDB fallback)
app.post('/api/car-rentals', upload.array('poze'), async (req, res) => {
  try {
    console.log('🟢 POST /api/car-rentals - Începe procesarea...');
    console.log('🔍 PostgreSQL ready:', postgresqlReady);
    console.log('📋 req.body:', req.body);
    console.log('📋 req.files:', req.files);
    
    const adData = {
      ...req.body,
      userId: 'test-user', // Default user pentru testare
      username: 'test-user'
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
    
    console.log('📋 User autentificat (rentals):', userId);
    
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
        ads = await CarRentalAd.find({ userId: userId }).sort({ dateCreated: -1 }); // TOATE
        database = 'MongoDB';
        console.log(`📋 FALLBACK: Găsite ${ads.length} anunțuri rental utilizator în MongoDB`);
      }
    } else {
      console.log('📋 Încărcare TOATE anunțurile rental utilizator din MongoDB...');
      ads = await CarRentalAd.find({ userId: userId }).sort({ dateCreated: -1 }); // TOATE
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
    
    const ad = await CarRentalAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
    }
    
    // Convertește status (string) în isActive (boolean)
    const updateData = { ...req.body };
    if (updateData.status) {
      updateData.isActive = updateData.status === 'activ';
      delete updateData.status;
      console.log('🔄 Status convertit:', updateData.status, '→ isActive:', updateData.isActive);
    }
    
    const updatedAd = await CarRentalAd.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    console.log('✅ Anunt actualizat:', updatedAd._id, 'isActive:', updatedAd.isActive);
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
    
    const ad = await CarRentalAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      console.log('❌ Anunt nu a fost gasit sau user fara permisiune');
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
    }
    
    await CarRentalAd.findByIdAndDelete(req.params.id);
    console.log('✅ Anunt șters cu succes:', req.params.id);
    res.json({ message: 'Anunt șters cu succes!' });
  } catch (error) {
    console.error('❌ Eroare DELETE car-rentals:', error);
    res.status(500).json({ error: 'Eroare la ștergerea anuntului' });
  }
});

// Conversații - Listă pentru utilizatorul logat
app.get('/api/my-conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: req.user.username },
            { to: req.user.username }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from', req.user.username] },
              '$to',
              '$from'
            ]
          },
          lastMessage: { $last: '$text' },
          lastDate: { $last: '$date' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { lastDate: -1 }
      }
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la încărcarea conversațiilor' });
  }
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