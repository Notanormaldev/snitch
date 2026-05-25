import { Router } from "express";
import { validatonlogin, validatonregister } from "../validator/auth.validator.js";
import authController from "../controllers/auth.controller.js";



const authrouter =Router()
authrouter.post('/register',validatonregister,authController.register)
authrouter.post('/login',validatonlogin,authController.login)

export default authrouter