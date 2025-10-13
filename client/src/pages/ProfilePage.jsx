import { Mail, KeyRound, Users, User, BriefcaseBusiness, Building2  } from "lucide-react";
import { useHttp } from "../hooks/http.hook";
import { useForm } from "react-hook-form";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { toast } from "react-hot-toast";
import { Avatar  } from "../components/Avatar";
import { useGetProfile } from "../hooks/useGetProfile";
import { useEditProfile } from "../hooks/useEditProfile";

const ProfilePage = () => {

  const {register, handleSubmit} = useForm()
  
  const {data: user, isPending} = useGetProfile();
  const {loading, handleEditProfile} = useEditProfile();

  if (isPending || !user) return <Loading />

  return (
    <div className="flex grow max-w-[100vw] items-center justify-center p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">{user.profile.name}</h2>
          
          <Avatar user={user} size={'6em'}/>
          
          <div className="w-full flex gap-10">
            
            <form onSubmit={handleSubmit(handleEditProfile)} className="items-center w-full">
              {/* name */}
              <label className="floating-label grow input input-bordered my-1 w-full validator">
                <span>Имя</span>
                <User className="h-[1em] opacity-50" />
                <input 
                  {...register("name")}
                  type="text" 
                  defaultValue={user.profile.name}
                  required
                  minLength={4}
                  placeholder="Имя" 
                />
              </label>
              { user.role == "student" && (
                <label className="floating-label input input-bordered my-1 w-full validator">
                  <span>Академическая группа</span>
                  <Users className="h-[1em] opacity-50" />
                  <input 
                    {...register("group")}
                    type="text" 
                    required
                    defaultValue={user.profile.group}
                    placeholder="Академическая группа" 
                  />
                </label>
              )}
              {(user.role == "employer" && user.profile.employerType == "partner") && (
                  <div className="flex flex-col w-full">
                    {/* organization */}
                    <label className="floating-label input input-bordered my-1 w-full validator">
                      <span>Организация</span>
                      <Building2 className="h-[1em] opacity-50" />
                      <input 
                        {...register("organization")}
                        type="text" 
                        defaultValue={user.profile.organization}
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
                        defaultValue={user.profile.job}
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
                defaultValue={user.email}
                autoComplete="off"/>
              </label>

              <div className="card-actions justify-around w-full my-2">
                <button className="btn btn-primary" type="submit" disabled={loading}>Сохранить</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
export default ProfilePage;