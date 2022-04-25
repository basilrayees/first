
const express = require('express');
const router = express.Router();
const controller = require('./category.controller')

const {validateBody} = require('../middleware/validator');
const {schemas} = require('../middleware/validator');

router.get('/category/test', function (req, res, next) {
    res.send('category test')
});

router.post('/category/addCategory', controller.addcategory);
router.get('/category/getCategories', controller.getCategories);
router.delete('/category/deleteCategories/:id', controller.deleteCategory);
router.put('/category/updateCategories/:id', controller.updateCategory);


module.exports = router