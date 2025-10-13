import { useHttp } from "../hooks/http.hook";
import { useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loading } from "../components/Loading";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { VacancyCard } from "../components/VacancyCard";

const VacanciesPage = () => {

  const auth = useContext(AuthContext)

  const {loading, error, clearError, request} = useHttp()

  useEffect(() => {
      if (error) {
        toast.error(error)
        clearError()
      }
    }, [error])

  const getVacancies = async () => {
    try {      
      return await request(
        '/api/vacancy/getAll',
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

  const {data:vacancies, isPending, isSuccess} = useQuery({ queryKey: ['vacancies'], queryFn: getVacancies })

  return (
    <div className="flex flex-col items-center h-full px-4 grow">
      <h1 className="my-5 text-5xl font-bold text-primary text-center">Вакансии</h1>
      {isPending && (<Loading />)}
      {isSuccess && vacancies && vacancies.length > 0 && (
        <div className="flex flex-col items-center gap-4 w-full overflow-auto grow">
          {vacancies.map(vacancy => (
           <VacancyCard key={vacancy._id} vacancy={vacancy}/>
          ))}
        </div>
      )}
    </div>
  )
}
export default VacanciesPage