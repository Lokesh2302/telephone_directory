const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Company = require('./company');  


const JobDesignation = sequelize.define('JobDesignation', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  // companyId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: Company,  
  //     key: 'id',      
  //   },
  // },
}, {
  timestamps: false,
  // indexes: [
  //   {
  //     unique: true,
  //     fields: ['companyId', 'title'], 
  //   }
  // ]
});


// JobDesignation.belongsTo(Company, { foreignKey: 'companyId' });
// Company.hasMany(JobDesignation, { foreignKey: 'companyId' });

module.exports = JobDesignation;
