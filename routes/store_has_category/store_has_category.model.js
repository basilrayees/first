

module.exports = (sequelize,DataTypes)=>{
    const store_has_category = sequelize.define('store_has_category',{
        storeId:{
            type:DataTypes.INTEGER,
           
        },
        categoryId:{
            type:DataTypes.INTEGER,
           
        },
    });
    return store_has_category
}