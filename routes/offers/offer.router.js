const express = require('express');
const router = express.Router();
const controller = require('./offer.controller')
const path = require('path');


const multer = require('multer');



const storage = multer.diskStorage({
    // destination: function(req, file, callback){
    //     callback(null, './upload')
    // },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,

    limit: {
        fieldSize: 100
    }
});


router.get('/offer/test', function (req, res) {
    res.send('offer-test')
});

router.post('/offer/addOffer',upload.single("image"), controller.addOffer)
// router.get('/offer/allOffers', controller.getAllOffers)
router.get('/offer/offers', controller.getOffers)
router.delete('/offer/deletOffer/:id', controller.deleteOffer)
router.get('/offer/getAllOffers', controller.getAlloffer)
router.patch('/offer/updateOffer/:id',upload.single("image"), controller.updateOffer)
router.get('/offer/viewAll', controller.viewAll)



module.exports = router;