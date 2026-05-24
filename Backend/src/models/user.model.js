import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    contact:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    fullname:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer"
    }
})

const usermodel =  mongoose.model('users',userSchema)

export default usermodel