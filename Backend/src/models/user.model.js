import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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
        require:true,
        select:false
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


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return 


  const hash =await bcrypt.hash(this.password,10)
    this.password=hash
})

userSchema.methods.comparePassword =async function(password){
    return await bcrypt.compare(password,this.password)
}

const usermodel =  mongoose.model('users',userSchema)

export default usermodel