// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

// const country = sequelize.define('County', {
//     Name:{
//         type: DataTypes.STRING,
//         allowNull:false
//     }
// })

// module.exports = {
//     country:country
// }
module.exports = (sequelize,DataTypes)=>{
    const Country = sequelize.define('country',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        }
    });
    return Country
}