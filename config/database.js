const { Sequelize } = require('sequelize');

// Set up a connection to the MySQL database using Sequelize
const sequelize = new Sequelize('phonedirectory', 'root', 'Area@123', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
