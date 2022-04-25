const db = require('../../config')
const banner = db.banner;
const place = db.place;
const bannerCategory = db.banner_category

const path = require('path');
const multer = require('multer');
const { uploadFile, deleteimage } = require('../middleware/s3');


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

const addBanner = async (req, res) => {

    if (req.body.sortOrder > 8) return res.status(400).send({
        Message: [
            "sortOrder Limit is 8"
        ]
    })
    const alreadyExists = await banner.findAll({
        where: {
            sortOrder: req.body.sortOrder,
            placeId: req.body.placeId,
            bannerCategoryId: req.body.bannerCategoryId
        }
    })

    const bannerCount = await banner.findAll({
        where: {
            placeId: req.body.placeId,
            bannerCategoryId: req.body.bannerCategoryId
        }
    })

    if (bannerCount.length >= 8) return res.status(400).send({
        Message: [
            "limit in this is place is over"
        ]
    })
    // console.log(alreadyExists);
    if (alreadyExists.length != 0) return res.status(409).send({
        Message: [
            "sort Order is already exist in this place"
        ]
    })

    // res.send("hello")
    const bannerImage = await uploadFile(req.file, "banners")
    console.log(req.body.title);
    banner.create({
        bannerImage: bannerImage.Location,
        title: req.body.title,
        bannerCategoryId: req.body.bannerCategoryId,
        placeId: req.body.placeId,
        sortOrder: req.body.sortOrder,
    }).then(result => { res.send(result) })
        .catch(err => { res.send(err) })
};

const getAllBanners = async (req, res) => {

    const { placeId, bannerCategoryId } = req.query

    let { page, size } = req.query
    if (!page) {
        page = 1;
    }
    if (!size) {
        size = 10;
    }


    const limit = parseInt(size);
    const skip = (page - 1) * size;

    const options = {
        where: {},
        include: [{
            model: bannerCategory,
            attributes: ['id', 'name'],
            //  through: { attributes: [] }
        }],
        offset: skip, limit: limit
    };

    if (placeId) {
        options.where.placeId = placeId
        // console.log("hello");
    }
    if (bannerCategoryId) {
        options.where.bannerCategoryId = bannerCategoryId
    }
    const result = await banner.findAndCountAll(options)
    const temmp = result.rows

    try {
        res.send({
            data: result,
            current_page: parseInt(page),
            per_page: temmp.length
        })

    } catch (error) {
        console.log(error);
    }

    // banner.findAndCountAll(options)
    //     .then(result => {


    //         res.send({ 
    //             data: result,
    //             current_page:page,
    //             per_page: result.length
    //          })
    //     }).catch(err => res.send(err))
}





// function for getting distance between cordinates
function distance(lat1, lon1, lat2, lon2, unit, id) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var id = id
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return {
        dist,
        id
    }


}

const getBanners = async (req, res) => {
    const cords = []
    const places = await place.findAll({})
    places.forEach(element => {
        cords.push({ lat: element.lat, lng: element.lng, name: element.name, id: element.id });

    });
    const poslat = req.query.lat
    const poslng = req.query.lng
    // console.log(req.query);
    const newCords = []
    //   const newCords2 = []

    //   getting distances from all places 
    cords.forEach((element, index) => {
        const awc = distance(poslat, poslng, element.lat, element.lng, "k", element.id)
        newCords.push(awc)
        console.log(awc);
    })

    // function for gitting minimum distances
    Array.prototype.hasMin = function (attrib) {
        return (this.length && this.reduce(function (prev, curr) {
            return prev[attrib] < curr[attrib] ? prev : curr;
        })) || null;
    }
    //  getting smallest distance 
    const min = await newCords.hasMin('dist')
    console.log(min);

    let { page, size } = req.query
    if (!page) {
        page = 1;
    }
    if (!size) {
        size = 10;
    }


    const limit = parseInt(size);
    const skip = (page - 1) * size;

    try {
        const banners = await bannerCategory.findAndCountAll({
            attributes: ['id', 'name'],
            include: [{
                model: banner,
                attributes: ['id', 'bannerImage', 'title', 'sortOrder', 'bannerCategoryId', 'placeId'],
                where: {
                    placeId: min.id
                },
                required: false
                // through: { attributes: [] }
            }],

            offset: skip, limit: limit
        })

        // console.log(cords);
        // console.log(newCords);
        // console.log(min);
        const temmp = banners.rows



        res.send({
            data: banners,
            current_page: parseInt(page),
            per_page: temmp.length
        })

    } catch (error) {
        res.send(error)
    }
}


