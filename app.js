const express = require('express')
const morgan = require("morgan")
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const AppError = require("./Utils/appError");
const errorRouteHandler = require("./Controllers/errorController");

const app = express();

// third party middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

// To get the req body in the req node of the client request
app.use(express.json());

// to access the static files using inbuilt middleware instead of route or from folder.
app.use(express.static(`${__dirname}/public`));

// // user defined middleware 
// app.use((req,res,next)=>{
//     console.log("Hello from the middleware!!");
//     next();
// })

app.use((req, res, next) =>{
    req.RequestTime = new Date().toISOString();
    next();
})

// eslinit configuration for better coding standard - npm command
//npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
// all above middleware will run on all the routes

// below middleware will run on the specific route defined in it

// Get API call
// app.get("/api/v1/tours", getAllTours);

// // get API  - tour with individual data
// app.get("/api/v1/tours/:id", getindividualtour);

// // POST API call
// app.post("/api/v1/tours", createTour);

// // PATCH API call
// app.patch("/api/v1/tours/:id", updateTour)

// app.delete("/api/v1/tours/:id", deleteTour)

// added to handle duplicate of route resources by calling app.route function followed by http method to it

// create a separate router for tours and user and use them as middleware, so only middleware stack it will detect the route defined, 
// when route is hit, based on that router will be called and its respective route and http menthod are called.

// first define router 

// const tourRouter = express.Router();
// const userRouter = express.Router();

// next replace the created router

// tourRouter.route("/").get(getAllTours).post(createTour);

// tourRouter.route("/:id").get(getindividualtour).patch(updateTour).delete(deleteTour);

// userRouter.route("/").get(getallusers).post(createuser);

// userRouter.route("/:id").get(getuser).patch(updateuser).delete(deleteuser);

// next use the router as a middleware

// console query creation

// collections - > documents - > everything is stored as key & value pair, BSON data format, a unique id is created for each documents

// use db_name, show collections coll_name , show dbs, db.tours.insertOne, db.tours.insertMany, db.tours.find({ name: "hello" })

// query data db.tours.find({name {$lte: 500} , rating : {$gte: 4.8}})

// or operatoe db.tours.find({ $or: [ {},{}]})

// delete db.tours.deleteone, deletemany
// delete db.tours.deletemany({}) - deletes all the documents in the place

// my result to contain certain column value db.tours.find({ -- define ur operator}, {name:1})

// update  - db.tours.updateOne( { first specify which document to update}, { $set : { price : 5.0 }}), updateMany to update all matches the document value given

// db password created atlasdb123

// everything in mongo db is BSON which is JSON

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// the route works in the order which we defined, so if it does not match any of the above route, the 
// below middleware executes for all types htttp method, if u define it executes for all type of request and stops it.
app.all("*", (req,res,next)=>{

    // const err = new Error(`cant find ${req.originalUrl} on this server!`);
    // err.status = 'fail'; 
    // err.statusCode = 404;
    // next(err);
    next(new AppError(`cant find ${req.originalUrl} on this server!`, 404));
})

// common error handling middleware default provided by express

app.use(errorRouteHandler);

module.exports = app;
