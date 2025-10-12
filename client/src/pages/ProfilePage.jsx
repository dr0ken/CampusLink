import { Mail, KeyRound, Users, User, BriefcaseBusiness, Building2  } from "lucide-react";
import { useHttp } from "../hooks/http.hook";
import { useForm } from "react-hook-form";
import { useEffect, useContext, use } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../components/Loading";

const ProfilePage = () => {

  const {loading, error, clearError, request} = useHttp()

  const getUserData = async () => {
    try {      
      return await request(
        '/api/profile/me',
        'GET',
        null, 
        {"x-auth-token": auth.token})
    } 
    catch (e) {
      console.log(e.message)
      return null
    }
  }

  const query = useQuery({ queryKey: ['profile'], queryFn: getUserData })

  const {register, handleSubmit, watch} = useForm()

  const auth = useContext(AuthContext)

  const profileEditHandler = async (data) => 
  {

  }

  if (query.status == 'pending') return <Loading />

  const userData = query.data

  let role;

  if (userData.role == "student") role = "Студент"
  else if (userData.profile.employerType == "partner") role = "Партнер"
  else role = "Преподаватель"

  return (
    <div className="flex grow max-w-[100vw] items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">
            {userData.profile.name}
            <span className="badge badge-primary">{role}</span>
          </h2>
          <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content size-32 rounded-full">
                <span className="text-6xl">{userData.profile.name[0]}</span>
              </div>
          </div>

          <div className="w-full flex gap-10">
            
            <form onSubmit={handleSubmit(profileEditHandler)} className="items-center w-full">
              {/* name */}
              <label className="floating-label grow input input-bordered my-1 w-full validator">
                <span>Имя</span>
                <User className="h-[1em] opacity-50" />
                <input 
                  {...register("name")}
                  type="text" 
                  defaultValue={userData.profile.name}
                  required
                  minLength={4}
                  placeholder="Имя" 
                />
              </label>
              { userData.role == "student" && (
                <label className="floating-label input input-bordered my-1 w-full validator">
                  <span>Академическая группа</span>
                  <Users className="h-[1em] opacity-50" />
                  <input 
                    {...register("group")}
                    type="text" 
                    required
                    defaultValue={userData.profile.group}
                    placeholder="Академическая группа" 
                  />
                </label>
              )}
              {(userData.role == "employer" && userData.profile.employerType == "partner") && (
                  <div className="flex flex-col w-full">
                    {/* organization */}
                    <label className="floating-label input input-bordered my-1 w-full validator">
                      <span>Организация</span>
                      <Building2 className="h-[1em] opacity-50" />
                      <input 
                        {...register("organization")}
                        type="text" 
                        defaultValue={userData.profile.organization}
                        required
                        placeholder="Название организации" 
                      />
                    </label>
                    {/* job */}
                    <label className="floating-label input input-bordered my-1 w-full validator">
                      <span>Должность</span>
                      <BriefcaseBusiness className="h-[1em] opacity-50" />
                      <input 
                        {...register("job")}
                        defaultValue={userData.profile.job}
                        type="text" 
                        required
                        placeholder="Должность" 
                      />
                    </label>
                  </div>
                )}
              {/* email */}
              <label className="floating-label grow input input-bordered my-1 w-full validator">
                <span>Почта</span>
                <Mail className="h-[1em] opacity-50" />
                <input 
                {...register("email")}
                type="email" 
                required
                placeholder="Почта" 
                defaultValue={userData.email}
                autoComplete="off"/>
              </label>

              <div className="card-actions justify-around w-full my-2">
                <button className="btn btn-primary" type="submit">Сохранить</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
export default ProfilePage;