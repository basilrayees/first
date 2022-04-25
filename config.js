 // DATA BASE CONNECTION(SEQUELIZE)
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('offer_app', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool:{max:5,min:0, idle:10000}
});

sequelize.authenticate()
  .then(() => {
    console.log('database connected');
  })
  .catch(err => console.log(`Error:${err}`))

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.country = require('./routes/country/country.model')(sequelize, DataTypes);
db.state = require('./routes/states/state.model')(sequelize, DataTypes);
db.place = require('./routes/place/place.model')(sequelize, DataTypes);
db.category = require('./routes/Category/category.model')(sequelize, DataTypes);
db.store = require('./routes/store/store.model')(sequelize,DataTypes);
db.store_has_category = require('./routes/store_has_category/store_has_category.model')(sequelize,DataTypes);
db.banner_category = require('./routes/bannerCategory/bannerCategory.model')(sequelize,DataTypes);
db.banner = require('./routes/banners/banner.model')(sequelize,DataTypes)
db.offer = require('./routes/offers/offer.model')(sequelize, DataTypes)

// relation b/w country and state
db.country.hasMany(db.state,{
    foreignKey:{
        allowNull:false
    },
    onDelete: 'RESTRICT',
})
db.state.belongsTo(db.country)

// relation b/w state and place
db.state.hasMany(db.place,{
    foreignKey:{
        allowNull:false
    },
    onDelete: 'RESTRICT',
})
db.place.belongsTo(db.state)

// relation b/w place and store
db.place.hasMany(db.store,{
  foreignKey:{
    allowNull:false,
  },
  onDelete: 'RESTRICT',
})
db.store.belongsTo(db.place)

// relation b/w store and category (many-to-many)
db.store.belongsToMany(db.category, {through:'store_has_category', foreignKey:"storeId"})
db.category.belongsToMany(db.store, {through:'store_has_category', foreignKey:"categoryId"}) 

// relation b/w banner_category and banner
db.banner_category.hasMany(db.banner,{
  foreignKey:{
    allowNull:false
  },
  onDelete: 'RESTRICT',
  // onUpdate: 'RESTRICT'
})
db.banner.belongsTo(db.banner_category)


// relation b/w banner and place
db.place.hasMany(db.banner,{
  foreignKey:{
    allowNull:false
  },
  onDelete: 'RESTRICT',
})
db.banner.belongsTo(db.place)

// relation b/w store and offer

db.store.hasMany(db.offer,{
  foreignKey:{
    allowNull:false
  },
  onDelete: 'RESTRICT',
})
db.offer.belongsTo(db.store)

// relation b/w category and offer

db.category.hasMany(db.offer,{
  foreignKey:{
    allowNull:false
  },
  onDelete: 'RESTRICT',
})
db.offer.belongsTo(db.category)



// "sqlite3": "^5.0.2"

db.sequelize.sync({alter: false})
.then(()=>{
    console.log('done');
})
module.exports = db