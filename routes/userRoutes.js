const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Home route
router.get('/', (req, res) => {
    res.render('home'); 
  });



// Route to render the user registration form
router.get('/register', userController.registerForm);
// Route to register a new user
router.post('/registeruser', userController.registerUser);
// Route to view all people
router.get('/view-people', userController.viewAllPeople);



//Dropdown waley routes
// Route to get states based on countryId
router.get('/states/:countryId', userController.getStatesByCountry);
// Route to get cities based on stateId
router.get('/cities/:stateId', userController.getCitiesByState);
// Route to fetch phone code based on countryId
router.get('/phonecode/:countryId', userController.getPhoneCodeByCountry);



// View dashboard 
router.get('/dashboard', userController.viewDashboard);



// View and add countries
router.get('/view-countries', userController.getCountries);
router.post('/add-country', userController.addCountry);



// View and add states
router.get('/view-states', userController.getStates);
router.post('/add-state', userController.addState);

//View and add a city 
router.post('/add-city', userController.addCity);
router.get('/view-cities', userController.getCities);



// View and add companies
router.get('/view-companies', userController.getCompanies);
router.post('/add-company', userController.addCompany);

// View and add job designations
router.get('/view-job-designations', userController.getJobDesignations);
router.post('/add-job-designation', userController.addJobDesignation);


module.exports = router;
