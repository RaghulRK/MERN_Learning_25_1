const AppError = require("./../Utils/appError");
const sendDevError = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errStack: err.stack,
        error: err
    })
}
const sendProdError = (res, err)=>{
    // all the operational errors are logged here
    if(err.operational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        // all the programmatic errors are logged here
        // first log the error and send a generic message to given to end users
        console.error(err);

        res.status(500).json({
            status: "error",
            message: "somrthing went wrong here!"
        })
    }

}
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}
const handleDuplicateErrorDB = (err) =>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate value should not be given ${value}`;
    return new AppError(message, 400);
}
const handleValidationError = (err) =>{
    const errors = Object.values(err.errors).map( el => el.message);
    const message = `Invalid input data ${errors.join('. ')}`;
    return new AppError(message, 400);
}
module.exports = (err, req, res, next)=>{
    //console.log(err.stack); - track error from where did the error occurred
    err.statusCode = err.statusCode  || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === "development"){
        sendDevError(res, err);
    } else if( process.env.NODE_ENV === "production"){
        let error ={...err};
        if(err.name === "CastError"){
            error = handleCastErrorDB(error);
        }
        if(err.code === 11000){
            error = handleDuplicateErrorDB(error);
        }
        if(err.name === "ValidationError"){
            error = handleValidationError(error);
        }
        sendProdError(res, error);
    }
}