

module.exports = (sequelize,DataTypes)=>{
    const state = sequelize.define('state',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        }
    });
    return state
}