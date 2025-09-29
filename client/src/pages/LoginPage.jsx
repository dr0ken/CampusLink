import { useState } from "react";
import { useNavigate } from "react-router";
import { useHttp } from "../hooks/http.hook";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Mail, KeyRound } from "lucide-react";

const LoginPage = () => {

  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/')
      return
    }
  }, [auth])

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

  const loginHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await request(
        '/api/auth/login',
        'POST',
        {...form})
      auth.login(data.token, data.userId)
    }
    catch (e) {}
  } 


  return (
    <div className="flex justify-center items-center flex-1">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Вход</h2>
          <form onSubmit={loginHandler} className="items-center  w-full">
            <label className="grow input input-bordered my-1 w-full validator">
              <Mail className="h-[1em] opacity-50" />
              <input 
              type="email" 
              required
              placeholder="Почта" 
              name="email"
              onChange={changeHandler}
              autoComplete="on"/>
            </label>
            <label className="grow input input-bordered my-1 w-full validator">
              <KeyRound className="h-[1em] opacity-50" />
              <input 
                type="password" 
                required 
                placeholder="Пароль"
                name="password"
                // minLength="8" 
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                onChange={changeHandler}
                autoComplete="on"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br/>At least one number
              <br/>At least one lowercase letter
              <br/>At least one uppercase letter
            </p>
            <div className="card-actions justify-around w-full my-2">
              <button 
                className="btn btn-primary grow"
                disabled={loading}
                type="submit">
                  Войти</button>
            </div>
          </form>
          <p>Нет аккаунта? <button className="link link-primary" onClick={ () => {navigate("/register")}}>Регистрация</button></p>
        </div>
      </div>        
    </div>
  )
}
export default LoginPage