const express=require('express');
const router=express.Router();
const mongoose =require('mongoose');
const Order=require('../models/order');
const Product=require('../models/product');
router.get('/',(req,res,next)=> {
   Order
   .find()
   .select('product quantity _id')
   .populate('product','name')
   .exec()
   .then(docs =>{
   res.status(200).json({
   count: docs.length,
   orders: docs.map(doc =>{
       return {
          _id:doc._id,
          product:doc.product,
          quantity:doc.quantity,
         url:'http://localhost:3000/orders/'+doc._id
   }
   })
   
});
   })
   .catch(err => {
      console.log(err);
      res.status(500).json({
      error : err
   });
});
   //  res.status(200).json({
//     message:'Orders fetched '
//  });
});
router.post('/',(req,res,next)=> {
   //check product exist
   Product.findById(req.body.productId)
   .then(product =>{
      if(!product){
         return res.status(404).json({
            message:'product not found'
         });
      }
      const order =new Order({
         _id:mongoose.Types.ObjectId(),
         quantity:req.body.quantity,
         product: req.body.productId
            });
           return order.save();
         })
            .then(result => {
               console.log(result);
               res.status(201).json(result);
            })// if product is not there
            .catch(err =>{
               console.log(err);
             res.status(500).json({
                message:'product is not there',
             error : err
            });
            //  res.status(201).json({
            //     message:'Orders was craeted '
            //  });
            });
   });
      
 
   
   router.get('/:orderId',(req,res,next)=> {
      const id=req.params.orderId;
      console.log(id)
      Order.findById(req.params.orderId)
      .populate('product')
      .exec()
      .then(
          order => {
              console.log("from database",order);
            
              if(order){
                  res.status(200).json(order);
              }else{
                   res.status(404).json({message: 'No validentry found for this id'});
              }
          }
      ).catch(
          err => {
             console.log(err);
          res.status(500).json({
             message:'order not found',
             error :err});
          });
   //  res.status(200).json({
   //     message:'Orders details ',
   //     orderId: req.params.orderId
   //  });
   });

   router.patch('/:orderId',(req,res,next)=> {
      const id=req.params.orderId;
    const updateOps= {};
    for(const ops of req.body){
        console.log(ops.propName+"==="+ops.value)
        updateOps[ops.propName]= ops.value;
    }
    
    Order.update({_id: id},{$set: updateOps})
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
   //  res.status(200).json({
   //     message:'Orders deleted ',
   //     orderId: req.params.orderId
   //  });
   });
   router.delete('/:orderId',(req,res,next)=>{
      const id=req.params.orderId;
      Product.remove({_id: id})
      .exec()
      .then(result => {
          res.status(200).json({
             message:'order deleted',
             request:{
                type:"post",
                url:"http://localhost:3000/orders",
                body: {productId:'ID',quantity:'Number'}
             }
          });
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