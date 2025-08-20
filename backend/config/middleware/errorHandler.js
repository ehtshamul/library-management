// errorHandler 

const errorHandler =(err ,req,res,next)=>{
    console.error(err.stack);
    const statusCode =res.statusCode !== 200 ? res.statusCode :500;
    const message =err.message || 'internal server error';
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
}

module.exports = errorHandler;