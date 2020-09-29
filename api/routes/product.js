const express=require('express');
const router=express.Router();
const mongoose =require('mongoose');
const Product=require('../models/product')


router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response ={
            count : docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price : doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url:'http://localhost:3000/products/'+doc._id
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
// message:'handling get request to /products'
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
    const product =new Product({
       _id: new mongoose.Types.ObjectId(),
       name: req.body.name,
       price: req.body.price
    });
    product
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message:'created successfully',
            createdProduct:{
                name:result.name,
                price:result.price,
                requested:{
                    type: 'GET',
                    url:"http://localhost:3000/products/"+ result._id
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
router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id).exec().then(
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
router.patch('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    const updateOps= {};
    for(const ops of req.body){
        console.log(ops.propName+"==="+ops.value)
        updateOps[ops.propName]= ops.value;
    }
    Product.update({_id: id},{$set: updateOps})
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

 router.delete('/:productId',(req,res,next)=>{
     const id=req.params.productId;
     Product.remove({_id: id})
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