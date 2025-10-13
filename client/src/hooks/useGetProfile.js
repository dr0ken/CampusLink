import { useHttp } from "./http.hook";
import { useEffect  } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useGetProfile = () => 
{
  const {error, clearError, request} = useHttp()

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
        null)
    } 
    catch (e) {
      console.log(e.message)
      return null
    }
  }

  return useQuery({ queryKey: ['profile'], queryFn: getUserProfile })
}