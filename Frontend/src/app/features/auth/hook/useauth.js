import { useDispatch, useSelector } from "react-redux"
import { getme, login, register } from "../services/auth.api"
import { seterror, setloading, setuser } from "../auth.slice"

export const useauth = () => {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)
 
    async function handleregister({email,contact,fullname,password,isseller=false})
    { 
      dispatch(setloading(true))
      dispatch(seterror(null))
      try {
        const data = await register({email,password,contact,fullname,isseller})
        dispatch(setuser(data.user))
        dispatch(setloading(false))
        return { success: true, data }
      } catch (err) {
        console.log("Registration error:", err)
        dispatch(seterror(err))
        dispatch(setloading(false))
        throw err
      }   
    }

    async function handlelogin({email,contact,password})
    {
      dispatch(setloading(true))
      dispatch(seterror(null))
      try {
        const data = await login({email,password,contact})
        dispatch(setuser(data.user))
        dispatch(setloading(false))
        return { success: true, data }
      } catch (err) {
        console.log("Login error:", err)
        dispatch(seterror(err))
        dispatch(setloading(false))
        throw err
      }
    }

    async function handlegetme()
    {
      dispatch(setloading(true))
      dispatch(seterror(null))
      try {
        const data = await getme()
        dispatch(setuser(data.user))
        dispatch(setloading(false))
        return { success: true, data }
      } catch (err) {
        console.log("GetMe error:", err)
        dispatch(seterror(err))
        dispatch(setloading(false))
        throw err
      }
    }

    return {
        user,
        loading,
        error,
        handleregister,
        handlelogin,
        handlegetme
    }
}
