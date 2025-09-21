import { toast } from "react-hot-toast";
import { userContext } from "./ContextProvider"
import { useContext } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({children}) => {

  const {authenticated} = useContext(userContext)

  if (!authenticated) {
    toast.error("Not authenticated!")
    return <Navigate to="/auth"/>
  }

  return children;
}

export default ProtectedRoute