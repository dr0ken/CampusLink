import {Routes, Route, Navigate} from "react-router"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import AuthorizedPage from "./pages/AuthorizedPage"
import { useAuth } from "./hooks/auth.hook"
import { AuthContext } from "./context/AuthContext"
import ProtectedRoutes from "./pages/ProtectedRoutes"
import { Loader } from "./components/Loader"
import { Navbar } from "./components/Navbar"
import RegisterPage from "./pages/RegisterPage"

const App = () => {

  const {token, login, logout, userId, isLoading} = useAuth()
  const isAuthenticated = !!token

  if (isLoading) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{token, login, logout, userId, isAuthenticated}}>
      <div className="bg-base-300 flex flex-col min-h-screen">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" exact element={<LoginPage/>} />
          <Route path="/register" exact element={<RegisterPage/>} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/authorized" exact element={<AuthorizedPage/>} />
          </Route>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App
