const db = require('../../config')
const place = db.place
// add place whith state id
const addPlace = async (req, res) => {
    place.create({
        name: req.body.name,
        lat: req.body.lat,
        lng: req.body.lng,
        stateId: req.body.stateId,
        mainBannerCount: req.body.mainBannerCount,
        subBannerCount: req.body.subBannerCount,
        categoryBannerCount: req.body.categoryBannerCount   
    }).then(result => { res.send({ data: result }) })
};


// get all places
const getPlace = async (req, res) => {
    place.findAll().then((result) => { res.send({ data: result }) })
}


// delete place white id 
const deletePlace = async (req, res) => {
    place.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => { res.send({ data: { succes: true } }) })
}

// update place 
const updatePlace = (req, res) => {
    place.update(
        {
            name: req.body.name,
            lat: req.body.lat,
            lng: req.body.lng,
            stateId: req.body.stateId,
            mainBannerCount: req.body.mainBannerCount,
            subBannerCount: req.body.subBannerCount,
            categoryBannerCount: req.body.categoryBannerCount
        },
        { where: { id: req.params.id } }
    ).then(() => { res.send({ data: { succes: true } }) })
    // .catch(error => console.log(error))
}

module.exports = {
    addPlace,
    getPlace,
    deletePlace,
    updatePlace

}