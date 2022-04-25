

module.exports = (sequelize,DataTypes)=>{
    const place = sequelize.define('place',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        lat:{
            type:DataTypes.DECIMAL(12,9),
            allowNull:false
        },
        lng:{
            type:DataTypes.DECIMAL(12,9),
            allowNull:false
        },
        mainBannerCount:{
            type:DataTypes.INTEGER,
            allowNull:false,
             defaultValue: 3
        },
        subBannerCount:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 3
        },
        categoryBannerCount:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 3
        }
       
    });
    return place
}