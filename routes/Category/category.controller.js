const db = require('../../config')
const category = db.category


const addcategory = async (req, res) => {
    category.create({
        name: req.body.name
    }).then(result => { res.send(result) })
};


const getCategories = async (req, res) => {
    category.findAll().then(result => { res.send({data:result}) })
};



const deleteCategory = async (req, res) => {
    category.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => res.send('succcess'))
}


const updateCategory = async(req, res) =>{
    category.update(
        {name:req.body.name },
        { where: { id:req.params.id }  }
        
        ).then(() => res.send({data:"success"}))
}


module.exports = {
    addcategory,
    getCategories,
    deleteCategory,
    updateCategory
}