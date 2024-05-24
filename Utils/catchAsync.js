const AppError= require("./AppError")
function catchAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err=>{ next(new AppError(err.message,501))});
    }

}
module.exports = catchAsync;