module.exports = (sequelize,DataTypes)=>{
    const banner = sequelize.define('banner',{
        bannerImage:{
            type:DataTypes.STRING,
            allowNull:false
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        sortOrder:{
            type:DataTypes.INTEGER,
            allowNull:false
        }

        
    });
    return banner
}