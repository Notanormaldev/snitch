import axios from 'axios'


const productapi=axios.create({
    baseURL:"/api/product",
    withCredentials:true
})


export async function createproduct({formdata}){
    try {
        const res = await productapi.post('/createproduct',{formdata})
        return res.data
    } catch (error) {
        console.log("Api",error);
        
    }
}
export async function getsellerproduct(){
       try {
        const res = await productapi.post('/getproduct/seller',{formdata})
        return res.data
    } catch (error) {
        console.log("Api",error);
        
    }
}