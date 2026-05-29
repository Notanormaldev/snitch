import { createSlice } from "@reduxjs/toolkit";


const prodcutSlice =createSlice({
    name:"product",
    initialState:{
        sellerproducts:[]
    },
    reducers:{
        setSellerprodcuts:(state,action)=>{
            state.sellerproducts=action.payload
        }
    }
})

export const {sellerproducts}=prodcutSlice.actions
export default prodcutSlice.reducer