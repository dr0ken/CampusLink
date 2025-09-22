import { useState } from "react";
import { useNavigate } from "react-router";
import { useHttp } from "../hooks/http.hook";

const AuthPage = () => {

  
  
  const [form, setForm] = useState({
    email: '', password: ''
  })

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const {loading, error, request} = useHttp()

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-300">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Auth Page</h2>
          <div className="items-center my-2 w-full">
            <input 
              type="text" 
              className="grow input input-bordered my-1 w-full" 
              placeholder="Email" 
              name="email"
              onChange={changeHandler}/>
            <input 
              type="password"
              className="grow input input-bordered my-1 w-full"
              placeholder="Password"
              name="password"
              onChange={changeHandler}/>
          </div>
          <div className="card-actions justify-around w-full">
            <button className="btn btn-primary flex-grow">Login</button>
            <button className="btn btn-accent flex-grow" onClick={registerHandler} disabled={loading}>Register</button>
          </div>
        </div>
        
      </div>        
    </div>
  )
}
export default AuthPage