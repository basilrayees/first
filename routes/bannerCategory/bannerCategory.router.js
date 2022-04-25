const express = require('express');
const router = express.Router();
const controller = require('./bannerCategory.controller')

router.get('/bannerCategory/test', function (req, res, next) {
    res.send('bannerCategory test')
}); 

router.post('/bannerCategory/addBannerCategory',controller.add_banner_category)

// router.post('/banner/addBanner',)









module.exports = router