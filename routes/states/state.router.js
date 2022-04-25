const express = require('express');
const router = express.Router();
const controller = require('./state.controller')
const {validateBody} = require('../middleware/validator');
const {schemas} = require('../middleware/validator');


router.get('/state/test', function (req, res) {
    res.send('state-test')
});


router.get('/state/allStates', controller.getAllState);
router.post('/state/addState',validateBody(schemas.stateSchema), controller.addState);
router.delete('/state/deleteState/:id', controller.deleteState);
router.put('/state/updateState/:id', controller.updateState);



module.exports = router;