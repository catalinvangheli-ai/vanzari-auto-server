// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// PostgreSQL imports
const { CarSaleAd: CarSaleAdPG, CarRentalAd: CarRentalAdPG, testConnection, syncDatabase } = require('./models');

const app = express();

// Asigur că folderul uploads există
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

// Inițializează PostgreSQL
async function initializePostgreSQL() {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      await syncDatabase();
      console.log('🚀 PostgreSQL initialized successfully!');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ PostgreSQL initialization failed:', error.message);
    return false;
  }
}

// Pornește PostgreSQL
initializePostgreSQL().then(success => {
  console.log(`📊 PostgreSQL initialization result: ${success ? 'SUCCESS' : 'FAILED'}`);
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
// MULTER (upload poze)
// -------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user.username + ext);
  }
});
const upload = multer({ storage });
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
    const { username, password, email, fullName, role, skills } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username și parolă sunt obligatorii' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username deja folosit' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hash,
      email: email || "",
      fullName: fullName || "",
      role: role || "beneficiar",
      skills: skills || [],
      photo: "",
    });
    await user.save();
    res.sendStatus(201);
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Eroare server la înregistrare' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Utilizator inexistent" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Parolă greșită" });

  const token = jwt.sign({ username: user.username }, 'secret');
  res.json({ token, username: user.username });
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

// Vânzări auto - Creare anunt (TEMP: fără autentificare pentru testare)
app.post('/api/car-sales', async (req, res) => {
  try {
    console.log('🔥 CERERE PRIMITĂ pentru salvarea anunțului!');
    console.log('📡 IP client:', req.ip);
    console.log('� MongoDB connection state:', mongoose.connection.readyState);
    
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
    
    console.log('📝 Salvez anunt nou:', JSON.stringify(adData, null, 2));
    
    // SALVARE în PostgreSQL cu timeout explicit
    const startTime = Date.now();
    console.log('⏱️ START PostgreSQL save operation...');
    
    // Creează anunțul în PostgreSQL
    const savedAd = await Promise.race([
      CarSaleAdPG.create(adData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PostgreSQL save timeout after 15s')), 15000)
      )
    ]);
    
    const endTime = Date.now();
    console.log(`✅ SUCCES! Anunt salvat în PostgreSQL in ${endTime - startTime}ms cu ID:`, savedAd.id);
    res.status(201).json({ 
      message: 'Anunt creat cu succes în PostgreSQL!', 
      id: savedAd.id,
      duration: `${endTime - startTime}ms`,
      database: 'PostgreSQL',
      success: true 
    });
  } catch (error) {
    console.error('❌ EROARE la salvarea anunțului PostgreSQL:', error);
    res.status(500).json({ 
      error: 'Eroare la salvarea anuntului PostgreSQL: ' + error.message,
      success: false 
    });
  }
});

// Vânzări auto - Listă toate anunturile (PostgreSQL)
app.get('/api/car-sales', async (req, res) => {
  try {
    const ads = await CarSaleAdPG.findAll({ 
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    console.log(`📋 Găsite ${ads.length} anunțuri vânzare în PostgreSQL`);
    res.json(ads);
  } catch (error) {
    console.error('❌ Eroare la încărcarea anunturilor PostgreSQL:', error);
    res.status(500).json({ error: 'Eroare la încărcarea anunturilor din PostgreSQL' });
  }
});

// Vânzări auto - Anunturile mele
app.get('/api/my-car-sales', authMiddleware, async (req, res) => {
  try {
    const ads = await CarSaleAd.find({ userId: req.user.username }).sort({ dateCreated: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la încărcarea anunturilor' });
  }
});

// Vânzări auto - Editare anunt
app.put('/api/car-sales/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await CarSaleAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
    }
    
    await CarSaleAd.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Anunt actualizat cu succes!' });
  } catch (error) {
    res.status(500).json({ error: 'Eroare la actualizarea anuntului' });
  }
});

// Vânzări auto - Ștergere anunt
app.delete('/api/car-sales/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await CarSaleAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
    }
    
    await CarSaleAd.findByIdAndDelete(req.params.id);
    res.json({ message: 'Anunt șters cu succes!' });
  } catch (error) {
    res.status(500).json({ error: 'Eroare la ștergerea anuntului' });
  }
});

