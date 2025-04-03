module.exports = fn =>{
    return(req, res, next)=>{
        fn(req,res,next).catch(next);
    }
}
// should always return a function, becuase express always see function to execute when route handler function is called
// next should be passed, a async function wil always returns a promise and catch the error in common and calling next method