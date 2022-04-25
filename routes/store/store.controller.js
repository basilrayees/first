
const db = require('../../config')
const store = db.store;
const store_has_category = db.store_has_category
const category = db.category
const path = require('path');
const multer = require('multer');
const { uploadFile } = require('../middleware/s3');

const storage = multer.diskStorage({
    // destination: function(req, file, callback){
    //     callback(null, './upload')
    // },
    filename: function(req, file, callback){
        callback(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage,
    
    limit:{
        fieldSize: 100000
    }
});

// const getallStores = async (req, res) => {
//     store.findAll()
//         .then((result) => {
//             res.send({ data: result })
//         })
// }

const addstore = async (req, res) => {

    const store_url = await store.findOne({
        where:{
            storeUrl: req.body.storeUrl
        }
    })
   
    if(store_url) return res.status(400).send({
        Message:[
            'store_url already exist'
        ]
    }); 

    const logoImage = await uploadFile(req.file,"store_logo")
    store.create({
        storeName: req.body.storeName,
        storeUrl: req.body.storeUrl,
        ownerName: req.body.ownerName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        lat: req.body.lat,
        lng: req.body.lng,
        address: req.body.address,
        logo: logoImage.Location,
        placeId: req.body.placeId
    }).then(  async(result)=>{
        res.send(result)
        const categoryID = req.body.categoryId
        await categoryID.forEach(element => {
            store_has_category.create({
                storeId:result.id,
                categoryId:element
            })
           
        })       
    }).catch(err => res.send(err))    
}




const getallStores = async (req, res) => {
    store.findAll({
        include: [{
            model: category,
            attributes: ['id', 'name'],
            through: { attributes: [] }
        }]
    })
    .then((result) => { res.send({ data: result }) })

}



const getStoreById = async (req, res) => {
    store.findAll({
        include: [{
            model: category,
            attributes: ['id', 'name'],
            through: { attributes: [] }
        }],
        where: {
            id: req.params.id
        }
    }).then((result) => {
        res.send({ data: result })
    })
}


const deleteStore = async (req, res) => {
    store_has_category.destroy({
        where: {
            storeId: req.params.id
        }
    }).then(
        store.destroy({
            where: {
                id: req.params.id
            }
        })

    )

        .then(() => res.send('succcess'))
        .catch(err => res.send(err))
}

const updateStore = async (req, res) =>{
    // store.findAll({
    //     include: [{
    //         model: category,
    //         attributes: ['id', 'name'],
         
    //     }],
    //     where: {
    //         id: req.params.id
    //     }
    // }).then((result) => {
    //     console.log(result[0]);
    //     res.send( result[0])
    // })
    const logoImage = await uploadFile(req.file,"store_logo")
    store.update({
        storeName: req.body.storeName,
        ownerName: req.body.ownerName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        lat: req.body.lat,
        lng: req.body.lng,
        address: req.body.address,
        logo: logoImage.Location,
        placeId: req.body.placeId
    }   
    ,{
        where:{
            id:req.params.id
        }
    }
    ).then(  ()=>{
         store_has_category.destroy({
            where:{
                storeId:req.params.id
            }             
        }).then(  ()=>{
            const categoryID = req.body.categoryId;
            categoryID.forEach(element => {
                store_has_category.create({
                    storeId:req.params.id,
                    categoryId:element
                })
            });
        }
            
        )
        
        // const arr1 = []
        // const arr2 = req.body.categoryId
        // cat.forEach(element => {
        //     arr1.push(element.categoryId)
          
        // });
        // console.log(arr1);
        // console.log(arr2);
       
        // function diffArray(arr1, arr2) {
        //     return arr1
        //       .concat(arr2)
        //       .filter(item => !arr1.includes(item) || !arr2.includes(item));
        //   }
        //  const diff = (diffArray(arr2, arr1));
        //  console.log(diff);
       
    }).then((result)=>{
        res.send({result:"success"})
    })
    .catch(err =>{
        res.send(err)
    })
        
        // categoryID.forEach( async element => {
        //     const cat = await store_has_category.findOne({
        //         where:{
        //             storeId:req.params.id,
        //             // categoryId:element
        //         }
               
        //     })
        //     res.send(cat)
           
        // }).then(res.send())
        // res.send(result)
            // for (let i = 0; i < categoryID.length; i++) {
            //     console.log("hwllo");
            //     // const cat = store_has_category.findOne({
            //     //     where:{
            //     //         storeId:req.params.id,
            //     //         categoryId: parseInt(categoryID[i])
            //     //     }
            //     // })
            
            //     // store_has_category.update({
            //     //     categoryId: parseInt(categoryId[i])
            //     // },{where:{
            //     //     storeId: req.params.id,
            //     // }})
            // }
        

    
  
}

// state.update(
//     { 
//         name:req.body.name ,countryId :req.body.countryId 
//     },
//     { where: {
//          id:req.params.id 
//         }  }
    
//     ).then(() => res.send('succcess'))


module.exports = {
    addstore,
    getallStores,
    getStoreById,
    deleteStore,
    updateStore,
    upload
    // getStoreWithCategory

}