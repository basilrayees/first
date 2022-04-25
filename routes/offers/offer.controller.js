const db = require('../../config')
const { distance } = require('../banners/banner.controller')
const offer = db.offer
const category = db.category
const store = db.store
const place = db.place
const store_has_category = db.store_has_category
const state = db.state
const { Op, where } = require("sequelize");


const { uploadFile, deleteimage } = require('../middleware/s3');



const getAllOffers = async (req, res) => {
    offer.findAll().then((result) => {
        res.send(result)
    }).catch(err => res.send(err))
}




const addOffer = async (req, res) => {

    const storeHasCategory = await store_has_category.findOne({
        where: {
            [Op.and]: [
                { storeId: req.body.storeId },
                { categoryId: req.body.catogeryId }
            ]
        }
    })
    if (!storeHasCategory) return res.status(400).send({
        Mesesage: [
            'Store does not have selected category'
        ]
    });


    const placeID = await store.findOne({
        attributes: ['id', 'placeId'],
        where: {
            id: req.body.storeId
        }
    })

    const spoffer = req.body.sponserOffer;
    const feoffer = req.body.featuredOffer;

    if (feoffer == "true" && spoffer === "true") {
        const feofferCount = await offer.findAll({
            where: {
                featuredOffer: true
            },
            include: [{
                model: store,
                required: true,
                // attributes:[],
                where: {
                    placeId: placeID.placeId
                }
            }]
        })
        const countchecK = await offer.findAll({
            where: {
                sponserOffer: true,
                catogeryId: req.body.catogeryId
            },
            include: [{
                model: store,
                required: true,
                where: {
                    placeId: placeID.placeId
                }
            }]
        })

        if (!req.body.slot) return res.status(400).send({ Mesesage: ["slot is required"] })
        if (req.body.slot > 8) return res.status(400).send({ Mesesage: ["slot is not available"] })


        const slotAvailable = await offer.findAll({
            where: {
                slot: req.body.slot,
                featuredOffer: true
            },
            include: [{
                model: store,
                where: {
                    placeId: placeID.placeId
                }
            }]
        })

        if (slotAvailable.length != 0) return res.status(400).send({
            Message: [
                "this slot for featured offers is takken in this place"
            ]
        })

        if (feofferCount.length >= 8) return res.status(400).send({
            Mesesage: [
                "featured offer limit is over in this place"
            ]
        })
        if (countchecK.length >= 4) return res.status(400).send({
            Message: [
                "sponser offer limit is over for this catogery"
            ]
        })

        const image = await uploadFile(req.file, "offers")
        offer.create({
            image: image.Location,
            title: req.body.title,
            description: req.body.description,
            featuredOffer: req.body.featuredOffer,
            sponserOffer: req.body.sponserOffer,
            slot: req.body.slot,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            storeId: req.body.storeId,
            catogeryId: req.body.catogeryId
        }).then((result) => {
            res.send(result)
        }).catch(err => res.send(err))


    }



    else if (feoffer == "true") {
        const feofferCount = await offer.findAll({
            where: {
                featuredOffer: true
            },
            include: [{
                model: store,
                required: true,
                // attributes:[],
                where: {
                    placeId: placeID.placeId
                }
            }]
        })

        if (feofferCount.length >= 8) return res.status(400).send({
            Mesesage: [
                "featured offer limit is over in this place"
            ]
        })

        if (!req.body.slot) return res.status(400).send({ Mesesage: ["slot is required"] })
        if (req.body.slot > 8) return res.status(400).send({ Mesesage: ["slot is not available"] })

        const slotAvailable = await offer.findAll({
            where: {
                slot: req.body.slot,
                featuredOffer: true
            },
            include: [{
                model: store,
                where: {
                    placeId: placeID.placeId
                }
            }]
        })

        if (slotAvailable.length != 0) return res.status(400).send({
            Message: [
                "this slot is takken"
            ]
        })

        const image = await uploadFile(req.file, "offers")
        offer.create({
            image: image.Location,
            title: req.body.title,
            description: req.body.description,
            featuredOffer: req.body.featuredOffer,
            sponserOffer: req.body.sponserOffer,
            slot: req.body.slot,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            storeId: req.body.storeId,
            catogeryId: req.body.catogeryId
        }).then((result) => {
            res.send(result)
        }).catch(err => res.send(err))


    }



    // console.log(spoffer);



    else if (spoffer === "true") {
        const countchecK = await offer.findAll({
            where: {
                sponserOffer: true,
                catogeryId: req.body.catogeryId
            },
            include: [{
                model: store,
                required: true,
                where: {
                    placeId: placeID.placeId
                }
            }]
        })
        console.log({ "count": countchecK.length });
        if (countchecK.length >= 4) return res.status(400).send({
            Message: [
                "sponser offer limit is over for this catogery"
            ]
        })

        const image = await uploadFile(req.file, "offers")
        offer.create({
            image: image.Location,
            title: req.body.title,
            description: req.body.description,
            featuredOffer: req.body.featuredOffer,
            sponserOffer: req.body.sponserOffer,
            slot: req.body.slot,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            storeId: req.body.storeId,
            catogeryId: req.body.catogeryId
        }).then((result) => {
            res.send(result)
        }).catch(err => res.send(err))




    }
    else {
        // res.send("hello")
        const image = await uploadFile(req.file, "offers")
        offer.create({
            image: image.Location,
            title: req.body.title,
            description: req.body.description,
            featuredOffer: req.body.featuredOffer,
            sponserOffer: req.body.sponserOffer,
            slot: req.body.slot,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            storeId: req.body.storeId,
            catogeryId: req.body.catogeryId
        }).then((result) => {
            res.send(result)
        }).catch(err => res.send(err))
    }







}

