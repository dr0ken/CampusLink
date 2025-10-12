import { useForm } from "react-hook-form";
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
      navigate('/vacancies')
      return
    }
  }, [auth])

  const {loading, error, clearError, request} = useHttp()

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error])

  const {register, handleSubmit, watch} = useForm()

  const loginHandler = async (data) => {
    try {
      const userData = await request(
        '/api/auth/login',
        'POST',
        data)
      auth.login(userData.token, userData.userId)
    }
    catch (e) {}
  } 

  return (
    <div className="flex justify-center items-center flex-1">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Вход</h2>
          <form onSubmit={handleSubmit(loginHandler)} className="items-center  w-full">
            <label className="grow input input-bordered my-1 w-full validator">
              <Mail className="h-[1em] opacity-50" />
              <input 
              {...register("email")}
              type="email" 
              required
              placeholder="Почта" 
              autoComplete="on"/>
            </label>
            <label className="grow input input-bordered my-1 w-full validator">
              <KeyRound className="h-[1em] opacity-50" />
              <input 
                {...register("password")}
                type="password" 
                required 
                placeholder="Пароль"
                autoComplete="on"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Пароль должен содержать не менее 8 символов, включая 1 цифру, 1 строчную и 1 заглавную букву" />
            </label>
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