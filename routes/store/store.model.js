module.exports = (sequelize,DataTypes)=>{
    const store = sequelize.define('store',{
        storeName:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        storeUrl:{
            type:DataTypes.TEXT,
            allowNull:false,
            unique: true

        },
        ownerName:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        phoneNumber:{
            type:DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        status:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 1
        },
        lat:{
            type:DataTypes.DECIMAL(12,9),
            allowNull:false
        },
        lng:{
            type:DataTypes.DECIMAL(12,9),
            allowNull:false
        },    
        address:{
            type:DataTypes.STRING,
            allowNull:false
        },
        logo:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:''
        }


    });
    return store
}