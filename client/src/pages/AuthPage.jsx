import { useState } from "react";
import { useNavigate } from "react-router";
import { useHttp } from "../hooks/http.hook";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AuthPage = () => {

  const auth = useContext(AuthContext)

  const [form, setForm] = useState({
    email: '', password: ''
  })

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const {loading, error, clearError, request} = useHttp()

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error])

  const registerHandler = async () => {
    try {
      const data = await request(
        '/api/auth/register',
        'POST',
        {...form})
      console.log('DATA: ', data)
    }
    catch (e) {}
  }

  const loginHandler = async () => {
    try {
      const data = await request(
        '/api/auth/login',
        'POST',
        {...form})
      auth.login(data.token, data.userId)
      console.log(auth.isAuthenticated())
    }
    catch (e) {}
  } 

  return (
    <div className="flex justify-center items-center flex-1">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Auth Page</h2>
          <form className="items-center my-2 w-full">
            <input 
              type="text" 
              className="grow input input-bordered my-1 w-full" 
              placeholder="Email" 
              name="email"
              onChange={changeHandler}
              autoComplete="on"/>
            <input 
              type="password"
              className="grow input input-bordered my-1 w-full"
              placeholder="Password"
              name="password"
              onChange={changeHandler}
              autoComplete="on"/>
          </form>
          <div className="card-actions justify-around w-full">
            <button 
              className="btn btn-primary flex-grow"
              onClick={loginHandler}
              disabled={loading}>
                Login</button>
            <button 
              className="btn btn-accent flex-grow" 
              onClick={registerHandler} 
              disabled={loading}>
                Register</button>
          </div>
        </div>
        
      </div>        
    </div>
  )
}
export default AuthPage