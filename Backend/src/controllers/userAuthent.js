const validate = require("../utils/validator");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
// const Submission = require("../Models/submission")


// User registration
const register = async (req, res)=>{
    try{
        // validate the data;
        validate(req.body); 
        const {firstName, emailId, password}  = req.body;

        // Hash the password
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user'
    
        // Create user
        const user =  await User.create(req.body);

        // Assign jwt token to the user
        const token =  jwt.sign({_id:user._id , emailId:emailId, role:'user'}, process.env.JWT_KEY, {expiresIn: 60*60});
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


// User login
const login = async(req,res)=>{
    try{
        // check mail and password
        const {emailId, password} = req.body;
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        // find user from database
        const user = await User.findOne({emailId});

        // match the passwords
        const match = await bcrypt.compare(password,user.password);
        if(!match)
            throw new Error("Invalid Credentials");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        // Assign jwt token to the user
        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


// User logout
const logout = async(req, res)=>{
    try{
        // Extract token
        const {token} = req.cookies;
        const payload = jwt.decode(token);      // extract payload from jwt token for extracting data

        // Add token to the redis blocklist
        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
        
        // Clear Cookies
        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logged Out Succesfully");
    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


// Admin registration
const adminRegister = async(req,res)=>{
    try{
        validate(req.body); 
        const {firstName, emailId, password}  = req.body;
        req.body.password = await bcrypt.hash(password, 10);
    
        const user =  await User.create(req.body);
        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


// User-Profile deletion
const deleteProfile = async(req,res)=>{
    try{
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);       // Delete userSchema
        res.status(200).send("Deleted Successfully");
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {register, login, logout, adminRegister, deleteProfile};