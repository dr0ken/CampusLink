import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const auth = useContext(AuthContext)

  const request = useCallback(async (url, method="GET", body=null, headers={}) => {
    setLoading(true)
    try {

      if (body) {
        body = JSON.stringify(body)
        headers["Content-Type"] = "Application/JSON"
      }
      headers["x-auth-token"] = auth.token
      const response = await fetch(url, { method, body, headers })
      const data = await response.json()

      if (response.status == 401) {
        auth.logout()
        throw new Error('Пожалуйста, авторизуйтесь заново')
      }

      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так')
      }

      setLoading(false)

      return data
    }
    catch (e) 
    {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])
  
  const clearError = useCallback(() => setError(null), [error]) 

  return {loading, request, error, clearError}
}