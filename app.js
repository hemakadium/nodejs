const express=require('express');

const app=express();
const morgan =require('morgan');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const config = require('./config/AppConfig');
//=================================================================
/**
 * Data base connectivity
 */
mongoose.connect(config.database.url);
mongoose.connection.on('connected', () => {
    console.log('connected to db ' + config.database.url);
});

mongoose.connection.on('error', (err) => {
    console.log('error: ' + err);
});
//=================================================================

const productRoutes= require('./api/routes/product');

 

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());




//Routes which should handle request
app.use('/products',productRoutes)
app.use((req, res, next) => {
    res.header( 'Access-Control-Allow-Oigin','*');
    res.header(
        'Access-Control-Allow-Headers',
        '*'
        );
        if(req.method==='OPTIONS'){
            res.header('Access-Control-Allow-Methods','POST ,PUT ,PATCH, GET, DELETE');
            return res.status(200).json({});
        }

        next();
});
   

app.use((req,res,next)=>{
const error=new Error('Not found');
error.status=404;
next(error);
});

app.use((error,req,res,next)=>{
res.status(error.status || 500);
res.json({
    error:{
        message : error.message
    }
});

});
// app.use((req,res,next)=>{
// res.status(200).json({
//     message:'it works'
// })
// });

module.exports=app;
