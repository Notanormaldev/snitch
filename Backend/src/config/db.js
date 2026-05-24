import mongoose, { connect } from "mongoose";
import config from "./config.js";


export default  function connecttodb(){
  mongoose.connect(config.MONGOURI).then(()=>{
        console.log("MONGODB Connected sucessfully");
    })
}