const getOffers = async (req, res) => {

    try {
        const cords = []
        const poslat = req.query.lat
        const poslng = req.query.lng

        console.log(req.query);
        // const poslat = 11.290222
        // const poslng = 76.240750

        const places = await place.findAll({})
        places.forEach(element => {
            cords.push({ lat: element.lat, lng: element.lng, name: element.name, id: element.id });

        });
        console.log(cords);
        const newCords = []
        cords.forEach((element, index) => {
            const awc = distance(poslat, poslng, element.lat, element.lng, "k", element.id)
            newCords.push(awc)
            // console.log(awc);
        })
        console.log(newCords);

        Array.prototype.hasMin = function (attrib) {
            return (this.length && this.reduce(function (prev, curr) {
                return prev[attrib] < curr[attrib] ? prev : curr;
            })) || null;
        }


        const min = await newCords.hasMin('dist')

        console.log(min);
        if (!min.dist) return res.status(400).send({
            Message: [
                "lat/lng is udefined"
            ]
        })
        const featuredOffers = await offer.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            required: true,
            where: {
                featuredOffer: true
            },
            order: [
                ['slot', 'ASC']
            ],
            include: [{
                model: store,
                attributes: [],
                where: {
                    placeId: min.id
                }

            }]
        })

        const catOffers = await category.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [{
                model: offer,
                where: {
                    sponserOffer: true
                },
                required: false,
                attributes: { exclude: ['createdAt', 'updatedAt'] },

            }]
        })



        res.send({
            data: [
                { featuredOffers }, { catOffers }

            ]
        })



    } catch (error) {
        res.send(error)
    }


}

const deleteOffer = async (req, res) => {

    const target = await offer.findOne({
        where: {
            id: req.params.id
        }
    })
    const offerImage = await target.image.slice(51)

    // res.send(offerImage)


    try {
        deleteimage("offers", offerImage)

        const del = await offer.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send({
            data: {
                succss: true
            }
        })

    } catch (error) {
        res.send(error)
    }
}


