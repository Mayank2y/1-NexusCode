const validator = require("validator");

const validate= (data)=>{
    const mandatoryFields = ["firstName", "emailId", "password"];
    const isAllowed = mandatoryFields.every((k)=> Object.keys(data).includes(k));

    if(!isAllowed)
        throw new Error("Field(s) missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid email");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Make a Strong Password");

    if(!(data.firstName.length>=3 && data.firstName.length<=20))
        throw new Error("Name should have atleast 3 char and atmost 20 char");
    
}

module.exports = validate;