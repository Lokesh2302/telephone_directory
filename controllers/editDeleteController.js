const User = require('../models/user');
const Country = require('../models/country');
const State = require('../models/state');
const City = require('../models/city');
const Company = require('../models/company');
const JobDesignation = require('../models/jobDesignation');
const { Op } = require('sequelize');

module.exports = {


  // Edit country
  editCountry: async (req, res) => {
    try {
      const countryId = req.params.id;
      const country = await Country.findOne({ where: { id: countryId } });
      if (!country) {
        return res.status(404).send("Country not found.");//iski jarurat jab aayegi agar 2 ya multiple users use kar rahey ho 
      }
      const countries = await Country.findAll();
      res.render('editCountry', { country, countries });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching country.");
    }
  },

  updateCountry: async (req, res) => {
    try {
      const countryId = req.params.id;
      const { name, shortname, phonecode } = req.body;

      const existingCountryByName = await Country.findOne({ where: { name: name } });
      const existingCountryByShortname = await Country.findOne({ where: { shortname: shortname } });

      if (existingCountryByName && existingCountryByName.id !== parseInt(countryId)) {
        return res.status(400).send('Country with the same name already exists');
      }
      if (existingCountryByShortname && existingCountryByShortname.id !== parseInt(countryId)) {
        return res.status(400).send('Shortname is already assigned to a different country');
      }
      await Country.update({ name, shortname, phonecode }, { where: { id: countryId } });
      res.redirect('/view-countries');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating country.");
    }
  },
///////////////////////////////////////////////////////////////////////////////////////////////
  // Edit state
  editState: async (req, res) => {
    try {
      const stateId = req.params.id;
      const state = await State.findOne({
        where: { id: stateId },
        include: [{ model: Country }]
      });
      if (!state) {
        return res.status(404).send("State not found.");
      }
      const countries = await Country.findAll();
      res.render('editState', { state, countries });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching state.");
    }
  },

  updateState: async (req, res) => {
    try {
      const stateId = req.params.id;
      const { name } = req.body;

      const existingState = await State.findOne({ where: { name, countryId: stateId } });
      if (existingState && existingState.id !== parseInt(stateId)) {
        return res.status(400).send('State already exists in this country');
      }
      await State.update({ name }, { where: { id: stateId } });
      res.redirect('/view-states');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating state.");
    }
  },

/////////////////////////////////////////////////////////////////////////////////////
  // Edit city
  editCity: async (req, res) => {
    try {
      const cityId = req.params.id;
      const city = await City.findOne({
        where: { id: cityId },
        include: [{
          model: State,
          include: [{ model: Country }]
        }]
      });
      if (!city) {
        return res.status(404).send("City not found.");
      }
      const states = await State.findAll({ include: [{ model: Country }] });

      res.render('editCity', {
        city,
        states,
        country: city.State.Country,
        state: city.State,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching city.");
    }
  },

  // Update city
  updateCity: async (req, res) => {
    try {
      const cityId = req.params.id;
      const { name, stateId } = req.body;
      const existingCity = await City.findOne({ where: { name, stateId } });
      if (existingCity && existingCity.id !== parseInt(cityId)) {
        return res.status(400).send('City already exists in this state');
      }
      await City.update({ name, stateId }, { where: { id: cityId } });
      res.redirect('/view-cities');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating city.");
    }
  },

///////////////////////////////////////////////////////////////////////////////////////

  // Edit company
  editCompany: async (req, res) => {
    try {
      const companyId = req.params.id;
      const company = await Company.findOne({ where: { id: companyId } });
      if (!company) {
        return res.status(404).send("Company not found.");
      }
      res.render('editCompany', { company });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching company.");
    }
  },

  updateCompany: async (req, res) => {
    try {
      const companyId = req.params.id;
      const { name } = req.body;
      const existingCompany = await Company.findOne({ where: { name: name } });
      if (existingCompany && existingCompany.id !== parseInt(companyId)) {
        return res.status(400).send('Company with the same name already exists');
      }
      await Company.update({ name }, { where: { id: companyId } });
      res.redirect('/view-companies');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating company.");
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////////////

  // Edit job designation
  editJobDesignation: async (req, res) => {
    try {
      const jobDesignationId = req.params.id;
      const jobDesignation = await JobDesignation.findOne({
        where: { id: jobDesignationId },
        // include: [{ model: Company }]
      });
      if (!jobDesignation) {
        return res.status(404).send("Job designation not found.");
      }
      // const companies = await Company.findAll();
      res.render('editJobDesignation', { jobDesignation});
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching job designation.");
    }
  },

  //update job designation
  updateJobDesignation: async (req, res) => {
    try {
      const jobDesignationId = req.params.id;
      const { title } = req.body;
      //const jobDesignation = await JobDesignation.findOne({ where: { id: jobDesignationId } });
      // const existingJobDesignation = await JobDesignation.findOne({ where: { title, companyId: jobDesignation.companyId } });
      const existingJobDesignation = await JobDesignation.findOne({ where: { title: title} });

      if (existingJobDesignation && existingJobDesignation.id !== parseInt(jobDesignationId)) {
        return res.status(400).send(' This job desgignation already exists in the directory');
      }

      await JobDesignation.update({ title }, { where: { id: jobDesignationId } });
      res.redirect('/view-job-designations');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating job designation.");
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////

  // Edit person
  editPerson: async (req, res) => {
    try {
      const personId = req.params.id;
      const user = await User.findOne({ where: { id: personId } });
      if (!user) {
        return res.status(404).send("User  not found.");
      }
      const countries = await Country.findAll();
      const states = await State.findAll();
      const cities = await City.findAll();
      const companies = await Company.findAll();
      const jobDesignations = await JobDesignation.findAll();
      res.render('editPerson', { user, countries, states, cities, companies, jobDesignations });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching user.");
    }
  },

  updatePerson: async (req, res) => {
    try {
      const personId = req.params.id;
      const { name, telephone_number, countryId, stateId, cityId, companyId, jobDesignationId, phoneCode } = req.body;
      await User.update({ name, telephone_number, countryId, stateId, cityId, companyId, jobDesignationId, phoneCode }, { where: { id: personId } });
      res.redirect('/view-people');
    } catch (error) {
      console.error(error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).send("Telephone number matches with an already registered number in the directory.");
      } else {
        res.status(500).send("Error updating user.");
      }
    }
  },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //delete user
  deletePerson: async (req, res) => {
    try {
      const userId = req.params.id;

      await User.destroy({ where: { id: userId } });

      res.redirect('/view-people');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user.");
    }
  },
  // Delete country
  deleteCountry: async (req, res) => {
    try {
      const countryId = req.params.id;
      const users = await User.findAll({ where: { countryId } });
      if (users.length > 0) {
        return res.status(400).send("Cannot delete country as users are registered with it.");
      }

      const states = await State.findAll({ where: { countryId } });
      if (states.length > 0) {
        return res.status(400).send(" Cannot Delete. First, you have to delete states associated with this country.");
      }


      await Country.destroy({ where: { id: countryId } });
      res.redirect('/view-countries');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting country.");
    }
  },

  // Delete state
  deleteState: async (req, res) => {
    try {
      const stateId = req.params.id;
      const users = await User.findAll({ where: { stateId } });
      if (users.length > 0) {
        return res.status(400).send("Cannot delete state as users of this State are registered in the directory.");
      }

      const cities = await City.findAll({ where: { stateId } });
      if (cities.length > 0) {
        return res.status(400).send(" Cannot Delete. First, you have to delete cities associated with this state.");
      }

      await State.destroy({ where: { id: stateId } });
      res.redirect('/view-states');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting state.");
    }
  },

  // Delete city
  deleteCity: async (req, res) => {
    try {
      const cityId = req.params.id;
      const users = await User.findAll({ where: { cityId } });
      if (users.length > 0) {
        return res.status(400).send("Cannot delete city as users  of this city are registered in Synarion Directory.");
      }
      await City.destroy({ where: { id: cityId } });
      res.redirect('/view-cities');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting city.");
    }
  },

  // Delete company
  deleteCompany: async (req, res) => {
    try {
      const companyId = req.params.id;
      const users = await User.findAll({ where: { companyId } });
      if (users.length > 0) {
        return res.status(400).send("Cannot delete company as users are registered with it.");
      }


      const jobDesignations = await JobDesignation.findAll({ where: { companyId } })
      if (jobDesignations.length > 0) {
        return res.status(400).send("Cannot delete company as job designations are linked with it.");
      }

      await Company.destroy({ where: { id: companyId } });
      res.redirect('/view-companies');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting company.");
    }
  },

  // Delete job designation
  deleteJobDesignation: async (req, res) => {
    try {
      const jobDesignationId = req.params.id;
      const users = await User.findAll({ where: { jobDesignationId } });
      if (users.length > 0) {
        return res.status(400).send("Cannot delete job designation as users are registered with it.");
      }
      await JobDesignation.destroy({ where: { id: jobDesignationId } });
      res.redirect('/view-job-designations');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting job designation.");
    }
  }
};