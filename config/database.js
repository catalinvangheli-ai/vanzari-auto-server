// config/database.js
const { Sequelize } = require('sequelize');

// Railway oferă DATABASE_URL automat pentru PostgreSQL
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/vanzari_auto_app';

console.log('🐘 PostgreSQL Database URL configured:', databaseUrl.replace(/:[^@]+@/, ':***@'));

// Configurație Sequelize pentru PostgreSQL
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false // Railway necesită acest setări SSL
    } : false
  },
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Funcție pentru testarea conexiunii
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    return false;
  }
}

// Funcție pentru sincronizarea bazei de date
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // alter: true pentru a actualiza schema
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
  }
}

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};