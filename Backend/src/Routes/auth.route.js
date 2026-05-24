import { Router } from "express";
import { validatonregister } from "../validator/auth.validator.js";
import authController from "../controllers/auth.controller.js";



const authrouter =Router()
authrouter.post('/register',validatonregister,authController.register)


export default authrouter