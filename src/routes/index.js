const express=require('express')
const router=express.Router();
const v1apiRoute=require('./v1/index')
router.use('/v1',v1apiRoute);
module.exports=router;