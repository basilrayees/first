const Joi = require("joi");

const countrySchema = Joi.object({
    name: Joi.string().required(),
    // mobile: Joi.string().required(),
    // role: Joi.number().required(),
})
const stateSchema = Joi.object({
    name: Joi.string().required(),
    countryId: Joi.number().required()

})
const placeSchema = Joi.object({
    name: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    stateId: Joi.number().required(),
    mainBannerCount: Joi.number(),
    subBannerCount: Joi.number(),
    categoryBannerCount: Joi.number(),
})

const storeSchema = Joi.object({
    storeName: Joi.string().required(),
    storeUrl: Joi.string().required(),
    ownerName: Joi.string().required(),
    email: Joi.string(),
    phoneNumber: Joi.number().required(),
    password: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    address: Joi.string().required(),
    logo: Joi.any()
        .meta({ swaggerType: 'file' })
        .optional()
        .allow('')
        .description('image file'),
    placeId: Joi.number().required(),
    categoryId: Joi.required()

})

const bannerSchema = Joi.object({
    bannerImage: Joi.any()
        .meta({ swaggerType: 'file' })
        .optional()
        .allow(''),
        // .required(),

    title: Joi.string().required(),
    bannerCategoryId: Joi.number().required(),
    placeId: Joi.number().required(),
    sortOrder: Joi.number().required()
})

const offerSchema = Joi.object({
    image: Joi.any()
    .meta({ swaggerType: 'file' })
    .optional()
    .allow(''),
    title: Joi.string().required(),
    description: Joi.string().required(),
    featuredOffer: Joi.boolean(),
    sponserOffer: Joi.boolean(),
    slot: Joi.number(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    storeId: Joi.number().required(),
    catogeryId: Joi.number().required(),
})

// const loginSchema = Joi.object({
//     mobile: Joi.string().required().min(10).max(10),
//     pin: Joi.number().required().min(4).max(4),
// })


module.exports = {

    schemas: {
        countrySchema,
        stateSchema,
        placeSchema,
        storeSchema,
        bannerSchema,
        offerSchema
        // loginSchema: loginSchema
    },
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                const err = result.error.details.flatMap(e => e.message.replace(/"/g, ""))
                return res.status(400).json({
                    message: err
                })
            } else {
                if (!req.value) {
                    req.value = {}
                }
                req.value['body'] = result.value;
                next();
            }
        }
    }
}
