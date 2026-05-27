import { configDotenv } from "dotenv";
configDotenv()


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in .env file");
}
if(!process.env.JWT){   
    throw new Error("JWT is not defined in .env file");
}


 const config={
    MONGOURI:process.env.MONGO_URI ,
    JWT:process.env.JWT,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    BREVO_API_KEY:process.env.BREVO_API_KEY,
    GOOGLE_EMAIL:process.env.GOOGLE_EMAIL,
    GOOGLE_APP_PASS:process.env.GOOGLE_APP_PASS,
    NODE_ENVIRONMENT:process.env.NODE_ENVIRONMENT
}


export default config