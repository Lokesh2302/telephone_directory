const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Country = require('./country');


const State = sequelize.define('State', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: Country,  
      key: 'id',  
    },
  },
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['countryId', 'name'],
    }
  ]
});


State.belongsTo(Country, { foreignKey: 'countryId' });
Country.hasMany(State,   { foreignKey: 'countryId' });

module.exports = State;
