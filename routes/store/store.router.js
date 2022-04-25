const express = require('express');
const router = express.Router();
const controller = require('./store.controller')
const {validateBody, schemas} = require('../middleware/validator');
const {upload} = require('./store.controller')



router.get('/store/test', function (req, res, next) {
    res.send('store test')
});



router.post('/store/addStore',upload.single('logo'),validateBody(schemas.storeSchema), controller.addstore);
router.get('/store/getStore',controller.getallStores);
router.get('/store/getStore/:id', controller.getStoreById);
router.delete('/store/deleteStore/:id', controller.deleteStore);
router.put('/store/updatrStore/:id', upload.single('logo'), controller.updateStore);
// router.get('/store/getStoreCat/', controller.getStoreWithCategory);




module.exports = router;