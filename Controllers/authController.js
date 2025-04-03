const User = require("./../Models/userModel");
const catchAsync = require("./../Utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../Utils/appError");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //1 check values of email or password is not null or not given and throw error
    if (!email || !password) {
        return next(new AppError("Please provide email or password!", 400));
    }
    // 2 check if the user exists & password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword( password , user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    // 3 generte the token and sent to the client
    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    })
});