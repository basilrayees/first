
const store = require('./store/store.router')
const country = require('./country/country.router')
const state = require('./states/state.router')
const place = require('./place/place.router')
const category = require('./Category/category.router')
const banner = require('./banners/banner.router')
const bannerCategory = require('./bannerCategory/bannerCategory.router')
const offer = require('./offers/offer.router')



function createRoutes(app){
    app.use('/api', store,state,country,place,category,banner,bannerCategory,offer)
}


module.exports = {
    createRoutes: createRoutes
}