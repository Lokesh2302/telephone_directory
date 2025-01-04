const User = require('../models/user');
const Country = require('../models/country');
const State = require('../models/state');
const City = require('../models/city');
const Company = require('../models/company');
const JobDesignation = require('../models/jobDesignation');
const { Op } = require('sequelize');

module.exports = {

  //render user register form
  registerForm: async (req, res) => {
    try {
      const countries = await Country.findAll();
      const companies = await Company.findAll();
      const states = await State.findAll();
      const cities = await City.findAll();
      const jobDesignations = await JobDesignation.findAll();
      res.render('register', { countries, companies, states, cities, jobDesignations });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading registration form.");
    }
  },

  // Handle user registration
  registerUser: async (req, res) => {
    try {
      const { name, telephone_number, countryId, stateId, cityId, companyId, jobDesignationId, phoneCode } = req.body;
      
      const existingUserNumber = await User.findOne({
        where: { telephone_number }
      });

      if (existingUserNumber) {
        return res.status(400).send("Telephone number matches with an already registered number in the directory.");
      }
      await User.create({
        name,
        telephone_number,
        countryId,
        stateId,
        cityId,
        companyId,
        jobDesignationId,
        phoneCode,
      });
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
        res.status(500).send("Error registering user.");
      }
    },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Fetch states based on country ID
  getStatesByCountry: async (req, res) => {
    try {
      const countryId = req.params.countryId;
      const states = await State.findAll({ where: { countryId } });
      res.json(states);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching states.");
    }
  },
  // Fetch phone code based on selected country
  getPhoneCodeByCountry: async (req, res) => {
    try {
      const countryId = req.params.countryId;
      const country = await Country.findOne({ where: { id: countryId } });

      if (!country) {
        return res.status(404).send("Country not found.");
      }

      res.json({ phoneCode: country.phonecode });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching phone code.");
    }
  },
  // Fetch cities based on state ID
  getCitiesByState: async (req, res) => {
    try {
      const stateId = req.params.stateId;
      const cities = await City.findAll({ where: { stateId } });
      res.json(cities);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching cities.");
    }
  },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // View dashboard with all required data
  viewDashboard: async (req, res) => {
    try {
      const users = await User.findAll();
      const countries = await Country.findAll();
      const companies = await Company.findAll();
      const states = await State.findAll();
      const jobDesignations = await JobDesignation.findAll();

      res.render('dashboard', { users, countries, companies, jobDesignations, states });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error loading dashboard');
    }
  },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
//countries display karney k liye
  getCountries: async (req, res) => {
    try {

      const { searchCountry } = req.query;

      let searchConditions = {};
      if (searchCountry) {
        searchConditions.name = {
          [Op.like]: `%${searchCountry}%`
        };
      }

      const countries = await Country.findAll({
        where: searchConditions,
        order: [["name", "ASC"]]
      });

      res.render('viewCountries', {  countries, searchCountry  });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching countries');
    }
  },

  //add a country 
  addCountry: async (req, res) => {
    const { name, shortname, phonecode } = req.body;

    try {

      const existingCountryByName = await Country.findOne({ where: { name: name } });
      if (existingCountryByName) {
        return res.status(400).send('Country with the same name already exists');
      }


      const existingCountryByShortname = await Country.findOne({ where: { shortname: shortname } });
      if (existingCountryByShortname) {
        return res.status(400).send('Shortname is already assigned to a different country');
      }

      await Country.create({ name, shortname, phonecode });
      res.redirect('/dashboard');

    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding country');
    }
  },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Display states 
  getStates: async (req, res) => {
    try {
      const countryId = req.query.countryId;
      const searchStateName = req.query.searchStateName || '';

      let states;

      let searchCondition = {};

      if (countryId) {
        searchCondition.countryId = countryId;
      }

      if (searchStateName) {
        searchCondition.name = {
          [Op.like]: `%${searchStateName}%`
        };
      }

      //fetching
      states = await State.findAll({
        where: searchCondition,
        include: [Country],
        order: [ [ "name", "Asc"]]
      });

      const countries = await Country.findAll(); 

      res.render('viewStates', {
        states,
        countries,
        selectedCountryId: countryId,
        searchStateName: searchStateName
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server Error');
    }
  },

  // Add a new state
  addState: async (req, res) => {
    const { name, countryId } = req.body;
    try {
      const existingState = await State.findOne({ where: { name, countryId } });

      if (existingState) {
        return res.status(400).send('State already exists in this country');
      }

      await State.create({ name, countryId });
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding state');
    }
  },
/////////////////////////////////////////////////////////////////////////////////////////////////
  // Display cities
  getCities: async (req, res) => {
    try {
      const countryId = req.query.countryId;
      const stateId = req.query.stateId;
      const searchCityName = req.query.searchCityName || '';

      let cities;


      let searchCondition = {};

      if (countryId) {
        
        const states = await State.findAll({
          where: { countryId: countryId }
        });
        const stateIds = states.map(state => state.id);
        searchCondition.stateId = {
          [Op.in]: stateIds 
        };
      }

      if (stateId) {
        searchCondition.stateId = stateId;
      }
      if (searchCityName) {
        searchCondition.name = {
          [Op.like]: `%${searchCityName}%`
        };
      }

      cities = await City.findAll({
      where: searchCondition,
        include: [{
          model: State,
          include: [Country]
        }]

      });

      // dropdown
      const countries = await Country.findAll();
    
      let states = [];
      if (countryId) {
        states = await State.findAll({
          where: { countryId: countryId }
        });
      }

      res.render('viewCities', {
        cities,
        countries,
        states,
        selectedCountryId: countryId,
        selectedStateId: stateId,
        searchCityName: searchCityName
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server Error');
    }
  },

  // Add a new city
  addCity: async (req, res) => {
    const { name, stateId } = req.body;
    try {
      const existingCity = await City.findOne({ where: { name, stateId } });

      if (existingCity) {
        return res.status(400).send('City already exists in this state');
      }

      await City.create({ name, stateId });
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding city');
    }
  },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get all companies
  getCompanies: async (req, res) => {
    try {
      const { searchCompany } = req.query;

      let searchConditions = {};
      if (searchCompany) {
        searchConditions.name = {
          [Op.like]: `%${searchCompany}%`
        };
      }

      const companies = await Company.findAll({
        where: searchConditions,
        order : [['name', 'ASC']]
      });

      res.render('viewCompanies', {
        companies,
        searchCompany
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching companies');
    }
  },

  // Add a new company
  addCompany: async (req, res) => {
    const { name } = req.body;
    try {

      const existingCompanyByName = await Company.findOne({ where: { name: name } });
      if (existingCompanyByName) {
        return res.status(400).send('Company  with the same name already exists');
      }

      await Company.create({ name });

      res.redirect('/dashboard');

    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding company');
    }
  },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
// Get all job designations for viewing
  getJobDesignations: async (req, res) => {
    try {
      const { searchJobDesignation } = req.query;
      let searchConditions = {};


      if (searchJobDesignation) {
        searchConditions.name = {
          [Op.like]: `%${searchJobDesignation}%`
        };
      }

      const jobDesignations = await JobDesignation.findAll({
        where: searchConditions,
        order : [['title', 'ASC']]

      });
  
      res.render('viewJobDesignations', {
        jobDesignations,
        searchJobDesignation
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching companies');
    }
  },
      // if (companyId) {
      //   jobDesignations = await JobDesignation.findAll({
      //     where: { companyId: companyId },
      //     include: [Company]
      //   });
      // } else {

      //   jobDesignations = await JobDesignation.findAll({
      //     include: [Company]
      //   });
      // }

  //     const companies = await Company.findAll();

  //     res.render('viewJobDesignations', {
  //       jobDesignations,
  //       companies,
  //       selectedCompanyId: companyId
  //     });

  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // },

  // Add a new job designation
  addJobDesignation: async (req, res) => {
    const { title } = req.body;
    try {
      const existingJobDesignation = await JobDesignation.findOne({ where: { title } });
      if (existingJobDesignation) {
        return res.status(400).send('This job designation already exists in the Directory.');
      }
      await JobDesignation.create({ title });
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding job designation');
    }
  },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Users ShowTime
  viewAllPeople: async (req, res) => {
    try {

      const { searchName, searchCountry, searchJob, searchState, searchCity, searchCompany, searchTelephone } = req.query;

      let searchConditions = {};

      if (searchName) {
        searchConditions.name = {
          [Op.like]: `%${searchName}%`
        };
      }

      if (searchTelephone) {
        searchConditions.telephone_number = {
          [Op.like]: `%${searchTelephone}%`
        };
      }

      if (searchCountry) {
        searchConditions.countryId = searchCountry;
      }

      if (searchJob) {
        searchConditions.jobDesignationId = searchJob;
      }

      if (searchState) {
        searchConditions.stateId = searchState;
      }

      if (searchCity) {
        searchConditions.cityId = searchCity;
      }

      if (searchCompany) {
        searchConditions.companyId = searchCompany;
      }

      const users = await User.findAll({
        where: searchConditions,
        include: [
          { model: Country, attributes: ['name', 'phonecode'] },
          { model: State, attributes: ['name'] },
          { model: City, attributes: ['name'] },
          { model: Company, attributes: ['name'] },
          { model: JobDesignation, attributes: ['title'] }
        ],
        order: [
           
            [Country, 'name', 'ASC'], 
            [State, 'name', 'ASC'],  
            [City, 'name', 'ASC'],    
            ['name', 'ASC'] 
        ]
      });

      const countries = await Country.findAll();
      const jobDesignations = await JobDesignation.findAll();
      const companies = await Company.findAll();

      let states = [];
      if (searchCountry) {
        states = await State.findAll({
          where: {
            countryId: searchCountry
          }
        });
      }

      let cities = [];
      if (searchState) {
        cities = await City.findAll({
          where: {
            stateId: searchState
          }
        });
      }


      res.render('viewPeople', {
        users,
        countries,
        jobDesignations,
        companies,
        states,
        cities,
        searchName,
        searchCountry,
        searchJob,
        searchState,
        searchCity,
        searchCompany,
        searchTelephone
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching people.");
    }
  }
};

