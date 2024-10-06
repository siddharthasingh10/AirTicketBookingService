const {BookingService}=require('./../services/index');
const bookingService=new BookingService();
const {StatusCodes}=require('http-status-codes')

const create=async(req,res)=>{
    try {
        const response =await bookingService.createBooking(req.body);
        res.status(StatusCodes.CREATED).json({
            message:'successfully completed booking ',
            success:true,
            err:{},
            data:response

        })
    } catch (error) {
        console.log('i am here in error in create',error);
        res.status(error.StatusCodes || 500).json({
            message:error.message,
            success:false,
            err:error.explanation,
            data:{}

        })

        
    }

};


module.exports={
    create

}