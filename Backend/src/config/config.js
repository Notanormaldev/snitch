import { configDotenv } from "dotenv";
configDotenv()


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in .env file");
}
if(!process.env.JWT){   
    throw new Error("JWT is not defined in .env file");
}



export default config={
    MONGOURI:process.env.MONGO_URI ,
    JWT:process.env.JWT
}