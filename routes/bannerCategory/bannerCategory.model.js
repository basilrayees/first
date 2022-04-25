module.exports = (sequelize,DataTypes)=>{
    const banner_category = sequelize.define('banner_category',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        
    });
    return banner_category
}