import { useNavigate } from "react-router";
import { useHttp } from "../hooks/http.hook";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Mail, KeyRound, Users, User, BriefcaseBusiness, Building2 } from "lucide-react";
import {useForm} from "react-hook-form"

const RegisterPage = () => {

  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/')
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


  const registerHandler = async (data) => {
    console.log(JSON.stringify(data))
    try {
      
      await request(
        '/api/auth/register',
        'POST',
        data)
      const response = await request(
        '/api/auth/login',
        'POST',
        data)
      auth.login(response.token, response.userId)
    }
    catch (error) {}
  }

  const role = watch("role")
  const employerType = watch("employerType") || "teacher"

  return (
    <div className="flex justify-center items-center flex-1">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Регистрация</h2>
          <form onSubmit={handleSubmit(registerHandler)} className="items-center  w-full">
            <div className="join my-1 w-full">
              <input 
                {...register("role")}
                className="join-item btn w-[50%]"
                type="radio"
                value="student"
                aria-label="Студент" 
                defaultChecked />
              <input 
                {...register("role")}
                className="join-item btn w-[50%]"
                type="radio"
                value="employer"
                aria-label="Работодатель" />
            </div>
            <label className="grow input input-bordered my-1 w-full validator">
              <User className="h-[1em] opacity-50" />
              <input 
                {...register("name")}
                type="text" 
                required
                placeholder="Имя" 
              />
            </label>
            {
              role == "student" && (
                <div className="flex flex-col w-full">
                  <label className="input input-bordered my-1 w-full validator">
                    <Users className="h-[1em] opacity-50" />
                    <input 
                      {...register("group")}
                      type="text" 
                      required
                      placeholder="Академическая группа" 
                    />
                  </label>
                </div>
              )
              
            }
            {
              role == "employer" && (
                <div className="flex flex-col w-full">
                  <div className="join my-1 w-full">
                    <input 
                      {...register("employerType")}
                      className="join-item btn w-[50%]"
                      type="radio"
                      value="teacher"
                      aria-label="Преподаватель" 
                      defaultChecked={employerType == "teacher"}/>
                    <input 
                      {...register("employerType")}
                      className="join-item btn w-[50%]"
                      type="radio"
                      value="partner"
                      aria-label="Внешний партнер" 
                      defaultChecked={employerType == "partner"}
                      />
                  </div>
                </div>
              )
            }
            {
              (role == "employer" && employerType == "partner") && (
                <div className="flex flex-col w-full">
                  <label className="input input-bordered my-1 w-full validator">
                    <Building2 className="h-[1em] opacity-50" />
                    <input 
                      {...register("organization")}
                      type="text" 
                      required
                      placeholder="Название организации" 
                    />
                  </label>
                  <label className="input input-bordered my-1 w-full validator">
                    <BriefcaseBusiness className="h-[1em] opacity-50" />
                    <input 
                      {...register("job")}
                      type="text" 
                      required
                      placeholder="Должность" 
                    />
                  </label>
                </div>
              )
            }
            <label className="grow input input-bordered my-1 w-full validator">
              <Mail className="h-[1em] opacity-50" />
              <input 
                {...register("email")}
                type="email" 
                required
                placeholder="Почта" 
                autoComplete="on"
              />
            </label>
            <label className="grow input input-bordered my-1 w-full validator">
              <KeyRound className="h-[1em] opacity-50" />
              <input 
                {...register("password")}
                type="password" 
                required 
                placeholder="Пароль"
                autoComplete="on"
                // minLength="8" 
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
            </label>
            <div className="card-actions justify-around w-full my-2">
              <button 
                className="btn btn-primary grow" 
                disabled={loading}
                type="submit">
                  Зарегистрироваться</button>
            </div>
          </form>
          <p>Уже есть аккаунт? <button className="link link-primary" onClick={ () => {navigate("/login")}}>Вход</button></p>
        </div>
        
        
      </div>        
    </div>
  )
}
export default RegisterPage