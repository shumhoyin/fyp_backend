const express = require('express');
const app = express();
const cors = require('cors')
const ConnectDB = require('./DBConnection');
const errorController = require('./controllers/errorController')

//route shortcut
const Router = require('./routes/index.route');

//default server port
const Port = process.env.Port || 3001;

//connect database
    ConnectDB();

    app.use(express.json({ extended: false }));
    //make use of cors to simplify the access-control
    app.use(cors());
    //route all the api to Router
    app.use('/api', Router);

    //setting a static path such that client can access all the static things inside the server
//public is the root folder
//localhost:3001/locationImg/xxx.jpg
    app.use(express.static('public'));

app.listen(Port, () => {
    console.log('Server started');
    console.log('Server Listening port 3001');
});
