import { toast } from "react-hot-toast";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoutes = () => {

  const {isAuthenticated, isLoading} = useContext(AuthContext)

  if (isLoading) return <div>Loading...</div>
  return (
    isAuthenticated ? <Outlet/> : <Navigate to='/auth'/>
  );
}

export default ProtectedRoutes