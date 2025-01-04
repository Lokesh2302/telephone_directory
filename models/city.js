const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const State = require('./state');


const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: false,  
    references: {
      model: State,  
      key: 'id',  
    },
  },
}, {
  timestamps: false,  
  indexes: [
    {
      unique: true,
      fields: ['stateId', 'name'],  
    }
  ]
});


City.belongsTo(State, { foreignKey: 'stateId' });
State.hasMany(City, { foreignKey: 'stateId' });

module.exports = City;