const updateBanner = async (req, res) => {

    const targetBanner = await banner.findOne({
        where: {
            id: req.params.id
        }
    })
    if (req.body.sortOrder > 8) return res.status(400).send({
        Message: [
            "sortOrder Limit is 8"
        ]
    })
    

    if (targetBanner.sortOrder != req.body.sortOrder && targetBanner.bannerCategoryId != req.body.bannerCategoryId || targetBanner.placeId != req.body.placeId) {
        const sortExist = await banner.findAll({
            where: {
                sortOrder: req.body.sortOrder,
                placeId: req.body.placeId,
                bannerCategoryId: req.body.bannerCategoryId
            }
        })
        const bannerLimit = await banner.findAll({
            where: {
                placeId: req.body.placeId,
                bannerCategoryId: req.body.bannerCategoryId
            }
        })
        // res.send(sortExist)
        if (sortExist.length != 0) return res.status(400).send({
            Message: [
                "sort order already exist"
            ]
        })

        if (bannerLimit.length >= 8) return res.status(400).send({
            Message: [
                "sort order limit is over in this polace"
            ]
        })

     
        try {
            const imageB = targetBanner.bannerImage.slice(52)
            const bannerImage = await uploadFile(req.file, "banners")
            if (bannerImage) { deleteimage("banners", imageB) }
            const result = await banner.update({
                bannerImage: bannerImage.Location,
                title: req.body.title,
                bannerCategoryId: req.body.bannerCategoryId,
                placeId: req.body.placeId,
                sortOrder: req.body.sortOrder
            },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
            
        } catch (error) {
            res.send(error)
        }


    }

    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (targetBanner.sortOrder != req.body.sortOrder) {
        const sortExist = await banner.findAll({
            where: {
                sortOrder: req.body.sortOrder,
                placeId: req.body.placeId,
                bannerCategoryId: req.body.bannerCategoryId
            }
        })
        if (sortExist.length != 0) return res.status(400).send({
            Message: [
                "sort order already exist"
            ]
        })
        const imageB = targetBanner.bannerImage.slice(52)
        const bannerImage = await uploadFile(req.file, "banners")
        if (bannerImage) { deleteimage("banners", imageB) }
        try {
            const result = await banner.update({
                bannerImage: bannerImage.Location,
                title: req.body.title,
                bannerCategoryId: req.body.bannerCategoryId,
                placeId: req.body.placeId,
                sortOrder: req.body.sortOrder
            },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
        } catch (error) {
            res.send(error)
        }
       

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (targetBanner.bannerCategoryId != req.body.bannerCategoryId || targetBanner.placeId != req.body.placeId) {
        const bannerLimit = await banner.findAll({
            where: {
                placeId: req.body.placeId,
                bannerCategoryId: req.body.bannerCategoryId
            }
        })
        if (bannerLimit.length >= 8) return res.status(400).send({
            Message: [  
                "sort order limit is over in this place"
            ]
        })

        const imageB = await targetBanner.bannerImage.slice(52)
        const bannerImage = await uploadFile(req.file, "banners")
        if (bannerImage) { deleteimage("banners", imageB) }
        banner.update({
            bannerImage: bannerImage.Location,
            title: req.body.title,
            bannerCategoryId: req.body.bannerCategoryId,
            placeId: req.body.placeId,
            sortOrder: req.body.sortOrder
        },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(() => {
            res.send({
                data: {
                    succss: true
                }
            })
        }).catch(err => {
            res.send(err)
        })

    }


    // res.send(targetBanner)
    else {
        const imageB = targetBanner.bannerImage.slice(52)

        const bannerImage = await uploadFile(req.file, "banners")
        if (bannerImage) { deleteimage("banners", imageB) }
        banner.update({
            bannerImage: bannerImage.Location,
            title: req.body.title,
            bannerCategoryId: req.body.bannerCategoryId,
            placeId: req.body.placeId,
            sortOrder: req.body.sortOrder
        },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(() => {
            res.send({
                data: {
                    succss: true
                }
            })
        }).catch((err) => {
            res.send(err)
        })

    }

}

const deleteBanner = async (req, res) => {
    // banner.findOne({
    //     where:{
    //         id : req.params.id
    //     }
    // })
    // .then((result)=>{

    //     const imageName = result.bannerImage.slice(52)
    //     res.send(imageName)
    //     deleteimage('banners', imageName)

    const target = await banner.findOne({
        where: {
            id: req.params.id
        }
    })
    const imageName = await target.bannerImage.slice(52)
    // res.send(imageName)

    try {
        deleteimage("banners", imageName)

        const del = await banner.destroy({
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

    // })

    // banner.destroy({
    //     where:{
    //         id : req.params.id
    //     }
    // })
}


module.exports = {
    addBanner,
    getBanners,
    getAllBanners,
    updateBanner,
    deleteBanner,
    upload,
    distance,

}