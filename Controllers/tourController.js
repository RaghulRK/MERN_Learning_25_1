const Tour = require("./../Models/tourModel");
const APIFeatures = require("./../Utils/apiFeatures");
const catchasync = require("./../Utils/catchAsync");
const AppError = require("./../Utils/appError");

// alias routing by setting predefined query parameter values
exports.aliasRoute = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = "_ratingsAverage,price";
    req.query.field = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

// removed try and catch to remove repepated code and handling in common way by function a and pass async function as paramter
exports.createTour = catchasync(async (req, res, next) => {
    const tourData = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            tour: tourData
        }
    })
})

exports.getAllTours = catchasync(async (req, res, next) => {
    // EXECUTE THE QUERY 
    const uodatedQuery = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tour = await uodatedQuery.query;

    // SEND THE RESPONSE
    res.status(200).json({
        status: "success",
        requestedAt: req.RequestTime,
        results: tour.length,
        data: {
            tours: tour
        }
    })
    // 1st way of using query parameters
    // let query = Tour.find(updatedQuery);
    // 2nd way using mongo db drivers
    // const allData = await Tour.find().where("difficulty").equals("easy").where("duration").equals(5);
})

exports.getindividualtour = catchasync(async (req, res, next) => {
    const getData = await Tour.findById(req.params.id);
    if(!getData){
        return next(new AppError("Could not find tour with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            tours: getData
        }
    }
    )
})

exports.updateTour = catchasync(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!updatedTour){
        return next(new AppError("Could not find tour with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            updatedTour
        }
    }
    )
})

exports.deleteTour = catchasync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
        return next(new AppError("Could not find tour with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null
    }
    )
})

exports.getTourStatus = catchasync(async (req, res, next) => {
    const getagg = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 }
            }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                avgPrice: { $sum: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                numTours: { $sum: 1 }
            }
        }, {
            $sort: { avgPrice: -1 }
        }
        // ,{
        //     $match : {
        //         _id : { $ne : "EASY"}
        //     }
        // }
    ]);
    res.status(200).json({
        status: "success",
        data: {
            getagg
        }
    })
})
exports.getMonthlyPlans = catchasync(async (req, res, next) => {
    const year = req.params.year * 1;
    const aggData = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);
    res.status(200).json({
        status: "success",
        data: {
            aggData
        }
    })
})
//commented code

// const fs = require("fs");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
// exports.checkID = (req,res,next,val) =>{
//     console.log(`${val} this is the val of id in param middleware`);
//     if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//         status: "fail",
//         message: "Invalid ID"
//     })
// }
// next();
// }

// exports.checkpostTourMiddleware = (req,res,next) =>{
//     console.log("hello from my own middleware");
//     const value = req.body;
//     if(value.name === "" && value .difficulty === ""){
//         return res.status(404).json({
//             status: "fail",
//             message: "invalid id"
//         })
//     }
//     next();
// }
//create tour
// const newId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: newId }, req.body);
// tours.push(newTour);
// fs.writeFile((`${__dirname}/dev-data/data/tours-simple.json`), JSON.stringify(tours), err => {
//     res.status(201).json({
//         status: "success",
//         data: {
//             tour: newTour
//         }
//     })
// })

