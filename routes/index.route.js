const express = require('express');
const userRoutes = require('./user.route');
const locationRoutes = require('./location.route');


const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>{
    try {


        console.log("inside index.route");

        //return res with this format if success
        res.setHeader('Access-Control-Allow-Origin', '*');
        return  res.json({
            resCode: 1,
            msg: 'success',
            payload: "",
          });

        }catch (e){
            //return res with this format if fail
            console.log(e);
            return  res.json({
                resCode: 0,
                msg: 'fail',
                payload: ""
              });
        }
});

//user related
router.use('/User', userRoutes);
router.use('/Location', locationRoutes);


module.exports = router;
