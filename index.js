// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// Conectare la MongoDB Atlas - Cloud database cu opțiuni de timeout
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://catalinvangheli_db_user:eanoagDnz9LrvNgr@cluster0.qgzanu4.mongodb.net/vanzariAutoApp?retryWrites=true&w=majority&maxPoolSize=10&maxIdleTimeMS=30000';

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 60000, // 60 secunde timeout
  socketTimeoutMS: 60000, // 60 secunde socket timeout
  bufferMaxEntries: 0, // Disable mongoose buffering
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5, // Minimum number of connections in the pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
})
  .then(() => console.log("✅ Conectat la MongoDB Atlas - Vanzari Auto Database"))
  .catch(err => console.error("❌ Eroare MongoDB:", err));
  

// -------------------------
// MODELE
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
  res.json({ status: 'ok' });
});

// -------------------------
// RUTE PENTRU ANUNTURI AUTO
// -------------------------

// Vânzări auto - Creare anunt (TEMP: fără autentificare pentru testare)
app.post('/api/car-sales', async (req, res) => {
  try {
    console.log('🔥 CERERE PRIMITĂ pentru salvarea anunțului!');
    console.log('📡 IP client:', req.ip);
    console.log('📡 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📝 Body primit:', JSON.stringify(req.body, null, 2));
    
    const adData = {
      ...req.body,
      userId: 'test-user', // Default user pentru testare
      username: 'test-user',
      dataCrearii: new Date()
    };
    
    console.log('📝 Salvez anunt nou:', JSON.stringify(adData, null, 2));
    
    const ad = new CarSaleAd(adData);
    await ad.save();
    
    console.log('✅ SUCCES! Anunt salvat cu ID:', ad._id);
    res.status(201).json({ 
      message: 'Anunt creat cu succes!', 
      id: ad._id,
      success: true 
    });
  } catch (error) {
    console.error('❌ EROARE la salvarea anunțului:', error);
    res.status(500).json({ 
      error: 'Eroare la salvarea anuntului: ' + error.message,
      success: false 
    });
  }
});

// Vânzări auto - Listă toate anunturile
app.get('/api/car-sales', async (req, res) => {
  try {
    const ads = await CarSaleAd.find({ isActive: true }).sort({ dateCreated: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la încărcarea anunturilor' });
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
    console.log('📋 req.body:', req.body);
    console.log('📋 Object.keys(req.body):', Object.keys(req.body));
    console.log('📋 req.files:', req.files);
    
    const adData = {
      ...req.body,
      userId: 'test-user', // Default user pentru testare
      username: 'test-user'
    };
    
    // Adaugă calea pozelor în DB
    if (req.files && req.files.length > 0) {
      adData.poze = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    console.log('💾 adData înainte de salvare:', adData);
    
    const ad = new CarRentalAd(adData);
    await ad.save();
    res.status(201).json({ message: 'Anunt creat cu succes!', id: ad._id });
  } catch (error) {
    console.error('Eroare salvare anunt închiriere:', error);
    res.status(500).json({ error: 'Eroare la salvarea anuntului' });
  }
});

// Închirieri auto - Listă toate anunturile
app.get('/api/car-rentals', async (req, res) => {
  try {
    const ads = await CarRentalAd.find({ isActive: true }).sort({ dateCreated: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la încărcarea anunturilor' });
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