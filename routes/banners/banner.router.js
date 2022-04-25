const express = require('express');
const router = express.Router();
const controller = require('./banner.controller')
const {validateBody, schemas} = require('../middleware/validator');
const {upload} = require('./banner.controller')

router.get('/banner/test', function (req, res, next) {
    res.send('banner test')
}); 


router.post('/banner/addBanner' ,upload.single('bannerImage'),validateBody(schemas.bannerSchema),controller.addBanner);
router.get('/banner/getBanners', controller.getBanners);
router.get('/banner/getAllBanners', controller.getAllBanners);
router.put('/banner/updateBanner/:id',upload.single('bannerImage'), controller.updateBanner);
router.delete('/banner/deleteBanner/:id', controller.deleteBanner);




module.exports = router