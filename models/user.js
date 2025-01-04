const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Country = require('./country');
const State = require('./state');
const City = require('./city');
const Company = require('./company');
const JobDesignation = require('./jobDesignation');


const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  telephone_number: {
    type: DataTypes.BIGINT(10),
    allowNull: false,  
    unique: true,
},
  phoneCode: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
}, {
  timestamps: false, 
});


User.belongsTo(Country, { foreignKey: 'countryId' });          
User.belongsTo(State, { foreignKey: 'stateId' });              
User.belongsTo(City, { foreignKey: 'cityId' });                 
User.belongsTo(Company, { foreignKey: 'companyId' });          
User.belongsTo(JobDesignation, { foreignKey: 'jobDesignationId' }); 


Country.hasMany(User, { foreignKey: 'countryId' });            
State.hasMany(User, { foreignKey: 'stateId' });                
City.hasMany(User, { foreignKey: 'cityId' });                  
Company.hasMany(User, { foreignKey: 'companyId' });            
JobDesignation.hasMany(User, { foreignKey: 'jobDesignationId' });  


module.exports = User;
