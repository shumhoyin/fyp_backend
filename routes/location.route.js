const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const LocationController = require ('../controllers/location.controller');


//import different routes for api routing
router.route('/LocationHealthCheck').get(asyncHandler(LocationController.LocationHealthCheck));
router.route('/ShareLocation').post(asyncHandler(LocationController.ShareLocation));
router.route('/GetAll').get(asyncHandler(LocationController.GetLocation));
router.route('/GiveComment').post(asyncHandler(LocationController.GiveComment));
router.route('/GetDetail').get(asyncHandler(LocationController.GetDetail));
router.route('/GiveLike').post(asyncHandler(LocationController.GiveLike));
router.route('/GiveDislike').post(asyncHandler(LocationController.GiveDislike));
router.route('/GetKeyword').get(asyncHandler(LocationController.GetKeyword))






module.exports = router;
