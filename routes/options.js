const express = require('express');
const router = express.Router();
const optionsController = require('../controllers/options');
const isAuth = require('../middleware/is-auth');

router.get('/option/:name', optionsController.getOptions);
router.post('/option/brand', isAuth, optionsController.postBrand);
router.post('/option/country', isAuth, optionsController.postCountry);
router.post('/option/condition', isAuth, optionsController.postCondition);
router.post('/option/vehicle', isAuth, optionsController.postVehicle);
router.post('/option/engine', isAuth, optionsController.postEngine);

module.exports = router;