import app from "./src/app.js";
import connecttodb from "./src/config/db.js";


connecttodb()
const PORT =process.env.PORT || 3000
app.listen(PORT ,()=>{
    console.log(`Running on ${PORT}`);
    
})