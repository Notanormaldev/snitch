import config from "../config/config.js"
import usermodel from "../models/user.model.js"
import jwt from "jsonwebtoken"



async function tokenresponse(user,res,msg){
   const token = jwt.sign({
    id:user._id,
   },config.JWT)

   res.cookie('token',token)
  
   return res.status(201).json({
    msg,
    success:true,
    user:user
   })

}



async function register(req,res){
  const {email,contact,fullname,password,isseller}=req.body


  try {
    const existuser = await usermodel.findOne({
        $or:[{email},{contact}]
    })

    if(existuser){
        return res.status(400).json({
            msg:'user with this email or contact already exist'
        })
    }


    const user =await usermodel.create({
        email,contact,fullname,password,isseller
    })

  await tokenresponse(user,res,msg="User register successfully");

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        msg:"server error"
    })
    
  }
  

}
async function login(req,res){

}




export default {
    register,login
}