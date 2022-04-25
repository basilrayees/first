const db = require('../../config')
const state = db.state

const getAllState = async (req, res )=>{
   state.findAll().then((result) => {
       res.send(result)
   }) 
}

const addState = async (req, res) =>{
    state.create({
        name: req.body.name,
        countryId:req.body.countryId
    }).then((result)=>{
        res.send(result)
    })
}

const deleteState = async(req, res)=>{
    state.destroy({
        where: {
            id: req.params.id
        }
    }).then(()=>res.send('Success'))
}

const updateState = async(req, res) =>{
    state.update(
        { 
            name:req.body.name ,countryId :req.body.countryId 
        },
        { where: {
             id:req.params.id 
            }  }
        
        ).then(() => res.send('succcess'))
}


module.exports = {
    getAllState,
    addState,
    deleteState,
    updateState
}






//