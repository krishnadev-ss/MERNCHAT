const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please Enter all the Feilds')
    }

    //search the email in the database

    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    //if not exist create a new user

    const user = await User.create({
        name,
        email,
        password,
        pic
    });


    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Failed to create the user')
    }
});


const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}); //if exist in our database or not
    
    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid Email or Password')
    }
});

// /API/SEARCH/QUERY

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [  //perform or operation in mongodb
            {name: {$regex: req.query.search, $options: "i"}}, //using regex for searching helps to match strings in mongodb
            {email: {$regex: req.query.search, $options: "i"}} // i is using for matching higher and lower cases too
        ]
    }
    : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id }})
    res.send({users})
    
})

module.exports = {registerUser, authUser,allUsers}