const mongoose = require('mongoose');
const url = 'mongodb://0.0.0.0:27017/CRUD';
// mongoose.connect('url') 
mongoose.connect(url);
const CRUD=mongoose.connection;

CRUD.on('error',console.error.bind(console,"Error connecting to MongoDB"));

CRUD.once('open',()=>{
    console.log("Connected to Database :: MongoDB ")
});

module.exports=CRUD;