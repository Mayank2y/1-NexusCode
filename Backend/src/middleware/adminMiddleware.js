const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const redisClient = require('../config/redis');

const adminMiddleware = async (req,res,next)=>{
    try{
        // validate token  
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token Doesn't exist");
        }

        // verify token
        const decoded =  jwt.verify(token,process.env.JWT_KEY);
        const {_id} = decoded;
        if(!_id){
            throw new Error("Invalid token");
        }

        // Search user in database 
        const result = await User.findById(_id);

        if(decoded.role!='admin')
            throw new Error("Invalid Token");

        if(!result){
            throw new Error("User Doesn't exist");
        }

        // Check if present in redis blocklist
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if(IsBlocked)
            throw new Error("Invalid Token");
        req.result = result;
        next();
    }
    catch(err){
        res.status(401).send("Error: "+ err.message)
    }
}

module.exports = adminMiddleware;