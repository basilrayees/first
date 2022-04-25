const db = require('../../config')
const banner_category = db.banner_category


const add_banner_category = async (req, res) => {
    banner_category.create({
        name: req.body.name
    }).then(result => { res.send(result) })
};



module.exports = {
    add_banner_category
}