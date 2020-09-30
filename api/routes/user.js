const express=require('express');
const router=express.Router();
const mongoose =require('mongoose');
const User=require('../models/user')


router.get('/',(req,res,next)=>{
    User.find()
    .select('firstName lastName email password _id')
    .exec()
    .then(docs => {
        const response ={
            count : docs.length,
            User: docs.map(doc => {
                return {
                    firstName: doc.firstName,
                    lastName : doc.lastName,
                    email : doc.email,
                    password : doc.password,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url:'http://localhost:3000/user/'+doc._id
                    }
                }
            })
        }
        console.log(docs.length);
        if(docs.length >= 0){
            res.status(200).json(response);
        }else{
            res.status(404).json({message:'no entries found...'});
        }
      
    })
// res.status(200).json({
// message:'handling get request to /User'
// })
.catch(err =>{
console.log(err);
res.status(500).json({
    error : err
})
});
});

router.post('/', (req, res, next) => {
    //  const products = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const user =new User({
       _id: new mongoose.Types.ObjectId(),
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       email: req.body.email,
       password: req.body.password,
    });
    user.save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message:'created successfully',
            createdUser:{
                firstName:result.firstName,
                lastName:result.lastName,
                email:result.email,
                requested:{
                    type: 'GET',
                    url:"http://localhost:3000/user/"+ result._id
                }
            }
            });
        })
        .catch(
            err => {
                console.log(err);
    res.status(500).json({
        error: err,
   //// message:'handling post request to /products',
   // createdProduct:product
    });
 
    });
});
router.get('/:userId',(req,res,next)=>{
    const id=req.params.userId;
    User.findById(id).exec().then(
        doc => {
            console.log("from database",doc);
          
            if(doc){
                res.status(200).json(doc);
            }else{
                 res.status(404).json({message: 'No validentry found for this id'});
            }
        }
    ).catch(
        err => {console.log(err);
        res.status(500).json({error :err});
        });
    // if(id==='special'){
    //     res.status(200).json({
    //         message:'you discovered the special ID',
    //         id:id
    //     });
    // }else{
    //     res.status(200).json({
    //         message:'you passed and ID'
    //     })
    // }

});
router.patch('/:userId',(req,res,next)=>{
    const id=req.params.userId;
    const updateOps= {};
    for(const ops of req.body){
        console.log(ops.propName+"==="+ops.value)
        updateOps[ops.propName]= ops.value;
    }
    User.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
console.log(err);
res.status(500).json({
    error:err
});
    });
   // Product.update({_id:id}, {$set: {name:req.body.newname,price:req.body.newprice}})
    // res.status(200).json({
// message:'updated successfully'
//      });
 });

 router.delete('/:userId',(req,res,next)=>{
     const id=req.params.userId;
     User.remove({_id: id})
     .exec()
     .then(result => {
         res.status(200).json(result);
     })
     .catch(err =>{
         console.log(err);
         res.status(500).json({
            error :err
         });

     })
     
//     res.status(200).json({
// message:'deleted successfully'
//     });
});
    module.exports=router;