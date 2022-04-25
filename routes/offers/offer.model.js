
const moment = require('moment')
module.exports = (sequelize,DataTypes)=>{
    const offer = sequelize.define('offer',{
        
        image:{
            type:DataTypes.STRING,
            allowNull:false
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.STRING,
            allowNull:true
        },
        featuredOffer:{
            type:DataTypes.BOOLEAN,
            defaultValue: false        
        },  
        sponserOffer:{
            type:DataTypes.BOOLEAN,
            defaultValue: false
        },      
        slot:{
            type:DataTypes.INTEGER,
            allowNull:true,
            defaultValue: 0  
        },        
        
        startDate:{
            type:DataTypes.DATEONLY ,
            allowNull:false,
           
        },
        endDate:{
            type:DataTypes.DATEONLY ,
            allowNull:false
        }

    });
    return offer
}