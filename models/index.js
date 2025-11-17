// models/index.js - PostgreSQL models index
const { sequelize, testConnection, syncDatabase } = require('../config/database_pg');

// Import models
const CarSaleAd = require('./CarSaleAd');
const CarRentalAd = require('./CarRentalAd');

// Export all models
const models = {
  CarSaleAd,
  CarRentalAd,
  sequelize,
  testConnection,
  syncDatabase
};

module.exports = models;