// Închirieri auto - Creare anunt (TEMP: fără autentificare pentru testare)
app.post('/api/car-rentals', upload.array('poze'), async (req, res) => {
  try {
    console.log('🟢 POST /api/car-rentals - Începe procesarea...');
    console.log('� MongoDB connection state:', mongoose.connection.readyState);
    
    // VERIFICĂ CONEXIUNEA MONGODB ÎNAINTE DE SALVARE
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB nu este conectat pentru rentals! State:', mongoose.connection.readyState);
      return res.status(500).json({ 
        error: 'Database connection not ready',
        connectionState: mongoose.connection.readyState,
        success: false 
      });
    }
    
    console.log('�📋 req.body:', req.body);
    console.log('📋 Object.keys(req.body):', Object.keys(req.body));
    console.log('📋 req.files:', req.files);
    
    const adData = {
      ...req.body,
      userId: 'test-user', // Default user pentru testare
      username: 'test-user'
    };
    
    // Adaugă calea pozelor în DB
    if (req.files && req.files.length > 0) {
      adData.photos = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    console.log('💾 adData înainte de salvare PostgreSQL:', adData);
    
    // TIMEOUT EXPLICIT pentru salvare rentals în PostgreSQL
    const startTime = Date.now();
    console.log('⏱️ START rental PostgreSQL save operation...');
    
    // Creează anunțul rental în PostgreSQL
    const savedAd = await Promise.race([
      CarRentalAdPG.create(adData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PostgreSQL rental save timeout after 15s')), 15000)
      )
    ]);
    
    const endTime = Date.now();
    console.log(`✅ SUCCES! Rental salvat în PostgreSQL in ${endTime - startTime}ms cu ID:`, savedAd.id);
    
    res.status(201).json({ 
      message: 'Anunt rental creat cu succes în PostgreSQL!', 
      id: savedAd.id,
      duration: `${endTime - startTime}ms`,
      database: 'PostgreSQL',
      success: true 
    });
  } catch (error) {
    console.error('❌ EROARE la salvarea anunțului rental PostgreSQL:', error);
    res.status(500).json({ 
      error: 'Eroare la salvarea anuntului rental PostgreSQL: ' + error.message,
      success: false 
    });
  }
});

// Închirieri auto - Listă toate anunturile (PostgreSQL)
app.get('/api/car-rentals', async (req, res) => {
  try {
    const ads = await CarRentalAdPG.findAll({ 
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    console.log(`📋 Găsite ${ads.length} anunțuri închiriere în PostgreSQL`);
    res.json(ads);
  } catch (error) {
    console.error('❌ Eroare la încărcarea anunturilor rental PostgreSQL:', error);
    res.status(500).json({ error: 'Eroare la încărcarea anunturilor rental din PostgreSQL' });
  }
});

// Închirieri auto - Anunturile mele
app.get('/api/my-car-rentals', authMiddleware, async (req, res) => {
  try {
    const ads = await CarRentalAd.find({ userId: req.user.username }).sort({ dateCreated: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la încărcarea anunturilor' });
  }
});

// Închirieri auto - Editare anunt
app.put('/api/car-rentals/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await CarRentalAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl editezi' });
    }
    
    await CarRentalAd.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Anunt actualizat cu succes!' });
  } catch (error) {
    res.status(500).json({ error: 'Eroare la actualizarea anuntului' });
  }
});

// Închirieri auto - Ștergere anunt
app.delete('/api/car-rentals/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await CarRentalAd.findOne({ _id: req.params.id, userId: req.user.username });
    if (!ad) {
      return res.status(404).json({ error: 'Anuntul nu a fost găsit sau nu ai permisiunea să îl ștergi' });
    }
    
    await CarRentalAd.findByIdAndDelete(req.params.id);
    res.json({ message: 'Anunt șters cu succes!' });
  } catch (error) {
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
const PORT = process.env.PORT || 3000; // Railway va seta automat PORT
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