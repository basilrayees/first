module.exports = (sequelize,DataTypes)=>{
    const category = sequelize.define('catogery',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        
    });
    return category
}