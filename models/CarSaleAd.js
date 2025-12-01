// models/CarSaleAd.js - PostgreSQL model pentru anunturi auto vânzare
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database_pg');

const CarSaleAd = sequelize.define('CarSaleAd', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  anFabricatie: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  km: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pret: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  culoare: {
    type: DataTypes.STRING,
    allowNull: true
  },
  carburant: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transmisie: {
    type: DataTypes.STRING,
    allowNull: true
  },
  putere: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  capacitateCilindrica: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  descriere: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  locatie: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'car_sale_ads',
  timestamps: true, // createdAt și updatedAt automat
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['marca', 'model']
    },
    {
      fields: ['pret']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = CarSaleAd;