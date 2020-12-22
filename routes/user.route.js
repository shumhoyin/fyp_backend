const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const UserController = require ('../controllers/user.controller');


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>{
    try {
        console.log("inside User.route");

        //return res with this format if succes
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


//import different 
router.route('/UserRegister').post(asyncHandler(UserController.UserRegister));
router.route('/UserHealthCheck').get(asyncHandler(UserController.UserHealthCheck));





module.exports = router;