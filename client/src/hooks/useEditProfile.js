import { useHttp } from "./http.hook";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useEditProfile = () => 
{
  const {loading, error, clearError, request} = useHttp()

  useEffect(() => {
      if (error) {
        toast.error(error)
        clearError()
      }
    }, [error])

  const editUserProfile = async (data) => 
    {
      try {
        const response = await request(
          '/api/profile/edit',
          'PUT',
          data)
        return response
      }
      catch (error) {
        toast(e.message)
        return null
      }
    }

    const queryClient = useQueryClient()

    const mutation = useMutation({
      mutationFn: editUserProfile,
      onSuccess: (data) => {
        queryClient.setQueryData(['profile'], data)
      }
    })

    const handleEditProfile = (data) => {
      mutation.mutate(data)
    }
  
    return {loading, handleEditProfile}
}