const getAlloffer = async (req, res) => {

    const { stateId, placeId, countryId } = req.query

    const options = {
        // where: {},
        include: [{
            model: store,
            attributes: ['placeId'],
            where: {},
            include: [{
                attributes: [],
                model: place,
                where: {},
                include: [{
                    attributes: [],
                    model: state,
                    where: {}
                }]
            }]

        }]

    }

    if (placeId) {
        options.include[0].where.placeId = placeId
    }
    if (stateId) {
        options.include[0].include[0].where.stateId = stateId
    }
    if (countryId) {
        options.include[0].include[0].include[0].where.countryId = countryId
    }

    const result = await offer.findAll(options)

    res.send(result)


}


const updateOffer = async (req, res) => {
    // try {
        const targetOffer = await offer.findOne({
            where: {
                id: req.params.id,
            },
            include: [{
                model: store
            }]
        })


        const placeID = await targetOffer.store
        console.log(placeID.placeId);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (targetOffer.featuredOffer == false && targetOffer.sponserOffer == false && req.body.featuredOffer == "true" && req.body.sponserOffer == "true") {


            const feofferCount = await offer.findAll({
                where: {
                    featuredOffer: true
                },
                include: [{
                    model: store,
                    required: true,
                    // attributes:[],
                    where: {
                        placeId: placeID.placeId
                    }
                }]
            })

            const countchecK = await offer.findAll({
                where: {
                    sponserOffer: true,
                    catogeryId: req.body.catogeryId
                },
                include: [{
                    model: store,
                    required: true,
                    where: {
                        placeId: placeID.placeId
                    }
                }]
            })

            if (!req.body.slot) return res.status(400).send({ Mesesage: ["slot is required"] })
            if (req.body.slot > 8) return res.status(400).send({ Mesesage: ["slot is not available"] })

            if (feofferCount.length >= 8) return res.status(400).send({
                Mesesage: [
                    "featured offer limit is over in this place"
                ]
            })

            const slotAvailable = await offer.findAll({
                where: {
                    slot: req.body.slot,
                    featuredOffer: true
                },
                include: [{
                    model: store,
                    where: {
                        placeId: placeID.placeId
                    }
                }]
            })

            if (slotAvailable.length != 0) return res.status(400).send({
                Message: [
                    "this slot is takken"
                ]
            })

            if (countchecK.length >= 4) return res.status(400).send({
                Message: [
                    "sponser offer limit is over for this catogery"
                ]
            })
            const offerImage = await targetOffer.image.slice(51)
            deleteimage("offers", offerImage)
            const image = await uploadFile(req.file, "offers")
            const updateOffer = await offer.update({
                image: image.Location,
                title: req.body.title,
                description: req.body.description,
                featuredOffer: req.body.featuredOffer,
                sponserOffer: req.body.sponserOffer,
                slot: (req.body.slot == 'undefined') ? req.body.slot : 7,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                storeId: req.body.storeId,
                catogeryId: req.body.categoryId
            },
                {
                    where: {
                        id: req.params.id
                    }
                }
            ).then(() => {
                res.send({
                    data: {
                        success: true
                    }
                })
            }).catch(err => res.send(err))



        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (targetOffer.featuredOffer == false && req.body.featuredOffer == "true") {

            const feofferCount = await offer.findAll({
                where: {
                    featuredOffer: true
                },
                include: [{
                    model: store,
                    required: true,
                    // attributes:[],
                    where: {
                        placeId: placeID.placeId
                    }
                }]
            })
            if (!req.body.slot) return res.status(400).send({ Mesesage: ["slot is required"] })
            if (req.body.slot > 8) return res.status(400).send({ Mesesage: ["slot is not available"] })

            if (feofferCount.length >= 8) return res.status(400).send({
                Mesesage: [
                    "featured offer limit is over in this place"
                ]
            })



            const slotAvailable = await offer.findAll({
                where: {
                    slot: req.body.slot,
                    featuredOffer: true
                },
                include: [{
                    model: store,
                    where: {
                        placeId: placeID.placeId
                    }
                }]
            })

            if (slotAvailable.length != 0) return res.status(400).send({
                Message: [
                    "this slot is takken"
                ]
            })

            const offerImage = await targetOffer.image.slice(51)
            deleteimage("offers", offerImage)
            const image = await uploadFile(req.file, "offers")
            const updateOffer = await offer.update({
                image: image.Location,
                title: req.body.title,
                description: req.body.description,
                featuredOffer: req.body.featuredOffer,
                sponserOffer: req.body.sponserOffer,
                slot: (req.body.slot == 'undefined') ? req.body.slot : 7,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                storeId: req.body.storeId,
                catogeryId: req.body.categoryId
            },
                {
                    where: {
                        id: req.params.id
                    }
                }
            ).then(() => {
                res.send({
                    data: {
                        success: true
                    }
                })
            }).catch(err => res.send(err))


        }
        // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (targetOffer.sponserOffer == false && req.body.sponserOffer == "true") {

            const countchecK = await offer.findAll({
                where: {
                    sponserOffer: true,
                    catogeryId: req.body.catogeryId
                },
                include: [{
                    model: store,
                    required: true,
                    where: {
                        placeId: placeID.placeId
                    }
                }]
            })
            // console.log({ "count": countchecK.length });
            if (countchecK.length >= 4) return res.status(400).send({
                Message: [
                    "sponser offer limit is over for this catogery"
                ]
            })
            const offerImage = await targetOffer.image.slice(51)
            deleteimage("offers", offerImage)
            const image = await uploadFile(req.file, "offers")
            const updateOffer = await offer.update({
                image: image.Location,
                title: req.body.title,
                description: req.body.description,
                featuredOffer: req.body.featuredOffer,
                sponserOffer: req.body.sponserOffer,
                slot: (req.body.slot == 'undefined') ? req.body.slot : 7,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                storeId: req.body.storeId,
                catogeryId: req.body.categoryId
            },
                {
                    where: {
                        id: req.params.id
                    }
                }
            ).then(() => {
                res.send({
                    data: {
                        success: true
                    }
                })
            }).catch(err => res.send(err))


        }
        else {
            const offerImage = await targetOffer.image.slice(51)
             deleteimage("offers", offerImage)
            // res.send(offerImage)

            const image = await uploadFile(req.file, "offers")
            const updateOffer = await offer.update({
                image: image.Location,
                title: req.body.title,
                description: req.body.description,
                featuredOffer: req.body.featuredOffer,
                sponserOffer: req.body.sponserOffer,
                slot: (req.body.slot == 'undefined') ? req.body.slot: 7,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                storeId: req.body.storeId,
                catogeryId: req.body.categoryId
            },
            {
                where:{
                    id: req.params.id
                }
            }
            ).then(()=>{
                res.send({
                    data: {
                        success: true
                    }
                })
            }).catch(err => res.send(err))
            
        }

    // } catch (error) {
    //     res.send(error)
    // }

}


