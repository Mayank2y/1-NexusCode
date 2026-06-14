const express = require('express');
const authRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile} = require("../controllers/userAuthent");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Register
authRouter.post('/register',register);

// Login
authRouter.post('/login', login);

// Logout
authRouter.post('/logout', userMiddleware, logout);

authRouter.post('/admin/register', adminMiddleware, adminRegister);

// Delete profile
authRouter.delete('/deleteProfile',userMiddleware, deleteProfile);

// Get Profile
authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id:req.result._id,
        role:req.result.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})

module.exports = authRouter;