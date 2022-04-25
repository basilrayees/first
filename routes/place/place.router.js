const express = require('express');
const router = express.Router();
const controller = require('./place.controller');
const {validateBody} = require('../middleware/validator');
const {schemas} = require('../middleware/validator');


router.get('/place/test', function (req, res) {
    res.send('place-test')
});

router.post('/place/addPlace',validateBody(schemas.placeSchema), controller.addPlace);
router.get('/place/getPlace', controller.getPlace);
router.delete('/place/deletePlace/:id', controller.deletePlace);
router.put('/place/updatePlace/:id', controller.updatePlace);


module.exports = router;