import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import authrouter from './Routes/auth.route.js'

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use('/api/auth',authrouter)
export default app