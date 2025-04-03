const User = require("./../Models/userModel");
const catchasync = require("./../Utils/catchAsync");

exports.getallusers = catchasync(async (req, res, next) => {
    const user = await User.find();
    // SEND THE RESPONSE
    res.status(200).json({
        status: "success",
        results: user.length,
        data: {
            users: user
        }
    })
})
exports.getuser = ((req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    })
})
exports.updateuser = ((req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    })
})
exports.deleteuser = ((req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    })
})
exports.createuser = ((req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    })
})
