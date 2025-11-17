// Script pentru actualizarea anunțurilor vechi cu datele utilizatorului corect
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://catalinvangheli_db_user:eanoagDnz9LrvNgr@cluster0.qgzanu4.mongodb.net/vanzariAutoApp?retryWrites=true&w=majority&appName=VanzariAutoApp';

// Modelele simpliste pentru update
const CarSaleAdSchema = new mongoose.Schema({}, { strict: false, collection: 'carsaleads' });
const CarRentalAdSchema = new mongoose.Schema({}, { strict: false, collection: 'carrentalads' });

const CarSaleAd = mongoose.model('CarSaleAd', CarSaleAdSchema);
const CarRentalAd = mongoose.model('CarRentalAd', CarRentalAdSchema);

async function migrateUserData() {
  try {
    console.log('🔌 Conectare la MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectat la MongoDB!');

    // Datele utilizatorului corect
    const correctUserId = 'Catalin';
    const correctEmail = 'catalinvangheli@gmail.com';
    const correctFullName = 'Catalin Vangheli'; // Înlocuiește cu numele tău real

    console.log('\n📋 Actualizare anunțuri de vânzare...');
    
    // Găsește toate anunțurile care NU au email sau au userId = 'test-user'
    const salesFilter = {
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: '' },
        { userId: 'test-user' },
        { userId: '' },
        { userId: null }
      ]
    };

    const salesBefore = await CarSaleAd.find(salesFilter);
    console.log(`📊 Găsite ${salesBefore.length} anunțuri de vânzare de actualizat`);

    if (salesBefore.length > 0) {
      console.log('📝 Anunțuri găsite:');
      salesBefore.forEach(ad => {
        console.log(`  - ${ad.marca} ${ad.model} (userId: ${ad.userId}, email: ${ad.email})`);
      });
    }

    const salesResult = await CarSaleAd.updateMany(
      salesFilter,
      { 
        $set: { 
          userId: correctUserId,
          username: correctUserId,
          email: correctEmail,
          userEmail: correctEmail,
          fullName: correctFullName
        } 
      }
    );

    console.log(`✅ Actualizate ${salesResult.modifiedCount} anunțuri de vânzare`);

    console.log('\n📋 Actualizare anunțuri de închiriere...');
    
    const rentalsFilter = {
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: '' },
        { userId: 'test-user' },
        { userId: '' },
        { userId: null }
      ]
    };

    const rentalsBefore = await CarRentalAd.find(rentalsFilter);
    console.log(`📊 Găsite ${rentalsBefore.length} anunțuri de închiriere de actualizat`);

    if (rentalsBefore.length > 0) {
      console.log('📝 Anunțuri găsite:');
      rentalsBefore.forEach(ad => {
        console.log(`  - ${ad.marca} ${ad.model} (userId: ${ad.userId}, email: ${ad.email})`);
      });
    }

    const rentalsResult = await CarRentalAd.updateMany(
      rentalsFilter,
      { 
        $set: { 
          userId: correctUserId,
          username: correctUserId,
          email: correctEmail,
          userEmail: correctEmail,
          fullName: correctFullName
        } 
      }
    );

    console.log(`✅ Actualizate ${rentalsResult.modifiedCount} anunțuri de închiriere`);

    console.log('\n🎉 Migrare completă!');
    console.log(`📊 Total actualizate: ${salesResult.modifiedCount + rentalsResult.modifiedCount} anunțuri`);

    // Verifică rezultatele
    console.log('\n🔍 Verificare finală...');
    const allSales = await CarSaleAd.find({ userId: correctUserId });
    const allRentals = await CarRentalAd.find({ userId: correctUserId });
    
    console.log(`📋 Anunțuri de vânzare pentru ${correctUserId}: ${allSales.length}`);
    console.log(`📋 Anunțuri de închiriere pentru ${correctUserId}: ${allRentals.length}`);

    await mongoose.disconnect();
    console.log('\n👋 Deconectat de la MongoDB');
    
  } catch (error) {
    console.error('❌ Eroare la migrare:', error);
    process.exit(1);
  }
}

// Rulează migrarea
migrateUserData();
