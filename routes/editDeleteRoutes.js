const express = require('express');
const router = express.Router();
const editDeleteController = require('../controllers/editDeleteController');



// Edit routes
router.get('/edit-country/:id', editDeleteController.editCountry);
router.post('/edit-country/:id', editDeleteController.updateCountry);
router.get('/edit-state/:id', editDeleteController.editState);
router.post('/edit-state/:id', editDeleteController.updateState);
router.get('/edit-city/:id', editDeleteController.editCity);
router.post('/edit-city/:id', editDeleteController.updateCity);
router.get('/edit-company/:id', editDeleteController.editCompany);
router.post('/edit-company/:id', editDeleteController.updateCompany);
router.get('/edit-job-designation/:id', editDeleteController.editJobDesignation);
router.post('/edit-job-designation/:id', editDeleteController.updateJobDesignation);
router.get('/edit-person/:id', editDeleteController.editPerson);
router.post('/edit-person/:id', editDeleteController.updatePerson);


// Delete routes
router.get('/delete-person/:id', editDeleteController.deletePerson);
router.get('/delete-country/:id', editDeleteController.deleteCountry);
router.get('/delete-state/:id', editDeleteController.deleteState);
router.get('/delete-city/:id', editDeleteController.deleteCity);
router.get('/delete-company/:id', editDeleteController.deleteCompany);
router.get('/delete-job-designation/:id', editDeleteController.deleteJobDesignation);

module.exports = router;