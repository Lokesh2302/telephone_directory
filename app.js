const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const editDeleteRoutes = require('./routes/editDeleteRoutes');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(userRoutes);
app.use(editDeleteRoutes);

// Sync the database 
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.log('Error syncing the database:', err);
  });

// Start server
app.listen(3333, () => {
  console.log('Server running on http://localhost:3333');
});

