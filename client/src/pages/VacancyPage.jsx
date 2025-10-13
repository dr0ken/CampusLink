import { useHttp } from "../hooks/http.hook";
import { useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loading } from "../components/Loading";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router";
import { Avatar } from "../components/Avatar";

const VacancyPage = () => {

  const auth = useContext(AuthContext)

  const {id} = useParams()

  const {loading, error, clearError, request} = useHttp()

  useEffect(() => {
      if (error) {
        toast.error(error)
        clearError()
      }
    }, [error])

  const getVacancy = async () => {
    try {      
      return await request(
        `/api/vacancy/get/${id}`,
        'GET',
        null, 
        {"x-auth-token": auth.token})
    } 
    catch (e) {
      console.log(e.message)
      toast(e.message)
      return null
    }
  }

  const queryClient = useQueryClient()

  const {data:vacancy, isPending} = useQuery({ queryKey: ['vacancy', id], queryFn: getVacancy })

  if (isPending) return <Loading />

  return (
    <div className="p-4 flex flex-col-reverse md:flex-row justify-center items-center grow gap-4">
      <div className="card bg-base-100 shadow-xl items-center
                      flex flex-row justify-between p-4 
                      w-full md:w-[32em] lg:w-[48em]
                      h-[24em]">    
        <div className="flex flex-col justify-start grow h-full">
          <h2
            className="card-title text-3xl text-neutral text-center self-center md:self-auto">
              {vacancy.name}
          </h2>
          <h2 className="text-xl text-neutral self-center md:self-auto">Мест: {vacancy.studentCount} </h2>
          <p className="whitespace-pre-line mt-4">{vacancy.description}</p>
          <button className="btn btn-primary mt-auto w-full md:w-48">Откликнуться</button>
        </div>
        
      </div>
      <div className="card bg-base-100 shadow-xl 
                      justify-center items-center 
                      flex p-4 gap-4
                      h-auto w-auto">
        <h1 className="card-title text-primary text-2xl">{vacancy.creator.profile.name}</h1>
        <Avatar user={vacancy.creator} size='6em'/>
      </div>
    </div>
    
  )
}
export default VacancyPage