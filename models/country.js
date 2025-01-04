const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Country = sequelize.define('Country', {
 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
  },
 
  shortname: {
    type: DataTypes.STRING,
    allowNull: false,  
    unique: true,  
  },
 
  name: {
    type: DataTypes.STRING,
    allowNull: false,  
    unique: true,
  },
  
  phonecode: {
    type: DataTypes.INTEGER,
    allowNull: false,  
    unique: false,
  },
}, {
  timestamps: false, 
});

module.exports = Country;