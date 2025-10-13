import {Routes, Route, Navigate} from "react-router"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import VacanciesPage from "./pages/VacanciesPage"
import { useAuth } from "./hooks/auth.hook"
import { AuthContext } from "./context/AuthContext"
import ProtectedRoutes from "./pages/ProtectedRoutes"
import { Loading } from "./components/Loading"
import { Navbar } from "./components/Navbar"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import VacancyPage from "./pages/VacancyPage"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const App = () => {

  const {token, login, logout, userId, isLoading} = useAuth()
  const isAuthenticated = !!token

  const queryClient = new QueryClient()

  if (isLoading) {
    return <Loading />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{token, login, logout, userId, isAuthenticated}}>
        <div className="bg-radial from-base-100 to-base-300 flex flex-col min-h-screen font-display">
          {isAuthenticated && <Navbar />}
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/login" exact element={<LoginPage/>} />
            <Route path="/register" exact element={<RegisterPage/>} />
            <Route element={<ProtectedRoutes/>}>
              <Route path="/profile" exact element={<ProfilePage/>} />
              <Route path="/vacancies" exact element={<VacanciesPage/>} />
              <Route path="/vacancy/:id" element={<VacancyPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </div>
      </AuthContext.Provider>
    </QueryClientProvider>
    
  );
}

export default App
