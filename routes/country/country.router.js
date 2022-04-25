const express = require('express');
const router = express.Router();
const controller = require('./country.controller')
const {validateBody} = require('../middleware/validator');
const {schemas} = require('../middleware/validator');



router.get('/country/test', function (req, res, next) {
    res.send('country test')
});


router.post('/country/addCountry', validateBody(schemas.countrySchema) , controller.addCountry );
router.get('/country/getCountries', controller.getAllCountries );
router.get('/country/findCountry/:id', controller.getCountryById );
router.delete('/country/deleteCountry/:id', controller.deleteCountry );
router.put('/country/update', controller.updateCountry );

module.exports = router;