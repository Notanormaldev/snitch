import config from "../config/config.js"
import usermodel from "../models/user.model.js"
import jwt from "jsonwebtoken"



async function tokenresponse(user,res){
   const token = jwt.sign({
    id:user._id,
   },config.JWT)

   res.cookie('token',token)


}



async function register(req,res){
  const {email,contact,fullname,password}=req.body


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
        email,contact,fullname,password
    })

  await tokenresponse(user,res);


   return res.status(201).json({
    msg:"user register",
    user:user
   })







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