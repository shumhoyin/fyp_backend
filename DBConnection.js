var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = "mongodb+srv://shumhoyin:m9uMPPhjXd0uuc2d@appcluster.hwh3s.mongodb.net/LocationApp?retryWrites=true&w=majority";

const ConnectDB = () =>{

    mongoose.connect(mongoDB,{
        useUnifiedTopology: true, 
        useNewUrlParser: true
     }).then(()=>{
    
    console.log("Mongodb Connected ! ");
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
    //Get the default connection
    var db = mongoose.connection;
    
    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

     }).catch(()=>{
        console.log("Mongodb Not Connected ! ");
     });

}



module.exports = ConnectDB;


