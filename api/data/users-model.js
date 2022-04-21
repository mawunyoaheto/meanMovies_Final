const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:3
    },
    blocked:{
        type:String,
        default:"No"
    }

});

mongoose.model(process.env.USERS_MODEL,UsersSchema,process.env.USERS_COLLECTION);