const viewAll = async (req, res) =>{

    const cords = []
    const poslat = req.query.lat
    const poslng = req.query.lng

    console.log(req.query);
    // const poslat = 11.290222
    // const poslng = 76.240750

    const places = await place.findAll({})
    places.forEach(element => {
        cords.push({ lat: element.lat, lng: element.lng, name: element.name, id: element.id });

    });
    console.log(cords);
    const newCords = []
    cords.forEach((element, index) => {
        const awc = distance(poslat, poslng, element.lat, element.lng, "k", element.id)
        newCords.push(awc)
        // console.log(awc);
    })
    console.log(newCords);

    Array.prototype.hasMin = function (attrib) {
        return (this.length && this.reduce(function (prev, curr) {
            return prev[attrib] < curr[attrib] ? prev : curr;
        })) || null;
    }


    const min = await newCords.hasMin('dist')

    console.log(min);
    if (!min.dist) return res.status(400).send({
        Message: [
            "lat/lng is udefined"
        ]
    })


    const offers = await category.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include:[{
            model: offer,
            required: true,
            include:[{
                model: store,
                where:{
                    placeId: min.id
                }
                
            }]
            
        }]
        
    })
    res.send(offers)
}


module.exports = {
    getAllOffers,
    addOffer,
    getOffers,
    deleteOffer,
    getAlloffer,
    updateOffer,
    viewAll
}