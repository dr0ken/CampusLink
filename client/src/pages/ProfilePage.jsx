import { Mail, KeyRound, Users, User, BriefcaseBusiness, Building2  } from "lucide-react";
import { useHttp } from "../hooks/http.hook";
import { useForm } from "react-hook-form";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loading } from "../components/Loading";
import { toast } from "react-hot-toast";

const ProfilePage = () => {

  const {loading, error, clearError, request} = useHttp()

  useEffect(() => {
      if (error) {
        toast.error(error)
        clearError()
      }
    }, [error])

  const getUserProfile = async () => {
    try {      
      return await request(
        '/api/profile/me',
        'GET',
        null, 
        {"x-auth-token": auth.token})
    } 
    catch (e) {
      toast(e.message)
      return null
    }
  }
  const editUserProfile = async (data) => 
  {
    try {
      const response = await request(
        '/api/profile/edit',
        'PUT',
        data,
        {"x-auth-token": auth.token})
      return response
    }
    catch (error) {
      toast(e.message)
      return null
    }
  }

  const queryClient = useQueryClient()

  const query = useQuery({ queryKey: ['profile'], queryFn: getUserProfile })

  const mutation = useMutation({
    mutationFn: editUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
    },
  })

  const {register, handleSubmit} = useForm()

  const auth = useContext(AuthContext)

  const profileEditHandler = (data) => {
    mutation.mutate(data)
  }
  

  if (query.isPending) return <Loading />

  let role;

  if (query.data.role == "student") role = "Студент"
  else if (query.data.profile.employerType == "partner") role = "Партнер"
  else role = "Преподаватель"

  return (
    <div className="flex grow max-w-[100vw] items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">{query.data.profile.name}</h2>
          
          <div className="avatar avatar-placeholder flex-col items-center">
              <div className="bg-neutral text-neutral-content size-32 rounded-full">
                <span className="text-6xl">{query.data.profile.name[0]}</span>
              </div>
              <span className="badge badge-primary transform -translate-y-1/2">{role}</span>
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
                  defaultValue={query.data.profile.name}
                  required
                  minLength={4}
                  placeholder="Имя" 
                />
              </label>
              { query.data.role == "student" && (
                <label className="floating-label input input-bordered my-1 w-full validator">
                  <span>Академическая группа</span>
                  <Users className="h-[1em] opacity-50" />
                  <input 
                    {...register("group")}
                    type="text" 
                    required
                    defaultValue={query.data.profile.group}
                    placeholder="Академическая группа" 
                  />
                </label>
              )}
              {(query.data.role == "employer" && query.data.profile.employerType == "partner") && (
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
                defaultValue={query.data.email}
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