
const db = require('../../config')
const country = db.country

//GET ALL COUNTRIES
const getAllCountries = async (req, res) => {
    country.findAll().then(result => { res.send(result) })
};


//ADD COUNTRY
const addCountry = async (req, res) => {
    country.create({
        name: req.body.name
    }).then(result => { res.send(result) })
};


//GET COUNTRY BY ID
const getCountryById = async (req, res) => {
    country.findAll({
        where: {
            id: req.params.id
        }
    }).then((result => {

        res.send(result)
    }))
}


//DELETE COUNTRY
const deleteCountry = async (req, res) => {
    country.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => res.send('succcess'))
}

//UPDATE COUNTRY
const updateCountry = async (req, res) => {
    country.update(
        {
            name: req.body.name
        },
        {
            where: { id: req.body.id }
        }
    ).then(() => res.send('succcess'))
}

module.exports = {
    addCountry,
    getAllCountries,
    getCountryById,
    deleteCountry,
    updateCountry
}