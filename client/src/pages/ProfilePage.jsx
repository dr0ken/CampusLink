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
  
  const {data, isPending} = useGetProfile();
  const {loading, handleEditProfile} = useEditProfile();

  if (isPending || !data) return <Loading />

  return (
    <div className="flex grow max-w-[100vw] items-center justify-center p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">{data.profile.name}</h2>
          
          <Avatar user={data} size={'6em'}/>
          
          <div className="w-full flex gap-10">
            
            <form onSubmit={handleSubmit(handleEditProfile)} className="items-center w-full">
              {/* name */}
              <label className="floating-label grow input input-bordered my-1 w-full validator">
                <span>Имя</span>
                <User className="h-[1em] opacity-50" />
                <input 
                  {...register("name")}
                  type="text" 
                  defaultValue={data.profile.name}
                  required
                  minLength={4}
                  placeholder="Имя" 
                />
              </label>
              { data.role == "student" && (
                <label className="floating-label input input-bordered my-1 w-full validator">
                  <span>Академическая группа</span>
                  <Users className="h-[1em] opacity-50" />
                  <input 
                    {...register("group")}
                    type="text" 
                    required
                    defaultValue={data.profile.group}
                    placeholder="Академическая группа" 
                  />
                </label>
              )}
              {(data.role == "employer" && data.profile.employerType == "partner") && (
                  <div className="flex flex-col w-full">
                    {/* organization */}
                    <label className="floating-label input input-bordered my-1 w-full validator">
                      <span>Организация</span>
                      <Building2 className="h-[1em] opacity-50" />
                      <input 
                        {...register("organization")}
                        type="text" 
                        defaultValue={query.data.profile.organization}
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
                        defaultValue={query.data.profile.job}
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
                defaultValue={data.email}
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